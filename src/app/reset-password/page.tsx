"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetForm() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const token         = searchParams.get("token") ?? "";

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setDone(true);
      setTimeout(() => router.push("/login?reset=true"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="font-baloo text-2xl font-extrabold text-gray-900 mb-2">Invalid link</h1>
        <p className="text-gray-500 mb-6">This reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="btn-primary inline-block">Request a new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="font-baloo text-2xl font-extrabold text-gray-900 mb-2">Password updated!</h1>
        <p className="text-gray-500">Redirecting you to login…</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-baloo text-2xl font-extrabold text-gray-900 mb-1">Set a new password</h1>
      <p className="text-gray-500 text-sm mb-6">Must be at least 8 characters.</p>

      {error && (
        <div className="mb-4 rounded-xl px-4 py-3 text-sm font-bold bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="Same password again"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F5F3FF 60%, #EEF2FF 100%)" }}>

      <Link href="/" className="mb-8">
        <Image src="/flinchi.svg" alt="Flinchi" width={140} height={42} priority />
      </Link>

      <div className="w-full max-w-md rounded-[24px] p-8 bg-white"
        style={{ border: "3px solid #C7D2FE", boxShadow: "0 8px 0 #C7D2FE60" }}>
        <Suspense fallback={<div className="text-center text-gray-400">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
