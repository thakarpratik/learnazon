import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Product: [
    { label: "Features",     href: "/#features"  },
    { label: "Modules",      href: "/#modules"   },
    { label: "Reviews",      href: "/reviews"    },
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
            {/* Instagram */}
            <a
              href="https://instagram.com/getflinchi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-colors mb-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @getflinchi
            </a>

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
