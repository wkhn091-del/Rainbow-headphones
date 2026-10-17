import "server-only";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { timingSafeEqual } from "crypto";

const bodySchema = z.object({
  path: z.string().min(1).max(200).regex(/^\/[a-zA-Z0-9/_-]*$/),
  secret: z.string().min(16).max(256),
});

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET ?? "";
  if (!expected || expected.length < 16) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || !safeEqual(parsed.data.secret, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidatePath(parsed.data.path);
  return NextResponse.json({ revalidated: true, path: parsed.data.path });
}
