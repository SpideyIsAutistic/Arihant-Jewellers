"use client";

import Link from "next/link";
import { Suspense } from "react";
import { adminLogout } from "@/lib/actions/admin";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminGate } from "@/components/admin/AdminGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      {(user) => (
        <div className="min-h-screen bg-[#f6f4f0] md:grid md:grid-cols-[230px_1fr]">
          <aside className="bg-ink text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-5 md:block">
              <Link href="/admin" className="block font-serif text-[24px] tracking-[0.14em] text-cream-2">
                ARIHANT
                <span className="block font-sans text-[10px] tracking-[0.3em] text-white/60">STORE ADMIN</span>
              </Link>
            </div>
            <AdminNav />
            <div className="space-y-2 border-t border-white/10 px-5 py-4 text-[13px] text-white/70">
              <p className="truncate">{user.email}</p>
              <Link href="/" target="_blank" className="block hover:text-white">
                View store ↗
              </Link>
              <button className="hover:text-white" onClick={() => adminLogout()}>
                Log out
              </button>
            </div>
          </aside>
          <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      )}
    </AdminGate>
  );
}
