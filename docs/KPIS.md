# KPIs — Nexa Audio Launch

מקור: סקריפט 1 · לולאת מדידה · 5 KPIs  
כלי: GA4 (אירועים) · Microsoft Clarity (מפות חום) · Meta Pixel (אופציונלי)

נטענים **רק** אחרי `nexa_cookie_consent=accepted`.

| KPI | Event | יעד |
|-----|--------|-----|
| השלמת סינמה בגלילה | `scroll_cinema_complete` | ≥45% מהסשנים |
| לחיצה על לתשלום | `buy_cta_click` | ≥8% מהמבקרים |
| התחלת Checkout | `begin_checkout` | ≥50% מלחיצות CTA |
| רכישה | `purchase` | Conversion ≥2% |
| Early Access | `generate_lead` | ≥120 לידים/שבוע לפני פתיחה |

## הגדרה ב-.env

```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
NEXT_PUBLIC_META_PIXEL_ID=xxxxxxxxxx
```

## Clarity

מפות חום + session replay — פרויקט חדש ב־clarity.microsoft.com, הדביקו את ה־Project ID.
