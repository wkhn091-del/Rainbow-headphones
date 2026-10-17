import type { SearchHit } from "./catalog-index";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/["'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Very small typo helper — enough for 3 SKUs + Hebrew names */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let prev = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cur =
        a[i] === b[j] ? row[j]! : 1 + Math.min(row[j]!, row[j + 1]!, prev);
      row[j] = prev;
      prev = cur;
    }
    row[b.length] = prev;
  }
  return row[b.length]!;
}

export function rankHits(query: string, items: SearchHit[]): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = items
    .map((item) => {
      const hay = normalize(`${item.nameHe} ${item.nameEn} ${item.sku}`);
      let score = 0;
      if (hay.includes(q)) score += 10;
      if (normalize(item.sku).includes(q)) score += 8;
      if (normalize(item.nameEn).startsWith(q)) score += 6;
      const words = hay.split(" ");
      const best = Math.min(...words.map((w) => editDistance(q, w.slice(0, q.length + 2))));
      if (best <= 1 && q.length >= 3) score += 5;
      if (best <= 2 && q.length >= 4) score += 2;
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.item);
}
