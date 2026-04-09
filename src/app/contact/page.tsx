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
                {/* Instagram */}
                <a
                  href="https://instagram.com/getflinchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Follow us</p>
                    <span className="font-semibold text-orange-500 group-hover:underline">@getflinchi</span>
                  </div>
                </a>
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
