import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { AgeSelectorSection } from "@/components/landing/age-selector-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ModulesSection } from "@/components/landing/modules-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { BuiltByDadSection } from "@/components/landing/built-by-dad-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "KidLearn – AI-Powered Learning for Kids Ages 5–10",
  description:
    "Game-based learning that adapts to your child. Math, spelling, public speaking, money & life skills — personalized by AI. Start free today.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <AgeSelectorSection />
        <FeaturesSection />
        <ModulesSection />
        <TestimonialsSection />
        <BuiltByDadSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
