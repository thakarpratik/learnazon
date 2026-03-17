"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const ALL_BADGES = [
  { type: "FIRST_STAR",    emoji: "⭐", label: "First Star",    desc: "Complete your first activity" },
  { type: "MATH_MASTER",   emoji: "🔢", label: "Math Master",   desc: "Score 100% in Math" },
  { type: "TIME_WIZARD",   emoji: "🕐", label: "Time Wizard",   desc: "Score 100% in Time Telling" },
  { type: "SPEECH_STAR",   emoji: "🎤", label: "Speech Star",   desc: "Complete a speaking challenge" },
  { type: "MONEY_WISE",    emoji: "💰", label: "Money Wise",    desc: "Score 100% in Money" },
  { type: "SPELL_BEE",     emoji: "📝", label: "Spell Bee",     desc: "Score 100% in Spelling" },
  { type: "LIFE_CHAMP",    emoji: "🌱", label: "Life Champ",    desc: "Complete a life skills activity" },
  { type: "STREAK_3",      emoji: "🔥", label: "3-Day Streak",  desc: "Learn 3 days in a row" },
  { type: "STREAK_7",      emoji: "🔥🔥",label: "7-Day Streak", desc: "Learn 7 days in a row" },
  { type: "STREAK_30",     emoji: "🔥🔥🔥", label: "30-Day Streak", desc: "Learn 30 days in a row" },
  { type: "PERFECT_SCORE", emoji: "🏆", label: "Perfect Score", desc: "Get 100% on any activity" },
];

export default function RewardsPage() {
  const { data: session } = useSession();
  const [stars, setStars] = useState(0);
  const [starsThisWeek, setStarsThisWeek] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [earned, setEarned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const childId = (session?.user as any)?.id;
    if (!childId) return;
    fetch(`/api/progress?childId=${childId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setStars(data.stars?.total ?? 0);
        setStarsThisWeek(data.stars?.thisWeek ?? 0);
        setStreak(data.streak?.currentStreak ?? 0);
        setLongestStreak(data.streak?.longestStreak ?? 0);
        setEarned((data.badges ?? []).map((b: any) => b.badgeType));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const earnedCount = earned.length;
  const totalBadges = ALL_BADGES.length;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #FFFBF5 100%)" }}>
      <header className="px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-2xl hover:scale-110 transition-transform" aria-label="Back to dashboard">←</Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          <h1 className="font-fredoka text-2xl font-bold text-gray-800">My Rewards</h1>
        </div>
      </header>

      <main className="px-4 pb-10 max-w-2xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card p-6 text-center border border-yellow-200 bg-yellow-50">
            <div className="text-4xl mb-2">⭐</div>
            <div className="font-fredoka text-4xl font-bold text-yellow-500">{loading ? "…" : stars}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Total Stars</div>
            {starsThisWeek > 0 && (
              <div className="text-xs text-yellow-600 font-bold mt-1">+{starsThisWeek} this week</div>
            )}
          </div>
          <div className="card p-6 text-center border border-orange-200 bg-orange-50">
            <div className="text-4xl mb-2">🔥</div>
            <div className="font-fredoka text-4xl font-bold text-orange-500">{loading ? "…" : streak}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Day Streak</div>
            {longestStreak > streak && (
              <div className="text-xs text-orange-600 font-bold mt-1">Best: {longestStreak} days</div>
            )}
          </div>
        </div>

        {/* Badge progress */}
        <div className="card p-5 mb-6 border border-purple-100">
          <div className="flex justify-between items-center mb-3">
            <p className="font-bold text-gray-700">Badge Collection</p>
            <p className="text-sm font-bold text-purple-600">{earnedCount}/{totalBadges}</p>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-700"
              style={{ width: `${(earnedCount / totalBadges) * 100}%` }} />
          </div>
        </div>

        {/* Badges grid */}
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isEarned = earned.includes(badge.type);
            return (
              <div key={badge.type}
                className={`card p-5 text-center border transition-all ${isEarned ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-fun" : "border-gray-100 opacity-50 grayscale"}`}
                aria-label={`${badge.label} badge ${isEarned ? "— earned!" : "— locked"}`}>
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <p className="font-bold text-sm text-gray-800">{badge.label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-snug">{badge.desc}</p>
                {isEarned && (
                  <span className="mt-2 inline-block bg-yellow-400 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    Earned! 🎉
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Encouragement */}
        {earnedCount < totalBadges && (
          <div className="mt-6 bg-white/70 rounded-3xl p-5 border border-white/80 text-center">
            <p className="font-fredoka text-lg font-bold text-gray-700 mb-1">
              {totalBadges - earnedCount} more badge{totalBadges - earnedCount !== 1 ? "s" : ""} to unlock!
            </p>
            <p className="text-sm text-gray-400">Keep playing to earn them all 🚀</p>
          </div>
        )}
      </main>
    </div>
  );
}
