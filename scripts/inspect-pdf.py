import fitz
import sys

pdf_path = r"C:\Users\hp\Downloads\SSC MATHS Chapterwise 6500+ TCS MCQs - 2nd Edition [English Medium].pdf"
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

toc = doc.get_toc()
print(f"TOC entries found: {len(toc)}")
for item in toc[:50]:
    print(item)

# Check text on pages 1 to 15 (Index/Contents)
print("\n--- Inspecting first 15 pages for Table of Contents / Chapter list ---")
for p in range(min(15, len(doc))):
    page = doc[p]
    text = page.get_text().strip()
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if lines:
        print(f"Page {p+1} ({len(lines)} lines):")
        print("\n".join(lines[:10]))
        print("...")
