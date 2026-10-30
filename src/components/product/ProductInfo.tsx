"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { IconFacebook, IconLink, IconMail, IconWhatsApp, IconX, trustIcon } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WishlistButton } from "./WishlistButton";
import { useRecent } from "@/store/recent";
import { enquire } from "@/store/site";
import type { TrustItem } from "@/lib/settings";
import type { MetalPriceBreakup } from "@/lib/gold-rates";
import { GoldRateBreakup } from "./GoldRateBreakup";
import { EnquiryForm } from "./EnquiryForm";

type V = { id: string; title: string; stock: number; price: number; compareAt: number | null; discountPct: number; sku: string | null };

type Props = {
  product: { id: string; slug: string; name: string; sku: string; image: string | null; isRing?: boolean };
  variants: V[];
  trustBadges: TrustItem[];
  shareUrl: string;
  metalBreakup?: MetalPriceBreakup | null;
};

export function ProductInfo({ product, variants, trustBadges, shareUrl, metalBreakup }: Props) {
  const pushRecent = useRecent((s) => s.push);
  const hasSizes = variants.length > 1;
  const [variantId, setVariantId] = useState<string | null>(hasSizes ? null : (variants[0]?.id ?? null));
  const [showForm, setShowForm] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => pushRecent(product.id), [product.id, pushRecent]);

  useEffect(() => {
    if (window.location.hash === "#enquire") setShowForm(true);
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selected = variants.find((x) => x.id === variantId);
  const v = selected ?? variants[0];
  const sizeNote = hasSizes && selected ? `size ${selected.title.replace(/^Size /, "")}` : "";
  const ask = () => enquire(product, sizeNote);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-[clamp(26px,3vw,38px)] font-normal text-ink leading-tight tracking-[0.02em]">{product.name}</h1>
        <WishlistButton
          item={{ productId: product.id, slug: product.slug, name: product.name, image: product.image, price: v?.price ?? 0 }}
          className="mt-1 h-9 w-9 shrink-0 text-ink"
          size={22}
        />
      </div>
      <p className="mt-2 text-[11px] font-medium tracking-[0.2em] text-subtle uppercase">SKU: {selected?.sku || product.sku}</p>

      {v && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-ink">
            <span className="sr-only">Sale price</span>
            {formatPrice(v.price)}
          </p>
          {v.compareAt && (
            <p className="text-[15px] sm:text-[16px] text-subtle/60 line-through font-normal">
              <span className="sr-only">Regular price</span>
              {formatPrice(v.compareAt)}
            </p>
          )}
          {v.discountPct > 0 && <span className="ribbon-lg">{v.discountPct} % OFF</span>}
        </div>
      )}
      {v && v.price > 0 && <p className="mt-2 text-[12px] text-subtle tracking-wide">Inclusive of all taxes.</p>}

      {metalBreakup && <GoldRateBreakup breakup={metalBreakup} />}

      {trustBadges.length > 0 && (
        <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line/70 py-6">
          {trustBadges.slice(0, 4).map((t) => (
            <li key={t.label} className="flex items-center gap-3 text-[12px] sm:text-[13px] text-ink font-medium tracking-[0.02em]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-cream/40 text-ink">{trustIcon(t.icon, 20)}</span>
              {t.label}
            </li>
          ))}
        </ul>
      )}

      {hasSizes && (
        <fieldset id="size-picker" className="mt-8">
          <legend className="mb-3 flex w-full items-center justify-between text-[11px] font-medium tracking-[0.18em] uppercase text-subtle">
            <span>
              Size{selected ? `: ${selected.title.replace(/^Size /, "")}` : ""}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={variantId === x.id}
                onClick={() => {
                  setVariantId(x.id);
                }}
                className={cn(
                  "h-10 min-w-[48px] border px-3 text-[13px] font-medium transition-colors",
                  variantId === x.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                )}
              >
                {x.title.replace(/^Size /, "")}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div ref={ctaRef} id="enquire" className="mt-8 max-w-[440px] scroll-mt-32 space-y-3.5">
        <button type="button" className="btn flex h-[48px] w-full items-center justify-center gap-2" onClick={ask}>
          <IconWhatsApp size={19} /> Enquire on WhatsApp
        </button>
        <button type="button" className="btn-outline flex h-[48px] w-full items-center justify-center gap-2" onClick={() => setShowForm((x) => !x)} aria-expanded={showForm}>
          <IconMail size={18} /> {showForm ? "Hide enquiry form" : "Send an enquiry"}
        </button>
        <p className="text-[12px] leading-relaxed text-subtle">
          Ask about price, availability, sizing or customisation — we usually reply within a few hours. Or{" "}
          <Link href={`/pages/book-appointment?product=${encodeURIComponent(product.name)}`} className="text-ink underline underline-offset-2">
            book a showroom visit or video call
          </Link>
          {product.isRing && (
            <>
              {" "}· <Link href="/pages/ring-size-guide" className="text-ink underline underline-offset-2">find your ring size</Link>
            </>
          )}
          .
        </p>
        {showForm && (
          <div className="animate-fade-in border border-line p-5">
            <EnquiryForm product={`${product.name} (${selected?.sku || product.sku})${sizeNote ? `, ${sizeNote}` : ""}`} />
          </div>
        )}
      </div>

      <div className="mt-7 flex items-center gap-4 text-subtle">
        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-subtle">Share</span>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${product.name} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="text-subtle hover:text-ink transition-colors">
          <IconWhatsApp size={20} />
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-subtle hover:text-ink transition-colors">
          <IconFacebook size={20} />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="text-subtle hover:text-ink transition-colors">
          <IconX size={18} />
        </a>
        <CopyLink url={shareUrl} />
      </div>

      {/* Sticky enquiry bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-md transition-transform duration-300 shadow-lg",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        inert={!showSticky}
      >
        <div className="page-width flex items-center justify-end gap-x-6 py-3">
          <p className="mr-auto hidden min-w-0 truncate font-serif text-[16px] text-ink md:block">
            {product.name} — <span className="font-sans font-semibold">{v ? formatPrice(v.price) : ""}</span>
          </p>
          <button type="button" className="btn flex h-[44px] flex-1 items-center justify-center gap-2 sm:w-[300px] sm:flex-none" onClick={ask}>
            <IconWhatsApp size={18} /> Enquire on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy link"
      className="flex items-center gap-1 text-[13px] hover:text-muted"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* ignore */
        }
      }}
    >
      <IconLink size={22} />
      {copied && <span>Copied</span>}
    </button>
  );
}

