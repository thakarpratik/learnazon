const features = [
  {
    title: "AI-Powered Personalization",
    desc:  "Claude AI adapts to your child's pace — giving encouraging hints, adjusting difficulty, and celebrating wins in real time.",
    bg:    "#EEF2FF", border: "#818CF8", icon: "indigo",
    iconPath: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.317 2.798H4.32c-1.347 0-2.317-1.798-1.317-2.798L4.5 15.3",
  },
  {
    title: "Game-Based Learning",
    desc:  "Every lesson feels like a game. Stars, badges, streaks, and unlockable characters keep kids coming back every day.",
    bg:    "#FFF7ED", border: "#F97316", icon: "orange",
    iconPath: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0",
  },
  {
    title: "Unique: Public Speaking",
    desc:  "No other kids app does this. Children record short speeches and get AI feedback — building confidence from age 5.",
    bg:    "#F0FDF4", border: "#34D399", icon: "green",
    iconPath: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  },
  {
    title: "Parent Dashboard",
    desc:  "See exactly what your child is learning, their strongest subjects, and get a weekly progress report by email.",
    bg:    "#FDF4FF", border: "#A78BFA", icon: "violet",
    iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "Safe & COPPA Compliant",
    desc:  "No ads, no external links, no personal data from children. Built with child safety as a first principle.",
    bg:    "#F0FDF4", border: "#34D399", icon: "green",
    iconPath: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    title: "Works Everywhere",
    desc:  "iPad, tablet, phone, or computer — Flinchi works beautifully on any device with no app download needed.",
    bg:    "#FFFBEB", border: "#FBBF24", icon: "amber",
    iconPath: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3",
  },
] as const;

const iconColors: Record<string, { stroke: string; fill: string }> = {
  indigo: { stroke: "#4F46E5", fill: "none" },
  orange: { stroke: "#F97316", fill: "none" },
  green:  { stroke: "#34D399", fill: "none" },
  violet: { stroke: "#A78BFA", fill: "none" },
  amber:  { stroke: "#FBBF24", fill: "none" },
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 md:py-28"
      style={{ background: "linear-gradient(180deg, #EEF2FF 0%, white 100%)" }}
      aria-labelledby="features-heading"
    >
      <div className="section-container">
        {/* Section header */}
        <div className="text-center mb-14">
          <span
            className="badge-pill mb-5"
            style={{ background: "#F0FDF4", color: "#065F46", borderColor: "#34D399" }}
          >
            {/* Check icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Why parents choose Flinchi
          </span>
          <h2
            id="features-heading"
            className="font-baloo text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "var(--text)" }}
          >
            Built different.{" "}
            <span style={{ color: "var(--indigo)" }}>Built better.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Every feature is designed to build real skills — not just keep kids entertained.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const ic = iconColors[f.icon];
            return (
              <article
                key={f.title}
                className="bg-white rounded-[20px] p-6 transition-all duration-200 group"
                style={{
                  border:     `3px solid ${f.border}`,
                  boxShadow:  `0 5px 0 ${f.border}60, 0 2px 12px rgba(0,0,0,0.05)`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: f.bg, border: `2px solid ${f.border}` }}
                  aria-hidden="true"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill={ic.fill} stroke={ic.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.iconPath} />
                  </svg>
                </div>
                <h3 className="font-baloo text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {f.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
