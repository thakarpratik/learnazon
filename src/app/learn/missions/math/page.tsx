"use client";

import { useSession } from "next-auth/react";
import { MinecraftMathMission } from "@/components/games/minecraft-math-mission";

export default function MinecraftMathPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)" }}>
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-3">⛏️</div>
        <p className="font-baloo text-xl font-bold text-green-700">Loading your mission…</p>
      </div>
    </div>
  );

  const user = session?.user as any;
  const age  = user?.age ?? 7;

  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #E8F5E9 0%, #C8E6C9 40%, #F1F8E9 100%)" }}>

      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button
          onClick={() => history.back()}
          className="w-10 h-10 rounded-sm flex items-center justify-center text-green-700 font-bold text-xl hover:bg-green-100 transition-colors"
          style={{borderRadius:"4px"}}
          aria-label="Back"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">⛏️</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-green-800 leading-tight">
              Minecraft Math Missions
            </h1>
            <p className="text-xs font-bold text-green-500">Craft answers, earn diamonds!</p>
          </div>
        </div>
        <div className="ml-auto rounded-sm px-3 py-1.5 text-xs font-bold text-white"
          style={{ background: "#4CAF50", boxShadow: "0 3px 0 #388E3C", borderRadius:"4px" }}>
          💎 Craft Table
        </div>
      </header>

      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <MinecraftMathMission age={age} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
