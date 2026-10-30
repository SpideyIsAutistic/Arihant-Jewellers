"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { applyFilters, parseFilterParams, searchCatalog, sortCards } from "@/lib/catalog";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { useLoad, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import { getSettings } from "@/lib/settings";

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}

function Search() {
  const params = useSearchParams();
  const sp = Object.fromEntries(params.entries());
  const q = String(sp.q ?? "").trim().slice(0, 60);
  const { data, error } = useLoad(() => Promise.all([getSettings(), searchCatalog(q)]), [q]);
  useTitle(q ? `Search results for “${q}”` : "Search");
  if (!data) return <PageLoader error={error} />;
  const [settings, { items, categories }] = data;
  const filters = parseFilterParams({ ...sp, q: undefined });
  const ordered = filters.sort === "relevance" ? items : sortCards(items, filters.sort);
  const { items: filtered, facets } = applyFilters(ordered, { ...filters, q: "", sort: "none" });
  const query = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : (v ?? "")]));

  return (
    <>
      <div className="bg-cream py-10 sm:py-14">
        <div className="page-width text-center">
          <h1 className="h-section">{q ? <>Results for “{q}”</> : "Search"}</h1>
          <form action="/search" className="mx-auto mt-6 flex max-w-[560px] border border-ink bg-white">
            <label htmlFor="q" className="sr-only">
              Search
            </label>
            <input id="q" name="q" defaultValue={q} placeholder="Search for necklaces, rings, jhumkas…" className="min-w-0 flex-1 px-4 py-3 outline-none" />
            <button type="submit" className="bg-ink px-6 text-[13px] tracking-[0.1em] text-white uppercase">
              Search
            </button>
          </form>
          {categories.length > 0 && (
            <p className="mt-4 text-[14px] text-body2">
              Browse:{" "}
              {categories.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && ", "}
                  <Link href={`/collections/${c.slug}`} className="underline underline-offset-2">
                    {c.name}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
      {q && items.length > 0 ? (
        <CollectionBrowser key={JSON.stringify(query)} slug={null} initial={filtered.slice(0, 24)} total={filtered.length} facets={facets} filters={filters} query={query} />
      ) : (
        <div className="page-width py-16 text-center">
          <p className="text-[16px]">{q ? `Sorry, nothing matched “${q}”.` : "What are you looking for?"}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {settings.popularSearches.map((t) => (
              <li key={t}>
                <Link href={`/search?q=${encodeURIComponent(t)}`} className="inline-block rounded-full border border-line px-4 py-1.5 text-[14px] hover:border-ink">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
