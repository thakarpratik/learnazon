"use client";

import { useState, useEffect } from "react";

const NAMES = [
  "Ryan", "Sophia", "Jake", "Amelia", "Noah", "Isla", "Ethan", "Mia",
  "Lucas", "Olivia", "Liam", "Ava", "Mason", "Emma", "Aiden", "Lily",
  "James", "Chloe", "Oliver", "Zoe", "Ben", "Priya", "Kai", "Sara",
  "Leo", "Nadia", "Sam", "Ruby", "Max", "Aria",
];

const ACTIVITIES = [
  { label: "a Maths Adventure",    emoji: "🔢", color: "#F97316" },
  { label: "Public Speaking",      emoji: "🎤", color: "#34D399" },
  { label: "a Spelling Challenge", emoji: "📝", color: "#A78BFA" },
  { label: "Time Telling",         emoji: "🕐", color: "#4F46E5" },
  { label: "Money Skills",         emoji: "💰", color: "#FBBF24" },
  { label: "Life Skills",          emoji: "🌱", color: "#FB7185" },
  { label: "Science Explorer",     emoji: "🔬", color: "#14B8A6" },
  { label: "Writing Practice",     emoji: "✍️", color: "#6366F1" },
  { label: "Spanish",              emoji: "🇪🇸", color: "#EF4444" },
  { label: "Movies",               emoji: "🎬", color: "#7C3AED" },
];

function randomPick<T>(arr: T[], exclude?: T): T {
  let pick: T;
  do { pick = arr[Math.floor(Math.random() * arr.length)]; } while (pick === exclude);
  return pick;
}

function generateActivity() {
  return {
    name:     randomPick(NAMES),
    activity: randomPick(ACTIVITIES),
    id:       Math.random(),
  };
}

// Pre-generate 3 stable entries (avoids hydration mismatch — seeded consistently)
const SEED: ReturnType<typeof generateActivity>[] = [
  { name: "Ryan",   activity: ACTIVITIES[0], id: 1 },
  { name: "Sophia", activity: ACTIVITIES[2], id: 2 },
  { name: "Jake",   activity: ACTIVITIES[1], id: 3 },
];

export function LiveActivityTicker() {
  const [items, setItems] = useState(SEED);
  const [fadingId, setFadingId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      // Pick a random slot to replace
      const slotIdx = Math.floor(Math.random() * 3);
      const current = items[slotIdx];
      setFadingId(current.id);

      setTimeout(() => {
        setItems((prev) => {
          const next = [...prev];
          next[slotIdx] = generateActivity();
          return next;
        });
        setFadingId(null);
      }, 400);
    }, 2800);

    return () => clearInterval(interval);
  }, [mounted, items]);

  return (
    <div className="mt-6 text-left">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live right now</span>
      </div>

      {/* Activity list */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="inline-flex items-center gap-2.5 transition-all duration-400"
            style={{ opacity: fadingId === item.id ? 0 : 1 }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: item.activity.color + "20", border: `1.5px solid ${item.activity.color}40` }}
              aria-hidden="true"
            >
              {item.activity.emoji}
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--text)" }}>{item.name}</span>
              {" is learning "}
              <span style={{ color: item.activity.color, fontWeight: 700 }}>{item.activity.label}</span>
              {" right now"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
