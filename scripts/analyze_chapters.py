import re
import sys

# Import from scripts/chapters-map.py
sys.path.insert(0, ".")
from scripts.chapters_map import CHAPTERS

total_q_pages = 0
for c in CHAPTERS:
    start, end = map(int, c['book_q_pages'].split('-'))
    pages = end - start + 1
    total_q_pages += pages
    print(f"{c['num']:2d}. {c['name']:<25} | Qs: {c['q_count']:3d} | Book Pages: {c['book_q_pages']} ({pages:2d} pages) | Ans Page: {c['book_ans_page']}")

print("="*60)
print(f"Total Chapters: {len(CHAPTERS)}")
print(f"Total Questions: {sum(c['q_count'] for c in CHAPTERS)}")
print(f"Total Question Pages: {total_q_pages} pages")
