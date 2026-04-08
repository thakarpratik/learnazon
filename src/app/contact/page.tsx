import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Flinchi team. We respond to all messages within 1 business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        <div className="section-container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <div className="text-5xl mb-4">💬</div>
              <h1 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Get in touch</h1>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We&apos;re a small team and we read every message. Whether you have a question, feedback, or just want to say hi — we&apos;d love to hear from you.
              </p>
              <div className="space-y-5">
                {[
                  { emoji: "📧", label: "General enquiries", email: "hello@flinchi.com" },
                  { emoji: "🔒", label: "Privacy & data", email: "privacy@flinchi.com" },
                  { emoji: "🛡️", label: "Safety concerns", email: "safety@flinchi.com" },
                  { emoji: "💼", label: "Press & partnerships", email: "press@flinchi.com" },
                ].map((contact) => (
                  <div key={contact.email} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                      {contact.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{contact.label}</p>
                      <a href={`mailto:${contact.email}`} className="font-semibold text-orange-500 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-green-50 rounded-2xl p-4 border border-green-200">
                <p className="text-sm font-semibold text-green-700">
                  ⏱ We typically respond within 1 business day.
                </p>
              </div>
            </div>

            {/* Right — contact form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
