# מודול 3D — Nexa Audio

## קבוצה 1 — תפקיד (מאושר)

| תפקיד | החלטה |
|--------|--------|
| Hero WebGL יחיד | כן · Titanium Slate default |
| קונפיגורטור צבע / Material tint | כן |
| Exploded View בגלילה | כן |
| AR / Virtual Try-On | **לא** |
| רקע אווירה WebGL נוסף | לא |
| Placeholder | מסומן הדמיה עד GLB נאמן |
| תקציב יעד | GLB ≤ ~2MB · ≤ ~100k tris · 60fps מובייל |

---

## קבוצה 2 — נכסים (מאושר)

| נושא | החלטה |
|------|--------|
| מידות / משקל | `[חסר עד אב-טיפוס/GLB]` · טיוטה קופי: ~280 גרם |
| מקור | Blender בלבד · CAD→Retopology לפני GLB |
| Poster LCP | פריים סטטי מ-Placeholder + «הדמיה» |
| Explode nodes (5) | `headband` · `earcups` · `cushions` · `drivers` · `chipboard` |

---

## קבוצה 3 — מכשירי יעד (מאושר)

| נושא | החלטה |
|------|--------|
| קמפיין / QA lead | iPhone 13+ Safari + Android flagship |
| רצפת ביצועים | iPhone 12 / Galaxy S21+ · ≥4GB RAM · WebGL 2.0 |
| מתחת לרף | Fallback: הגבלת אפקטים / FPS · גלילה לא נתקעת |
| AdaptiveDpr | מובייל max 1.5 · דסקטופ max 2 · PerformanceMonitor מוריד DPR ב-drop |
| יעד | ~60fps על הרצפה |

---

## שלב 2 — קונספטי מימוש (ממתינים לאישור כחבילה אחת)

שלושת הקונספטים **משלימים זה את זה** (לא חלופות): Placeholder עכשיו → Draco+tint ב-GLB → תאורת אולפן בלי HDRI כבד.

### קונספט 1 — Premium Blueprint (Placeholder)

| | |
|--|--|
| רעיון | פרימיטיבים (cylinder/torus…) ב-5 nodes קבועים |
| למה מוכר | מאפשר דיוק GSAP/ScrollTrigger לפני GLB · שומר חוק הדמיה |
| נכסים | קוד בלבד · Poster PNG/WebP מרונדר מהסצנה |
| בקוד | R3F groups בשמות ה-nodes · תווית «הדמיה» · neon edge `#00F0FF` עדין |
| משקל | זניח (גיאומטריה פרוצדורלית) |

### קונספט 2 — Draco Tinting (GLB סופי)

| | |
|--|--|
| רעיון | GLB יחיד + Draco · tint runtime ל-3 צבעים |
| למה מוכר | החלפת צבע מיידית בלי 3 הורדות · עומד ב-2MB |
| נכסים | `nexa-pro.glb` (אחרי Retopo) מקומי ב-`/public` |
| בקוד | `useGLTF` · עדכון color/roughness/metalness על materials · אותם 5 node names |
| משקל | יעד ≤2MB אחרי Draco |

### קונספט 3 — Dark Studio Lighting

| | |
|--|--|
| רעיון | 3-point lights · ambient קרה · rim `#00F0FF` עדין · **בלי HDRI כבד** |
| למה מוכר | מונע בליעת Obsidian ברקע `#070708` · חיסכון במשקל/CSP |
| נכסים | אין Environment preset מ-CDN (אסור בסקריפט) |
| בקוד | `ambientLight` + `spot`/`directional` + `point` rim · ContactShadows אופציונלי קל |
| משקל | אפס קבצי HDR |

### מה בונים בקוד במקום להוריד

- Blueprint geometry  
- מערכת tint  
- תאורה  
- Poster generator (screenshot חד-פעמי בפיתוח)  

### נכסים חיצוניים צפויים (שלב 3+ רק אחרי אישור + רמזור)

| נכס | צורך | הערה |
|-----|------|------|
| HDRI | **לא** בקונספט הנוכחי | — |
| GLB מוצר | כן · של הלקוח | נאמנות מוצר · לא מודל צד ג׳ כאילו Nexa |
| Draco decoder | כן · מקומי ב-`/public` | רישוי ייבדק 3.5 |
| טקסטורות PBR חיצוניות | רק אם יידרש אחרי GLB | Poly Haven / ambientCG CC0 |

---

## שלב 2 — קונספטים

**מאושר** 2026-10-16 · חבילה 1+2+3

---

## שלב 3 + 3.5 — רכש ורמזור

מסמך: [`docs/asset-licenses.md`](docs/asset-licenses.md)

| סיכום | |
|--------|--|
| 🟢 | Blueprint · Poster פרויקט · תאורת קוד |
| 🟡 דורש החלטתך | Draco Apache-2.0 · שימוש ב-drei (MIT) בבילד רשמי |
| ⏳ | GLB לקוח |
| 🔴 / לא בשימוש | HDRI · Environment CDN · מודל גנרי כ-Nexa |

---

## שלב 4 — Pipeline

מסמך: [`docs/3D_PIPELINE.md`](docs/3D_PIPELINE.md)

---

## שלב 5 — בדיקות (אחרי בנייה רשמית)

- [ ] משקל GLB מול תקציב  
- [ ] Lighthouse עם/בלי 3D  
- [ ] reduced-motion → Poster  
- [ ] Poster נראה לפני Canvas  
- [ ] CSP בקונסול נקי מ-CDN 3D  
- [ ] קרדיטים אם יש CC-BY  

---

**אישור נדרש עכשיו:**

1. מאשרים 🟡 Draco (Apache-2.0, מקומי) + drei (MIT) לבילד הרשמי?  
2. מאשרים שאין נכסי הורדה נוספים בשלב Blueprint?  
3. מאשרים סגירת מודול 3D ומעבר ל**מודול א׳ שלב 3 — בנייה רשמית** (ניקוי Sandbox / יישום אפיון)?
