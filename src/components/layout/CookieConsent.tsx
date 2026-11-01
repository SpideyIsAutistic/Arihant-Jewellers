"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const CONSENT_KEY = "aj-cookie-consent";
export const CONSENT_EVENT = "aj:consent";

export function getStoredConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(CONSENT_KEY);
    return val === "granted" || val === "denied" ? val : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(status: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, status);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { status } }));
  } catch {}
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't made a choice yet
    const current = getStoredConsent();
    if (!current) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  const handleChoice = (status: "granted" | "denied") => {
    setStoredConsent(status);
    setVisible(false);
  };

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-[560px] animate-fade-in border border-line bg-white/95 p-5 shadow-xl backdrop-blur-md transition-all sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[480px]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[15px] font-medium tracking-[0.04em] text-ink">
          Privacy &amp; Cookie Preferences
        </h3>
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
          DPDP Act 2023
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-body2">
        We use essential cookies to keep your wishlist and preferences intact. With your consent, we also use privacy-respecting analytics to improve catalogue browsing and bespoke consultation services as detailed in our{" "}
        <Link
          href="/policies/privacy-policy"
          className="text-ink underline underline-offset-2 hover:opacity-80"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => handleChoice("denied")}
          className="btn-outline px-4 py-2 text-[11px] font-medium tracking-[0.14em] uppercase"
        >
          Decline Optional
        </button>
        <button
          type="button"
          onClick={() => handleChoice("granted")}
          className="btn px-5 py-2 text-[11px] font-medium tracking-[0.14em] uppercase"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
}
