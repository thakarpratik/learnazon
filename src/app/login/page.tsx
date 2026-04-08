import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Flinchi parent account or enter your child's PIN.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #F0FDF9 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2" aria-label="Back to Flinchi home">
            <span className="text-4xl" aria-hidden="true">🌟</span>
            <span className="font-fredoka text-3xl font-bold text-flinchi-orange">Flinchi</span>
          </a>
          <h1 className="font-fredoka text-3xl font-bold text-flinchi-text mt-4 mb-2">
            Welcome back!
          </h1>
          <p className="text-flinchi-muted">Parent or child? Choose below 👇</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
