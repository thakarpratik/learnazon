export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const schema = z.object({ childId: z.string().cuid() });

// Parents can switch into a child's session without needing the PIN
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parentId = (session.user as any).id;
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Verify this child belongs to this parent
    const child = await prisma.child.findUnique({
      where: { id: parsed.data.childId },
      select: {
        id: true, parentId: true, name: true, nickname: true,
        age: true, avatar: true, favoriteColor: true, favoriteAnimal: true,
        favoriteGame: true, learningStyle: true, mascotName: true,
      },
    });

    if (!child || child.parentId !== parentId) {
      return NextResponse.json({ message: "Child not found" }, { status: 404 });
    }

    // Return child data so client can use next-auth signIn with a special token
    return NextResponse.json({ child });
  } catch (err) {
    console.error("[children/switch]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
