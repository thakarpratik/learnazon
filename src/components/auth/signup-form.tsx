"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

const signupSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm() {
  const params = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: params.get("plan") ?? "FREE",
          marketingOptIn,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Signup failed");
      setDone(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="card p-10 text-center">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-3">Check your inbox!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          We sent a verification link to{" "}
          <strong className="text-gray-800">{form.email}</strong>.<br />
          Click it to activate your account — then you're all set!
        </p>
        <p className="text-xs text-gray-400">
          Didn't get it? Check your spam folder or{" "}
          <button
            className="text-orange-500 underline font-semibold"
            onClick={() => { setDone(false); setLoading(false); }}
          >
            try again
          </button>.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit} noValidate aria-label="Parent signup form">
        {apiError && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium">
            {apiError}
          </div>
        )}

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">Your name</label>
            <input
              id="name" type="text" autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium bg-white focus:outline-none transition-colors ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="Jane Smith"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p role="alert" className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">Email address</label>
            <input
              id="email" type="email" autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium bg-white focus:outline-none transition-colors ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="jane@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p role="alert" className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">Password</label>
            <input
              id="password" type="password" autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium bg-white focus:outline-none transition-colors ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
            />
            {errors.password && <p role="alert" className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Marketing opt-in */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                marketingOptIn ? "bg-orange-500 border-orange-500" : "border-gray-300 bg-white group-hover:border-orange-300"
              }`}>
                {marketingOptIn && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 leading-snug">
              Send me learning tips, progress updates and occasional offers from Flinchi.
              <span className="text-gray-400"> (You can unsubscribe any time.)</span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-busy={loading}
        >
          {loading ? "Creating account…" : "Create Free Account 🚀"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-blue-600">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-blue-600">Privacy Policy</Link>.
        </p>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
