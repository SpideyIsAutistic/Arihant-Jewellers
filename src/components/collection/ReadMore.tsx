"use client";

import { useEffect, useRef, useState } from "react";

export function ReadMore({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight + 2);
  }, [text]);
  const paras = text.split(/\n{2,}/);
  return (
    <div className="mx-auto max-w-[680px] text-center">
      <div ref={ref} className={open ? "" : "line-clamp-3"}>
        {paras.map((p, i) => (
          <p key={i} className="mb-3 text-[15px] leading-[1.7] text-text sm:text-[16px]">
            {p}
          </p>
        ))}
      </div>
      {(clamped || open) && (
        <button type="button" className="mt-2 text-[15px] underline underline-offset-4 hover:no-underline" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
