# Script 1 — סטטוס (כנה)

עודכן: 2026-10-16

## הערכה: ~75% מוכן **בקוד בלי מפתחות** · **No-Go** לחיוב לקוחות

| בלוק | סטטוס | הערה |
|------|--------|------|
| HE RTL Silent Gallery + Hero/Cinema/3D | ✅ קוד | GLB placeholder עד מודל נאמן |
| 360 spin קל + חנות facets | ✅ | |
| Waitlist מייל+טלפון / Sold Out | ✅ | Twilio stub בלי מפתח |
| קופה/מלאי דמו | ✅ | development / ALLOW_DEMO_CHECKOUT |
| Warranty activate shell | ✅ | `/warranty/activate` |
| Morning webhook stub · Order email | ✅ | |
| `/api/stock` · sitemap · robots · ready | ✅ | |
| נגישות תפריט + `/en` stub | ✅ | |
| Rate limit Upstash-ready | ✅ | נופל לזיכרון בלי env |
| CSP Report-Only + `/api/csp-report` | ✅ | Enforce אחרי מדידה |
| Grow / Supabase / מע״מ / טלפון עסק | ❌ ממך | לא בקוד — מפתחות בסוף |

## ממך בסוף (לא חוסם בנייה)

1. Supabase + Grow + Resend + Twilio  
2. מע״מ / טלפון עסק  
3. Upstash (מומלץ לפרוד) · דומיין HTTPS  

`GET /api/ready?secret=$REVALIDATE_SECRET` · `GET /api/health` → `{ ok: true }`
