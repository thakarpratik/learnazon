import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Your Free Account",
  description: "Sign up for Flinchi free. Start your child's learning adventure today — no credit card required.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #F0FDF9 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2"
            aria-label="Back to Flinchi home"
          >
            <span className="text-4xl" aria-hidden="true">🌟</span>
            <span className="font-fredoka text-3xl font-bold text-orange-500">Flinchi</span>
          </a>
          <h1 className="font-fredoka text-3xl font-bold text-gray-900 mt-4 mb-2">
            Create your account
          </h1>
          <p className="text-gray-500">Free forever — upgrade anytime</p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-gray-400">Loading…</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}
