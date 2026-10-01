import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { asset } from "@/lib/utils";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Display face: variable width + optical size, so the resizable hero name stays crisp.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://sazzadali-portfolio.vercel.app";
const isVercel = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "vercel";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sazzad Ali | Frontend & UI/UX Engineer",
  description:
    "Portfolio of Sazzad Ali — Sydney-based web developer and UI designer crafting fast, animated, accessible experiences with Next.js, React and GSAP.",
  keywords: ["Next.js", "React", "GSAP", "UI/UX", "Frontend Developer", "Web Developer", "Sydney"],
  authors: [{ name: "Sazzad Ali", url: SITE_URL }],
  creator: "Sazzad Ali",
  icons: { icon: { url: asset("/my-letter-favicon.svg"), type: "image/svg+xml" } },
  openGraph: {
    title: "Sazzad Ali | Frontend & UI/UX Engineer",
    description: "Creating immersive web experiences with React, Next.js and GSAP animation.",
    url: SITE_URL,
    siteName: "Sazzad Ali Portfolio",
    images: [{ url: "/personal-portfolio.png", alt: "Sazzad Ali Portfolio Screenshot" }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sazzad Ali | Frontend & UI/UX Engineer",
    description: "Modern, responsive, animated websites with React, Next.js, Tailwind and GSAP.",
    images: ["/personal-portfolio.png"],
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the head script may set data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}>
        {children}
        {isVercel && <Analytics />}
      </body>
    </html>
  );
}
