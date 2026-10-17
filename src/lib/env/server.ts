import "server-only";

import { z } from "zod";

const optionalUrl = z
  .string()
  .url()
  .or(z.literal(""))
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  GROW_API_KEY: z.string().optional(),
  GROW_WEBHOOK_SECRET: z.string().optional(),
  MORNING_API_KEY: z.string().optional(),
  SLACK_WEBHOOK_URL: optionalUrl,
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/** Soft validate — missing secrets OK in demo; invalid formats throw */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("[env]", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  cached = parsed.data;
  return cached;
}

export function envFlags() {
  const e = getServerEnv();
  return {
    supabase: Boolean(
      e.NEXT_PUBLIC_SUPABASE_URL &&
        e.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !e.NEXT_PUBLIC_SUPABASE_URL.includes("xxxx"),
    ),
    grow: Boolean(e.GROW_API_KEY),
    resend: Boolean(e.RESEND_API_KEY),
    twilio: Boolean(e.TWILIO_ACCOUNT_SID && e.TWILIO_AUTH_TOKEN),
    morning: Boolean(e.MORNING_API_KEY),
  };
}
