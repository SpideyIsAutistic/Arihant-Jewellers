"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { IconChevronDown, IconFilter } from "@/components/ui/Icons";
import type { FacetOption, Facets, FilterParams } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useUpdateParams } from "./use-update-params";

type Local = {
  category: string[];
  metal: string[];
  finish: string[];
  gender: string[];
  discount: number | null;
  min: number;
  max: number;
};

export function FilterDrawer({ open, onClose, facets, filters }: { open: boolean; onClose: () => void; facets: Facets; filters: FilterParams }) {
  const update = useUpdateParams();
  const init = (): Local => ({
    category: filters.category,
    metal: filters.metal,
    finish: filters.finish,
    gender: filters.gender,
    discount: filters.discount,
    min: filters.min ?? facets.priceRange.min,
    max: filters.max ?? facets.priceRange.max,
  });
  const [s, setS] = useState<Local>(init);

  useEffect(() => {
    if (open) setS(init());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (key: "category" | "metal" | "finish" | "gender", v: string) =>
    setS((cur) => ({ ...cur, [key]: cur[key].includes(v) ? cur[key].filter((x) => x !== v) : [...cur[key], v] }));

  const apply = () => {
    update((p) => {
      (["category", "metal", "finish", "gender"] as const).forEach((k) => (s[k].length ? p.set(k, s[k].join(",")) : p.delete(k)));
      if (s.discount != null) p.set("discount", String(s.discount));
      else p.delete("discount");
      if (s.min > facets.priceRange.min) p.set("min", String(s.min));
      else p.delete("min");
      if (s.max < facets.priceRange.max) p.set("max", String(s.max));
      else p.delete("max");
    });
    onClose();
  };

  const range = facets.priceRange;
  const span = Math.max(1, range.max - range.min);
  const step = span > 50000 ? 500 : span > 5000 ? 50 : 10;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={<span className="font-serif text-[18px] tracking-[0.06em]">Filters</span>}
      titleIcon={<IconFilter size={20} />}
      width="max-w-[360px]"
      footer={
        <div className="flex gap-3 p-4">
          <button
            type="button"
            className="btn-outline flex-1 px-3"
            onClick={() => setS({ category: [], metal: [], finish: [], gender: [], discount: null, min: range.min, max: range.max })}
          >
            Clear
          </button>
          <button type="button" className="btn flex-[2] px-3" onClick={apply}>
            View results
          </button>
        </div>
      }
    >
      <div className="divide-y divide-line px-5">
        <Group title="Product type" options={facets.category} selected={s.category} onToggle={(v) => toggle("category", v)} scroll />
        <Group title="Metal type" options={facets.metal} selected={s.metal} onToggle={(v) => toggle("metal", v)} />
        <Group title="Finish" options={facets.finish} selected={s.finish} onToggle={(v) => toggle("finish", v)} scroll />
        <Group title="Gender" options={facets.gender} selected={s.gender} onToggle={(v) => toggle("gender", v)} />
        {range.max > range.min && (
          <Section title="Price">
            <div className="px-1 pt-9 pb-8">
              <div className="range-dual">
                <div className="absolute top-1/2 h-[2px] w-full -translate-y-1/2 bg-line" />
                <div
                  className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-ink"
                  style={{ left: `${((s.min - range.min) / span) * 100}%`, right: `${100 - ((s.max - range.min) / span) * 100}%` }}
                />
                <input
                  type="range"
                  aria-label="Minimum price"
                  min={range.min}
                  max={range.max}
                  step={step}
                  value={s.min}
                  onChange={(e) => setS((c) => ({ ...c, min: Math.min(Number(e.target.value), c.max - step) }))}
                />
                <input
                  type="range"
                  aria-label="Maximum price"
                  min={range.min}
                  max={range.max}
                  step={step}
                  value={s.max}
                  onChange={(e) => setS((c) => ({ ...c, max: Math.max(Number(e.target.value), c.min + step) }))}
                />
              </div>
              <div className="mt-4 flex justify-between text-[12px]">
                <span className="border border-line px-2 py-1">₹{s.min.toLocaleString("en-IN")}</span>
                <span className="border border-line px-2 py-1">₹{s.max.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </Section>
        )}
        {facets.discount.length > 0 && (
          <Section title="Discounts">
            <ul className="space-y-3 pb-5">
              {facets.discount.map((o) => {
                const val = Number(o.value);
                return (
                  <li key={o.value}>
                    <label className="flex cursor-pointer items-center justify-between gap-3 text-[16px]">
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="discount"
                          className="h-4 w-4 accent-ink"
                          checked={s.discount === val}
                          onChange={() => setS((c) => ({ ...c, discount: val }))}
                          onClick={() => s.discount === val && setS((c) => ({ ...c, discount: null }))}
                        />
                        {o.label}
                      </span>
                      <span className="text-[14px] text-subtle">({o.count})</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}
      </div>
    </Drawer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" className="flex w-full items-center justify-between py-5 font-serif text-[15px] tracking-[0.06em] uppercase" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {title}
        <IconChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && children}
    </div>
  );
}

function Group({ title, options, selected, onToggle, scroll }: { title: string; options: FacetOption[]; selected: string[]; onToggle: (v: string) => void; scroll?: boolean }) {
  if (!options.length) return null;
  return (
    <Section title={title}>
      <ul className={cn("space-y-3 pb-5", scroll && "max-h-[260px] overflow-y-auto pr-1")}>
        {options.map((o) => (
          <li key={o.value}>
            <label className="flex cursor-pointer items-center justify-between gap-3 text-[16px]">
              <span className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 accent-ink" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />
                {o.label}
              </span>
              <span className="text-[14px] text-subtle">({o.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </Section>
  );
}
