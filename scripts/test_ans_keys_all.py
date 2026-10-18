import sys, pymupdf, re, json
sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open(r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf')

def test_ans_key(pages, total_expected, label):
    combined = ''
    for p in pages:
        combined += doc[p].get_text('text') + '\n'
    # Match patterns like: 1.(a), 1. (a), 1 (a), 1.a
    matches = re.findall(r'(?:^|\s)(\d{1,4})\s*[\.\)]\s*\(?([a-dA-D])\)?', combined)
    res = {}
    for q_str, a_str in matches:
        q_num = int(q_str)
        if 1 <= q_num <= total_expected:
            if str(q_num) not in res:
                res[str(q_num)] = a_str.upper()
    missing = [q for q in range(1, total_expected + 1) if str(q) not in res]
    print(f"{label}: found {len(res)} / {total_expected} keys. Missing: {len(missing)} {missing[:10] if missing else ''}")
    return res

test_ans_key([195, 196, 197], 530, "Ch 04 Series")
test_ans_key([227], 127, "Ch 05 Missing Number")
test_ans_key([264], 226, "Ch 06 Statements & Conclusion")
test_ans_key([314], 207, "Ch 08 Venn Diagram")
test_ans_key([336, 337], 128, "Ch 09 Dice & Cube")
test_ans_key([356], 133, "Ch 10 Sitting Arrangement")
test_ans_key([401, 402], 261, "Ch 13 Mathematical Operations")
test_ans_key([425, 426], 138, "Ch 14 Word Arrangement")
