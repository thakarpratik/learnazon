import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Flinchi terms of use. Read about your rights and responsibilities when using the Flinchi platform.",
  alternates: { canonical: "/terms" },
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

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        <div className="section-container max-w-3xl">
          <div className="mb-12">
            <div className="text-4xl mb-4">📄</div>
            <h1 className="font-fredoka text-4xl font-bold text-gray-900 mb-3">Terms of Use</h1>
            <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>

          <Section title="1. Acceptance of Terms">
            <p>By creating an account or using Flinchi, you agree to these Terms of Use. If you are creating an account on behalf of a child, you confirm that you are the parent or legal guardian of that child and accept these terms on their behalf.</p>
          </Section>

          <Section title="2. Who Can Use Flinchi">
            <p>Flinchi accounts may only be created by adults aged 18 or older. Child profiles may only be created by the account holder (parent or guardian). Flinchi is designed for educational use by children aged 5–10.</p>
          </Section>

          <Section title="3. Your Account">
            <ul className="list-disc list-inside text-sm space-y-2 ml-2">
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must provide accurate information when creating your account.</li>
              <li>You must notify us immediately if you suspect unauthorized use of your account.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside text-sm space-y-2 ml-2">
              <li>Use Flinchi for any unlawful purpose</li>
              <li>Attempt to access other users&apos; accounts or data</li>
              <li>Reverse engineer, copy, or redistribute any part of the platform</li>
              <li>Use automated tools to scrape, crawl, or overload our servers</li>
              <li>Upload harmful, abusive, or inappropriate content</li>
            </ul>
          </Section>

          <Section title="5. Free Plan">
            <p>The free tier of Flinchi is provided as-is with no guarantees of uptime or feature availability. We reserve the right to modify, limit, or discontinue free features at any time with reasonable notice.</p>
          </Section>

          <Section title="6. Subscriptions & Payments">
            <p>Paid subscriptions are billed monthly through Stripe. You may cancel at any time; cancellation takes effect at the end of the current billing period. We do not offer refunds for partial months except where required by law.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on Flinchi — including games, graphics, AI-generated hints, and course material — is owned by Flinchi and protected by copyright. You may not reproduce or distribute any part of the platform without written permission.</p>
          </Section>

          <Section title="8. AI-Generated Content">
            <p>Flinchi uses Claude AI (by Anthropic) to generate educational hints and feedback. This content is provided for educational purposes only and may occasionally contain errors. We review AI prompts and outputs to maintain quality, but parents should supervise their children&apos;s use of the platform.</p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>Flinchi is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that the platform will be error-free or uninterrupted. Educational outcomes vary by child and we make no guarantees about learning results.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>To the maximum extent permitted by law, Flinchi shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </Section>

          <Section title="11. Governing Law">
            <p>These terms are governed by the laws of the United States. Any disputes shall be resolved through binding arbitration in accordance with the American Arbitration Association rules, except where prohibited by law.</p>
          </Section>

          <Section title="12. Changes to Terms">
            <p>We may update these terms at any time. We will notify registered users by email at least 14 days before material changes take effect. Continued use after that date constitutes acceptance.</p>
          </Section>

          <Section title="13. Contact">
            <p>Questions about these terms? Email us at <a href="mailto:legal@flinchi.com" className="text-orange-500 hover:underline">legal@flinchi.com</a>.</p>
          </Section>

          <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-400 flex gap-6">
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/safety" className="hover:text-orange-500 transition-colors">Child Safety</Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
