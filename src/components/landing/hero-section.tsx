"use client";

import Link from "next/link";

/* Decorative floating blobs — pure CSS, no emojis */
const blobs = [
  { color: "#818CF8", size: 280, top: "-8%",  left: "-6%",   opacity: 0.35, delay: "0s"   },
  { color: "#F97316", size: 220, top: "10%",  right: "-4%",  opacity: 0.28, delay: "1s"   },
  { color: "#34D399", size: 180, bottom: "5%",left: "8%",    opacity: 0.22, delay: "1.8s" },
  { color: "#FBBF24", size: 150, bottom:"15%",right: "10%",  opacity: 0.30, delay: "0.6s" },
] as const;

/* Module preview pills shown inside the hero card */
const modulePills = [
  { label: "Math",           bg: "#FFF7ED", border: "#F97316", color: "#C2410C" },
  { label: "Spelling",       bg: "#EEF2FF", border: "#818CF8", color: "#3730A3" },
  { label: "Time Telling",   bg: "#F0FDF4", border: "#34D399", color: "#065F46" },
  { label: "Public Speaking",bg: "#FDF4FF", border: "#A78BFA", color: "#5B21B6" },
  { label: "Money Skills",   bg: "#FFFBEB", border: "#FBBF24", color: "#92400E" },
  { label: "Life Skills",    bg: "#FFF1F2", border: "#FB7185", color: "#9F1239" },
];

/* Stat cards inside hero preview */
const stats = [
  { value: "3",  suffix: " stars earned", icon: "★", iconColor: "#FBBF24" },
  { value: "5",  suffix: " day streak!",  icon: "🔥", iconColor: "#F97316" },
  { value: "4/6",suffix: " modules done", icon: "✓",  iconColor: "#34D399" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-20"
      aria-label="KidLearn hero"
      style={{ background: "linear-gradient(160deg, #EEF2FF 0%, #F5F3FF 50%, #EEF2FF 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width:  b.size,
              height: b.size,
              top:    (b as any).top,
              left:   (b as any).left,
              right:  (b as any).right,
              bottom: (b as any).bottom,
              background:       `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
              opacity:          b.opacity,
              animationDelay:   b.delay,
              filter:           "blur(40px)",
            }}
          />
        ))}
      </div>

      <div className="section-container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div className="text-center lg:text-left">
            {/* AI badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold mb-7 border-2"
              style={{
                background:   "var(--indigo-light)",
                color:        "var(--indigo)",
                borderColor:  "var(--indigo-soft)",
                boxShadow:    "0 2px 0 rgba(79,70,229,0.2)",
              }}
            >
              {/* Sparkle SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" fill="var(--indigo)" opacity="0.9"/>
              </svg>
              Powered by Claude AI — personalized for every child
            </div>

            {/* Headline */}
            <h1
              className="font-baloo font-extrabold mb-6 leading-[1.1]"
              style={{ color: "var(--text)", fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
            >
              Learning that{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-shimmer">feels like play</span>
                {/* Underline squiggle */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 Q 25 2, 50 7 T 100 7 T 150 7 T 198 5"
                    stroke="#F97316"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub */}
            <p
              className="text-xl md:text-2xl font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Math, spelling, speaking, money & life skills —{" "}
              <strong style={{ color: "var(--text)" }}>personalized by AI</strong> for children aged 5–10.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href="/signup" className="btn-primary text-xl w-full sm:w-auto">
                Start Learning Free
              </Link>
              <Link href="/#modules" className="btn-secondary text-xl w-full sm:w-auto">
                See What We Teach
              </Link>
            </div>

            {/* Social proof */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 text-sm font-bold"
              style={{ color: "var(--muted)" }}
            >
              <span className="flex items-center gap-1.5">
                <span style={{ color: "#FBBF24" }}>★★★★★</span>
                10,000+ happy families
              </span>
              <span className="hidden sm:block text-gray-200">·</span>
              <span className="flex items-center gap-1.5">
                {/* Shield icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2z" stroke="#34D399" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
                </svg>
                COPPA compliant &amp; safe
              </span>
              <span className="hidden sm:block text-gray-200">·</span>
              <span>No credit card needed</span>
            </div>
          </div>

          {/* Right — Illustration card */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden"
              style={{
                background:  "white",
                border:      "3px solid var(--border)",
                boxShadow:   "0 12px 0 rgba(79,70,229,0.2), 0 6px 40px rgba(79,70,229,0.15)",
              }}
            >
              {/* Card header */}
              <div
                className="px-6 py-5"
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-indigo-200 text-xs font-bold">Good morning,</p>
                    <p className="text-white font-baloo text-xl font-bold">Alex's World</p>
                  </div>
                  {/* Avatar placeholder */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}
                    aria-hidden="true"
                  >
                    🦊
                  </div>
                </div>
                {/* Stat pills */}
                <div className="flex gap-2.5">
                  {stats.map((s) => (
                    <div
                      key={s.suffix}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold"
                      style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}
                    >
                      <span aria-hidden="true">{s.icon}</span>
                      <span>{s.value}{s.suffix}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module pills grid */}
              <div className="p-5">
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Pick a subject</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {modulePills.map((pill) => (
                    <div
                      key={pill.label}
                      className="rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-150"
                      style={{
                        background:   pill.bg,
                        border:       `2px solid ${pill.border}`,
                        color:        pill.color,
                        boxShadow:    `0 3px 0 ${pill.border}50`,
                      }}
                    >
                      {pill.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA strip */}
              <div
                className="px-5 pb-5"
              >
                <div
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: "#FFFBEB", border: "2px solid #FBBF24" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: "#FBBF24", color: "#fff", fontWeight: 700 }}
                    aria-hidden="true"
                  >
                    7
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#92400E" }}>7-day streak!</p>
                    <p className="text-xs text-gray-500">Keep going, you're amazing!</p>
                  </div>
                  <div className="ml-auto text-lg" aria-hidden="true">🔥</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
