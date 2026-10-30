"use client";

import { useState } from "react";
import type { MetalPriceBreakup } from "@/lib/gold-rates";
import { formatPrice } from "@/lib/format";
import { IconChevronDown } from "@/components/ui/Icons";

export function GoldRateBreakup({ breakup }: { breakup: MetalPriceBreakup }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5 border border-line bg-cream/40 transition-colors hover:border-ink/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-ink uppercase">
              Live Gold Rate Linked Price
            </p>
            <p className="text-[12px] text-subtle">
              Based on {breakup.purity} @ ₹{breakup.ratePerGram.toLocaleString("en-IN")}/g
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink underline underline-offset-4">
            {open ? "Hide" : "Breakup"}
          </span>
          <IconChevronDown
            size={16}
            className={`text-subtle transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="animate-fade-in border-t border-line/70 bg-white p-5 text-[13px]">
          <div className="space-y-2.5">
            <div className="flex justify-between text-body2">
              <span>Gross Metal Weight</span>
              <span className="font-medium text-ink">{breakup.grossWeight} g</span>
            </div>

            <div className="flex justify-between text-body2">
              <span>Today&apos;s {breakup.metalName === "Silver" ? "silver" : "gold"} rate ({breakup.purity})</span>
              <span className="font-medium text-ink">₹{breakup.ratePerGram.toLocaleString("en-IN")} / g</span>
            </div>

            <div className="flex justify-between text-body2">
              <span>{breakup.metalName === "Silver" ? "Silver" : "Gold"} value</span>
              <span className="font-medium text-ink">{formatPrice(breakup.goldValue * 100)}</span>
            </div>

            <div className="flex justify-between text-body2">
              <span>Craftsmanship & Making Charges</span>
              <span className="font-medium text-ink">{formatPrice(breakup.makingCharges * 100)}</span>
            </div>

            {!!breakup.stones && (
              <div className="flex justify-between text-body2">
                <span>Diamonds / stones</span>
                <span className="font-medium text-ink">{formatPrice(breakup.stones * 100)}</span>
              </div>
            )}

            <div className="flex justify-between text-body2">
              <span>Applicable GST (3%)</span>
              <span className="font-medium text-ink">{formatPrice(breakup.gst * 100)}</span>
            </div>

            <div className="mt-3 flex justify-between border-t border-line/80 pt-3 text-[14px] font-semibold text-ink">
              <span>Total Selling Price</span>
              <span>{formatPrice(breakup.totalPrice * 100)}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-line/60 pt-3 text-[11px] leading-relaxed text-subtle">
            {breakup.ratesDate
              ? `Based on Arihant Jewellers' rate saved ${new Date(breakup.ratesDate).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}. Weight is approximate; the final price is confirmed at the showroom.`
              : "Weight is approximate; the final price is confirmed at the showroom."}
          </div>
        </div>
      )}
    </div>
  );
}
