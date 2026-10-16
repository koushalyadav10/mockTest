import glob
import json
import sqlite3
import re

def is_pure_math_expression(txt: str) -> bool:
    if not txt:
        return False
    trimmed = txt.strip()
    # Already wrapped
    if trimmed.startswith('$') and trimmed.endswith('$'):
        return False
    if '$' in trimmed:
        return False
    
    # Must have math indicators: LaTeX backslash, caret powers, roots, plus-minus, fraction
    has_math = bool(re.search(r'\\[a-zA-Z]+|[\^√±]|\b\d+\/\d+\b', trimmed))
    if not has_math:
        return False
    
    # Strip out LaTeX commands: \frac, \sqrt, etc.
    stripped = re.sub(r'\\[a-zA-Z]+', '', trimmed)
    # Long words indicate natural language
    long_words = re.findall(r'[a-zA-Z\u0900-\u097F]{4,}', stripped)
    if long_words:
        return False
    
    # Check balanced braces
    depth = 0
    for ch in trimmed:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        if depth < 0:
            return False
    return depth == 0

def fix_json_files():
    chapter_files = sorted(glob.glob('data/maths_chapters/*.json'))
    total_fixed_options = 0
    files_modified = 0

    for ch_path in chapter_files:
        with open(ch_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        modified = False
        questions = data.get('questions', [])
        for q in questions:
            for opt in q.get('options', []):
                if isinstance(opt, dict) and 'text' in opt:
                    raw_text = opt['text']
                    if is_pure_math_expression(raw_text):
                        opt['text'] = f"${raw_text.strip()}$"
                        total_fixed_options += 1
                        modified = True

        if modified:
            with open(ch_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            files_modified += 1

    print(f"[JSON] Modified {files_modified} files, fixed {total_fixed_options} unwrapped options.")

def fix_sqlite_db():
    db_path = 'prisma/examforge.db'
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute("SELECT id, text FROM QuestionOption")
    rows = cur.fetchall()
    
    fixed_count = 0
    for opt_id, text in rows:
        if text and is_pure_math_expression(text):
            new_text = f"${text.strip()}$"
            cur.execute("UPDATE QuestionOption SET text = ? WHERE id = ?", (new_text, opt_id))
            fixed_count += 1

    conn.commit()
    conn.close()
    print(f"[SQLite DB] Fixed {fixed_count} options in QuestionOption table.")

if __name__ == '__main__':
    fix_json_files()
    fix_sqlite_db()
