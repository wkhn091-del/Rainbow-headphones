import { z } from "zod";

export const waitlistEmailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((e) => e.toLowerCase());

/** Israeli mobile — 05X… or +9725… */
export const waitlistPhoneSchema = z
  .string()
  .trim()
  .transform((p) => p.replace(/[\s\-()]/g, ""))
  .refine(
    (p) => /^(?:\+972|972|0)5\d{8}$/.test(p),
    "מספר נייד לא תקין",
  )
  .transform((p) => {
    if (p.startsWith("+972")) return p;
    if (p.startsWith("972")) return `+${p}`;
    return `+972${p.slice(1)}`;
  });

export const waitlistInputSchema = z.object({
  email: waitlistEmailSchema,
  phone: waitlistPhoneSchema,
  colorId: z.enum(["titanium", "obsidian", "ice"]).optional(),
  reason: z.enum(["early_access", "sold_out"]).default("early_access"),
});

export type WaitlistInput = z.infer<typeof waitlistInputSchema>;
