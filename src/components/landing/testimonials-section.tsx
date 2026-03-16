const testimonials = [
  {
    quote: "My 7-year-old actually asks to do her homework now. The public speaking module is incredible — she's so much more confident at school.",
    name: "Sarah M.",
    role: "Mom of Emma, age 7",
    avatar: "👩‍💼",
    stars: 5,
  },
  {
    quote: "We've tried three other learning apps. KidLearn is the first one my son sticks with. The AI hints keep him from getting frustrated.",
    name: "James K.",
    role: "Dad of Noah, age 9",
    avatar: "👨‍💻",
    stars: 5,
  },
  {
    quote: "As a homeschool parent, this is exactly what I needed. It covers everything and the parent dashboard shows me exactly where to focus.",
    name: "Priya T.",
    role: "Homeschool mom, 2 kids",
    avatar: "👩‍🏫",
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "linear-gradient(180deg, #F0FDF9 0%, #FFF3E8 100%)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <h2
            id="testimonials-heading"
            className="font-fredoka text-4xl md:text-5xl font-bold text-kidlearn-text mb-4"
          >
            Families love KidLearn ❤️
          </h2>
          <p className="text-lg text-kidlearn-muted">
            Don&apos;t take our word for it — here&apos;s what parents are saying.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="card p-8 flex flex-col gap-4"
            >
              {/* Stars */}
              <div aria-label={`${t.stars} out of 5 stars`}>
                {"★".repeat(t.stars).split("").map((s, i) => (
                  <span key={i} className="text-yellow-400 text-lg" aria-hidden="true">{s}</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-kidlearn-text leading-relaxed italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <footer className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">{t.avatar}</span>
                <div>
                  <cite className="font-bold text-kidlearn-text not-italic">
                    {t.name}
                  </cite>
                  <p className="text-sm text-kidlearn-muted">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
