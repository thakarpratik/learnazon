"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const MODULES = [
  { id: "math",     label: "Math",        emoji: "🔢", color: "from-orange-400 to-orange-500", href: "/learn/math"     },
  { id: "time",     label: "Time",        emoji: "🕐", color: "from-blue-400 to-blue-500",    href: "/learn/time"     },
  { id: "speaking", label: "Speaking",    emoji: "🎤", color: "from-green-400 to-green-500",  href: "/learn/speaking" },
  { id: "money",    label: "Money",       emoji: "💰", color: "from-yellow-400 to-yellow-500",href: "/learn/money"    },
  { id: "words",    label: "Spelling",    emoji: "📝", color: "from-purple-400 to-purple-500",href: "/learn/words"    },
  { id: "life",     label: "Life Skills", emoji: "🌱", color: "from-pink-400 to-pink-500",    href: "/learn/life"     },
];

const AGE_WORLDS: Record<number, { world: string; bg: string }> = {
  5:  { world: "Wonderland",  bg: "from-pink-200 via-yellow-100 to-green-200"  },
  6:  { world: "Adventure",   bg: "from-yellow-200 via-orange-100 to-pink-200" },
  7:  { world: "Explorer",    bg: "from-blue-200 via-purple-100 to-pink-200"   },
  8:  { world: "Champion",    bg: "from-green-200 via-teal-100 to-blue-200"    },
  9:  { world: "Discovery",   bg: "from-orange-200 via-yellow-100 to-green-200"},
  10: { world: "Galaxy",      bg: "from-purple-200 via-blue-100 to-green-200"  },
};

export function ChildDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    setTimeOfDay(h < 12 ? "morning" : h < 17 ? "afternoon" : "evening");
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role === "parent") router.push("/parent/children");
    }
  }, [status, session, router]);

  const fetchStats = useCallback(async () => {
    const childId = (session?.user as any)?.id;
    if (!childId) return;
    try {
      const res = await fetch(`/api/progress?childId=${childId}`);
      const data = await res.json();
      setStars(data.stars?.total ?? 0);
      setStreak(data.streak?.currentStreak ?? 0);
      setBadges((data.badges ?? []).map((b: any) => b.badgeType));
    } catch (e) { console.error(e); }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") fetchStats();
  }, [status, fetchStats]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="text-6xl animate-bounce-slow">🌟</div>
          <p className="font-fredoka text-2xl text-orange-500 mt-4">Loading your world…</p>
        </div>
      </div>
    );
  }

  const user = session?.user as any;
  const age = user?.age ?? 7;
  const name = user?.name ?? "Learner";
  const avatar = user?.avatar ?? "🦊";
  const worldInfo = AGE_WORLDS[age] ?? AGE_WORLDS[7];
  const greetings: Record<string, string> = { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${worldInfo.bg}`}>
      {/* Badge celebration overlay */}
      {newBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setNewBadge(null)}>
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl mx-4 animate-bounce-slow">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-2">New Badge!</h2>
            <p className="text-gray-500 mb-4">{newBadge.replace(/_/g, " ")}</p>
            <button className="btn-primary" onClick={() => setNewBadge(null)}>Awesome! 🎉</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-4 pt-6 pb-4 flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{avatar}</span>
          <div>
            <p className="text-sm font-semibold text-gray-500">{greetings[timeOfDay]},</p>
            <h1 className="font-fredoka text-2xl font-bold text-gray-800">{name}! 👋</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/rewards"
            className="flex items-center gap-1.5 bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2 font-bold text-yellow-700 text-sm hover:bg-yellow-200 transition-colors"
            aria-label={`${stars} stars — view rewards`}>
            ⭐ {stars}
          </Link>
          <div className="flex items-center gap-1.5 bg-orange-100 border border-orange-300 rounded-full px-4 py-2 font-bold text-orange-700 text-sm"
            aria-label={`${streak} day streak`}>
            🔥 {streak}
          </div>
          {badges.length > 0 && (
            <Link href="/rewards" className="flex items-center gap-1.5 bg-purple-100 border border-purple-300 rounded-full px-3 py-2 font-bold text-purple-700 text-sm hover:bg-purple-200 transition-colors">
              🏆 {badges.length}
            </Link>
          )}
        </div>
      </header>

      {/* World banner */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="bg-white/60 backdrop-blur rounded-3xl p-6 text-center border border-white/80 shadow-card">
          <p className="font-fredoka text-3xl md:text-4xl font-bold text-gray-800 mb-1">
            {worldInfo.world} World 🌍
          </p>
          <p className="text-gray-500 font-medium">Age {age} adventure — pick a subject to play!</p>
          {streak >= 3 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-1.5 text-sm font-bold">
              🔥 {streak} day streak — keep it up!
            </div>
          )}
        </div>
      </div>

      {/* Module grid */}
      <main className="max-w-2xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6" role="list" aria-label="Learning modules">
          {MODULES.map((mod) => (
            <Link key={mod.id} href={mod.href} role="listitem"
              className="group bg-white rounded-3xl shadow-card border border-white/80 overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
              aria-label={`Go to ${mod.label}`}>
              <div className={`bg-gradient-to-br ${mod.color} p-6 flex items-center justify-center`}>
                <span className="text-5xl group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                  {mod.emoji}
                </span>
              </div>
              <div className="p-4 text-center">
                <p className="font-fredoka text-lg font-bold text-gray-800">{mod.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Daily challenge */}
        <div className="bg-white/70 backdrop-blur rounded-3xl p-5 border border-white/80 flex items-center gap-4">
          <span className="text-4xl" aria-hidden="true">🎯</span>
          <div>
            <p className="font-fredoka text-lg font-bold text-gray-800">Daily Challenge</p>
            <p className="text-sm text-gray-500">
              {streak > 0 ? `${streak} day streak — play today to keep it going!` : "Complete 3 activities to start a streak!"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
