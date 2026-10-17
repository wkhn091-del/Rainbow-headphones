import "server-only";

import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function getEmailFrom() {
  return process.env.RESEND_FROM ?? "Nexa Audio <onboarding@resend.dev>";
}
