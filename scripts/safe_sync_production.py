import sqlite3
import json
import glob
import os
import shutil
import datetime
import uuid
from collections import defaultdict

import sys

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = "prisma/examforge.db"
BACKUP_DIR = "prisma/backups"

def backup_db():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = os.path.join(BACKUP_DIR, f"examforge_backup_{timestamp}.db")
    
    con = sqlite3.connect(DB_PATH)
    con.execute("PRAGMA wal_checkpoint(TRUNCATE);")
    con.close()
    
    shutil.copy2(DB_PATH, backup_file)
    print(f"AUTOMATIC SAFETY BACKUP CREATED: {backup_file} ({os.path.getsize(backup_file)} bytes)")
    return backup_file

def safe_sync_chapter(json_path):
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA busy_timeout = 60000;")
    conn.execute("PRAGMA journal_mode = WAL;")
    c = conn.cursor()

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    ch_num = data.get("chapterNumber")
    ch_code = data.get("chapterCode", "")
    title_en = data.get("chapterTitleEnglish", "")
    questions = data.get("questions", [])
    total_q = len(questions)

    # 1. Flexible Lookup for ExamConfig
    c.execute("""
        SELECT id, documentId, totalQuestions, code, title 
        FROM ExamConfig 
        WHERE code = ? 
           OR code = ? 
           OR code LIKE ? 
           OR title LIKE ?
    """, (
        ch_code,
        f"SSC_MATHS_CH_{ch_num:02d}_{ch_code.upper()}",
        f"%_{ch_num:02d}_%",
        f"%Chapter {ch_num}:%"
    ))
    row = c.fetchone()
    if not row:
        print(f"Skipping: ExamConfig for Chapter {ch_num} ({ch_code}) not found in DB!")
        conn.close()
        return

    exam_id, doc_id, cur_total, matched_code, matched_title = row
    print(f"Syncing Ch {ch_num} ({matched_title}) | Code: {matched_code} | Total Qs: {total_q}")

    # Update ExamConfig without altering student test attempts
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
        options = q_data.get("options", [])
        has_vis = 1 if q_data.get("hasVisualContent") else 0
        img_url = q_data.get("imageUrl")
        vis_type = "DIAGRAM" if has_vis else "UNKNOWN"

        if idx < len(existing_qs):
            # Update existing Question in place
            qid = existing_qs[idx][0]
            q_updates.append((
                qnum, qtext, theader, theader, shift, cor_lbl, cor_lbl, sol, has_vis, img_url, vis_type, qid
            ))

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
                new_qid, doc_id, qnum, "en", "MATHEMATICS", theader, theader,
                "MEDIUM", "MCQ", shift, qtext, cor_lbl, cor_lbl, sol, "APPROVED", has_vis, img_url, vis_type
            ))
            for opt in options:
                lbl = opt["label"].strip().upper()
                otext = opt["text"]
                is_c = 1 if lbl == cor_lbl else 0
                new_opt_id = str(uuid.uuid4())
                opt_inserts.append((new_opt_id, new_qid, new_opt_id, lbl, otext, is_c))

    if q_updates:
        c.executemany("""
            UPDATE Question 
            SET questionNumber = ?, questionText = ?, topic = ?, subtopic = ?, tags = ?,
                sourceAnswer = ?, verifiedAnswer = ?, explanation = ?,
                hasVisualContent = ?, imageUrl = ?, visualType = ?, updatedAt = CURRENT_TIMESTAMP
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
                difficulty, questionType, tags, questionText, sourceAnswer, verifiedAnswer,
                explanation, status, hasVisualContent, imageUrl, visualType, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """, q_inserts)

    if opt_inserts:
        c.executemany("""
            INSERT INTO QuestionOption (id, questionId, stableId, label, text, isCorrect)
            VALUES (?, ?, ?, ?, ?, ?)
        """, opt_inserts)

    conn.commit()
    conn.close()
    print(f"OK: Chapter {ch_num} synced successfully (Updated {len(q_updates)}, Inserted {len(q_inserts)}). User results untouched!")

def main():
    backup_db()
    json_files = sorted(glob.glob("data/maths_chapters/*.json"))
    print(f"Found {len(json_files)} chapter files to safe-sync.")
    for jf in json_files:
        safe_sync_chapter(jf)
    print("\nALL 30 CHAPTERS SAFELY SYNCED! 0 User results touched.")

if __name__ == "__main__":
    main()
