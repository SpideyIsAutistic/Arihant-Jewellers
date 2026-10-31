"use client";

import { BotFields } from "@/components/ui/BotFields";
import { SignInPrompt } from "@/components/ui/SignInPrompt";
import { useCustomer } from "@/store/customer";
import { useActionState } from "react";
import { sendContactMessage } from "@/lib/actions/store";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, null);
  const user = useCustomer((s) => s.user);
  if (state?.ok)
    return (
      <p role="status" className="bg-cream px-5 py-6 text-center text-[16px]">
        {state.message}
      </p>
    );
  if (!user)
    return (
      <SignInPrompt text="Please sign in to send us a message, or chat with us on WhatsApp." />
    );
  const e = state?.errors ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      <BotFields />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="sr-only">
            Name
          </label>
          <input
            id="c-name"
            name="name"
            defaultValue={user.displayName ?? ""}
            placeholder="Name"
            required
            className={cn("input py-3", e.name && "border-danger")}
          />
          {e.name && <p className="mt-1 text-[13px] text-danger">{e.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="sr-only">
            E-mail
          </label>
          <input
            id="c-email"
            name="email"
            defaultValue={user.email ?? ""}
            type="email"
            placeholder="E-mail"
            required
            className={cn("input py-3", e.email && "border-danger")}
          />
          {e.email && <p className="mt-1 text-[13px] text-danger">{e.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="c-phone" className="sr-only">
          Phone
        </label>
        <input
          id="c-phone"
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          className="input py-3"
        />
      </div>
      <div>
        <label htmlFor="c-message" className="sr-only">
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          placeholder="Message"
          required
          className={cn("input py-3", e.message && "border-danger")}
        />
        {e.message && (
          <p className="mt-1 text-[13px] text-danger">{e.message}</p>
        )}
      </div>
      {state && !state.ok && (
        <p className="text-[14px] text-danger">{state.message}</p>
      )}
      <button type="submit" className="btn h-[50px] w-full" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
