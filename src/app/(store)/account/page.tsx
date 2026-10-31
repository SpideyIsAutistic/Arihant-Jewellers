"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCustomer, openLogin } from "@/store/customer";
import { ENQUIRY_KINDS, type EnquiryKind } from "@/lib/actions/store";
import { formatDate } from "@/lib/format";
import { useTitle } from "@/lib/use-load";

type Row = { id: string; product: string; message: string; kind?: EnquiryKind; when?: string; status: "new" | "contacted" | "closed"; createdAt: number };
const STATUS = { new: "Received", contacted: "We've been in touch", closed: "Closed" };

/** A signed-in customer's own enquiries and bookings (firestore.rules only allow reading your own). */
export default function MyEnquiries() {
  useTitle("My enquiries");
  const user = useCustomer((s) => s.user);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!user) return;
    getDocs(query(collection(db(), "enquiries"), where("uid", "==", user.uid)))
      .then((snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) })).sort((a, b) => b.createdAt - a.createdAt)))
      .catch(() => setFailed(true));
  }, [user]);

  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">My enquiries</h1>
      {user === null && (
        <p className="mt-8 text-center">
          <button type="button" className="btn" onClick={openLogin}>
            Sign in to see your enquiries
          </button>
        </p>
      )}
      {failed && <p className="mt-8 text-center text-danger">Couldn&apos;t load your enquiries. Please refresh.</p>}
      {user && !rows && !failed && <p className="mt-8 text-center text-subtle">Loading…</p>}
      {rows?.length === 0 && (
        <p className="mt-8 text-center text-body2">
          Nothing yet. Enquire about a piece or <Link href="/pages/contact" className="underline">send a WhatsApp enquiry</Link>.
        </p>
      )}
      {rows && rows.length > 0 && (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id} className="py-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                <span className="tracking-[0.1em] text-subtle uppercase">
                  {r.kind ? ENQUIRY_KINDS[r.kind] : r.product ? "Product enquiry" : "Message"} · {formatDate(new Date(r.createdAt))}
                </span>
                <span className={r.status === "new" ? "text-ink" : "text-success"}>{STATUS[r.status]}</span>
              </div>
              {r.product && <p className="mt-1 font-medium text-ink">{r.product}</p>}
              {r.when && <p className="text-[14px]">Requested: {r.when}</p>}
              <p className="mt-1 text-[14px] whitespace-pre-line text-body2">{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
