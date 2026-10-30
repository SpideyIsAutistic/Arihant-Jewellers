"use client";

import { useState } from "react";
import { requestNotify, type FormState } from "@/lib/actions/store";
import { requireLogin } from "@/store/customer";

/** One tap for signed-in visitors; lands in Admin → Enquiries as "Notify when available". */
export function NotifyMe({ product }: { product: string }) {
  const [state, setState] = useState<FormState>(null);
  const [busy, setBusy] = useState(false);
  if (state?.ok) return <p role="status" className="text-[14px] text-success">{state.message}</p>;
  return (
    <div>
      <button
        type="button"
        className="btn h-[48px] w-full"
        disabled={busy}
        onClick={async () => {
          if (!requireLogin()) return;
          setBusy(true);
          setState(await requestNotify(product));
          setBusy(false);
        }}
      >
        {busy ? "Saving…" : "Notify me when it's back"}
      </button>
      {state && !state.ok && <p className="mt-2 text-[13px] text-danger">{state.message}</p>}
    </div>
  );
}
