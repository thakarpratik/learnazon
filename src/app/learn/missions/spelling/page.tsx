"use client";

import { useSession } from "next-auth/react";
import { PokemonSpellingMission } from "@/components/games/pokemon-spelling-mission";

export default function PokemonSpellingPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #FFF9C4 0%, #FFF3E0 100%)" }}>
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-3">⚡</div>
        <p className="font-baloo text-xl font-bold text-yellow-700">Loading your mission…</p>
      </div>
    </div>
  );

  const user = session?.user as any;
  const age  = user?.age ?? 7;

  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #FFF9C4 0%, #FFE0B2 40%, #FFF3E0 100%)" }}>

      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button
          onClick={() => history.back()}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-yellow-700 font-bold text-xl hover:bg-yellow-100 transition-colors"
          aria-label="Back"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">⚡</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-yellow-800 leading-tight">
              Pokémon Spelling Missions
            </h1>
            <p className="text-xs font-bold text-yellow-500">Spell words, catch Pokémon!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white"
          style={{ background: "#F9A825", boxShadow: "0 3px 0 #F57F17" }}>
          📖 Pokédex
        </div>
      </header>

      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <PokemonSpellingMission age={age} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
