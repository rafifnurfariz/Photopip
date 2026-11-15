import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/translations/use-language";

const googleSansFlex = localFont({
  src: "../assets/fonts/google-sans-flex-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-sans-flex",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "PhotoPip | Studio foto kecil",
    template: "%s | PhotoPip",
  },
  description:
    "Ambil foto, susun strip foto, tambahkan stiker, latar, dan bingkai, lalu unduh komposisi Anda.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "PhotoPip | Studio foto kecil",
    description: "Ambil foto dan buat strip foto versi Anda sendiri.",
    url: siteUrl,
    siteName: "PhotoPip",
    type: "website",
  },
  icons: {
    icon: "/assets/app-icons/favicon.ico",
    apple: "/assets/app-icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a09" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={googleSansFlex.variable}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Header />
            <main id="main-content">{children}</main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
