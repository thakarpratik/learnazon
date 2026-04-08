import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Child Safety — Flinchi",
  description: "How Flinchi keeps children safe online. Our COPPA compliance, data practices, and parent controls explained.",
  alternates: { canonical: "/safety" },
};

const SAFEGUARDS = [
  { emoji: "🚫", title: "Zero Ads", desc: "No advertising of any kind — ever. Children are never exposed to commercial content or external links." },
  { emoji: "👤", title: "No Personal Data from Children", desc: "Children only need a name and PIN to use Flinchi. No email, phone number, photo, or location is ever collected from them." },
  { emoji: "🔑", title: "PIN-Based Child Login", desc: "Children use a 4-digit PIN chosen by their parent. The PIN is stored as a secure hash — not even we can see it." },
  { emoji: "👨‍👩‍👧", title: "Parent Control", desc: "Parents create and manage all child profiles. Parents can view progress, change settings, and delete any data at any time." },
  { emoji: "🤖", title: "Safe AI Interactions", desc: "All AI interactions go through carefully designed prompts that keep responses age-appropriate and educational. Outputs are never stored." },
  { emoji: "🛡️", title: "COPPA Compliant", desc: "We follow the Children's Online Privacy Protection Act fully. No child data is ever shared, sold, or used for profiling." },
  { emoji: "🔒", title: "Encrypted & Secure", desc: "All data is encrypted in transit and at rest. Security headers protect against common web vulnerabilities." },
  { emoji: "📵", title: "No External Links", desc: "The child-facing app contains no links to external websites. Children cannot accidentally navigate away from Flinchi." },
];

export default function SafetyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-16 text-center bg-blue-50 border-b border-blue-100">
          <div className="section-container max-w-3xl">
            <div className="text-6xl mb-4">🛡️</div>
            <h1 className="font-fredoka text-5xl font-bold text-gray-900 mb-4">Your child&apos;s safety is our priority</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Flinchi was built by a parent. Child safety isn&apos;t a compliance checkbox for us — it&apos;s the foundation everything else is built on.
            </p>
          </div>
        </section>

        {/* Safeguards */}
        <section className="py-20 bg-white">
          <div className="section-container max-w-4xl">
            <h2 className="font-fredoka text-3xl font-bold text-gray-900 text-center mb-12">How we keep children safe</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {SAFEGUARDS.map((s) => (
                <div key={s.title} className="flex gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-3xl shrink-0">{s.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parent controls */}
        <section className="py-20" style={{ background: "linear-gradient(135deg, #FFF3E8 0%, #F0FDF9 100%)" }}>
          <div className="section-container max-w-3xl">
            <h2 className="font-fredoka text-3xl font-bold text-gray-900 text-center mb-4">Parent controls</h2>
            <p className="text-center text-gray-500 mb-10">Everything your child does on Flinchi is visible to you.</p>
            <div className="space-y-4">
              {[
                { action: "View all activity", desc: "See every game your child played, their scores, and time spent learning." },
                { action: "Monitor progress", desc: "Track which subjects your child is strong in and where they need more practice." },
                { action: "Manage profiles", desc: "Add, edit, or delete child profiles at any time from your parent dashboard." },
                { action: "Change PINs", desc: "Update your child's login PIN whenever you want from account settings." },
                { action: "Delete all data", desc: "Permanently delete your account and all associated data — no questions asked." },
                { action: "Weekly reports", desc: "Receive a weekly email summary of your child's learning activity." },
              ].map((item) => (
                <div key={item.action} className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-orange-100 shadow-sm">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <div>
                    <p className="font-bold text-gray-800">{item.action}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="section-container max-w-2xl text-center">
            <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-4">Report a safety concern</h2>
            <p className="text-gray-500 mb-6">
              If you encounter anything on Flinchi that feels inappropriate or unsafe, please report it immediately. We take all reports seriously and respond within 24 hours.
            </p>
            <a href="mailto:safety@flinchi.com"
              className="btn-primary inline-flex"
              aria-label="Email our safety team">
              📧 safety@flinchi.com
            </a>
            <div className="mt-8 text-sm text-gray-400 flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
