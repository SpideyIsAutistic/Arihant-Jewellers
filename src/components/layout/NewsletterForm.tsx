"use client";

import { BotFields } from "@/components/ui/BotFields";
import { useActionState } from "react";
import { subscribeNewsletter } from "@/lib/actions/store";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, null);
  return (
    <form action={action} className="mt-5 space-y-2.5">
      <BotFields />
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <div className="flex border border-line bg-white transition-colors focus-within:border-ink">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="w-full bg-transparent px-3.5 py-2.5 text-[13px] text-ink placeholder:text-subtle/50 focus:outline-none"
          autoComplete="email"
        />
        <button
          type="submit"
          className="bg-ink px-5 py-2.5 text-[11px] font-medium tracking-[0.18em] text-white uppercase transition-colors hover:bg-black/80 disabled:opacity-40"
          disabled={pending}
        >
          {pending ? "…" : "Join"}
        </button>
      </div>
      {state && (
        <p role="status" className={state.ok ? "text-[12px] text-success" : "text-[12px] text-danger"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
