import sys, os, fitz, re, json, unicodedata

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf'
ANS_KEY_PATH = r'scripts\reasoning_extracted\ch01_analogy_ans_key.json'
OUT_JSON_PATH = r'scripts\reasoning_extracted\ch01_analogy_850.json'
MAP_JSON_PATH = r'src\lib\data\reasoning_ch01_bilingual_map.json'

os.makedirs(os.path.dirname(OUT_JSON_PATH), exist_ok=True)
os.makedirs(os.path.dirname(MAP_JSON_PATH), exist_ok=True)

DECODE_MAP = [
    # Multi-character whole words / phrases
    ('संƥाओं', 'संख्याओं'),
    ('संƥाएं', 'संख्याएं'),
    ('संƥाएँ', 'संख्याएँ'),
    ('संƥा', 'संख्या'),
    ('शɨ-युƵ', 'शब्द-युग्म'),
    ('शɨों', 'शब्दों'),
    ('शɨ', 'शब्द'),
    ('युƵ', 'युग्म'),
    ('करŐ', 'करें'),
    ('िजसमŐ', 'जिसमें'),
    ('संबंिधतः', 'संबंधितः'),
    ('संबंिधत', 'संबंधित'),
    ('सम्बन्धित', 'संबंधित'),
    ('सम्बंिधत', 'संबंधित'),
    ('सɾİɀत', 'सम्बन्धित'),
    ('सɾंिधत', 'संबंधित'),
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
    ('Ɋायालय', 'न्यायालय'),
    ('Ɋायाधीश', 'न्यायाधीश'),
    ('अȯयन', 'अध्ययन'),
    ('ȯान', 'ध्यान'),
    ('अȯाय', 'अध्याय'),
    ('िवȨालय', 'विद्यालय'),
    ('अůीका', 'अफ्रीका'),
    ('ůूट्स', 'फ्रूट्स'),
    ('नेůोलॉजी', 'नेफ्रोलॉजी'),
    ('रेůीिजरेटर', 'रेफ्रिजरेटर'),
    ('राǛपाल', 'राज्यपाल'),
    ('राǛ', 'राज्य'),
    ('Ǜािमित', 'ज्यामिति'),
    ('समुǄय', 'समुच्चय'),
    ('बǄा', 'बच्चा'),
    ('बǄे', 'बच्चे'),
    ('गुŜवार', 'गुरुवार'),
    ('पुŜष', 'पुरुष'),
    ('कशेŜकी', 'कशेरुकी'),
    ('űम', 'भ्रम'),
    ('űʼाचार', 'भ्रष्टाचार'),
    ('űूभंग', 'भ्रूभंग'),
    ('ऑƛीजन', 'ऑक्सीजन'),
    ('गैलेƛी', 'गैलेक्सी'),
    ('अपाटŊमŐट', 'अपार्टमेंट'),
    ('सɑाह', 'सप्ताह'),
    ('पȶी', 'पत्नी'),
    ('दȶाİख', 'दस्तावेज'),
    ('संबंिध', 'संबंधि'),
    ('मŐ', 'में'),
    # Single character glyph fallbacks
    ('ƥ', 'ख्य'),
    ('Ƶ', 'ग्म'),
    ('Ő', 'ें'),
    ('Ů', 'प्र'),
    ('ɨ', 'ब्द'),
    ('ʙ', 'ल्प'),
    ('Ɨ', 'क्ष'),
    ('Ŋ', 'र्'),
    ('œ', 'ैं'),
    ('Ť', 'ग्र'),
    ('ǒ', 'ज्ञ'),
    ('Ȩ', 'द्य'),
    ('ȑ', 'त्या'),
    ('Ų', 'म्र'),
    ('ʋ', 'ल्क'),
    ('Ō', '्र'),
    ('İ', 'ख'),
    ('ɻ', 'म्न'),
    ('̾', '्'),
    ('˝', 'स्म'),
    ('ŵ', 'श्र'),
    ('̊', 'दृ'),
    ('ˆ', 'ष्म'),
    ('˙', 'स्प'),
    ('Ţ', 'क्र'),
    ('ũ', 'त्रि'),
    ('į', 'रि'),
    ('Ȗ', 'त्स'),
    ('ʩ', 'व्य'),
    ('ƅ', 'क्त'),
    ('Ȫ', 'द्व'),
    ('Ƞ', 'द्ध'),
    ('Ɋ', 'न्य'),
    ('ȯ', 'ध्य'),
    ('ů', 'फ्र'),
    ('Ǜ', 'ज्य'),
    ('ő', 'र्दे'),
    ('Ǆ', 'च्च'),
    ('Ŝ', 'रु'),
    ('ű', 'भ्र'),
    ('ƛ', 'क्स'),
    ('ː', 'ह'),
    ('ˑ', 'स्त'),
    ('ʼ', 'ष्ट'),
    ('ɑ', 'ा'),
    ('ɘ', 'े'),
    ('ʃ', 'श'),
    ('ʱ', 'ह'),
    ('ʞ', 'क'),
    ('ǥ', 'ग'),
    ('ş', 'ष'),
    ('Ÿ', 'हृ'),
    ('ﬁ', 'fi'),
    ('ˋ', 'स्क'),
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

def is_hindi(text: str) -> bool:
    return len(re.findall(r'[\u0900-\u097f]', text)) > 1

def is_exam_line(line: str) -> bool:
    keywords = [
        'CPO', 'CGL', 'CHSL', 'MTS', 'GD', 'JE', 'Phase', 'Selection', 'Steno',
        '2018', '2019', '2020', '2021', '2022', '2023', 'Shift', 'Morning', 'Evening', 'Afternoon'
    ]
    return any(k in line for k in keywords)

def clean_exam_citation(tag: str) -> str:
    if not tag:
        return ""
    clean = re.sub(r'[ \t]+', ' ', tag).strip()
    if not clean.upper().startswith('SSC') and any(k in clean.upper() for k in ['CPO', 'CGL', 'CHSL', 'MTS', 'GD', 'JE', 'PHASE', 'SELECTION']):
        clean = 'SSC ' + clean
    return clean

def main():
    print("Loading answer key...")
    with open(ANS_KEY_PATH, 'r', encoding='utf-8') as f:
        ans_key = json.load(f)
    print(f"Loaded {len(ans_key)} official answer keys.")

    print(f"Opening PDF: {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Questions stream (pages 5 to 57)
    print("Extracting question text stream from pages 5 to 57...")
    q_stream = ''
    t5 = doc[5].get_text()
    idx1 = t5.find('Q1.')
    q_stream += t5[idx1:] + '\n'
    for p in range(6, 57):
        q_stream += doc[p].get_text() + '\n'
    t57 = doc[57].get_text()
    idx_ans = t57.find('ANSWERS')
    q_stream += (t57[:idx_ans] if idx_ans != -1 else t57) + '\n'

    # 2. Solutions stream (pages 60 to 85)
    print("Extracting solutions text stream from pages 60 to 85...")
    sol_stream = ''
    t60 = doc[60].get_text()
    sol_stream += t60[t60.find('SOLUTIONS'):] + '\n'
    for p in range(61, 85):
        sol_stream += doc[p].get_text() + '\n'

    # 3. Parse Solutions
    sol_pattern = r'(?:^|\n)\s*(?:Sol|S)\s*\.?\s*(\d+)\s*(?:\.|\(|\s*\()'
    sol_matches = list(re.finditer(sol_pattern, sol_stream, re.IGNORECASE))
    solutions_map = {}
    for i, m in enumerate(sol_matches):
        q_num = int(m.group(1))
        if q_num == 1 and m.start() > 1000:
            continue
        start = m.start()
        end = sol_matches[i+1].start() if i+1 < len(sol_matches) else len(sol_stream)
        raw_sol = sol_stream[start:end].strip()
        clean_sol = re.sub(r'^(?:Sol|S)\s*\.?\s*\d+\s*(?:\.|\(|\s*\([a-dA-D]\)\s*)', '', raw_sol).strip()
        clean_sol = re.sub(r'^\([a-dA-D]\)\s*', '', clean_sol).strip()
        clean_sol = clean_hindi(clean_sol)
        clean_sol = re.sub(r'[ \t]+', ' ', clean_sol)
        # Handle 362 and 363 split
        if q_num == 362 and '36' in clean_sol and '25' in clean_sol:
            idx363 = clean_sol.find('36')
            if idx363 != -1:
                sol_362 = clean_sol[:idx363].strip()
                sol_363 = clean_sol[idx363:].strip()
                solutions_map[362] = sol_362
                solutions_map[363] = sol_363
                continue
        solutions_map[q_num] = clean_sol
    print(f"Total solutions mapped: {len(solutions_map)} / 850")

    # 4. Parse Questions
    q_pattern = r'(?:^|\n)\s*(?:Q\s*\.?\s*|Question\s*)(\d+)\s*(?:\.|\b[A-Za-z\u0900-\u097f])'
    q_matches = list(re.finditer(q_pattern, q_stream, re.IGNORECASE))
    print(f"Total question headers detected: {len(q_matches)}")

    extracted_questions = []
    bilingual_lookup = {}

    for i, m in enumerate(q_matches):
        q_num = int(m.group(1))
        start = m.start()
        end = q_matches[i+1].start() if i+1 < len(q_matches) else len(q_stream)
        raw_block = q_stream[start:end]

        # Options splitting with bracket tolerance
        opt_matches = list(re.finditer(r'[\(\[]\s*([a-dA-D])\s*[\)\]]', raw_block))
        if len(opt_matches) < 4:
            print(f"WARNING: Q{q_num} has only {len(opt_matches)} option matches!")

        q_header_body = raw_block[:opt_matches[0].start()]
        lines = [line.strip() for line in q_header_body.split('\n') if line.strip()]

        # Remove Q header from first line
        lines[0] = re.sub(r'^(?:Q\s*\.?\s*|Question\s*)\d+\s*\.?', '', lines[0]).strip()
        clean_lines = [l for l in lines if l and l != 'Pinnacle SSC Reasoning' and not re.match(r'^\d+$', l)]

        # Find exam citation tag (scan backwards from end of header)
        exam_tag = ""
        exam_idx = None
        for idx in range(len(clean_lines)-1, -1, -1):
            if is_exam_line(clean_lines[idx]):
                exam_tag = clean_lines[idx]
                exam_idx = idx
                break

        content_lines = [l for idx, l in enumerate(clean_lines) if idx != exam_idx]

        # Find first Hindi line
        first_hi_idx = None
        for idx, l in enumerate(content_lines):
            if is_hindi(l):
                first_hi_idx = idx
                break

        if first_hi_idx is not None:
            en_prompt = ' '.join([clean_english(l) for l in content_lines[:first_hi_idx]]).strip()
            remaining = content_lines[first_hi_idx:]
            hi_lines = []
            trailing_en = []
            neutral = []
            for l in remaining:
                has_hi = is_hindi(l)
                has_en = len(re.findall(r'[A-Za-z]', l)) > 0
                if has_hi and not ('/' in l and has_en):
                    hi_lines.append(clean_hindi(l))
                elif has_en and not has_hi:
                    trailing_en.append(clean_english(l))
                else:
                    neutral.append(clean_english(l))
            hi_prompt = ' '.join(hi_lines).strip()
            en_full = en_prompt
            if trailing_en:
                en_full = (en_full + '\n\n' + ' '.join(trailing_en)).strip()
            if neutral:
                expr = ' '.join(neutral).strip()
                en_full = (en_full + '\n\n' + expr).strip()
                hi_prompt = (hi_prompt + '\n\n' + expr).strip()
        else:
            en_full = ' '.join([clean_english(l) for l in content_lines]).strip()
            hi_prompt = clean_hindi(en_full)

        # Year and Exam Name
        year_match = re.search(r'\b(19\d{2}|20\d{2})\b', exam_tag)
        parsed_year = int(year_match.group(1)) if year_match else None

        exam_name = None
        if 'CPO' in exam_tag:
            exam_name = 'SSC CPO'
        elif 'CGL' in exam_tag:
            exam_name = 'SSC CGL'
        elif 'CHSL' in exam_tag:
            exam_name = 'SSC CHSL'
        elif 'MTS' in exam_tag:
            exam_name = 'SSC MTS'
        elif 'GD' in exam_tag:
            exam_name = 'SSC GD'
        elif 'JE' in exam_tag:
            exam_name = 'SSC JE'
        else:
            exam_name = 'SSC'

        official_corr = ans_key.get(str(q_num), 'A').upper()
        clean_tag = clean_exam_citation(exam_tag)

        # Parse options
        options = []
        for j in range(len(opt_matches)):
            lbl = opt_matches[j].group(1).upper()
            o_start = opt_matches[j].end()
            o_end = opt_matches[j+1].start() if j+1 < len(opt_matches) else len(raw_block)
            raw_opt = raw_block[o_start:o_end].strip()
            raw_opt = re.sub(r'\s+', ' ', raw_opt)

            # Pre-clean with Devanagari decoder
            cleaned_opt = clean_hindi(raw_opt)

            if '/' in cleaned_opt:
                parts = cleaned_opt.split('/', 1)
                if re.search(r'[\u0900-\u097f]', parts[1]):
                    en_text = clean_english(parts[0])
                    hi_text = clean_hindi(parts[1])
                else:
                    en_text = clean_english(cleaned_opt)
                    hi_text = clean_hindi(cleaned_opt)
            else:
                en_text = clean_english(raw_opt)
                hi_text = clean_hindi(raw_opt)

            is_correct = (lbl == official_corr)
            options.append({
                'label': lbl,
                'stableId': f'opt_{lbl.lower()}',
                'englishText': en_text,
                'hindiText': hi_text,
                'isCorrect': is_correct
            })

        en_final_text = f"{en_full}\n\n*({clean_tag})*" if clean_tag else en_full
        hi_final_text = f"{hi_prompt}\n\n*({clean_tag})*" if clean_tag else hi_prompt

        sol_text = solutions_map.get(q_num, "")

        item = {
            'questionNumber': q_num,
            'englishQuestion': en_final_text,
            'hindiQuestion': hi_final_text,
            'examShift': clean_tag,
            'year': parsed_year,
            'examName': exam_name,
            'options': options,
            'correctOption': official_corr,
            'solution': sol_text,
        }
        extracted_questions.append(item)

        # Bilingual map entries
        bilingual_lookup[f"hi:{en_full}"] = hi_prompt
        bilingual_lookup[f"hi:{en_final_text}"] = hi_final_text
        for opt in options:
            bilingual_lookup[f"hi:{opt['englishText']}"] = opt['hindiText']

    print(f"Total questions processed: {len(extracted_questions)} / 850")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(extracted_questions, f, ensure_ascii=False, indent=2)
    print(f"Saved extracted questions to: {OUT_JSON_PATH}")

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_lookup, f, ensure_ascii=False, indent=2)
    print(f"Saved bilingual lookup map ({len(bilingual_lookup)} entries) to: {MAP_JSON_PATH}")

if __name__ == '__main__':
    main()
