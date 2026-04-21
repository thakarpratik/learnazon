"use client";
import { useSession } from "next-auth/react";
import { SpanishTravelMission } from "@/components/games/spanish-travel-mission";

export default function SpanishMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#FFF3E0,#FFE0B2)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">🌍</div>
        <p className="font-baloo text-xl font-bold text-orange-700">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#FFF3E0 0%,#FFE0B2 40%,#FFF3E0 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-orange-700 font-bold text-xl hover:bg-orange-100 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌍</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-orange-800 leading-tight">España Travel Missions</h1>
            <p className="text-xs font-bold text-orange-500">Travel the world, speak Spanish!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#E65100",boxShadow:"0 3px 0 #BF360C"}}>🗺️ World Tour</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <SpanishTravelMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
