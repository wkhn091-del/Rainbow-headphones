import { NextResponse } from "next/server";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

/**
 * Morning (חשבונית ירוקה) webhook stub.
 * Wire signature + invoice PDF link when MORNING_API_KEY is live.
 */
export async function POST(req: Request) {
  if (!(await enforceRateLimit(`morning-wh:${clientIp(req)}`, 60, 60_000))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const secret = process.env.MORNING_WEBHOOK_SECRET;
  if (secret) {
    const hdr = req.headers.get("x-morning-signature") ?? "";
    if (hdr !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  console.info("[morning:webhook]", {
    keys:
      body && typeof body === "object"
        ? Object.keys(body as object).slice(0, 8)
        : [],
  });

  return NextResponse.json({ ok: true, received: true });
}
