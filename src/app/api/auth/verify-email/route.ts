export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter, FROM } from "@/lib/mailer";

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

  // Send welcome + trial started email (non-fatal)
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com";
    const firstName = (user.name ?? "there").split(" ")[0];
    const trialEnd = user.trialEndsAt
      ? new Date(user.trialEndsAt).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })
      : "in 7 days";
    await transporter.sendMail({
      from: FROM,
      to: user.email,
      subject: `Welcome to Flinchi! Your 7-day free trial has started 🎉`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fffbf5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;padding:32px 24px;background:linear-gradient(135deg,#4F46E5,#818CF8);border-radius:20px;margin-bottom:24px;">
    <div style="font-size:52px;margin-bottom:10px;">🎉</div>
    <h1 style="margin:0;font-size:28px;color:#fff;font-weight:800;">Welcome to Flinchi, ${firstName}!</h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Your 7-day free trial is now active</p>
  </div>

  <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 24px;">
    Hi ${firstName} 👋<br><br>
    Your account is verified and your <strong>7-day full access trial</strong> has started.
    You have access to everything — all 10 learning modules, unlimited daily sessions, gamified adventure mode, and more.
  </p>

  <div style="background:#fff;border:2px solid #818CF8;border-radius:16px;padding:20px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:16px;color:#4F46E5;font-weight:700;">✅ What&apos;s included in your trial:</h2>
    <ul style="margin:0;padding:0 0 0 20px;color:#374151;font-size:15px;line-height:1.9;">
      <li>All 10 learning modules (Math, Time, Spelling + 7 premium)</li>
      <li>Adventure mode — Minecraft, Pokémon, PAW Patrol &amp; more</li>
      <li>Unlimited daily sessions for your children</li>
      <li>Progress tracking &amp; daily parent reports</li>
      <li>Badges, streaks &amp; star rewards</li>
    </ul>
  </div>

  <div style="background:linear-gradient(135deg,#FFF9C4,#FFF3CD);border:2px solid #F9A825;border-radius:16px;padding:16px 20px;margin-bottom:24px;text-align:center;">
    <p style="margin:0;font-size:15px;color:#92400E;font-weight:600;">⏳ Trial ends: <strong>${trialEnd}</strong></p>
    <p style="margin:6px 0 0;font-size:13px;color:#B45309;">After that, you&apos;ll move to the free plan unless you upgrade.</p>
  </div>

  <div style="text-align:center;margin-bottom:32px;">
    <a href="${appUrl}/login" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#818CF8);color:#fff;padding:16px 40px;border-radius:50px;text-decoration:none;font-weight:800;font-size:17px;">
      Start Learning Now 🚀
    </a>
  </div>

  <p style="text-align:center;color:#9ca3af;font-size:12px;margin:0;">
    Sent by Flinchi · <a href="${appUrl}" style="color:#818CF8;">flinchi.com</a><br>
    You're receiving this because you signed up for Flinchi. · <a href="${appUrl}/account" style="color:#9ca3af;">Manage email preferences</a>
  </p>
</div></body></html>`,
    });
  } catch (e) {
    console.error("[verify-email] welcome email failed:", e);
  }

  // Redirect to login with verified flag + email prefilled
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("verified", "true");
  loginUrl.searchParams.set("email", user.email);
  return NextResponse.redirect(loginUrl);
}
