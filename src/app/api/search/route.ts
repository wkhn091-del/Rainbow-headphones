import { NextResponse } from "next/server";
import { z } from "zod";
import { getSearchableCatalog } from "@/lib/search/catalog-index";
import { rankHits } from "@/lib/search/match";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit";

const querySchema = z.object({
  q: z.string().trim().min(1).max(64),
});

export async function GET(request: Request) {
  if (!(await enforceRateLimit(`search:${clientIp(request)}`, 40, 60_000))) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ q: searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ results: [] });
  }

  const results = rankHits(parsed.data.q, getSearchableCatalog()).slice(0, 8);
  return NextResponse.json({
    results: results.map((r) => ({
      sku: r.sku,
      nameHe: r.nameHe,
      nameEn: r.nameEn,
      priceIls: r.priceIls,
      href: r.href,
      swatch: r.swatch ?? null,
      kind: r.kind,
    })),
  });
}
