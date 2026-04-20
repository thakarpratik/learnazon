"use client";

import { useState, useEffect } from "react";

export type GameMode = "adventure" | "quiz";

const STORAGE_KEY = "flinchi_game_mode";

export function useGameMode(): [GameMode | null, (m: GameMode) => void] {
  const [mode, setModeState] = useState<GameMode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as GameMode | null;
    if (stored === "adventure" || stored === "quiz") setModeState(stored);
    else setModeState(null); // triggers modal
  }, []);

  const setMode = (m: GameMode) => {
    localStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  };

  return [mode, setMode];
}

interface Props {
  displayName: string;
  favoriteColor: string;
  onChoose: (mode: GameMode) => void;
}

export function LearningStyleModal({ displayName, favoriteColor, onChoose }: Props) {
  const [picked, setPicked] = useState<GameMode | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>

      <div className="w-full max-w-sm rounded-[28px] overflow-hidden"
        style={{ background: "white", border: "3px solid #C7D2FE", boxShadow: "0 16px 0 rgba(79,70,229,0.2), 0 8px 40px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div className="px-6 pt-7 pb-4 text-center"
          style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F5F3FF 100%)" }}>
          <div className="text-5xl mb-3">👋</div>
          <h2 className="font-baloo text-2xl font-extrabold text-gray-900 leading-tight">
            Hey {displayName}!
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            How do you want to learn today?
          </p>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {/* Adventure */}
          <button
            onClick={() => setPicked("adventure")}
            className="w-full rounded-[20px] p-4 text-left transition-all duration-150 hover:-translate-y-1"
            style={{
              background: picked === "adventure"
                ? "linear-gradient(135deg, #E3F2FD, #BBDEFB)"
                : "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
              border: `3px solid ${picked === "adventure" ? "#1565C0" : "#86EFAC"}`,
              boxShadow: picked === "adventure"
                ? "0 5px 0 #1565C060"
                : "0 5px 0 #86EFAC60",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: picked === "adventure" ? "#1565C020" : "#DCFCE7", border: "2px solid #86EFAC" }}>
                🎮
              </div>
              <div>
                <p className="font-baloo text-lg font-extrabold text-gray-800">Adventure Mode</p>
                <p className="text-xs font-bold text-gray-500">Stories, missions &amp; characters</p>
                <div className="flex gap-1 mt-1">
                  {["🐾","⚡","🏆"].map(e => <span key={e} className="text-sm">{e}</span>)}
                  <span className="text-xs font-bold text-green-600 ml-1">More fun!</span>
                </div>
              </div>
              {picked === "adventure" && (
                <div className="ml-auto w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "#1565C0" }}>✓</div>
              )}
            </div>
          </button>

          {/* Quiz */}
          <button
            onClick={() => setPicked("quiz")}
            className="w-full rounded-[20px] p-4 text-left transition-all duration-150 hover:-translate-y-1"
            style={{
              background: picked === "quiz"
                ? "linear-gradient(135deg, #FFF7ED, #FEF3C7)"
                : "linear-gradient(135deg, #FFF7ED, #FFFBF5)",
              border: `3px solid ${picked === "quiz" ? "#F97316" : "#FCD34D"}`,
              boxShadow: picked === "quiz"
                ? "0 5px 0 #F9731660"
                : "0 5px 0 #FCD34D60",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: picked === "quiz" ? "#FFF7ED" : "#FEF9C3", border: "2px solid #FCD34D" }}>
                📝
              </div>
              <div>
                <p className="font-baloo text-lg font-extrabold text-gray-800">Quiz Mode</p>
                <p className="text-xs font-bold text-gray-500">Quick questions &amp; fast stars</p>
                <div className="flex gap-1 mt-1">
                  {["⭐","⭐","⭐"].map((e,i) => <span key={i} className="text-sm">{e}</span>)}
                  <span className="text-xs font-bold text-orange-600 ml-1">Fast &amp; focused!</span>
                </div>
              </div>
              {picked === "quiz" && (
                <div className="ml-auto w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "#F97316" }}>✓</div>
              )}
            </div>
          </button>

          {/* Confirm */}
          <button
            disabled={!picked}
            onClick={() => picked && onChoose(picked)}
            className="w-full py-4 rounded-2xl font-baloo text-lg font-extrabold text-white transition-all duration-150 mt-1"
            style={{
              background: picked
                ? picked === "adventure"
                  ? "linear-gradient(135deg, #1565C0, #42A5F5)"
                  : "linear-gradient(135deg, #F97316, #FB923C)"
                : "#E5E7EB",
              color: picked ? "white" : "#9CA3AF",
              boxShadow: picked
                ? picked === "adventure" ? "0 5px 0 #0D47A160" : "0 5px 0 #C2410C60"
                : "none",
              cursor: picked ? "pointer" : "not-allowed",
            }}
          >
            {picked ? "Let's Go! 🚀" : "Pick one above ↑"}
          </button>

          <p className="text-center text-xs text-gray-400 font-medium">
            You can change this anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
