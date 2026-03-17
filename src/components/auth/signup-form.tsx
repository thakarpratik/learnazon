"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";

const signupSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [step, setStep] = useState<"form" | "signingin">("form");

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
      // Step 1: Create the account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: params.get("plan") ?? "FREE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Signup failed");

      // Step 2: Auto sign in so session is ready immediately
      setStep("signingin");
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Account created but login failed — please log in manually.");
      }

      // Step 3: Redirect to add child
      router.push("/parent/children?onboarding=true");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (step === "signingin") {
    return (
      <div className="card p-10 text-center">
        <div className="text-5xl mb-4 animate-bounce-slow">🌟</div>
        <p className="font-fredoka text-2xl font-bold text-gray-800 mb-2">Account created!</p>
        <p className="text-gray-400">Logging you in…</p>
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
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
              Your name
            </label>
            <input
              id="name" type="text" autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium bg-white focus:outline-none transition-colors ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="Jane Smith"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p id="name-error" role="alert" className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
              Email address
            </label>
            <input
              id="email" type="email" autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium bg-white focus:outline-none transition-colors ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="jane@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
              Password
            </label>
            <input
              id="password" type="password" autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border-2 font-medium bg-white focus:outline-none transition-colors ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"
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
