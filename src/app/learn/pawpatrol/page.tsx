"use client";

import { useSession } from "next-auth/react";
import { PawPatrolMission } from "@/components/games/pawpatrol-mission";

export default function PawPatrolPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" }}>
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-3">🐾</div>
        <p className="font-baloo text-xl font-bold text-blue-700">Loading your mission…</p>
      </div>
    </div>
  );

  const user = session?.user as any;
  const age  = user?.age ?? 7;

  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #E3F2FD 0%, #B3E5FC 40%, #E8F5E9 100%)" }}>

      {/* Header */}
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button
          onClick={() => history.back()}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-xl hover:bg-blue-100 transition-colors"
          aria-label="Back"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-blue-800 leading-tight">
              PAW Patrol Missions
            </h1>
            <p className="text-xs font-bold text-blue-500">Time Telling Adventure</p>
          </div>
        </div>
        {/* Ryder badge */}
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white"
          style={{ background: "#1565C0", boxShadow: "0 3px 0 #0D47A1" }}>
          🚁 Ryder HQ
        </div>
      </header>

      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <PawPatrolMission age={age} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
