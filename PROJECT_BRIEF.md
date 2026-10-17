# PROJECT_BRIEF — Nexa Audio

עודכן: 2026-10-16  
מקור: שאלון אפיון + אישורי לקוח בשיחה  
סטאטוס תהליך: **אלפא / No-Go** · סריקת סקריפט 5: לא כל הסעיפים עברו · ראה `docs/SCRIPT5_AUDIT.md`  
שאריות קריטיות: Grow · Supabase · Resend · OTP · GLB נאמן · ע.מ/טלפון · CSP enforce · Upstash

---

## זהות עסק

| שדה | ערך |
|------|------|
| שם מותג | Nexa Audio |
| מוצר דגל | Nexa Pro 3D |
| סוג עסק | חנות מקוונת (איקומרס) — מוצר דגל + אביזרים |
| שוק | ישראל · פריסה ארצית · אונליין בלבד |
| שפות | עברית ב-`/` · אנגלית ב-`/en` · Hebrew First להשקה · EN אחרי פתיחה לקהל |
| תרגום | טיוטת מכונה + עריכה in-house · Million Words גם ב-EN |
| לוקליזציה | מסר/3D/מפרט זהים · HE: Bit/פייבוקס/משלוח מקומי · EN: Apple/Google Pay + אשראי |
| איש קשר לפרויקט | אבישי |
| מייל | support@nexaaudio.com |
| טלפון / וואטסאפ | Placeholder `050-0000000` עד WhatsApp Business / נתב אמיתי |
| שם משפטי (פיתוח) | Nexa Audio Ltd · ע.מ `[חסר - יושלם לפני השקה]` |
| רכז נגישות | אבישי · פרטי התקשרות להצהרה `[חסר עד לפני השקה]` |
| חשבוניות | **Morning (חשבונית ירוקה)** |
| כתובת | תל אביב (ללא קבלת קהל) |
| שעות מענה | א׳–ה׳ 09:00–17:00 · חנות 24/7 |
| דומיין | אין עדיין (nexaaudio.co.il / nexa-3d.com — לבחירה) |

---

## Tier (מאושר)

| שכבה | החלטה |
|------|--------|
| אתר כללי | **Tier 2** (היברידי) |
| Hero בעמוד הבית | **סצנת Tier 3 אחת** — סיבוב + Exploded View בגלילה (Three.js + GSAP ScrollTrigger) |
| מטרת ה-Tier | ביצועים מהירים + רגע וואו אחד, בלי להעמיס את כל האתר |

---

## מותג וויז׳ואל

| נושא | ערך |
|------|------|
| לוגו | **Typography באַלפא** · SVG רשמי יוחלף ב-Header כשיהיה מוכן |
| מודל 3D | **Blueprint 5 nodes** (headband/earcups/cushions/drivers/chipboard) · תווית «3D Model Placeholder» · GSAP Exploded View · GLB נאמן כשיהיה (`nexa_pro_3d.glb`) |
| גלריית מוצר | רנדרים סטטיים HQ + **Lightweight 360 Spin** |
| רנדרים לפי צבע | רנדר ראשי אחד + Material tinting ב-3D (בלי קבצים כבדים לכל צבע) |
| ארט דיירקשן | **א׳ אולפן קר** · IBM Plex Sans Hebrew + Plex Mono · accent רק על פעיל/חומרה |
| מודל 3D (בנייה) | **Blueprint 5 nodes** (headband/earcups/cushions/drivers/chipboard) עד GLB נאמן · תווית 3D Model Placeholder |
| מסמכי א'-2 | `DESIGN_TOKENS.md` · `MICROCOPY_MAP.md` · `COPY_DECK.md` |

### Color Tokens (Silent Gallery — 2026-10-16)

| Token | Hex | שימוש |
|-------|-----|--------|
| gallery-black | `#0C0C0C` | רקע |
| surface | `#161616` | משטחים |
| border | `#2A2A2A` | מסגרות |
| bone | `#D8D6D2` | accent שקט |
| buy | `#FFFFFF` | CTA ראשי |
| text | `#F2F1EF` | טקסט |

> נפסלו ניאון / טיטניום / שמפניה־תבנית. יוקרה = מונוכרום + איפוק.  
> תמונות: סט documentary `nexa-real-*` · מסומן «הדמיה» עד צילום אמיתי.

### Hero 3D (הנחיות לקוח → יאושרו במודול 3D)

- ברירת מחדל: **Titanium Slate** במרכז המסך
- גלילה: ScrollTrigger · סיבוב עד ~360° + Exploded View (שבב + דרייבר)
- החלפת צבע: עדכון Material חלק, בלי קפיצות רינדור

---

## מוצרים ומחירים (מאושר)

### Nexa Pro 3D — ₪1,290 כולל מע״מ

| צבע | EN | HE |
|------|----|----|
| titanium | Titanium Slate | טיטניום סלייט |
| obsidian | Obsidian Black | אובסידיאן בלאק |
| ice | Ice Cyan | אייס סיאן |

מלאי השקה: 100 לכל צבע · 300 סה״כ  
Serial: לייזר על אלומיניום פנימי + NFC באריזה → הפעלת אחריות דיגיטלית

### אביזרים

| SKU | שם | מחיר | הערות |
|-----|-----|------|--------|
| nexa-dock | Nexa Dock | ₪220 | עמדת טעינה מגנטית אלחוטית · שחור / טיטניום · האוזניות נטענות בהנחה עליה |
| nexa-link | Nexa Link | ₪90 | **כבל USB-C אחד** קלוע 1.5מ · טעינה מהירה + אודיו דיגיטלי למכשיר תומך · אין כניסה אופטית באוזניות |
| nexa-studio-bundle | מארז אולפן | ₪1,420 | אחרי ההשקה (במקום ₪1,510) · אוזניות + Dock |

---

## השקה וקופון (מאושר)

| שדה | ערך |
|------|------|
| קוד | `LAUNCH15` |
| הנחה | 15% על **זוג Nexa Pro 3D אחד בלבד** בהזמנה |
| מקס׳ זוגות בהזמנה | **2** · רק הזוג הראשון בהנחה + נרתיק · השני במחיר מלא |
| Early Access | 48 שעות בלעדיות לנרשמים מראש לפני פתיחה לקהל |
| תוקף הקוד | **7 ימים מלאים** מרגע שליחת הקישור לנרשמים · או גמר 300 יחידות |
| אחרי ההשקה | מחיר מלא · בלי הנחה · בלי נרתיק |
| שימוש | חד-פעמי למייל/לקוח |
| נרתיק קשיח | רק למי שמימש LAUNCH15 על הזוג הראשון · מוגבל ל-300 · אחרי זה הטבה נעצרת |
| קופונים כלליים אחרי השקה | אין — מחיר קשיח |

### מלאי לפי צבע (מאושר)

| מצב | התנהגות UI |
|------|-------------|
| צבע אזל | כפתור → **אזל במלאי / Sold Out** |
| Waitlist | **מייל + טלפון (SMS) חובה** · התראה כשסדרה חוזרת · בלי התחייבות לזמן אספקה |
| אסור | "הזמנה מוקדמת" לצבע שאזל — שומרים בלעדיות/דחיפות של מלאי ההשקה |

### חנות — סינון ומארז (מאושר)

| נושא | החלטה |
|------|--------|
| Facets | קטגוריה + צבע + טווח מחיר בלבד |
| מארז אולפן | מופיע **אוטומטית** אחרי פקיעת 7 ימי ההשקה **או** גמר 300 יחידות |

---

## משפטי ונגישות (חלקי — קבוצה 4)

| נושא | החלטה |
|------|--------|
| עמודים | תקנון + מדיניות פרטיות (קישור בפוטר) |
| תוכן חובה בתקנון | החזרה 14 יום · אחריות שנתיים · תנאי LAUNCH15 · מקס 2 זוגות |
| נגישות | ת״י 5568 רמה AA + WCAG 2.1 · מקלדת · ניגודיות · תפריט נגישות צף |
| סליקה / PCI | פרטי אשראי לא נשמרים אצלנו · Stripe או סליקה מקומית תואמת |
| PII ב-Supabase | הזמנות · משלוח · Serial לאחריות בלבד (לא כרטיסי אשראי) |
| רכז נגישות | אבישי · פרטי הצהרה `[חסר עד לפני השקה]` |
| שם משפטי / ע.מ | Nexa Audio Ltd · ע.מ `[חסר - יושלם לפני השקה]` |
| טלפון | Placeholder `050-0000000` |
| ספק חשבוניות | **Morning (חשבונית ירוקה)** |

---

## לוגיסטיקה, אריזה ו-NFC (מאושר)

| נושא | ערך |
|------|------|
| אריזה | עצמאית בסטודיו/מחסן · בדיקת תקינות · אריזה שחורה יוקרתית |
| סריקת NFC לפני שילוח | כן · אנדרואיד ייעודי במחסן |
| אפקט סריקה | צריבת Serial לחשבון הלקוח באזור האישי + הפעלת אחריות שנתיים |

---

## מסחר ותפעול (מהשאלון)

| נושא | ערך | סטטוס |
|------|------|--------|
| תשלומים | **Grow (Mesh)** מועדף · או Stripe headless · Bit / Apple Pay / Google Pay · Checkout כהה בתוך האתר | חשבון טרם נפתח |
| חשבוניות | Morning (חשבונית ירוקה) | מאושר |
| משלוח | חינם ≥₪500 · מתחת **₪39** · עד 48ש׳ אקספרס | מאושר |
| שליחויות | אריזה בסטודיו · HFD/זיגזג · Tracking ידני ב-Supabase → SMS | מאושר |
| התראת הזמנה | Supabase row + מייל support@ + Slack/Discord (לא WhatsApp עסקי) | מאושר |
| החזרות | 14 יום באריזה מקורית | מאושר |
| אחריות | שנתיים חלופי-עד-הבית | מאושר |
| SMS | **Twilio** (חלופה MessageBird) | מאושר |
| Auth | **Supabase Auth** · Google + OTP SMS (Twilio) | מאושר |
| אזור אישי | הזמנות · מעקב · אחריות · כתובות · הגדרות · **Reorder כן** · בלי Wishlist | **מאושר · מודול ב' בביצוע** |
| אנליטיקס | GA4 + Meta Pixel + Clarity · lazy/async · אחרי הסכמת עוגיות | מאושר |
| באנר עוגיות | חובה · Glass `#121316` בתחתית · חוסם GA/Pixel עד אישור | מאושר |
| מייל / דיוור | **Resend** + React Email · Broadcasts להשקה/Waitlist · Loops אופציונלי בעתיד | מאושר |
| פניות לידים | מייל + Google Sheets | מאושר |
| CMS / מקור אמת | **Supabase** | מאושר |
| עמודים | One-pager בית · חנות · FAQ · אודות | מאושר |

---

## סטאק (יעד — מאושר עם סטייה מתועדת)

Next.js App Router · Tailwind · **Supabase** (במקום Sanity) · Zustand · Vercel  
3D: R3F לפי Tier · GSAP רק לסצנת Hero Tier 3  
Security Baseline של סקריפט 1 חל על כל קוד (מחירים/הנחות/מלאי = אמת בשרת מול Supabase)

| נושא | החלטה |
|------|--------|
| קוד localhost קיים | **Sandbox בלבד** · לא חלק מהבנייה הרשמית |
| בנייה רשמית | רק אחרי אפיון מלא: א'-2 · א'-3 · מודול 3D · ארכיטקטורה — אז ניקוי שולחן ובנייה מחדש |

---

## מיקום בתהליך

### סקריפט 1 (ליבה) — סגור לתחקיר · בנייה חלקית באוויר

| שלב | סטטוס |
|------|--------|
| קליטה → א'-2 → א'-3 → 3D | **סגור** · א'-2 כיוון א׳ · א'-3 MOTION_MAP נעול (ריצה 2026-10-16) |
| א' בנייה / ב' אזור אישי / ג' Auth | **חלקי** · חסר Grow חי · env · OTP · GLB נאמן |

### סקריפט 2 — מנוע המרות / ביצועים / סימולציה

| שלב | סטטוס |
|------|--------|
| מודול א' CRO | **סגור** · חיפוש · עגלה · upsell · cold-start |
| מודול ב' Performance | **סגור** · lazy 3D · loading · a11y skip · `PERFORMANCE_ARCHITECTURE.md` |
| מודול ג' סימולציה | **סגור** · `UX_FRICTION_AUDIT.md` + תיקונים |
| מודול ד' תחרות | **סגור** · `COMPETITOR_MIND_ENGINE.md` + FAQ/why-nexa |

### סקריפט 3 — אבטחה והשקה

| שלב | סטטוס |
|------|--------|
| מודול א' חומה | **חלקי בקוד** · headers/CSP-RO · quote · rate limit · health · `SECURITY_FORTRESS.md` · Grow webhook ממתין |
| מודול ב' השקה | **מסמך** · `LAUNCH_CHECKLIST.md` · JSON-LD · בלי Live |

### סקריפט 4–5

| שלב | סטטוס |
|------|--------|
| מסירה | `docs/HANDOFF.md` |
| ביקורת סופית | `docs/SCRIPT5_AUDIT.md` |

---

## יומן

| תאריך | מה |
|-------|-----|
| 2026-10-16 | קליטת שאלון + אישורי Tier/מחיר/צבעים/קופון |
| 2026-10-16 | נכתב אב-טיפוס Hero מחוץ לסדר הסקריפט — עצירה וחזרה לתהליך |
| 2026-10-16 | מדיניות LAUNCH15 (זוג אחד), מקס 2 בהזמנה, Sold Out+Waitlist, Nexa Link=USB-C בלבד, NFC+אריזה, Early Access 48ש׳ |
| 2026-10-16 | קבוצה 1 סגורה: Supabase · Typography אלפא · Sandbox מנותק מבנייה רשמית |
| 2026-10-16 | קבוצה 2 סגורה: filters · bundle auto · waitlist email+SMS · Color tokens + Hero 3D brief |
| 2026-10-16 | קבוצה 3 סגורה: GLB placeholder · gallery 360 · material tint · מסגרת משפטית/נגישות/PCI |
| 2026-10-16 | קבוצה 4 סגורה: ע.מ חסר · טלפון placeholder · רכז אבישי · Morning |
| 2026-10-16 | קבוצה 5 סגורה: Slack/Discord · משלוח ₪39 · HFD/זיגזג · Twilio SMS |
| 2026-10-16 | קבוצה 6 סגורה: GA4+Pixel+Clarity · Grow · Supabase Auth · cookie glass · Resend |
| 2026-10-16 | קבוצה 7 סגורה: HE root · /en · Hebrew First · localization · תחקיר מודול א' הושלם |
| 2026-10-16 | ארכיטקטורת שלב 2 אושרה · התחלת מודול א'-2 |
| 2026-10-16 | נבחר כיוון א׳ אולפן קר · הועלו טוקנים / מיקרו-קופי / Copy Deck לאישור |
| 2026-10-16 | א'-2 אושר · הועלתה מפת תנועה א'-3 לאישור (`MOTION_MAP.md`) |
| 2026-10-16 | א'-3 אושר · התחלת מודול 3D |
| 2026-10-16 | מודול 3D קבוצה 1: בלי AR · WebGL יחיד · תקציב 2MB/100k |
| 2026-10-16 | מודול 3D קבוצה 2: Blender · Poster הדמיה · 5 nodes · משקל טיוטה 280ג |
| 2026-10-16 | מודול 3D קבוצה 3: iPhone13 QA · רצפה iPhone12/S21 · AdaptiveDpr 1.5/2 |
| 2026-10-16 | מודול 3D שלב 2: Blueprint + Draco tint + Dark Studio lights — לאישור |
| 2026-10-16 | קונספטים 3D אושרו · asset-licenses + 3D_PIPELINE הועלו · ממתין לאישור 🟡 וסגירת מודול |
| 2026-10-16 | מודול 3D נסגר · מאשר הכל · התחלת מודול א׳ שלב 3 בנייה רשמית |
| 2026-10-16 | GLB stand-in מ-Downloads → `public/models/nexa-pro.glb` · useGLTF+tint · הדמיה נשארת · 🟡 |
| 2026-10-16 | מודול ב'+ג': `/account/*` · `/login` · Supabase schema · Reorder API · Guest-first |
| 2026-10-16 | MotionSites Vertex (free) → wash/WA/footer · עמודי shop/faq/about/legal · 3D polish · cookie |
| 2026-10-16 | Hero פסיכולוגי: P21+A23 · הסתרת לוגו צד־ג׳ · Ghost NEXA · טופס מתחת לקיפול · MCP limit CTA |
| 2026-10-16 | מעבר לסקריפט 2 · מודול א' CRO · תחקיר קבוצה 1 |
| 2026-10-16 | סקריפט 2 מודול א': חיפוש מותאם · CartDrawer+upsell · ColdStartTrust · חיבור Hero/Shop/PageShell |
| 2026-10-16 | סקריפטים 2–5 (שינה/מומלץ): Performance · UX audit · Competitor · Security headers/quote · Launch/Handoff/Audit docs |
| 2026-10-16 | CTO: פלטת Cold Steel `#B8C4CE` במקום `#00F0FF` · סימון הדמיה · עדכון DESIGN_TOKENS + globals |
| 2026-10-16 | המשך בנייה: PaymentMethods (Bit/Apple/Google/אשראי) · Lenis גלובלי · MagneticCursor דסקטופ · Grow slot |
| 2026-10-16 | Analytics consent-gated (GA4/Clarity/Pixel) · KPIs · Grow session+webhook API · initCheckout→redirect |
| 2026-10-16 | Noir Champagne `#C4A574` · 6 תמונות premium חדשות · סימון הדמיה |
| 2026-10-16 | Silent Gallery + documentary images · HomeNav · footer/copy/OG polish |
| 2026-10-16 | זיכרון לקוח: viewed + last search · CheckoutOutcome paid/cancel · purchase track |
| 2026-10-16 | No-Go מאושר: Grow HMAC · business env · webhook stock release · SCRIPT5_AUDIT מעודכן |
