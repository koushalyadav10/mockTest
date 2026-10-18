import sys, os, fitz, re, json

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
    ('शिन', 'शनि'),
    ('िवचार', 'विचार'),
    ('िसतारा', 'सितारा'),
    ('सूयŊ', 'सूर्य'),
    ('ददŊ', 'दर्द'),
    ('पवŊत', 'पर्वत'),
    ('पवőƗक', 'पर्यवेक्षक'),
    ('िनदőशक', 'निर्देशक'),
    ('गुदő', 'गुर्दे'),
    ('गमŎ', 'गर्मी'),
    ('वगŎकरण', 'वर्गीकरण'),
    ('वगŎकृत', 'वर्गीकृत'),
    ('ˋेल', 'स्केल'),
    ('ˋेिटंग', 'स्केटिंग'),
    ('सी˝ोŤाफ', 'सीस्मोग्राफ'),
    ('सी˝ो', 'सीस्मो'),
    ('तंदŜˑी', 'तंदुरुस्ती'),
    ('पƗी', 'पक्षी'),
    ('अƗरों', 'अक्षरों'),
    ('अƗर-Ƒːर', 'अक्षर-समूह'),
    ('अƗर-  Ƒːर', 'अक्षर-समूह'),
    ('पũ-Ƒːर', 'पत्र-समूह'),
    ('Ƒːर', 'समूह'),
    ('अƗर', 'अक्षर'),
    ('िवकʙों', 'विकल्पों'),
    ('िवकʙ', 'विकल्प'),
    ('Ůकार', 'प्रकार'),
    ('Ůʲ', 'प्रश्न'),
    ('डŌ ाइिवंग', 'ड्राइविंग'),
    ('डŌ ाई', 'ड्राई'),
    ('धूŲपान', 'धूम्रपान'),
    ('मȨȑागी', 'मद्यत्यागी'),
    ('मȨ', 'मद्य'),
    ('शʋ', 'शल्क'),
    ('िवशेषǒ', 'विशेषज्ञ'),
    ('ǒान', 'ज्ञान'),
    ('मंगल Ťह', 'मंगल ग्रह'),
    ('Ťह', 'ग्रह'),
    ('हœ', 'हैं'),
    ('वृȠाव̾ था', 'वृद्धावस्था'),
    ('वृȠावस्था', 'वृद्धावस्था'),
    ('बुİȠमान', 'बुद्धिमान'),
    ('दोषिसȠ', 'दोषसिद्ध'),
    ('ŮिसȠ', 'प्रसिद्ध'),
    ('युȠ', 'युद्ध'),
    ('˝ृित', 'स्मृति'),
    ('लोप', 'लोप'),
    ('ŵवण', 'श्रवण'),
    ('िवŵाम', 'विश्राम'),
    ('̊ िʼहीनता', 'दृष्टिहीनता'),
    ('̊ िʼ', 'दृष्टि'),
    ('̊िʼ', 'दृष्टि'),
    ('ऊˆा', 'ऊष्मा'),
    ('िचʟाना', 'चिल्लाना'),
    ('बृह˙ितवार', 'बृहस्पतिवार'),
    ('बृह˙ित', 'बृहस्पति'),
    ('शुŢ', 'शुक्र'),
    ('िũभुज', 'त्रिभुज'),
    ('Ɨेũफल', 'क्षेत्रफल'),
    ('शũुता', 'शत्रुता'),
    ('पįरिध', 'परिधि'),
    ('शाकाहाįरयों', 'शाकाहारियों'),
    ('एįरना', 'एरिना'),
    ('िचिकȖक', 'चिकित्सक'),
    ('उȖाह', 'उत्साह'),
    ('ʩंजन', 'व्यंजन'),
    ('ūʩमान', 'द्रव्यमान'),
    ('ʩİƅ', 'व्यक्ति'),
    ('ʩायाम', 'व्यायाम'),
    ('रƅ', 'रक्त'),
    ('शİƅ', 'शक्ति'),
    ('अिȪतीय', 'अद्वितीय'),
    ('लƗȪीप', 'लक्षद्वीप'),
    ('महाȪीप', 'महाद्वीप'),
    ('Ȫारा', 'द्वारा'),
    ('Ɋूटन', 'न्यूटन'),
    ('Ɋाय', 'न्याय'),
    ('अɊाय', 'अन्याय'),
    ('अȯयन', 'अध्ययन'),
    ('ȯान', 'ध्यान'),
    ('अȯाय', 'अध्याय'),
    ('िवȨालय', 'विद्यालय'),
    ('कूटबȠ', 'कूटबद्ध'),
    ('िनिʮत', 'निश्चित'),
    ('पिʮम', 'पश्चिम'),
    ('उȅर', 'उत्तर'),
    ('सामा̢ य', 'सामान्य'),
    ('अनुŝप', 'अनुरूप'),
    ('मŐ', 'में'),
    ('Ɛा', 'क्या'),
    ('कोिडत', 'कोडित'),
    ('कोिडंग', 'कोडिंग'),
    ('िडकोिडंग', 'डिकोडिंग'),
    ('ŝप', 'रूप'),
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
    txt = re.sub(r'^\s*(?:Coding-Decoding|Pinnacle\s*SSC\s*Reasoning|CODING\s*DECODING/.*)\s*', '', txt, flags=re.IGNORECASE)
    txt = re.sub(r'\n\s*\d{2,3}\s*$', '', txt)
    return txt

def main():
    print(f"Opening PDF: {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Extract Answer Key (pages 142 to 143)
    print("Extracting Chapter 3 answer key (pages 142-143)...")
    ans_text = doc[141].get_text() + '\n' + doc[142].get_text()
    key_matches = re.findall(r'(\d+)\s*\.\s*\(([a-dA-D])\)', ans_text)
    ans_key = {}
    for q_str, a_str in key_matches:
        q_num = int(q_str)
        if 1 <= q_num <= 474 and str(q_num) not in ans_key:
            ans_key[str(q_num)] = a_str.upper()

    print(f"Loaded {len(ans_key)} official answer keys for Chapter 3.")
    with open(ANS_KEY_PATH, 'w', encoding='utf-8') as f:
        json.dump(ans_key, f, indent=2)

    # 2. Extract Solutions (pages 143 to 165)
    print("Extracting Chapter 3 solutions (pages 143-165)...")
    sol_stream = ''
    t143 = clean_page_text(doc[142].get_text())
    sol_stream += t143[t143.find('SOLUTIONS'):] + '\n'
    for p in range(143, 165):
        sol_stream += clean_page_text(doc[p].get_text()) + '\n'

    sol_pattern = r'(?:^|\n)\s*(?:Sol|S)\s*\.?\s*(\d+)\s*(?:\.|\(|\s*\()'
    sol_matches = list(re.finditer(sol_pattern, sol_stream, re.IGNORECASE))
    solutions_map = {}
    for i, m in enumerate(sol_matches):
        q_num = int(m.group(1))
        if 1 <= q_num <= 474 and q_num not in solutions_map:
            start = m.start()
            end = sol_matches[i+1].start() if i+1 < len(sol_matches) else len(sol_stream)
            raw_sol = sol_stream[start:end].strip()
            # Clean solution text
            lines = [l.strip() for l in raw_sol.split('\n') if l.strip()]
            first_line = lines[0] if lines else ""
            clean_first = re.sub(r'^(?:Sol|S)\s*\.?\s*\d+\s*(?:\.|\([a-dA-D]\))\s*', '', first_line, flags=re.IGNORECASE).strip()
            sol_body_lines = ([clean_first] if clean_first else []) + lines[1:]
            clean_body = '\n'.join(sol_body_lines).strip()
            clean_body = re.sub(r'[ \t]+', ' ', clean_body)
            solutions_map[q_num] = clean_body

    print(f"Extracted {len(solutions_map)} solutions for Chapter 3.")

    # 3. Extract Questions (pages 114 to 142)
    print("Extracting Chapter 3 questions (pages 114-142)...")
    q_stream = ''
    for p in range(113, 142):
        txt = doc[p].get_text()
        if p == 141: # Page 142: stop before answer key
            idx = txt.find('ANSWERS')
            if idx == -1:
                idx = txt.find('ANSWER KEY')
            if idx != -1:
                txt = txt[:idx]
        q_stream += clean_page_text(txt) + '\n'

    # Fix book publisher typos
    q_stream = re.sub(r'(?:^|\n)\s*7\.\s+In\s+a\s+code\s+language,\s*‘CERTAIN’', r'\nQ257. In a code language, ‘CERTAIN’', q_stream)

    q_pattern = r'(?:^|\n)\s*Q\s*\.?\s*(\d+)\s*[\.\s]'
    q_matches = list(re.finditer(q_pattern, q_stream, re.IGNORECASE))
    
    questions = []
    bilingual_map = {}

    for i, m in enumerate(q_matches):
        q_num = int(m.group(1))
        if q_num < 1 or q_num > 474:
            continue

        start = m.start()
        end = q_matches[i+1].start() if i+1 < len(q_matches) else len(q_stream)
        raw_block = q_stream[start:end].strip()

        # Split lines
        raw_lines = [l.strip() for l in raw_block.split('\n') if l.strip()]
        
        # Remove header like 'Q1. '
        if raw_lines:
            raw_lines[0] = re.sub(r'^Q\s*\.?\s*\d+\s*[\.\s]*', '', raw_lines[0], flags=re.IGNORECASE).strip()

        # Separate into exam citation, options, English text, and Hindi text
        exam_shift = ""
        option_lines = []
        body_lines = []

        for line in raw_lines:
            if not line:
                continue
            # Check if line contains option labels
            if re.search(r'\([a-dA-D]\)', line):
                option_lines.append(line)
            # Check exam shift tag
            elif is_exam_line(line) and not exam_shift:
                exam_shift = clean_exam_citation(line)
            else:
                body_lines.append(line)

        # Parse options
        combined_opt_str = ' '.join(option_lines)
        opt_matches = list(re.finditer(r'\(([a-dA-D])\)\s*([^()]+)', combined_opt_str))
        options_dict = {}
        for om in opt_matches:
            lbl = om.group(1).upper()
            val = om.group(2).strip()
            # If next label exists, trim trailing junk
            val = re.sub(r'\s*\([a-dA-D]\)$', '', val).strip()
            if lbl not in options_dict:
                options_dict[lbl] = val

        # Ensure all 4 options exist
        for lbl in ['A', 'B', 'C', 'D']:
            if lbl not in options_dict:
                options_dict[lbl] = "None of the above"

        # Separate English and Hindi body lines
        eng_lines = []
        hin_lines = []
        for bl in body_lines:
            if any(ch in bl for ch in '।') or len(re.findall(r'[\u0900-\u097f]', bl)) > len(re.findall(r'[a-zA-Z]', bl)):
                hin_lines.append(clean_hindi(bl))
            else:
                eng_lines.append(clean_english(bl))

        eng_question = ' '.join(eng_lines).strip()
        hin_question = ' '.join(hin_lines).strip()

        # If english is empty or hindi is empty, sensible fallback
        if not eng_question:
            eng_question = hin_question or f"Question {q_num}"
        if not hin_question:
            hin_question = eng_question

        # Clean spaces
        eng_question = re.sub(r'\s+', ' ', eng_question)
        hin_question = re.sub(r'\s+', ' ', hin_question)

        correct_opt = ans_key.get(str(q_num), 'A')
        sol_text = solutions_map.get(q_num, "")

        # Format options
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
            "typeHeader": "Coding-Decoding (कोडिंग-डिकोडिंग)",
            "examShift": exam_shift or "SSC CGL / CHSL / CPO Previous Year",
            "questionText": eng_question,
            "options": opts_list,
            "correctOption": correct_opt,
            "solution": sol_text,
            "hasVisualContent": False,
            "imageUrl": None
        }
        questions.append(q_item)

        # Bilingual map for real-time Hindi switch
        bilingual_map[f"q_{q_num}"] = {
            "questionText": hin_question,
            "typeHeader": "कोडिंग-डिकोडिंग (Coding-Decoding)",
            "options": {lbl: options_dict[lbl] for lbl in ['A', 'B', 'C', 'D']}
        }

    # Sort questions by questionNumber
    questions.sort(key=lambda x: x["questionNumber"])
    print(f"Total structured questions extracted: {len(questions)}")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    print(f"Saved extracted JSON to {OUT_JSON_PATH}")

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_map, f, indent=2, ensure_ascii=False)
    print(f"Saved bilingual map to {MAP_JSON_PATH}")

def is_exam_line(line: str) -> bool:
    patterns = [
        r'\b(?:SSC|CGL|CHSL|CPO|MTS|GD|JE)\b',
        r'\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}',
        r'\b(?:Shift|Tier|Morning|Evening|Afternoon)\b',
    ]
    return any(re.search(p, line, re.IGNORECASE) for p in patterns)

if __name__ == '__main__':
    main()
