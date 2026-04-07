"use client";

export type Level = "easy" | "medium" | "advanced";

const LEVELS: { id: Level; emoji: string; label: string; desc: string; bg: string; border: string; text: string }[] = [
  { id: "easy",     emoji: "🌱", label: "Easy",     desc: "Warm up & build confidence",    bg: "#F0FDF4", border: "#4ADE80", text: "#15803D" },
  { id: "medium",   emoji: "⭐", label: "Medium",   desc: "A good challenge for you",       bg: "#FFFBEB", border: "#FBBF24", text: "#92400E" },
  { id: "advanced", emoji: "🔥", label: "Advanced", desc: "Push your limits — go big!",     bg: "#FFF1F2", border: "#FB7185", text: "#9F1239" },
];

interface LevelPickerProps {
  onSelect: (level: Level) => void;
  moduleEmoji: string;
  moduleName: string;
  accentColor?: string;
}

export function LevelPicker({ onSelect, moduleEmoji, moduleName, accentColor = "#4F46E5" }: LevelPickerProps) {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="text-7xl mb-3 animate-bounce-slow">{moduleEmoji}</div>
      <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-1">{moduleName}</h2>
      <p className="text-gray-500 font-medium mb-8">Pick your level to begin!</p>

      <div className="flex flex-col gap-4">
        {LEVELS.map((lv) => (
          <button
            key={lv.id}
            onClick={() => onSelect(lv.id)}
            className="flex items-center gap-5 rounded-3xl p-5 text-left transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4"
            style={{
              background:   lv.bg,
              border:       `3px solid ${lv.border}`,
              boxShadow:    `0 5px 0 ${lv.border}80`,
            }}
            aria-label={`${lv.label} level — ${lv.desc}`}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "white", border: `2px solid ${lv.border}`, boxShadow: `0 3px 0 ${lv.border}60` }}
              aria-hidden="true"
            >
              {lv.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-fredoka text-xl font-bold" style={{ color: lv.text }}>{lv.label}</p>
              <p className="text-sm font-medium text-gray-500">{lv.desc}</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lv.border} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Maps a chosen level + base age to an effective age used by game generators */
export function effectiveAge(age: number, level: Level): number {
  if (level === "easy")     return Math.max(5, age - 2);
  if (level === "advanced") return Math.min(13, age + 2);
  return age; // medium = unchanged
}
