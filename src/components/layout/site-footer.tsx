import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Modules",  href: "/#modules"  },
    { label: "Pricing",  href: "/pricing"   },
    { label: "Blog",     href: "/blog"      },
  ],
  Company: [
    { label: "About",          href: "/about"   },
    { label: "Safety & Privacy", href: "/safety" },
    { label: "Terms of Use",   href: "/terms"   },
    { label: "Contact",        href: "/contact" },
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
    <footer style={{ background: "var(--color-text)" }} className="text-white" role="contentinfo">
      <div className="section-container py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="KidLearn home">
              <span className="text-3xl">🌟</span>
              <span className="font-fredoka text-2xl font-bold" style={{ color: "var(--color-yellow)" }}>KidLearn</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              AI-powered learning for children aged 5–10. Making education magical, one game at a time.
            </p>
            <p className="text-xs text-gray-500 bg-gray-800 rounded-lg px-3 py-2 inline-block">
              🔒 COPPA Compliant · No Ads · Child Safe
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h3 className="font-fredoka text-lg font-bold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors"
                      style={{ ["--tw-text-opacity" as string]: "1" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {year} KidLearn. Built with ❤️ and Claude AI.</p>
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
