"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Runs an async loader on mount (and again whenever site data changes). `undefined` = still loading. */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data?: T; error?: Error }>({});
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("aj:data", bump);
    return () => window.removeEventListener("aj:data", bump);
  }, []);
  useEffect(() => {
    let live = true;
    fn().then(
      (data) => live && setState({ data }),
      (error) => live && setState({ error }),
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return state;
}

/**
 * Last URL segment. Dynamic pages (/products/<slug>, /collections/<slug>…) are exported once as a
 * "_" placeholder and Firebase Hosting rewrites every slug to it (see firebase.json).
 */
export function useSlug() {
  const p = usePathname() ?? "";
  return decodeURIComponent(p.replace(/\/$/, "").split("/").pop() ?? "");
}

export function useTitle(title: string | null | undefined) {
  useEffect(() => {
    if (title) document.title = `${title} | Arihant Jewellers`;
  }, [title]);
}
