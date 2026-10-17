export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const configured = Boolean(url && anon && !url.includes("xxxx"));
  return { url, anon, configured };
}
