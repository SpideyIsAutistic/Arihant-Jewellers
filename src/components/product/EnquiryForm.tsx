"use client";

import { BotFields } from "@/components/ui/BotFields";
import { SignInPrompt } from "@/components/ui/SignInPrompt";
import { useCustomer } from "@/store/customer";
import { useActionState } from "react";
import { sendContactMessage } from "@/lib/actions/store";
import { cn } from "@/lib/utils";

/** Product enquiry → Web3Forms (arrives in the store's inbox with the product name and link). */
export function EnquiryForm({ product }: { product: string }) {
  const [state, action, pending] = useActionState(sendContactMessage, null);
  const user = useCustomer((s) => s.user);
  if (state?.ok)
    return (
      <p role="status" className="text-[14px] text-success">
        {state.message}
      </p>
    );
  if (!user)
    return (
      <SignInPrompt text="Please sign in to send an enquiry about this piece." />
    );
  const e = state?.errors ?? {};
  return (
    <form action={action} className="space-y-3" noValidate>
      <input type="hidden" name="product" value={product} />
      <BotFields />
      <p className="text-[12px] tracking-[0.1em] text-subtle uppercase">
        Enquiring about: {product}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="e-name" className="sr-only">
            Name
          </label>
          <input
            id="e-name"
            name="name"
            defaultValue={user.displayName ?? ""}
            placeholder="Name"
            required
            className={cn("input py-2.5", e.name && "border-danger")}
          />
          {e.name && <p className="mt-1 text-[12px] text-danger">{e.name}</p>}
        </div>
        <div>
          <label htmlFor="e-phone" className="sr-only">
            Phone
          </label>
          <input
            id="e-phone"
            name="phone"
            type="tel"
            placeholder="Phone / WhatsApp"
            className="input py-2.5"
          />
        </div>
      </div>
      <div>
        <label htmlFor="e-email" className="sr-only">
          E-mail
        </label>
        <input
          id="e-email"
          name="email"
          defaultValue={user.email ?? ""}
          type="email"
          placeholder="E-mail"
          required
          className={cn("input py-2.5", e.email && "border-danger")}
        />
        {e.email && <p className="mt-1 text-[12px] text-danger">{e.email}</p>}
      </div>
      <div>
        <label htmlFor="e-message" className="sr-only">
          Message
        </label>
        <textarea
          id="e-message"
          name="message"
          rows={3}
          defaultValue="Hi, I'd like to know the price and availability of this piece."
          className={cn("input py-2.5", e.message && "border-danger")}
        />
        {e.message && (
          <p className="mt-1 text-[12px] text-danger">{e.message}</p>
        )}
      </div>
      {state && !state.ok && (
        <p className="text-[13px] text-danger">{state.message}</p>
      )}
      <button type="submit" className="btn h-[44px] w-full" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
