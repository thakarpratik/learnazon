"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line,
} from "recharts";

const MODULE_LABELS: Record<string, string> = {
  MATH: "Math 🔢", TIME_TELLING: "Time 🕐", PUBLIC_SPEAKING: "Speaking 🎤",
  MONEY: "Money 💰", SPELLING: "Spelling 📝", LIFE_SKILLS: "Life Skills 🌱",
  SCIENCE: "Science 🔬", WRITING: "Writing ✍️", SPANISH: "Spanish 🇪🇸", MOVIES: "Movies 🎬",
};

const MODULE_COLORS: Record<string, string> = {
  MATH: "#F97316", TIME_TELLING: "#4F46E5", PUBLIC_SPEAKING: "#34D399",
  MONEY: "#FBBF24", SPELLING: "#A78BFA", LIFE_SKILLS: "#FB7185",
  SCIENCE: "#14B8A6", WRITING: "#6366F1", SPANISH: "#EF4444", MOVIES: "#7C3AED",
};

interface Stats {
  overview: {
    totalUsers: number; totalChildren: number; totalSessions: number;
    sessionsToday: number; sessionsThisWeek: number;
    activeUsersToday: number; activeUsersWeek: number;
    newUsersToday: number; newUsersWeek: number; newUsersMonth: number;
  };
  moduleStats: { module: string; sessions: number; avgScore: number }[];
  topStreaks: { childName: string; parentEmail: string; currentStreak: number; longestStreak: number }[];
  recentSignups: {
    id: string; name: string | null; email: string; plan: string;
    createdAt: string; childCount: number; hasActivity: boolean;
    children: { name: string; age: number; hasPlayed: boolean; streak: number }[];
  }[];
  inactiveUsers: { id: string; email: string; name: string | null; createdAt: string; childCount: number }[];
  signupsByDay: { date: string; count: number }[];
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "signups" | "modules" | "inactive">("overview");

  const load = async (s: string) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-secret": s },
      });
      if (res.status === 403) { setError("Wrong secret"); setLoading(false); return; }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
    } catch {
      setError("Failed to load");
    }
    setLoading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-white font-bold text-xl">Admin Analytics</h1>
            <p className="text-gray-400 text-sm mt-1">Flinchi internal dashboard</p>
          </div>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(secret)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-indigo-500"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={() => load(secret)}
            disabled={loading || !secret}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;
  const { overview, moduleStats, topStreaks, recentSignups, inactiveUsers, signupsByDay } = stats;

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "signups", label: "👥 Signups" },
    { id: "modules", label: "📚 Modules" },
    { id: "inactive", label: "😴 Inactive" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">🌟 Flinchi Admin</h1>
          <p className="text-gray-400 text-xs mt-0.5">Usage analytics · as of now</p>
        </div>
        <button
          onClick={() => load(secret)}
          className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b border-gray-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
              tab === t.id
                ? "bg-gray-800 text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* KPI grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: "Total Users", value: overview.totalUsers, icon: "👤", color: "#6366F1" },
                { label: "Children", value: overview.totalChildren, icon: "👶", color: "#34D399" },
                { label: "Total Sessions", value: overview.totalSessions, icon: "🎮", color: "#F97316" },
                { label: "Sessions Today", value: overview.sessionsToday, icon: "📅", color: "#FBBF24" },
                { label: "Sessions / Week", value: overview.sessionsThisWeek, icon: "📈", color: "#A78BFA" },
              ].map((k) => (
                <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="text-2xl mb-1">{k.icon}</div>
                  <div className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{k.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Active kids today", value: overview.activeUsersToday, icon: "🟢" },
                { label: "Active kids this week", value: overview.activeUsersWeek, icon: "📅" },
                { label: "New signups today", value: overview.newUsersToday, icon: "✨" },
                { label: "New signups this week", value: overview.newUsersWeek, icon: "🆕" },
                { label: "New signups (30d)", value: overview.newUsersMonth, icon: "📆" },
                { label: "Inactive users", value: inactiveUsers.length, icon: "😴" },
              ].map((k) => (
                <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">{k.icon}</span>
                  <div>
                    <div className="text-xl font-bold text-white">{k.value}</div>
                    <div className="text-xs text-gray-400">{k.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signups chart */}
            {signupsByDay.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Signups — last 30 days</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={signupsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }}
                      tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 10 }}
                      labelStyle={{ color: "#9ca3af", fontSize: 11 }}
                      itemStyle={{ color: "#818cf8" }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={2}
                      dot={{ r: 3, fill: "#818cf8" }} name="Signups" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top streaks */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">🔥 Top Streaks</h2>
              {topStreaks.length === 0 ? (
                <p className="text-gray-500 text-sm">No streak data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                        <th className="text-left pb-2 font-semibold">#</th>
                        <th className="text-left pb-2 font-semibold">Child</th>
                        <th className="text-left pb-2 font-semibold">Parent</th>
                        <th className="text-right pb-2 font-semibold">Current</th>
                        <th className="text-right pb-2 font-semibold">Best</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topStreaks.map((s, i) => (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="py-2 text-gray-500">{i + 1}</td>
                          <td className="py-2 font-semibold text-white">{s.childName}</td>
                          <td className="py-2 text-gray-400 text-xs">{s.parentEmail}</td>
                          <td className="py-2 text-right text-orange-400 font-bold">{s.currentStreak} 🔥</td>
                          <td className="py-2 text-right text-gray-400">{s.longestStreak}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* SIGNUPS TAB */}
        {tab === "signups" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Recent Signups (last 20)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                    <th className="text-left pb-2 font-semibold">Email</th>
                    <th className="text-left pb-2 font-semibold">Name</th>
                    <th className="text-left pb-2 font-semibold">Plan</th>
                    <th className="text-left pb-2 font-semibold">Signed up</th>
                    <th className="text-center pb-2 font-semibold">Children</th>
                    <th className="text-center pb-2 font-semibold">Active?</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSignups.map((u) => (
                    <>
                      <tr key={u.id} className="border-b border-gray-800/50">
                        <td className="py-2 text-indigo-300 font-mono text-xs">{u.email}</td>
                        <td className="py-2 text-white">{u.name ?? "—"}</td>
                        <td className="py-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            u.plan === "PRO" ? "bg-indigo-900 text-indigo-300"
                            : u.plan === "FAMILY" ? "bg-emerald-900 text-emerald-300"
                            : "bg-gray-800 text-gray-400"}`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-2 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="py-2 text-center text-gray-300">{u.childCount}</td>
                        <td className="py-2 text-center">
                          {u.hasActivity
                            ? <span className="text-green-400 font-bold text-xs">✓ Yes</span>
                            : <span className="text-gray-500 text-xs">No</span>}
                        </td>
                      </tr>
                      {u.children.map((c, i) => (
                        <tr key={`${u.id}-${i}`} className="border-b border-gray-800/30 bg-gray-800/20">
                          <td colSpan={2} className="py-1.5 pl-6 text-xs text-gray-400">
                            ↳ {c.name}, age {c.age}
                          </td>
                          <td colSpan={2} className="py-1.5 text-xs text-gray-500">
                            {c.hasPlayed ? `🔥 ${c.streak} streak` : "No sessions yet"}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULES TAB */}
        {tab === "modules" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Sessions per module</h2>
              {moduleStats.length === 0 ? (
                <p className="text-gray-500 text-sm">No sessions yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={moduleStats.map((m) => ({ name: MODULE_LABELS[m.module] ?? m.module, sessions: m.sessions, fill: MODULE_COLORS[m.module] ?? "#6366F1" }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                    <Tooltip
                      contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 10 }}
                      labelStyle={{ color: "#9ca3af" }}
                      itemStyle={{ color: "#f9fafb" }}
                    />
                    <Bar dataKey="sessions" radius={[6, 6, 0, 0]}
                      fill="#6366F1"
                      label={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Module breakdown</h2>
              <div className="space-y-3">
                {moduleStats.map((m) => (
                  <div key={m.module}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-200 font-medium">{MODULE_LABELS[m.module] ?? m.module}</span>
                      <span className="text-gray-400 text-xs">{m.sessions} sessions · avg <span className={m.avgScore >= 80 ? "text-green-400" : m.avgScore >= 60 ? "text-yellow-400" : "text-red-400"}>{m.avgScore}%</span></span>
                    </div>
                    <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(2, (m.sessions / Math.max(...moduleStats.map(x => x.sessions))) * 100)}%`,
                          backgroundColor: MODULE_COLORS[m.module] ?? "#6366F1",
                        }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* INACTIVE TAB */}
        {tab === "inactive" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-1">Inactive accounts</h2>
            <p className="text-gray-500 text-xs mb-4">Signed up but no child has completed a session yet</p>
            {inactiveUsers.length === 0 ? (
              <p className="text-green-400 text-sm">🎉 All users have active children!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                      <th className="text-left pb-2 font-semibold">Email</th>
                      <th className="text-left pb-2 font-semibold">Name</th>
                      <th className="text-left pb-2 font-semibold">Signed up</th>
                      <th className="text-center pb-2 font-semibold">Children</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inactiveUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-800/50">
                        <td className="py-2 text-indigo-300 font-mono text-xs">{u.email}</td>
                        <td className="py-2 text-gray-300">{u.name ?? "—"}</td>
                        <td className="py-2 text-gray-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-2 text-center text-gray-400">{u.childCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
