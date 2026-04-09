"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/#features",  label: "Features"      },
  { href: "/#modules",   label: "What We Teach"  },
  { href: "/#pricing",   label: "Pricing"        },
  { href: "/blog",       label: "Blog"           },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLoggedIn = status === "authenticated";
  const role = (session?.user as any)?.role;
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(79,70,229,0.1)]"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <nav
        className="section-container flex items-center justify-between h-16 md:h-20"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Flinchi home"
        >
          <Image src="/flinchi.svg" alt="Flinchi" width={120} height={36} priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side — auth-aware */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-bold text-gray-500">
                Hi, {firstName}!
              </span>
              <Link
                href={role === "child" ? "/dashboard" : "/parent"}
                className="btn-secondary !py-2.5 !px-5 !text-sm"
              >
                {role === "child" ? "My World" : "Dashboard"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-bold px-4 py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer"
                aria-label="Log out"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold px-4 py-2 rounded-xl transition-all duration-150"
                style={{ color: "var(--indigo)" }}
              >
                Log In
              </Link>
              <Link href="/signup" className="btn-primary !py-2.5 !px-6 !text-sm">
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-indigo-50 transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {/* SVG hamburger / X */}
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t px-4 py-5 flex flex-col gap-3 shadow-[0_8px_24px_rgba(79,70,229,0.1)]"
          style={{ borderColor: "var(--border)" }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-bold text-gray-700 py-2 hover:text-indigo-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="h-px my-1" style={{ background: "var(--border)" }} />
          {isLoggedIn ? (
            <>
              <Link
                href={role === "child" ? "/dashboard" : "/parent"}
                className="font-bold text-indigo-600 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {role === "child" ? "My World" : "Dashboard"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-bold text-red-500 text-left py-2 cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-bold py-2"
                style={{ color: "var(--indigo)" }}
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-center"
                onClick={() => setMenuOpen(false)}
              >
                Start Free
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
