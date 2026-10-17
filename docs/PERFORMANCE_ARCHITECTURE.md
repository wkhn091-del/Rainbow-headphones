# סקריפט 2 · מודול ב' — ביצועים ונגישות

עודכן: 2026-10-16 · החלטות = **מומלץ** (אושר ע״י «תעשה מה שהכי מומלץ» / שינה)

## תחקיר — נעול

| קבוצה | החלטה | למה |
|--------|--------|-----|
| 1 מורכבות 3D | מודל בגלילה (Explode) + idle spin · Poster ראשון · Draco רק אחרי GLB נאמן+רישוי 🟢 | stand-in כבר מקומי · תקציב ≤2MB |
| 2 State | **Zustand** לעגלה (כבר) · בלי TanStack Query בשלב זה | קטלוג סטטי קטן · מחירים בשרת ב-checkout |
| 3 a11y | **בקוד** · Skip link · ARIA · מקלדת · בלי ווידג׳ט צד־ג׳ | חוק נגישות: ווידג׳ט ≠ ת״י 5568 |

## יעדים מדידים (p75 מובייל)

| מדד | יעד |
|-----|-----|
| LCP | ≤ 2.5s (Poster / next/image) |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| JS ראשוני | ~170KB gzip לעמוד (חריגה מתועדת אם 3D) |

## אסטרטגיית 3D

1. Poster סטטי עם `priority` עד mount לקוח  
2. `next/dynamic(..., { ssr: false })` ל־CanvasMount  
3. `frameloop="demand"` + invalidate ב־spin/explode/צבע  
4. AdaptiveDpr · dpr cap 1.75 · prefers-reduced-motion → בלי pin/spin  
5. נכסים רק מ־`/public` (CSP)

## Cache

| ציבורי | פרטי |
|--------|------|
| קטלוג, shop, FAQ, דף הבית | `/account/*`, checkout quote עם session, עגלה client-only |

## CSP (מודול ב' + סקריפט 3)

`Content-Security-Policy-Report-Only` תחילה · `worker-src 'self' blob:` ל־R3F/Draco · `img-src 'self' data: blob:` · fonts Google אם דרך next/font (self).
