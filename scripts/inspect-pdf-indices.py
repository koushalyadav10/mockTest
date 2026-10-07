import fitz
import sys

# Set utf-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

print("=====================================================")
print("INSPECTING NEETU SINGH ENGLISH VOL 1 TABLE OF CONTENTS")
print("=====================================================")
doc1 = fitz.open(r"C:\Users\hp\Downloads\Neetu singh English Vol. 1.pdf")
print("Page count:", len(doc1))
toc_page = doc1[5].get_text("text")
for line in toc_page.splitlines():
    if line.strip():
        print(line.strip())
doc1.close()

print("\n=====================================================")
print("INSPECTING BRAHMASTRA STATIC GK TABLE OF CONTENTS")
print("=====================================================")
doc_gk = fitz.open(r"C:\Users\hp\Downloads\BRAHMASTRA Static GK English Medium PDF- APNA-PDF.IN.pdf")
print("Page count:", len(doc_gk))
toc_gk = doc_gk.get_toc()
print(f"Total embedded TOC chapters: {len(toc_gk)}")
for item in toc_gk[:30]:
    print(f"Level {item[0]}: {item[1]} -> Page {item[2]}")
doc_gk.close()
