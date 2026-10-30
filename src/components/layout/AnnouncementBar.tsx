"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconMail, IconPin } from "@/components/ui/Icons";
import { LiveRatesPill } from "./LiveRatesPill";
import type { MetalRates } from "@/lib/gold-rates";

export function AnnouncementBar({
  messages,
  rates,
}: {
  messages: string[];
  rates?: MetalRates;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = messages.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count, paused]);

  return (
    <div className="border-b border-line/80 bg-cream text-[11px] sm:text-[12px] text-ink font-normal tracking-[0.04em]">
      <div className="page-width relative flex h-[38px] items-center justify-between gap-3">
        {/* Left: Live Gold Rate Pill */}
        <div className="flex shrink-0 items-center">
          {rates ? (
            <LiveRatesPill rates={rates} />
          ) : (
            <div className="hidden sm:block text-[11px] text-subtle tracking-[0.16em] uppercase">
              Arihant Jewellers
            </div>
          )}
        </div>

        {/* Center: Rotating Announcement Messages with smooth cross-fade */}
        {count > 0 && (
          <div
            className="mx-auto flex max-w-[480px] items-center justify-center gap-2 px-2 md:absolute md:left-1/2 md:-translate-x-1/2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {count > 1 && (
              <button
                type="button"
                aria-label="Previous announcement"
                className="p-1 text-subtle/80 hover:text-ink transition-colors"
                onClick={() => setI((n) => (n - 1 + count) % count)}
              >
                <IconChevronLeft size={13} />
              </button>
            )}
            <div className="relative min-w-0 overflow-hidden text-center">
              <p
                key={i}
                className="animate-fade-in truncate text-[11px] sm:text-[12px] text-center font-medium tracking-[0.03em] text-ink"
                aria-live="polite"
              >
                {messages[i]}
              </p>
            </div>
            {count > 1 && (
              <button
                type="button"
                aria-label="Next announcement"
                className="p-1 text-subtle/80 hover:text-ink transition-colors"
                onClick={() => setI((n) => (n + 1) % count)}
              >
                <IconChevronRight size={13} />
              </button>
            )}
          </div>
        )}

        {/* Right: Quick Links */}
        <div className="ml-auto hidden items-center gap-5 text-[11px] tracking-[0.1em] uppercase text-subtle md:flex">
          <Link href="/pages/store" className="flex items-center gap-1.5 transition-colors hover:text-ink">
            <IconPin size={13} /> Store Locator
          </Link>
          <Link href="/pages/contact" className="flex items-center gap-1.5 transition-colors hover:text-ink">
            <IconMail size={13} /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
