export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter, FROM } from "@/lib/mailer";

// Called by Vercel cron daily — finds paid subscribers renewing in 3 days and emails them
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com";
  const now = new Date();
  const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const in4days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      renewsAt: { gte: in3days, lte: in4days },
    },
    include: { user: { select: { email: true, name: true } } },
  });

  let sent = 0;
  for (const sub of subscriptions) {
    const firstName = (sub.user.name ?? "there").split(" ")[0];
    const renewDate = sub.renewsAt!.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
    const planLabel = sub.plan === "FAMILY" ? "Family Plan" : "Pro Plan";
    const planEmoji = sub.plan === "FAMILY" ? "👨‍👩‍👧‍👦" : "⭐";

    try {
      await transporter.sendMail({
        from: FROM,
        to: sub.user.email,
        subject: `Your Flinchi ${planLabel} renews in 3 days 📅`,
        html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fffbf5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 16px;">
  <div style="text-align:center;padding:32px 24px;background:linear-gradient(135deg,#4F46E5,#818CF8);border-radius:20px;margin-bottom:24px;">
    <div style="font-size:52px;margin-bottom:10px;">${planEmoji}</div>
    <h1 style="margin:0;font-size:26px;color:#fff;font-weight:800;">Renewal in 3 days</h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">${planLabel} · ${renewDate}</p>
  </div>

  <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
    Hi ${firstName} 👋<br><br>
    Just a heads-up — your Flinchi <strong>${planLabel}</strong> will automatically renew on <strong>${renewDate}</strong>. No action needed if you want to continue.
  </p>

  <div style="background:#F0FDF4;border:2px solid #34D399;border-radius:16px;padding:16px 20px;margin-bottom:20px;">
    <h3 style="margin:0 0 8px;font-size:15px;color:#065F46;font-weight:700;">✅ Your plan continues to include:</h3>
    <ul style="margin:0;padding:0 0 0 18px;color:#374151;font-size:14px;line-height:1.8;">
      <li>All 10 learning modules + new ones monthly</li>
      <li>Adventure mode (Minecraft, Pokémon, PAW Patrol &amp; more)</li>
      <li>Unlimited daily sessions</li>
      <li>Daily &amp; weekly parent progress reports</li>
      ${sub.plan === "FAMILY" ? "<li>Up to 4 child profiles</li>" : ""}
    </ul>
  </div>

  <div style="background:#FFF9C4;border:2px solid #F9A825;border-radius:14px;padding:14px 18px;margin-bottom:24px;text-align:center;">
    <p style="margin:0;font-size:14px;color:#92400E;">
      If you'd like to cancel before renewal, you can do so from your account settings.
    </p>
  </div>

  <div style="text-align:center;margin-bottom:32px;">
    <a href="${appUrl}/parent" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#818CF8);color:#fff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px;">
      View My Account
    </a>
  </div>

  <p style="text-align:center;color:#9ca3af;font-size:12px;">
    Sent by Flinchi · <a href="${appUrl}" style="color:#818CF8;">flinchi.com</a><br>
    You're receiving this because you have an active Flinchi subscription. · <a href="${appUrl}/account" style="color:#9ca3af;">Manage email preferences</a>
  </p>
</div></body></html>`,
      });
      sent++;
    } catch (e) {
      console.error(`[renewal-reminder] failed for ${sub.user.email}:`, e);
    }
  }

  return NextResponse.json({ sent, total: subscriptions.length });
}
