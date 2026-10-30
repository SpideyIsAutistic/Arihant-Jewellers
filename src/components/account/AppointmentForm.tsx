"use client";

import { useActionState, useEffect, useState } from "react";
import { BotFields } from "@/components/ui/BotFields";
import { SignInPrompt } from "@/components/ui/SignInPrompt";
import { useCustomer } from "@/store/customer";
import { APPOINTMENT_KINDS, sendContactMessage } from "@/lib/actions/store";
import { cn } from "@/lib/utils";

/** Half-hour slots inside showroom hours (10 AM–2 PM, 5–9:30 PM). */
const SLOTS = [...["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"], ...["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]].map((t) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
});
const isoDay = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export function AppointmentForm() {
  const [state, action, pending] = useActionState(sendContactMessage, null);
  const user = useCustomer((s) => s.user);
  const [product, setProduct] = useState("");
  const [today, setToday] = useState("");
  useEffect(() => {
    setProduct(new URLSearchParams(window.location.search).get("product")?.slice(0, 300) ?? "");
    setToday(isoDay(new Date()));
  }, []);

  if (state?.ok)
    return (
      <p role="status" className="bg-cream px-5 py-6 text-center text-[16px]">
        {state.message}
      </p>
    );
  if (!user) return <SignInPrompt text="Please sign in to book a showroom visit or a video call." />;
  const e = state?.errors ?? {};
  const err = (k: string) => e[k] && <p className="mt-1 text-[13px] text-danger">{e[k]}</p>;
  return (
    <form action={action} className="space-y-5">
      <BotFields />
      {product && <input type="hidden" name="product" value={product} />}
      <fieldset>
        <legend className="label">How would you like to meet?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(APPOINTMENT_KINDS).map(([k, label], i) => (
            <label key={k} className="flex cursor-pointer items-center gap-3 border border-line px-4 py-3 has-[:checked]:border-ink">
              <input type="radio" name="kind" value={k} defaultChecked={i === 0} />
              <span>
                <b className="block text-[15px] font-medium">{label}</b>
                <span className="text-[13px] text-subtle">{k === "visit" ? "See and try pieces at our Thane West showroom" : "We show you pieces live on WhatsApp video"}</span>
              </span>
            </label>
          ))}
        </div>
        {err("kind")}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="a-date">Preferred date</label>
          <input id="a-date" name="date" type="date" min={today || undefined} required className={cn("input py-3", e.date && "border-danger")} />
          {err("date")}
        </div>
        <div>
          <label className="label" htmlFor="a-time">Preferred time</label>
          <select id="a-time" name="time" required defaultValue="" className={cn("input py-3", e.time && "border-danger")}>
            <option value="" disabled>
              Choose a time
            </option>
            {SLOTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err("time")}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="a-name">Name</label>
          <input id="a-name" name="name" defaultValue={user.displayName ?? ""} required minLength={2} className={cn("input py-3", e.name && "border-danger")} />
          {err("name")}
        </div>
        <div>
          <label className="label" htmlFor="a-phone">Phone / WhatsApp</label>
          <input id="a-phone" name="phone" type="tel" required autoComplete="tel" pattern="[+0-9][0-9 \-]{7,18}" title="A phone number we can call, e.g. +91 98765 43210" className={cn("input py-3", e.phone && "border-danger")} />
          {err("phone")}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="a-email">Email</label>
        <input id="a-email" name="email" type="email" defaultValue={user.email ?? ""} required className={cn("input py-3", e.email && "border-danger")} />
        {err("email")}
      </div>
      <div>
        <label className="label" htmlFor="a-message">
          What would you like to see? <span className="text-subtle">(optional)</span>
        </label>
        <textarea id="a-message" name="message" rows={3} placeholder={product ? `e.g. ${product} in a smaller size` : "e.g. bridal sets, a Pukhraj for a ring, men's chains"} className={cn("input py-3", e.message && "border-danger")} />
        {err("message")}
      </div>
      {product && <p className="text-[13px] text-subtle">About: {product}</p>}
      {state && !state.ok && <p className="text-[14px] text-danger">{state.message}</p>}
      <button type="submit" className="btn h-[50px] w-full" disabled={pending}>
        {pending ? "Sending…" : "Request appointment"}
      </button>
      <p className="text-center text-[12px] text-subtle">We&apos;ll call or WhatsApp you to confirm. Your slot isn&apos;t booked until we do.</p>
    </form>
  );
}
