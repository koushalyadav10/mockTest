import sys, sqlite3
sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect("prisma/examforge.db")
c = conn.cursor()
c.execute("""
    SELECT c.chapterNumber, c.title, c.totalQuestions 
    FROM BookChapter c 
    JOIN Book b ON c.bookId = b.id 
    WHERE b.code = 'PINNACLE_SSC_REASONING' 
    ORDER BY c.chapterNumber
""")
chapters = c.fetchall()
print(f"Total Pinnacle Reasoning Chapters: {len(chapters)}")
tot_qs = 0
for ch in chapters:
    print(f"  • Chapter {ch[0]:02d}: {ch[1]} ({ch[2]} Qs)")
    tot_qs += ch[2]
print(f"Total Chapter Questions: {tot_qs}")

c.execute("SELECT COUNT(*) FROM Question WHERE subject = 'Reasoning'")
print(f"Total Reasoning Questions in DB: {c.fetchone()[0]}")
