import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CollectionPage from "@/views/CollectionPage";
import { getAllCollectionSlugs, getServerListing } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import { metaDescription } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getAllCollectionSlugs();
  return [{ slug: "_" }, ...slugs.map((slug) => ({ slug }))];
}

type Props = {
  params: Promise<{ slug: string }>;
};


/** JPG version of the collection banner from scripts/og-images.py, else the default share card. */
function shareImage(image?: string | null) {
  const jpg = image?.startsWith("/catalogue/") ? image.replace("/catalogue/", "/og/").replace(/\.webp$/, ".jpg") : null;
  return jpg && fs.existsSync(path.join(process.cwd(), "public", jpg)) ? jpg : "/og/default.jpg";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "_") {
    return {
      title: "Collections | Arihant Jewellers",
    };
  }
  const listing = getServerListing(slug);
  if (!listing) return { title: "Collection Not Found" };

  const title = listing.seoTitle || listing.title;
  const description = metaDescription(
    listing.seoDescription || listing.description || "",
    `Browse ${listing.title} at Arihant Jewellers, Thane: gold, diamond and gemstone jewellery. Enquire on WhatsApp.`,
  );
  const url = absoluteUrl(`/collections/${slug}`);
  const image = listing.heroImage
    ? listing.heroImage.startsWith("http")
      ? listing.heroImage
      : absoluteUrl(listing.heroImage)
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Arihant Jewellers`,
      description,
      url,
      type: "website",
      images: [{ url: shareImage(image), width: 1200, height: 630, alt: listing.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Arihant Jewellers`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug === "_") {
    return <CollectionPage />;
  }
  const listing = getServerListing(slug);
  if (!listing) notFound();
  return <CollectionPage initialListing={listing} slug={slug} />;
}
