import "server-only";

import { NextResponse } from "next/server";
import { LAUNCH } from "@/lib/catalog";
import { preorderSchema } from "@/lib/validators/preorder";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!(await enforceRateLimit(`preorder:${clientIp(req)}`, 8, 60_000))) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "בודקים את הפרטים ושובחים" }, { status: 400 });
  }

  const parsed = preorderSchema.safeParse(json);
  if (!parsed.success) {
    console.error("[preorder:validation]", parsed.error.flatten());
    return NextResponse.json({ error: "בודקים את כתובת המייל ושובחים" }, { status: 400 });
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true, coupon: LAUNCH.couponCode });
  }

  const { name, email, phone, color } = parsed.data;

  // Stub until Supabase preorder_signups + Resend — never log PII
  console.info("[preorder]", {
    ok: true,
    color,
    coupon: LAUNCH.couponCode,
    at: new Date().toISOString(),
    nameLen: name.length,
    hasPhone: Boolean(phone),
  });
  void email;

  return NextResponse.json({
    ok: true,
    coupon: LAUNCH.couponCode,
    discountPercent: LAUNCH.discountPercent,
  });
}
