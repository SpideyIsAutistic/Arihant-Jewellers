"use client";

import { formatDate } from "@/lib/format";
import { deleteSubscriber, listSubscribers } from "@/lib/actions/admin";
import { useLoad } from "@/lib/use-load";
import { PageHeader, Table } from "@/components/admin/ui";
import { PageLoader } from "@/components/ui/PageLoader";

export default function SubscribersAdmin() {
  const { data: rows, error } = useLoad(listSubscribers);
  if (!rows) return <PageLoader error={error} />;
  const exportCsv = () => {
    const csv = "email,subscribed\n" + rows.map((r) => `${r.email},${r.createdAt.toISOString()}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "arihant-subscribers.csv";
    a.click();
  };
  return (
    <>
      <PageHeader title={`Newsletter subscribers (${rows.length})`} action={<button onClick={exportCsv} className="btn-outline px-4 py-2 text-[13px]">Export CSV</button>} />
      <Table head={["Email", "Subscribed", ""]} empty={rows.length ? undefined : "No subscribers yet."}>
        {rows.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3">{s.email}</td>
            <td className="px-4 py-3">{formatDate(s.createdAt)}</td>
            <td className="px-4 py-3 text-right">
              <form action={deleteSubscriber}>
                <input type="hidden" name="id" value={s.id} />
                <button className="text-[13px] text-danger">Remove</button>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
