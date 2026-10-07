import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc2 = fitz.open(r"C:\Users\hp\Downloads\Neetu singh English Vol. 2.pdf")
print("Vol 2 Page count:", len(doc2))

# Check first 15 pages for Index/TOC by OCR
for p in range(1, 10):
    page = doc2[p]
    pix = page.get_pixmap(dpi=150)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    text = pytesseract.image_to_string(img)
    if "CONTENT" in text.upper() or "INDEX" in text.upper() or "CHAPTER" in text.upper() or "SPOTTING" in text.upper():
        print(f"=== Page {p+1} (OCR) ===")
        for line in text.splitlines():
            if line.strip():
                print(" ", line.strip())

doc2.close()
