import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({ title, action, back }: { title: string; action?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-1 inline-block text-[13px] text-subtle hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-[22px] tracking-[0.04em]">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("border border-line bg-white p-5", className)}>
      {title && <h2 className="mb-4 text-[13px] font-semibold tracking-[0.1em] text-subtle uppercase">{title}</h2>}
      {children}
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  required,
  placeholder,
  className,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  step?: string;
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={`f-${name}`}>
        {label}
      </label>
      <input id={`f-${name}`} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} step={step} className="input text-[15px]" />
      {hint && <p className="mt-1 text-[12px] text-subtle">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, name, defaultValue, rows = 4, hint, className, mono }: { label: string; name: string; defaultValue?: string | null; rows?: number; hint?: string; className?: string; mono?: boolean }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={`f-${name}`}>
        {label}
      </label>
      <textarea id={`f-${name}`} name={name} defaultValue={defaultValue ?? ""} rows={rows} className={cn("input text-[15px]", mono && "font-mono text-[13px]")} />
      {hint && <p className="mt-1 text-[12px] text-subtle">{hint}</p>}
    </div>
  );
}

export function Select({ label, name, defaultValue, options, hint, className }: { label: string; name: string; defaultValue?: string | null; options: { value: string; label: string }[]; hint?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={`f-${name}`}>
        {label}
      </label>
      <select id={`f-${name}`} name={name} defaultValue={defaultValue ?? ""} className="input text-[15px]">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[12px] text-subtle">{hint}</p>}
    </div>
  );
}

export function Check({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5 text-[15px]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-ink" />
      <span>
        {label}
        {hint && <span className="block text-[12px] text-subtle">{hint}</span>}
      </span>
    </label>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "dark" }) {
  const tones = {
    neutral: "bg-cream-2 text-body2",
    good: "bg-[#e3efe2] text-success",
    warn: "bg-[#f7ecd4] text-[#7a5a12]",
    bad: "bg-[#f6e0e0] text-danger",
    dark: "bg-ink text-white",
  };
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[12px] whitespace-nowrap", tones[tone])}>{children}</span>;
}

export function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead className="border-b border-line bg-cream text-[12px] tracking-[0.08em] text-subtle uppercase">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty && <p className="px-4 py-10 text-center text-subtle">{empty}</p>}
    </div>
  );
}

export function toLocalInput(d: Date | null | undefined) {
  if (!d) return "";
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return t.toISOString().slice(0, 16);
}
