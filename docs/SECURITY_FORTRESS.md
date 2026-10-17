# סקריפט 3 · מודול א' — חומת אבטחה

עודכן: 2026-10-16 · החלטות מומלצות (שינה)

## תחקיר — נעול

| שאלה | תשובה מומלצת |
|------|----------------|
| PII / תשלום | הזמנות+כתובות ב-Supabase · סליקה **Redirect ל-Grow** (לא כרטיס אצלנו) |
| CMS | Supabase (לא Sanity) · MFA על Dashboard |
| Webhooks | Grow · Morning · Slack/Discord |
| צד ג׳ | GA4, Meta Pixel, Clarity (אחרי הסכמה) · Supabase · next/font · R3F local |
| תשתית | Vercel + GitHub · 2FA חובה · Staging נפרד |

## רמה א' — סטטוס יישום

| # | פריט | סטטוס |
|---|------|--------|
| 1 | Cart integrity / server quote | ✅ `/api/checkout/quote` + `buildQuote` |
| 2 | Webhook Grow signature | ⏳ ממתין מפתחות |
| 3 | CSP Report-Only + headers | ✅ middleware |
| 4 | Rate limit טפסים | ✅ search/preorder/quote (in-memory → Upstash בפרוד) |
| 5 | Input Zod | ✅ |
| 6 | Server Actions origins | ✅ next.config |
| 7 | IDOR / account cache | ✅ private no-store על /account |
| 8 | Session cookies | ✅ Supabase SSR |
| 9 | Env Zod | ✅ `src/lib/env/server.ts` (soft) |
| 10 | Sanity | N/A → Supabase |
| 11 | Payment / coupon server | ✅ quote + LAUNCH15 rule |
| 12 | Cache safety | ✅ |
| 13 | XSS / redirects | ✅ JSON-LD escaped · login next path check |
| 14 | Bot honeypot | ✅ preorder |
| 15 | revalidate + health + ready | ✅ `/api/health` · `/api/ready?secret=` |
| 16 | Supply chain / 2FA | 📋 Handoff — אחריות לקוח |

## מה מגנה / לא מגנה

- **Headers+CSP-RO:** מפחית XSS/clickjacking בתצפית — לא חוסם עדיין (Report-Only).  
- **Quote server:** מונע מחיר מזויף ב-DevTools — לא מחליף Grow webhook.  
- **Rate limit זיכרון:** מספיק ל-dev — לא עומד מול multi-instance בלי Redis.
