import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyGrowWebhookSignature } from "@/lib/payments/grow";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

/**
 * Grow payment webhook — mark launch_orders paid / failed.
 * On failure: release reserved stock.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await enforceRateLimit(`grow-wh:${ip}`, 120, 60_000))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const raw = await req.text();
  const signature =
    req.headers.get("x-grow-signature") ||
    req.headers.get("x-signature") ||
    req.headers.get("authorization");

  if (!verifyGrowWebhookSignature(raw, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: {
    type?: string;
    data?: {
      metadata?: { orderId?: string };
      status?: string;
      id?: string;
    };
  };
  try {
    payload = JSON.parse(raw) as typeof payload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const orderId = payload.data?.metadata?.orderId;
  const status = payload.data?.status ?? payload.type;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "no orderId" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const paid =
    status === "paid" ||
    status === "succeeded" ||
    status === "payment.succeeded" ||
    status === "checkout.completed";

  const failed =
    status === "failed" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "payment.failed";

  if (paid) {
    await admin
      .from("launch_orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", orderId)
      .eq("status", "pending");
  } else if (failed) {
    const { data: order } = await admin
      .from("launch_orders")
      .select("id, status, sku")
      .eq("id", orderId)
      .maybeSingle();

    if (order?.status === "pending") {
      await admin
        .from("launch_orders")
        .update({ status: "failed" })
        .eq("id", orderId);
      await admin.rpc("release_stock", {
        p_product_name: "Nexa Pro 3D",
        p_qty: 1,
      });
    }
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
