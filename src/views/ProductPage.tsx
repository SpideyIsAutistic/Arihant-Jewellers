"use client";

import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { getProductPriceBreakup } from "@/lib/gold-rates";
import { formatDate } from "@/lib/format";
import { useLoad, useSlug, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import { absoluteUrl } from "@/lib/utils";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { AccordionItem } from "@/components/ui/Accordion";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ReviewForm } from "@/components/product/ReviewForm";
import { Stars } from "@/components/product/Rating";
import { Breadcrumbs } from "@/components/collection/CollectionHero";

const load = (slug: string) => Promise.all([getProductBySlug(slug), getSettings()]);

type ProductData = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
type SettingsData = Awaited<ReturnType<typeof getSettings>>;

export default function ProductPage({
  initialData,
  initialSettings,
  slug: staticSlug,
}: {
  initialData?: ProductData | null;
  initialSettings?: SettingsData;
  slug?: string;
} = {}) {
  const routerSlug = useSlug();
  const slug = staticSlug || routerSlug;
  const { data: res, error } = useLoad(() => load(slug), [slug]);
  // once live data arrives it wins, so an unlisted product disappears even though its page was pre-built
  const activeData = res ? res[0] : initialData;
  const activeSettings = res?.[1] ?? initialSettings;

  useTitle(activeData?.product.seoTitle ?? activeData?.product.name);
  if (!activeData || !activeSettings) {
    if (res && !res[0]) notFound();
    return <PageLoader error={error} />;
  }
  return <Product data={activeData} settings={activeSettings} />;
}

function Product({ data, settings }: { data: ProductData; settings: SettingsData }) {
  const { product, variants, card, reviews, related } = data;
  const url = absoluteUrl(`/products/${product.slug}`);
  const ratingAvg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const specs: [string, string | null | undefined][] = [
    ["Metal", product.metal],
    ["Purity", product.purity],
    ["Finish", product.finish],
    ["Stone", product.stone],
    ["Approx. weight", product.weightGrams ? `${product.weightGrams} g` : null],
    ["Dimensions", product.dimensions],
    ["Category", product.category?.name],
    ["Gender", product.gender],
    ["SKU", product.sku],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((i) => (i.url.startsWith("http") ? i.url : absoluteUrl(i.url))),
    brand: { "@type": "Brand", name: settings.storeName },
    material: [product.metal, product.purity].filter(Boolean).join(" "),
    ...(card.price > 0
      ? { offers: { "@type": "Offer", url, priceCurrency: "INR", price: (card.price / 100).toFixed(2), availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } }
      : {}),
    ...(reviews.length
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: ratingAvg.toFixed(1), reviewCount: reviews.length } }
      : {}),
  };

  const metalBreakup = getProductPriceBreakup(
    {
      price: product.price,
      metal: product.metal,
      purity: product.purity,
      weightGrams: product.weightGrams,
      makingPct: product.makingPct,
      stoneValue: product.stoneValue,
      name: product.name,
    },
    card.price,
    data.metalRates,
  );

  return (
    <>
      <div className="page-width pt-6 sm:pt-10">
        <div className="mb-6 md:hidden">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              ...(product.category ? [{ label: product.category.name, href: `/collections/${product.category.slug}` }] : []),
              { label: product.name },
            ]}
          />
        </div>
        <div className="grid gap-10 md:grid-cols-[minmax(0,52%)_minmax(0,1fr)] md:gap-16 lg:gap-20">
          <div>
            <ProductGallery
              images={product.images.map((i) => ({ url: i.url, alt: i.alt }))}
              name={product.name}
              badge={card.discountPct > 0 ? <span className="ribbon">Save {card.discountPct}%</span> : undefined}
            />
            <div className="mt-10 hidden border-t border-line/80 md:block">
              <ProductDetails product={product} specs={specs} settings={settings} />
            </div>
          </div>
          <div className="md:sticky md:top-[calc(var(--header-height)+28px)] md:self-start">
            <div className="mb-6 hidden md:block">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  ...(product.category ? [{ label: product.category.name, href: `/collections/${product.category.slug}` }] : []),
                  { label: product.name },
                ]}
              />
            </div>
            <ProductInfo
              product={{ id: product.id, slug: product.slug, name: product.name, sku: product.sku, image: product.images[0]?.url ?? null, isRing: product.categoryId === "rings" }}
              variants={variants.map((v) => ({ id: v.id, title: v.title, stock: v.stock, price: v.price, compareAt: v.compareAt, discountPct: v.discountPct, sku: v.sku }))}
              trustBadges={settings.trustBadges}
              shareUrl={url}
              metalBreakup={metalBreakup}
            />
            <div className="mt-10 border-t border-line/80 md:hidden">
              <ProductDetails product={product} specs={specs} settings={settings} />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="page-width pt-20 sm:pt-28" aria-labelledby="reviews-title">
        <span className="eyebrow">Client Feedback</span>
        <h2 id="reviews-title" className="h-section">
          Customer Reviews
        </h2>
        <div className="mx-auto mt-6 max-w-[840px] text-center">
          {reviews.length ? (
            <div className="flex flex-col items-center gap-2">
              <Stars value={ratingAvg} size={18} />
              <p className="text-[13px] text-body2">
                {ratingAvg.toFixed(1)} out of 5 · Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-body2">Be the first to write a review</p>
          )}
          <div className="flex justify-center mt-4">
            <ReviewForm productId={product.id} />
          </div>
        </div>
        {reviews.length > 0 && (
          <ul className="mx-auto mt-10 max-w-[840px] divide-y divide-line/70 border-y border-line/70">
            {reviews.map((r) => (
              <li key={r.id} className="py-6">
                <div className="flex items-center justify-between gap-4">
                  <Stars value={r.rating} size={14} />
                  <span className="text-[11px] uppercase tracking-wider text-subtle">{formatDate(r.createdAt)}</span>
                </div>
                {r.title && <p className="mt-2 font-serif text-[17px] font-normal text-ink">{r.title}</p>}
                <p className="mt-1 text-[14px] leading-relaxed whitespace-pre-line text-body2">{r.body}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-subtle">— {r.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="page-width pt-20 sm:pt-28" aria-labelledby="related-title">
          <span className="eyebrow">Complete The Ensemble</span>
          <h2 id="related-title" className="h-section mb-10 sm:mb-14">
            Related products
          </h2>
          <ProductCarousel cards={related} />
        </section>
      )}

      <RecentlyViewed excludeId={product.id} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { label: "Home", href: "/" },
              ...(product.category ? [{ label: product.category.name, href: `/collections/${product.category.slug}` }] : []),
              { label: product.name, href: `/products/${product.slug}` },
            ].map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.label, item: absoluteUrl(b.href) })),
          }),
        }}
      />
    </>
  );
}

function ProductDetails({
  product,
  specs,
  settings,
}: {
  product: { description: string; careInstructions: string | null };
  specs: [string, string | null | undefined][];
  settings: Awaited<ReturnType<typeof getSettings>>;
}) {
  return (
    <>
      <AccordionItem title="Description" defaultOpen>
        <div className="text-[14px] leading-[1.8] text-body2">
          {product.description.split(/\n{2,}/).map((p, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </AccordionItem>
      <AccordionItem title="Specifications">
        <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-[13px] leading-relaxed">
          {specs
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-subtle font-medium uppercase tracking-wider text-[11px]">{k}</dt>
                <dd className="text-ink font-normal">{v}</dd>
              </div>
            ))}
        </dl>
      </AccordionItem>
      <AccordionItem title="Jewellery Care">
        <div className="text-[13px] leading-[1.8] text-body2">
          {product.careInstructions ? (
            <p className="whitespace-pre-line">{product.careInstructions}</p>
          ) : (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Store each piece separately in the pouch or box provided, away from moisture.</li>
              <li>Put jewellery on after perfume, lotion and hairspray, and take it off before bathing or swimming.</li>
              <li>Wipe gently with a soft, dry cloth after wearing. Silver can be refreshed with a silver polishing cloth.</li>
              <li>Avoid contact with harsh chemicals, chlorine and household cleaners.</li>
            </ul>
          )}
        </div>
      </AccordionItem>
      <AccordionItem title="Visit & Enquiries">
        <div className="text-[13px] leading-[1.8] text-body2">
          <p>Every piece can be seen in person at our showroom. Ask us on WhatsApp or through the enquiry form for current price, availability, sizing and customisation.</p>
          {settings.address && <p className="mt-3 whitespace-pre-line">{settings.address}</p>}
          {settings.hours && <p className="mt-1">Hours: {settings.hours}</p>}
        </div>
      </AccordionItem>
    </>
  );
}
