import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  getSiteUrl,
  SITE_NAME,
} from "@/utils/site";
import "./globals.css";
import "sweetalert2/dist/sweetalert2.css";
import Providers from "./providers";

// CSP nonce dibuat per request. Semua route harus dirender saat request agar
// Next.js bisa menempelkan nonce ke script framework dan bootstrap.
export const instant = false;


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: "%s | trcodes",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  },
};

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="id"
      nonce={nonce}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



