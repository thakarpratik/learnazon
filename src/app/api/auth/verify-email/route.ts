export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
  }

  const user = await prisma.user.findUnique({ where: { emailVerifyToken: token } });

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), emailVerifyToken: null },
  });

  // Redirect to login with verified flag + email prefilled
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("verified", "true");
  loginUrl.searchParams.set("email", user.email);
  return NextResponse.redirect(loginUrl);
}
