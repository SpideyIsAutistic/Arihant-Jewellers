"use client";

import Link from "next/link";

export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-width py-24 text-center">
      <h1 className="h-section">Something went wrong</h1>
      <p className="mt-3 text-[15px] text-body2">Please try again. If the problem continues, contact us.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn">
          Try again
        </button>
        <Link href="/" className="btn-outline">
          Homepage
        </Link>
      </div>
    </div>
  );
}
