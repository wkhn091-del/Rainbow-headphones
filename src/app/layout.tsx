import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Hebrew } from "next/font/google";
import { CartProvider } from "@/components/commerce/CartProvider";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { Analytics } from "@/components/analytics/Analytics";
import { AccessibilityPanel } from "@/components/a11y/AccessibilityPanel";
import "./globals.css";

const plexHebrew = IBM_Plex_Sans_Hebrew({
  variable: "--font-body",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000",
  ),
  title: "Nexa Pro — אוזניות | Nexa Audio",
  description:
    "Nexa Pro: ANC, עד 48 שעות, טעינה 10 דק׳→3 ש׳. אחריות שנתיים. ₪1,290 כולל מע״מ. 300 יחידות השקה · LAUNCH15.",
  alternates: {
    languages: {
      he: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "Nexa Pro — עד 48 שעות שקט",
    description: "גללו. בחרו צבע. תשלום מאובטח. מלאי השקה מוגבל.",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/images/lifestyle/nexa-real-desk.jpg",
        width: 1200,
        height: 675,
        alt: "Nexa Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Pro",
    description: "ANC · 48 שעות · אחריות שנתיים עד הבית",
    images: ["/images/lifestyle/nexa-real-desk.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${plexHebrew.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] font-[family-name:var(--font-body)] text-[var(--color-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-bg)]"
        >
          דלג לתוכן הראשי
        </a>
        <OrganizationJsonLd />
        <SmoothScroll />
        <MagneticCursor />
        <Analytics />
        <AccessibilityPanel />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
