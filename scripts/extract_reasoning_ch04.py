import sys, os, pymupdf, re, json

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf'
ANS_KEY_PATH = r'scripts\reasoning_extracted\ch04_series_ans_key.json'
OUT_JSON_PATH = r'scripts\reasoning_extracted\ch04_series_530.json'
MAP_JSON_PATH = r'src\lib\data\reasoning_ch04_bilingual_map.json'

os.makedirs(os.path.dirname(ANS_KEY_PATH), exist_ok=True)
os.makedirs(os.path.dirname(OUT_JSON_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MAP_JSON_PATH), exist_ok=True)

DECODE_MAP = [
    ('ŵृंखला', 'श्रृंखला'),
    ('संƥाओं', 'संख्याओं'),
    ('संƥाएं', 'संख्याएं'),
    ('संƥाएँ', 'संख्याएँ'),
    ('संƥा', 'संख्या'),
    ('शɨ-युƵ', 'शब्द-युग्म'),
    ('शɨों', 'शब्दों'),
    ('शɨ', 'शब्द'),
    ('युƵों', 'युग्मों'),
    ('युƵ', 'युग्म'),
    ('करŐ', 'करें'),
    ('िजसमŐ', 'जिसमें'),
    ('संबंिधतः', 'संबंधितः'),
    ('संबंिधत', 'संबंधित'),
    ('सम्बन्धित', 'संबंधित'),
    ('सम्बंिधत', 'संबंधित'),
    ('सɾİɀत', 'सम्बन्धित'),
    ('सɾंिधत', 'संबंधित'),
    ('सɾɀ', 'संबंध'),
    ('िनɻिलİखत', 'निम्नलिखित'),
    ('िनɻ', 'निम्न'),
    ('िकया', 'किया'),
    ('िकए', 'किए'),
    ('िकसी', 'किसी'),
    ('िकस', 'किस'),
    ('िजस', 'जिस'),
    ('िजन', 'जिन'),
    ('िजन्हें', 'जिन्हें'),
    ('िक', 'कि'),
    ('िदए', 'दिए'),
    ('िदया', 'दिया'),
    ('िदये', 'दिए'),
    ('अƗरों', 'अक्षरों'),
    ('अƗर-Ƒːर', 'अक्षर-समूह'),
    ('अƗर-  Ƒːर', 'अक्षर-समूह'),
    ('अƗर', 'अक्षर'),
    ('Ƒːर', 'समूह'),
    ('िवकʙों', 'विकल्पों'),
    ('िवकʙ', 'विकल्प'),
    ('Ůकार', 'प्रकार'),
    ('Ůʲ', 'प्रश्न'),
    ('िचɎ', 'चिह्न'),
    ('िच˥', 'चिह्न'),
    ('̾ थान', 'स्थान'),
    ('̾थान', 'स्थान'),
    ('िभɄ', 'भिन्न'),
    ('हœ', 'हैं'),
    ('मŐ', 'में'),
    ('Ɛा', 'क्या'),
    ('ǒात', 'ज्ञात'),
    ('पįरवतŊन', 'परिवर्तन'),
    ('Ůित̾ थािपत', 'प्रतिस्थापित'),
    ('Ůित̾थािपत', 'प्रतिस्थापित'),
    ('Ţम', 'क्रम'),
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
    txt = re.sub(r'^\s*(?:Series|Pinnacle\s*SSC\s*Reasoning|SERIES/.*)\s*', '', txt, flags=re.IGNORECASE)
    txt = re.sub(r'\n\s*\d{2,3}\s*$', '', txt)
    return txt

def main():
    print(f"Opening PDF: {PDF_PATH}...")
    doc = pymupdf.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Answer Key (pages 196 to 198, idx 195 to 197)
    print("Extracting Chapter 4 answer keys...")
    combined_ans = ''
    for p in [195, 196, 197]:
        combined_ans += doc[p].get_text('text') + '\n'
    
    matches = re.findall(r'(?:^|\s)(\d{1,4})\s*[\.\)]\s*\(?([a-dA-D])\)?', combined_ans)
    ans_key = {}
    for q_str, a_str in matches:
        q_num = int(q_str)
        if 1 <= q_num <= 530 and str(q_num) not in ans_key:
            ans_key[str(q_num)] = a_str.upper()
    
    # Handle known book misprint for Q16 (16.(s) -> 16.(a))
    if '16' not in ans_key or ans_key['16'] not in ['A', 'B', 'C', 'D']:
        ans_key['16'] = 'A'

    print(f"Loaded {len(ans_key)} official answer keys for Chapter 4.")
    with open(ANS_KEY_PATH, 'w', encoding='utf-8') as f:
        json.dump(ans_key, f, indent=2)

    # 2. Extract Solutions (pages 198 to 217, idx 197 to 216)
    print("Extracting Chapter 4 solutions (pages 198-217)...")
    sol_stream = ''
    t198 = clean_page_text(doc[197].get_text())
    sol_stream += t198[t198.find('Solution:'):] + '\n'
    for p in range(198, 217):
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

    print(f"Extracted {len(solutions_map)} solutions for Chapter 4.")

    # 3. Extract Questions (pages 167 to 196, idx 166 to 195)
    print("Extracting Chapter 4 questions (pages 167-196)...")
    q_stream = ''
    t167 = doc[166].get_text()
    q1_idx = t167.find('Q1.')
    q_stream += t167[q1_idx:] + '\n'
    for p in range(167, 196):
        q_stream += doc[p].get_text() + '\n'

    # Stop before ANSWERS on page 196
    answers_idx = q_stream.rfind('ANSWERS')
    if answers_idx != -1:
        q_stream = q_stream[:answers_idx]

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
        if len(opt_matches) < 4:
            # Try alternate pattern: (a). or a)
            opt_matches = list(re.finditer(r'(?:^|\n|\s)\(([a-dA-D])\)\.?\s*', block))

        opt_texts = {}
        if len(opt_matches) >= 4:
            # We take the first 4 valid option matches (a, b, c, d)
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
                    # Series elements or continuation
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
            # Clean option
            raw_opt = re.sub(r'[\n\r\t]+', ' ', raw_opt).strip()
            options_arr.append({
                "label": lbl,
                "text": raw_opt,
                "isCorrect": (lbl == corr),
                "stableId": f"ch04_{q_num}_{lbl.lower()}"
            })

        q_obj = {
            "questionNumber": q_num,
            "chapterNumber": 4,
            "chapterTitle": "Series (श्रृंखला)",
            "examShift": exam_line or "SSC Previous Year Exam",
            "questionText": en_q_text,
            "hindiQuestion": hi_q_text,
            "options": options_arr,
            "correctOption": corr,
            "solution": sol
        }
        questions_list.append(q_obj)

        bilingual_map[f"q_pinnacle_reasoning_ch04_{q_num:04d}"] = {
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

    # Sort questions by number
    questions_list.sort(key=lambda x: x["questionNumber"])
    print(f"Extracted {len(questions_list)} / 530 questions successfully!")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions_list, f, ensure_ascii=False, indent=2)

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_map, f, ensure_ascii=False, indent=2)

    print(f"Saved: {OUT_JSON_PATH} and {MAP_JSON_PATH}")

if __name__ == "__main__":
    main()
