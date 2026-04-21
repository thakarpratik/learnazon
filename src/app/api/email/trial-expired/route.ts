export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter, FROM } from "@/lib/mailer";

// Called by Vercel cron daily — finds users whose trial expired in the last 24h and emails them
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com";
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: {
      trialEndsAt: { gte: yesterday, lte: now },
      plan: "FREE",
      emailVerified: { not: null },
    },
    select: { id: true, email: true, name: true },
  });

  let sent = 0;
  for (const user of users) {
    const firstName = (user.name ?? "there").split(" ")[0];
    try {
      await transporter.sendMail({
        from: FROM,
        to: user.email,
        subject: `Your Flinchi trial has ended — here's what happens next`,
        html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fffbf5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;padding:32px 24px;background:linear-gradient(135deg,#6B7280,#9CA3AF);border-radius:20px;margin-bottom:24px;">
    <div style="font-size:52px;margin-bottom:10px;">🔒</div>
    <h1 style="margin:0;font-size:26px;color:#fff;font-weight:800;">Your free trial has ended</h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Your account is now on the free plan</p>
  </div>

  <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
    Hi ${firstName} 👋<br><br>
    Your 7-day free trial has now ended. Your children can still use Flinchi on the <strong>free plan</strong> — 3 core modules and up to 3 sessions per day.
  </p>

  <div style="background:#F9FAFB;border:2px solid #E5E7EB;border-radius:16px;padding:16px 20px;margin-bottom:20px;">
    <h3 style="margin:0 0 10px;font-size:15px;color:#374151;font-weight:700;">📚 Free plan includes:</h3>
    <ul style="margin:0;padding:0 0 0 18px;color:#6B7280;font-size:14px;line-height:1.8;">
      <li>Math, Time &amp; Spelling modules</li>
      <li>Up to 3 sessions per day</li>
      <li>Badges &amp; streaks</li>
    </ul>
  </div>

  <div style="background:linear-gradient(135deg,#EEF2FF,#E0E7FF);border:2px solid #818CF8;border-radius:16px;padding:20px;margin-bottom:24px;">
    <h3 style="margin:0 0 10px;font-size:15px;color:#3730A3;font-weight:700;">🚀 Upgrade to unlock everything:</h3>
    <ul style="margin:0;padding:0 0 0 18px;color:#374151;font-size:14px;line-height:1.8;">
      <li>All 10 modules + monthly new ones</li>
      <li>Adventure mode — Minecraft, Pokémon, PAW Patrol &amp; more</li>
      <li>Unlimited daily sessions</li>
      <li>Detailed weekly progress reports</li>
    </ul>
  </div>

  <div style="text-align:center;margin-bottom:32px;">
    <a href="${appUrl}/pricing" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#818CF8);color:#fff;padding:16px 40px;border-radius:50px;text-decoration:none;font-weight:800;font-size:17px;box-shadow:0 4px 0 #3730A3;">
      See Plans &amp; Pricing →
    </a>
    <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Start again anytime. Cancel anytime.</p>
  </div>

  <p style="text-align:center;color:#9ca3af;font-size:12px;">
    Sent by Flinchi · <a href="${appUrl}" style="color:#818CF8;">flinchi.com</a>
  </p>
</div></body></html>`,
      });
      sent++;
    } catch (e) {
      console.error(`[trial-expired] failed for ${user.email}:`, e);
    }
  }

  return NextResponse.json({ sent, total: users.length });
}
