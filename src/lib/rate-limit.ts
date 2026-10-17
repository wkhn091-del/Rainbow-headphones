/** Soft in-memory rate limit + optional Upstash REST (no SDK). */

const buckets = new Map<string, { n: number; t: number }>();

export function rateLimit(
  key: string,
  max = 40,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now - cur.t > windowMs) {
    buckets.set(key, { n: 1, t: now });
    return true;
  }
  if (cur.n >= max) return false;
  cur.n += 1;
  return true;
}

/**
 * Prefer Upstash when UPSTASH_REDIS_REST_URL + TOKEN set; else memory.
 */
export async function enforceRateLimit(
  key: string,
  max = 40,
  windowMs = 60_000,
): Promise<boolean> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) {
    return rateLimit(key, max, windowMs);
  }

  const redisKey = `rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const incr = await fetch(`${base}/incr/${encodeURIComponent(redisKey)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!incr.ok) return rateLimit(key, max, windowMs);
    const data = (await incr.json()) as { result?: number };
    const n = Number(data.result ?? 0);
    if (n === 1) {
      await fetch(
        `${base}/expire/${encodeURIComponent(redisKey)}/${windowSec}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );
    }
    return n <= max;
  } catch {
    return rateLimit(key, max, windowMs);
  }
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
