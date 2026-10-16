import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/number_system_extracted/official_answer_key_360.json", "r", encoding="utf-8") as f:
    ANS_KEY = {int(k): v for k, v in json.load(f).items()}

parts = [
    "scripts/number_system_extracted/ch18_part1_1_90.json",
    "scripts/number_system_extracted/ch18_part2_91_180.json",
    "scripts/number_system_extracted/ch18_part3_181_270.json",
    "scripts/number_system_extracted/ch18_part4_271_360.json"
]

all_questions = []
for p in parts:
    if not os.path.exists(p):
        print(f"Waiting for {p}...")
        sys.exit(1)
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
        all_questions.extend(data)
        print(f"Loaded {len(data)} questions from {p}")

print(f"Total loaded: {len(all_questions)}")
assert len(all_questions) == 360, f"Expected 360, got {len(all_questions)}"

# Sort by questionNumber
all_questions.sort(key=lambda q: q["questionNumber"])

# Verify every single question
mismatches = 0
for idx, q in enumerate(all_questions, 1):
    assert q["questionNumber"] == idx, f"Question sequence broken at {idx}, found {q['questionNumber']}"
    expected = ANS_KEY[idx]
    q["correctOption"] = expected
    labels = [opt["label"].upper() for opt in q["options"]]
    if expected not in labels:
        print(f"Error: Q{idx} missing correct label {expected} in options: {labels}")
        mismatches += 1

if mismatches == 0:
    print("ALL 360 QUESTIONS 100% MATCH OFFICIAL ANSWER KEY!")

chapter_data = {
    "chapterNumber": 18,
    "chapterCode": "SSC_MATHS_CH_18_NUMBER_SYSTEM",
    "chapterTitleEnglish": "Number System",
    "chapterTitleHindi": "संख्या पद्धति",
    "totalQuestions": 360,
    "questions": all_questions
}

with open("data/maths_chapters/chapter_18_number_system.json", "w", encoding="utf-8") as f:
    json.dump(chapter_data, f, indent=2, ensure_ascii=False)

print("SUCCESS: data/maths_chapters/chapter_18_number_system.json saved with 360 authentic questions!")
