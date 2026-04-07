"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { SpellingGame } from "@/components/games/spelling-game";
import { LevelPicker, effectiveAge, type Level } from "@/components/games/level-picker";

export default function SpellingGamePage() {
  const { data: session, status } = useSession();
  const [level, setLevel] = useState<Level | null>(null);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-5xl animate-bounce-slow">📝</div>
    </div>
  );

  const user = session?.user as any;
  const age = user?.age ?? 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => level ? setLevel(null) : history.back()}
          className="text-2xl hover:scale-110 transition-transform"
          aria-label="Back"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">📝</span>
          <h1 className="font-fredoka text-2xl font-bold text-gray-800">Spelling</h1>
        </div>
      </header>
      <main className="px-4 pb-10 max-w-2xl mx-auto">
        {!level
          ? <LevelPicker onSelect={setLevel} moduleEmoji="📝" moduleName="Spelling Challenge" accentColor="#A78BFA" />
          : <SpellingGame age={effectiveAge(age, level)} childId={user?.id ?? ""} />
        }
      </main>
    </div>
  );
}
