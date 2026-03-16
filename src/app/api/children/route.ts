export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const childSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().min(5).max(10),
  pin: z.string().length(4).regex(/^\d{4}$/),
  avatar: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const parentId = (session.user as any).id;
    const body = await req.json();
    const parsed = childSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    const { name, age, pin, avatar } = parsed.data;
    const pinHash = await hash(pin, 12);
    const child = await prisma.child.create({
      data: { parentId, name, age, pin: pinHash, avatar: avatar ?? "🦊" },
      select: { id: true, name: true, age: true, avatar: true },
    });
    // Init stars + streak
    await prisma.stars.create({ data: { childId: child.id } });
    await prisma.streak.create({ data: { childId: child.id } });
    return NextResponse.json({ child }, { status: 201 });
  } catch (err) {
    console.error("[children POST]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const parentId = (session.user as any).id;
    const children = await prisma.child.findMany({
      where: { parentId },
      select: { id: true, name: true, age: true, avatar: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ children });
  } catch (err) {
    console.error("[children GET]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
