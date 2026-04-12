"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F5F3FF 60%, #EEF2FF 100%)" }}>

      <Link href="/" className="mb-8">
        <Image src="/flinchi.svg" alt="Flinchi" width={140} height={42} priority />
      </Link>

      <div className="w-full max-w-md rounded-[24px] p-8 bg-white"
        style={{ border: "3px solid #C7D2FE", boxShadow: "0 8px 0 #C7D2FE60" }}>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h1 className="font-baloo text-2xl font-extrabold text-gray-900 mb-2">Check your inbox</h1>
            <p className="text-gray-500 mb-6">
              If <strong>{email}</strong> has an account, we&apos;ve sent a reset link. Check your spam folder too.
            </p>
            <Link href="/login" className="btn-primary w-full text-center block">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-baloo text-2xl font-extrabold text-gray-900 mb-1">Forgot your password?</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

            {error && (
              <div className="mb-4 rounded-xl px-4 py-3 text-sm font-bold bg-red-50 text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-400 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Remember it?{" "}
              <Link href="/login" className="font-bold text-indigo-600 hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
