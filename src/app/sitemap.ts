import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCollectionSlugs, getServerSiteData } from "@/lib/server-catalog";
import { POLICY_PAGES } from "@/lib/policies";
import { absoluteUrl } from "@/lib/utils";
import { GUIDES } from "@/content/guides";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const productSlugs = getAllProductSlugs();
  const collectionSlugs = getAllCollectionSlugs().filter((s) => s !== "catalogue"); // alias of /collections/all
  const siteData = getServerSiteData();
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/pages/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/pages/store"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/pages/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/pages/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/gold-rate-today"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...["/hi/gold-rate-today", "/mr/gold-rate-today", "/festive/dhanteras-diwali", "/hi/dhanteras", "/mr/dhanteras", "/gold-exchange", "/pages/gold-savings-scheme", "/pages/custom-design"].map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/pages/book-appointment"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/pages/ring-size-guide"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/guides"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];

  for (const slug of collectionSlugs) {
    routes.push({
      url: absoluteUrl(`/collections/${slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const productsBySlug = new Map(siteData.products.map((p) => [p.slug, p]));
  for (const slug of productSlugs) {
    const p = productsBySlug.get(slug);
    routes.push({
      url: absoluteUrl(`/products/${slug}`),
      lastModified: p?.updatedAt || p?.createdAt || now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const slug of Object.keys(POLICY_PAGES)) {
    routes.push({
      url: absoluteUrl(`/policies/${slug}`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  return routes;
}
