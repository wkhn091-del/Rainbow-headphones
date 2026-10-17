# asset-licenses — Nexa Audio (מודול 3D)

עודכן: 2026-10-16 · אף נכס לא נכנס ל-`/public` לפני סטטוס ירוק / אישור צהוב.

| נכס | קישור מקור | יוצר | רישיון | תאריך | רמזור | שינויים | קרדיט? | הערות |
|-----|------------|------|--------|-------|-------|---------|--------|--------|
| Premium Blueprint geometry | קוד סטודיו | Studio Omek / Nexa | קניין הפרויקט | 2026-10-16 | 🟢 | — | לא | 5 nodes · תווית הדמיה |
| Hero Poster (הדמיה) | רנדר מ-Blueprint | אותו | קניין הפרויקט | טרם נוצר | 🟢 | WebP אופטימיזציה | לא | LCP לפני Canvas |
| Dark Studio lights | קוד Three/R3F | — | קוד | 2026-10-16 | 🟢 | — | לא | בלי HDRI |
| ContactShadows / AdaptiveDpr / PerformanceMonitor | `@react-three/drei` (npm) | pmndrs | MIT (חבילה) | 2026-10-16 | 🟢 | בלי Environment CDN | LICENSE ב-node_modules | אושר לבילד רשמי |
| Draco WASM decoder | [google/draco](https://github.com/google/draco) | Google / Draco Authors | Apache-2.0 | טרם הורדה | 🟢 מאושר · ⏳ הורדה עם GLB | עותק מקומי ב-`/public/draco` | NOTICE/LICENSE בקובץ | אושר עקרונית · יועתק כשמוסיפים GLB |
| `nexa-pro.glb` (stand-in) | `Downloads/beats_studio_3_heaphones.glb` | צד ג׳ (Beats-style) | ❓ לא אומת · שימוש זמני בלבד | 2026-10-16 | 🟡 | tint runtime · בלי Draco עדיין | כן — תווית «הדמיה» | **לא נאמן ל-Nexa** · מחליף Blueprint לפיתוח · חובה GLB לקוח לפני השקה |
| `nexa-pro.glb` (סופי) | לקוח / Blender | Nexa Audio | קניין הלקוח | טרם | ⏳ | Draco + Retopo · 5 nodes | לא | מחליף את ה-stand-in |
| HDRI חיצוני | — | — | — | — | 🔴 לא בשימוש | קונספט 3 דוחה | — | מאושר בלי HDRI |

## נפסלו / לא רלוונטי

| נכס | סיבה |
|-----|------|
| drei `Environment preset="city"` וכו׳ | מושך CDN חיצוני · אסור CSP סקריפט |
| מודל אוזניות גנרי מ-Sketchfab כאילו Nexa | שובר נאמנות מוצר + סיכון מותג צד ג׳ |
| HDRI כבד | נדחה לטובת תאורת קוד |

## צילומי מסך רישוי

תיקייה: `docs/licenses/` — תתווסף בעת הורדת Draco (תאריך בשם הקובץ) אחרי אישור צהוב.
