import "server-only";
import { getServerEnv } from "@/lib/env/server";

/** Twilio SMS — stubs when keys missing */
export async function sendSms(toE164: string, body: string): Promise<boolean> {
  const e = getServerEnv();
  if (!e.TWILIO_ACCOUNT_SID || !e.TWILIO_AUTH_TOKEN || !e.TWILIO_FROM_NUMBER) {
    console.info("[sms:stub]", { toLen: toE164.length, bodyLen: body.length });
    return false;
  }

  const auth = Buffer.from(
    `${e.TWILIO_ACCOUNT_SID}:${e.TWILIO_AUTH_TOKEN}`,
  ).toString("base64");

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${e.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: toE164,
          From: e.TWILIO_FROM_NUMBER,
          Body: body.slice(0, 320),
        }),
      },
    );
    if (!res.ok) {
      console.error("[sms:twilio]", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sms]", err instanceof Error ? err.message : "fail");
    return false;
  }
}
