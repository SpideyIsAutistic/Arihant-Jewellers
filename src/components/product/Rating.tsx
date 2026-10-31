import { IconStar } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function RatingInline({ avg, count, className }: { avg: number; count: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] text-text", className)} aria-label={`Rated ${avg.toFixed(1)} out of 5 from ${count} reviews`}>
      <IconStar size={14} className="text-star" />({avg.toFixed(1)} | {count})
    </span>
  );
}

export function Stars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-star", className)} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} size={size} filled={value >= i - 0.25} />
      ))}
    </span>
  );
}
