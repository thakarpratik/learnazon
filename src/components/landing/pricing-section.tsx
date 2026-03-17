import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Perfect to get started",
    headerBg: "linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)",
    headerBorder: "#C7D2FE",
    cardBorder: "#C7D2FE",
    cardShadow: "#C7D2FE",
    textColor: "#3730A3",
    cta: "Get Started Free",
    ctaClass: "btn-secondary",
    href: "/signup",
    features: [
      "3 activities per day",
      "All 6 learning modules",
      "Stars & badges",
      "1 child profile",
      "Basic progress tracking",
    ],
    missing: [
      "Parent dashboard",
      "Unlimited activities",
      "Weekly email reports",
    ],
  },
  {
    name: "Pro",
    price: "$7.99",
    period: "per month",
    tagline: "Most popular choice",
    headerBg: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)",
    headerBorder: "#3730A3",
    cardBorder: "#818CF8",
    cardShadow: "#818CF8",
    textColor: "#fff",
    badge: "Most Popular",
    cta: "Start Pro Free",
    ctaClass: "btn-primary",
    href: "/signup?plan=pro",
    features: [
      "Unlimited activities",
      "All 6 learning modules",
      "Full parent dashboard",
      "Weekly email reports",
      "AI adaptive difficulty",
      "1 child profile",
      "Priority support",
    ],
    missing: [],
  },
  {
    name: "Family",
    price: "$12.99",
    period: "per month",
    tagline: "For growing families",
    headerBg: "linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)",
    headerBorder: "#7C3AED",
    cardBorder: "#DDD6FE",
    cardShadow: "#DDD6FE",
    textColor: "#fff",
    cta: "Start Family Free",
    ctaClass: "btn-secondary",
    href: "/signup?plan=family",
    features: [
      "Everything in Pro",
      "Up to 4 child profiles",
      "Family progress overview",
      "Individual child reports",
      "Shared badge celebrations",
    ],
    missing: [],
  },
] as const;

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white" aria-labelledby="pricing-heading">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="badge-pill mb-5"
            style={{ background: "#FFFBEB", color: "#92400E", borderColor: "#FBBF24" }}
          >
            Simple pricing
          </span>
          <h2
            id="pricing-heading"
            className="font-baloo text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "var(--text)" }}
          >
            Invest in your child&apos;s{" "}
            <span style={{ color: "var(--orange)" }}>future</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Start free, upgrade when you&apos;re ready. Cancel anytime — no tricks, no hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="rounded-[20px] overflow-hidden flex flex-col bg-white transition-all duration-200 hover:-translate-y-2"
              style={{
                border:     `3px solid ${plan.cardBorder}`,
                boxShadow:  `0 6px 0 ${plan.cardShadow}60, 0 2px 16px rgba(0,0,0,0.06)`,
              }}
            >
              {/* Header */}
              <div
                className="p-6 relative"
                style={{ background: plan.headerBg, borderBottom: `3px solid ${plan.headerBorder}` }}
              >
                {"badge" in plan && plan.badge && (
                  <span
                    className="absolute top-4 right-4 bg-white text-xs font-extrabold px-3 py-1 rounded-full"
                    style={{ color: "var(--indigo)", boxShadow: "0 2px 0 rgba(79,70,229,0.3)" }}
                  >
                    {plan.badge}
                  </span>
                )}
                <h3
                  className="font-baloo text-3xl font-extrabold mb-0.5"
                  style={{ color: plan.textColor }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-sm font-bold mb-3 opacity-80"
                  style={{ color: plan.textColor }}
                >
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-1.5" style={{ color: plan.textColor }}>
                  <span className="font-baloo text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm font-bold opacity-75">/{plan.period}</span>
                </div>
              </div>

              {/* Feature list */}
              <div className="p-6 flex flex-col flex-1">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-bold" style={{ color: "var(--text)" }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 flex-shrink-0">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-bold text-gray-300 line-through">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 flex-shrink-0">
                        <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`${plan.ctaClass} text-center w-full`}>
                  {plan.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Trust footer */}
        <div className="flex items-center justify-center gap-2 mt-8 text-sm font-bold" style={{ color: "var(--muted)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Secure payment via Stripe. Cancel anytime. No long-term contracts.
        </div>
      </div>
    </section>
  );
}
