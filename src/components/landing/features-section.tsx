const features = [
  { icon: "🤖", title: "AI-Powered Personalization", desc: "Claude AI adapts to your child's pace — giving encouraging hints, adjusting difficulty, and celebrating wins in real time.", iconBg: "var(--color-blue-light)", iconColor: "var(--color-blue)" },
  { icon: "🎮", title: "Game-Based Learning",        desc: "Every lesson feels like a game. Stars, badges, streaks, and unlockable characters keep kids coming back every day.",          iconBg: "var(--color-yellow-light)", iconColor: "var(--color-yellow-dark)" },
  { icon: "🎤", title: "Unique: Public Speaking",    desc: "No other kids app does this. Children record short speeches and get AI feedback — building confidence from age 5.",          iconBg: "var(--color-green-light)", iconColor: "var(--color-green-dark)" },
  { icon: "📊", title: "Parent Dashboard",           desc: "See exactly what your child is learning, their strongest subjects, and get a weekly progress report by email.",              iconBg: "var(--color-purple-light)", iconColor: "var(--color-purple)" },
  { icon: "🔒", title: "Safe & COPPA Compliant",    desc: "No ads, no external links, no personal data from children. Built with child safety as a first principle.",                    iconBg: "var(--color-blue-light)", iconColor: "var(--color-blue)" },
  { icon: "📱", title: "Works Everywhere",           desc: "iPad, tablet, phone, or computer — KidLearn works beautifully on any device with no app download needed.",                   iconBg: "var(--color-yellow-light)", iconColor: "var(--color-yellow-dark)" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28" style={{ background: "linear-gradient(180deg, #F5F7FA 0%, #EEF1FF 100%)" }} aria-labelledby="features-heading">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="inline-block font-bold text-sm rounded-full px-4 py-2 mb-4 border"
            style={{ background: "var(--color-green-light)", color: "var(--color-green-dark)", borderColor: "var(--color-green)" }}>
            Why parents choose KidLearn
          </span>
          <h2 id="features-heading" className="font-fredoka text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Built different. Built better. 💪
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-muted)" }}>
            Every feature is designed to build real skills — not just keep kids entertained.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article key={f.title} className="card p-6 group border" style={{ borderColor: "var(--color-border)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-200"
                style={{ background: f.iconBg }} aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="font-fredoka text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
