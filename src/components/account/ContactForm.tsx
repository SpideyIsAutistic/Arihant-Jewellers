"use client";

import Link from "next/link";
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
      <div role="status" className="border border-line bg-cream/50 px-6 py-8 text-center text-[15px] text-ink">
        <p className="font-serif text-[18px] font-medium text-ink">Message Received</p>
        <p className="mt-2 text-subtle">{state.message}</p>
      </div>
    );

  if (!user)
    return (
      <SignInPrompt text="Please sign in to send us a message, or chat with us directly on WhatsApp." />
    );

  const e = state?.errors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <BotFields />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-[12px] font-medium tracking-[0.1em] text-subtle uppercase">
            Your Name <span className="text-danger">*</span>
          </label>
          <input
            id="c-name"
            name="name"
            defaultValue={user.displayName ?? ""}
            placeholder="e.g. Priyanshu Sharma"
            required
            aria-required="true"
            aria-invalid={!!e.name}
            className={cn("input py-3", e.name && "border-danger")}
          />
          {e.name && <p className="mt-1 text-[12px] text-danger">{e.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-[12px] font-medium tracking-[0.1em] text-subtle uppercase">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            id="c-email"
            name="email"
            defaultValue={user.email ?? ""}
            type="email"
            placeholder="you@example.com"
            required
            aria-required="true"
            aria-invalid={!!e.email}
            className={cn("input py-3", e.email && "border-danger")}
          />
          {e.email && <p className="mt-1 text-[12px] text-danger">{e.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="c-phone" className="mb-1.5 block text-[12px] font-medium tracking-[0.1em] text-subtle uppercase">
          Phone / WhatsApp <span className="text-subtle font-normal">(Optional)</span>
        </label>
        <input
          id="c-phone"
          name="phone"
          type="tel"
          placeholder="+91 98765 43210"
          className="input py-3"
        />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-[12px] font-medium tracking-[0.1em] text-subtle uppercase">
          Message / Requirement <span className="text-danger">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          placeholder="Tell us about the design, occasion, or piece you're looking for..."
          required
          aria-required="true"
          aria-invalid={!!e.message}
          className={cn("input py-3", e.message && "border-danger")}
        />
        {e.message && (
          <p className="mt-1 text-[12px] text-danger">{e.message}</p>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-subtle">
        Your information is kept secure and used solely to respond to your enquiry in accordance with our{" "}
        <Link href="/policies/privacy-policy" className="underline hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>

      {state && !state.ok && (
        <p role="alert" className="text-[13px] text-danger">{state.message}</p>
      )}

      <button type="submit" className="btn h-[48px] w-full" disabled={pending}>
        {pending ? "Sending Message…" : "Send Message"}
      </button>
    </form>
  );
}
