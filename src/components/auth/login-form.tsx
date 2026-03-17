"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Mode = "parent" | "child";
type ChildStep = "select" | "pin";

interface ChildProfile {
  id: string;
  name: string;
  nickname: string | null;
  avatar: string;
  favoriteColor: string | null;
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("parent");
  const [childStep, setChildStep] = useState<ChildStep>("select");

  // Parent login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Child login
  const [parentEmail, setParentEmail] = useState("");
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Parent login ────────────────────────────────────────────────────────────
  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) throw new Error("Invalid email or password");
      router.push("/parent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Look up children by parent email ────────────────────────────────
  const handleLookupChildren = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentEmail.trim()) return setError("Please enter the parent email address");
    setError("");
    setLoadingChildren(true);
    try {
      const res = await fetch(`/api/child-lookup?email=${encodeURIComponent(parentEmail.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.children?.length) {
        setError("No children found for this email. Check the email address and try again.");
        return;
      }
      setChildren(data.children);
      setChildStep("select");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoadingChildren(false);
    }
  };

  // ── Step 2: Select child + enter PIN ───────────────────────────────────────
  const handlePinInput = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[i] = value.slice(-1);
    setPin(next);
    if (value && i < 3) document.getElementById(`pin-${i + 1}`)?.focus();
  };

  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return setError("Please select a child");
    const fullPin = pin.join("");
    if (fullPin.length < 4) return setError("Please enter your full 4-digit PIN");
    setError("");
    setLoading(true);
    try {
      const res = await signIn("child-pin", {
        childId: selectedChild.id,
        pin: fullPin,
        redirect: false,
      });
      if (res?.error) throw new Error("Wrong PIN — try again! 🔐");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setPin(["", "", "", ""]);
      document.getElementById("pin-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resetChildFlow = () => {
    setChildStep("select");
    setSelectedChild(null);
    setChildren([]);
    setParentEmail("");
    setPin(["", "", "", ""]);
    setError("");
  };

  return (
    <div className="card p-8">
      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-6" role="tablist">
        <button role="tab" aria-selected={mode === "parent"} aria-controls="parent-panel"
          onClick={() => { setMode("parent"); setError(""); resetChildFlow(); }}
          className={`py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "parent" ? "bg-white shadow text-blue-600" : "text-gray-400 hover:text-gray-600"
          }`}>
          👩‍💼 Parent Login
        </button>
        <button role="tab" aria-selected={mode === "child"} aria-controls="child-panel"
          onClick={() => { setMode("child"); setError(""); }}
          className={`py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "child" ? "bg-white shadow text-blue-600" : "text-gray-400 hover:text-gray-600"
          }`}>
          🧒 Child Login
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── Parent login ── */}
      {mode === "parent" && (
        <form id="parent-panel" role="tabpanel" onSubmit={handleParentSubmit} noValidate>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="parent-email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input id="parent-email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium transition-colors"
                placeholder="jane@example.com" />
            </div>
            <div>
              <label htmlFor="parent-password" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input id="parent-password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium transition-colors"
                placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log In →"}
          </button>
          <div className="flex justify-between mt-4 text-sm">
            <Link href="/forgot-password" className="text-gray-400 hover:text-blue-600">Forgot password?</Link>
            <Link href="/signup" className="font-bold text-blue-600 hover:underline">Create account</Link>
          </div>
        </form>
      )}

      {/* ── Child login ── */}
      {mode === "child" && (
        <div id="child-panel" role="tabpanel">

          {/* Step 1 — Enter parent email to find children */}
          {children.length === 0 && (
            <form onSubmit={handleLookupChildren} noValidate>
              <p className="text-center text-gray-500 font-semibold mb-5">
                First, enter a parent&apos;s email to find the children 👇
              </p>
              <div className="mb-4">
                <label htmlFor="parent-lookup-email" className="block text-sm font-bold text-gray-700 mb-2">
                  Parent&apos;s email address
                </label>
                <input id="parent-lookup-email" type="email" autoComplete="email"
                  value={parentEmail} onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium transition-colors"
                  placeholder="mum@example.com" />
              </div>
              <button type="submit" disabled={loadingChildren}
                className="btn-primary w-full disabled:opacity-60">
                {loadingChildren ? "Looking up…" : "Find My Profile 🔍"}
              </button>
            </form>
          )}

          {/* Step 2 — Pick who you are */}
          {children.length > 0 && !selectedChild && (
            <div>
              <p className="text-center text-gray-500 font-semibold mb-5">
                Who are you? 👋
              </p>
              <div className="space-y-3 mb-4">
                {children.map((child) => (
                  <button key={child.id}
                    onClick={() => { setSelectedChild(child); setError(""); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: (child.favoriteColor ?? "#3D5AFE") + "50",
                      background: (child.favoriteColor ?? "#3D5AFE") + "08",
                    }}>
                    <span className="text-4xl">{child.avatar}</span>
                    <div>
                      <p className="font-fredoka text-xl font-bold text-gray-800">
                        {child.nickname ?? child.name}
                      </p>
                      {child.nickname && child.nickname !== child.name && (
                        <p className="text-xs text-gray-400">{child.name}</p>
                      )}
                    </div>
                    <span className="ml-auto text-2xl text-gray-300">→</span>
                  </button>
                ))}
              </div>
              <button onClick={resetChildFlow} className="text-sm text-gray-400 hover:text-gray-600 w-full text-center mt-2">
                ← Use a different email
              </button>
            </div>
          )}

          {/* Step 3 — Enter PIN for selected child */}
          {selectedChild && (
            <form onSubmit={handleChildSubmit}>
              <div className="text-center mb-6">
                <span className="text-5xl block mb-2">{selectedChild.avatar}</span>
                <p className="font-fredoka text-2xl font-bold text-gray-800">
                  Hi, {selectedChild.nickname ?? selectedChild.name}! 👋
                </p>
                <p className="text-gray-400 text-sm mt-1">Enter your secret PIN 🔐</p>
              </div>

              <div className="flex justify-center gap-4 mb-8"
                role="group" aria-label="4-digit PIN entry">
                {pin.map((digit, i) => (
                  <input key={i} id={`pin-${i}`} type="text" inputMode="numeric"
                    pattern="[0-9]" maxLength={1} value={digit}
                    onChange={(e) => handlePinInput(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !pin[i] && i > 0)
                        document.getElementById(`pin-${i - 1}`)?.focus();
                    }}
                    className="w-16 h-16 text-center text-3xl font-bold border-2 rounded-2xl focus:outline-none transition-colors"
                    style={{
                      borderColor: digit
                        ? (selectedChild.favoriteColor ?? "#3D5AFE")
                        : "#E5E7EB",
                      backgroundColor: digit
                        ? (selectedChild.favoriteColor ?? "#3D5AFE") + "15"
                        : "#F9FAFB",
                    }}
                    aria-label={`PIN digit ${i + 1}`} />
                ))}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-full font-bold text-lg text-white transition-all disabled:opacity-60"
                style={{ backgroundColor: selectedChild.favoriteColor ?? "#3D5AFE" }}>
                {loading ? "Checking…" : "Let's Go! 🚀"}
              </button>

              <button type="button" onClick={() => { setSelectedChild(null); setPin(["","","",""]); setError(""); }}
                className="text-sm text-gray-400 hover:text-gray-600 w-full text-center mt-3">
                ← That&apos;s not me
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
