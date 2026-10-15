import sys, os, sqlite3, json, uuid
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r'prisma\examforge.db'
JSON_PATH = r'scripts\reasoning_extracted\ch01_analogy_850.json'

def main():
    if not os.path.exists(JSON_PATH):
        print(f"ERROR: {JSON_PATH} not found. Run extract_reasoning_ch01.py first.")
        sys.exit(1)

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    print(f"Loaded {len(questions)} extracted questions.")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    now_iso = datetime.utcnow().isoformat() + "Z"

    # 1. Create or get UploadedDocument
    DOC_ID = "doc_pinnacle_reasoning_ch01_analogy"
    cur.execute("SELECT id FROM UploadedDocument WHERE id = ?", (DOC_ID,))
    row = cur.fetchone()
    if not row:
        cur.execute("""
            INSERT INTO UploadedDocument (
                id, fileName, fileType, fileSize, pageCount, isScanned, isPublic,
                publishedExamId, status, processingStep, rawText, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            DOC_ID, "PINNACLE REASONING BOOK FREE.pdf", "application/pdf",
            24657152, 80, 0, 1, "SSC_REASONING_CH_01_ANALOGY_VERBAL", "COMPLETED",
            "Ingested 850 authentic TCS MCQ questions (bilingual)", "", now_iso, now_iso
        ))
        print(f"Created UploadedDocument: {DOC_ID}")
    else:
        print(f"UploadedDocument exists: {DOC_ID}")

    # 2. Create or get Book
    BOOK_CODE = "PINNACLE_SSC_REASONING"
    cur.execute("SELECT id FROM Book WHERE code = ?", (BOOK_CODE,))
    b_row = cur.fetchone()
    if not b_row:
        book_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO Book (
                id, title, code, subject, author, edition, examCategory, description,
                totalPages, status, isPublished, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            book_id, "Pinnacle SSC Reasoning 7200 TCS MCQ", BOOK_CODE, "Reasoning",
            "Pinnacle Publications", "3rd Edition", "SSC",
            "Chapter-wise 7200 TCS MCQ Reasoning with authentic bilingual questions and solutions.",
            548, "PUBLISHED", 1, now_iso, now_iso
        ))
        print(f"Created Book: {BOOK_CODE} (ID: {book_id})")
    else:
        book_id = b_row[0]
        print(f"Book exists: {BOOK_CODE} (ID: {book_id})")

    # 3. Create or get BookVolume
    cur.execute("SELECT id FROM BookVolume WHERE bookId = ? AND volumeNumber = 1", (book_id,))
    v_row = cur.fetchone()
    if not v_row:
        volume_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO BookVolume (
                id, bookId, volumeNumber, title, totalPages, processedPages, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            volume_id, book_id, 1, "Volume 1: Verbal Reasoning", 548, 548, "READY", now_iso, now_iso
        ))
        print(f"Created BookVolume: Volume 1")
    else:
        volume_id = v_row[0]

    # 4. Create or get BookChapter
    cur.execute("SELECT id FROM BookChapter WHERE bookId = ? AND chapterNumber = 1", (book_id,))
    c_row = cur.fetchone()
    if not c_row:
        chapter_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO BookChapter (
                id, bookId, volumeId, chapterNumber, title, hindiTitle, startPage, endPage,
                summary, orderIndex, totalQuestions, totalTheoryBlocks, totalExamples, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            chapter_id, book_id, volume_id, 1, "Analogy Verbal (समानता)", "समानता (Analogy Verbal)",
            5, 85, "Analogy Verbal (समानता) — Complete collection of 850 authentic TCS questions from SSC CGL, CHSL, CPO, MTS.",
            1, 850, 0, 0, now_iso, now_iso
        ))
        print(f"Created BookChapter 1: Analogy Verbal (ID: {chapter_id})")
    else:
        chapter_id = c_row[0]
        cur.execute("""
            UPDATE BookChapter SET
                title = 'Analogy Verbal (समानता)',
                hindiTitle = 'समानता (Analogy Verbal)',
                totalQuestions = 850,
                updatedAt = ?
            WHERE id = ?
        """, (now_iso, chapter_id))
        print(f"Updated BookChapter 1: Analogy Verbal (ID: {chapter_id})")

    # 5. Create or get ExamConfig
    EXAM_CODE = "SSC_REASONING_CH_01_ANALOGY_VERBAL"
    instructions_json = json.dumps({
        "subject": "REASONING",
        "chapter": 1,
        "book": "Pinnacle SSC Reasoning",
        "totalQuestions": 850,
        "mode": "PRACTICE"
    })
    cur.execute("SELECT id FROM ExamConfig WHERE code = ?", (EXAM_CODE,))
    e_row = cur.fetchone()
    if not e_row:
        exam_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO ExamConfig (
                id, code, title, description, category, mode, totalQuestions, totalMarks,
                totalDurationMinutes, marksPerCorrect, negativeMarks, sectionalTiming, sectionLock,
                allowBackNavigation, navigationRules, questionShuffle, optionShuffle, allowedQuestionTypes,
                difficulty, languages, instructions, availability, scheduledStatus, status, documentId,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            exam_id, EXAM_CODE, "SSC Reasoning (Pinnacle) — Chapter 1: Analogy Verbal (समानता)",
            "Official 850 TCS questions for Chapter 1: Analogy Verbal (समानता) from Pinnacle SSC Reasoning Book. Full bilingual (Hindi & English).",
            "SSC", "PRACTICE", 850, 1700.0, 850, 2.0, 0.50, 0, 0, 1, "FREE", 0, 0, "MCQ",
            "MEDIUM", "en,hi", instructions_json, "ALWAYS", "LIVE", "PUBLISHED", DOC_ID,
            now_iso, now_iso
        ))
        print(f"Created ExamConfig: {EXAM_CODE} (ID: {exam_id})")
    else:
        exam_id = e_row[0]
        cur.execute("""
            UPDATE ExamConfig SET
                title = 'SSC Reasoning (Pinnacle) — Chapter 1: Analogy Verbal (समानता)',
                category = 'SSC',
                mode = 'PRACTICE',
                totalQuestions = 850,
                totalMarks = 1700.0,
                totalDurationMinutes = 850,
                documentId = ?,
                instructions = ?,
                status = 'PUBLISHED',
                updatedAt = ?
            WHERE id = ?
        """, (DOC_ID, instructions_json, now_iso, exam_id))
        print(f"Updated ExamConfig: {EXAM_CODE} (ID: {exam_id})")

    # 6. Ensure ExamSectionConfig
    cur.execute("SELECT id FROM ExamSectionConfig WHERE examConfigId = ?", (exam_id,))
    s_row = cur.fetchone()
    if not s_row:
        section_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO ExamSectionConfig (
                id, examConfigId, name, "order", questionCount, marksPerCorrect, negativeMarks, allowBackNavigation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            section_id, exam_id, "Reasoning (General Intelligence)", 1, 850, 2.0, 0.50, 1
        ))
        print(f"Created ExamSectionConfig for {EXAM_CODE}")
    else:
        cur.execute("""
            UPDATE ExamSectionConfig SET
                name = 'Reasoning (General Intelligence)',
                questionCount = 850,
                marksPerCorrect = 2.0,
                negativeMarks = 0.50
            WHERE examConfigId = ?
        """, (exam_id,))

    # 7. Ingest Questions and Options
    print("Ingesting 850 Questions and 3,400 Options into database...")
    # Clean previous questions for this chapter if any
    cur.execute("DELETE FROM QuestionOption WHERE questionId IN (SELECT id FROM Question WHERE documentId = ?)", (DOC_ID,))
    cur.execute("DELETE FROM Question WHERE documentId = ?", (DOC_ID,))

    q_count = 0
    opt_count = 0

    for item in questions:
        q_num = item['questionNumber']
        q_id = f"q_pinnacle_reasoning_ch01_{q_num:04d}"

        # Concept notes stores bilingual payload for instant access
        concept_notes_payload = {
            "hindiQuestion": item['hindiQuestion'],
            "hindiOptions": {opt['label']: opt['hindiText'] for opt in item['options']},
            "solution": item['solution'],
        }
        concept_notes_json = json.dumps(concept_notes_payload, ensure_ascii=False)

        cur.execute("""
            INSERT INTO Question (
                id, documentId, bookId, chapterId, generationType, questionNumber, language,
                subject, topic, subtopic, difficulty, difficultyConfidence, questionType, source,
                sourceType, sourceFileName, exam, year, tags, questionText, hasVisualContent,
                visualType, sourceAnswer, verifiedAnswer, aiSuggestedAnswer, explanation,
                conceptNotes, requiresReview, status, confidenceQuestion, confidenceOptions,
                confidenceAnswer, createdAt, updatedAt
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            q_id, DOC_ID, book_id, chapter_id, "ORIGINAL", q_num, "bilingual",
            "Reasoning", "Analogy Verbal", "Verbal Reasoning", "MEDIUM", 0.90, "MCQ", "SOURCE_QUESTION",
            "PDF", "PINNACLE REASONING BOOK FREE.pdf", item['examShift'], item['year'], item['examShift'],
            item['englishQuestion'], 0, "UNKNOWN", item['correctOption'], item['correctOption'],
            item['correctOption'], item['solution'], concept_notes_json, 0, "APPROVED",
            0.99, 0.99, 1.0, now_iso, now_iso
        ))
        q_count += 1

        for opt in item['options']:
            opt_id = f"opt_pinnacle_reasoning_ch01_{q_num:04d}_{opt['label'].lower()}"
            is_corr_int = 1 if opt['isCorrect'] else 0
            cur.execute("""
                INSERT INTO QuestionOption (
                    id, questionId, stableId, label, text, isCorrect
                ) VALUES (?, ?, ?, ?, ?, ?)
            """, (
                opt_id, q_id, opt['stableId'], opt['label'], opt['englishText'], is_corr_int
            ))
            opt_count += 1

    conn.commit()
    conn.close()
    print(f"\nSUCCESS! Ingested {q_count} questions and {opt_count} options into {DB_PATH}.")

if __name__ == '__main__':
    main()
