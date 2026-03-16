"use client";
import { useSession } from "next-auth/react";
import { SpellingGame } from "@/components/games/spelling-game";
import Link from "next/link";

export default function SpellingGamePage() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-bounce-slow">📝</div></div>;
  const user = session?.user as any;
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-2xl hover:scale-110 transition-transform" aria-label="Back">←</Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">📝</span>
          <h1 className="font-fredoka text-2xl font-bold text-gray-800">Spelling</h1>
        </div>
      </header>
      <main className="px-4 pb-10 max-w-2xl mx-auto">
        <SpellingGame age={user?.age ?? 7} childId={user?.id ?? ""} />
      </main>
    </div>
  );
}
