import Link from "next/link";
import { connection } from "next/server";
import { listOrdersForUser } from "@/lib/account/orders";
import { ReorderButton } from "@/components/account/ReorderButton";

function formatIls(agorot: number) {
  return `₪${(agorot / 100).toLocaleString("he-IL")}`;
}

export default async function OrdersPage() {
  await connection();
  const { orders, demo } = await listOrdersForUser();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">הזמנות</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        היסטוריה, מעקב ואחריות — הכל במקום אחד.
      </p>
      {demo ? (
        <p className="mt-3 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)] px-3 py-2 text-xs text-[var(--color-accent)]">
          מצב דמו — חברו Supabase ב-<bdi dir="ltr">.env.local</bdi> לנתונים אמיתיים.
        </p>
      ) : null}

      {orders.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">
          אין הזמנות עדיין.{" "}
          <Link href="/" className="text-[var(--color-accent)]">
            חזרה למוצר
          </Link>
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li
              key={o.public_id}
              className="nexa-glass flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-white">
                  הזמנה{" "}
                  <bdi dir="ltr" className="text-[var(--color-accent)]">
                    {o.public_id}
                  </bdi>
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-faint)]">
                  {new Date(o.created_at).toLocaleDateString("he-IL")} · {o.status} ·{" "}
                  {formatIls(o.total_agorot)}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {o.items.map((i) => `${i.sku} ×${i.qty}`).join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/account/orders/${o.public_id}`}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-white"
                >
                  פרטים
                </Link>
                <ReorderButton publicId={o.public_id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
