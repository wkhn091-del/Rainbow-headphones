import "server-only";

import { NextResponse } from "next/server";
import { buildQuote, quoteRequestSchema } from "@/lib/pricing/quote";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!(await enforceRateLimit(`quote:${clientIp(request)}`, 30, 60_000))) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const parsed = quoteRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const quote = buildQuote(parsed.data);
  if (!quote.ok) {
    return NextResponse.json({ error: quote.error }, { status: 400 });
  }

  return NextResponse.json(quote, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
