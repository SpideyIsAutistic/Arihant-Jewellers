"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconClose } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
  width?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  labelledBy?: string;
};

/** Accessible luxury slide-in drawer (focus moves in, Esc closes, body scroll locked). */
export function Drawer({ open, onClose, side = "right", title, titleIcon, width = "max-w-[460px]", children, footer }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-xs" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Panel"}
        tabIndex={-1}
        className={cn(
          "absolute top-0 flex h-full w-[88vw] flex-col border-line bg-white shadow-2xl outline-none",
          width,
          side === "right" ? "right-0 border-l animate-slide-in-right" : "left-0 border-r animate-slide-in-left",
        )}
      >
        {title !== undefined && (
          <div className="flex items-center justify-between border-b border-line/80 bg-cream/30 px-6 py-4.5">
            <h2 className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.16em] uppercase text-ink">
              {titleIcon}
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1.5 p-1.5 text-subtle hover:text-ink transition-colors"
            >
              <IconClose size={20} />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line/80">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
