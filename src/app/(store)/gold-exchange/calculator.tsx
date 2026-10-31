"use client";

import { useState } from "react";
import { getMetalRates, ratesAgeHours, type MetalRates } from "@/lib/gold-rates";
import { useLoad } from "@/lib/use-load";
import { EnquiryForm } from "@/components/product/EnquiryForm";

const KARATS = [
  ["22k", "22K (916)", "gold22k"],
  ["24k", "24K (999)", "gold24k"],
  ["18k", "18K (750)", "gold18k"],
  ["14k", "14K (585)", "gold14k"],
] as const;

/** Estimate = weight × today's saved rate for that karat. The showroom tests purity and confirms the final value. */
export function ExchangeCalculator() {
  const { data: rates } = useLoad(() => getMetalRates());
  const [grams, setGrams] = useState("");
  const [karat, setKarat] = useState<(typeof KARATS)[number][0]>("22k");
  const g = parseFloat(grams);
  const key = KARATS.find((k) => k[0] === karat)![2];
  const usable = rates && rates.lastUpdated && ratesAgeHours(rates) <= 48;
  const value = usable && g > 0 ? Math.round(g * (rates as MetalRates)[key]) : null;
  const summary = g > 0 ? `${g} g of ${KARATS.find((k) => k[0] === karat)![1]} gold` : "";
  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-4 border border-line p-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="x-grams">Weight (grams)</label>
          <input id="x-grams" type="number" min="0" step="0.01" inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} className="input py-3" placeholder="e.g. 12.5" />
        </div>
        <div>
          <label className="label" htmlFor="x-karat">Purity</label>
          <select id="x-karat" value={karat} onChange={(e) => setKarat(e.target.value as typeof karat)} className="input py-3">
            {KARATS.map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2" aria-live="polite">
          {value ? (
            <p className="text-[15px]">
              Estimated value at today&apos;s rate: <b className="text-[22px] text-ink">₹{value.toLocaleString("en-IN")}</b>
            </p>
          ) : rates && !usable ? (
            <p className="text-[14px] text-body2">Today&apos;s rate hasn&apos;t been posted yet, so we can&apos;t estimate right now. Send the details below and we&apos;ll reply with a value.</p>
          ) : (
            <p className="text-[14px] text-subtle">Enter the weight to see an estimate.</p>
          )}
          <p className="mt-2 text-[12px] text-subtle">
            An estimate only. The final value depends on purity testing at the showroom and any deductions, which our team explains before you decide.
          </p>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-[20px] text-ink">Get a firm quote</h2>
        <EnquiryForm
          key={summary}
          kind="exchange"
          product={summary ? `Old gold exchange: ${summary}` : "Old gold exchange"}
          message={summary ? `I'd like to exchange ${summary}${value ? ` (your estimate: ₹${value.toLocaleString("en-IN")})` : ""}. Please tell me the value and what I can buy with it.` : "I'd like to exchange some old gold. Please tell me how it works."}
          submitLabel="Request a quote"
          signInText="Please sign in to request a quote for your old gold."
        />
      </div>
    </div>
  );
}
