"use client";

import { useSession } from "next-auth/react";
import { MathGame } from "@/components/games/math-game";
import Link from "next/link";

export default function MathPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-bounce-slow">🔢</div></div>;

  const user = session?.user as any;
  const age = user?.age ?? 7;
  const childId = user?.id ?? "";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #FFFBF5 100%)" }}>
      <header className="px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-2xl hover:scale-110 transition-transform" aria-label="Back to dashboard">←</Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔢</span>
          <h1 className="font-fredoka text-2xl font-bold text-gray-800">Math Challenge</h1>
        </div>
      </header>
      <main className="px-4 pb-10 max-w-2xl mx-auto">
        <MathGame age={age} childId={childId} questionCount={5} />
      </main>
    </div>
  );
}
