"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { buildChildTheme, FAVORITE_GAMES } from "@/lib/personalisation";

const MODULES = [
  { id: "math",     label: "Math",        emoji: "🔢", href: "/learn/math"     },
  { id: "time",     label: "Time",        emoji: "🕐", href: "/learn/time"     },
  { id: "speaking", label: "Speaking",    emoji: "🎤", href: "/learn/speaking" },
  { id: "money",    label: "Money",       emoji: "💰", href: "/learn/money"    },
  { id: "words",    label: "Spelling",    emoji: "📝", href: "/learn/words"    },
  { id: "life",     label: "Life Skills", emoji: "🌱", href: "/learn/life"     },
];

const MASCOT_CHEERS = [
  "You can do it!",
  "Go go go!",
  "Amazing work!",
  "Keep going!",
  "You're a star!",
  "Believe in yourself!",
];

export function ChildDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [mascotCheer, setMascotCheer] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setTimeOfDay(h < 12 ? "morning" : h < 17 ? "afternoon" : "evening");
    setMascotCheer(MASCOT_CHEERS[Math.floor(Math.random() * MASCOT_CHEERS.length)]);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F7FA" }}>
        <div className="text-center">
          <div className="text-6xl animate-bounce-slow">🌟</div>
          <p className="font-fredoka text-2xl mt-4" style={{ color: "#3D5AFE" }}>Loading your world…</p>
        </div>
      </div>
    );
  }

  const user = session?.user as any;
  const age = user?.age ?? 7;
  const displayName = user?.nickname ?? user?.name ?? "Learner";
  const theme = buildChildTheme({
    favoriteColor: user?.favoriteColor,
    favoriteAnimal: user?.favoriteAnimal,
    favoriteGame: user?.favoriteGame,
    age,
  });

  const mascotDisplayName = user?.mascotName ? `${theme.animal} ${user.mascotName}` : theme.animal;
  const favoriteGameData = FAVORITE_GAMES.find((g) => g.id === user?.favoriteGame);

  const greetings: Record<string, string> = {
    morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening",
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(160deg, ${theme.lightBg} 0%, #F5F7FA 40%, ${theme.mediumBg} 100%)` }}>

      {/* Badge celebration overlay */}
      {newBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setNewBadge(null)}>
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl mx-4 animate-bounce-slow">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-2">New Badge!</h2>
            <p className="text-gray-500 mb-4">{newBadge.replace(/_/g, " ")}</p>
            <button className="py-3 px-8 rounded-full font-bold text-white text-lg"
              style={{ backgroundColor: theme.color }} onClick={() => setNewBadge(null)}>
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-5xl">{theme.animal}</span>
              {streak >= 3 && <span className="absolute -top-1 -right-1 text-sm">🔥</span>}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400">{greetings[timeOfDay]},</p>
              <h1 className="font-fredoka text-2xl font-bold text-gray-800">{displayName}! 👋</h1>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2">
            <Link href="/rewards"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 font-bold text-sm transition-colors"
              style={{ backgroundColor: theme.lightBg, color: theme.color, border: `1px solid ${theme.border}` }}
              aria-label={`${stars} stars`}>
              ⭐ {stars}
            </Link>
            <div className="flex items-center gap-1.5 rounded-full px-4 py-2 font-bold text-sm"
              style={{ backgroundColor: "#FFF3E0", color: "#E65100", border: "1px solid #FFB74D" }}
              aria-label={`${streak} day streak`}>
              🔥 {streak}
            </div>
          </div>
        </div>
      </header>

      {/* World banner */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="rounded-3xl p-6 border"
          style={{ background: `linear-gradient(135deg, ${theme.lightBg}, white)`, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-fredoka text-3xl font-bold text-gray-800">
                {theme.world} World 🌍
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Age {age} adventure • Pick a subject to play!
              </p>
              {favoriteGameData && (
                <p className="text-xs font-semibold mt-2 flex items-center gap-1"
                  style={{ color: theme.color }}>
                  {favoriteGameData.emoji} {favoriteGameData.label} fan
                </p>
              )}
            </div>
            {/* Mascot bubble */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute -top-8 right-0 bg-white rounded-2xl px-3 py-1.5 text-xs font-bold shadow-md whitespace-nowrap"
                  style={{ color: theme.color, border: `1px solid ${theme.border}` }}>
                  {mascotCheer}
                  <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white rotate-45"
                    style={{ borderRight: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }} />
                </div>
                <span className="text-5xl">{theme.animal}</span>
              </div>
              {user?.mascotName && (
                <p className="text-xs text-gray-400 mt-1 font-semibold">{user.mascotName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <main className="max-w-2xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {MODULES.map((mod) => (
            <Link key={mod.id} href={mod.href}
              className="group bg-white rounded-3xl overflow-hidden transition-all duration-200 focus-visible:outline-none"
              style={{
                border: `2px solid ${theme.border}`,
                boxShadow: `0 4px 16px ${theme.color}10`,
              }}
              aria-label={`Go to ${mod.label}`}>
              {/* Module header with theme colour */}
              <div className="p-6 flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${theme.color}20, ${theme.color}35)` }}>
                <span className="text-5xl group-hover:scale-110 transition-transform duration-200">{mod.emoji}</span>
              </div>
              <div className="p-4 text-center">
                <p className="font-fredoka text-lg font-bold text-gray-800">{mod.label}</p>
              </div>
              {/* Active indicator */}
              <div className="h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-3xl"
                style={{ backgroundColor: theme.color }} />
            </Link>
          ))}
        </div>

        {/* Daily streak nudge */}
        <div className="rounded-3xl p-5 border flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, white, ${theme.lightBg})`, borderColor: theme.border }}>
          <span className="text-4xl">{theme.animal}</span>
          <div>
            <p className="font-fredoka text-lg font-bold text-gray-800">
              {streak > 0 ? `${streak}-day streak! Keep it going!` : "Start your streak today!"}
            </p>
            <p className="text-sm text-gray-400">
              {streak > 0
                ? `${mascotDisplayName} is so proud of you 🎉`
                : `Complete an activity and ${mascotDisplayName} will cheer for you!`}
            </p>
          </div>
          {streak >= 3 && (
            <div className="ml-auto font-fredoka text-2xl font-bold" style={{ color: theme.color }}>
              🔥{streak}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
