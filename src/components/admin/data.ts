"use client";

import { useSearchParams } from "next/navigation";
import { loadSite } from "@/lib/data";
import { useLoad } from "@/lib/use-load";

/** Fresh copy of the whole site (incl. hidden items) for admin screens. */
export const useSiteAdmin = () => useLoad(() => loadSite(true));
export const useParam = (k: string) => useSearchParams().get(k) ?? "";
