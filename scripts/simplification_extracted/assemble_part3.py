import subprocess
import json

scripts = [
    'make_part3_181_190.py',
    'make_part3_191_210.py',
    'make_part3_211_230.py',
    'make_part3_231_250.py',
    'make_part3_251_269.py'
]

for s in scripts:
    subprocess.run(['python', f'scripts/simplification_extracted/{s}'], check=True)

with open('scripts/simplification_extracted/official_answer_key_269.json') as f:
    key = json.load(f)

all_q = []
parts = [
    'part3_q181_190.json',
    'part3_q191_210.json',
    'part3_q211_230.json',
    'part3_q231_250.json',
    'part3_q251_269.json'
]

for p in parts:
    with open(f'scripts/simplification_extracted/{p}', encoding='utf-8') as f:
        data = json.load(f)
        all_q.extend(data)

print(f"Total questions combined: {len(all_q)}")
assert len(all_q) == 89, f"Expected 89, got {len(all_q)}"

for i, q in enumerate(all_q):
    expected_num = 181 + i
    qnum = q['questionNumber']
    assert qnum == expected_num, f"Mismatch at index {i}: expected {expected_num}, got {qnum}"
    assert q['typeHeader'].strip() != '', f"Empty typeHeader in Q{qnum}"
    assert q['examShift'].strip() != '', f"Empty examShift in Q{qnum}"
    assert q['questionText'].strip() != '', f"Empty questionText in Q{qnum}"
    assert len(q['options']) == 4, f"Options count != 4 in Q{qnum}"
    for opt, expected_lbl in zip(q['options'], ['A', 'B', 'C', 'D']):
        assert opt['label'] == expected_lbl, f"Option label mismatch in Q{qnum}"
        assert opt['text'].strip() != '', f"Empty option text for {expected_lbl} in Q{qnum}"
    assert q['correctOption'] in ['A', 'B', 'C', 'D'], f"Invalid correctOption in Q{qnum}"
    official_corr = key[str(qnum)]
    assert q['correctOption'] == official_corr, f"Key mismatch in Q{qnum}: json has {q['correctOption']}, official has {official_corr}"
    assert q['solution'].strip() != '', f"Empty solution in Q{qnum}"

out_path = 'scripts/simplification_extracted/ch20_part3_181_269.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(all_q, f, indent=2, ensure_ascii=False)

print(f"SUCCESS! Verified all 89 questions. Written to {out_path}")
