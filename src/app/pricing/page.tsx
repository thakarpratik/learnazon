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
    features: [
      "3 activities per day",
      "3 core modules: Math, Time & Spelling",
      "Stars & badges",
      "1 child profile",
      "Basic progress tracking",
    ],
    missing: ["7 premium modules", "Parent dashboard", "Unlimited activities", "Weekly email reports", "Multiple children"],
  },
  {
    name: "Pro",
    price: "$7.99",
    period: "per month",
    emoji: "⭐",
    color: "border-orange-400 ring-2 ring-orange-400",
    headerBg: "bg-gradient-to-br from-orange-400 to-orange-500",
    headerText: "text-white",
    cta: "Coming Soon",
    href: "/signup",
    badge: "Most Popular",
    disabled: true,
    features: [
      "Unlimited activities",
      "All 10 learning modules",
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
    cta: "Coming Soon",
    href: "/signup",
    disabled: true,
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
  { q: "Is Flinchi really free?", a: "Yes! The free plan gives your child access to 3 core learning modules (Math, Time Telling, Spelling) with 3 activities per day. No credit card required." },
  { q: "When will paid plans be available?", a: "We're focused on making the free experience excellent before introducing paid plans. Sign up for free and you'll be notified when Pro launches." },
  { q: "Is there a limit on how many children can use the free plan?", a: "The free plan supports 1 child profile. Additional profiles will be available on the Family plan when it launches." },
  { q: "How is my child's data protected?", a: "We are fully COPPA compliant. Children's profiles contain only a nickname and PIN — no email, phone, or personal contact information. See our Privacy Policy for full details." },
  { q: "Can I cancel at any time?", a: "Absolutely — no contracts, no lock-in. When paid plans launch, you'll be able to cancel anytime from your account settings." },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24">
        {/* Header */}
        <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #FFFBF5 100%)" }}>
          <div className="section-container max-w-3xl">
            <span className="inline-block bg-green-100 text-green-700 font-bold text-sm rounded-full px-4 py-2 mb-4 border border-green-200">
              🎉 Completely free while we grow
            </span>
            <h1 className="font-fredoka text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              Start free — no credit card, no tricks. Paid plans coming once we&apos;ve earned your trust.
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
                    <Link href={plan.href}
                      className={`text-center w-full py-4 rounded-full font-bold text-lg transition-all ${plan.disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "btn-primary"}`}
                      aria-disabled={plan.disabled}>
                      {plan.cta}
                    </Link>
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
            <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Start learning today — it&apos;s free</h2>
            <p className="text-gray-500 mb-8">No credit card. No commitment. Cancel anytime.</p>
            <Link href="/signup" className="btn-primary text-xl">Create Free Account 🚀</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
