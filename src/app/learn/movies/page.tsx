"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MoviesGame } from "@/components/games/movies-game";
import { LevelPicker, type Level } from "@/components/games/level-picker";

export default function MoviesPage() {
  const { data: session, status } = useSession();
  const [level, setLevel] = useState<Level | null>(null);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-5xl animate-bounce-slow">🎬</div>
    </div>
  );

  const user = session?.user as any;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #FAF5FF 100%)" }}>
      <header className="px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => level ? setLevel(null) : history.back()}
          className="text-2xl hover:scale-110 transition-transform"
          aria-label="Back"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎬</span>
          <h1 className="font-fredoka text-2xl font-bold text-gray-800">Movies</h1>
        </div>
      </header>
      <main className="px-4 pb-10 max-w-2xl mx-auto">
        {!level
          ? <LevelPicker onSelect={setLevel} moduleEmoji="🎬" moduleName="Movie Buff Quiz" accentColor="#7C3AED" />
          : <MoviesGame age={user?.age ?? 7} childId={user?.id ?? ""} level={level} />
        }
      </main>
    </div>
  );
}
