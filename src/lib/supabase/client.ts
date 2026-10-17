"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const { url, anon, configured } = getSupabaseEnv();
  if (!configured) return null;
  return createBrowserClient(url, anon);
}
