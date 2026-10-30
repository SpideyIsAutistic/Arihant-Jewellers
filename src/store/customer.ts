"use client";

import { create } from "zustand";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

/** Signed-in visitor. undefined = Firebase is still restoring the session. */
export const useCustomer = create<{ user: User | null | undefined }>(() => ({ user: undefined }));

// Start restoring the session as soon as the site loads, not when the sign-in panel loads.
if (typeof window !== "undefined") onAuthStateChanged(auth(), (user) => useCustomer.setState({ user }));

export const openLogin = () => window.dispatchEvent(new Event("aj:login"));

/** Enquiries need a signed-in visitor: true if signed in; otherwise opens the sign-in panel and returns false. */
export function requireLogin() {
  const { user } = useCustomer.getState();
  if (user) return true;
  if (user === null) openLogin();
  else {
    // still restoring: only ask once we know they're signed out
    const off = useCustomer.subscribe(({ user: u }) => {
      if (u === undefined) return;
      off();
      if (!u) openLogin();
    });
  }
  return false;
}
