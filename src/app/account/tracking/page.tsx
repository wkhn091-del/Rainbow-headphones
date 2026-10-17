import Link from "next/link";
import { connection } from "next/server";
import { listOrdersForUser } from "@/lib/account/orders";

export default async function TrackingPage() {
  await connection();
  const { orders, demo } = await listOrdersForUser();
  const withShip = orders.filter((o) => o.shipment);

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">מעקב משלוח</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        עדכונים ידניים מ-Supabase · SMS כשסטטוס משתנה.
      </p>
      {demo ? (
        <p className="mt-3 text-xs text-[var(--color-accent)]">מצב דמו</p>
      ) : null}

      {withShip.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">אין משלוחים פעילים.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {withShip.map((o) => (
            <li key={o.public_id} className="nexa-glass p-4">
              <p className="text-sm text-white">
                <Link
                  href={`/account/orders/${o.public_id}`}
                  className="text-[var(--color-accent)] hover:opacity-80"
                >
                  <bdi dir="ltr">{o.public_id}</bdi>
                </Link>
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {o.shipment?.carrier ?? "שליח"} · {o.shipment?.status}
              </p>
              {o.shipment?.tracking_code ? (
                <p className="mt-1 text-xs text-[var(--color-text-faint)]" dir="ltr">
                  {o.shipment.tracking_code}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
