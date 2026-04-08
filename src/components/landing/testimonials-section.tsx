const testimonials = [
  {
    quote: "My 7-year-old actually asks to do her homework now. The public speaking module is incredible — she's so much more confident at school.",
    name: "Sarah M.",
    role: "Mom of Emma, age 7",
    initials: "SM",
    avatarBg: "linear-gradient(135deg, #4F46E5, #818CF8)",
    stars: 5,
  },
  {
    quote: "We've tried three other learning apps. Flinchi is the first one my son sticks with. The AI hints keep him from getting frustrated.",
    name: "James K.",
    role: "Dad of Noah, age 9",
    initials: "JK",
    avatarBg: "linear-gradient(135deg, #F97316, #FB923C)",
    stars: 5,
  },
  {
    quote: "As a homeschool parent, this is exactly what I needed. It covers everything and the parent dashboard shows me exactly where to focus.",
    name: "Priya T.",
    role: "Homeschool mom, 2 kids",
    initials: "PT",
    avatarBg: "linear-gradient(135deg, #34D399, #6EE7B7)",
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "linear-gradient(160deg, #F5F3FF 0%, #EEF2FF 100%)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="badge-pill mb-5"
            style={{ background: "#FFF7ED", color: "#C2410C", borderColor: "#F97316" }}
          >
            {/* Heart icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316" aria-hidden="true">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
            </svg>
            Families love Flinchi
          </span>
          <h2
            id="testimonials-heading"
            className="font-baloo text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "var(--text)" }}
          >
            Real results from{" "}
            <span style={{ color: "var(--indigo)" }}>real families</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Don&apos;t take our word for it — here&apos;s what parents are saying.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="bg-white rounded-[20px] p-7 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-2"
              style={{
                border:     "3px solid var(--border)",
                boxShadow:  "0 6px 0 var(--border), 0 2px 16px rgba(79,70,229,0.06)",
              }}
            >
              {/* Stars */}
              <div aria-label={`${t.stars} out of 5 stars`} className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
                    <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="leading-relaxed italic flex-1 text-base" style={{ color: "var(--text)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <footer className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-extrabold select-none flex-shrink-0"
                  style={{ background: t.avatarBg, border: "2px solid rgba(255,255,255,0.5)" }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <cite className="font-bold not-italic block" style={{ color: "var(--text)" }}>{t.name}</cite>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        {/* Aggregate rating strip */}
        <div
          className="mt-12 rounded-[20px] p-7 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left"
          style={{
            background: "white",
            border: "3px solid var(--border)",
            boxShadow: "0 4px 0 var(--border)",
          }}
        >
          {[
            { value: "10,000+", label: "Families using Flinchi"   },
            { value: "4.9 / 5", label: "Average parent rating"     },
            { value: "98%",     label: "Would recommend to a friend"},
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center sm:items-start sm:flex-1">
              <span className="font-baloo text-3xl font-extrabold" style={{ color: "var(--indigo)" }}>
                {stat.value}
              </span>
              <span className="text-sm font-bold mt-1" style={{ color: "var(--muted)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
