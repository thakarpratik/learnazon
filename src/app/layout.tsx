/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://kidlearn.app"),
  title: {
    default: "KidLearn – AI-Powered Learning for Kids Ages 5–10",
    template: "%s | KidLearn",
  },
  description:
    "KidLearn makes learning magical. Math, spelling, public speaking, money & more — personalized by AI for children aged 5–10. Free to start.",
  keywords: [
    "kids learning app","educational games for children","AI tutoring kids",
    "math games ages 5-10","homeschool app","spelling games kids",
    "public speaking kids","learn to tell time",
  ],
  authors: [{ name: "KidLearn" }],
  creator: "KidLearn",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "KidLearn",
    title: "KidLearn – AI-Powered Learning for Kids Ages 5–10",
    description: "Personalized, game-based learning for children. Math, spelling, public speaking & more — powered by AI.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "KidLearn – Fun learning for kids" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KidLearn – AI-Powered Learning for Kids",
    description: "Game-based learning for children aged 5–10. Powered by AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Baloo 2 (headings) + Comic Neue (body) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
