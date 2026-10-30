import { trustIcon } from "@/components/ui/Icons";
import type { TrustItem } from "@/lib/settings";

export function TrustBar({ items }: { items: TrustItem[] }) {
  if (!items.length) return null;
  return (
    <div className="border-y border-line/70 py-10 sm:py-14">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
        {items.map((t) => (
          <li key={t.label} className="flex flex-col items-center gap-3.5 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-line bg-cream/40 text-ink transition-transform duration-300 hover:scale-105">
              {trustIcon(t.icon, 34)}
            </span>
            <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.14em] text-ink uppercase max-w-[150px] leading-snug">
              {t.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
