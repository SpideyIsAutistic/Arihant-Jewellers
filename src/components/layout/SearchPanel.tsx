"use client";

import { searchCatalog } from "@/lib/catalog";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconClose, IconSearch } from "@/components/ui/Icons";
import { Img } from "@/components/ui/Img";
import { formatPrice } from "@/lib/format";

type Result = {
  products: { id: string; slug: string; name: string; image: string | null; price: number; compareAt: number | null; discountPct: number }[];
  categories: { name: string; href: string }[];
  total: number;
};

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-semibold text-ink">{text.slice(i, i + q.length)}</strong>
      {text.slice(i + q.length)}
    </>
  );
}

function useTypewriter(words: string[], active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active || !words.length) return;
    let w = 0;
    let c = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w % words.length];
      c += deleting ? -1 : 1;
      setText(word.slice(0, c));
      if (!deleting && c === word.length) {
        deleting = true;
        t = setTimeout(tick, 1400);
        return;
      }
      if (deleting && c === 0) {
        deleting = false;
        w++;
      }
      t = setTimeout(tick, deleting ? 40 : 85);
    };
    t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [words, active]);
  return text;
}

export function SearchPanel({
  open,
  onClose,
  popularSearches,
}: {
  open: boolean;
  onClose: () => void;
  popularSearches: string[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const typed = useTypewriter(popularSearches, open && !q);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setData(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { items, categories } = await searchCatalog(term.slice(0, 60));
        if (!ctrl.signal.aborted)
          setData({
            total: items.length,
            products: items.slice(0, 8).map((c) => ({ id: c.id, slug: c.slug, name: c.name, image: c.image, price: c.price, compareAt: c.compareAt, discountPct: c.discountPct })),
            categories: categories.map((c) => ({ name: c.name, href: `/collections/${c.slug}` })),
          });
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  if (!open) return null;

  const term = q.trim();
  const suggestions = popularSearches.filter((s) => !term || s.toLowerCase().includes(term.toLowerCase())).slice(0, 6);

  return (
    <>
      <div className="fixed inset-0 top-[var(--header-height)] z-[-1] animate-fade-in bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden />
      <div className="absolute inset-x-0 top-full animate-drop-in border-b border-line bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        <form
          role="search"
          className="page-width flex items-center gap-4 border-b border-line py-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (term) {
              router.push(`/search?q=${encodeURIComponent(term)}`);
              onClose();
            }
          }}
        >
          <IconSearch size={22} className="shrink-0 text-subtle" />
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search for ${typed}`}
            autoComplete="off"
            className="w-full bg-transparent font-serif text-[18px] tracking-[0.04em] outline-none placeholder:text-[#9a948c] sm:text-[22px]"
          />
          <button type="button" aria-label="Close search" onClick={onClose} className="p-1.5 text-subtle hover:text-ink transition-colors">
            <IconClose size={22} />
          </button>
        </form>

        {term.length >= 2 && (
          <div className="page-width grid max-h-[min(70vh,640px)] gap-10 overflow-y-auto py-8 md:grid-cols-[240px_1fr]">
            <div className="space-y-6 text-[14px]">
              {!!data?.categories.length && (
                <div>
                  <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-subtle uppercase">Categories</p>
                  <ul className="space-y-2">
                    {data.categories.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={onClose} className="font-serif text-[15px] hover:text-ink transition-colors">
                          <Highlight text={c.name} q={term} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!!suggestions.length && (
                <div>
                  <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-subtle uppercase">Popular searches</p>
                  <ul className="space-y-2">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <Link href={`/search?q=${encodeURIComponent(s)}`} onClick={onClose} className="text-[13px] text-body2 hover:text-ink transition-colors">
                          <Highlight text={s} q={term} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              {loading && !data && <p className="text-[12px] uppercase tracking-wider text-subtle">Searching…</p>}
              {data && data.products.length === 0 && (
                <p className="font-serif text-[18px] text-body2">No creations found for “{term}”. Try a different keyword.</p>
              )}
              {data && data.products.length > 0 && (
                <>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                    {data.products.map((p) => (
                      <li key={p.id}>
                        <Link href={`/products/${p.slug}`} onClick={onClose} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden border border-line/70 bg-cream/40">
                            <Img src={p.image} alt={p.name} fill sizes="(min-width:700px) 20vw, 45vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                            {p.discountPct > 0 && (
                              <span className="ribbon absolute top-2.5 left-2.5">Save {p.discountPct}%</span>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-1 font-serif text-[14px] text-ink group-hover:text-subtle transition-colors">{p.name}</p>
                          <p className="mt-1 text-[13px]">
                            <span className="font-semibold text-ink">{formatPrice(p.price)}</span>
                            {p.compareAt && (
                              <span className="ml-2 text-subtle/60 line-through text-[12px]">{formatPrice(p.compareAt)}</span>
                            )}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {data.total > data.products.length && (
                    <div className="mt-6">
                      <Link href={`/search?q=${encodeURIComponent(term)}`} onClick={onClose} className="btn-outline px-6 py-2.5 text-[11px] tracking-[0.16em]">
                        View all {data.total} results
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
