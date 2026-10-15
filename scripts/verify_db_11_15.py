import sqlite3

conn = sqlite3.connect('prisma/examforge.db')
c = conn.cursor()

chapters_to_check = [
    (11, 'SSC_MATHS_CH_11_AVERAGE', 218),
    (12, 'SSC_MATHS_CH_12_TIME_WORK', 276),
    (13, 'SSC_MATHS_CH_13_PIPE_CISTERN', 88),
    (14, 'SSC_MATHS_CH_14_TIME_DISTANCE', 249),
    (15, 'SSC_MATHS_CH_15_RACE_CIRCULAR_MOTION', 78)
]

print("================================================================================")
print("VERIFYING DATABASE INTEGRITY FOR CHAPTERS 11 TO 15")
print("================================================================================")

all_passed = True
for ch_num, ch_code, expected_q in chapters_to_check:
    c.execute('SELECT id, documentId, totalQuestions FROM ExamConfig WHERE code = ? OR code LIKE ?', (ch_code, f'SSC_MATHS_CH_{ch_num:02d}_%'))
    row = c.fetchone()
    if not row:
        print(f"FAILED: ExamConfig not found for {ch_code}")
        all_passed = False
        continue
    exam_id, doc_id, tot = row
    
    c.execute('SELECT COUNT(*), COUNT(DISTINCT questionNumber) FROM Question WHERE documentId = ?', (doc_id,))
    cnt, dist_cnt = c.fetchone()
    
    c.execute('SELECT COUNT(*) FROM Question WHERE documentId = ? AND (explanation IS NULL OR length(trim(explanation)) < 5)', (doc_id,))
    missing_sol = c.fetchone()[0]
    
    c.execute('SELECT COUNT(*) FROM Question WHERE documentId = ? AND (verifiedAnswer IS NULL OR verifiedAnswer NOT IN ("A", "B", "C", "D"))', (doc_id,))
    bad_ans = c.fetchone()[0]
    
    c.execute('SELECT COUNT(*) FROM QuestionOption WHERE questionId IN (SELECT id FROM Question WHERE documentId = ?)', (doc_id,))
    opt_cnt = c.fetchone()[0]
    
    status = "OK" if cnt == expected_q and dist_cnt == expected_q and missing_sol == 0 and bad_ans == 0 and opt_cnt == expected_q * 4 else "FAIL"
    if status != "OK":
        all_passed = False
    print(f"[{status}] Ch {ch_num:02d}: DB Qs = {cnt}/{expected_q}, Unique = {dist_cnt}, Missing Sol = {missing_sol}, Bad Ans = {bad_ans}, Options = {opt_cnt} ({opt_cnt/cnt:.1f}/Q)")

if all_passed:
    print("\nALL CHAPTERS 11 TO 15 IN DATABASE ARE 100% HEALTHY, CONSISTENT, AND COMPLETE!")
else:
    print("\nSome checks failed.")
