import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="cta-heading">
      <div className="section-container">
        <div
          className="rounded-[28px] p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #4F46E5 100%)",
            border: "3px solid #3730A3",
            boxShadow: "0 10px 0 rgba(55,48,163,0.5), 0 4px 40px rgba(79,70,229,0.3)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #818CF8, transparent)", transform: "translate(-40%, -40%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #F97316, transparent)", transform: "translate(35%, 35%)" }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-7 animate-bounce-slow"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "3px solid rgba(255,255,255,0.35)",
                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
              }}
              aria-hidden="true"
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              </svg>
            </div>

            <h2
              id="cta-heading"
              className="font-baloo text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5"
            >
              Ready to start the adventure?
            </h2>
            <p className="text-white/85 text-xl max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              Join 10,000+ families already using Flinchi. Free to start — no credit card needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="btn-primary text-xl w-full sm:w-auto !bg-white !text-indigo-600 !border-white hover:!bg-indigo-50"
              >
                Create Free Account
              </Link>
              <Link
                href="/about"
                className="border-3 font-bold text-xl px-10 py-4 rounded-full transition-all duration-150 w-full sm:w-auto text-center text-white/90 hover:text-white hover:bg-white/15"
                style={{ border: "3px solid rgba(255,255,255,0.5)" }}
              >
                Learn More
              </Link>
            </div>

            {/* Mini trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm font-bold text-white/70">
              {[
                { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "No credit card needed" },
                { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Cancel anytime" },
                { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "COPPA compliant" },
              ].map((t) => (
                <span key={t.label} className="flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d={t.icon} stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
