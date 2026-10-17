import { NextResponse } from "next/server";
import { envFlags } from "@/lib/env/server";
import { phoneIsPlaceholder, vatLabel } from "@/lib/business";

/**
 * Readiness for operators — requires ?secret=REVALIDATE_SECRET
 * Public /api/health stays { ok: true } only.
 */
export async function GET(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const q = new URL(req.url).searchParams.get("secret");
  if (!secret || !q || q !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const flags = envFlags();
  return NextResponse.json(
    {
      ok: true,
      flags: {
        ...flags,
        businessPhoneLive: !phoneIsPlaceholder(),
        vatConfigured: Boolean(process.env.NEXT_PUBLIC_VAT_ID) || !vatLabel().includes("יושלם"),
      },
      goLiveBlockers: [
        !flags.grow && "GROW_API_KEY",
        !flags.supabase && "SUPABASE",
        !flags.resend && "RESEND_API_KEY",
        phoneIsPlaceholder() && "SUPPORT_PHONE",
        vatLabel().includes("יושלם") && "VAT_ID",
      ].filter(Boolean),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
