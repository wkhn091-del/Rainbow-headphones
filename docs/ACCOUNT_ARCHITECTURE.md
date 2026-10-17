# מודול ב'+ג' — אזור אישי ו-Auth (Nexa Audio)

עודכן: 2026-10-16 · סקריפט 1

## החלטות נעולות

| נושא | החלטה |
|------|--------|
| Auth | **Supabase Auth** · Google + OTP SMS (Twilio) |
| Checkout | **Guest קודם** · חשבון נפתח אחרי תשלום (מייל magic link) |
| לשוניות | הזמנות · מעקב משלוח · אחריות דיגיטלית · כתובות · הגדרות |
| Wishlist | **לא** בשלב השקה |
| Reorder | **כן** · מוסיף מזהים לעגלה · מחיר מחושב בשרת |
| DB | Supabase (לא Sanity) · סינון לפי `user_id` בשרת בלבד |
| Cache | `Cache-Control: private, no-store` על `/account/*` |
| Order IDs | `nanoid` ציבורי · לא רץ סדרתי |

## נתיבים

| נתיב | גישה | בדיקת בעלות |
|------|------|-------------|
| `/login` | ציבורי | — |
| `/auth/callback` | ציבורי | OAuth code exchange |
| `/account` | מחובר | session |
| `/account/orders` | מחובר | `orders.user_id = auth.uid()` |
| `/account/orders/[publicId]` | מחובר / טוקן אורח | user_id או guest token |
| `/account/tracking` | מחובר | דרך הזמנות בבעלות |
| `/account/warranty` | מחובר | דרך הזמנות בבעלות |
| `/account/addresses` | מחובר | `addresses.user_id` |
| `/account/settings` | מחובר | עצמי · step-up לשינוי מייל/טלפון |

## סכמת DB (תמצית)

ראה `supabase/schema.sql`: `profiles`, `orders`, `order_items`, `addresses`, `warranties`, `shipments`.

## Zustand (לקוח)

רק: `userId`, `displayName`, `avatarUrl` — בלי PII רגיש, בלי מחירים.