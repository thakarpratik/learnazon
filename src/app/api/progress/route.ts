export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const DAILY_SESSION_LIMIT = 3;

const progressSchema = z.object({
  childId: z.string().cuid(),
  module: z.enum(["MATH", "TIME_TELLING", "PUBLIC_SPEAKING", "MONEY", "SPELLING", "LIFE_SKILLS", "SCIENCE", "WRITING", "SPANISH", "MOVIES"]),
  score: z.number().int().min(0).max(100),
  timeTaken: z.number().int().min(0),
});

const BADGE_RULES = [
  { type: "MATH_MASTER",   module: "MATH",           minScore: 100 },
  { type: "TIME_WIZARD",   module: "TIME_TELLING",   minScore: 100 },
  { type: "SPEECH_STAR",   module: "PUBLIC_SPEAKING",minScore: 60  },
  { type: "MONEY_WISE",    module: "MONEY",          minScore: 100 },
  { type: "SPELL_BEE",     module: "SPELLING",       minScore: 100 },
  { type: "LIFE_CHAMP",    module: "LIFE_SKILLS",    minScore: 60  },
  { type: "SCIENCE_STAR",  module: "SCIENCE",        minScore: 80  },
  { type: "WRITING_STAR",  module: "WRITING",        minScore: 60  },
  { type: "SPANISH_STAR",  module: "SPANISH",        minScore: 80  },
  { type: "MOVIE_BUFF",    module: "MOVIES",         minScore: 80  },
  { type: "PERFECT_SCORE", module: null,             minScore: 100 },
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { childId, module, score, timeTaken } = parsed.data;

    // Verify ownership
    const child = await prisma.child.findUnique({ where: { id: childId } });
    if (!child) return NextResponse.json({ message: "Child not found" }, { status: 404 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (role === "parent" && child.parentId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (role === "child" && child.id !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Save progress
    const progress = await prisma.progress.create({
      data: { childId, module, score, timeTaken },
    });

    // Stars: 1 per activity, 2 for ≥80, 3 for 100
    const starsEarned = score === 100 ? 3 : score >= 80 ? 2 : 1;
    const starsRecord = await prisma.stars.upsert({
      where: { childId },
      create: { childId, total: starsEarned, thisWeek: starsEarned },
      update: { total: { increment: starsEarned }, thisWeek: { increment: starsEarned } },
    });

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const streak = await prisma.streak.findUnique({ where: { childId } });
    const lastActive = streak?.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);
    const isToday = lastActive?.getTime() === today.getTime();
    const isYesterday = lastActive?.getTime() === today.getTime() - 86400000;

    let newStreak = 1;
    if (!isToday) {
      newStreak = isYesterday ? (streak?.currentStreak ?? 0) + 1 : 1;
      await prisma.streak.upsert({
        where: { childId },
        create: { childId, currentStreak: 1, longestStreak: 1, lastActiveDate: new Date() },
        update: {
          currentStreak: newStreak,
          longestStreak: { set: Math.max(streak?.longestStreak ?? 0, newStreak) },
          lastActiveDate: new Date(),
        },
      });
    } else {
      newStreak = streak?.currentStreak ?? 1;
    }

    // Award badges
    const newBadges: string[] = [];
    const existingBadges = await prisma.badge.findMany({
      where: { childId },
      select: { badgeType: true },
    });
    const earned = new Set(existingBadges.map((b: any) => b.badgeType));

    // First star badge
    if (!earned.has("FIRST_STAR")) {
      await prisma.badge.create({ data: { childId, badgeType: "FIRST_STAR" } });
      newBadges.push("FIRST_STAR");
    }

    // Module-specific badges
    for (const rule of BADGE_RULES) {
      if (earned.has(rule.type)) continue;
      if (rule.module && rule.module !== module) continue;
      if (score >= rule.minScore) {
        await prisma.badge.create({ data: { childId, badgeType: rule.type as any } });
        newBadges.push(rule.type);
        earned.add(rule.type);
      }
    }

    // Streak badges
    for (const { days, badge } of [{ days: 3, badge: "STREAK_3" }, { days: 7, badge: "STREAK_7" }, { days: 30, badge: "STREAK_30" }]) {
      if (!earned.has(badge) && newStreak >= days) {
        await prisma.badge.create({ data: { childId, badgeType: badge as any } });
        newBadges.push(badge);
      }
    }

    // Adaptive difficulty hint
    const recent = await prisma.progress.findMany({
      where: { childId, module },
      orderBy: { date: "desc" },
      take: 3,
      select: { score: true },
    });
    const avgRecent = recent.length ? recent.reduce((s: number, r: any) => s + r.score, 0) / recent.length : score;
    const difficulty = avgRecent < 60 ? "easier" : avgRecent > 90 ? "harder" : "same";

    // Daily session limit check
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const sessionsToday = await prisma.progress.count({
      where: { childId, date: { gte: todayStart } },
    });
    const dailyLimitReached = sessionsToday >= DAILY_SESSION_LIMIT;

    // Auto-send daily report to parent when child hits the limit (exactly at limit)
    if (sessionsToday === DAILY_SESSION_LIMIT) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://kidlearn.app";
        await fetch(`${appUrl}/api/email/daily`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId }),
        });
      } catch {
        // Non-fatal — email failure should not break progress save
      }
    }

    return NextResponse.json({
      progress,
      starsEarned,
      totalStars: starsRecord.total,
      streak: newStreak,
      newBadges,
      difficulty,
      sessionsToday,
      dailyLimitReached,
    }, { status: 201 });
  } catch (error) {
    console.error("[progress POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const childId = searchParams.get("childId");
    if (!childId) return NextResponse.json({ message: "childId required" }, { status: 400 });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [progress, stars, streak, badges, sessionsToday] = await Promise.all([
      prisma.progress.findMany({
        where: { childId },
        orderBy: { date: "desc" },
        take: 50,
      }),
      prisma.stars.findUnique({ where: { childId } }),
      prisma.streak.findUnique({ where: { childId } }),
      prisma.badge.findMany({ where: { childId }, orderBy: { earnedAt: "desc" } }),
      // Accurate count for today — not affected by the take:50 cap above
      prisma.progress.count({ where: { childId, date: { gte: todayStart } } }),
    ]);

    return NextResponse.json({ progress, stars, streak, badges, sessionsToday });
  } catch (error) {
    console.error("[progress GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
