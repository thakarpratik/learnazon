"use client";
import { useSession } from "next-auth/react";
import { SuperheroLifeSkillsMission } from "@/components/games/superhero-lifeskills-mission";

export default function LifeMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#E8EAF6,#C5CAE9)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">🦸</div>
        <p className="font-baloo text-xl font-bold text-indigo-700">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#E8EAF6 0%,#C5CAE9 40%,#E8EAF6 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-indigo-700 font-bold text-xl hover:bg-indigo-100 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🦸</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-indigo-800 leading-tight">Superhero Life Missions</h1>
            <p className="text-xs font-bold text-indigo-500">Make wise choices, be the hero!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#1A237E",boxShadow:"0 3px 0 #0D1457"}}>🏅 Hero HQ</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <SuperheroLifeSkillsMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
