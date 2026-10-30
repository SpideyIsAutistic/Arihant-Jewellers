"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { DEFAULT_METAL_RATES } from "@/lib/gold-rates";
import { getMetalRates } from "@/lib/gold-rates";
import { Card, Check, Field, PageHeader } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/client";
import { saveGoldRatesAction, syncLiveBullionRatesAction } from "@/lib/actions/admin";

export default function GoldRatesAdminPage() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const rates = { ...DEFAULT_METAL_RATES, ...(site.metalRates ?? {}) };
  const goldProducts = site.products.filter((p) => p.metal === "Gold");

  const activeGoldCount = goldProducts.filter((p) => p.isActive).length;

  const formattedDate = !rates.lastUpdated ? "never (the site hides rates until you save them)" : new Date(rates.lastUpdated).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <PageHeader
        title="Live Bullion & Gold Rates"
        action={
          <ActionForm action={syncLiveBullionRatesAction}>
            <SubmitButton className="btn-outline px-4 py-2 text-[13px]">
              ↻ Sync Bullion Market Rate
            </SubmitButton>
          </ActionForm>
        }
      />

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-subtle">24K Pure Gold</span>
            <span className="text-[10px] rounded bg-cream px-1.5 py-0.5 font-medium text-ink">99.9%</span>
          </div>
          <p className="mt-2 text-[24px] font-bold text-ink">₹{rates.gold24k.toLocaleString("en-IN")}<span className="text-[13px] font-normal text-subtle">/g</span></p>
          <p className="text-[12px] text-body2">₹{(rates.gold24k * 10).toLocaleString("en-IN")} / 10 grams</p>
        </div>

        <div className="border-2 border-ink bg-cream/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-ink">22K Hallmarked Gold</span>
            <span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase">BIS 916</span>
          </div>
          <p className="mt-2 text-[24px] font-bold text-ink">₹{rates.gold22k.toLocaleString("en-IN")}<span className="text-[13px] font-normal text-subtle">/g</span></p>
          <p className="text-[12px] font-medium text-ink">₹{(rates.gold22k * 10).toLocaleString("en-IN")} / 10 grams</p>
        </div>

        <div className="border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-subtle">18K Gold</span>
            <span className="text-[10px] rounded bg-cream px-1.5 py-0.5 font-medium text-ink">75%</span>
          </div>
          <p className="mt-2 text-[24px] font-bold text-ink">₹{rates.gold18k.toLocaleString("en-IN")}<span className="text-[13px] font-normal text-subtle">/g</span></p>
          <p className="text-[12px] text-body2">₹{(rates.gold18k * 10).toLocaleString("en-IN")} / 10 grams</p>
        </div>

        <div className="border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-subtle">Silver (999)</span>
            <span className="text-[10px] rounded bg-cream px-1.5 py-0.5 font-medium text-ink">Fine</span>
          </div>
          <p className="mt-2 text-[24px] font-bold text-ink">₹{rates.silver.toLocaleString("en-IN")}<span className="text-[13px] font-normal text-subtle">/g</span></p>
          <p className="text-[12px] text-body2">₹{(rates.silver * 1000).toLocaleString("en-IN")} / 1 kg</p>
        </div>
      </div>

      <div className="mb-6 border border-line bg-cream/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>
              Status: <strong>{rates.enabled ? "Dynamic Pricing Active" : "Dynamic Pricing Paused"}</strong> • Source:{" "}
              <span className="capitalize">{rates.source || "market"}</span> • Last synced: {formattedDate}
            </span>
          </div>
          <span className="text-body2 font-medium">
            💎 {activeGoldCount} gold products dynamically pricing with these rates
          </span>
        </div>
      </div>

      <ActionForm action={saveGoldRatesAction} className="space-y-6">
        <Card title="Current Live Bullion Rates (₹ / gram)">
          <p className="mb-4 text-[13px] text-subtle">
            These rates are displayed to customers on the site header, live rates modal, and are used to dynamically calculate selling prices.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="24K Gold Rate (₹/g)"
              name="gold24k"
              type="number"
              defaultValue={rates.gold24k}
              required
              hint="Pure gold (99.9% / 999 purity)"
            />
            <Field
              label="22K Gold Rate (₹/g)"
              name="gold22k"
              type="number"
              defaultValue={rates.gold22k}
              required
              hint="Hallmarked jewellery gold (91.6% / 916 purity)"
            />
            <Field
              label="18K Gold Rate (₹/g)"
              name="gold18k"
              type="number"
              defaultValue={rates.gold18k}
              required
              hint="Studded & diamond jewellery gold (75.0% purity)"
            />
            <Field
              label="14K Gold Rate (₹/g)"
              name="gold14k"
              type="number"
              defaultValue={rates.gold14k}
              required
              hint="Modern light gold (58.5% purity)"
            />
            <Field
              label="Silver Rate (₹/g)"
              name="silver"
              type="number"
              defaultValue={rates.silver}
              required
              hint="Fine silver (99.9% purity)"
            />
          </div>
        </Card>

        <Card title="Benchmark Base Rates & Formula Calibration">
          <p className="mb-4 text-[13px] text-subtle">
            The benchmark rate represents the gold rate at which product base prices were originally entered in the catalogue. When current rates fluctuate above or below the benchmark, the product prices scale by: <code className="bg-cream px-1.5 py-0.5 text-[12px]">weightGrams × (currentRate - benchmarkRate) × 1.03 (incl. 3% GST)</code>.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Benchmark 24K Rate (₹/g)"
              name="benchmark24k"
              type="number"
              defaultValue={rates.benchmark24k}
              required
            />
            <Field
              label="Benchmark 22K Rate (₹/g)"
              name="benchmark22k"
              type="number"
              defaultValue={rates.benchmark22k}
              required
            />
            <Field
              label="Benchmark 18K Rate (₹/g)"
              name="benchmark18k"
              type="number"
              defaultValue={rates.benchmark18k}
              required
            />
          </div>
        </Card>

        <Card title="Dynamic Pricing Toggle">
          <div className="space-y-3">
            <Check
              label="Enable Dynamic Gold Price Recalculation"
              name="enabled"
              defaultChecked={rates.enabled}
              hint="When checked, all gold items in the store adjust automatically based on today's live market rate. Untick to freeze prices to catalogue base prices."
            />
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton className="btn px-8">Save & Apply Rates</SubmitButton>
          </div>
        </Card>
      </ActionForm>
    </>
  );
}
