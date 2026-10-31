"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/actions/store";
import { uploadImage } from "@/lib/actions/admin";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";

export function SubmitButton({ children = "Save", className }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={cn("btn px-6 py-2 text-[14px]", className)} disabled={pending}>
      {pending ? "Saving…" : children}
    </button>
  );
}

export function ConfirmSubmit({ children, message, className }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button
      type="submit"
      className={cn("text-[13px] text-danger underline-offset-2 hover:underline", className)}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Wraps a server action form with a status message. */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {state && (
        <p role="status" className={cn("mb-4 border px-4 py-2.5 text-[14px]", state.ok ? "border-[#cfe3cd] bg-[#eef6ed] text-success" : "border-[#efcccc] bg-[#fbeeee] text-danger")}>
          {state.message}
        </p>
      )}
      {children}
    </form>
  );
}

/** Image URL list with upload + previews. Value is submitted as newline-separated URLs. */
export function ImageListInput({ name, defaultValue, label = "Images", single = false }: { name: string; defaultValue: string[]; label?: string; single?: boolean }) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr(null);
    try {
      const added: string[] = [];
      for (const f of Array.from(files).slice(0, single ? 1 : 12)) added.push(await uploadImage(f));
      setUrls((u) => (single ? added.slice(0, 1) : [...u, ...added]));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  const move = (i: number, d: number) =>
    setUrls((u) => {
      const a = [...u];
      const j = i + d;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  return (
    <div>
      <p className="label">{label}</p>
      <input type="hidden" name={name} value={urls.join("\n")} />
      {urls.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-3">
          {urls.map((u, i) => (
            <li key={u + i} className="w-[108px]">
              <div className="relative h-[120px] w-[108px] overflow-hidden border border-line bg-cream-2">
                <Img src={u} alt="" fill sizes="108px" className="object-cover" />
                {i === 0 && !single && <span className="absolute top-1 left-1 bg-ink px-1.5 text-[10px] text-white">MAIN</span>}
              </div>
              <div className="mt-1 flex justify-between text-[12px]">
                {!single && (
                  <span className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} aria-label="Move left" className="px-1">
                      ←
                    </button>
                    <button type="button" onClick={() => move(i, 1)} aria-label="Move right" className="px-1">
                      →
                    </button>
                  </span>
                )}
                <button type="button" onClick={() => setUrls((x) => x.filter((_, k) => k !== i))} className="text-danger">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={!single} className="text-[13px]" onChange={(e) => upload(e.target.files)} disabled={busy} />
        {busy && <span className="text-[13px] text-subtle">Uploading…</span>}
      </div>
      <AddUrl onAdd={(u) => setUrls((x) => (single ? [u] : [...x, u]))} />
      {err && <p className="mt-1 text-[13px] text-danger">{err}</p>}
    </div>
  );
}

function AddUrl({ onAdd }: { onAdd: (u: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="mt-2 flex gap-2">
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="…or paste an image URL (https://… or /catalogue/…)" className="input py-1.5 text-[13px]" />
      <button
        type="button"
        className="btn-outline px-3 py-1 text-[12px]"
        onClick={() => {
          const u = v.trim();
          if (u.startsWith("https://") || u.startsWith("/")) {
            onAdd(u.split("?")[0].startsWith("https://images.unsplash.com/") ? u.split("?")[0] : u);
            setV("");
          }
        }}
      >
        Add
      </button>
    </div>
  );
}

type VRow = { id: string; title: string; sku: string; delta: string; stock: string };

export function VariantsEditor({ initial }: { initial: VRow[] }) {
  const [rows, setRows] = useState<VRow[]>(initial.length ? initial : [{ id: "", title: "Default", sku: "", delta: "0", stock: "0" }]);
  const set = (i: number, k: keyof VRow, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[14px]">
          <thead className="text-left text-[12px] tracking-[0.08em] text-subtle uppercase">
            <tr>
              <th className="pb-2 font-medium">Option (e.g. Size 7)</th>
              <th className="pb-2 font-medium">SKU</th>
              <th className="pb-2 font-medium">Price +/− ₹</th>
              <th className="pb-2 font-medium">Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="pr-2 pb-2">
                  <input type="hidden" name="v_id" value={r.id} />
                  <input name="v_title" value={r.title} onChange={(e) => set(i, "title", e.target.value)} className="input py-1.5" />
                </td>
                <td className="pr-2 pb-2">
                  <input name="v_sku" value={r.sku} onChange={(e) => set(i, "sku", e.target.value)} className="input py-1.5" />
                </td>
                <td className="pr-2 pb-2">
                  <input name="v_delta" type="number" step="0.01" value={r.delta} onChange={(e) => set(i, "delta", e.target.value)} className="input w-28 py-1.5" />
                </td>
                <td className="pr-2 pb-2">
                  <input name="v_stock" type="number" min="0" value={r.stock} onChange={(e) => set(i, "stock", e.target.value)} className="input w-24 py-1.5" />
                </td>
                <td className="pb-2">
                  {rows.length > 1 && (
                    <button type="button" className="text-[13px] text-danger" onClick={() => setRows((x) => x.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="mt-1 text-[13px] underline underline-offset-2" onClick={() => setRows((r) => [...r, { id: "", title: "", sku: "", delta: "0", stock: "0" }])}>
        + Add option
      </button>
      <p className="mt-1 text-[12px] text-subtle">Use a single “Default” option for products without sizes. For rings use “Size 6”, “Size 7”… and for bangles “Size 2.4”, “Size 2.6”…</p>
    </div>
  );
}

export function OfferTargetFields({
  defaultAppliesTo,
  defaultTarget,
  categories,
  collections,
}: {
  defaultAppliesTo: string;
  defaultTarget: string | null;
  categories: { id: string; name: string }[];
  collections: { id: string; title: string }[];
}) {
  const [applies, setApplies] = useState(defaultAppliesTo);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="f-appliesTo">
          Applies to
        </label>
        <select id="f-appliesTo" name="appliesTo" value={applies} onChange={(e) => setApplies(e.target.value)} className="input">
          <option value="all">All products</option>
          <option value="metal">A metal (e.g. all Silver)</option>
          <option value="category">A category</option>
          <option value="collection">A collection</option>
          <option value="products">Specific products</option>
        </select>
      </div>
      {applies === "metal" && (
        <div>
          <label className="label" htmlFor="f-target_metal">
            Metal
          </label>
          <select id="f-target_metal" name="target_metal" defaultValue={defaultTarget ?? "Silver"} className="input">
            {["Silver", "Gold", "Rose Gold", "Platinum"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      )}
      {applies === "category" && (
        <div>
          <label className="label" htmlFor="f-target_category">
            Category
          </label>
          <select id="f-target_category" name="target_category" defaultValue={defaultTarget ?? ""} className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {applies === "collection" && (
        <div>
          <label className="label" htmlFor="f-target_collection">
            Collection
          </label>
          <select id="f-target_collection" name="target_collection" defaultValue={defaultTarget ?? ""} className="input">
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}
      {applies === "products" && (
        <div>
          <label className="label" htmlFor="f-target_products">
            Product IDs (comma separated)
          </label>
          <input id="f-target_products" name="target_products" defaultValue={defaultTarget ?? ""} className="input font-mono text-[12px]" />
          <p className="mt-1 text-[12px] text-subtle">Copy IDs from the product edit page.</p>
        </div>
      )}
    </div>
  );
}
