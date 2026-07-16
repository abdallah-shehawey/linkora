import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { PwaRegister } from "@/components/pwa-register";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = SITE_URL;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070711",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Linkora",
  appleWebApp: {
    capable: true,
    title: "Linkora",
    statusBarStyle: "black-translucent",
  },
  title: {
    default: "Linkora — One link for everything you are",
    template: "%s · Linkora",
  },
  description:
    "Linkora is the modern link-in-bio. Build a stunning, professional page for all your links in minutes — themes, analytics, and your own handle.",
  keywords: [
    "link in bio",
    "linktree alternative",
    "bio link",
    "creator tools",
    "linkora",
  ],
  openGraph: {
    title: "Linkora — One link for everything you are",
    description:
      "The modern, professional link-in-bio. Beautiful themes, real analytics, your own handle.",
    url: siteUrl,
    siteName: "Linkora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkora — One link for everything you are",
    description: "The modern, professional link-in-bio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PwaRegister />
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(16,16,29,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e8e8f0",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
