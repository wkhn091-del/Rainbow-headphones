# Nexa Audio — מודול א' שלב 2: ארכיטקטורה (לאישור)

סטאטוס: ממתין לאישור אבישי לפני מודול א'-2  
מקור אמת מוצרים/מלאי/קופונים: **Supabase** (סטייה מתועדת מ-Sanity שבסקריפט 1)  
Sandbox localhost קיים: מנותק · בנייה רשמית רק אחרי א'-2 · א'-3 · 3D

---

## 1. סטאק

| שכבה | בחירה |
|------|--------|
| App | Next.js App Router · TypeScript · Tailwind · Vercel |
| State לקוח | Zustand (מזהים + כמויות בלבד) |
| DB / Auth | Supabase (Postgres + Auth + Edge Functions + RLS) |
| תשלום | Grow headless (מועדף) / Stripe · Bit · Apple Pay · Google Pay |
| מייל | Resend + React Email |
| SMS | Twilio |
| חשבוניות | Morning |
| התראות צוות | Slack או Discord webhook |
| אנליטיקס | GA4 + Meta Pixel + Clarity — רק אחרי Cookie Consent |
| 3D | R3F + Drei · GSAP ScrollTrigger רק ב-Hero (Tier 3 יחיד) |
| i18n | `/` = he · `/en` = en · next-intl או מקבילה App Router |

---

## 2. סכמות Supabase (ליבה)

### `products`
id · sku · type (`flagship` \| `accessory` \| `bundle`) · name_he · name_en · slug · price_ils · active · metadata jsonb

### `product_variants`
id · product_id · color_id · sku_suffix · stock_launch · stock_live · sold_out · waitlist_enabled

### `colors`
id · key (`titanium` \| `obsidian` \| `ice`) · name_he · name_en · hex

### `coupons`
code · percent · applies_sku · max_uses_global · max_per_customer · valid_from · valid_until · launch_units_cap · active

### `orders` / `order_items`
server-priced totals · coupon_applied · hard_case_granted · shipping_ils · tracking_number · status · user_id · locale

### `waitlist`
variant_id · email · phone · notified_at · created_at

### `serials` / `warranties`
serial · order_item_id · user_id · nfc_scanned_at · warranty_starts_at · warranty_ends_at

### `preorder_signups` (Early Access)
email · phone · name · coupon_issued · access_token_hash

RLS: קריאה ציבורית למוצרים פעילים ומלאי תצוגה; כתיבת הזמנות/סיריאלים רק דרך service role בשרת.

---

## 3. עגלה ומנוע מבצעים

**לקוח (Zustand):** `{ items: [{ variantId, qty }], couponCode? }` — בלי מחירים סופיים.

**שרת (Source of Truth):**
1. טוען מחירים + מלאי מ-Supabase  
2. מאמת מקס 2 יחידות flagship בהזמנה  
3. `LAUNCH15`: 15% על **זוג ראשון בלבד** · נרתיק רק אז · חד-פעמי למייל/לקוח · בתוך 7 ימים מקישור Early Access או עד 300  
4. משלוח: 0 אם subtotal ≥ 500 · אחרת 39  
5. מארז אולפן: `active` אוטומטי כשחלון השקה נגמר או stock_launch הכולל = 0  

תצוגה לפני תשלום = אותו חישוב שהשרת יחייב. אם השתנה (מלאי) — מציגים מה השתנה, לא מחייבים בשקט.

---

## 4. מטריצת לוגיקה עסקית (→ Unit + Playwright ב-CI)

| מה הלקוח עושה | מה מצפים | סכום צפוי (דוגמה) | מקרה קצה |
|----------------|-----------|-------------------|----------|
| 1× Pro Titanium + LAUNCH15 | הנחה 15% + נרתיק | 1290 × 0.85 = 1096.5 → עיגול שרת מתועד · משלוח 0 | קופון לא תקף / כבר נוצל |
| 2× Pro + LAUNCH15 | זוג1 בהנחה+נרתיק · זוג2 מלא | 1096.5 + 1290 · משלוח 0 | ניסיון qty=3 → דחייה |
| רק Nexa Link | מחיר מלא · בלי קופון על אביזר | 90 + 39 משלוח | קופון מוזן בכל זאת → מתעלמים מהנחה על אביזר |
| Pro + Dock אחרי השקה כמארז | מארז 1420 אם SKU bundle | 1420 · משלוח 0 | מארז מוסתר בזמן Early Access |
| צבע אזל → Waitlist | Sold Out · טופס מייל+טלפון | — | בלי preorder |
| Tracking הוזן ב-Supabase | SMS "יצא לדרך" + קישור | — | מספר ריק לא שולח SMS |

*(עיגול אגורה: כלל אחד בשרת, מתועד ב-BRIEF אחרי אישור)*

---

## 5. אבטחה

| נושא | כלל |
|------|------|
| מחירים/הנחות/מלאי | רק שרת מול Supabase |
| Secrets | `server-only` · Zod על env · אין NEXT_PUBLIC לסודות |
| קלט | Zod על כל API / Server Action |
| אשראי | לא נשמר אצלנו (Grow/Stripe) |
| PII | הזמנות · משלוח · serial · waitlist ב-Supabase |
| אנליטיקס | נטען רק אחרי הסכמת באנר |
| Routes פרטיים | אזור אישי / admin — בדיקת session בשרת |

---

## 6. ביצועים (Hero 3D)

- Poster/placeholder סטטי ראשון · Canvas lazy · dynamic `ssr: false`  
- תקציב: LCP ≤ 2.5s מובייל · INP ≤ 200ms · עד 2 סצנות WebGL בעמוד (כאן: 1)  
- GA/Pixel/Clarity: async אחרי consent · לא חוסמים 3D  
- prefers-reduced-motion: בלי explode/spin מלא  

---

## 7. שפות

| | he | en |
|--|----|----|
| נתיב | `/` | `/en` |
| dir | rtl | ltr |
| השקה | אלפא + 48ש׳ Early Access | אחרי פתיחה לקהל |
| לוקליזציה | Bit · פייבוקס · משלוח מקומי | Apple/Google Pay · אשראי |

---

## 8. פאנל ניהול (Supabase)

טבלאות + RLS · מסך פנימי מינימלי (או Supabase Studio בעברית מתועדת): מלאי · הזמנות · הזנת Tracking · סריקת NFC/Serial · הפעלת/כיבוי קופון · ייצוא Waitlist.

---

## 9. סדר המשך אחרי אישור המסמך

1. מודול א'-2 — 3 כיווני ארט + מיקרו-קופי + Copy Deck (בלי קוד)  
2. מודול א'-3 — מפת תנועה (בלי קוד)  
3. מודול 3D — תחקיר Tier + תקציב נכסים (בלי קוד)  
4. אישור → ניקוי Sandbox / בנייה רשמית על הארכיטקטורה הזו  

---

**אישור נדרש:** האם מאשרים את ארכיטקטורת שלב 2 כבסיס להמשך א'-2?
