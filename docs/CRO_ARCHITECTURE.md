# סקריפט 2 · מודול א' — ארכיטקטורת המרות (Nexa Audio)

עודכן: 2026-10-16 · החלטות = **מומלץ** · ריצה לילית: חיפוש ב-nav · FreeShippingBar · ColdStart מורחב · ראה `SCRIPT2_STATUS.md`

## תחקיר — נעול

| קבוצה | החלטה | למה |
|--------|--------|-----|
| 1 חיפוש | **Backend מותאם** (`/api/search`) · לא Algolia/Meilisearch | קטלוג 3 SKUs · מידתיות · בלי עלות/CSP חיצוני |
| 2 Upsell | **מתחת למוצר** + **ב-Drawer עגלה** | Dock/Link ליד Pro · AOV בלי פופ-אפ לפני תשלום |
| 3 ביקורות | **מודל פנימי ב-Supabase** (תור אישור) · בהשקה: **התחלה קרה** | אין ביקורות מזויפות · Trust = אחריות/החזרה/מלאי אמיתי + איסוף אחרי רכישה |

## חיפוש

- Debounce 200ms · max query 64 תווים · Zod · Rate-limit רך (IP cookie bucket בזיכרון dev)
- Typo: נרמול עברית/EN + `includes` / מרחק פשוט על שם/sku
- Dropdown: תמונה (placeholder צבע) · שם · מחיר משרת · לינק ל-`/shop` או checkout
- מקור: `catalog.ts` עכשיו → Supabase `products` כשיהיה

## Cross-sell

| מקור | הצעה |
|------|--------|
| Nexa Pro 3D | Dock + Link |
| Dock | Pro (אם לא בעגלה) + Link |
| Link | Pro + Dock |
| מארז אולפן | אחרי חלון השקה בלבד |

מחיר תמיד מחושב בשרת בעת checkout — ההמלצה שולחת רק sku/color/qty.

## ביקורות (סכמה — עתיד)

`reviews`: id, product_sku, user_id?, author_name, rating 1–5, body, status pending|approved|rejected, verified_purchase, created_at  
RLS: select approved בלבד · insert authenticated עם status=pending  

**מעל הקיפול עכשיו:** סמן אמון אמיתי — «14 יום החזרה · אחריות שנתיים · 300 יחידות השקה» — לא כוכבים ריקים.

## KPIs (טיוטה · סקריפט 2 חוק 11)

1. המרת Hero→Checkout  
2. AOV  
3. הרשמות Early Access  
4. הקלקות וואטסאפ  
5. נטישת checkout (אחרי Grow)
