import Link from "next/link";

const plans = [
  {
    name: "Free", price: "$0", period: "forever", emoji: "🌱",
    borderStyle: { border: "1px solid var(--color-border)" },
    headerStyle: { background: "var(--color-bg)" },
    cta: "Get Started Free", ctaClass: "btn-secondary", href: "/signup",
    features: ["3 activities per day","All 6 learning modules","Stars & badges","1 child profile","Basic progress tracking"],
    missing: ["Parent dashboard","Unlimited activities","Weekly email reports"],
  },
  {
    name: "Pro", price: "$7.99", period: "per month", emoji: "⭐",
    borderStyle: { border: "2px solid var(--color-blue)", boxShadow: "0 0 0 3px rgba(61,90,254,0.15)" },
    headerStyle: { background: "linear-gradient(135deg, var(--color-blue), var(--color-purple))" },
    headerText: "text-white", badge: "Most Popular",
    cta: "Start Pro Free", ctaClass: "btn-primary", href: "/signup?plan=pro",
    features: ["Unlimited activities","All 6 learning modules","Full parent dashboard","Weekly email reports","AI adaptive difficulty","1 child profile","Priority support"],
    missing: [],
  },
  {
    name: "Family", price: "$12.99", period: "per month", emoji: "👨‍👩‍👧‍👦",
    borderStyle: { border: "1px solid var(--color-purple-light)" },
    headerStyle: { background: "linear-gradient(135deg, var(--color-purple), #6535E8)" },
    headerText: "text-white",
    cta: "Start Family Free", ctaClass: "btn-secondary", href: "/signup?plan=family",
    features: ["Everything in Pro","Up to 4 child profiles","Family progress overview","Individual child reports","Shared badge celebrations"],
    missing: [],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white" aria-labelledby="pricing-heading">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 id="pricing-heading" className="font-fredoka text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Simple, honest pricing 💸
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-muted)" }}>
            Start free, upgrade when you&apos;re ready. Cancel anytime — no tricks, no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-[20px] overflow-hidden flex flex-col bg-white" style={plan.borderStyle}>
              <div className="p-6 relative" style={plan.headerStyle}>
                {plan.badge && (
                  <span className="absolute top-4 right-4 bg-white text-xs font-bold px-3 py-1 rounded-full shadow-sm" style={{ color: "var(--color-blue)" }}>
                    {plan.badge}
                  </span>
                )}
                <span className="text-3xl block mb-2">{plan.emoji}</span>
                <h3 className={`font-fredoka text-2xl font-bold mb-1 ${plan.headerText ?? "text-gray-800"}`}>{plan.name}</h3>
                <div className={`flex items-baseline gap-1 ${plan.headerText ?? "text-gray-800"}`}>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-80">/{plan.period}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      <span style={{ color: "var(--color-green-dark)" }}>✓</span>{f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm line-through text-gray-300">
                      <span>✗</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`${plan.ctaClass} text-center w-full`}>{plan.cta}</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: "var(--color-muted)" }}>
          🔒 Secure payment via Stripe. Cancel anytime. No long-term contracts.
        </p>
      </div>
    </section>
  );
}
