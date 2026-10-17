"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  serial: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .transform((s) => s.toUpperCase()),
  email: z.string().trim().email().max(254).transform((e) => e.toLowerCase()),
});

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

/**
 * Bind serial → warranty. Demo OK without Supabase.
 */
export async function activateWarranty(input: {
  serial: string;
  email: string;
}): Promise<ActionResult<{ message: string; demo?: boolean }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Serial או מייל לא תקינים", code: "invalid" };
  }

  const admin = createAdminClient();
  if (!admin) {
    console.info("[warranty:demo]", {
      serialLen: parsed.data.serial.length,
    });
    return {
      ok: true,
      data: {
        message:
          "סימולציה: האחריות תירשם כש-Supabase חי. שמרו את ה-Serial באריזה.",
        demo: true,
      },
    };
  }

  const { error } = await admin.from("warranties").upsert(
    {
      serial: parsed.data.serial,
      email: parsed.data.email,
      activated_at: new Date().toISOString(),
      years: 2,
    },
    { onConflict: "serial" },
  );

  if (error) {
    console.error("[warranty]", error.code);
    return { ok: false, error: "לא הצלחנו להפעיל. נסו שוב.", code: "db" };
  }

  return {
    ok: true,
    data: { message: "האחריות הופעלה ל־24 חודשים · מופיעה באזור האישי." },
  };
}
