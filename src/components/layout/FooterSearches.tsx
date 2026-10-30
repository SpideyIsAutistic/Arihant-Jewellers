"use client";

import Link from "next/link";
import { useState } from "react";
import { IconChevronDown } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function FooterSearches({ terms }: { terms: string[] }) {
  const [open, setOpen] = useState(false);
  if (!terms.length) return null;
  return (
    <div className="pt-6">
      <button type="button" className="flex items-center gap-2 text-[15px] tracking-[0.04em] uppercase" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Popular searches:
        <IconChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="mt-3 flex animate-fade-in flex-wrap gap-x-2 gap-y-1 text-[14px] text-body2">
          {terms.map((t, i) => (
            <li key={t}>
              <Link href={`/search?q=${encodeURIComponent(t)}`} className="hover:underline">
                {t}
              </Link>
              {i < terms.length - 1 && <span className="ml-2 text-sand">|</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
