import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Product: [
    { label: "Features",     href: "/#features"  },
    { label: "Modules",      href: "/#modules"   },
    { label: "Pricing",      href: "/pricing"    },
    { label: "Blog",         href: "/blog"       },
  ],
  Company: [
    { label: "About",           href: "/about"   },
    { label: "Safety & Privacy",href: "/safety"  },
    { label: "Terms of Use",    href: "/terms"   },
    { label: "Contact",         href: "/contact" },
  ],
  Learn: [
    { label: "Math Games",      href: "/learn/math"     },
    { label: "Time Telling",    href: "/learn/time"     },
    { label: "Public Speaking", href: "/learn/speaking" },
    { label: "Spelling",        href: "/learn/words"    },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{ background: "var(--text)" }}
      className="text-white"
      role="contentinfo"
    >
      <div className="section-container py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="flex flex-col">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center justify-center mb-4 w-fit px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              aria-label="Flinchi home"
            >
              <Image src="/flinchi.svg" alt="Flinchi" width={120} height={36} />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              AI-powered learning for children aged 5–10. Making education magical, one game at a time.
            </p>
            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl text-gray-300"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2z" stroke="#34D399" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              COPPA Compliant · No Ads · Child Safe
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h3 className="font-baloo text-base font-bold text-white mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p>© {year} Flinchi. Built with care and Claude AI.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
