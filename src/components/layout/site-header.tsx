"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
      role="banner"
    >
      <nav className="section-container flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-lg" aria-label="KidLearn home">
          <span className="text-3xl" aria-hidden="true">🌟</span>
          <span className="font-fredoka text-2xl font-bold" style={{ color: "var(--color-blue)" }}>KidLearn</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[["/#features","Features"],["/#modules","What We Teach"],["/#pricing","Pricing"],["/blog","Blog"]].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-gray-700 hover:text-brand-blue transition-colors">{label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold transition-colors px-4 py-2" style={{ color: "var(--color-blue)" }}>Log In</Link>
          <Link href="/signup" className="btn-primary !py-2.5 !px-6 !text-base">Start Free 🚀</Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen} aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}>
          <span className="text-2xl" aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t px-4 py-6 flex flex-col gap-4 shadow-lg" style={{ borderColor: "var(--color-border)" }}>
          {[["/#features","Features"],["/#modules","What We Teach"],["/#pricing","Pricing"],["/blog","Blog"]].map(([href, label]) => (
            <Link key={href} href={href} className="font-semibold text-gray-700" onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <hr style={{ borderColor: "var(--color-border)" }} />
          <Link href="/login" className="font-bold" style={{ color: "var(--color-blue)" }} onClick={() => setMenuOpen(false)}>Log In</Link>
          <Link href="/signup" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Start Free 🚀</Link>
        </div>
      )}
    </header>
  );
}
