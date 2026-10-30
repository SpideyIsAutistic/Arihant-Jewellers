import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPage from "@/views/ProductPage";
import { getAllProductSlugs, getServerProductBySlug, getServerSettings } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return [{ slug: "_" }, ...slugs.map((slug) => ({ slug }))];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug === "_") {
    return {
      title: "Catalogue | Arihant Jewellers",
    };
  }
  const data = getServerProductBySlug(slug);
  if (!data) return { title: "Product Not Found" };

  const { product } = data;
  const title = product.seoTitle || product.name;
  const description =
    product.seoDescription ||
    product.description ||
    `Explore ${product.name} crafted in ${[product.metal, product.purity].filter(Boolean).join(" ")} from Arihant Jewellers, Thane.`;
  const url = absoluteUrl(`/products/${product.slug}`);
  const images = product.images.map((img) => (img.url.startsWith("http") ? img.url : absoluteUrl(img.url)));
  // JPG share card from scripts/og-images.py (WhatsApp previews don't reliably show WebP); new products fall back to their photo
  if (fs.existsSync(path.join(process.cwd(), "public/og", `${product.slug}.jpg`))) images.unshift(absoluteUrl(`/og/${product.slug}.jpg`));

  const brand = `${title} | Arihant Jewellers`;
  return {
    title: brand.length > 60 ? { absolute: title } : title, // long names drop the brand suffix to stay under 60 chars
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Arihant Jewellers`,
      description,
      url,
      images: images.length > 0 ? [{ url: images[0], alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Arihant Jewellers`,
      description,
      images: images.length > 0 ? [images[0]] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug === "_") {
    return <ProductPage />;
  }
  const data = getServerProductBySlug(slug);
  if (!data) notFound();
  const settings = getServerSettings();
  return <ProductPage initialData={data} initialSettings={settings} slug={slug} />;
}
