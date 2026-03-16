import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="cta-heading">
      <div className="section-container">
        <div className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #3D5AFE 0%, #7C4DFF 60%, #3D5AFE 100%)" }}>
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3" aria-hidden="true" />
          <div className="relative z-10">
            <div className="text-5xl md:text-6xl mb-6 animate-bounce-slow" aria-hidden="true">🚀</div>
            <h2 id="cta-heading" className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Ready to start the adventure?
            </h2>
            <p className="text-white/90 text-xl max-w-xl mx-auto mb-10 font-medium">
              Join 10,000+ families already using KidLearn. Free to start — no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary text-xl w-full sm:w-auto">
                Create Free Account 🎉
              </Link>
              <Link href="/about"
                className="border-2 border-white text-white hover:bg-white/10 font-bold text-xl px-10 py-4 rounded-full transition-all duration-150 w-full sm:w-auto text-center">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
