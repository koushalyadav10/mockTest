import fitz
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc1 = fitz.open(r"C:\Users\hp\Downloads\Neetu singh English Vol. 1.pdf")
# Tense: PDF pages 31 to 46 (Book pp. 25-40)
tense_text = ""
for p in range(30, 46):
    tense_text += doc1[p].get_text("text") + "\n---PAGE BREAK---\n"

print("Tense text total characters:", len(tense_text))

# Let's inspect where the practice questions start in Tense
spotting_match = re.search(r'SPOTTING THE ERROR[\s\S]*?(?=---PAGE BREAK---)', tense_text, re.I)
if spotting_match:
    print("Found Spotting the Errors section:")
    print(spotting_match.group(0)[:500])

# Let's inspect where Answer Keys start
ans_match = re.search(r'ANSWERS?[\s\S]{1,200}EXPLANATION', tense_text, re.I)
if ans_match:
    print("\nFound Answers & Explanations:")
    print(ans_match.group(0)[:400])

doc1.close()
