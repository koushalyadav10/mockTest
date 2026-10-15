import json
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Import chunks
from q_chunk1 import CHUNK_1
from q_chunk2 import CHUNK_2
from q_chunk3 import CHUNK_3
from q_chunk4 import CHUNK_4

all_questions = CHUNK_1 + CHUNK_2 + CHUNK_3 + CHUNK_4

# Load official answer key
with open("scripts/time_distance_extracted/official_answer_key_249.json", "r", encoding="utf-8") as f:
    official_key = json.load(f)

print(f"Total questions compiled: {len(all_questions)}")

# Validation checks
assert len(all_questions) == 125, f"Expected 125 questions, got {len(all_questions)}"

for idx, q in enumerate(all_questions, 1):
    qnum = q["questionNumber"]
    assert qnum == idx, f"Question number mismatch at index {idx}: got {qnum}"
    
    assert "typeHeader" in q and len(q["typeHeader"]) > 0, f"Missing typeHeader in Q{qnum}"
    assert "examShift" in q and len(q["examShift"]) > 0, f"Missing examShift in Q{qnum}"
    assert "questionText" in q and len(q["questionText"]) > 0, f"Missing questionText in Q{qnum}"
    assert "solution" in q and len(q["solution"]) > 0, f"Missing solution in Q{qnum}"
    
    opts = q["options"]
    assert len(opts) == 4, f"Expected 4 options in Q{qnum}, got {len(opts)}"
    for opt_idx, lbl in enumerate(["A", "B", "C", "D"]):
        assert opts[opt_idx]["label"] == lbl, f"Option label mismatch in Q{qnum}: expected {lbl}"
        assert len(opts[opt_idx]["text"]) > 0, f"Empty option text in Q{qnum} {lbl}"
    
    # Check official answer key match
    expected_ans = official_key[str(qnum)]
    assert q["correctOption"] == expected_ans, f"Answer mismatch in Q{qnum}: expected {expected_ans}, got {q['correctOption']}"

print("✓ All 125 questions passed strict validation checks!")
print(f"✓ All question numbers 1..125 sequentially verified.")
print(f"✓ All options (A, B, C, D) verified.")
print(f"✓ 100% agreement with official answer key verified.")

out_path = "scripts/time_distance_extracted/ch14_part1_1_125.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully generated {out_path} with {len(all_questions)} questions!")
