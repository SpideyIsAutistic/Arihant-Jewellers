"use client";

import { openLogin } from "@/store/customer";

export function SignInPrompt({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[14px] text-body2">{text}</p>
      <button type="button" className="btn h-[44px] w-full" onClick={openLogin}>
        Sign in
      </button>
    </div>
  );
}
