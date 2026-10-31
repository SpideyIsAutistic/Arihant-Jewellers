"use client";

import { BotFields } from "@/components/ui/BotFields";
import { requireLogin, useCustomer } from "@/store/customer";
import { useActionState, useState } from "react";
import { submitReview } from "@/lib/actions/store";
import { IconStar } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [state, action, pending] = useActionState(submitReview, null);
  const user = useCustomer((s) => s.user);

  if (state?.ok)
    return (
      <p className="mt-6 text-[15px] text-success" role="status">
        {state.message}
      </p>
    );
  if (!open || !user)
    return (
      <button
        type="button"
        className="btn mt-6"
        onClick={() => requireLogin() && setOpen(true)}
      >
        Write a review
      </button>
    );
  const err = state?.errors ?? {};
  return (
    <form action={action} className="mt-6 grid max-w-[640px] gap-4">
      <input type="hidden" name="productId" value={productId} />
      <BotFields />
      <input type="hidden" name="rating" value={rating || ""} />
      <div>
        <p className="label">Rating</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className="text-star"
            >
              <IconStar size={26} filled={n <= rating} />
            </button>
          ))}
        </div>
        {err.rating && (
          <p className="mt-1 text-[13px] text-danger">{err.rating}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rv-name">
            Name
          </label>
          <input
            id="rv-name"
            name="name"
            defaultValue={user.displayName ?? ""}
            className={cn("input", err.name && "border-danger")}
            required
          />
          {err.name && (
            <p className="mt-1 text-[13px] text-danger">{err.name}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="rv-email">
            Email (not published)
          </label>
          <input
            id="rv-email"
            name="email"
            defaultValue={user.email ?? ""}
            type="email"
            className={cn("input", err.email && "border-danger")}
            required
          />
          {err.email && (
            <p className="mt-1 text-[13px] text-danger">{err.email}</p>
          )}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="rv-title">
          Title
        </label>
        <input id="rv-title" name="title" className="input" maxLength={120} />
      </div>
      <div>
        <label className="label" htmlFor="rv-body">
          Review
        </label>
        <textarea
          id="rv-body"
          name="body"
          rows={4}
          className={cn("input", err.body && "border-danger")}
          required
        />
        {err.body && <p className="mt-1 text-[13px] text-danger">{err.body}</p>}
      </div>
      {state && !state.ok && (
        <p className="text-[14px] text-danger">{state.message}</p>
      )}
      <div>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
