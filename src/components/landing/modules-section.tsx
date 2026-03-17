const modules = [
  {
    title: "Math",
    tagline: "Numbers & operations",
    headerBg: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    headerBorder: "#EA6C0A",
    cardBorder: "#FED7AA",
    cardBg: "#FFF7ED",
    skills: ["Counting & numbers", "Addition & subtraction", "Multiplication", "Fractions & division"],
    ages: "Ages 5–10",
    iconPath: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.616 4.5 4.698V18a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18V4.698c0-1.082-.807-1.998-1.907-2.126A48.507 48.507 0 0012 2.25z",
  },
  {
    title: "Time Telling",
    tagline: "Clocks & schedules",
    headerBg: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)",
    headerBorder: "#3730A3",
    cardBorder: "#C7D2FE",
    cardBg: "#EEF2FF",
    skills: ["Hour hand basics", "Half hours", "5-minute intervals", "AM/PM & elapsed time"],
    ages: "Ages 5–10",
    iconPath: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Public Speaking",
    tagline: "Confidence & communication",
    headerBg: "linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)",
    headerBorder: "#059669",
    cardBorder: "#A7F3D0",
    cardBg: "#ECFDF5",
    skills: ["Show & tell (30s)", "Describe a picture", "Tell a story (1 min)", "Debate a topic (2 min)"],
    ages: "Ages 5–10",
    badge: "Unique",
    iconPath: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  },
  {
    title: "Money Skills",
    tagline: "Financial literacy",
    headerBg: "linear-gradient(135deg, #FBBF24 0%, #FCD34D 100%)",
    headerBorder: "#D97706",
    cardBorder: "#FDE68A",
    cardBg: "#FFFBEB",
    skills: ["Identify coins", "Count collections", "Making change", "Budgeting basics"],
    ages: "Ages 5–10",
    iconPath: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Spelling",
    tagline: "Words & vocabulary",
    headerBg: "linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)",
    headerBorder: "#7C3AED",
    cardBorder: "#DDD6FE",
    cardBg: "#F5F3FF",
    skills: ["Sight words", "3-letter words", "Compound words", "Prefixes & suffixes"],
    ages: "Ages 5–10",
    iconPath: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    title: "Life Skills",
    tagline: "Everyday essentials",
    headerBg: "linear-gradient(135deg, #FB7185 0%, #FDA4AF 100%)",
    headerBorder: "#E11D48",
    cardBorder: "#FECDD3",
    cardBg: "#FFF1F2",
    skills: ["Colors & patterns", "Morning routine", "Plan your day", "Goal setting"],
    ages: "Ages 5–10",
    iconPath: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z",
  },
] as const;

export function ModulesSection() {
  return (
    <section
      id="modules"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="modules-heading"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="badge-pill mb-5"
            style={{ background: "var(--indigo-light)", color: "var(--indigo)", borderColor: "var(--indigo-soft)" }}
          >
            6 Learning Modules
          </span>
          <h2
            id="modules-heading"
            className="font-baloo text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "var(--text)" }}
          >
            Everything your child{" "}
            <span style={{ color: "var(--orange)" }}>needs to thrive</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Curriculum-aligned modules that grow with your child from kindergarten to 5th grade.
          </p>
        </div>

        {/* Module grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <article
              key={mod.title}
              className="rounded-[20px] overflow-hidden transition-all duration-200 hover:-translate-y-2"
              style={{
                background:  "white",
                border:      `3px solid ${mod.cardBorder}`,
                boxShadow:   `0 6px 0 ${mod.cardBorder}, 0 2px 16px rgba(0,0,0,0.06)`,
              }}
            >
              {/* Coloured header */}
              <div
                className="p-6 relative"
                style={{ background: mod.headerBg, borderBottom: `3px solid ${mod.headerBorder}` }}
              >
                {/* SVG icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.4)" }}
                  aria-hidden="true"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={mod.iconPath} />
                  </svg>
                </div>
                <h3 className="font-baloo text-2xl font-bold text-white">{mod.title}</h3>
                <p className="text-white/75 text-sm">{mod.tagline} · {mod.ages}</p>
                {"badge" in mod && mod.badge && (
                  <span
                    className="absolute top-4 right-4 bg-white text-xs font-bold px-3 py-1 rounded-full"
                    style={{ color: mod.headerBorder, boxShadow: `0 2px 0 ${mod.headerBorder}40` }}
                  >
                    {mod.badge}
                  </span>
                )}
              </div>

              {/* Skills list */}
              <div className="p-6" style={{ background: mod.cardBg }}>
                <ul className="space-y-2.5" role="list">
                  {mod.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2.5 text-sm font-bold" style={{ color: "var(--text)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke={mod.headerBorder} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
