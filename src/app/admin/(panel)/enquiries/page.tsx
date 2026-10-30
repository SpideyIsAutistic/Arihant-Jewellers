"use client";

import { formatDate } from "@/lib/format";
import {
  deleteEnquiry,
  listEnquiries,
  updateEnquiry,
} from "@/lib/actions/admin";
import { useLoad } from "@/lib/use-load";
import { whatsappUrl } from "@/store/site";
import {
  ActionForm,
  ConfirmSubmit,
  SubmitButton,
} from "@/components/admin/client";
import { Badge, PageHeader } from "@/components/admin/ui";
import { PageLoader } from "@/components/ui/PageLoader";

const TONE = { new: "warn", contacted: "neutral", closed: "good" } as const;

export default function EnquiriesAdmin() {
  const { data: rows, error } = useLoad(listEnquiries);
  if (!rows) return <PageLoader error={error} />;
  return (
    <>
      <PageHeader
        title={`Enquiries (${rows.filter((r) => r.status === "new").length} new)`}
      />
      <p className="mb-4 text-[14px] text-body2">
        Messages from the Contact page and each product&apos;s &ldquo;Send an
        enquiry&rdquo; form. They are also emailed to you when a Web3Forms key
        is set in Settings.
      </p>
      {rows.length === 0 && (
        <p className="border border-line bg-white px-4 py-10 text-center text-subtle">
          No enquiries yet.
        </p>
      )}
      <ul className="space-y-3">
        {rows.map((r) => {
          const digits = r.phone.replace(/\D/g, "");
          return (
            <li key={r.id} className="border border-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px]">
                  <b>{r.name}</b> ·{" "}
                  <a href={`mailto:${r.email}`} className="underline">
                    {r.email}
                  </a>
                  {r.phone && (
                    <>
                      {" "}
                      ·{" "}
                      <a href={`tel:${r.phone}`} className="underline">
                        {r.phone}
                      </a>
                      {digits.length >= 10 && (
                        <>
                          {" "}
                          ·{" "}
                          <a
                            href={
                              whatsappUrl(
                                digits.length === 10 ? `91${digits}` : digits,
                                `Hi ${r.name}, this is Arihant Jewellers about your enquiry${r.product ? ` for ${r.product}` : ""}.`,
                              ) ?? undefined
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            WhatsApp
                          </a>
                        </>
                      )}
                    </>
                  )}{" "}
                  ·{" "}
                  <span className="text-subtle">{formatDate(r.createdAt)}</span>
                </p>
                <Badge tone={TONE[r.status]}>{r.status}</Badge>
              </div>
              {r.kind && (
                <p className="mt-2 text-[14px]">
                  <Badge tone="dark">{r.kind === "visit" ? "Showroom visit" : "Video call"}</Badge> <b>{r.when}</b>
                </p>
              )}
              {r.product && (
                <p className="mt-2 text-[13px] text-subtle">
                  About:{" "}
                  {r.page ? (
                    <a
                      href={r.page}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {r.product}
                    </a>
                  ) : (
                    r.product
                  )}
                </p>
              )}
              <p className="mt-2 text-[14px] whitespace-pre-line text-body2">
                {r.message}
              </p>
              {/* key remounts the form with the saved values (React resets forms after an action) */}
              <ActionForm
                key={`${r.status}|${r.notes}`}
                action={updateEnquiry}
                className="mt-3"
              >
                <input type="hidden" name="id" value={r.id} />
                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-[13px]">
                    <span className="label">Status</span>
                    <select
                      name="status"
                      defaultValue={r.status}
                      className="input py-2"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                  <label className="min-w-[240px] flex-1 text-[13px]">
                    <span className="label">Notes</span>
                    <input
                      name="notes"
                      defaultValue={r.notes}
                      maxLength={2000}
                      className="input py-2"
                      placeholder="e.g. Called, coming in Saturday"
                    />
                  </label>
                  <SubmitButton />
                </div>
              </ActionForm>
              <form action={deleteEnquiry} className="mt-2 text-right">
                <input type="hidden" name="id" value={r.id} />
                <ConfirmSubmit
                  message="Delete this enquiry?"
                  className="text-[13px] text-danger"
                >
                  Delete
                </ConfirmSubmit>
              </form>
            </li>
          );
        })}
      </ul>
    </>
  );
}
