# מודול א'-3 — מפת תנועה «אולפן קר»

סטאטוס: **נעול כמומלץ** (2026-10-16 · ריצה מחדש סקריפט 1.3)

---

## שלב 1 — תחקיר (נעול)

| קבוצה | החלטה |
|--------|--------|
| 1 · אופי | **שקט ויוקרתי** — קצה איטי · **בלי spring** |
| 2 · רגע חתימה | **Explode + סיבוב בגלילה (GSAP scrub)** → CTA · «דלגו לרכישה» תמיד |
| 3 · נכסים | אין וידאו/Lottie · Typography · Placeholder 3D עד GLB נאמן |

---

## שלב 2 — טוקני תנועה (ב-`globals.css`)

| Token | ערך | שימוש |
|-------|-----|--------|
| `--motion-instant` | 100ms | hover צבע · press |
| `--motion-fast` | 180ms | כפתורים · swatches |
| `--motion-base` | 280ms | מגירה · באנר עוגיות |
| `--motion-slow` | 500ms | חשיפת מקטע מתחת לקיפול |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | כניסות |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | יציאות |
| `spring` | **לא בשימוש** | — |

ספריות: CSS מיקרו · **GSAP + ScrollTrigger רק Hero explode** · בלי pin ששובר לייאוט (scrub בלבד).

---

## שלב 3 — מפת תנועה

### Tier 1

| אלמנט | טריגר | תפקיד | טוקן | reduced-motion |
|--------|--------|--------|------|----------------|
| כפתור hover/press | pointer | משוב | instant · scale 0.97 | בלי scale |
| הוספה לסל | click | משוב | fast · מונה + pulse קצר | מונה בלי pulse |
| מגירת סל | open | התמצאות | base · מ-`inset-inline-end` (שמאל פיזי ב-RTL) | open בלי slide |
| Sticky CTA | IO | התמצאות | base | מופיע מיד |
| באנר עוגיות | load | התמצאות | base | סטטי |
| חשיפת מקטע מתחת לקיפול | scroll once | התמצאות | slow · ≤16px | מיידי |
| שגיאת שדה | invalid | משוב | instant | outline בלבד |

### Tier 2–3 Hero

| אלמנט | טריגר | תפקיד | טוקן | reduced-motion |
|--------|--------|--------|------|----------------|
| Poster → Canvas | mount | התמצאות | — | Poster נשאר |
| צבע Material | swatch | הסבר | base | מיידי |
| Explode scrub | scroll | חתימה + הסבר | GSAP scrub 0.7 · **בלי pin** | explode קבוע ~20% |
| «דלגו לרכישה» | תמיד | התמצאות | — | אותו |

### אסור

הקלדת H1 · סמן מותאם · glow אינסופי · preloader חוסם · spring · GSAP מחוץ ל-Hero

---

## שלב 4 — בדיקות

- [ ] reduced-motion: אתר מלא  
- [ ] מקלדת: פוקוס נשמר  
- [ ] אין אנימציה שלא במפה  
- [ ] Lighthouse ΔLCP (אחרי סביבת פרוד)

**א'-3 = סגור לתחקיר + טוקנים בקוד.** חתימת explode חיה ב-Hero.
