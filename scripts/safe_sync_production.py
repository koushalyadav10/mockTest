import sqlite3
import json
import glob
import os
import shutil
import datetime

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
    ch_code = data.get("chapterCode")
    title_en = data.get("chapterTitleEnglish")
    questions = data.get("questions", [])
    total_q = len(questions)

    # 1. Lookup ExamConfig
    c.execute("SELECT id, documentId, totalQuestions FROM ExamConfig WHERE code = ?", (ch_code,))
    row = c.fetchone()
    if not row:
        print(f"Skipping: ExamConfig {ch_code} not found in DB!")
        conn.close()
        return

    exam_id, doc_id, cur_total = row
    print(f"Syncing Chapter {ch_num} ({title_en}) - Code: {ch_code} ({total_q} Qs)")

    # Update ExamConfig without resetting test attempts
    c.execute("""
        UPDATE ExamConfig 
        SET totalQuestions = ?, questionShuffle = 0, optionShuffle = 0 
        WHERE id = ?
    """, (total_q, exam_id))

    # 2. Get existing questions for this documentId
    c.execute("SELECT id, questionNumber FROM Question WHERE documentId = ? ORDER BY questionNumber ASC", (doc_id,))
    existing_qs = {qnum: qid for qid, qnum in c.fetchall()}

    # Pre-fetch existing options
    c.execute("""
        SELECT id, questionId, label 
        FROM QuestionOption 
        WHERE questionId IN (SELECT id FROM Question WHERE documentId = ?)
    """, (doc_id,))
    existing_opts = {}
    for oid, qid, lbl in c.fetchall():
        existing_opts[(qid, lbl)] = oid

    import uuid
    for q in questions:
        qnum = q["questionNumber"]
        qtext = q["questionText"]
        correct = q["correctOption"]
        sol = q.get("solution", "")
        has_vis = 1 if q.get("hasVisualContent") else 0
        img_url = q.get("imageUrl")
        vis_type = "DIAGRAM" if has_vis else "UNKNOWN"
        topic = q.get("typeHeader", "GENERAL")
        exam_tag = q.get("examShift", "SSC CGL / CHSL")

        if qnum in existing_qs:
            qid = existing_qs[qnum]
            c.execute("""
                UPDATE Question 
                SET questionText = ?, verifiedAnswer = ?, explanation = ?,
                    hasVisualContent = ?, imageUrl = ?, visualType = ?,
                    topic = ?, tags = ?
                WHERE id = ?
            """, (qtext, correct, sol, has_vis, img_url, vis_type, topic, exam_tag, qid))
        else:
            qid = str(uuid.uuid4())
            c.execute("""
                INSERT INTO Question (
                    id, documentId, questionNumber, language, subject, topic,
                    difficulty, questionType, questionText, hasVisualContent,
                    visualType, imageUrl, verifiedAnswer, explanation,
                    status, tags, createdAt, updatedAt
                ) VALUES (
                    ?, ?, ?, 'en', 'MATHEMATICS', ?,
                    'MEDIUM', 'MCQ', ?, ?,
                    ?, ?, ?, ?,
                    'APPROVED', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
            """, (qid, doc_id, qnum, topic, qtext, has_vis, vis_type, img_url, correct, sol, exam_tag))
            existing_qs[qnum] = qid

        # Update options
        for opt in q.get("options", []):
            lbl = opt["label"]
            otext = opt["text"]
            if (qid, lbl) in existing_opts:
                oid = existing_opts[(qid, lbl)]
                c.execute("UPDATE QuestionOption SET optionText = ? WHERE id = ?", (otext, oid))
            else:
                oid = str(uuid.uuid4())
                c.execute("""
                    INSERT INTO QuestionOption (id, questionId, label, optionText, createdAt, updatedAt)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, (oid, qid, lbl, otext))
                existing_opts[(qid, lbl)] = oid

    conn.commit()
    conn.close()
    print(f"Chapter {ch_num} safely synced (User test results and student attempts preserved 100%)")

def main():
    backup_db()
    json_files = sorted(glob.glob("data/maths_chapters/*.json"))
    print(f"Found {len(json_files)} chapter files to verify and safe-sync.")
    for jf in json_files:
        safe_sync_chapter(jf)
    print("\nALL CHAPTERS SAFELY SYNCED! Zero user results touched.")

if __name__ == "__main__":
    main()
