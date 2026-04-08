export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function requireAdmin(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("x-admin-secret");
  return auth === secret;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);

  const [
    totalUsers,
    totalChildren,
    totalSessions,
    sessionsToday,
    sessionsThisWeek,
    activeUsersToday,
    activeUsersWeek,
    newUsersToday,
    newUsersWeek,
    newUsersMonth,
    moduleCounts,
    moduleAvgScores,
    topStreaks,
    recentSignups,
    usersWithNoSessions,
    signupsByDay,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.child.count(),
    prisma.progress.count(),
    prisma.progress.count({ where: { date: { gte: todayStart } } }),
    prisma.progress.count({ where: { date: { gte: weekStart } } }),

    // Distinct children active today
    prisma.progress.findMany({
      where: { date: { gte: todayStart } },
      distinct: ["childId"],
      select: { childId: true },
    }).then((r: { childId: string }[]) => r.length),

    // Distinct children active this week
    prisma.progress.findMany({
      where: { date: { gte: weekStart } },
      distinct: ["childId"],
      select: { childId: true },
    }).then((r: { childId: string }[]) => r.length),

    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),

    // Sessions per module
    prisma.progress.groupBy({
      by: ["module"],
      _count: { module: true },
      orderBy: { _count: { module: "desc" } },
    }),

    // Avg score per module
    prisma.progress.groupBy({
      by: ["module"],
      _avg: { score: true },
      orderBy: { _avg: { score: "desc" } },
    }),

    // Top streaks
    prisma.streak.findMany({
      orderBy: { currentStreak: "desc" },
      take: 10,
      include: { child: { select: { name: true, parent: { select: { email: true } } } } },
    }),

    // Recent signups
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true, name: true, email: true, plan: true, createdAt: true,
        children: {
          select: {
            id: true, name: true, age: true,
            progress: { select: { id: true }, take: 1 },
            streaks: { select: { currentStreak: true } },
          },
        },
      },
    }),

    // Users who signed up but no child has any session
    prisma.user.findMany({
      where: {
        children: {
          every: {
            progress: { none: {} },
          },
        },
      },
      select: { id: true, email: true, name: true, createdAt: true, children: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),

    // Signups per day (last 30 days)
    prisma.user.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }).then((users: { createdAt: Date }[]) => {
      const byDay: Record<string, number> = {};
      for (const u of users) {
        const day = u.createdAt.toISOString().slice(0, 10);
        byDay[day] = (byDay[day] ?? 0) + 1;
      }
      return Object.entries(byDay).map(([date, count]) => ({ date, count }));
    }),
  ]);

  // Merge module counts + avg scores
  const moduleStats = moduleCounts.map((m: { module: string; _count: { module: number } }) => ({
    module: m.module,
    sessions: m._count.module,
    avgScore: Math.round(moduleAvgScores.find((a: { module: string; _avg: { score: number | null } }) => a.module === m.module)?._avg?.score ?? 0),
  }));

  return NextResponse.json({
    overview: {
      totalUsers, totalChildren, totalSessions,
      sessionsToday, sessionsThisWeek,
      activeUsersToday, activeUsersWeek,
      newUsersToday, newUsersWeek, newUsersMonth,
    },
    moduleStats,
    topStreaks: topStreaks.map((s: { child: { name: string; parent: { email: string } }; currentStreak: number; longestStreak: number }) => ({
      childName: s.child.name,
      parentEmail: s.child.parent.email,
      currentStreak: s.currentStreak,
      longestStreak: s.longestStreak,
    })),
    recentSignups: recentSignups.map((u: { id: string; name: string | null; email: string; plan: string; createdAt: Date; children: { id: string; name: string; age: number; progress: { id: string }[]; streaks: { currentStreak: number } | null }[] }) => ({
      id: u.id, name: u.name, email: u.email, plan: u.plan,
      createdAt: u.createdAt,
      childCount: u.children.length,
      hasActivity: u.children.some((c) => c.progress.length > 0),
      children: u.children.map((c) => ({
        name: c.name, age: c.age,
        hasPlayed: c.progress.length > 0,
        streak: c.streaks?.currentStreak ?? 0,
      })),
    })),
    inactiveUsers: usersWithNoSessions.map((u: { id: string; email: string; name: string | null; createdAt: Date; children: { id: string }[] }) => ({
      id: u.id, email: u.email, name: u.name,
      createdAt: u.createdAt,
      childCount: u.children.length,
    })),
    signupsByDay,
  });
}
