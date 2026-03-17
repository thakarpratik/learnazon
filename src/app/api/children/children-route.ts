export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const childSchema = z.object({
  name:           z.string().min(1).max(50),
  nickname:       z.string().max(30).nullable().optional(),
  age:            z.number().int().min(5).max(10),
  pin:            z.string().length(4).regex(/^\d{4}$/, "PIN must be 4 digits"),
  avatar:         z.string().optional(),
  favoriteColor:  z.string().optional(),
  favoriteAnimal: z.string().optional(),
  favoriteGame:   z.string().nullable().optional(),
  learningStyle:  z.string().nullable().optional(),
  mascotName:     z.string().max(30).nullable().optional(),
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

    const { name, nickname, age, pin, avatar, favoriteColor, favoriteAnimal, favoriteGame, learningStyle, mascotName } = parsed.data;

    // ── PIN uniqueness: check within THIS parent's children only ──────────────
    const siblings = await prisma.child.findMany({
      where: { parentId },
      select: { id: true, name: true, pin: true },
    });

    for (const sibling of siblings) {
      const pinMatches = await compare(pin, sibling.pin);
      if (pinMatches) {
        return NextResponse.json(
          { message: `This PIN is already used by ${sibling.name}. Please choose a different PIN for each child.` },
          { status: 409 }
        );
      }
    }
    // ──────────────────────────────────────────────────────────────────────────

    const pinHash = await hash(pin, 12);

    const child = await prisma.child.create({
      data: {
        parentId, name, nickname: nickname ?? null, age,
        pin: pinHash,
        avatar: avatar ?? favoriteAnimal ?? "🌟",
        favoriteColor: favoriteColor ?? "#3D5AFE",
        favoriteAnimal: favoriteAnimal ?? "🌟",
        favoriteGame: favoriteGame ?? null,
        learningStyle: learningStyle ?? "nurture",
        mascotName: mascotName ?? null,
      },
      select: {
        id: true, name: true, nickname: true, age: true, avatar: true,
        favoriteColor: true, favoriteAnimal: true, favoriteGame: true,
        learningStyle: true, mascotName: true,
      },
    });

    await Promise.all([
      prisma.stars.create({ data: { childId: child.id } }),
      prisma.streak.create({ data: { childId: child.id } }),
    ]);

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
      select: {
        id: true, name: true, nickname: true, age: true, avatar: true,
        favoriteColor: true, favoriteAnimal: true, favoriteGame: true,
        learningStyle: true, mascotName: true, createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ children });
  } catch (err) {
    console.error("[children GET]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
