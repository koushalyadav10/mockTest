import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc_gk = fitz.open(r"C:\Users\hp\Downloads\BRAHMASTRA Static GK English Medium PDF- APNA-PDF.IN.pdf")
print("=== BRAHMASTRA GK: JAINISM & BUDDHISM (Page 22) ===")
print(doc_gk[21].get_text("text")[:600])

print("\n=== BRAHMASTRA GK: VICEROYS & GOVERNORS (Page 96) ===")
print(doc_gk[95].get_text("text")[:600])
doc_gk.close()
