export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter, FROM } from "@/lib/mailer";

// Called by Vercel cron daily — finds users whose trial ends in 1-2 days and emails them
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com";
  const now = new Date();
  const in2days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  // Users whose trial ends within the next 48 hours and haven't upgraded
  const users = await prisma.user.findMany({
    where: {
      trialEndsAt: { gte: now, lte: in2days },
      plan: "FREE",
      emailVerified: { not: null },
    },
    select: { id: true, email: true, name: true, trialEndsAt: true },
  });

  let sent = 0;
  for (const user of users) {
    const firstName = (user.name ?? "there").split(" ")[0];
    const trialEnd = user.trialEndsAt!.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" });
    const hoursLeft = Math.round((user.trialEndsAt!.getTime() - now.getTime()) / 3600000);

    try {
      await transporter.sendMail({
        from: FROM,
        to: user.email,
        subject: `⏳ Your Flinchi trial ends ${hoursLeft < 24 ? "tomorrow" : "in 2 days"} — don't lose access`,
        html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fffbf5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;padding:32px 24px;background:linear-gradient(135deg,#F97316,#FB923C);border-radius:20px;margin-bottom:24px;">
    <div style="font-size:52px;margin-bottom:10px;">⏳</div>
    <h1 style="margin:0;font-size:26px;color:#fff;font-weight:800;">Your trial ends ${hoursLeft < 24 ? "tomorrow" : "in 2 days"}!</h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">${trialEnd}</p>
  </div>

  <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
    Hi ${firstName} 👋<br><br>
    Your 7-day free trial is almost up. After <strong>${trialEnd}</strong>, your account will move to the free plan — which means only 3 modules and 3 sessions per day for your children.
  </p>

  <div style="background:#FFF1F2;border:2px solid #FB7185;border-radius:16px;padding:16px 20px;margin-bottom:20px;">
    <h3 style="margin:0 0 10px;font-size:15px;color:#9F1239;font-weight:700;">🔒 What you'll lose on the free plan:</h3>
    <ul style="margin:0;padding:0 0 0 18px;color:#374151;font-size:14px;line-height:1.8;">
      <li>7 premium learning modules (Money, Science, Spanish &amp; more)</li>
      <li>Adventure mode games (Minecraft Math, Pokémon Spelling, PAW Patrol)</li>
      <li>Unlimited daily learning sessions</li>
    </ul>
  </div>

  <div style="background:#F0FDF4;border:2px solid #34D399;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
    <h3 style="margin:0 0 10px;font-size:15px;color:#065F46;font-weight:700;">✅ Keep everything with Premium:</h3>
    <ul style="margin:0;padding:0 0 0 18px;color:#374151;font-size:14px;line-height:1.8;">
      <li>All 10 modules + new ones every month</li>
      <li>Unlimited sessions every day</li>
      <li>Full adventure gamified mode</li>
      <li>Priority support</li>
    </ul>
  </div>

  <div style="text-align:center;margin-bottom:32px;">
    <a href="${appUrl}/pricing" style="display:inline-block;background:linear-gradient(135deg,#F97316,#FB923C);color:#fff;padding:16px 40px;border-radius:50px;text-decoration:none;font-weight:800;font-size:17px;box-shadow:0 4px 0 #C2410C;">
      Upgrade Now →
    </a>
    <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Cancel anytime. No hidden fees.</p>
  </div>

  <p style="text-align:center;color:#9ca3af;font-size:12px;">
    Sent by Flinchi · <a href="${appUrl}" style="color:#818CF8;">flinchi.com</a>
  </p>
</div></body></html>`,
      });
      sent++;
    } catch (e) {
      console.error(`[trial-expiring] failed for ${user.email}:`, e);
    }
  }

  return NextResponse.json({ sent, total: users.length });
}
