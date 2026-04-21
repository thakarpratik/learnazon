"use client";
import { useSession } from "next-auth/react";
import { TalentSpeakingMission } from "@/components/games/talent-speaking-mission";

export default function SpeakingMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#FCE4EC,#F8BBD0)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">🎤</div>
        <p className="font-baloo text-xl font-bold text-pink-700">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#FCE4EC 0%,#F8BBD0 40%,#FCE4EC 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-pink-700 font-bold text-xl hover:bg-pink-100 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎤</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-pink-800 leading-tight">Talent Show Missions</h1>
            <p className="text-xs font-bold text-pink-500">Perform on stage, win stars!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#C2185B",boxShadow:"0 3px 0 #880E4F"}}>🌟 Main Stage</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <TalentSpeakingMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
