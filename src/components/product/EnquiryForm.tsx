"use client";

import { BotFields } from "@/components/ui/BotFields";
import { SignInPrompt } from "@/components/ui/SignInPrompt";
import { useCustomer } from "@/store/customer";
import { useActionState, useState } from "react";
import { sendContactMessage, type EnquiryKind } from "@/lib/actions/store";
import { compressImage } from "@/lib/image";
import { cn } from "@/lib/utils";

type Props = {
  product: string;
  /** enquiry type for the admin inbox (exchange, scheme, custom…) */
  kind?: EnquiryKind;
  message?: string;
  submitLabel?: string;
  signInText?: string;
  /** lets the visitor attach a reference photo (stored with the enquiry) */
  withPhoto?: boolean;
};

/** Enquiry form: saved to Admin → Enquiries and emailed via Web3Forms. */
export function EnquiryForm({
  product,
  kind,
  message = "Hi, I'd like to know the price and availability of this piece.",
  submitLabel = "Send enquiry",
  signInText = "Please sign in to send an enquiry about this piece.",
  withPhoto,
}: Props) {
  const [state, action, pending] = useActionState(sendContactMessage, null);
  const user = useCustomer((s) => s.user);
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  if (state?.ok)
    return (
      <p role="status" className="text-[14px] text-success">
        {state.message}
      </p>
    );
  if (!user)
    return (
      <SignInPrompt text={signInText} />
    );
  const e = state?.errors ?? {};
  return (
    <form action={action} className="space-y-3" noValidate>
      <input type="hidden" name="product" value={product} />
      {kind && <input type="hidden" name="kind" value={kind} />}
      {photo && <input type="hidden" name="photo" value={photo} />}
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
          defaultValue={message}
          className={cn("input py-2.5", e.message && "border-danger")}
        />
        {e.message && (
          <p className="mt-1 text-[12px] text-danger">{e.message}</p>
        )}
      </div>
      {withPhoto && (
        <div>
          <label htmlFor="e-photo" className="label">
            Reference photo or sketch <span className="text-subtle">(optional)</span>
          </label>
          <input
            id="e-photo"
            type="file"
            accept="image/*"
            className="block w-full text-[13px]"
            onChange={async (ev) => {
              const f = ev.target.files?.[0];
              setPhotoError("");
              if (!f) return setPhoto("");
              try {
                setPhoto(await compressImage(f, 400_000, 1200));
              } catch {
                setPhoto("");
                setPhotoError("Couldn't read that image. Try a JPG or PNG.");
              }
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo && <img src={photo} alt="Your reference" className="mt-2 h-24 w-24 object-cover" />}
          {(photoError || e.photo) && <p className="mt-1 text-[12px] text-danger">{photoError || e.photo}</p>}
        </div>
      )}
      {state && !state.ok && (
        <p className="text-[13px] text-danger">{state.message}</p>
      )}
      <button type="submit" className="btn h-[44px] w-full" disabled={pending}>
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
