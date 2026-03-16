"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

interface ChildData {
  id: string; name: string; age: number; avatar: string;
  stars: number; starsThisWeek: number; streak: number; longestStreak: number;
  badges: { badgeType: string; earnedAt: string }[];
  moduleStats: { module: string; avg: number; count: number; best: number }[];
  recent: { module: string; score: number; date: string }[];
}

const BADGE_EMOJIS: Record<string, string> = {
  FIRST_STAR: "⭐", MATH_MASTER: "🔢", TIME_WIZARD: "🕐", SPEECH_STAR: "🎤",
  MONEY_WISE: "💰", SPELL_BEE: "📝", LIFE_CHAMP: "🌱",
  STREAK_3: "🔥", STREAK_7: "🔥🔥", STREAK_30: "🔥🔥🔥",
  PERFECT_SCORE: "🏆", SPEED_DEMON: "⚡",
};

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
      const res = await fetch("/api/children");
      const data = await res.json();
      const childList = data.children ?? [];

      // Fetch progress for each child
      const enriched = await Promise.all(childList.map(async (child: any) => {
        const pRes = await fetch(`/api/progress?childId=${child.id}`);
        const pData = await pRes.json();
        const progress: any[] = pData.progress ?? [];
        const stars = pData.stars;
        const streak = pData.streak;
        const badges: any[] = pData.badges ?? [];

        // Compute per-module stats
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
          id: child.id, name: child.name, age: child.age, avatar: child.avatar ?? "🌟",
          stars: stars?.total ?? 0, starsThisWeek: stars?.thisWeek ?? 0,
          streak: streak?.currentStreak ?? 0, longestStreak: streak?.longestStreak ?? 0,
          badges, moduleStats,
          recent: progress.slice(0, 5),
        };
      }));

      setChildren(enriched);
      if (enriched.length > 0) setSelectedChild(enriched[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendWeeklyEmail = async () => {
    setSendingEmail(true);
    try {
      await fetch("/api/email/weekly", { method: "POST" });
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    } catch (e) { console.error(e); }
    finally { setSendingEmail(false); }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="text-6xl animate-bounce-slow">📊</div>
          <p className="font-fredoka text-2xl text-orange-500 mt-4">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const child = children.find((c) => c.id === selectedChild) ?? children[0];

  // Radar data — all 6 modules
  const ALL_MODULES = ["MATH","TIME_TELLING","PUBLIC_SPEAKING","MONEY","SPELLING","LIFE_SKILLS"];
  const radarData = ALL_MODULES.map((m) => ({
    subject: MODULE_LABELS[m],
    score: child?.moduleStats.find((s) => s.module === m)?.avg ?? 0,
  }));

  // Bar chart — recent 5 activities
  const barData = (child?.recent ?? []).map((r) => ({
    name: MODULE_LABELS[r.module] ?? r.module,
    score: r.score,
    fill: MODULE_COLORS[r.module] ?? "#FF6B35",
  })).reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            <span className="font-fredoka text-2xl font-bold text-orange-500">KidLearn</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={sendWeeklyEmail} disabled={sendingEmail}
              className={`text-sm font-bold px-4 py-2 rounded-full border transition-all ${emailSent ? "bg-green-100 text-green-600 border-green-300" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"}`}>
              {emailSent ? "✅ Email sent!" : sendingEmail ? "Sending…" : "📧 Send report"}
            </button>
            <Link href="/parent/children" className="btn-primary !py-2 !px-5 !text-sm">
              + Add Child
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-fredoka text-3xl font-bold text-gray-800 mb-2">Parent Dashboard</h1>
        <p className="text-gray-500 mb-8">Track your {children.length > 1 ? "children&apos;s" : "child&apos;s"} learning progress</p>

        {children.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="font-fredoka text-2xl text-gray-700 mb-4">No children added yet</h2>
            <Link href="/parent/children" className="btn-primary">Add Your First Child →</Link>
          </div>
        ) : (
          <>
            {/* Child selector tabs */}
            {children.length > 1 && (
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {children.map((c) => (
                  <button key={c.id} onClick={() => setSelectedChild(c.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedChild === c.id ? "bg-orange-500 text-white shadow-fun" : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"}`}>
                    <span>{c.avatar}</span>{c.name}
                  </button>
                ))}
              </div>
            )}

            {child && (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Stars", value: child.stars, icon: "⭐", color: "border-yellow-200 bg-yellow-50" },
                    { label: "This Week", value: `${child.starsThisWeek} ⭐`, icon: "📅", color: "border-blue-200 bg-blue-50" },
                    { label: "Day Streak", value: child.streak, icon: "🔥", color: "border-orange-200 bg-orange-50" },
                    { label: "Badges", value: child.badges.length, icon: "🏆", color: "border-purple-200 bg-purple-50" },
                  ].map((stat) => (
                    <div key={stat.label} className={`card p-5 border ${stat.color}`}>
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="font-fredoka text-3xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-xs font-semibold text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Radar chart */}
                  <div className="card p-6">
                    <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">Skills Overview</h2>
                    {child.moduleStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} />
                          <Radar name={child.name} dataKey="score" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                        No data yet — encourage {child.name} to play!
                      </div>
                    )}
                  </div>

                  {/* Bar chart - recent scores */}
                  <div className="card p-6">
                    <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    {barData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} />
                          <Tooltip formatter={(v) => [`${v}%`, "Score"]} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                          <Bar dataKey="score" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                        No activity yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Module breakdown */}
                <div className="card p-6 mb-8">
                  <h2 className="font-fredoka text-xl font-bold text-gray-800 mb-4">Subject Breakdown</h2>
                  {child.moduleStats.length > 0 ? (
                    <div className="space-y-4">
                      {child.moduleStats.sort((a, b) => b.avg - a.avg).map((stat) => (
                        <div key={stat.module}>
                          <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-gray-700">{MODULE_LABELS[stat.module] ?? stat.module}</span>
                            <span className={stat.avg >= 80 ? "text-green-600" : stat.avg >= 60 ? "text-yellow-600" : "text-red-500"}>
                              {stat.avg}% avg • {stat.count} session{stat.count !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${stat.avg}%`, backgroundColor: MODULE_COLORS[stat.module] ?? "#FF6B35" }} />
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
                      Badges Earned 🏆 <span className="text-orange-500">({child.badges.length})</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {child.badges.map((badge) => (
                        <div key={badge.badgeType} className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
                          <span className="text-xl">{BADGE_EMOJIS[badge.badgeType] ?? "🏅"}</span>
                          <span className="text-sm font-bold text-yellow-800">
                            {badge.badgeType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
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
