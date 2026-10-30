"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Img } from "@/components/ui/Img";
import { IconClose } from "@/components/ui/Icons";
import { getQuickView } from "@/lib/actions/store";
import { formatPrice } from "@/lib/format";
import { enquire } from "@/store/site";
import { IconWhatsApp } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useQuickView } from "./quickview-store";

type QV = Awaited<ReturnType<typeof getQuickView>>;

export function QuickView() {
  const { productId, close } = useQuickView();
  const [data, setData] = useState<QV>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setLoading(true);
    setData(null);
    getQuickView(productId).then((d) => {
      if (cancelled) return;
      setData(d);
      setSelected(d?.variants[0]?.id ?? null);
      setLoading(false);
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
    };
  }, [productId, close]);

  if (!productId || typeof document === "undefined") return null;
  const v = data?.variants.find((x) => x.id === selected) ?? data?.variants[0];

  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-end sm:place-items-center p-0 sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-xs" onClick={close} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick view"
        className="relative w-full animate-drop-in overflow-hidden border border-line bg-white shadow-2xl sm:max-w-[780px]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-2 text-ink hover:text-subtle transition-colors"
        >
          <IconClose size={20} />
        </button>
        {loading || !data ? (
          <div className="grid h-[340px] place-items-center text-[13px] tracking-widest uppercase text-subtle">
            {loading ? "Loading…" : "This product is unavailable."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2">
            <div className="relative hidden aspect-[4/5] bg-cream/50 sm:block border-r border-line/60">
              <Img src={data.image} alt={data.name} fill sizes="390px" className="object-cover" />
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <span className="text-[10px] font-medium tracking-[0.2em] text-subtle uppercase mb-1">Arihant Jewellers</span>
              <h2 className="pr-8 font-serif text-[22px] sm:text-[24px] font-normal leading-snug tracking-[0.02em] text-ink">{data.name}</h2>
              {v && (
                <p className="mt-3.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[20px] font-semibold tracking-tight text-ink">{formatPrice(v.price)}</span>
                  {v.compareAt && <span className="text-[14px] text-subtle/60 line-through">{formatPrice(v.compareAt)}</span>}
                  {v.discountPct > 0 && <span className="ribbon">{v.discountPct}% OFF</span>}
                </p>
              )}
              {data.variants.length > 1 && (
                <fieldset className="mt-6">
                  <legend className="label">Size</legend>
                  <div className="flex flex-wrap gap-2">
                    {data.variants.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        onClick={() => setSelected(x.id)}
                        aria-pressed={selected === x.id}
                        className={cn(
                          "min-w-[48px] border px-3 py-1.5 text-[13px] font-medium transition-colors",
                          selected === x.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                        )}
                      >
                        {x.title.replace(/^Size /, "")}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="mt-auto space-y-3.5 pt-8">
                <button
                  type="button"
                  className="btn flex h-[46px] w-full items-center justify-center gap-2"
                  onClick={() => {
                    enquire(data, v && v.title !== "Default" && data.variants.length > 1 ? v.title : "");
                    close();
                  }}
                >
                  <IconWhatsApp size={18} /> Enquire on WhatsApp
                </button>
                <Link
                  href={`/products/${data.slug}`}
                  onClick={close}
                  className="block text-center text-[11px] font-medium tracking-[0.18em] uppercase text-subtle hover:text-ink underline underline-offset-4 transition-colors"
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
