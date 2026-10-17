# Design Tokens — **Silent Gallery** (יוקרה = איפוק)

מקור: עדכון 2026-10-16 · נפסלו ניאון, טיטניום־קר, ושמפניה־תבנית.  
פלטה: שחור גלריה + bone חם `#D8D6D2` + CTA לבן נקי — השראה Apple Product / Aesop / high-end editorial.

---

## צבע

| Token | Hex | שימוש |
|-------|-----|--------|
| `--color-bg` | `#0C0C0C` | רקע עמוד |
| `--color-surface` | `#161616` | משטחים |
| `--color-border` | `#2A2A2A` | מסגרות דקות |
| `--color-accent` | `#D8D6D2` | focus · לייבל · הדגשה שקטה |
| `--color-accent-dim` | `#9C9A96` | משני |
| `--color-text` | `#F2F1EF` | טקסט |
| `--color-text-muted` | `#9C9A96` | משני |
| `--color-text-faint` | `#6A6864` | רמזים |
| `--color-buy` | `#FFFFFF` | CTA ראשי בלבד |
| `--color-buy-text` | `#0C0C0C` | טקסט על CTA |
| `--color-danger` | `#D4786A` | שגיאות |

**חוק:** בלי glow · בלי זהב · רדיוס קטן · צל מינימלי.

---

## טיפוגרפיה

| Token | ערך |
|-------|------|
| `--font-display` / `--font-body` | **IBM Plex Sans Hebrew** — UI · כותרות · פסקאות |
| `--font-mono` | **IBM Plex Mono** — SKU · EXP% · מדידה · קופון |

### סקאלה (מובייל → דסקטופ)

| Token | Mobile | Desktop | Line-height | משקל | שימוש |
|-------|--------|---------|-------------|------|--------|
| `text-display` | 2.5rem | 4rem | 1.05 | 700 | H1 Hero |
| `text-title` | 1.75rem | 2.25rem | 1.15 | 600 | H2 מקטע |
| `text-lead` | 1.125rem | 1.25rem | 1.55 | 300 | משפט תמיכה Hero |
| `text-body` | 1rem | 1rem | 1.6 | 400 | פסקאות |
| `text-sm` | 0.875rem | 0.875rem | 1.5 | 400 | ספקים · FAQ |
| `text-xs` | 0.75rem | 0.75rem | 1.4 | 500 | labels · tracking |
| `text-price` | 1.25rem | 1.5rem | 1.2 | 600 | מחיר |

Tracking: display `-0.03em` · labels `0.16em` uppercase על מטא בלבד.

---

## רווחים

| Token | ערך |
|-------|------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 48px |
| `space-8` | 64px |
| `space-9` | 96px |
| `space-section` | 120px (דסקטופ) / 72px (מובייל) |

---

## רדיוס / צל / מסגרת

| Token | ערך | שימוש |
|-------|-----|--------|
| `radius-sm` | 4px | inputs |
| `radius-md` | 8px | כפתורים · glass panels |
| `radius-lg` | 12px | מודאלים |
| `radius-full` | 9999px | swatches בלבד |
| `shadow-none` | — | ברירת מחדל יוקרה = בלי צל רך |
| `shadow-accent-focus` | `0 0 0 1px #0C0C0C, 0 0 0 2px #D8D6D2` | focus נגיש |
| `border-hairline` | 1px solid `#2A2C33` | |

Glass: `background: color-mix(in srgb, #121316 85%, transparent)` · `backdrop-filter: blur(10px)` · border hairline.

---

## תנועה (יישור מקדים ל-א'-3)

| Token | משך | Easing |
|-------|-----|--------|
| `motion-instant` | 100ms | — |
| `motion-fast` | 180ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `motion-base` | 280ms | אותו |
| `motion-slow` | 500ms | אותו |
| `ease-out` | — | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `ease-in` | — | `cubic-bezier(0.7, 0, 0.84, 0)` |

Hero LCP (מותג, מחיר, CTA): **בלי** opacity:0 בכניסה. Explode = scrub בלבד.

---

## Breakpoints

| Token | ערך |
|-------|------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

עיצוב ראשון: **375px**.
