"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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
        body: JSON.stringify({ ...form, plan: params.get("plan") ?? "FREE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Signup failed");
      router.push("/parent/children?onboarding=true");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            <label htmlFor="name" className="block text-sm font-bold text-kidlearn-text mb-2">
              Your name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-kidlearn-text bg-white focus:outline-none focus:border-brand-blue transition-colors ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="Jane Smith"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p id="name-error" role="alert" className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-kidlearn-text mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-kidlearn-text bg-white focus:outline-none focus:border-brand-blue transition-colors ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="jane@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-kidlearn-text mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-kidlearn-text bg-white focus:outline-none focus:border-brand-blue transition-colors ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="At least 8 characters"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p id="password-error" role="alert" className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-busy={loading}
        >
          {loading ? "Creating account…" : "Create Free Account 🚀"}
        </button>

        <p className="text-xs text-kidlearn-muted text-center mt-4 leading-relaxed">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-brand-blue">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-brand-blue">Privacy Policy</Link>.
        </p>

        <p className="text-sm text-center mt-4 text-kidlearn-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-blue hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
