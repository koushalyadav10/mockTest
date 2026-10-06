import pymupdf
import os
import sys

sys.path.insert(0, ".")
from scripts.chapters_map import CHAPTERS

doc = pymupdf.open(r"C:\Users\hp\Downloads\SSC MATHS Chapterwise 6500+ TCS MCQs - 2nd Edition [English Medium].pdf")

out_dir = r"scratch/ans_keys"
os.makedirs(out_dir, exist_ok=True)

print(f"Checking answer key pages for all {len(CHAPTERS)} chapters...")

for c in CHAPTERS:
    book_ans_p = c["book_ans_page"]
    pdf_p = book_ans_p + 11  # 0-indexed: Book page 1 is PDF index 12 (book_p + 11)
    if pdf_p < len(doc):
        page = doc[pdf_p]
        # render a small preview
        pix = page.get_pixmap(dpi=60)
        img_name = f"ch_{c['num']:02d}_ans_p{book_ans_p}.png"
        pix.save(os.path.join(out_dir, img_name))
        print(f"Ch {c['num']:2d} ({c['name']}): Book p.{book_ans_p} -> PDF index {pdf_p} saved ({pix.width}x{pix.height})")
    else:
        print(f"Ch {c['num']:2d}: Out of range (pdf_p={pdf_p}, total={len(doc)})")
