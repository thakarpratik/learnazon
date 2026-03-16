"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AVATARS = ["🦊","🐼","🦁","🐨","🐸","🦋","🐬","🦄","🐧","🐯","🦖","🚀"];

export function AddChildForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [avatar, setAvatar] = useState("🦊");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePinInput = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[i] = value.slice(-1);
    setPin(next);
    if (value && i < 3) document.getElementById(`cpin-${i + 1}`)?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your child's name");
    if (!age) return setError("Please select your child's age");
    const fullPin = pin.join("");
    if (fullPin.length < 4) return setError("Please set a 4-digit PIN");

    setLoading(true);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), age, pin: fullPin, avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to add child");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Avatar picker */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-3">Pick an avatar</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map((a) => (
              <button key={a} type="button" onClick={() => setAvatar(a)}
                className={`text-3xl p-2 rounded-xl transition-all ${avatar === a ? "bg-orange-100 ring-2 ring-orange-400 scale-110" : "hover:bg-gray-100"}`}
                aria-label={`Select ${a} avatar`} aria-pressed={avatar === a}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label htmlFor="child-name" className="block text-sm font-bold text-gray-800 mb-2">Child&apos;s name</label>
          <input id="child-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-blue focus:outline-none font-medium"
            placeholder="e.g. Emma" autoComplete="off" />
        </div>

        {/* Age */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-800 mb-3">Age</label>
          <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Child's age">
            {[5,6,7,8,9,10].map((a) => (
              <button key={a} type="button" role="radio" aria-checked={age === a}
                onClick={() => setAge(a)}
                className={`py-3 rounded-xl font-bold text-lg transition-all ${age === a ? "bg-orange-500 text-white shadow-fun" : "bg-orange-50 text-brand-blue hover:bg-orange-100"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* PIN */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Set a secret 4-digit PIN 🔐
            <span className="font-normal text-gray-500 ml-2">(child uses this to log in)</span>
          </label>
          <div className="flex gap-3" role="group" aria-label="4-digit PIN">
            {pin.map((digit, i) => (
              <input key={i} id={`cpin-${i}`} type="text" inputMode="numeric" maxLength={1}
                value={digit} onChange={(e) => handlePinInput(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !pin[i] && i > 0) document.getElementById(`cpin-${i - 1}`)?.focus(); }}
                className="w-16 h-16 text-center text-3xl font-bold border-2 border-gray-200 rounded-2xl focus:border-brand-blue focus:outline-none bg-orange-50"
                aria-label={`PIN digit ${i + 1}`} />
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full text-xl disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "Creating profile…" : `Let's go, ${name || "little learner"}! 🚀`}
        </button>
      </form>
    </div>
  );
}
