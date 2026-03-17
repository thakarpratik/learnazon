export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — returns child names/avatars for a given parent email
// Does NOT return PINs or any sensitive data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const parent = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!parent) {
      // Don't reveal whether the email exists — just return empty
      return NextResponse.json({ children: [] });
    }

    const children = await prisma.child.findMany({
      where: { parentId: parent.id },
      select: {
        id: true,
        name: true,
        nickname: true,
        avatar: true,
        favoriteColor: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ children });
  } catch (err) {
    console.error("[child-lookup]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
