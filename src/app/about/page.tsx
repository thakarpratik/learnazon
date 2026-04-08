import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "About Flinchi — Our Mission",
  description: "Flinchi was built with one belief: every child deserves engaging, personalized learning. Learn about our mission, values, and commitment to child safety.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { emoji: "🧠", title: "Learning First", desc: "Every feature is designed to build real skills — not just keep kids entertained. We follow curriculum guidelines for ages 5–10." },
  { emoji: "🔒", title: "Child Safety", desc: "No ads. No external links. No personal data collected from children. We are fully COPPA compliant and built safety in from day one." },
  { emoji: "🤖", title: "AI That Helps", desc: "We use Claude AI to give encouraging, age-appropriate hints — never to replace the teacher, but to support every learner at their own pace." },
  { emoji: "❤️", title: "Made with Love", desc: "Flinchi is built by parents who wanted something better for their own kids — and decided to build it themselves." },
];

const TEAM = [
  { name: "Prateek Thakar", role: "Founder & Builder", emoji: "👨‍💻", bio: "Parent of a curious 7-year-old. Built Flinchi because existing apps felt more like toys than real learning tools." },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24">
        {/* Hero */}
        <section className="py-20 text-center" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #F0FDF9 100%)" }}>
          <div className="section-container max-w-3xl">
            <div className="text-6xl mb-6">🌟</div>
            <h1 className="font-fredoka text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Every child deserves to love learning
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Flinchi started with a simple frustration: educational apps for kids were either too boring to hold their attention, or too gamified to actually teach anything. We decided to build something better.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="section-container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-orange-100 text-orange-700 font-bold text-sm rounded-full px-4 py-2 mb-4 border border-orange-200">Our Mission</span>
                <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">
                  Personalized learning for every child, everywhere
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  We believe the best learning happens when content adapts to the child — not the other way around. Flinchi uses AI to meet each child exactly where they are, adjusting difficulty, providing encouragement, and celebrating wins in real time.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Our modules cover the subjects that matter most in early education: math, literacy, time-telling, money, public speaking, and life skills — each designed by educators and built by people who care deeply about getting it right.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-10 text-center">
                <div className="text-7xl mb-4">🎓</div>
                <p className="font-fredoka text-2xl font-bold text-gray-800 mb-2">Built for ages 5–10</p>
                <p className="text-gray-500">6 subjects · AI-adaptive · Game-based · Parent-monitored</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20" style={{ background: "linear-gradient(180deg, #F0FDF9 0%, #FFFBF5 100%)" }}>
          <div className="section-container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">What we stand for</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-6 border border-orange-100">
                  <div className="text-4xl mb-3">{v.emoji}</div>
                  <h3 className="font-fredoka text-xl font-bold text-gray-800 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Who built this</h2>
              <p className="text-gray-500">Flinchi is an indie project — built lean, shipped fast, and improved based on real feedback from real families.</p>
            </div>
            <div className="flex justify-center">
              {TEAM.map((member) => (
                <div key={member.name} className="card p-8 text-center max-w-sm border border-orange-100">
                  <div className="text-6xl mb-4">{member.emoji}</div>
                  <h3 className="font-fredoka text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-orange-500 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety callout */}
        <section className="py-16 bg-blue-50 border-y border-blue-100">
          <div className="section-container max-w-3xl text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-4">Built safe from day one</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Flinchi collects only what&apos;s necessary to run the service. Children&apos;s profiles contain only a name, age, and PIN — no email, no phone, no photos. Parents have full control and can delete all data at any time.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["COPPA Compliant", "No Ads Ever", "No Third-Party Tracking", "Parent-Controlled", "Data Deletable on Request"].map((badge) => (
                <span key={badge} className="bg-blue-100 text-blue-700 font-bold text-sm px-4 py-2 rounded-full border border-blue-200">
                  ✓ {badge}
                </span>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/privacy" className="text-blue-600 font-bold hover:underline text-sm">Read our Privacy Policy →</Link>
              <Link href="/safety" className="text-blue-600 font-bold hover:underline text-sm">Child Safety Info →</Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-white">
          <div className="section-container max-w-2xl">
            <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-500 mb-8">Free forever for the basics. No credit card. No commitment.</p>
            <Link href="/signup" className="btn-primary text-xl">Start Learning Free 🚀</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
