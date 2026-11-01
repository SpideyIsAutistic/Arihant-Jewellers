"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/format";
import type { MetalRates } from "@/lib/gold-rates";

type Props = {
  open: boolean;
  onClose: () => void;
  rates: MetalRates;
};

export function LiveRatesModal({ open, onClose, rates }: Props) {
  const [calcPurity, setCalcPurity] = useState<"24k" | "22k" | "18k" | "14k" | "silver">("22k");
  const [calcGrams, setCalcGrams] = useState<number>(10);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const getRate = (p: typeof calcPurity) => {
    if (p === "24k") return rates.gold24k;
    if (p === "22k") return rates.gold22k;
    if (p === "18k") return rates.gold18k;
    if (p === "14k") return rates.gold14k;
    return rates.silver;
  };

  const currentRate = getRate(calcPurity);
  const calcTotal = Math.round((currentRate * (calcGrams || 0)) * 100);

  const formattedDate = new Date(rates.lastUpdated).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return createPortal(
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-xs" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-rates-title"
        className="relative w-full max-w-[620px] animate-drop-in overflow-hidden border border-line bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-cream px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <div>
              <h2 id="live-rates-title" className="text-[17px] font-medium tracking-[0.06em] text-ink uppercase">
                Today&apos;s Live Bullion Rates
              </h2>
              <p className="text-[12px] text-subtle">
                Updated: {formattedDate} • Live market rates via Google Finance (INR)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 p-1.5 text-subtle hover:text-ink transition-colors"
          >
            <IconClose size={22} />
          </button>
        </div>

        {/* Rates Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* 24K */}
            <div className="border border-line/80 bg-white p-3.5 transition-all hover:border-ink hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">24K Gold</span>
                <span className="text-[10px] uppercase tracking-wider text-subtle">99.9% Purity</span>
              </div>
              <p className="mt-2 text-[20px] font-semibold text-ink">
                ₹{rates.gold24k.toLocaleString("en-IN")}{" "}
                <span className="text-[12px] font-normal text-subtle">/ 1g</span>
              </p>
              <p className="text-[12px] text-body2">
                ₹{(rates.gold24k * 10).toLocaleString("en-IN")} / 10g
              </p>
            </div>

            {/* 22K (Hallmark) */}
            <div className="border-2 border-ink bg-cream/40 p-3.5 transition-all hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">22K Gold ★</span>
                <span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-medium text-white uppercase tracking-wider">
                  BIS 916
                </span>
              </div>
              <p className="mt-2 text-[20px] font-bold text-ink">
                ₹{rates.gold22k.toLocaleString("en-IN")}{" "}
                <span className="text-[12px] font-normal text-subtle">/ 1g</span>
              </p>
              <p className="text-[12px] font-medium text-ink">
                ₹{(rates.gold22k * 10).toLocaleString("en-IN")} / 10g
              </p>
            </div>

            {/* 18K */}
            <div className="border border-line/80 bg-white p-3.5 transition-all hover:border-ink hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">18K Gold</span>
                <span className="text-[10px] uppercase tracking-wider text-subtle">75% Purity</span>
              </div>
              <p className="mt-2 text-[20px] font-semibold text-ink">
                ₹{rates.gold18k.toLocaleString("en-IN")}{" "}
                <span className="text-[12px] font-normal text-subtle">/ 1g</span>
              </p>
              <p className="text-[12px] text-body2">
                ₹{(rates.gold18k * 10).toLocaleString("en-IN")} / 10g
              </p>
            </div>

            {/* 14K */}
            <div className="border border-line/80 bg-white p-3.5 transition-all hover:border-ink hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">14K Gold</span>
                <span className="text-[10px] uppercase tracking-wider text-subtle">58.5% Purity</span>
              </div>
              <p className="mt-2 text-[20px] font-semibold text-ink">
                ₹{rates.gold14k.toLocaleString("en-IN")}{" "}
                <span className="text-[12px] font-normal text-subtle">/ 1g</span>
              </p>
              <p className="text-[12px] text-body2">
                ₹{(rates.gold14k * 10).toLocaleString("en-IN")} / 10g
              </p>
            </div>

            {/* Silver */}
            <div className="border border-line/80 bg-white p-3.5 transition-all hover:border-ink hover:shadow-xs sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">Silver (Fine 999)</span>
                <span className="text-[10px] uppercase tracking-wider text-subtle">Pure Silver</span>
              </div>
              <div className="mt-2 flex items-baseline gap-4">
                <p className="text-[20px] font-semibold text-ink">
                  ₹{rates.silver.toLocaleString("en-IN")}{" "}
                  <span className="text-[12px] font-normal text-subtle">/ 1g</span>
                </p>
                <p className="text-[13px] text-body2">
                  ₹{(rates.silver * 1000).toLocaleString("en-IN")} / 1 kg
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Live Gold Value Calculator */}
          <div className="mt-6 border border-line bg-cream/40 p-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
              Quick Metal Value Estimator
            </h3>
            <p className="mt-0.5 text-[12px] text-subtle">
              Calculate base bullion value for your desired purity and weight.
            </p>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-[140px_1fr_auto]">
              <div>
                <label className="text-[11px] font-medium text-subtle uppercase">Purity</label>
                <select
                  value={calcPurity}
                  onChange={(e) => setCalcPurity(e.target.value as typeof calcPurity)}
                  className="mt-1 block w-full border border-line bg-white px-2.5 py-1.5 text-[14px] text-ink outline-none"
                >
                  <option value="24k">24K (999)</option>
                  <option value="22k">22K (916)</option>
                  <option value="18k">18K (750)</option>
                  <option value="14k">14K (585)</option>
                  <option value="silver">Silver 999</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-subtle uppercase">Weight in Grams</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={calcGrams}
                  onChange={(e) => setCalcGrams(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full border border-line bg-white px-3 py-1.5 text-[14px] text-ink outline-none"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="flex flex-col justify-end">
                <span className="text-[11px] font-medium text-subtle uppercase">Estimated Metal Value</span>
                <span className="text-[18px] font-bold text-ink">
                  {formatPrice(calcTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Transparency Guarantee & BIS HUID Verification */}
          <div className="mt-5 border-t border-line/70 pt-4 space-y-2 text-[12px] text-subtle">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <span className="text-emerald-600">✓</span> 100% BIS Hallmarked Gold (22K916 · 18K750 · 14K585)
              </span>
              <span>Live market rates via Google Finance</span>
            </div>
            <p className="text-[11px] leading-relaxed text-body2">
              Every gold piece carries the mandatory 3 hallmarking symbols including the unique 6-digit alphanumeric <strong>HUID</strong>, verifiable on the Government of India <strong>BIS CARE App</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
