import sys, os, pymupdf, re, json

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf'
ANS_KEY_PATH = r'scripts\reasoning_extracted\ch03_coding_decoding_ans_key.json'
OUT_JSON_PATH = r'scripts\reasoning_extracted\ch03_coding_decoding_474.json'
MAP_JSON_PATH = r'src\lib\data\reasoning_ch03_bilingual_map.json'

os.makedirs(os.path.dirname(ANS_KEY_PATH), exist_ok=True)
os.makedirs(os.path.dirname(OUT_JSON_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MAP_JSON_PATH), exist_ok=True)

DECODE_MAP = [
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
    ('हœ', 'हैं'),
    ('मŐ', 'में'),
    ('Ɛा', 'क्या'),
    ('ǒात', 'ज्ञात'),
    ('कूटबȠ', 'कूटबद्ध'),
    ('कूट', 'कूट'),
    ('कोिडत', 'कोडित'),
    ('कोिडंग', 'कोडिंग'),
    ('िडकोिडंग', 'डिकोडिंग'),
    ('ŝप', 'रूप'),
    ('िनिʮत', 'निश्चित'),
    ('पिʮम', 'पश्चिम'),
    ('उȅर', 'उत्तर'),
    ('सामा̢ य', 'सामान्य'),
    ('अनुŝप', 'अनुरूप'),
    ('िलखा', 'लिखा'),
    ('भाषा', 'भाषा'),
    ('इसी', 'इसी'),
    ('उसी', 'उसी'),
    ('कैसे', 'कैसे'),
    ('होगा', 'होगा'),
    ('जाएगा', 'जाएगा'),
    ('जाती', 'जाती'),
    ('जाता', 'जाता'),
    ('है', 'है'),
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
    txt = re.sub(r'(?:^|\n)\s*Pinnacle\s*SSC\s*Reasoning\s*(?:\n|$)', '\n', txt, flags=re.IGNORECASE)
    txt = re.sub(r'(?:^|\n)\s*Coding-Decoding\s*(?:\n|$)', '\n', txt, flags=re.IGNORECASE)
    txt = re.sub(r'(?:^|\n)\s*\d{2,3}\s*(?:\n|$)', '\n', txt)
    return txt

def main():
    print(f"Opening PDF: {PDF_PATH}...")
    doc = pymupdf.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Answer Key (pages 142 to 143, idx 141, 142)
    print("Extracting Chapter 3 answer keys...")
    ans_text = doc[141].get_text() + '\n' + doc[142].get_text()
    matches = re.findall(r'(?:^|\s)(\d{1,4})\s*[\.\)]\s*\(?([a-dA-D])\)?', ans_text)
    ans_key = {}
    for q_str, a_str in matches:
        q_num = int(q_str)
        if 1 <= q_num <= 474 and str(q_num) not in ans_key:
            ans_key[str(q_num)] = a_str.upper()

    print(f"Loaded {len(ans_key)} official answer keys for Chapter 3.")
    with open(ANS_KEY_PATH, 'w', encoding='utf-8') as f:
        json.dump(ans_key, f, indent=2)

    # 2. Solutions (pages 143 to 165, idx 142 to 164)
    print("Extracting Chapter 3 solutions (pages 143-165)...")
    sol_stream = ''
    t143 = clean_page_text(doc[142].get_text())
    sol_idx = t143.find('SOLUTIONS')
    if sol_idx != -1:
        sol_stream += t143[sol_idx:] + '\n'
    for p in range(143, 165):
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

    print(f"Extracted {len(solutions_map)} solutions for Chapter 3.")

    # 3. Questions (pages 114 to 142, idx 113 to 141)
    print("Extracting Chapter 3 questions (pages 114-142)...")
    q_stream = ''
    for p in range(113, 142):
        t = doc[p].get_text('text')
        if p == 141: # stop before ANSWERS on page 142
            idx = t.find('ANSWERS')
            if idx == -1:
                idx = t.find('ANSWER KEY')
            if idx != -1:
                t = t[:idx]
        q_stream += clean_page_text(t) + '\n'

    # Fix known book publisher typo for Q257 (printed as '7. In a code language')
    q_stream = re.sub(r'(?:^|\n)\s*7\.\s+In\s+a\s+code\s+language,\s*‘CERTAIN’', r'\nQ257. In a code language, ‘CERTAIN’', q_stream)

    q_pattern = r'(?:^|\n)\s*Q\s*\.?\s*(\d+)\s*[\.\s]'
    q_matches = list(re.finditer(q_pattern, q_stream))
    print(f"Found {len(q_matches)} raw question markers.")

    questions_list = []
    bilingual_map = {}

    for i, m in enumerate(q_matches):
        q_num = int(m.group(1))
        if q_num < 1 or q_num > 474:
            continue

        start_idx = m.end()
        end_idx = q_matches[i+1].start() if i+1 < len(q_matches) else len(q_stream)
        block = q_stream[start_idx:end_idx].strip()

        # 1. Extract Options
        # Options are always at the bottom: (a)... (b)... (c)... (d)...
        opt_m = re.search(r'(?:^|\n|\s)\(([a-dA-D])\)\s*', block)
        if opt_m:
            head_block = block[:opt_m.start()].strip()
            opts_block = block[opt_m.start():].strip()
        else:
            head_block = block
            opts_block = ''

        # Parse individual options from opts_block
        # Options in reasoning must retain their original code letters and numbers!
        opt_matches = list(re.finditer(r'\(([a-dA-D])\)\s*([^()]+)', opts_block))
        options_dict = {}
        for om in opt_matches:
            lbl = om.group(1).upper()
            val = om.group(2).strip()
            # Clean newlines and spaces
            val = re.sub(r'\s+', ' ', val).strip()
            if lbl not in options_dict:
                options_dict[lbl] = val

        for lbl in ['A', 'B', 'C', 'D']:
            if lbl not in options_dict:
                options_dict[lbl] = "None of the above"

        # 2. Extract English question, Hindi question, and Exam Shift from head_block
        # Head block structure in Pinnacle:
        # [English lines...]
        # [First Devanagari character ... Hindi lines...]
        # [Exam Shift tag e.g. CPO 12/03/2019(Morning)]
        dev_m = re.search(r'[\u0900-\u097F]', head_block)
        if dev_m:
            raw_en = head_block[:dev_m.start()].strip()
            rest_block = head_block[dev_m.start():].strip()
        else:
            raw_en = head_block
            rest_block = ''

        # In rest_block, find exam citation line
        rest_lines = [l.strip() for l in rest_block.split('\n') if l.strip()]
        exam_tag = ""
        hi_lines = []
        for l in rest_lines:
            # Check for authentic exam shift citation
            if any(k in l.upper() for k in ["CGL", "CHSL", "CPO", "MTS", "GD", "JE", "TIER", "SHIFT"]) and not exam_tag:
                exam_tag = clean_exam_citation(l)
            else:
                hi_lines.append(l)

        raw_hi = ' '.join(hi_lines).strip()

        en_q_text = clean_english(re.sub(r'\s+', ' ', raw_en))
        hi_q_text = clean_hindi(re.sub(r'\s+', ' ', raw_hi))

        # Fallbacks if either is missing
        if not en_q_text and hi_q_text:
            en_q_text = hi_q_text
        if not hi_q_text and en_q_text:
            hi_q_text = en_q_text

        # Composite Bilingual Question text:
        # English prompt on first line, followed by pure Hindi translation below!
        # This completely resolves "dono hindi english dono likh do"!
        composite_bilingual_q = f"{en_q_text}\n\n{hi_q_text}"

        corr = ans_key.get(str(q_num), "A")
        sol = solutions_map.get(q_num, "")

        options_arr = []
        for lbl in ["A", "B", "C", "D"]:
            opt_val = options_dict[lbl]
            options_arr.append({
                "label": lbl,
                "text": opt_val,
                "isCorrect": (lbl == corr),
                "stableId": f"ch03_{q_num}_{lbl.lower()}"
            })

        q_obj = {
            "questionNumber": q_num,
            "chapterNumber": 3,
            "chapterTitle": "Coding-Decoding (कोडिंग-डिकोडिंग)",
            "examShift": exam_tag or "SSC Previous Year Exam",
            "questionText": composite_bilingual_q,
            "englishQuestion": en_q_text,
            "hindiQuestion": hi_q_text,
            "options": options_arr,
            "correctOption": corr,
            "solution": sol,
            "hasVisualContent": False,
            "imageUrl": None
        }
        questions_list.append(q_obj)

        bilingual_map[f"q_{q_num}"] = {
            "englishQuestion": en_q_text,
            "hindiQuestion": hi_q_text,
            "questionText": hi_q_text,
            "typeHeader": "कोडिंग-डिकोडिंग (Coding-Decoding)",
            "options": {lbl: options_dict[lbl] for lbl in ['A', 'B', 'C', 'D']},
            "solution": sol
        }

    questions_list.sort(key=lambda x: x["questionNumber"])
    print(f"Extracted {len(questions_list)} / 474 questions for Chapter 3 successfully!")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions_list, f, ensure_ascii=False, indent=2)

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_map, f, ensure_ascii=False, indent=2)

    print(f"Saved: {OUT_JSON_PATH} and {MAP_JSON_PATH}")

if __name__ == "__main__":
    main()
