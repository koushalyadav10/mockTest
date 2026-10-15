import sqlite3
import json
import os
import glob
import sys
import uuid

sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = "data/maths_chapters"
DB_PATH = "prisma/examforge.db"

conn = sqlite3.connect(DB_PATH, timeout=60)
conn.execute("PRAGMA busy_timeout = 60000;")
conn.execute("PRAGMA journal_mode = WAL;")
c = conn.cursor()

print("================================================================================")
print("SYNCHRONIZING ALL 30 OFFLINE CHAPTER JSON FILES INTO EXAMFORGE DATABASE")
print("================================================================================")

json_files = sorted(glob.glob(os.path.join(DATA_DIR, "chapter_*.json")))
print(f"Found {len(json_files)} offline chapter JSON files.\n")

grand_total_synced = 0

for jf in json_files:
    with open(jf, "r", encoding="utf-8") as f:
        data = json.load(f)

    ch_num = data["chapterNumber"]
    ch_code = data["chapterCode"]
    title_en = data["chapterTitleEnglish"]
    questions = data["questions"]
    total_q = len(questions)

    # 1. Lookup ExamConfig
    c.execute("SELECT id, documentId, totalQuestions FROM ExamConfig WHERE code = ? OR code LIKE ?", (ch_code, f'SSC_MATHS_CH_{ch_num:02d}_%'))
    row = c.fetchone()
    if not row:
        print(f"⚠ ExamConfig for {ch_code} (Ch {ch_num:02d}) not found, skipping...")
        continue

    exam_id, doc_id, cur_total = row

    # Ensure ExamConfig has correct totalQuestions and no shuffling
    c.execute("""
        UPDATE ExamConfig 
        SET totalQuestions = ?, questionShuffle = 0, optionShuffle = 0 
        WHERE id = ?
    """, (total_q, exam_id))

    # 2. Get existing questions for this documentId
    c.execute("SELECT id, questionNumber FROM Question WHERE documentId = ? ORDER BY questionNumber ASC", (doc_id,))
    existing_qs = c.fetchall()

    # Pre-fetch existing options
    c.execute("""
        SELECT id, questionId, label 
        FROM QuestionOption 
        WHERE questionId IN (SELECT id FROM Question WHERE documentId = ?)
        ORDER BY questionId, label ASC
    """, (doc_id,))
    opt_rows = c.fetchall()

    from collections import defaultdict
    q_to_opts = defaultdict(dict)
    for oid, qid, lbl in opt_rows:
        q_to_opts[qid][lbl.strip().upper()] = oid

    q_updates = []
    opt_updates = []
    q_inserts = []
    opt_inserts = []

    for idx, q_data in enumerate(questions):
        qnum = q_data["questionNumber"]
        qtext = q_data["questionText"]
        theader = q_data.get("typeHeader", title_en)
        shift = q_data.get("examShift", "SSC CGL / CHSL / CPO")
        cor_lbl = q_data["correctOption"].strip().upper()
        sol = q_data.get("solution", "")
        options = q_data["options"]

        has_vis = 1 if q_data.get("hasVisualContent") else 0
        img_url = q_data.get("imageUrl")

        if idx < len(existing_qs):
            # Update existing Question
            qid = existing_qs[idx][0]
            q_updates.append((qnum, qtext, theader, theader, shift, cor_lbl, sol, has_vis, img_url, qid))

            # Update options
            existing_opt_dict = q_to_opts.get(qid, {})
            for opt in options:
                lbl = opt["label"].strip().upper()
                otext = opt["text"]
                is_c = 1 if lbl == cor_lbl else 0
                if lbl in existing_opt_dict:
                    opt_updates.append((otext, is_c, existing_opt_dict[lbl]))
                else:
                    new_opt_id = str(uuid.uuid4())
                    opt_inserts.append((new_opt_id, qid, new_opt_id, lbl, otext, is_c))
        else:
            # Insert new Question
            new_qid = str(uuid.uuid4())
            q_inserts.append((
                new_qid, doc_id, qnum, "ENGLISH", "Quantitative Aptitude", theader, theader,
                "MEDIUM", "MCQ", shift, qtext, cor_lbl, cor_lbl, sol, "APPROVED", has_vis, img_url
            ))
            for opt in options:
                lbl = opt["label"].strip().upper()
                otext = opt["text"]
                is_c = 1 if lbl == cor_lbl else 0
                new_opt_id = str(uuid.uuid4())
                opt_inserts.append((new_opt_id, new_qid, new_opt_id, lbl, otext, is_c))

    # Execute updates & inserts
    if q_updates:
        c.executemany("""
            UPDATE Question 
            SET questionNumber = ?, questionText = ?, topic = ?, subtopic = ?, tags = ?, verifiedAnswer = ?, explanation = ?, hasVisualContent = ?, imageUrl = ?
            WHERE id = ?
        """, q_updates)

    if opt_updates:
        c.executemany("""
            UPDATE QuestionOption 
            SET text = ?, isCorrect = ?
            WHERE id = ?
        """, opt_updates)

    if q_inserts:
        c.executemany("""
            INSERT INTO Question (
                id, documentId, questionNumber, language, subject, topic, subtopic,
                difficulty, questionType, tags, questionText, sourceAnswer, verifiedAnswer, explanation, status, hasVisualContent, imageUrl
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, q_inserts)

    if opt_inserts:
        c.executemany("""
            INSERT INTO QuestionOption (id, questionId, stableId, label, text, isCorrect)
            VALUES (?, ?, ?, ?, ?, ?)
        """, opt_inserts)

    conn.commit()
    grand_total_synced += total_q
    print(f"[{ch_num:02d}] {ch_code:<36} -> Synced {total_q} questions. (Updated: {len(q_updates)}, Inserted: {len(q_inserts)})")

print(f"\n================================================================================")
print(f"SYNC COMPLETE: {grand_total_synced} QUESTIONS SYNCHRONIZED ACROSS ALL 30 CHAPTERS")
print(f"================================================================================")

conn.close()
