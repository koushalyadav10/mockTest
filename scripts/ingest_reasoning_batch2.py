import sys, os, sqlite3, json, uuid, re
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.environ.get("DB_PATH", "prisma/examforge.db")

CHAPTERS_TO_INGEST = [
    {
        "chapterNumber": 4,
        "title": "Series (श्रृंखला)",
        "hindiTitle": "श्रृंखला (Series)",
        "topic": "Series",
        "docId": "doc_pinnacle_reasoning_ch04_series",
        "examCode": "SSC_REASONING_CH_04_SERIES",
        "examTitle": "SSC Reasoning (Pinnacle) — Chapter 4: Series (श्रृंखला)",
        "jsonPath": "scripts/reasoning_extracted/ch04_series_530.json",
        "summary": "Official 530 TCS questions for Chapter 4: Series (श्रृंखला) from Pinnacle SSC Reasoning Book. Full bilingual (Hindi & English).",
        "startPage": 167,
        "endPage": 217
    },
    {
        "chapterNumber": 6,
        "title": "Statements & Conclusion (कथन एवं निष्कर्ष)",
        "hindiTitle": "कथन एवं निष्कर्ष (Statements & Conclusion)",
        "topic": "Statements & Conclusion",
        "docId": "doc_pinnacle_reasoning_ch06_statements",
        "examCode": "SSC_REASONING_CH_06_STATEMENTS_CONCLUSION",
        "examTitle": "SSC Reasoning (Pinnacle) — Chapter 6: Statements & Conclusion (कथन एवं निष्कर्ष)",
        "jsonPath": "scripts/reasoning_extracted/ch06_statements_226.json",
        "summary": "Official 226 TCS questions for Chapter 6: Statements & Conclusion from Pinnacle SSC Reasoning Book. Full bilingual (Hindi & English).",
        "startPage": 238,
        "endPage": 276
    },
    {
        "chapterNumber": 10,
        "title": "Sitting Arrangement (बैठक व्यवस्था)",
        "hindiTitle": "बैठक व्यवस्था (Sitting Arrangement)",
        "topic": "Sitting Arrangement",
        "docId": "doc_pinnacle_reasoning_ch10_sitting",
        "examCode": "SSC_REASONING_CH_10_SITTING_ARRANGEMENT",
        "examTitle": "SSC Reasoning (Pinnacle) — Chapter 10: Sitting Arrangement (बैठक व्यवस्था)",
        "jsonPath": "scripts/reasoning_extracted/ch10_sitting_133.json",
        "summary": "Official 131 TCS questions for Chapter 10: Sitting Arrangement from Pinnacle SSC Reasoning Book. Full bilingual (Hindi & English).",
        "startPage": 344,
        "endPage": 363
    },
    {
        "chapterNumber": 13,
        "title": "Mathematical Operations (गणितीय संक्रियाएँ)",
        "hindiTitle": "गणितीय संक्रियाएँ (Mathematical Operations)",
        "topic": "Mathematical Operations",
        "docId": "doc_pinnacle_reasoning_ch13_math_ops",
        "examCode": "SSC_REASONING_CH_13_MATHEMATICAL_OPERATIONS",
        "examTitle": "SSC Reasoning (Pinnacle) — Chapter 13: Mathematical Operations (गणितीय संक्रियाएँ)",
        "jsonPath": "scripts/reasoning_extracted/ch13_math_ops_261.json",
        "summary": "Official 261 TCS questions for Chapter 13: Mathematical Operations from Pinnacle SSC Reasoning Book. Full bilingual (Hindi & English).",
        "startPage": 386,
        "endPage": 411
    },
    {
        "chapterNumber": 14,
        "title": "Word Arrangement (शब्द व्यवस्था)",
        "hindiTitle": "शब्द व्यवस्था (Word Arrangement)",
        "topic": "Word Arrangement",
        "docId": "doc_pinnacle_reasoning_ch14_word_arr",
        "examCode": "SSC_REASONING_CH_14_WORD_ARRANGEMENT",
        "examTitle": "SSC Reasoning (Pinnacle) — Chapter 14: Word Arrangement (शब्द व्यवस्था)",
        "jsonPath": "scripts/reasoning_extracted/ch14_word_arr_138.json",
        "summary": "Official 138 TCS questions for Chapter 14: Word Arrangement from Pinnacle SSC Reasoning Book. Full bilingual (Hindi & English).",
        "startPage": 415,
        "endPage": 431
    }
]

def clean_explanation(s):
    if not s:
        return ""
    lines = [line.strip() for line in s.replace('\r\n', '\n').replace('\r', '\n').split('\n')]
    non_empty = [l for l in lines if l]
    if not non_empty:
        return ""
    result = []
    for l in non_empty:
        if not result:
            result.append(l)
            continue
        prev = result[-1]
        if l.startswith('|') or prev.startswith('|') or l.startswith('$$') or prev.startswith('$$'):
            result.append(l)
            continue
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
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    now_iso = datetime.now().isoformat() + "Z"

    # 1. Get or create Book
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
    else:
        book_id = b_row[0]

    # 2. Get Volume ID
    cur.execute("SELECT id FROM BookVolume WHERE bookId = ? AND volumeNumber = 1", (book_id,))
    v_row = cur.fetchone()
    volume_id = v_row[0] if v_row else str(uuid.uuid4())

    total_ingested_all = 0

    for ch in CHAPTERS_TO_INGEST:
        print("=" * 60)
        print(f"INGESTING CHAPTER {ch['chapterNumber']}: {ch['title']}")
        print("=" * 60)

        if not os.path.exists(ch["jsonPath"]):
            print(f"File not found: {ch['jsonPath']}, skipping!")
            continue

        with open(ch["jsonPath"], 'r', encoding='utf-8') as f:
            questions = json.load(f)
        total_q = len(questions)
        print(f"Loaded {total_q} questions from {ch['jsonPath']}.")

        doc_id = ch["docId"]
        # Document record
        cur.execute("SELECT id FROM UploadedDocument WHERE id = ?", (doc_id,))
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO UploadedDocument (
                    id, fileName, fileType, fileSize, pageCount, isScanned, isPublic,
                    publishedExamId, status, processingStep, rawText, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                doc_id, "PINNACLE REASONING BOOK FREE.pdf", "application/pdf",
                24657152, ch["endPage"] - ch["startPage"] + 1, 0, 1, ch["examCode"], "COMPLETED",
                f"Ingested {total_q} authentic TCS MCQ questions (bilingual)", "", now_iso, now_iso
            ))

        # Chapter record
        cur.execute("SELECT id FROM BookChapter WHERE bookId = ? AND chapterNumber = ?", (book_id, ch["chapterNumber"]))
        c_row = cur.fetchone()
        if not c_row:
            chapter_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO BookChapter (
                    id, bookId, volumeId, chapterNumber, title, hindiTitle, startPage, endPage,
                    summary, orderIndex, totalQuestions, totalTheoryBlocks, totalExamples, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                chapter_id, book_id, volume_id, ch["chapterNumber"], ch["title"], ch["hindiTitle"],
                ch["startPage"], ch["endPage"], ch["summary"], ch["chapterNumber"], total_q, 0, 0, now_iso, now_iso
            ))
        else:
            chapter_id = c_row[0]
            cur.execute("""
                UPDATE BookChapter SET
                    title = ?, hindiTitle = ?, totalQuestions = ?, updatedAt = ?
                WHERE id = ?
            """, (ch["title"], ch["hindiTitle"], total_q, now_iso, chapter_id))

        # ExamConfig
        instructions_json = json.dumps({
            "subject": "REASONING",
            "chapter": ch["chapterNumber"],
            "book": "Pinnacle SSC Reasoning",
            "totalQuestions": total_q,
            "mode": "PRACTICE"
        })

        cur.execute("SELECT id FROM ExamConfig WHERE code = ?", (ch["examCode"],))
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
                exam_id, ch["examCode"], ch["examTitle"], ch["summary"],
                "SSC", "PRACTICE", total_q, total_q * 2.0, max(15, total_q), 2.0, 0.50, 0, 0, 1, "FREE", 0, 0, "MCQ",
                "MEDIUM", "en,hi", instructions_json, "ALWAYS", "LIVE", "PUBLISHED", doc_id,
                now_iso, now_iso
            ))
        else:
            exam_id = e_row[0]
            cur.execute("""
                UPDATE ExamConfig SET
                    title = ?, totalQuestions = ?, totalMarks = ?, totalDurationMinutes = ?,
                    documentId = ?, instructions = ?, status = 'PUBLISHED', updatedAt = ?
                WHERE id = ?
            """, (ch["examTitle"], total_q, total_q * 2.0, max(15, total_q), doc_id, instructions_json, now_iso, exam_id))

        # ExamSectionConfig
        cur.execute("SELECT id FROM ExamSectionConfig WHERE examConfigId = ?", (exam_id,))
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO ExamSectionConfig (
                    id, examConfigId, name, "order", questionCount, marksPerCorrect, negativeMarks, allowBackNavigation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                str(uuid.uuid4()), exam_id, "Reasoning (General Intelligence)", 1, total_q, 2.0, 0.50, 1
            ))
        else:
            cur.execute("""
                UPDATE ExamSectionConfig SET
                    name = 'Reasoning (General Intelligence)',
                    questionCount = ?,
                    marksPerCorrect = 2.0,
                    negativeMarks = 0.50
                WHERE examConfigId = ?
            """, (total_q, exam_id))

        # Delete old questions for this document to ensure clean re-insert
        cur.execute("DELETE FROM QuestionOption WHERE questionId IN (SELECT id FROM Question WHERE documentId = ?)", (doc_id,))
        cur.execute("DELETE FROM Question WHERE documentId = ?", (doc_id,))

        for item in questions:
            q_num = item["questionNumber"]
            q_id = f"q_pinnacle_reasoning_ch{ch['chapterNumber']:02d}_{q_num:04d}"

            clean_sol = clean_explanation(item.get("solution", ""))
            concept_notes_payload = {
                "hindiQuestion": item.get("hindiQuestion", item.get("questionText", "")),
                "solution": clean_sol,
            }
            concept_notes_json = json.dumps(concept_notes_payload, ensure_ascii=False)

            year_match = re.search(r'20\d{2}', item.get("examShift", ""))
            extracted_year = int(year_match.group(0)) if year_match else None

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
                q_id, doc_id, book_id, chapter_id, "ORIGINAL", q_num, "bilingual",
                "Reasoning", ch["topic"], ch["topic"], "MEDIUM", 0.90, "MCQ", "SOURCE_QUESTION",
                "PDF", "PINNACLE REASONING BOOK FREE.pdf", item["examShift"], extracted_year, item["examShift"],
                item["questionText"], 0, "UNKNOWN", item["correctOption"], item["correctOption"],
                item["correctOption"], clean_sol, concept_notes_json, 0, "APPROVED",
                0.99, 0.99, 1.0, now_iso, now_iso
            ))

            for opt in item["options"]:
                opt_id = f"opt_pinnacle_reasoning_ch{ch['chapterNumber']:02d}_{q_num:04d}_{opt['label'].lower()}"
                is_corr = 1 if opt["isCorrect"] else 0
                cur.execute("""
                    INSERT INTO QuestionOption (
                        id, questionId, label, text, isCorrect, stableId
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    opt_id, q_id, opt["label"], opt["text"], is_corr, opt["stableId"]
                ))

        total_ingested_all += total_q
        print(f"Successfully ingested {total_q} questions for {ch['title']}!")

    conn.commit()
    conn.close()
    print("=" * 60)
    print(f"DONE! Ingested total {total_ingested_all} authentic TCS questions across {len(CHAPTERS_TO_INGEST)} reasoning chapters.")
    print("=" * 60)

if __name__ == "__main__":
    main()
