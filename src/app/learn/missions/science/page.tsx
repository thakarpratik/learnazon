"use client";
import { useSession } from "next-auth/react";
import { ScienceLabMission } from "@/components/games/science-lab-mission";

export default function ScienceMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#E0F2F1,#B2DFDB)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">🧪</div>
        <p className="font-baloo text-xl font-bold text-teal-700">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#E0F2F1 0%,#B2DFDB 40%,#E0F2F1 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-teal-700 font-bold text-xl hover:bg-teal-100 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧪</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-teal-800 leading-tight">Science Lab Missions</h1>
            <p className="text-xs font-bold text-teal-500">Escape the lab with science!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#00695C",boxShadow:"0 3px 0 #004D40"}}>🔬 Lab HQ</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <ScienceLabMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
