import sys, os, fitz, re, json

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf'
ANS_KEY_PATH = r'scripts\reasoning_extracted\ch07_blood_relation_ans_key.json'
OUT_JSON_PATH = r'scripts\reasoning_extracted\ch07_blood_relation_109.json'
MAP_JSON_PATH = r'src\lib\data\reasoning_ch07_bilingual_map.json'

os.makedirs(os.path.dirname(ANS_KEY_PATH), exist_ok=True)
os.makedirs(os.path.dirname(OUT_JSON_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MAP_JSON_PATH), exist_ok=True)

DECODE_MAP = [
    ('रƅ', 'रक्त'),
    ('सɾɀ', 'संबंध'),
    ('संबंिधतः', 'संबंधितः'),
    ('संबंिधत', 'संबंधित'),
    ('सम्बन्धित', 'संबंधित'),
    ('सम्बंिधत', 'संबंधित'),
    ('सɾİɀत', 'सम्बन्धित'),
    ('सɾंिधत', 'संबंधित'),
    ('पįरवार', 'परिवार'),
    ('िववािहत', 'विवाहित'),
    ('बǄे', 'बच्चे'),
    ('बǄा', 'बच्चा'),
    ('पुŜष', 'पुरुष'),
    ('पुũ', 'पुत्र'),
    ('पुũी', 'पुत्री'),
    ('पिȉी', 'पत्नी'),
    ('पȶी', 'पत्नी'),
    ('िपता', 'पिता'),
    ('भांजी', 'भांजी'),
    ('भतीजी', 'भतीजी'),
    ('मŐ', 'में'),
    ('हœ', 'हैं'),
    ('Ɛा', 'क्या'),
    ('Ůकार', 'प्रकार'),
    ('Ůʲ', 'प्रश्न'),
    ('िनɻिलİखत', 'निम्नलिखित'),
    ('िनɻ', 'निम्न'),
    ('िकसी', 'किसी'),
    ('िकस', 'किस'),
    ('िजस', 'जिस'),
    ('िजन', 'जिन'),
    ('िदए', 'दिए'),
    ('िदया', 'दिया'),
    ('ȯान', 'ध्यान'),
    ('अथŊ', 'अर्थ'),
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
    txt = re.sub(r'^\s*(?:Blood\s*Relation|Pinnacle\s*SSC\s*Reasoning|BLOOD\s*RELATION/.*)\s*', '', txt, flags=re.IGNORECASE)
    txt = re.sub(r'\n\s*\d{2,3}\s*$', '', txt)
    return txt

def is_exam_line(line: str) -> bool:
    patterns = [
        r'\b(?:SSC|CGL|CHSL|CPO|MTS|GD|JE)\b',
        r'\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}',
        r'\b(?:Shift|Tier|Morning|Evening|Afternoon)\b',
    ]
    return any(re.search(p, line, re.IGNORECASE) for p in patterns)

def main():
    print(f"Opening PDF: {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Answer Key (Page 287)
    print("Extracting Chapter 7 answer key (page 287)...")
    ans_text = doc[286].get_text()
    key_matches = re.findall(r'(\d+)\s*\.\s*\(([a-dA-D])\)', ans_text)
    ans_key = {}
    for q_str, a_str in key_matches:
        q_num = int(q_str)
        if 1 <= q_num <= 109 and str(q_num) not in ans_key:
            ans_key[str(q_num)] = a_str.upper()

    print(f"Loaded {len(ans_key)} official answer keys for Chapter 7.")
    with open(ANS_KEY_PATH, 'w', encoding='utf-8') as f:
        json.dump(ans_key, f, indent=2)

    # 2. Solutions (pages 287 to 294)
    print("Extracting Chapter 7 solutions (pages 287-294)...")
    sol_stream = ''
    t287 = clean_page_text(doc[286].get_text())
    sol_stream += t287[t287.find('SOLUTIONS'):] + '\n'
    for p in range(287, 294):
        sol_stream += clean_page_text(doc[p].get_text()) + '\n'

    sol_pattern = r'(?:^|\n)\s*(?:Sol|S)?\s*\.?\s*(\d+)\s*(?:\.|\([a-dA-D]\)|\s*\([a-dA-D]\))'
    sol_matches = list(re.finditer(sol_pattern, sol_stream, re.IGNORECASE))
    solutions_map = {}
    for i, m in enumerate(sol_matches):
        q_num = int(m.group(1))
        if 1 <= q_num <= 109 and q_num not in solutions_map:
            start = m.start()
            end = sol_matches[i+1].start() if i+1 < len(sol_matches) else len(sol_stream)
            raw_sol = sol_stream[start:end].strip()
            lines = [l.strip() for l in raw_sol.split('\n') if l.strip()]
            first_line = lines[0] if lines else ""
            clean_first = re.sub(r'^(?:Sol|S)?\s*\.?\s*\d+\s*(?:\.|\([a-dA-D]\))\s*', '', first_line, flags=re.IGNORECASE).strip()
            sol_body_lines = ([clean_first] if clean_first else []) + lines[1:]
            clean_body = '\n'.join(sol_body_lines).strip()
            clean_body = re.sub(r'[ \t]+', ' ', clean_body)
            solutions_map[q_num] = clean_body

    print(f"Extracted {len(solutions_map)} solutions for Chapter 7.")

    # 3. Questions (pages 278 to 287)
    print("Extracting Chapter 7 questions (pages 278-287)...")
    q_stream = ''
    for p in range(277, 287):
        txt = doc[p].get_text()
        if p == 286:
            idx = txt.find('ANSWER')
            if idx != -1:
                txt = txt[:idx]
        q_stream += clean_page_text(txt) + '\n'

    q_pattern = r'(?:^|\n)\s*Q\s*\.?\s*(\d+)\s*[\.\s]'
    q_matches = list(re.finditer(q_pattern, q_stream, re.IGNORECASE))
    
    questions = []
    bilingual_map = {}

    for i, m in enumerate(q_matches):
        q_num = int(m.group(1))
        if q_num < 1 or q_num > 109:
            continue

        start = m.start()
        end = q_matches[i+1].start() if i+1 < len(q_matches) else len(q_stream)
        raw_block = q_stream[start:end].strip()
        raw_lines = [l.strip() for l in raw_block.split('\n') if l.strip()]
        
        if raw_lines:
            raw_lines[0] = re.sub(r'^Q\s*\.?\s*\d+\s*[\.\s]*', '', raw_lines[0], flags=re.IGNORECASE).strip()

        exam_shift = ""
        option_lines = []
        body_lines = []

        for line in raw_lines:
            if not line:
                continue
            if re.search(r'\([a-dA-D]\)', line):
                option_lines.append(line)
            elif is_exam_line(line) and not exam_shift:
                exam_shift = clean_exam_citation(line)
            else:
                body_lines.append(line)

        combined_opt_str = ' '.join(option_lines)
        opt_matches = list(re.finditer(r'\(([a-dA-D])\)\s*([^()]+)', combined_opt_str))
        options_dict = {}
        for om in opt_matches:
            lbl = om.group(1).upper()
            val = om.group(2).strip()
            val = re.sub(r'\s*\([a-dA-D]\)$', '', val).strip()
            if lbl not in options_dict:
                options_dict[lbl] = val

        for lbl in ['A', 'B', 'C', 'D']:
            if lbl not in options_dict:
                options_dict[lbl] = "None of the above"

        eng_lines = []
        hin_lines = []
        for bl in body_lines:
            if any(ch in bl for ch in '।') or len(re.findall(r'[\u0900-\u097f]', bl)) > len(re.findall(r'[a-zA-Z]', bl)):
                hin_lines.append(clean_hindi(bl))
            else:
                eng_lines.append(clean_english(bl))

        eng_question = ' '.join(eng_lines).strip()
        hin_question = ' '.join(hin_lines).strip()

        if not eng_question:
            eng_question = hin_question or f"Question {q_num}"
        if not hin_question:
            hin_question = eng_question

        eng_question = re.sub(r'\s+', ' ', eng_question)
        hin_question = re.sub(r'\s+', ' ', hin_question)

        correct_opt = ans_key.get(str(q_num), 'A')
        sol_text = solutions_map.get(q_num, "")

        opts_list = []
        for lbl in ['A', 'B', 'C', 'D']:
            opt_txt = options_dict[lbl]
            opts_list.append({
                "label": lbl,
                "text": opt_txt,
                "isCorrect": (lbl == correct_opt),
                "stableId": f"opt_{q_num}_{lbl.lower()}"
            })

        q_item = {
            "questionNumber": q_num,
            "typeHeader": "Blood Relation (रक्त संबंध)",
            "examShift": exam_shift or "SSC CGL / CHSL / CPO Previous Year",
            "questionText": eng_question,
            "options": opts_list,
            "correctOption": correct_opt,
            "solution": sol_text,
            "hasVisualContent": False,
            "imageUrl": None
        }
        questions.append(q_item)

        bilingual_map[f"q_{q_num}"] = {
            "questionText": hin_question,
            "typeHeader": "रक्त संबंध (Blood Relation)",
            "options": {lbl: options_dict[lbl] for lbl in ['A', 'B', 'C', 'D']}
        }

    questions.sort(key=lambda x: x["questionNumber"])
    print(f"Total structured questions extracted: {len(questions)}")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    print(f"Saved extracted JSON to {OUT_JSON_PATH}")

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_map, f, indent=2, ensure_ascii=False)
    print(f"Saved bilingual map to {MAP_JSON_PATH}")

if __name__ == '__main__':
    main()
