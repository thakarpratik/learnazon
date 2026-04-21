import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Pricing — Free to Start",
  description: "Flinchi is free to get started. See our simple, honest pricing with no hidden fees.",
  alternates: { canonical: "/pricing" },
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    emoji: "🌱",
    color: "border-gray-200",
    headerBg: "bg-gray-50",
    cta: "Get Started Free",
    href: "/signup",
    trialNote: null as string | null,
    features: [
      "7-day full access trial included",
      "3 activities per day (after trial)",
      "3 core modules: Math, Time & Spelling",
      "Stars & badges",
      "1 child profile",
      "Basic progress tracking",
    ],
    missing: ["7 premium modules", "Adventure mode", "Unlimited activities", "Weekly email reports", "Multiple children"],
  },
  {
    name: "Pro",
    price: "$7.99",
    period: "per month",
    emoji: "⭐",
    color: "border-indigo-400 ring-2 ring-indigo-400",
    headerBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    headerText: "text-white",
    cta: "Start 7-Day Free Trial",
    href: "/signup",
    badge: "Most Popular",
    trialNote: "No credit card required",
    features: [
      "Unlimited activities",
      "All 10 learning modules",
      "Adventure mode (Minecraft, Pokémon, PAW Patrol & more)",
      "New module every month",
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
    emoji: "👨‍👩‍👧‍👦",
    color: "border-purple-200",
    headerBg: "bg-gradient-to-br from-purple-400 to-purple-600",
    headerText: "text-white",
    cta: "Start 7-Day Free Trial",
    href: "/signup",
    trialNote: "No credit card required",
    features: [
      "Everything in Pro",
      "Up to 4 child profiles",
      "Family progress overview",
      "Individual child reports",
      "New module every month",
    ],
    missing: [],
  },
];

const FAQS = [
  { q: "What's included in the 7-day free trial?", a: "Every new account gets full Pro access for 7 days — all 10 modules, adventure mode, unlimited sessions, and parent dashboard. No credit card needed." },
  { q: "What happens after the trial ends?", a: "After 7 days you move to the free plan (3 modules, 3 sessions/day) unless you upgrade. You'll get reminder emails at day 5 and day 7 so you're never surprised." },
  { q: "Is Flinchi free after the trial?", a: "Yes! The free plan gives your child access to Math, Time & Spelling with 3 activities per day — forever, no card required." },
  { q: "How many children can use the free plan?", a: "The free plan supports 1 child profile. Pro supports 1, and Family supports up to 4 child profiles." },
  { q: "How is my child's data protected?", a: "We are fully COPPA compliant. Children's profiles contain only a nickname and PIN — no email, phone, or personal contact information. See our Privacy Policy for full details." },
  { q: "Can I cancel at any time?", a: "Absolutely — no contracts, no lock-in. Cancel anytime from your account settings and you won't be charged again." },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24">
        {/* Header */}
        <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #FFFBF5 100%)" }}>
          <div className="section-container max-w-3xl">
            <span className="inline-block bg-yellow-100 text-yellow-800 font-bold text-sm rounded-full px-4 py-2 mb-4 border border-yellow-300">
              🎉 Every new account gets a 7-day free trial — no card needed
            </span>
            <h1 className="font-fredoka text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              Try everything free for 7 days. Cancel anytime — no tricks, no hidden fees.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-20 bg-white">
          <div className="section-container max-w-5xl">
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <article key={plan.name} className={`card border-2 ${plan.color} overflow-hidden flex flex-col`}>
                  <div className={`${plan.headerBg} p-6 relative`}>
                    {plan.badge && (
                      <span className="absolute top-4 right-4 bg-white text-orange-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {plan.badge}
                      </span>
                    )}
                    <span className="text-3xl block mb-2">{plan.emoji}</span>
                    <h2 className={`font-fredoka text-2xl font-bold mb-1 ${plan.headerText ?? "text-gray-900"}`}>{plan.name}</h2>
                    <div className={`flex items-baseline gap-1 ${plan.headerText ?? "text-gray-900"}`}>
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm opacity-80">/{plan.period}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <span className="text-green-500 mt-0.5">✓</span>{f}
                        </li>
                      ))}
                      {plan.missing.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-300 line-through">
                          <span className="mt-0.5">✗</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.href} className="text-center w-full py-4 rounded-full font-bold text-lg transition-all btn-primary">
                      {plan.cta}
                    </Link>
                    {plan.trialNote && (
                      <p className="text-center text-xs text-gray-400 font-semibold mt-2">⏳ {plan.trialNote}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8">
              All plans include: No ads · No external links · COPPA compliant · Data deletable on request
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20" style={{ background: "linear-gradient(180deg, #F0FDF9 0%, #FFFBF5 100%)" }}>
          <div className="section-container max-w-3xl">
            <h2 className="font-fredoka text-4xl font-bold text-gray-900 text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="card p-6 border border-orange-100 group cursor-pointer">
                  <summary className="font-bold text-gray-800 flex justify-between items-center list-none">
                    {faq.q}
                    <span className="text-orange-400 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-gray-500 mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white text-center border-t border-gray-100">
          <div className="section-container max-w-2xl">
            <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Try everything free for 7 days</h2>
            <p className="text-gray-500 mb-8">No credit card. No commitment. Cancel anytime.</p>
            <Link href="/signup" className="btn-primary text-xl">Start Free Trial 🚀</Link>
            <p className="text-sm text-gray-400 mt-3 font-semibold">7 days full access · No card needed · Locks to free plan after trial</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
