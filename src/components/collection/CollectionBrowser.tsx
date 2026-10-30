"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { Facets, FilterParams, ProductCard as Card } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { loadMoreProducts } from "@/lib/actions/store";
import { IconChevronDown, IconClose, IconFilter, IconGrid, IconList } from "@/components/ui/Icons";
import { FilterDrawer } from "./FilterDrawer";
import { useUpdateParams } from "./use-update-params";
import { cn } from "@/lib/utils";

export const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Discount: High to Low" },
];

const PAGE = 24;

type Props = {
  slug: string | null; // null = search results
  initial: Card[];
  total: number;
  facets: Facets;
  filters: FilterParams;
  query: Record<string, string>;
};

export function CollectionBrowser({ slug, initial, total, facets, filters, query }: Props) {
  const [items, setItems] = useState(initial);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [pending, start] = useTransition();
  const sentinel = useRef<HTMLDivElement>(null);
  const update = useUpdateParams();
  const hasMore = items.length < total;

  const loadMore = useCallback(() => {
    if (pending || !hasMore) return;
    start(async () => {
      const next = await loadMoreProducts(slug, query, items.length, PAGE);
      setItems((cur) => {
        const seen = new Set(cur.map((c) => c.id));
        return [...cur, ...next.filter((n) => !seen.has(n.id))];
      });
    });
  }, [pending, hasMore, slug, query, items.length]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, hasMore]);

  useEffect(() => {
    if (!sortOpen) return;
    const close = () => setSortOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("click", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [sortOpen]);

  const sortLabel = SORTS.find((s) => s.value === filters.sort)?.label ?? "Relevance";
  const activeChips = activeFilterChips(filters, facets);
  const prompts = buildPrompts(facets, filters);

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-[var(--header-height)] z-30 mt-8 border-y border-line/80 bg-white/95 backdrop-blur-md sm:mt-12">
        <div className="grid h-[48px] grid-cols-[1fr_1fr_auto] text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-medium sm:grid-cols-[112px_1fr_210px_148px]">
          <div className="order-3 flex items-center justify-center gap-3 border-l border-line px-4 sm:order-none sm:border-r sm:border-l-0">
            <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={cn("transition-colors", view === "grid" ? "text-ink" : "text-[#9a948c] hover:text-ink")}>
              <IconGrid size={17} />
            </button>
            <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("transition-colors", view === "list" ? "text-ink" : "text-[#9a948c] hover:text-ink")}>
              <IconList size={17} />
            </button>
          </div>
          <p className="hidden items-center justify-center text-[11px] font-medium tracking-[0.2em] text-subtle uppercase sm:flex">
            {total} {total === 1 ? "Product" : "Products"}
          </p>
          <div className="relative order-2 border-l border-line sm:order-none">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSortOpen((v) => !v);
              }}
              className="flex h-full w-full items-center justify-center gap-2 text-[11px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-ink hover:text-subtle transition-colors"
            >
              <span className="sm:hidden">Sort</span>
              <span className="hidden sm:inline">{sortLabel}</span>
              <IconChevronDown size={13} className={cn("transition-transform duration-300", sortOpen && "rotate-180")} />
            </button>
            {sortOpen && (
              <ul role="listbox" aria-label="Sort by" className="absolute top-full right-0 z-20 w-[220px] animate-drop-in border border-line bg-white py-3 normal-case shadow-xl sm:left-0">
                {SORTS.map((s) => (
                  <li key={s.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={filters.sort === s.value}
                      className={cn(
                        "block w-full px-5 py-2 text-left text-[13px] tracking-normal transition-colors",
                        filters.sort === s.value ? "font-semibold text-ink bg-cream/50" : "text-subtle hover:text-ink hover:bg-cream/30",
                      )}
                      onClick={() =>
                        update((p) => {
                          if (s.value === "relevance") p.delete("sort");
                          else p.set("sort", s.value);
                        })
                      }
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="order-1 flex items-center justify-center gap-2 text-[11px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-ink hover:text-subtle transition-colors sm:order-none sm:border-l sm:border-line"
          >
            <IconFilter size={15} className="sm:hidden" />
            Filters{activeChips.length ? ` (${activeChips.length})` : ""}
          </button>
        </div>
      </div>

      <div className="page-width">
        <p className="pt-4 text-center text-[11px] font-medium tracking-[0.18em] text-subtle uppercase sm:hidden">
          {total} {total === 1 ? "Product" : "Products"}
        </p>

        {activeChips.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2 pt-6">
            {activeChips.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={() => update(c.remove)} className="flex items-center gap-1.5 border border-line bg-cream/30 px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-ink hover:border-ink transition-colors">
                  {c.label} <IconClose size={12} />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="text-[11px] font-medium tracking-[0.14em] uppercase text-subtle hover:text-ink underline underline-offset-4 transition-colors"
                onClick={() =>
                  update((p) => {
                    ["category", "metal", "finish", "gender", "min", "max", "discount", "q"].forEach((k) => p.delete(k));
                  })
                }
              >
                Clear all
              </button>
            </li>
          </ul>
        )}

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-[440px] mx-auto animate-fade-in">
            <span className="eyebrow">Selection</span>
            <p className="font-serif text-[26px] font-light text-ink mt-2">No products match these filters.</p>
            <p className="mt-2 text-[13px] text-body2">Try adjusting your filters or search terms.</p>
            <button
              type="button"
              className="btn-outline mt-7"
              onClick={() => update((p) => ["category", "metal", "finish", "gender", "min", "max", "discount", "q"].forEach((k) => p.delete(k)))}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul
            className={cn(
              "grid pt-8 sm:pt-12",
              view === "grid" ? "grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 md:gap-8" : "grid-cols-1 gap-6 md:grid-cols-2",
            )}
          >
            {items.map((c, i) => {
              const prompt = (i + 1) % 8 === 0 && i + 1 < items.length ? prompts[(i + 1) / 8 - 1] : undefined;
              return (
                <Fragment key={c.id}>
                  <li>
                    <ProductCard card={c} variant={view === "list" ? "list" : "grid"} priority={i < 4} />
                  </li>
                  {prompt && (
                    <li className="col-span-full">
                      <QuickPrompt prompt={prompt} onMore={() => setFiltersOpen(true)} />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ul>
        )}

        <div ref={sentinel} aria-hidden className="h-px" />
        {hasMore && (
          <div className="flex justify-center pt-10">
            <button type="button" className="btn-outline" onClick={loadMore} disabled={pending}>
              {pending ? "Loading…" : `Load more (${total - items.length})`}
            </button>
          </div>
        )}
      </div>

      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} facets={facets} filters={filters} />
    </>
  );
}

/* ───────── In-grid quick filter prompts (reference pattern) ───────── */

type Prompt = { title: string; param: string; options: { value: string; label: string }[] };

function buildPrompts(f: Facets, active: FilterParams): Prompt[] {
  const out: Prompt[] = [];
  if (!active.category.length && f.category.length > 1)
    out.push({ title: "Which category would you prefer?", param: "category", options: f.category.map((o) => ({ value: o.value, label: o.label })) });
  if (active.discount == null && f.discount.length > 0)
    out.push({ title: "How much discount do you want?", param: "discount", options: f.discount.map((o) => ({ value: o.value, label: `${o.value}%` })) });
  if (!active.finish.length && f.finish.length > 1)
    out.push({ title: "Which finish would you prefer?", param: "finish", options: f.finish.map((o) => ({ value: o.value, label: o.label })) });
  if (!active.metal.length && f.metal.length > 1)
    out.push({ title: "Which metal would you prefer?", param: "metal", options: f.metal.map((o) => ({ value: o.value, label: o.label })) });
  return out;
}

function QuickPrompt({ prompt, onMore }: { prompt: Prompt; onMore: () => void }) {
  const update = useUpdateParams();
  const shown = prompt.options.slice(0, 5);
  return (
    <div className="jewel-radius border border-ink/80 px-4 py-4 sm:px-5">
      <p className="text-[15px] font-bold sm:text-[16px]">{prompt.title}</p>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {shown.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              className="rounded-full border border-line bg-white px-3.5 py-1 text-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:border-ink sm:text-[15px]"
              onClick={() => update((p) => p.set(prompt.param, o.value))}
            >
              {o.label}
            </button>
          </li>
        ))}
        {prompt.options.length > shown.length && (
          <li>
            <button type="button" onClick={onMore} className="rounded-full bg-ink px-3.5 py-1 text-[14px] text-white">
              More +
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

function activeFilterChips(f: FilterParams, facets: Facets) {
  const chips: { key: string; label: string; remove: (p: URLSearchParams) => void }[] = [];
  const listChip = (param: "category" | "metal" | "finish" | "gender", values: string[], labelOf?: (v: string) => string) => {
    for (const v of values)
      chips.push({
        key: `${param}:${v}`,
        label: labelOf ? labelOf(v) : v,
        remove: (p) => {
          const rest = values.filter((x) => x !== v);
          if (rest.length) p.set(param, rest.join(","));
          else p.delete(param);
        },
      });
  };
  const catLabel = new Map(facets.category.map((c) => [c.value, c.label]));
  listChip("category", f.category, (v) => catLabel.get(v) ?? v);
  listChip("metal", f.metal);
  listChip("finish", f.finish);
  listChip("gender", f.gender);
  if (f.min != null || f.max != null)
    chips.push({
      key: "price",
      label: `₹${(f.min ?? facets.priceRange.min).toLocaleString("en-IN")} – ₹${(f.max ?? facets.priceRange.max).toLocaleString("en-IN")}`,
      remove: (p) => {
        p.delete("min");
        p.delete("max");
      },
    });
  if (f.discount != null) chips.push({ key: "discount", label: `${f.discount}% or more off`, remove: (p) => p.delete("discount") });
  if (f.q) chips.push({ key: "q", label: `“${f.q}”`, remove: (p) => p.delete("q") });
  return chips;
}
