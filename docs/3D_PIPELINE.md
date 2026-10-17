# שלב 4 — הוראות עיבוד 3D (אחרי אישור נכסים)

## א. עכשיו (בנייה רשמית · Blueprint)

1. אין הורדת מודלים חיצוניים.
2. בקוד: R3F groups בשמות  
   `headband` · `earcups` · `cushions` · `drivers` · `chipboard`
3. תווית UI קבועה: «הדמיה» / `3D Model Placeholder`.
4. Poster: פריים אחד מהסצנה → `public/images/hero-poster.webp` + alt שמציין הדמיה.
5. תאורה: ambient קרה + key + rim `#00F0FF` · בלי `Environment` preset.
6. AdaptiveDpr 1.5 / 2 + PerformanceMonitor.
7. GSAP ScrollTrigger על ה-5 nodes (סיבוב + explode) לפי `MOTION_MAP.md`.

## ב. Stand-in נוכחי (2026-10-16)

1. הועתק ל-`public/models/nexa-pro.glb` מ-`beats_studio_3_heaphones.glb` (~0.25MB · ~8.5k tris · 3 meshes).
2. טעינה: `useGLTF` + tint על `plastic` / `ear_cup` / `chrome_logo`.
3. Explode רך על 3 meshes (עד Retopo ל-5 nodes).
4. תווית «הדמיה» **נשארת** — המודל לא נאמן ל-Nexa · סטטוס רישוי 🟡.
5. לפני השקה: להחליף ב-GLB לקוח אחרי Retopo + אישור רישוי 🟢.

## ג. כשמגיע GLB נאמן מהלקוח

1. Retopology ב-Blender · ≤100k tris.
2. שמות האובייקטים = אותם 5 nodes (או empties שממופים בקוד).
3. ייצוא GLB + Draco.
4. בדיקה ב-[gltf.report](https://gltf.report/) — יעד ≤2MB.
5. `npx gltfjsx public/models/nexa-pro.glb --transform` (אופציונלי) לקבלת JSX + דחיסה.
6. קובץ סופי: `public/models/nexa-pro.glb` (דריסה של ה-stand-in).
7. מחליפים מיפוי explode ל-5 nodes · tint נשאר.
8. מעדכנים Poster מרנדר אמיתי · מסירים/מצמצמים תווית הדמיה רק כשהמודל נאמן למוצר הסופי.

## ד. Draco decoder (רק אחרי אישור 🟡)

1. הורדה מ-release הרשמי של [google/draco](https://github.com/google/draco) (קובצי WASM/JS לדפדפן).
2. שמירה ב-`public/draco/` (מקומי בלבד).
3. העתקת `LICENSE` + NOTICE ל-`docs/licenses/draco-Apache-2.0-<date>/`.
4. צילום מסך עמוד הרישיון → אותה תיקייה.
5. ב-R3F: `useGLTF.setDecoderPath('/draco/')`.

## ה. מה לא עושים

- לא `Environment` מ-CDN  
- לא שלושה GLB לצבעים  
- לא מודל צד ג׳ בלי סימון הדמיה / בלי נאמנות  
