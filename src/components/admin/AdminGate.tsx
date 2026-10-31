"use client";

import { useEffect, useRef, useState } from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { toE164 } from "@/lib/utils";

type State = { status: "loading" } | { status: "out"; error?: string } | { status: "denied"; user: User } | { status: "in"; user: User };

/**
 * Only Google accounts listed in Firestore `admins/<email>` (or the owner in firestore.rules) get in.
 * This is the UI gate — the real protection is firestore.rules, which reject writes from anyone else.
 */
export function AdminGate({ children }: { children: (user: User) => React.ReactNode }) {
  const [s, setS] = useState<State>({ status: "loading" });

  useEffect(() => {
    // Process redirect result if coming back from redirect sign-in
    getRedirectResult(auth()).catch((e) => {
      console.error("Redirect sign-in error:", e);
      const code = e?.code || "";
      if (code === "auth/unauthorized-domain") {
        setS({
          status: "out",
          error: `Domain not authorized in Firebase: "${window.location.hostname}". Please add this domain to Firebase Console → Authentication → Settings → Authorized domains.`,
        });
      } else if (code && code !== "auth/popup-closed-by-user") {
        setS({ status: "out", error: e?.message || "Sign-in failed. Please try again." });
      }
    });

    return onAuthStateChanged(auth(), async (user) => {
      if (!user) return setS({ status: "out" });
      try {
        // Listing admins/ is allowed only for admins (firestore.rules), so this mirrors the real check.
        await getDocs(query(collection(db(), "admins"), limit(1)));
        setS({ status: "in", user });
      } catch {
        setS({ status: "denied", user });
      }
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth(), googleProvider());
    } catch (e: any) {
      console.error("Google sign-in error:", e);
      const code = e?.code || "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return;
      }
      if (code === "auth/unauthorized-domain") {
        setS({
          status: "out",
          error: `Domain not authorized in Firebase: "${window.location.hostname}". Please add "${window.location.hostname}" to Firebase Console → Authentication → Settings → Authorized domains.`,
        });
      } else if (code === "auth/popup-blocked") {
        // Automatically try redirect if popup is blocked
        try {
          await signInWithRedirect(auth(), googleProvider());
        } catch (err: any) {
          setS({ status: "out", error: `Popup was blocked and redirect failed: ${err?.message || err?.code}` });
        }
      } else {
        setS({ status: "out", error: e?.message || "Sign-in failed. Please try again." });
      }
    }
  };

  if (s.status === "in") return <>{children(s.user)}</>;

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-[420px] bg-white p-8 text-center shadow-sm">
        <div className="mb-2 font-serif text-[28px] tracking-[0.14em]">ARIHANT</div>
        <h1 className="mb-8 text-[13px] tracking-[0.2em] text-subtle uppercase">Store admin</h1>
        {s.status === "loading" && <p className="text-[14px] text-subtle">Checking your sign-in…</p>}
        {s.status === "out" && (
          <>
            <button
              type="button"
              className="btn flex w-full items-center justify-center gap-3"
              onClick={handleGoogleSignIn}
            >
              <GoogleMark /> Sign in with Google
            </button>
            {s.error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-left rounded text-[13px] text-danger leading-relaxed">
                {s.error}
              </div>
            )}
            <PhoneSignIn />
            <p className="mt-5 text-[12px] text-subtle">Only approved Google accounts and phone numbers can access the admin panel.</p>
          </>
        )}
        {s.status === "denied" && (
          <>
            <p className="text-[14px] text-body2">
              <b>{s.user.email ?? s.user.phoneNumber}</b> doesn&apos;t have admin access.
            </p>
            <p className="mt-2 text-[13px] text-subtle">Ask an existing admin to add this account under Admin → Admin access.</p>
            <button type="button" className="btn-outline mt-6 w-full" onClick={() => signOut(auth())}>
              Use a different account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const PHONE_ERRORS: Record<string, string> = {
  "auth/invalid-phone-number": "That doesn't look like a valid mobile number.",
  "auth/invalid-verification-code": "That code isn't right. Check the SMS and try again.",
  "auth/code-expired": "That code has expired. Send a new one.",
  "auth/too-many-requests": "Too many attempts. Please wait a while and try again.",
  "auth/operation-not-allowed": "Phone sign-in isn't enabled in Firebase Console → Authentication → Sign-in method.",
  "auth/billing-not-enabled": "Phone sign-in needs the Firebase Blaze plan, which isn't on yet. Use Google for now.",
  "auth/unauthorized-domain": "This domain is not authorized in Firebase. Add it in Firebase Console → Authentication → Settings → Authorized domains.",
  "auth/captcha-check-failed": "reCAPTCHA verification failed. Please try again.",
  "auth/quota-exceeded": "SMS quota exceeded for today. Please try again tomorrow or use Google.",
};

/** Mobile number + SMS code (Firebase phone auth, with an invisible reCAPTCHA against abuse). */
function PhoneSignIn() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState<ConfirmationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const verifier = useRef<RecaptchaVerifier | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      console.error("Phone sign-in error:", e);
      const c = (e as { code?: string; message?: string }).code ?? "";
      const msg = (e as { message?: string }).message ?? "";
      if (c === "auth/unauthorized-domain") {
        setError(
          `Domain not authorized in Firebase: "${window.location.hostname}". Please add this domain to Firebase Console → Authentication → Settings → Authorized domains.`,
        );
      } else {
        setError(PHONE_ERRORS[c] ?? (msg ? `${msg} (${c})` : "Couldn't sign in with that number. Please try again."));
      }
      if (c !== "auth/invalid-verification-code") {
        verifier.current?.clear(); // a used or failed reCAPTCHA can't be reused
        verifier.current = null;
      }
    } finally {
      setBusy(false);
    }
  };

  if (!open)
    return (
      <button type="button" className="btn-outline mt-3 w-full" onClick={() => setOpen(true)}>
        Sign in with phone number
      </button>
    );
  return (
    <form
      className="mt-4 space-y-3 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        if (sent) return void run(async () => void (await sent.confirm(code.trim())));
        const number = toE164(phone);
        if (!number) return setError("Enter a 10-digit mobile number, or include the country code (+…).");
        void run(async () => {
          verifier.current ??= new RecaptchaVerifier(auth(), "phone-recaptcha", { size: "invisible" });
          setSent(await signInWithPhoneNumber(auth(), number, verifier.current));
        });
      }}
    >
      {!sent ? (
        <>
          <label htmlFor="admin-phone" className="label">Mobile number</label>
          <input id="admin-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" className="input py-3" required />
        </>
      ) : (
        <>
          <label htmlFor="admin-code" className="label">6-digit code sent to {toE164(phone)}</label>
          <input id="admin-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="input py-3 tracking-[0.4em]" required />
        </>
      )}
      <button type="submit" className="btn w-full" disabled={busy}>
        {busy ? "Please wait…" : sent ? "Verify and sign in" : "Send code"}
      </button>
      {sent && (
        <button type="button" className="w-full text-[13px] text-subtle underline" onClick={() => (setSent(null), setCode(""))}>
          Use a different number
        </button>
      )}
      {error && <p className="text-[14px] text-danger">{error}</p>}
      <div id="phone-recaptcha" />
    </form>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
