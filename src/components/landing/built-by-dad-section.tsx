export function BuiltByDadSection() {
  return (
    <section
      aria-label="Our story"
      style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FFF7ED 100%)" }}
    >
      <div className="section-container py-16 md:py-20">
        <div
          className="max-w-3xl mx-auto rounded-[28px] px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center gap-8 md:gap-12"
          style={{
            background:  "white",
            border:      "3px solid #FBBF24",
            boxShadow:   "0 8px 0 #FBBF2440, 0 4px 32px rgba(251,191,36,0.12)",
          }}
        >
          {/* Icon */}
          <div
            className="w-24 h-24 rounded-[22px] flex items-center justify-center text-5xl flex-shrink-0"
            style={{
              background:  "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
              border:      "3px solid #FBBF24",
              boxShadow:   "0 5px 0 #FBBF2460",
            }}
            aria-hidden="true"
          >
            👨‍👧
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            {/* Pill */}
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
              style={{
                background:  "#FFFBEB",
                color:       "#92400E",
                border:      "2px solid #FBBF24",
              }}
            >
              Our Story
            </span>

            <h2
              className="font-baloo font-extrabold text-3xl md:text-4xl mb-3 leading-tight"
              style={{ color: "var(--text)" }}
            >
              Built by a Dad
            </h2>

            <p
              className="text-lg md:text-xl font-medium leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Frustrated by expensive, boring learning apps, one father built
              the tool he{" "}
              <span style={{ color: "var(--text)", fontWeight: 700 }}>
                wished existed for his own kids.
              </span>
            </p>

            {/* Subtle divider + extra line */}
            <p
              className="mt-4 text-base font-medium"
              style={{ color: "var(--muted)" }}
            >
              No VC funding. No corporate agenda. Just a parent who wanted
              something genuinely great — so he built it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
