import sqlite3
import os
import re
import sys

def clean_explanation(s):
    if not s:
        return s
    # 1. Normalize line breaks and remove trailing/leading whitespace per line
    lines = [line.strip() for line in s.replace('\r\n', '\n').replace('\r', '\n').split('\n')]
    # 2. Filter empty lines
    non_empty = [l for l in lines if l]
    if not non_empty:
        return ""
    # 3. Intelligent sentence rejoin
    result = []
    for l in non_empty:
        if not result:
            result.append(l)
            continue
        prev = result[-1]
        # Do not merge table lines or display math
        if l.startswith('|') or prev.startswith('|') or l.startswith('$$') or prev.startswith('$$'):
            result.append(l)
            continue
        # Check merge criteria
        should_merge = False
        if prev and not prev.endswith(('.', '!', '?', ':', ';', '|', '।')):
            if prev.endswith('-'):
                result[-1] = prev[:-1] + l
                continue
            elif (
                l[0].islower()
                or l.startswith((')', ']', '}', '='))
                or prev.endswith(('(', '[', '{', '='))
                or prev.split()[-1].lower() in ('and', 'or', 'the', 'is', 'are', 'was', 'were', 'a', 'an', 'of', 'to', 'in', 'for', 'with', 'from', 'as', 'same', 'by', 'that', 'which')
            ):
                should_merge = True
        
        if should_merge:
            result[-1] = prev + ' ' + l
        else:
            result.append(l)
    return '\n'.join(result)

def main():
    db_path = os.environ.get("DB_PATH", "prisma/examforge.db")
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    c.execute("SELECT id, explanation FROM Question WHERE explanation IS NOT NULL")
    rows = c.fetchall()
    print(f"Total questions with explanation: {len(rows)}")

    updated = 0
    for qid, exp in rows:
        cleaned = clean_explanation(exp)
        if cleaned != exp:
            c.execute("UPDATE Question SET explanation = ? WHERE id = ?", (cleaned, qid))
            updated += 1

    conn.commit()
    conn.close()
    print(f"Successfully cleaned and updated {updated} question explanations in {db_path}!")

if __name__ == "__main__":
    main()
