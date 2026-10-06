import pymupdf
import os

pdf_path = r"C:\Users\hp\Downloads\SSC MATHS Chapterwise 6500+ TCS MCQs - 2nd Edition [English Medium].pdf"
doc = pymupdf.open(pdf_path)

output_dir = r"C:\Users\hp\.gemini\antigravity\scratch\examforge-ai\scratch\pdf_pages"
os.makedirs(output_dir, exist_ok=True)

# Render first 10 pages as png thumbnails or check them
for p in range(min(10, len(doc))):
    page = doc[p]
    pix = page.get_pixmap(dpi=100)
    out_file = os.path.join(output_dir, f"page_{p+1}.png")
    pix.save(out_file)
    print(f"Saved {out_file} (w={pix.width}, h={pix.height})")

print("Done rendering first 10 pages.")
