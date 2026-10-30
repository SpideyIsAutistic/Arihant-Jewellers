"use client";

import { useId, useState } from "react";
import { IconChevronDown } from "./Icons";
import { cn } from "@/lib/utils";

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-line/80">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 text-left text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-subtle"
        >
          <span>{title}</span>
          <IconChevronDown
            size={15}
            className={cn(
              "text-subtle transition-transform duration-300 ease-out",
              open ? "rotate-180 text-ink" : "",
            )}
          />
        </button>
      </h3>
      <div
        id={id}
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pt-1 text-[13px] sm:text-[14px] leading-[1.8] text-body2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
