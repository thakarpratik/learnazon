"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  childId: string;
  parentId: string;
  childName: string;
  avatar: string;
  color: string;
}

export function ChildSwitchButton({ childId, parentId, childName, avatar, color }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    setLoading(true);
    try {
      const result = await signIn("parent-switch", {
        childId,
        parentId,
        redirect: false,
      });

      if (result?.error) {
        console.error("Switch failed:", result.error);
        return;
      }

      // Redirect to child dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Switch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0"
      style={{
        backgroundColor: color + "15",
        color: color,
        border: `2px solid ${color}40`,
        boxShadow: `0 2px 8px ${color}20`,
      }}
      aria-label={`Login as ${childName}`}
    >
      <span className="text-lg">{avatar}</span>
      {loading ? "Switching…" : `Play as ${childName}`}
      {!loading && <span className="text-base">→</span>}
    </button>
  );
}
