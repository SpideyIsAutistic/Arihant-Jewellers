import type { StoreSettings } from "@/lib/settings";
import { IconStar } from "./Icons";

/** "★ 4.8 · 305 Google reviews" with links to read and write reviews. Hidden until a rating is set. */
export function GoogleRating({ s, className = "" }: { s: Pick<StoreSettings, "googleRating" | "googleReviewCount" | "googleProfileUrl" | "googleReviewUrl">; className?: string }) {
  if (!s.googleRating) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] ${className}`}>
      <a href={s.googleProfileUrl || undefined} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline-offset-2 hover:underline">
        <span className="text-star" aria-hidden>
          <IconStar size={15} />
        </span>
        <b>{s.googleRating}</b>
        <span>
          {s.googleReviewCount ? `· ${Number(s.googleReviewCount).toLocaleString("en-IN")} ` : ""}Google reviews
        </span>
      </a>
      {s.googleReviewUrl && (
        <a href={s.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-subtle underline underline-offset-2 hover:text-ink">
          Write a review
        </a>
      )}
    </div>
  );
}
