"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { buildChildTheme, FAVORITE_GAMES } from "@/lib/personalisation";

const MODULES = [
  {
    id: "math",     label: "Math",        href: "/learn/math",
    bg: "#FFF7ED", border: "#F97316", iconColor: "#C2410C",
    iconPath: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.616 4.5 4.698V18a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18V4.698c0-1.082-.807-1.998-1.907-2.126A48.507 48.507 0 0012 2.25z",
  },
  {
    id: "time",     label: "Time",        href: "/learn/time",
    bg: "#EEF2FF", border: "#4F46E5", iconColor: "#3730A3",
    iconPath: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "speaking", label: "Speaking",    href: "/learn/speaking",
    bg: "#ECFDF5", border: "#34D399", iconColor: "#065F46",
    iconPath: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  },
  {
    id: "money",    label: "Money",       href: "/learn/money",
    bg: "#FFFBEB", border: "#FBBF24", iconColor: "#92400E",
    iconPath: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "words",    label: "Spelling",    href: "/learn/words",
    bg: "#F5F3FF", border: "#A78BFA", iconColor: "#5B21B6",
    iconPath: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    id: "life",     label: "Life Skills", href: "/learn/life",
    bg: "#FFF1F2", border: "#FB7185", iconColor: "#9F1239",
    iconPath: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z",
  },
] as const;

const CHEERS = [
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
  const [stars, setStars]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [badges, setBadges]       = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [newBadge, setNewBadge]   = useState<string | null>(null);
  const [cheer, setCheer]         = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setTimeOfDay(h < 12 ? "morning" : h < 17 ? "afternoon" : "evening");
    setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
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
      const res  = await fetch(`/api/progress?childId=${childId}`);
      const data = await res.json();
      setStars(data.stars?.total ?? 0);
      setStreak(data.streak?.currentStreak ?? 0);
      setBadges((data.badges ?? []).map((b: any) => b.badgeType));
    } catch (e) { console.error(e); }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") fetchStats();
  }, [status, fetchStats]);

  /* ── Loading screen ── */
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#EEF2FF" }}>
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-5 animate-bounce-slow"
            style={{ background: "linear-gradient(135deg, #4F46E5, #818CF8)", border: "3px solid #3730A3", boxShadow: "0 6px 0 rgba(55,48,163,0.4)" }}
            aria-hidden="true"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="font-baloo text-2xl font-bold" style={{ color: "var(--indigo)" }}>Loading your world…</p>
        </div>
      </div>
    );
  }

  const user           = session?.user as any;
  const age            = user?.age ?? 7;
  const displayName    = user?.nickname ?? user?.name ?? "Learner";
  const theme          = buildChildTheme({
    favoriteColor:  user?.favoriteColor,
    favoriteAnimal: user?.favoriteAnimal,
    favoriteGame:   user?.favoriteGame,
    age,
  });

  const mascotName     = user?.mascotName ? user.mascotName : theme.animal;
  const favoriteGame   = FAVORITE_GAMES.find((g) => g.id === user?.favoriteGame);

  const greetings: Record<string, string> = {
    morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening",
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F5F3FF 60%, #EEF2FF 100%)" }}
    >

      {/* ── Badge celebration overlay ── */}
      {newBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setNewBadge(null)}
          role="dialog"
          aria-modal="true"
          aria-label="New badge earned"
        >
          <div
            className="rounded-[24px] p-10 text-center mx-4 animate-pop-in"
            style={{
              background: "white",
              border: "3px solid var(--border)",
              boxShadow: "0 12px 0 rgba(79,70,229,0.2), 0 6px 40px rgba(0,0,0,0.2)",
              maxWidth: 360,
            }}
          >
            <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, #FBBF24, #FCD34D)", border: "3px solid #D97706", boxShadow: "0 5px 0 #D97706" }}
              aria-hidden="true"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-extrabold mb-2" style={{ color: "var(--text)" }}>
              New Badge!
            </h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>{newBadge.replace(/_/g, " ")}</p>
            <button
              className="btn-primary w-full"
              style={{ background: theme.color }}
              onClick={() => setNewBadge(null)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Avatar + greeting */}
          <div className="flex items-center gap-3">
            <div
              className="relative w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl select-none"
              style={{
                background: `linear-gradient(135deg, ${theme.color}25, ${theme.color}40)`,
                border:     `3px solid ${theme.border}`,
                boxShadow:  `0 4px 0 ${theme.border}`,
              }}
              aria-hidden="true"
            >
              {theme.animal}
              {streak >= 3 && (
                <span className="absolute -top-2 -right-2 text-xs bg-orange-100 rounded-full w-5 h-5 flex items-center justify-center border-2 border-orange-300">
                  🔥
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">{greetings[timeOfDay]},</p>
              <h1 className="font-baloo text-2xl font-extrabold" style={{ color: "var(--text)" }}>
                {displayName}!
              </h1>
            </div>
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-2">
            <Link
              href="/rewards"
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 font-bold text-sm transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: "#FFFBEB",
                color:      "#92400E",
                border:     "2px solid #FBBF24",
                boxShadow:  "0 3px 0 #FBBF2460",
              }}
              aria-label={`${stars} stars`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
                <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"/>
              </svg>
              {stars}
            </Link>
            <div
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 font-bold text-sm"
              style={{
                background: "#FFF7ED",
                color:      "#C2410C",
                border:     "2px solid #F97316",
                boxShadow:  "0 3px 0 #F9731660",
              }}
              aria-label={`${streak} day streak`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316" aria-hidden="true">
                <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
                <path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>
              </svg>
              {streak}d
            </div>
          </div>
        </div>
      </header>

      {/* ── World banner ── */}
      <div className="max-w-2xl mx-auto px-4 mb-5">
        <div
          className="rounded-[24px] p-5"
          style={{
            background:  `linear-gradient(135deg, ${theme.color}18, ${theme.color}30)`,
            border:      `3px solid ${theme.border}`,
            boxShadow:   `0 5px 0 ${theme.border}60`,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-baloo text-2xl font-extrabold leading-tight" style={{ color: "var(--text)" }}>
                {theme.world} World
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "var(--muted)" }}>
                Age {age} · Pick a subject to play!
              </p>
              {favoriteGame && (
                <p className="text-xs font-extrabold mt-1.5" style={{ color: theme.color }}>
                  {favoriteGame.emoji} {favoriteGame.label} fan
                </p>
              )}
            </div>

            {/* Mascot speech bubble */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative mb-1">
                {/* Speech bubble */}
                <div
                  className="absolute -top-9 right-0 rounded-2xl px-3 py-1.5 text-xs font-bold whitespace-nowrap"
                  style={{
                    background:  "white",
                    color:       theme.color,
                    border:      `2px solid ${theme.border}`,
                    boxShadow:   `0 2px 0 ${theme.border}`,
                  }}
                >
                  {cheer}
                  <div
                    className="absolute bottom-[-7px] right-4 w-3 h-3 bg-white rotate-45"
                    style={{ borderRight: `2px solid ${theme.border}`, borderBottom: `2px solid ${theme.border}` }}
                  />
                </div>
                <div
                  className="w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl"
                  style={{
                    background:  `${theme.color}20`,
                    border:      `3px solid ${theme.border}`,
                    boxShadow:   `0 4px 0 ${theme.border}`,
                  }}
                  aria-hidden="true"
                >
                  {theme.animal}
                </div>
              </div>
              {user?.mascotName && (
                <p className="text-xs font-bold mt-1" style={{ color: theme.color }}>{user.mascotName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Module grid ── */}
      <main className="max-w-2xl mx-auto px-4 pb-10" id="main-content">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-5">
          {MODULES.map((mod) => (
            <Link
              key={mod.id}
              href={mod.href}
              className="group bg-white rounded-[20px] overflow-hidden transition-all duration-200 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2"
              style={{
                border:     `3px solid ${mod.border}`,
                boxShadow:  `0 5px 0 ${mod.border}70`,
              }}
              aria-label={`Go to ${mod.label}`}
            >
              {/* Icon area */}
              <div
                className="p-5 flex items-center justify-center"
                style={{ background: mod.bg }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: "white", border: `2px solid ${mod.border}`, boxShadow: `0 3px 0 ${mod.border}60` }}
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={mod.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={mod.iconPath} />
                  </svg>
                </div>
              </div>
              {/* Label */}
              <div className="px-3 pb-4 pt-2 text-center">
                <p className="font-baloo text-base font-extrabold" style={{ color: "var(--text)" }}>
                  {mod.label}
                </p>
              </div>
              {/* Bottom accent bar */}
              <div
                className="h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-xl"
                style={{ background: mod.border }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* ── Streak nudge ── */}
        <div
          className="rounded-[20px] p-5 flex items-center gap-4"
          style={{
            background:  "white",
            border:      `3px solid ${streak > 0 ? "#F97316" : "var(--border)"}`,
            boxShadow:   `0 5px 0 ${streak > 0 ? "#F9731660" : "var(--border)"}`,
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background:  streak > 0 ? "#FFF7ED" : "var(--indigo-light)",
              border:      `2px solid ${streak > 0 ? "#F97316" : "var(--indigo-soft)"}`,
            }}
            aria-hidden="true"
          >
            {theme.animal}
          </div>
          <div className="min-w-0">
            <p className="font-baloo text-lg font-extrabold" style={{ color: "var(--text)" }}>
              {streak > 0
                ? `${streak}-day streak! Keep it going!`
                : "Start your streak today!"}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
              {streak > 0
                ? `${mascotName} is so proud of you!`
                : `Complete an activity and ${mascotName} will cheer for you!`}
            </p>
          </div>
          {streak >= 3 && (
            <div
              className="ml-auto font-baloo text-2xl font-extrabold flex-shrink-0"
              style={{ color: "#F97316" }}
              aria-hidden="true"
            >
              🔥{streak}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
