import { NextResponse } from "next/server";

/** OK only — no versions, env, or internals */
export async function GET() {
  return NextResponse.json({ ok: true });
}
