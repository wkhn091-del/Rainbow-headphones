import { z } from "zod";

export const preorderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z
    .string()
    .trim()
    .min(9)
    .max(20)
    .refine((p) => /^(?:\+972|972|0)?5\d{7,8}$/.test(p.replace(/[\s\-]/g, "")), "phone"),
  color: z.enum(["titanium", "obsidian", "ice"]),
  /** Honeypot — bots fill this; humans leave empty */
  company: z.string().max(80).optional().default(""),
});

export type PreorderInput = z.infer<typeof preorderSchema>;
