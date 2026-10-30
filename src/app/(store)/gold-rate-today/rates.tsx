"use client";

import { getMetalRates, ratesAgeHours } from "@/lib/gold-rates";
import { useLoad } from "@/lib/use-load";

const ROWS = [
  ["24K gold (999)", "gold24k"],
  ["22K gold (916)", "gold22k"],
  ["18K gold (750)", "gold18k"],
  ["Silver (999)", "silver"],
] as const;
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Rates load in the browser from the store's saved rates, so the page never shows a number frozen at build time. */
export function LiveRatesTable() {
  const { data: r, error } = useLoad(() => getMetalRates());
  if (error) return <p className="mt-10 text-center text-danger">Couldn&apos;t load today&apos;s rates. Please message us on WhatsApp.</p>;
  if (r && !r.lastUpdated)
    return <p className="mt-10 border border-line bg-cream px-5 py-6 text-center">Today&apos;s rates haven&apos;t been posted yet. Message us on WhatsApp or call the showroom for today&apos;s gold rate.</p>;
  const stale = r && ratesAgeHours(r) > 24;
  return (
    <div className="mt-10">
      <table className="w-full border border-line text-left text-[15px]">
        <thead className="bg-cream text-[12px] tracking-[0.12em] uppercase">
          <tr>
            <th className="px-4 py-3">Metal</th>
            <th className="px-4 py-3 text-right">1 gram</th>
            <th className="px-4 py-3 text-right">10 grams</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, key]) => (
            <tr key={key} className="border-t border-line">
              <th className="px-4 py-3 font-normal">{key === "silver" ? label : <b>{label}</b>}</th>
              <td className="px-4 py-3 text-right">{r ? inr(r[key]) : "…"}</td>
              <td className="px-4 py-3 text-right">{r ? (key === "silver" ? `${inr(r[key] * 1000)} / kg` : inr(r[key] * 10)) : "…"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {stale && <p className="mt-3 text-[14px] text-danger">These rates are more than a day old. Message us on WhatsApp for today&apos;s rate.</p>}
      <p className="mt-3 text-[13px] text-subtle">
        {r
          ? `Last updated ${new Date(r.lastUpdated).toLocaleString("en-IN", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}. Rates exclude making charges and 3% GST; ask us for a firm showroom quote.`
          : "Loading today's rates…"}
      </p>
    </div>
  );
}
