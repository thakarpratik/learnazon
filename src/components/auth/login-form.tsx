"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Mode = "parent" | "child";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) throw new Error("Invalid email or password");
      router.push("/parent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePinInput = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[i] = value.slice(-1);
    setPin(next);
    if (value && i < 3) {
      document.getElementById(`pin-${i + 1}`)?.focus();
    }
  };

  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fullPin = pin.join("");
    if (fullPin.length < 4) { setError("Please enter your full 4-digit PIN"); return; }
    setLoading(true);
    try {
      const res = await signIn("child-pin", { pin: fullPin, redirect: false });
      if (res?.error) throw new Error("Wrong PIN — try again!");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8">
      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-6" role="tablist" aria-label="Login type">
        <button
          role="tab"
          aria-selected={mode === "parent"}
          aria-controls="parent-panel"
          onClick={() => { setMode("parent"); setError(""); }}
          className={`py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "parent"
              ? "bg-white shadow text-brand-blue"
              : "text-kidlearn-muted hover:text-kidlearn-text"
          }`}
        >
          👩‍💼 Parent Login
        </button>
        <button
          role="tab"
          aria-selected={mode === "child"}
          aria-controls="child-panel"
          onClick={() => { setMode("child"); setError(""); }}
          className={`py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "child"
              ? "bg-white shadow text-brand-blue"
              : "text-kidlearn-muted hover:text-kidlearn-text"
          }`}
        >
          🧒 Child PIN
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Parent login */}
      {mode === "parent" && (
        <form id="parent-panel" role="tabpanel" onSubmit={handleParentSubmit} aria-label="Parent email login" noValidate>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="parent-email" className="block text-sm font-bold text-kidlearn-text mb-2">Email</label>
              <input
                id="parent-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-blue focus:outline-none font-medium transition-colors"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="parent-password" className="block text-sm font-bold text-kidlearn-text mb-2">Password</label>
              <input
                id="parent-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-blue focus:outline-none font-medium transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log In →"}
          </button>
          <div className="flex justify-between mt-4 text-sm">
            <Link href="/forgot-password" className="text-kidlearn-muted hover:text-brand-blue">Forgot password?</Link>
            <Link href="/signup" className="font-bold text-brand-blue hover:underline">Create account</Link>
          </div>
        </form>
      )}

      {/* Child PIN */}
      {mode === "child" && (
        <form id="child-panel" role="tabpanel" onSubmit={handleChildSubmit} aria-label="Child PIN login">
          <p className="text-center text-kidlearn-muted font-semibold mb-6">
            Enter your secret 4-digit PIN 🔐
          </p>
          <div className="flex justify-center gap-4 mb-8" role="group" aria-label="4-digit PIN entry">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinInput(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !pin[i] && i > 0) {
                    document.getElementById(`pin-${i - 1}`)?.focus();
                  }
                }}
                className="w-16 h-16 text-center text-3xl font-bold border-3 border-gray-200 rounded-2xl focus:border-brand-blue focus:outline-none transition-colors bg-orange-50"
                aria-label={`PIN digit ${i + 1}`}
              />
            ))}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 text-xl">
            {loading ? "Checking…" : "Let's Go! 🚀"}
          </button>
        </form>
      )}
    </div>
  );
}
