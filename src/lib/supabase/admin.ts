import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS.
 * Use only in Server Actions / Route Handlers for inventory RPC + waitlist writes.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key || url.includes("xxxx")) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseAdminConfigured() {
  return createAdminClient() !== null;
}
