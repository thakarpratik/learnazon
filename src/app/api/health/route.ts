export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  // Safe diagnostic — shows which env vars are SET (not their values)
  return NextResponse.json({
    ok: true,
    env: {
      DATABASE_URL:      !!process.env.DATABASE_URL,
      DIRECT_URL:        !!process.env.DIRECT_URL,
      NEXTAUTH_SECRET:   !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL:      process.env.NEXTAUTH_URL ?? "NOT SET",
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      NODE_ENV:          process.env.NODE_ENV,
    },
  });
}
