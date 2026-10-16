import sqlite3
import json
import uuid
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

def sync_chapter(json_path):
    DB_PATH = "prisma/examforge.db"
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA busy_timeout = 60000;")
    conn.execute("PRAGMA journal_mode = WAL;")
    c = conn.cursor()

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    ch_num = data["chapterNumber"]
    ch_code = data["chapterCode"]
    title_en = data["chapterTitleEnglish"]
    questions = data["questions"]
    total_q = len(questions)

    # 1. Lookup ExamConfig
    c.execute("SELECT id, documentId, totalQuestions FROM ExamConfig WHERE code = ?", (ch_code,))
    row = c.fetchone()
    if not row:
        print(f"Error: ExamConfig {ch_code} not found in DB!")
        conn.close()
        return False

    exam_id, doc_id, cur_total = row
    print(f"Syncing Chapter {ch_num} ({title_en}) - Code: {ch_code}")
    print(f"ExamConfig ID: {exam_id}, Document ID: {doc_id}, Previous count: {cur_total}, New count: {total_q}")

    # Update ExamConfig
    c.execute("""
        UPDATE ExamConfig 
        SET totalQuestions = ?, questionShuffle = 0, optionShuffle = 0 
        WHERE id = ?
    """, (total_q, exam_id))

    # 2. Get existing questions for this documentId
    c.execute("SELECT id, questionNumber FROM Question WHERE documentId = ? ORDER BY questionNumber ASC", (doc_id,))
    existing_qs = c.fetchall()
    print(f"Existing questions in DB for documentId: {len(existing_qs)}")

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
            q_updates.append((qnum, qtext, theader, theader, shift, cor_lbl, cor_lbl, sol, has_vis, img_url, qid))

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

    # Delete extra existing questions if any
    deleted_qs = 0
    if len(existing_qs) > total_q:
        extra_qids = [row[0] for row in existing_qs[total_q:]]
        placeholders = ",".join(["?"] * len(extra_qids))
        c.execute(f"DELETE FROM QuestionOption WHERE questionId IN ({placeholders})", extra_qids)
        c.execute(f"DELETE FROM Question WHERE id IN ({placeholders})", extra_qids)
        deleted_qs = len(extra_qids)
        print(f"Cleaned up {deleted_qs} extra legacy questions.")

    if q_updates:
        c.executemany("""
            UPDATE Question 
            SET questionNumber = ?, questionText = ?, topic = ?, subtopic = ?, tags = ?, sourceAnswer = ?, verifiedAnswer = ?, explanation = ?, hasVisualContent = ?, imageUrl = ?
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
                explanation, status, hasVisualContent, imageUrl
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, q_inserts)

    if opt_inserts:
        c.executemany("""
            INSERT INTO QuestionOption (id, questionId, optionId, label, text, isCorrect)
            VALUES (?, ?, ?, ?, ?, ?)
        """, opt_inserts)

    conn.commit()

    # Verification query
    c.execute("SELECT count(*) FROM Question WHERE documentId = ?", (doc_id,))
    final_count = c.fetchone()[0]
    c.execute("SELECT totalQuestions FROM ExamConfig WHERE id = ?", (exam_id,))
    config_total = c.fetchone()[0]
    conn.close()

    print(f"VERIFIED: DB has {final_count} questions for documentId {doc_id}, ExamConfig has totalQuestions = {config_total}")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sync_chapter(sys.argv[1])
    else:
        print("Usage: python scripts/sync_chapter_generic.py <path_to_chapter_json>")
