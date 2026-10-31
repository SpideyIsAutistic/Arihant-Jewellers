import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Text wordmark used until the client's logo file is supplied.
 * To use an image logo, replace the inner markup with <Image src="/logo.svg" … />.
 */
export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      aria-label="Arihant Jewellers — home"
      className={cn(
        "inline-flex flex-col items-center leading-none select-none",
        tone === "light" ? "text-cream-2" : "text-ink",
        className,
      )}
    >
      <span className="font-serif text-[23px] font-medium tracking-[0.12em] sm:text-[27px] md:text-[29px]">ARIHANT</span>
      <span className="mt-1 flex w-full items-center gap-2 text-[7px] font-medium tracking-[0.42em] sm:text-[8.5px] md:text-[9.5px]">
        <span className="h-px flex-1 bg-current opacity-60" />
        JEWELLERS
        <span className="h-px flex-1 bg-current opacity-60" />
      </span>
    </Link>
  );
}
