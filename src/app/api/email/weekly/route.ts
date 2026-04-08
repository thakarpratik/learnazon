export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

const MODULE_LABELS: Record<string, string> = {
  MATH: "Math 🔢", TIME_TELLING: "Time Telling 🕐",
  PUBLIC_SPEAKING: "Public Speaking 🎤", MONEY: "Money 💰",
  SPELLING: "Spelling 📝", LIFE_SKILLS: "Life Skills 🌱",
  SCIENCE: "Science 🔬", WRITING: "Writing ✍️",
  SPANISH: "Spanish 🇪🇸", MOVIES: "Movies 🎬",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "parent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const parentId = (session.user as any).id;
    const parent = await prisma.user.findUnique({ where: { id: parentId } });
    if (!parent) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const children = await prisma.child.findMany({
      where: { parentId },
      include: { stars: true, streaks: true },
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const childrenData = await Promise.all(children.map(async (child: any) => {
      const weekProgress = await prisma.progress.findMany({
        where: { childId: child.id, date: { gte: oneWeekAgo } },
      });
      const byModule: Record<string, number[]> = {};
      for (const p of weekProgress) {
        if (!byModule[p.module]) byModule[p.module] = [];
        byModule[p.module].push(p.score);
      }
      const moduleStats = Object.entries(byModule).map(([module, scores]) => ({
        module, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length,
      }));
      return {
        name: child.name, age: child.age, avatar: child.avatar ?? "🌟",
        streak: child.streaks?.currentStreak ?? 0,
        starsThisWeek: child.stars?.thisWeek ?? 0,
        moduleStats, bestSubject: moduleStats.sort((a, b) => b.avg - a.avg)[0]?.module ?? null,
      };
    }));

    const childSections = childrenData.map((c) => {
      const rows = c.moduleStats.map((m: { module: string; avg: number; count: number }) => `
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${MODULE_LABELS[m.module] ?? m.module}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;font-weight:700;color:${m.avg >= 80 ? "#16a34a" : m.avg >= 60 ? "#d97706" : "#dc2626"};">${m.avg}%</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center;">${m.count} session${m.count !== 1 ? "s" : ""}</td></tr>`).join("");
      return `<div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #e5e7eb;">
        <h2 style="font-size:22px;margin:0 0 4px;color:#1a1a2e;">${c.avatar} ${c.name}</h2>
        <p style="color:#6b7280;margin:0 0 16px;font-size:14px;">Age ${c.age} • ${c.streak} day streak 🔥 • ${c.starsThisWeek} stars ⭐</p>
        ${rows ? `<table style="width:100%;border-collapse:collapse;font-size:14px;"><thead><tr style="background:#fff7ed;"><th style="padding:8px 12px;text-align:left;">Subject</th><th style="padding:8px 12px;text-align:center;">Avg Score</th><th style="padding:8px 12px;text-align:center;">Sessions</th></tr></thead><tbody>${rows}</tbody></table>` : "<p style='color:#6b7280;font-style:italic;'>No activity this week!</p>"}
        ${c.bestSubject ? `<p style="margin:12px 0 0;font-size:13px;color:#6b7280;">💪 Best subject: <strong>${MODULE_LABELS[c.bestSubject] ?? c.bestSubject}</strong></p>` : ""}
      </div>`;
    }).join("");

    const html = `<!DOCTYPE html><html><body style="font-family:'Helvetica Neue',sans-serif;background:#fffbf5;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;">
  <div style="text-align:center;padding:32px 0 24px;"><span style="font-size:40px;">🌟</span>
    <h1 style="font-size:28px;color:#ff6b35;margin:8px 0 0;font-weight:800;">KidLearn Weekly Report</h1>
    <p style="color:#6b7280;margin:4px 0 0;">Week ending ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p></div>
  <p style="color:#374151;margin:0 0 24px;">Hi ${parent.name ?? "there"}! Here is how your child${childrenData.length > 1 ? "ren" : ""} did this week!</p>
  ${childSections}
  <div style="text-align:center;padding:24px 0;border-top:1px solid #e5e7eb;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://kidlearn.app"}/parent" style="background:#ff6b35;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">View Full Dashboard</a>
  </div>
</div></body></html>`;

    const { data, error } = await getResend().emails.send({
      from: "KidLearn <reports@kidlearn.app>",
      to: parent.email,
      subject: `KidLearn weekly report for ${childrenData.map(c => c.name).join(" & ")}`,
      html,
    });

    if (error) return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    return NextResponse.json({ sent: true, id: data?.id });
  } catch (error) {
    console.error("[email weekly]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
