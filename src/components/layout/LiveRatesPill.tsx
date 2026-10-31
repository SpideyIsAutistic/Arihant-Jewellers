"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { MetalRates } from "@/lib/gold-rates";

const LiveRatesModal = dynamic(() =>
  import("./LiveRatesModal").then((m) => m.LiveRatesModal)
);

export function LiveRatesPill({ rates }: { rates: MetalRates }) {
  const [open, setOpen] = useState(false);
  if (!rates.lastUpdated) return null; // never show the built-in example rates as today's

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-2.5 py-0.5 text-[11px] sm:text-[12px] font-medium text-ink transition-all hover:border-ink/50 hover:bg-white shadow-xs"
        title="Today's gold & silver rates • Click for all rates and the gold calculator"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="tracking-wide">
          Gold 22K: <strong className="font-semibold">₹{rates.gold22k.toLocaleString("en-IN")}/g</strong>
        </span>
        <span className="hidden text-subtle text-[11px] sm:inline">
          (24K: ₹{rates.gold24k.toLocaleString("en-IN")})
        </span>
        <span className="text-[10px] text-subtle transition-transform group-hover:translate-y-0.5">▾</span>
      </button>

      {open && <LiveRatesModal open={open} onClose={() => setOpen(false)} rates={rates} />}
    </>
  );
}
