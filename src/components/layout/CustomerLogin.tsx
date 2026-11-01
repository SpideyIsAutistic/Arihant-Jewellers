"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Drawer } from "@/components/ui/Drawer";
import { IconUser } from "@/components/ui/Icons";
import { useCustomer } from "@/store/customer";

/** Visitor sign-in: Google, or a one-tap link emailed to them (Firebase free plan, no password).
 *  Opens once on a first visit; "Maybe later" dismisses it. The header icon reopens it. */
const DISMISSED = "aj-login-dismissed";
const EMAIL = "aj-login-email";
const OPEN = "aj:login";

const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {}
  },
};

export function CustomerLogin() {
  const user = useCustomer((s) => s.user);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choose" | "sent" | "confirm">("choose");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const a = auth();
    const show = () => {
      setStep("choose");
      setError("");
      setOpen(true);
    };
    window.addEventListener(OPEN, show);
    let first = true;
    const off = onAuthStateChanged(a, (u) => {
      if (!first) return;
      first = false;
      if (isSignInWithEmailLink(a, window.location.href)) {
        const saved = store.get(EMAIL);
        if (saved) void finishLink(saved);
        else {
          setStep("confirm"); // link opened on another device: ask which email it was sent to
          setOpen(true);
        }
      }
    });
    return () => {
      off();
      window.removeEventListener(OPEN, show);
    };
  }, []);

  const fail = (e: unknown) => {
    console.error("Customer sign-in error:", e);
    const code = (e as { code?: string }).code ?? "";
    const msg = (e as { message?: string }).message ?? "";
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return setError("");
    }
    if (code === "auth/unauthorized-domain") {
      return setError(
        `Domain not authorized in Firebase: "${window.location.hostname}". Please add this domain to Firebase Console → Authentication → Settings → Authorized domains.`,
      );
    }
    setError(
      code === "auth/invalid-email"
        ? "Please enter a valid email address."
        : code === "auth/invalid-action-code" ||
            code === "auth/expired-action-code"
          ? "This sign-in link has expired or was already used. Please request a new one."
          : msg || "Sign-in didn't work. Please try again.",
    );
  };

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  const google = () =>
    run(async () => {
      await signInWithPopup(auth(), googleProvider());
      setOpen(false);
    });

  const sendLink = () =>
    run(async () => {
      const clean = email.trim().toLowerCase();
      await sendSignInLinkToEmail(auth(), clean, {
        url: window.location.href.split("?")[0],
        handleCodeInApp: true,
      });
      store.set(EMAIL, clean);
      setStep("sent");
    });

  function finishLink(addr: string) {
    return run(async () => {
      await signInWithEmailLink(
        auth(),
        addr.trim().toLowerCase(),
        window.location.href,
      );
      store.set(EMAIL, null);
      window.history.replaceState(null, "", window.location.pathname); // drop the one-time code from the URL
      setStep("choose");
      setOpen(false);
    });
  }

  const close = () => {
    if (!user) store.set(DISMISSED, "1");
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Sign in"
      titleIcon={<IconUser size={20} />}
    >
      <div className="space-y-5 p-6">
        {user ? (
          <>
            <p className="text-[15px]">
              Signed in as <b>{user.email ?? user.displayName}</b>
            </p>
            <Link href="/account" className="btn h-[46px] w-full" onClick={() => setOpen(false)}>
              My enquiries
            </Link>
            <button
              type="button"
              className="btn-outline h-[46px] w-full"
              onClick={() => run(() => signOut(auth()))}
              disabled={busy}
            >
              Sign out
            </button>
          </>
        ) : step === "sent" ? (
          <>
            <p className="text-[15px]">
              We&apos;ve emailed a sign-in link to <b>{email.trim()}</b>. Open
              it on this device to finish signing in.
            </p>
            <p className="text-[13px] text-subtle">
              Can&apos;t see it? Check your spam folder.
            </p>
            <button
              type="button"
              className="text-[14px] underline"
              onClick={() => setStep("choose")}
            >
              Use a different email
            </button>
          </>
        ) : (
          <>
            <p className="text-[15px] text-body2">
              {step === "confirm"
                ? "Confirm the email address this sign-in link was sent to."
                : "Sign in to enquire about any piece and keep your wishlist on every device. Browsing is open to everyone."}
            </p>
            {step === "choose" && (
              <>
                <button
                  type="button"
                  className="btn h-[48px] w-full"
                  onClick={google}
                  disabled={busy}
                >
                  Continue with Google
                </button>
                <p className="text-center text-[12px] tracking-[0.14em] text-subtle uppercase">
                  or with your email
                </p>
              </>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void (step === "confirm" ? finishLink(email) : sendLink());
              }}
              className="space-y-3"
            >
              <label htmlFor="login-email" className="sr-only">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input py-3"
              />
              <button
                type="submit"
                className="btn-outline h-[46px] w-full"
                disabled={busy || !email.trim()}
              >
                {busy
                  ? "Please wait…"
                  : step === "confirm"
                    ? "Sign in"
                    : "Email me a sign-in link"}
              </button>
            </form>
          </>
        )}
        {error && (
          <p role="alert" className="text-[14px] text-danger">
            {error}
          </p>
        )}
        {!user && step === "choose" && (
          <button
            type="button"
            className="w-full text-center text-[14px] text-subtle underline"
            onClick={close}
          >
            Maybe later
          </button>
        )}
      </div>
    </Drawer>
  );
}
