# סקריפט 3 · מודול ב' — צ׳קליסט השקה

## החלטות מומלצות

| נושא | החלטה |
|------|--------|
| אחסון | Vercel |
| PWA | **לא** בהשקה (מידתיות) |
| סליקה | Grow headless redirect |
| משלוח | חינם מעל ₪500 · אחרת ₪39 |
| התראות | Resend + Slack webhook |
| Abandoned cart | אחרי 30 יום מההשקה |
| אנליטיקס | GA4 + Meta Pixel + Clarity אחרי הסכמת עוגיות |
| SEO | JSON-LD Product/Org/FAQ · sitemap דינמי אחרי דומיין |
| GBP | אין סניף פיזי · Organization בלבד |
| אתר קיים | אין — ללא 301 map |

## מפתחות שצריך לספק (לקוח)

- [ ] Supabase URL + anon + service role  
- [ ] GROW_API_KEY + GROW_WEBHOOK_SECRET  
- [ ] RESEND_API_KEY + דומיין מאומת (SPF/DKIM/DMARC)  
- [ ] Twilio (אם OTP)  
- [ ] MORNING_API_KEY  
- [ ] SLACK_WEBHOOK_URL  
- [ ] REVALIDATE_SECRET (≥16)  
- [ ] GA4 / Meta / Clarity IDs  
- [ ] דומיין + DNS  
- [ ] ע.מ / ח.פ · טלפון אמיתי · רכז נגישות  

## DNS

SPF · DKIM · DMARC (p=quarantine) · CAA אופציונלי · נעילת דומיין + 2FA

## Go-Live Gate

אין Live לפני: רמה א' אבטחה · פרטי עסק אמיתיים · Grow מחובר · Lighthouse מובייל · npm audit.
