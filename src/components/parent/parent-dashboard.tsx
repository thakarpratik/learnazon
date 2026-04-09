"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChildSwitchButton } from "@/components/parent/child-switch-button";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MODULE_LABELS: Record<string, string> = {
  MATH: "Math", TIME_TELLING: "Time", PUBLIC_SPEAKING: "Speaking",
  MONEY: "Money", SPELLING: "Spelling", LIFE_SKILLS: "Life Skills",
};
const MODULE_COLORS: Record<string, string> = {
  MATH: "#FF6B35", TIME_TELLING: "#118AB2", PUBLIC_SPEAKING: "#06D6A0",
  MONEY: "#FFD166", SPELLING: "#845EC2", LIFE_SKILLS: "#FF9EBC",
};
const BADGE_EMOJIS: Record<string, string> = {
  FIRST_STAR: "⭐", MATH_MASTER: "🔢", TIME_WIZARD: "🕐", SPEECH_STAR: "🎤",
  MONEY_WISE: "💰", SPELL_BEE: "📝", LIFE_CHAMP: "🌱",
  STREAK_3: "🔥", STREAK_7: "🔥🔥", STREAK_30: "🔥🔥🔥",
  PERFECT_SCORE: "🏆", SPEED_DEMON: "⚡",
};

interface ChildData {
  id: string; name: string; nickname: string | null; age: number;
  avatar: string; favoriteColor: string | null;
  stars: number; starsThisWeek: number; streak: number; longestStreak: number;
  badges: { badgeType: string; earnedAt: string }[];
  moduleStats: { module: string; avg: number; count: number; best: number }[];
  recent: { module: string; score: number; date: string }[];
}

export function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role === "child") router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchChildren();
  }, [status]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/children", { credentials: "include" });
      const data = await res.json();
      const childList = data.children ?? [];
      const enriched = await Promise.all(childList.map(async (child: any) => {
        const pRes = await fetch(`/api/progress?childId=${child.id}`, { credentials: "include" });
        const pData = await pRes.json();
        const progress: any[] = pData.progress ?? [];
        const byModule: Record<string, number[]> = {};
        for (const p of progress) {
          if (!byModule[p.module]) byModule[p.module] = [];
          byModule[p.module].push(p.score);
        }
        const moduleStats = Object.entries(byModule).map(([module, scores]) => ({
          module,
          avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          best: Math.max(...scores),
          count: scores.length,
        }));
        return {
          id: child.id, name: child.name, nickname: child.nickname,
          age: child.age, avatar: child.avatar ?? "🌟",
          favoriteColor: child.favoriteColor ?? "#3D5AFE",
          stars: pData.stars?.total ?? 0, starsThisWeek: pData.stars?.thisWeek ?? 0,
          streak: pData.streak?.currentStreak ?? 0, longestStreak: pData.streak?.longestStreak ?? 0,
          badges: pData.badges ?? [], moduleStats,
          recent: progress.slice(0, 5),
        };
      }));
      setChildren(enriched);
      if (enriched.length > 0) setSelectedChild(enriched[0].id);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const sendWeeklyEmail = async () => {
    setSendingEmail(true);
    try {
      await fetch("/api/email/weekly", { method: "POST", credentials: "include" });
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    } catch (e) { console.error(e); }
    finally { setSendingEmail(false); }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl animate-bounce-slow">📊</div>
          <p className="font-fredoka text-2xl text-blue-600 mt-4">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const child = children.find((c) => c.id === selectedChild) ?? children[0];
  const ALL_MODULES = ["MATH","TIME_TELLING","PUBLIC_SPEAKING","MONEY","SPELLING","LIFE_SKILLS"];
  const radarData = ALL_MODULES.map((m) => ({
    subject: MODULE_LABELS[m],
    score: child?.moduleStats.find((s) => s.module === m)?.avg ?? 0,
  }));
  const barData = (child?.recent ?? []).map((r) => ({
    name: MODULE_LABELS[r.module] ?? r.module,
    score: r.score,
  })).reverse();

  const parentName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/flinchi.svg" alt="Flinchi" width={110} height={32} priority />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={sendWeeklyEmail}
              disabled={sendingEmail}
              className={`text-sm font-bold px-4 py-2 rounded-full border transition-all ${
                emailSent
                  ? "bg-green-100 text-green-600 border-green-300"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {emailSent ? "✅ Email sent!" : sendingEmail ? "Sending…" : "📧 Send report"}
            </button>
            <Link href="/parent/children" className="btn-primary !py-2 !px-5 !text-sm">
              + Add Child
            </Link>
            {/* Home */}
            <Link
              href="/"
              className="text-sm font-bold px-4 py-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all"
              aria-label="Go to homepage"
            >
              🏠 Home
            </Link>
            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-bold px-4 py-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
              aria-label="Log out"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-fredoka text-3xl font-bold text-gray-800">
            Welcome back, {parentName}! 👋
          </h1>
        </div>
        <p className="text-gray-400 mb-8">
          Track your {children.length > 1 ? "children's" : "child's"} learning progress
        </p>

        {children.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="font-fredoka text-2xl text-gray-700 mb-4">No children added yet</h2>
            <Link href="/parent/children" className="btn-primary">Add Your First Child →</Link>
          </div>
        ) : (
          <>
            {/* Child selector */}
            {children.length > 1 && (
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {children.map((c) => (
                  <button key={c.id} onClick={() => setSelectedChild(c.id)}
                    className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: selectedChild === c.id ? (c.favoriteColor ?? "#3D5AFE") : "white",
                      color: selectedChild === c.id ? "white" : "#6B7280",
                      border: `2px solid ${selectedChild === c.id ? (c.favoriteColor ?? "#3D5AFE") : "#E5E7EB"}`,
                    }}>
                    <span>{c.avatar}</span>
                    {c.nickname ?? c.name}
                  </button>
                ))}
              </div>
            )}

            {child && (
              <>
                {/* Child header */}
                <div className="card p-5 mb-6 border flex items-center gap-4"
                  style={{ borderColor: (child.favoriteColor ?? "#3D5AFE") + "30", background: (child.favoriteColor ?? "#3D5AFE") + "08" }}>
                  <span className="text-5xl">{child.avatar}</span>
                  <div>
                    <h2 className="font-fredoka text-2xl font-bold text-gray-800">
                      {child.nickname ?? child.name}
                      {child.nickname && child.nickname !== child.name && (
                        <span className="text-gray-400 font-normal text-base ml-2">({child.name})</span>
                      )}
                    </h2>
                    <p className="text-gray-400 text-sm">Age {child.age}</p>
                  <div className="mt-3">
                    <ChildSwitchButton
                      childId={child.id}
                      parentId={(session?.user as any)?.id ?? ""}
                      childName={child.nickname ?? child.name}
                      avatar={child.avatar}
                      color={child.favoriteColor ?? "#3D5AFE"}
                    />
                  </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Stars",  value: child.stars,           icon: "⭐", bg: "#FFF8E1", color: "#E65100" },
                    { label: "This Week",    value: `${child.starsThisWeek} ⭐`, icon: "📅", bg: "#E3F2FD", color: "#1565C0" },
                    { label: "Day Streak",   value: child.streak,          icon: "🔥", bg: "#FFF3E0", color: "#BF360C" },
                    { label: "Badges",       value: child.badges.length,   icon: "🏆", bg: "#F3E5F5", color: "#6A1B9A" },
                  ].map((stat) => (
                    <div key={stat.label} className="card p-5 border" style={{ borderColor: stat.color + "30", background: stat.bg }}>
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="font-fredoka text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-xs font-semibold text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="card p-6">
                    <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">Skills Overview</h2>
                    {child.moduleStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} />
                          <Radar name={child.nickname ?? child.name} dataKey="score"
                            stroke={child.favoriteColor ?? "#3D5AFE"}
                            fill={child.favoriteColor ?? "#3D5AFE"}
                            fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                        No activity yet — encourage {child.nickname ?? child.name} to play!
                      </div>
                    )}
                  </div>

                  <div className="card p-6">
                    <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    {barData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} />
                          <Tooltip formatter={(v) => [`${v}%`, "Score"]} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                          <Bar dataKey="score" fill={child.favoriteColor ?? "#3D5AFE"} radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No activity yet</div>
                    )}
                  </div>
                </div>

                {/* Subject breakdown */}
                <div className="card p-6 mb-8">
                  <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">Subject Breakdown</h2>
                  {child.moduleStats.length > 0 ? (
                    <div className="space-y-4">
                      {child.moduleStats.sort((a, b) => b.avg - a.avg).map((stat) => (
                        <div key={stat.module}>
                          <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-gray-700">{MODULE_LABELS[stat.module] ?? stat.module}</span>
                            <span className={stat.avg >= 80 ? "text-green-600" : stat.avg >= 60 ? "text-yellow-600" : "text-red-500"}>
                              {stat.avg}% avg · {stat.count} session{stat.count !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${stat.avg}%`, backgroundColor: child.favoriteColor ?? MODULE_COLORS[stat.module] ?? "#3D5AFE" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No sessions completed yet.</p>
                  )}
                </div>

                {/* Badges */}
                {child.badges.length > 0 && (
                  <div className="card p-6">
                    <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">
                      Badges 🏆 <span style={{ color: child.favoriteColor ?? "#3D5AFE" }}>({child.badges.length})</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {child.badges.map((badge) => (
                        <div key={badge.badgeType}
                          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                          style={{ background: (child.favoriteColor ?? "#3D5AFE") + "15", color: child.favoriteColor ?? "#3D5AFE", border: `1px solid ${(child.favoriteColor ?? "#3D5AFE") + "30"}` }}>
                          <span>{BADGE_EMOJIS[badge.badgeType] ?? "🏅"}</span>
                          {badge.badgeType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
