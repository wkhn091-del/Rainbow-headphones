import { NextResponse } from "next/server";
import { z } from "zod";
import { createGrowSession } from "@/lib/payments/grow";
import { createAdminClient } from "@/lib/supabase/admin";
import { FLAGSHIP, PRODUCT_SKU } from "@/lib/catalog";
import { envFlags } from "@/lib/env/server";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  orderId: z.string().uuid(),
});

/**
 * Create Grow checkout session for an existing pending launch_order.
 * Amount is re-read from DB — never trusted from client.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await enforceRateLimit(`grow-session:${ip}`, 20, 60_000))) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", error: "יותר מדי ניסיונות" },
      { status: 429 },
    );
  }

  if (!envFlags().grow) {
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "Grow לא מוגדר" },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "JSON לא תקין" },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "invalid_body", error: "orderId חסר" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "DB לא מוגדר" },
      { status: 503 },
    );
  }

  const { data: order, error } = await admin
    .from("launch_orders")
    .select("id, email, total_amount, status, sku")
    .eq("id", parsed.data.orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json(
      { ok: false, code: "not_found", error: "הזמנה לא נמצאה" },
      { status: 404 },
    );
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { ok: false, code: "invalid_status", error: "ההזמנה לא ממתינה לתשלום" },
      { status: 409 },
    );
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const session = await createGrowSession({
    orderId: order.id as string,
    amountIls: Number(order.total_amount),
    email: order.email as string,
    description: `${FLAGSHIP.name} · ${order.sku ?? PRODUCT_SKU}`,
    successUrl: `${site}/checkout?paid=1&order=${order.id}`,
    cancelUrl: `${site}/checkout?cancel=1&order=${order.id}`,
  });

  if (!session.ok) {
    return NextResponse.json(session, { status: 502 });
  }

  await admin
    .from("launch_orders")
    .update({ grow_ref: session.providerRef })
    .eq("id", order.id);

  return NextResponse.json({
    ok: true,
    checkoutUrl: session.checkoutUrl,
    providerRef: session.providerRef,
  });
}
