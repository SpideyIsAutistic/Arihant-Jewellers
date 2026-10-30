"use client";

import Link from "next/link";
import { useState } from "react";
import { MAIN_NAV } from "@/config/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { IconChevronDown, IconHeart, IconMail, IconPin } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu" width="max-w-[340px]">
      <nav aria-label="Mobile">
        <ul className="divide-y divide-line/70 border-b border-line/70">
          {MAIN_NAV.map((item) => (
            <li key={item.label}>
              {item.links ? (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-[12px] sm:text-[13px] font-medium tracking-[0.16em] uppercase text-ink"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                  >
                    {item.label}
                    <IconChevronDown size={16} className={cn("text-subtle transition-transform duration-300", expanded === item.label && "rotate-180")} />
                  </button>
                  {expanded === item.label && (
                    <ul className="animate-fade-in space-y-3 bg-cream/50 px-6 py-4 border-t border-line/60">
                      {item.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} onClick={onClose} className="block font-serif text-[15px] text-ink hover:text-subtle transition-colors">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={onClose} className="block px-6 py-4 text-[12px] sm:text-[13px] font-medium tracking-[0.16em] uppercase text-ink">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <ul className="space-y-4 px-6 py-6 text-[12px] font-medium tracking-[0.12em] uppercase text-subtle">
          <li>
            <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 hover:text-ink transition-colors">
              <IconHeart size={18} /> Wishlist
            </Link>
          </li>
          <li>
            <Link href="/pages/contact" onClick={onClose} className="flex items-center gap-3 hover:text-ink transition-colors">
              <IconMail size={18} /> Contact &amp; enquiries
            </Link>
          </li>
          <li>
            <Link href="/pages/store" onClick={onClose} className="flex items-center gap-3 hover:text-ink transition-colors">
              <IconPin size={18} /> Store locator
            </Link>
          </li>
        </ul>
      </nav>
    </Drawer>
  );
}
