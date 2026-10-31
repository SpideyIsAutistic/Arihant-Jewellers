import type { Metadata } from "next";
import { getServerSettings } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import ContactClient from "./client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Arihant Jewellers, Thane. Enquire about jewellery pieces, custom designs, sizing, and daily gold rates via WhatsApp, email, or showroom visit.",
  alternates: { canonical: absoluteUrl("/pages/contact") },
  openGraph: {
    title: "Contact Us | Arihant Jewellers",
    description: "Get in touch with Arihant Jewellers in Thane West. WhatsApp assistance, showroom visits, and custom orders.",
    url: absoluteUrl("/pages/contact"),
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Arihant Jewellers bridal gold necklaces" }],
  },
};

export default function ContactPage() {
  const settings = getServerSettings();
  return <ContactClient initialSettings={settings} />;
}
