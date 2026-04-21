"use client";
import { useSession } from "next-auth/react";
import { StoryWritingMission } from "@/components/games/story-writing-mission";

export default function WritingMissionPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#EDE7F6,#D1C4E9)"}}>
      <div className="text-center"><div className="text-6xl animate-bounce mb-3">📜</div>
        <p className="font-baloo text-xl font-bold text-purple-700">Loading your mission…</p></div>
    </div>
  );
  const user = session?.user as any;
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#EDE7F6 0%,#D1C4E9 40%,#EDE7F6 100%)"}}>
      <header className="px-4 pt-5 pb-3 max-w-lg mx-auto flex items-center gap-3">
        <button onClick={() => history.back()} className="w-10 h-10 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xl hover:bg-purple-100 transition-colors" aria-label="Back">←</button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">📜</span>
          <div>
            <h1 className="font-baloo text-xl font-extrabold text-purple-800 leading-tight">Story Quest Missions</h1>
            <p className="text-xs font-bold text-purple-500">Write the adventure, earn your badge!</p>
          </div>
        </div>
        <div className="ml-auto rounded-2xl px-3 py-1.5 text-xs font-bold text-white" style={{background:"#4A148C",boxShadow:"0 3px 0 #2D0058"}}>✍️ Author&apos;s Den</div>
      </header>
      <main className="px-4 pb-12 pt-2 max-w-lg mx-auto">
        <StoryWritingMission age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
