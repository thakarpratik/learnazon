const modules = [
  {
    icon: "🔢",
    title: "Math",
    color: "from-orange-400 to-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    skills: ["Counting & numbers", "Addition & subtraction", "Multiplication", "Fractions & division"],
    ages: "Ages 5–10",
  },
  {
    icon: "🕐",
    title: "Time Telling",
    color: "from-blue-400 to-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    skills: ["Hour hand basics", "Half hours", "5-minute intervals", "AM/PM & elapsed time"],
    ages: "Ages 5–10",
  },
  {
    icon: "🎤",
    title: "Public Speaking",
    color: "from-green-400 to-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
    skills: ["Show & tell (30s)", "Describe a picture", "Tell a story (1 min)", "Debate a topic (2 min)"],
    ages: "Ages 5–10",
    badge: "Unique!",
  },
  {
    icon: "💰",
    title: "Money Skills",
    color: "from-yellow-400 to-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    skills: ["Identify coins", "Count collections", "Making change", "Budgeting basics"],
    ages: "Ages 5–10",
  },
  {
    icon: "📝",
    title: "Spelling",
    color: "from-purple-400 to-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    skills: ["Sight words", "3-letter words", "Compound words", "Prefixes & suffixes"],
    ages: "Ages 5–10",
  },
  {
    icon: "🌱",
    title: "Life Skills",
    color: "from-pink-400 to-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    skills: ["Colors & patterns", "Morning routine", "Plan your day", "Goal setting"],
    ages: "Ages 5–10",
  },
];

export function ModulesSection() {
  return (
    <section
      id="modules"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="modules-heading"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="inline-block bg-purple-100 text-purple-700 font-bold text-sm rounded-full px-4 py-2 mb-4 border border-purple-200">
            6 Learning Modules
          </span>
          <h2
            id="modules-heading"
            className="font-fredoka text-4xl md:text-5xl font-bold text-kidlearn-text mb-4"
          >
            Everything your child needs 📚
          </h2>
          <p className="text-lg text-kidlearn-muted max-w-xl mx-auto">
            Curriculum-aligned modules that grow with your child from kindergarten to 5th grade.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <article
              key={mod.title}
              className={`card border ${mod.border} overflow-hidden group`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${mod.color} p-6 relative`}>
                <span className="text-4xl block mb-2" aria-hidden="true">{mod.icon}</span>
                <h3 className="font-fredoka text-2xl font-bold text-white">
                  {mod.title}
                </h3>
                <span className="text-white/80 text-sm">{mod.ages}</span>
                {mod.badge && (
                  <span className="absolute top-4 right-4 bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {mod.badge}
                  </span>
                )}
              </div>

              {/* Skills list */}
              <div className={`p-6 ${mod.bg}`}>
                <ul className="space-y-2" role="list">
                  {mod.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 text-sm font-semibold text-kidlearn-text"
                    >
                      <span className="text-green-500 text-base" aria-hidden="true">✓</span>
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
