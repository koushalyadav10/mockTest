import sys, os, pymupdf, re, json

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf'
ANS_KEY_PATH = r'scripts\reasoning_extracted\ch10_sitting_ans_key.json'
OUT_JSON_PATH = r'scripts\reasoning_extracted\ch10_sitting_133.json'
MAP_JSON_PATH = r'src\lib\data\reasoning_ch10_bilingual_map.json'

os.makedirs(os.path.dirname(ANS_KEY_PATH), exist_ok=True)
os.makedirs(os.path.dirname(OUT_JSON_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MAP_JSON_PATH), exist_ok=True)

DECODE_MAP = [
    ('ʩİƅ', 'व्यक्ति'),
    ('पंİƅ', 'पंक्ति'),
    ('उȅर', 'उत्तर'),
    ('दिƗण', 'दक्षिण'),
    ('पिʮम', 'पश्चिम'),
    ('पूवŊ', 'पूर्व'),
    ('कŐ ū', 'केंद्र'),
    ('कŐū', 'केंद्र'),
    ('िवपरीत', 'विपरीत'),
    ('िनɻिलİखत', 'निम्नलिखित'),
    ('िनɻ', 'निम्न'),
    ('िवकʙों', 'विकल्पों'),
    ('िवकʙ', 'विकल्प'),
    ('Ůकार', 'प्रकार'),
    ('Ůʲ', 'प्रश्न'),
    ('हœ', 'हैं'),
    ('मŐ', 'में'),
    ('Ɛा', 'क्या'),
    ('िकसी', 'किसी'),
    ('िदए', 'दिए'),
    ('िदया', 'दिया'),
    ('संबंिधत', 'संबंधित'),
    ('Ţम', 'क्रम'),
    ('̾ थान', 'स्थान'),
    ('̾थान', 'स्थान'),
    ('दाएं', 'दाएं'),
    ('बाएं', 'बाएं'),
    ('दायŐ', 'दाएं'),
    ('बायŐ', 'बाएं'),
    ('गोलाकार', 'गोलाकार'),
    ('वृȅ', 'वृत्त'),
    ('कुसŎ', 'कुर्सी'),
    ('वˑुओं', 'वस्तुओं'),
    ('वˑु', 'वस्तु'),
]

def clean_hindi(text: str) -> str:
    if not text:
        return ""
    res = text
    for bad, good in DECODE_MAP:
        res = res.replace(bad, good)
    res = re.sub(r'[ \t]+', ' ', res)
    return res.strip()

def clean_english(text: str) -> str:
    if not text:
        return ""
    res = re.sub(r'[ \t]+', ' ', text)
    res = res.replace('‘', "'").replace('’', "'").replace('“', '"').replace('”', '"')
    return res.strip()

def clean_exam_citation(raw: str) -> str:
    if not raw:
        return ""
    cleaned = re.sub(r'\s+', ' ', raw).strip()
    cleaned = re.sub(r'^[\(\[\{]+', '', cleaned)
    cleaned = re.sub(r'[\)\]\}]+$', '', cleaned).strip()
    if not cleaned.upper().startswith("SSC") and any(k in cleaned.upper() for k in ["CGL", "CHSL", "CPO", "MTS", "GD", "JE"]):
        cleaned = "SSC " + cleaned
    return cleaned

def clean_page_text(txt: str) -> str:
    txt = re.sub(r'^\s*(?:Sitting\s*Arrangement|Pinnacle\s*SSC\s*Reasoning|SITTING\s*ARRANGEMENT/.*)\s*', '', txt, flags=re.IGNORECASE)
    txt = re.sub(r'\n\s*\d{2,3}\s*$', '', txt)
    return txt

def main():
    print(f"Opening PDF: {PDF_PATH}...")
    doc = pymupdf.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Answer Key (page 357, idx 356)
    print("Extracting Chapter 10 answer keys...")
    ans_text = doc[356].get_text('text')
    matches = re.findall(r'(?:^|\s)(\d{1,4})\s*[\.\)]\s*\(?([a-dA-D])\)?', ans_text)
    ans_key = {}
    for q_str, a_str in matches:
        q_num = int(q_str)
        if 1 <= q_num <= 133 and str(q_num) not in ans_key:
            ans_key[str(q_num)] = a_str.upper()

    print(f"Loaded {len(ans_key)} official answer keys for Chapter 10.")
    with open(ANS_KEY_PATH, 'w', encoding='utf-8') as f:
        json.dump(ans_key, f, indent=2)

    # 2. Solutions (pages 357 to 363, idx 356 to 362)
    print("Extracting Chapter 10 solutions (pages 357-363)...")
    sol_stream = ''
    t357 = clean_page_text(doc[356].get_text())
    sol_idx = t357.find('Solution')
    if sol_idx != -1:
        sol_stream += t357[sol_idx:] + '\n'
    for p in range(357, 363):
        sol_stream += clean_page_text(doc[p].get_text()) + '\n'

    sol_pattern = r'(?:^|\n)\s*(?:Sol|S)\s*\.?\s*(\d+)\s*(?:\.|\(|\s*\()'
    sol_matches = list(re.finditer(sol_pattern, sol_stream, re.IGNORECASE))
    solutions_map = {}
    for i, m in enumerate(sol_matches):
        q_num = int(m.group(1))
        start_idx = m.end()
        end_idx = sol_matches[i+1].start() if i+1 < len(sol_matches) else len(sol_stream)
        sol_body = sol_stream[start_idx:end_idx].strip()
        sol_body = re.sub(r'^[a-dA-D]\s*[\)\.\-:]\s*', '', sol_body).strip()
        sol_body = clean_hindi(sol_body)
        solutions_map[q_num] = sol_body

    print(f"Extracted {len(solutions_map)} solutions for Chapter 10.")

    # 3. Questions (pages 344 to 356, idx 343 to 355)
    print("Extracting Chapter 10 questions (pages 344-356)...")
    q_stream = ''
    t344 = doc[343].get_text()
    q1_idx = t344.find('Q1.')
    q_stream += t344[q1_idx:] + '\n'
    for p in range(344, 356):
        q_stream += doc[p].get_text() + '\n'

    q_pattern = r'(?:^|\n)\s*Q\s*\.?\s*(\d+)\s*\.?\s*'
    q_matches = list(re.finditer(q_pattern, q_stream))
    print(f"Found {len(q_matches)} raw question markers.")

    questions_list = []
    bilingual_map = {}

    for i, m in enumerate(q_matches):
        q_num = int(m.group(1))
        start_idx = m.end()
        end_idx = q_matches[i+1].start() if i+1 < len(q_matches) else len(q_stream)
        block = q_stream[start_idx:end_idx].strip()

        # Parse options
        opt_matches = list(re.finditer(r'(?:^|\n|\s)\(([a-dA-D])\)\s*', block))
        opt_texts = {}
        if len(opt_matches) >= 4:
            body_text = block[:opt_matches[0].start()].strip()
            for oi in range(4):
                lbl = opt_matches[oi].group(1).upper()
                o_start = opt_matches[oi].end()
                o_end = opt_matches[oi+1].start() if oi+1 < len(opt_matches) else len(block)
                opt_texts[lbl] = block[o_start:o_end].strip()
        else:
            body_text = block
            opt_texts = {"A": "", "B": "", "C": "", "D": ""}

        # Split English, Hindi, and Exam Shift from body_text
        lines = [l.strip() for l in body_text.split('\n') if l.strip()]
        exam_line = ""
        en_lines = []
        hi_lines = []
        is_hindi = False

        for l in lines:
            if any(re.search(pat, l, re.IGNORECASE) for pat in [
                r'\b(?:SSC|CGL|CHSL|CPO|MTS|GD|JE)\b',
                r'\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}',
                r'\b(?:Shift|Tier|Morning|Evening|Afternoon)\b'
            ]):
                exam_line = clean_exam_citation(l)
                continue
            if re.search(r'[\u0900-\u097F]', l):
                is_hindi = True
                hi_lines.append(l)
            else:
                if is_hindi:
                    hi_lines.append(l)
                    en_lines.append(l)
                else:
                    en_lines.append(l)

        en_q_text = clean_english(' '.join(en_lines))
        hi_q_text = clean_hindi(' '.join(hi_lines))
        if not hi_q_text:
            hi_q_text = en_q_text
        if not en_q_text:
            en_q_text = hi_q_text

        corr = ans_key.get(str(q_num), "A")
        sol = solutions_map.get(q_num, "")

        options_arr = []
        for lbl in ["A", "B", "C", "D"]:
            raw_opt = opt_texts.get(lbl, "")
            raw_opt = re.sub(r'[\n\r\t]+', ' ', raw_opt).strip()
            options_arr.append({
                "label": lbl,
                "text": raw_opt,
                "isCorrect": (lbl == corr),
                "stableId": f"ch10_{q_num}_{lbl.lower()}"
            })

        q_obj = {
            "questionNumber": q_num,
            "chapterNumber": 10,
            "chapterTitle": "Sitting Arrangement (बैठक व्यवस्था)",
            "examShift": exam_line or "SSC Previous Year Exam",
            "questionText": en_q_text,
            "hindiQuestion": hi_q_text,
            "options": options_arr,
            "correctOption": corr,
            "solution": sol
        }
        questions_list.append(q_obj)

        bilingual_map[f"q_pinnacle_reasoning_ch10_{q_num:04d}"] = {
            "englishQuestion": en_q_text,
            "hindiQuestion": hi_q_text,
            "options": {
                opt["label"]: {
                    "english": opt["text"],
                    "hindi": clean_hindi(opt["text"])
                }
                for opt in options_arr
            },
            "solution": sol
        }

    questions_list.sort(key=lambda x: x["questionNumber"])
    print(f"Extracted {len(questions_list)} / 133 questions successfully!")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions_list, f, ensure_ascii=False, indent=2)

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_map, f, ensure_ascii=False, indent=2)

    print(f"Saved: {OUT_JSON_PATH} and {MAP_JSON_PATH}")

if __name__ == "__main__":
    main()
