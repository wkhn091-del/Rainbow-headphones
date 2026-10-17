import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getOrderByPublicId } from "@/lib/account/orders";
import { ReorderButton } from "@/components/account/ReorderButton";

type Props = { params: Promise<{ publicId: string }> };

export default async function OrderDetailPage({ params }: Props) {
  await connection();
  const { publicId } = await params;
  if (!/^[a-zA-Z0-9_-]{4,64}$/.test(publicId)) notFound();

  const order = await getOrderByPublicId(publicId);
  if (!order) notFound();

  return (
    <section>
      <Link
        href="/account/orders"
        className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)]"
      >
        ← כל ההזמנות
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">
        הזמנה <bdi dir="ltr">{order.public_id}</bdi>
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        סטטוס: {order.status} · ₪{(order.total_agorot / 100).toLocaleString("he-IL")}
      </p>

      <ul className="mt-6 space-y-2 text-sm text-[var(--color-text-muted)]">
        {order.items.map((i, idx) => (
          <li key={`${i.sku}-${idx}`}>
            <bdi dir="ltr">{i.sku}</bdi>
            {i.color_id ? (
              <>
                {" · "}
                <bdi dir="ltr">{i.color_id}</bdi>
              </>
            ) : null}{" "}
            ×{i.qty}
          </li>
        ))}
      </ul>

      {order.shipment ? (
        <div className="nexa-glass mt-6 p-4 text-sm">
          <p className="text-white">משלוח</p>
          <p className="mt-1 text-[var(--color-text-muted)]">
            {order.shipment.carrier ?? "שליח"} · {order.shipment.status}
            {order.shipment.tracking_code ? (
              <>
                {" · "}
                <bdi dir="ltr">{order.shipment.tracking_code}</bdi>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      {order.warranty ? (
        <div className="nexa-glass mt-4 p-4 text-sm">
          <p className="text-white">אחריות דיגיטלית</p>
          <p className="mt-1 text-[var(--color-text-muted)]">
            <bdi dir="ltr">{order.warranty.sku}</bdi> · עד{" "}
            {new Date(order.warranty.ends_on).toLocaleDateString("he-IL")} ·{" "}
            {order.warranty.status}
          </p>
        </div>
      ) : null}

      <div className="mt-6">
        <ReorderButton publicId={order.public_id} />
      </div>
    </section>
  );
}
