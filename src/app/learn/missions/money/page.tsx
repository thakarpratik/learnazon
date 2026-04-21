"use client";
import { useSession } from "next-auth/react";
import { MarioMoneyMission } from "@/components/games/mario-money-mission";

export default function MoneyMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#FFFDE7,#FFF9C4)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">🪙</div>
        <p className="font-baloo text-xl font-bold text-yellow-700">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#FFFDE7 0%,#FFF9C4 40%,#FFFDE7 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-yellow-700 font-bold text-xl hover:bg-yellow-100 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🪙</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-yellow-800 leading-tight">Mario Money Missions</h1>
            <p className="text-xs font-bold text-yellow-500">Collect coins, learn money!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#C62828",boxShadow:"0 3px 0 #8B0000"}}>🍄 World 1-1</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <MarioMoneyMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
