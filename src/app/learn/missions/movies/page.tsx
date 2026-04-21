"use client";
import { useSession } from "next-auth/react";
import { MovieStudioMission } from "@/components/games/movie-studio-mission";

export default function MoviesMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#1A1A2E,#16213E)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">🎬</div>
        <p className="font-baloo text-xl font-bold text-purple-300">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#1A1A2E 0%,#16213E 40%,#0F3460 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-purple-300 font-bold text-xl hover:bg-purple-900 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎬</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-white leading-tight">Movie Studio Missions</h1>
            <p className="text-xs font-bold text-purple-400">Guess the film, win an Oscar!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#7B1FA2",boxShadow:"0 3px 0 #4A0072"}}>🏆 Studio A</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <MovieStudioMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
