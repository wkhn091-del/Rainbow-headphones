import Link from "next/link";
import { connection } from "next/server";
import { listOrdersForUser } from "@/lib/account/orders";

export default async function WarrantyPage() {
  await connection();
  const { orders, demo } = await listOrdersForUser();
  const withW = orders.filter((o) => o.warranty);

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">אחריות דיגיטלית</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        שנתיים חלופי-עד-הבית · מחובר להזמנה.
      </p>
      {demo ? (
        <p className="mt-3 text-xs text-[var(--color-accent)]">מצב דמו</p>
      ) : null}

      {withW.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">
          אין כרטיסי אחריות עדיין.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {withW.map((o) => (
            <li key={o.public_id} className="nexa-glass p-4 text-sm">
              <p className="text-white">
                <bdi dir="ltr">{o.warranty?.sku}</bdi>
              </p>
              <p className="mt-1 text-[var(--color-text-muted)]">
                בתוקף עד{" "}
                {o.warranty
                  ? new Date(o.warranty.ends_on).toLocaleDateString("he-IL")
                  : "—"}{" "}
                · {o.warranty?.status}
              </p>
              <Link
                href={`/account/orders/${o.public_id}`}
                className="mt-2 inline-block text-xs text-[var(--color-accent)]"
              >
                להזמנה <bdi dir="ltr">{o.public_id}</bdi>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
