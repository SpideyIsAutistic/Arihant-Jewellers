"use client";

import { addAdmin, listAdmins, removeAdmin } from "@/lib/actions/admin";
import { useLoad } from "@/lib/use-load";
import { Card, Field, PageHeader, Table } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/client";
import { PageLoader } from "@/components/ui/PageLoader";

export default function AdminsPage() {
  const { data: rows, error } = useLoad(listAdmins);
  if (!rows) return <PageLoader error={error} />;
  return (
    <>
      <PageHeader title="Admin access" />
      <p className="mb-4 max-w-[720px] text-[14px] text-body2">
        These Google accounts and phone numbers can sign in to this admin panel and edit the store. Anyone else who signs in is turned away, and the database rejects their changes.
      </p>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Table head={["Google account or phone", "Added by", ""]} empty={rows.length ? undefined : "No admins yet."}>
          {rows.map((a) => (
            <tr key={a.email}>
              <td className="px-4 py-3">{a.email}</td>
              <td className="px-4 py-3 text-subtle">{a.addedBy || "—"}</td>
              <td className="px-4 py-3 text-right">
                <form action={removeAdmin}>
                  <input type="hidden" name="email" value={a.email} />
                  <button className="text-[13px] text-danger" onClick={(e) => !confirm(`Remove admin access for ${a.email}?`) && e.preventDefault()}>
                    Remove
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </Table>
        <Card title="Give access">
          <ActionForm action={addAdmin} className="space-y-4">
            <Field label="Google account email or mobile number" name="email" required placeholder="name@gmail.com or 98765 43210" hint="Mobile numbers sign in with an SMS code. Indian numbers can be entered without +91." />
            <SubmitButton>Add admin</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
