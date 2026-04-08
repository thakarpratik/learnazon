import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Flinchi's privacy policy. We are COPPA compliant and committed to protecting children's privacy.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "March 15, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-fredoka text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        <div className="section-container max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="font-fredoka text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-blue-700 font-semibold text-sm">
                <strong>Plain English summary:</strong> We collect the minimum information needed to run Flinchi. We never sell data. We never show ads. Children&apos;s profiles contain no personal contact information. Parents control everything.
              </p>
            </div>
          </div>

          <Section title="1. Who We Are">
            <p>Flinchi (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Flinchi platform available at flinchi.com. We are committed to protecting the privacy of children and their families.</p>
            <p>If you have any questions about this policy, contact us at <a href="mailto:privacy@flinchi.com" className="text-orange-500 hover:underline">privacy@flinchi.com</a>.</p>
          </Section>

          <Section title="2. COPPA Compliance">
            <p>Flinchi is designed for children aged 5–10 and complies fully with the Children&apos;s Online Privacy Protection Act (COPPA). Specifically:</p>
            <ul className="list-none space-y-2 ml-0">
              {[
                "We do not collect personal information directly from children without verifiable parental consent.",
                "Parent accounts are required before any child profile is created.",
                "Children log in with a 4-digit PIN only — no email address, phone number, or other personal information is collected from children.",
                "Parents may review, edit, or delete their child's information at any time.",
                "We do not use children's data for advertising or share it with third parties for commercial purposes.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. Information We Collect">
            <p><strong className="text-gray-800">Parent accounts:</strong></p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Name and email address (required for account creation)</li>
              <li>Password (stored as a bcrypt hash — we never see your actual password)</li>
              <li>Subscription status (if applicable)</li>
            </ul>
            <p className="mt-3"><strong className="text-gray-800">Child profiles (created by parents):</strong></p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>First name or nickname</li>
              <li>Age (5–10)</li>
              <li>Selected avatar</li>
              <li>4-digit PIN (stored as a bcrypt hash)</li>
              <li>Learning progress, scores, and streaks</li>
            </ul>
            <p className="mt-3"><strong className="text-gray-800">Usage data:</strong></p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Activity results and scores per module</li>
              <li>Time spent on activities</li>
              <li>Badges earned and streaks maintained</li>
            </ul>
            <p className="mt-3"><strong className="text-gray-800">We do NOT collect:</strong> location data, photos, microphone recordings (speech is processed locally in your browser and not stored), or payment card details (handled by Stripe).</p>
          </Section>

          <Section title="4. How We Use Your Information">
            <ul className="list-disc list-inside text-sm space-y-2 ml-2">
              <li>To operate and improve the Flinchi platform</li>
              <li>To send weekly progress reports to parents (can be disabled in settings)</li>
              <li>To personalize learning difficulty and content for each child</li>
              <li>To process payments and manage subscriptions (via Stripe)</li>
              <li>To communicate service updates or respond to support requests</li>
            </ul>
            <p>We do not use your data for advertising, profiling, or sale to third parties. Ever.</p>
          </Section>

          <Section title="5. Data Sharing">
            <p>We share data only with service providers necessary to operate Flinchi:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li><strong className="text-gray-800">Supabase</strong> — database hosting (servers in the US)</li>
              <li><strong className="text-gray-800">Anthropic (Claude AI)</strong> — AI hint generation; no personal data is included in AI requests</li>
              <li><strong className="text-gray-800">Resend</strong> — email delivery for weekly reports</li>
              <li><strong className="text-gray-800">Vercel</strong> — application hosting</li>
            </ul>
            <p>All providers are contractually bound to protect your data and may not use it for their own purposes.</p>
          </Section>

          <Section title="6. Data Retention & Deletion">
            <p>You may delete your account and all associated data at any time from your account settings. Upon deletion:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>All child profiles and progress data are permanently deleted</li>
              <li>Your email address is removed from our systems within 30 days</li>
              <li>Backups are purged within 90 days</li>
            </ul>
            <p>To request data deletion, email <a href="mailto:privacy@flinchi.com" className="text-orange-500 hover:underline">privacy@flinchi.com</a>.</p>
          </Section>

          <Section title="7. Security">
            <p>We take security seriously. Our measures include:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>All passwords and PINs are hashed with bcrypt (12 rounds)</li>
              <li>All data transmitted over HTTPS/TLS</li>
              <li>HTTP security headers (CSP, HSTS, X-Frame-Options) on all pages</li>
              <li>Database access restricted to application servers only</li>
              <li>No payment card data stored on our servers (Stripe handles this)</li>
            </ul>
          </Section>

          <Section title="8. Cookies">
            <p>Flinchi uses only essential cookies required to maintain your login session. We do not use advertising cookies, tracking cookies, or third-party analytics cookies.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We will notify parents by email of any material changes to this privacy policy at least 14 days before they take effect. Continued use of Flinchi after that date constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>For privacy questions, data requests, or to report concerns:</p>
            <p><strong className="text-gray-800">Email:</strong> <a href="mailto:privacy@flinchi.com" className="text-orange-500 hover:underline">privacy@flinchi.com</a></p>
            <p>We aim to respond to all privacy requests within 5 business days.</p>
          </Section>

          <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-400 flex gap-6">
            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Use</Link>
            <Link href="/safety" className="hover:text-orange-500 transition-colors">Child Safety</Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
