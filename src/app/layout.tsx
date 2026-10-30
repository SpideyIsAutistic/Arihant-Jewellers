import type { Metadata, Viewport } from "next";
import { fontSans, fontSerif } from "@/fonts";
import "./globals.css";

const siteUrl =
  !process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL.includes("localhost"))
    ? "https://arihant-jewellers-9dffa.web.app"
    : process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Arihant Jewellers | Gold, Diamond & Gemstone Jewellery",
    template: "%s | Arihant Jewellers",
  },
  description:
    "Explore Arihant Jewellers, Thane — gold necklaces, mangalsutras and chains, diamond rings and sets, precious gemstones and silver articles. Enquire on WhatsApp.",
  applicationName: "Arihant Jewellers",
  openGraph: {
    type: "website",
    siteName: "Arihant Jewellers",
    locale: "en_IN",
    title: "Arihant Jewellers | Gold, Diamond & Gemstone Jewellery",
    description:
      "Gold, diamond and gemstone jewellery from Arihant Jewellers, Thane.",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Arihant Jewellers bridal gold necklaces" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fontSans.variable} ${fontSerif.variable}`} suppressHydrationWarning>
      <body className="font-sans text-text antialiased selection:bg-cream-2 selection:text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
