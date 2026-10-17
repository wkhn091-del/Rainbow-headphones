import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_NEXT = [/^\/account(\/.*)?$/, /^\/checkout$/, /^\/$/];

function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/account/orders";
  if (ALLOWED_NEXT.some((re) => re.test(raw))) return raw;
  return "/account/orders";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
