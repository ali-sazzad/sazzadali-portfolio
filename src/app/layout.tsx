import { Analytics } from '@vercel/analytics/next';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sazzad Ali | Frontend & UI/UX Engineer",
  description: "Created with 💓 by Sazzad with create next app – crafting delightful UIs with code and design.",
  keywords: ["Next.js", "React", "UI/UX", "Frontend Developer", "Web Developer"],
  authors: [{ name: "Sazzad Ali", url: "https://sazzadali-portfolio.vercel.app" }],
  creator: "Sazzad Ali",
  themeColor: "#0f172a",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  openGraph: {
    title: "Sazzad Ali | Frontend & UI/UX Engineer",
    description: "Creating immersive web experiences with React, Next.js, and 3D animation.",
    url: "https://sazzadali-portfolio.vercel.app",
    siteName: "Sazzad Ali Portfolio",
    images: [
      {
        url: "https://sazzadali-portfolio.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sazzad Ali Portfolio Screenshot",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sazzad Ali | Full-Stack UI Developer",
    description: "Hire me to build modern, responsive websites with React, Tailwind, and animation.",
    creator: "@sazzad_codes",
    images: ["https://sazzadali-portfolio.vercel.app/og-image.jpg"],
  },
  alternates: {
    canonical: "https://sazzadali-portfolio.vercel.app",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/my-letter-favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        
      </body>
    </html>
  );
}
