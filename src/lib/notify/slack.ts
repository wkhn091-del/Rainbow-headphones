import "server-only";
import { getServerEnv } from "@/lib/env/server";

/** Order / lead ping — no-op without SLACK_WEBHOOK_URL */
export async function notifySlack(text: string): Promise<void> {
  const url = getServerEnv().SLACK_WEBHOOK_URL;
  if (!url) {
    console.info("[slack:stub]", { len: text.length });
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 2000) }),
    });
  } catch (err) {
    console.error("[slack]", err instanceof Error ? err.message : "fail");
  }
}
