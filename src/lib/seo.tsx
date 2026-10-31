import type { Metadata } from "next";
import { absoluteUrl } from "./utils";

/** Metadata for a content page: title (site name added by the layout), description, canonical and share card. */
export function pageMeta(title: string, description: string, path: string, image = "/og/default.jpg"): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Arihant Jewellers`, description, url, images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title: `${title} | Arihant Jewellers`, description, images: [image] },
  };
}

/** FAQPage structured data from question/answer pairs. */
export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** 70–155 characters: short descriptions get the fallback added, long ones are cut at a word. */
export function metaDescription(text: string, fallback: string) {
  let d = text.trim();
  if (d.length < 70) d = d ? `${d.replace(/\.?$/, ".")} ${fallback}` : fallback;
  return d.length <= 155 ? d : `${d.slice(0, 152).replace(/\s+\S*$/, "")}…`;
}
