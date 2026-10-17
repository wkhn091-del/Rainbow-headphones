# פריסה — Nexa Audio (Vercel + Supabase)

סטאק מאושר: Next.js על Vercel · מקור אמת Supabase (לא Sanity).

## 1. Vercel

1. חברו את הריפו / העלו את תיקיית `nexa-audio`.
2. Framework Preset: Next.js · Root Directory: `nexa-audio` (אם מונורפו).
3. Build: `npm run build` · Output: ברירת מחדל של Next.
4. Domain: `nexaaudio.co.il` או `nexa-3d.com` (אחרי רכישה).

## 2. משתני סביבה (דוגמה — לא להכניס סודות ל-NEXT_PUBLIC)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
GROW_API_KEY=
MORNING_API_KEY=
SLACK_WEBHOOK_URL=
# או DISCORD_WEBHOOK_URL=
```

אימות עם Zod בעליית שרת לפני חיבור אמיתי (שלב הבא).

## 3. Supabase

1. פרויקט חדש · אזור קרוב לישראל אם זמין.
2. הרצת `supabase/schema.sql` (profiles, orders, addresses, warranties, shipments + RLS).
3. Auth → Providers: Google + Phone (Twilio). Redirect URL: `{SITE}/auth/callback`.
4. RLS: הזמנות/כתובות רק לפי `auth.uid()` · כתיבת הזמנות ב-service role מהשרת.
5. Edge Function להתראת הזמנה → Slack/Discord + Resend.
6. מקומית: העתיקו `.env.example` → `.env.local`. בלי מפתחות האתר רץ במצב דמו של `/account`.

## 4. CSP (טיוטה)

אחרי חיבור אנליטיקס — באנר עוגיות לפני GA/Pixel/Clarity.  
נכסי 3D רק מ-`/public` (אין Environment CDN).

## 5. בדיקות לפני Go-Live

- [ ] Lighthouse מובייל עם/בלי 3D  
- [ ] prefers-reduced-motion → Poster  
- [ ] Poster לפני Canvas  
- [ ] קופון LAUNCH15 על זוג ראשון בלבד (Unit + Playwright)  
- [ ] פרטי עסק / טלפון / ע.מ אמיתיים במקום placeholders  
