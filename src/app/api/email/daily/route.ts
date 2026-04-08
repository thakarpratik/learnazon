export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

const MODULE_LABELS: Record<string, string> = {
  MATH:           "Math 🔢",
  TIME_TELLING:   "Time Telling 🕐",
  PUBLIC_SPEAKING:"Public Speaking 🎤",
  MONEY:          "Money 💰",
  SPELLING:       "Spelling 📝",
  LIFE_SKILLS:    "Life Skills 🌱",
  SCIENCE:        "Science 🔬",
  WRITING:        "Writing ✍️",
  SPANISH:        "Spanish 🇪🇸",
  MOVIES:         "Movies 🎬",
};

const SCORE_COLOUR = (avg: number) =>
  avg >= 80 ? "#16a34a" : avg >= 60 ? "#d97706" : "#dc2626";

const SCORE_LABEL = (avg: number) =>
  avg >= 80 ? "Great work!" : avg >= 60 ? "Good effort!" : "Needs practice";

export async function POST(req: NextRequest) {
  try {
    const { childId } = await req.json();
    if (!childId) return NextResponse.json({ message: "childId required" }, { status: 400 });

    // Fetch child with parent
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: { parent: true, stars: true, streaks: true },
    });
    if (!child) return NextResponse.json({ message: "Child not found" }, { status: 404 });

    const parent = child.parent;

    // Today's progress
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayProgress = await prisma.progress.findMany({
      where: { childId, date: { gte: todayStart } },
      orderBy: { date: "asc" },
    });

    if (todayProgress.length === 0) {
      return NextResponse.json({ message: "No activity today" }, { status: 200 });
    }

    // Group by module
    const byModule: Record<string, number[]> = {};
    for (const p of todayProgress) {
      if (!byModule[p.module]) byModule[p.module] = [];
      byModule[p.module].push(p.score);
    }

    const moduleStats = Object.entries(byModule).map(([module, scores]) => ({
      module,
      label: MODULE_LABELS[module] ?? module,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      sessions: scores.length,
    }));

    const overallAvg = Math.round(
      todayProgress.reduce((a: number, p: { score: number }) => a + p.score, 0) / todayProgress.length
    );

    const childName = child.nickname ?? child.name;
    const avatar = child.avatar ?? "🌟";
    const streak = child.streaks?.currentStreak ?? 0;
    const todayDate = new Date().toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long",
    });

    const moduleRows = moduleStats.map((m) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-size:15px;">${m.label}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;text-align:center;font-weight:700;font-size:15px;color:${SCORE_COLOUR(m.avg)};">${m.avg}%</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;text-align:center;font-size:13px;color:#6b7280;">${SCORE_LABEL(m.avg)}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fffbf5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:24px 16px;">

  <!-- Header -->
  <div style="text-align:center;padding:32px 24px 24px;background:linear-gradient(135deg,#4F46E5,#818CF8);border-radius:20px;margin-bottom:24px;">
    <div style="font-size:48px;margin-bottom:8px;">${avatar}</div>
    <h1 style="margin:0;font-size:26px;color:#fff;font-weight:800;">${childName} is done for today!</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">${todayDate}</p>
  </div>

  <!-- Greeting -->
  <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
    Hi ${parent.name ?? "there"}! 👋<br><br>
    Great news — <strong>${childName}</strong> just completed their learning session for today.
    Here's a quick summary of what they got up to.
  </p>

  <!-- Stats strip -->
  <div style="display:flex;gap:12px;margin-bottom:24px;">
    <div style="flex:1;background:#fff;border:2px solid #FBBF24;border-radius:14px;padding:14px;text-align:center;">
      <div style="font-size:26px;font-weight:800;color:#92400E;">${todayProgress.length}</div>
      <div style="font-size:12px;color:#6b7280;font-weight:600;">Sessions Today</div>
    </div>
    <div style="flex:1;background:#fff;border:2px solid #34D399;border-radius:14px;padding:14px;text-align:center;">
      <div style="font-size:26px;font-weight:800;color:#065F46;">${overallAvg}%</div>
      <div style="font-size:12px;color:#6b7280;font-weight:600;">Avg Score</div>
    </div>
    <div style="flex:1;background:#fff;border:2px solid #F97316;border-radius:14px;padding:14px;text-align:center;">
      <div style="font-size:26px;font-weight:800;color:#C2410C;">${streak}🔥</div>
      <div style="font-size:12px;color:#6b7280;font-weight:600;">Day Streak</div>
    </div>
  </div>

  <!-- Module breakdown -->
  <div style="background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:24px;">
    <div style="padding:14px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
      <p style="margin:0;font-weight:700;color:#374151;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Today's Subjects</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Subject</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Score</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Verdict</th>
        </tr>
      </thead>
      <tbody>${moduleRows}</tbody>
    </table>
  </div>

  <!-- Encouragement -->
  <div style="background:linear-gradient(135deg,#FFF7ED,#FFFBEB);border:2px solid #FBBF24;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
    <p style="margin:0;font-size:15px;color:#92400E;font-weight:600;">
      ${overallAvg >= 80
        ? `🌟 ${childName} had an amazing session today! Keep the momentum going tomorrow.`
        : overallAvg >= 60
        ? `💪 ${childName} is making solid progress! A little practice tomorrow will go a long way.`
        : `📚 ${childName} gave it a go today — that's what counts! Encouragement goes a long way.`}
    </p>
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:32px;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com"}/parent"
       style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#818CF8);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px;">
      View Full Dashboard
    </a>
  </div>

  <!-- Footer -->
  <p style="text-align:center;color:#9ca3af;font-size:12px;margin:0;">
    Sent by Flinchi · You're getting this because you're a registered parent.<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com"}/parent" style="color:#818CF8;">Manage notifications</a>
  </p>

</div>
</body>
</html>`;

    const { error } = await getResend().emails.send({
      from: "Flinchi <reports@flinchi.com>",
      to: parent.email,
      subject: `${childName} finished learning for today! Here's how they did 🌟`,
      html,
    });

    if (error) {
      console.error("[email daily]", error);
      return NextResponse.json({ message: "Email send failed" }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("[email daily]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
