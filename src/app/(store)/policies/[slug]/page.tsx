import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PolicyPage from "@/views/PolicyPage";
import { POLICY_PAGES, type PolicySlug } from "@/lib/policies";
import { getServerSettings } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";

export const dynamicParams = false;

export const generateStaticParams = () => Object.keys(POLICY_PAGES).map((slug) => ({ slug }));

type Props = {
  params: Promise<{ slug: string }>;
};

const DESCRIPTIONS: Record<PolicySlug, string> = {
  "privacy-policy": "What Arihant Jewellers, Thane collects when you sign in, enquire, book a visit or save a wishlist, and how we use and protect it.",
  "terms-of-service": "Terms for using the Arihant Jewellers website: catalogue photos, indicative prices, enquiries, showroom appointments and offers.",
  "shipping-policy": "Online ordering and shipping are paused at Arihant Jewellers. Buy at our Thane showroom or with our team after an enquiry.",
  "refund-policy": "Returns and exchanges for jewellery bought at the Arihant Jewellers showroom in Thane are explained at purchase and on your invoice.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = POLICY_PAGES[slug as PolicySlug];
  if (!title) return { title: "Policy Not Found" };
  const url = absoluteUrl(`/policies/${slug}`);
  return {
    title,
    description: DESCRIPTIONS[slug as PolicySlug],
    alternates: { canonical: url },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!(slug in POLICY_PAGES)) notFound();
  const settings = getServerSettings();
  return <PolicyPage slug={slug} initialSettings={settings} />;
}
