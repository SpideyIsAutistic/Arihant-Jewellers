"use client";

import { formatPrice } from "@/lib/format";
import { Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { applyFilters, parseFilterParams, resolveListing, type Listing, type ProductCard as CardType } from "@/lib/catalog";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { Breadcrumbs, CollectionHero } from "@/components/collection/CollectionHero";
import { ReadMore } from "@/components/collection/ReadMore";
import { useLoad, useSlug, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import { absoluteUrl } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";

type Props = {
  initialListing?: Listing | null;
  slug?: string;
};

export default function CollectionPage({ initialListing, slug: staticSlug }: Props = {}) {
  const routerSlug = useSlug();
  const slug = staticSlug || routerSlug;
  const { data: resListing, error } = useLoad(() => resolveListing(slug), [slug]);
  const listing = resListing !== undefined ? resListing : initialListing;

  useTitle(listing?.seoTitle ?? listing?.title);
  if (listing === undefined) return <PageLoader error={error} />;
  if (!listing) notFound();

  return (
    <>
      <CollectionHero title={listing.title} image={listing.heroImage} />
      {listing.startingFrom ? (
        <p className="page-width pt-4 text-center text-[15px] text-body2">
          Starting from <b className="text-ink">{formatPrice(listing.startingFrom)}</b> · final price depends on weight and today&apos;s gold rate
        </p>
      ) : null}
      <div className="page-width pt-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/collections/all" }, { label: listing.title }]} />
      </div>
      {listing.description && (
        <div className="page-width pt-6">
          <ReadMore text={listing.description} />
        </div>
      )}
      <Suspense fallback={<StaticProductGrid items={listing.items.slice(0, 24)} />}>
        <FilteredBrowser listing={listing} slug={slug} live={resListing !== undefined} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: listing.title, item: absoluteUrl(`/collections/${slug}`) },
            ],
          }),
        }}
      />
    </>
  );
}

function StaticProductGrid({ items }: { items: CardType[] }) {
  return (
    <div className="page-width py-8">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {items.map((card) => (
          <ProductCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

function FilteredBrowser({ listing, slug, live }: { listing: Listing; slug: string; live: boolean }) {
  const params = useSearchParams();
  const sp = Object.fromEntries(params.entries());
  const filters = parseFilterParams(sp);
  const { items, facets } = applyFilters(listing.items, filters);
  const query = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : (v ?? "")]));

  return (
    <CollectionBrowser
      key={`${JSON.stringify(query)}|${live ? "live" : "built"}`} // rebuild once live data replaces the pre-built list
      slug={slug}
      initial={items.slice(0, 24)}
      total={items.length}
      facets={facets}
      filters={filters}
      query={query}
    />
  );
}
