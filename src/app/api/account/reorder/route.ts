import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getOrderByPublicId,
  getSessionUserId,
} from "@/lib/account/orders";
import { PRODUCT_SKU } from "@/lib/catalog";
import { getSupabaseEnv } from "@/lib/supabase/env";

const bodySchema = z.object({
  publicId: z.string().min(4).max(64).regex(/^[a-zA-Z0-9_-]+$/),
});

export async function POST(request: Request) {
  const { configured } = getSupabaseEnv();
  if (!configured || !(await getSessionUserId())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const order = await getOrderByPublicId(parsed.data.publicId);
  if (!order || order.items.length === 0) {
    return NextResponse.json({ error: "ההזמנה לא נמצאה" }, { status: 404 });
  }

  // Reorder = ids only; prices recalculated on checkout server-side
  const first = order.items[0];
  const sku = first.sku || PRODUCT_SKU;
  const color = first.color_id ?? "titanium";
  const qty = Math.min(first.qty, 2);

  const checkoutUrl = `/checkout?sku=${encodeURIComponent(sku)}&color=${encodeURIComponent(color)}&qty=${qty}&reorder=1`;

  return NextResponse.json({ ok: true, checkoutUrl });
}
