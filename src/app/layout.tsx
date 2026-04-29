/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com"),
  title: {
    default: "Flinchi – AI-Powered Learning for Kids Ages 5–10",
    template: "%s | Flinchi",
  },
  description:
    "Flinchi makes learning magical. Math, spelling, public speaking, money & more — personalized by AI for children aged 5–10. Free to start.",
  keywords: [
    "kids learning app","educational games for children","AI tutoring kids",
    "math games ages 5-10","homeschool app","spelling games kids",
    "public speaking kids","learn to tell time",
  ],
  authors: [{ name: "Flinchi" }],
  creator: "Flinchi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Flinchi",
    title: "Flinchi – AI-Powered Learning for Kids Ages 5–10",
    description: "Personalized, game-based learning for children. Math, spelling, public speaking & more — powered by AI.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Flinchi – Fun learning for kids" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flinchi – AI-Powered Learning for Kids",
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
        <Analytics />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LE8Y9J3ZLZ" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-LE8Y9J3ZLZ');`}
        </Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1255685133051397');fbq('track','PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1255685133051397&ev=PageView&noscript=1" alt="" />
        </noscript>
      </body>
    </html>
  );
}
