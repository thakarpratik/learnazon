"use client";

import Link from "next/link";

const floatingEmojis = [
  { emoji: "🔢", top: "15%", left: "8%",   delay: "0s",   size: "text-4xl" },
  { emoji: "🕐", top: "25%", right: "6%",  delay: "1s",   size: "text-3xl" },
  { emoji: "🎤", top: "60%", left: "5%",   delay: "2s",   size: "text-4xl" },
  { emoji: "💰", top: "70%", right: "8%",  delay: "0.5s", size: "text-3xl" },
  { emoji: "📚", top: "40%", left: "2%",   delay: "1.5s", size: "text-2xl" },
  { emoji: "⭐", top: "80%", left: "15%",  delay: "2.5s", size: "text-3xl" },
  { emoji: "🏆", top: "20%", right: "15%", delay: "3s",   size: "text-2xl" },
  { emoji: "🎨", top: "55%", right: "3%",  delay: "0.8s", size: "text-3xl" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-20"
      aria-label="KidLearn hero"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #EEF1FF 0%, #F5F7FA 60%)" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFC107 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #7C4DFF 0%, transparent 70%)" }} />
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {floatingEmojis.map((item, i) => (
          <span key={i} className={`absolute ${item.size} animate-float select-none`}
            style={{ top: item.top, left: item.left, right: item.right, animationDelay: item.delay, opacity: 0.55 }}>
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="section-container relative z-10 text-center py-16 md:py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold mb-6 border"
          style={{ background: "var(--color-blue-light)", color: "var(--color-blue)", borderColor: "var(--color-blue)" }}>
          <span>✨</span>
          <span>Powered by Claude AI — personalized for every child</span>
        </div>

        {/* Headline */}
        <h1 className="font-fredoka text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ color: "var(--color-text)" }}>
          Learning that{" "}
          <span className="relative inline-block">
            <span className="relative z-10" style={{ color: "var(--color-blue)" }}>feels like play</span>
            <span className="absolute bottom-1 left-0 right-0 h-4 opacity-40 -rotate-1 rounded-full"
              style={{ background: "var(--color-yellow)", zIndex: 0 }} aria-hidden="true" />
          </span>
        </h1>

        {/* Sub */}
        <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--color-muted)" }}>
          Math, spelling, public speaking, money & life skills —{" "}
          <strong style={{ color: "var(--color-text)" }}>personalized by AI</strong> for children aged 5–10.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/signup" className="btn-primary text-xl w-full sm:w-auto">Start Learning Free 🚀</Link>
          <Link href="/#modules" className="btn-secondary text-xl w-full sm:w-auto">See What We Teach</Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-semibold" style={{ color: "var(--color-muted)" }}>
          <span className="flex items-center gap-2"><span className="text-yellow-400">★★★★★</span> Loved by 10,000+ families</span>
          <span className="hidden sm:block text-gray-200">|</span>
          <span>✅ No credit card required</span>
          <span className="hidden sm:block text-gray-200">|</span>
          <span>🔒 COPPA compliant & safe</span>
        </div>

        {/* App preview */}
        <div className="mt-16 mx-auto max-w-4xl rounded-2xl overflow-hidden border"
          style={{ boxShadow: "0 20px 80px rgba(61,90,254,0.15)", borderColor: "var(--color-blue-light)" }}>
          <div className="h-[280px] sm:h-[360px] md:h-[420px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3D5AFE 0%, #7C4DFF 50%, #FFC107 100%)" }}>
            <div className="text-center text-white">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce-slow">🌟</div>
              <p className="font-fredoka text-2xl md:text-3xl font-bold">Your child&apos;s learning adventure awaits!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
