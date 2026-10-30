"use client";

import { useEffect, useRef } from "react";

/** Honeypot + "opened at" time for the spam checks in lib/spam.ts. */
export function BotFields() {
  const t = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (t.current) t.current.value = String(Date.now());
  }, []);
  return (
    <>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="t" ref={t} />
    </>
  );
}
