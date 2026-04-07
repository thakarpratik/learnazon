"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MathGame } from "@/components/games/math-game";
import { LevelPicker, type Level } from "@/components/games/level-picker";
import Link from "next/link";

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type Phase = "level" | "tables-select" | "game";

export default function MathPage() {
  const { data: session, status } = useSession();
  const [phase, setPhase] = useState<Phase>("level");
  const [level, setLevel] = useState<Level>("medium");
  const [tablesMode, setTablesMode] = useState<number | null>(null);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-5xl animate-bounce-slow">🔢</div>
    </div>
  );

  const user = session?.user as any;
  const age = user?.age ?? 7;
  const childId = user?.id ?? "";

  const handleLevelSelect = (l: Level) => {
    setLevel(l);
    setPhase("game");
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #FFFBF5 100%)" }}>
      <header className="px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => {
            if (phase === "game") { setPhase("level"); setTablesMode(null); }
            else if (phase === "tables-select") setPhase("level");
            else history.back();
          }}
          className="text-2xl hover:scale-110 transition-transform"
          aria-label="Back"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔢</span>
          <h1 className="font-fredoka text-2xl font-bold text-gray-800">Math Challenge</h1>
        </div>
      </header>

      <main className="px-4 pb-10 max-w-2xl mx-auto">
        {phase === "level" && (
          <div>
            <LevelPicker
              onSelect={handleLevelSelect}
              moduleEmoji="🔢"
              moduleName="Math Challenge"
              accentColor="#F97316"
            />

            {/* Times Tables shortcut */}
            <div className="mt-6">
              <button
                onClick={() => setPhase("tables-select")}
                className="w-full flex items-center gap-4 rounded-3xl p-5 text-left transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none"
                style={{ background: "#EEF2FF", border: "3px solid #818CF8", boxShadow: "0 5px 0 #818CF880" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: "white", border: "2px solid #818CF8", boxShadow: "0 3px 0 #818CF860" }}>
                  ×
                </div>
                <div>
                  <p className="font-fredoka text-xl font-bold text-indigo-700">Times Tables</p>
                  <p className="text-sm font-medium text-gray-500">Practise any table from ×2 to ×12</p>
                </div>
                <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {phase === "tables-select" && (
          <div className="max-w-lg mx-auto text-center">
            <div className="text-7xl mb-3 animate-bounce-slow">✖️</div>
            <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-1">Times Tables</h2>
            <p className="text-gray-500 font-medium mb-8">Which table do you want to practise?</p>
            <div className="grid grid-cols-4 gap-3">
              {TABLES.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTablesMode(t); setPhase("game"); }}
                  className="rounded-2xl py-4 font-fredoka text-2xl font-bold transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "#EEF2FF", border: "3px solid #818CF8", boxShadow: "0 4px 0 #818CF880", color: "#3730A3" }}
                >
                  ×{t}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "game" && (
          <MathGame
            age={age}
            childId={childId}
            questionCount={level === "easy" ? 5 : level === "medium" ? 7 : 10}
            level={level}
            tablesMode={tablesMode}
          />
        )}
      </main>
    </div>
  );
}
