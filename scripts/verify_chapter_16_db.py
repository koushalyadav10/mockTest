import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = "prisma/examforge.db"
KEY_PATH = "scripts/train_extracted/official_answer_key_51.json"

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

with open(KEY_PATH, "r", encoding="utf-8") as f:
    official_key = json.load(f)

c.execute("SELECT id, documentId, totalQuestions, questionShuffle, optionShuffle FROM ExamConfig WHERE code = 'SSC_MATHS_CH_16_TRAIN'")
cfg = c.fetchone()
print("ExamConfig:", cfg)
assert cfg[2] == 51, f"Expected 51 questions in ExamConfig, got {cfg[2]}"
assert cfg[3] == 0 and cfg[4] == 0, "Shuffle settings must be 0"

doc_id = cfg[1]

c.execute("""
    SELECT id, questionNumber, questionText, verifiedAnswer, explanation, tags, topic
    FROM Question 
    WHERE documentId = ?
    ORDER BY questionNumber ASC
""", (doc_id,))
questions = c.fetchall()

print(f"Total Questions in DB: {len(questions)}")
assert len(questions) == 51, f"Expected 51 questions, got {len(questions)}"

mismatches = []
katex_errors = []
option_errors = []

for q in questions:
    qid, qnum, qtext, ans, expl, shift, topic = q
    
    # 1. Answer Key check
    expected_ans = official_key.get(str(qnum))
    if ans != expected_ans:
        mismatches.append((qnum, expected_ans, ans))
        
    # 2. Options check
    c.execute("SELECT label, text, isCorrect FROM QuestionOption WHERE questionId = ? ORDER BY label ASC", (qid,))
    opts = c.fetchall()
    if len(opts) != 4:
        option_errors.append(f"Q{qnum}: Expected 4 options, found {len(opts)}")
    
    correct_opts = [o[0] for o in opts if o[2] == 1]
    if len(correct_opts) != 1 or correct_opts[0] != ans:
        option_errors.append(f"Q{qnum}: Option isCorrect ({correct_opts}) does not match verifiedAnswer ({ans})")

    # 3. KaTeX balance check
    for text_to_check, name in [(qtext, "qtext"), (expl, "expl")]:
        single_dollars = text_to_check.count("$")
        if single_dollars % 2 != 0:
            katex_errors.append(f"Q{qnum} {name}: Unbalanced $ ({single_dollars})")

print(f"Answer Key Mismatches: {len(mismatches)}")
for m in mismatches:
    print(f"  Q{m[0]}: Expected {m[1]} != DB {m[2]}")

print(f"Option Errors: {len(option_errors)}")
for oe in option_errors:
    print(f"  {oe}")

print(f"KaTeX Errors: {len(katex_errors)}")
for ke in katex_errors:
    print(f"  {ke}")

if not mismatches and not option_errors and not katex_errors:
    print("\nCHAPTER 16 (TRAIN) 100% VERIFIED & FLAWLESS IN SQLITE DATABASE!")
else:
    print("\nVERIFICATION FAILED! Please fix errors above.")
    sys.exit(1)
