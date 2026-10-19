# -*- coding: utf-8 -*-
from pathlib import Path
from pypdf import PdfReader

path = Path(r"C:\Users\user\OneDrive\Desktop\לקוחות שלי\תוספות לאתרים\motion-of-millions-book.pdf")
out = Path(r"C:\Users\user\_docs\my_file\nexa-audio\docs\MOTION_OF_MILLIONS_EXTRACT.md")
out.parent.mkdir(parents=True, exist_ok=True)

r = PdfReader(str(path))
title = (r.metadata.title if r.metadata else "") or ""
parts = [f"# Motion of Millions extract\n\nPages: {len(r.pages)}\nTitle: {title}\n"]

# Cover/TOC + intro chapter samples + tier intros + key E patterns
idxs = (
    list(range(0, 35))
    + list(range(40, 55))
    + [60, 70, 90, 110, 140, 170, 200, 230, 260]
    + list(range(280, 295))
    + list(range(408, 420))
    + [450, 490, 497, 510, 540]
)
seen: set[int] = set()
pages: list[int] = []
for i in idxs:
    if 0 <= i < len(r.pages) and i not in seen:
        seen.add(i)
        pages.append(i)

for i in pages:
    t = (r.pages[i].extract_text() or "").strip()
    parts.append(f"\n\n## Page {i+1}\n\n{t}\n")

text = "".join(parts)
out.write_text(text, encoding="utf-8")
print(f"wrote {out} ({len(text)} chars, {len(pages)} pages)")
