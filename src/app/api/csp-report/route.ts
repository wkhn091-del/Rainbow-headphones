import { NextResponse } from "next/server";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

/** CSP Report-Only collector — no PII, capped body */
export async function POST(req: Request) {
  if (!(await enforceRateLimit(`csp:${clientIp(req)}`, 40, 60_000))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const text = await req.text();
    if (text.length > 8_000) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }
    console.info("[csp-report]", text.slice(0, 500));
  } catch {
    /* ignore */
  }

  return NextResponse.json({ ok: true });
}
