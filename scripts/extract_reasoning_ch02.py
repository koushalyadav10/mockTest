import sys, os, fitz, re, json, unicodedata

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\hp\Downloads\PINNACLE REASONING BOOK FREE.pdf'
ANS_KEY_PATH = r'scripts\reasoning_extracted\ch02_classification_ans_key.json'
OUT_JSON_PATH = r'scripts\reasoning_extracted\ch02_classification_448.json'
MAP_JSON_PATH = r'src\lib\data\reasoning_ch02_bilingual_map.json'

os.makedirs(os.path.dirname(ANS_KEY_PATH), exist_ok=True)
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
    ('दजŎ', 'दर्जी'),
    ('ईˈाŊ', 'ईर्ष्या'),
    ('ईˈार्', 'ईर्ष्या'),
    ('Ţोिधत', 'क्रोधित'),
    ('क्रोिधत', 'क्रोधित'),
    ('िनिʮत', 'निश्चित'),
    ('पिʮम', 'पश्चिम'),
    ('दीघŊवृȅ', 'दीर्घवृत्त'),
    ('वृȅ', 'वृत्त'),
    ('उȅर', 'उत्तर'),
    ('Ůवृिȅ', 'प्रवृत्ति'),
    ('सामा̢ य', 'सामान्य'),
    ('बाथŝम', 'बाथरूम'),
    ('ŝस', 'रूस'),
    ('ŝबल', 'रूबल'),
    ('ŝकावट', 'रुकावट'),
    ('अनुŝप', 'अनुरूप'),
    ('मŐ', 'में'),
    # Chapter 2 specific ligatures
    ('हेƃेयर', 'हेक्टेयर'),
    ('अƐात', 'अज्ञात'),
    ('Ɛात', 'ज्ञात'),
    ('इनसाइƑोपीिडया', 'इनसाइक्लोपीडिया'),
    ('रिरखन्य ƨट', 'रिंग्गिट'),
    ('रिरखन्यƨट', 'रिंग्गिट'),
    ('अưाशय', 'अग्न्याशय'),
    ('बांƸादेश', 'बांग्लादेश'),
    ('मगरमǅ', 'मगरमच्छ'),
    ('आंत्रि ǜर', 'आंत्र ज्वर'),
    ('कबǭी', 'कबड्डी'),
    ('झुǷ', 'झुंड'),
    ('पाखǷ', 'पाखंड'),
    ('पृțी', 'पृथ्वी'),
    ('भȞा', 'भद्दा'),
    ('लȞाख', 'लद्दाख'),
    ('छȧावरण', 'छद्मावरण'),
    ('प्रसɄ', 'प्रसन्न'),
    ('चेɄई', 'चेन्नई'),
    ('चɔल', 'चप्पल'),
    ('ɗाज', 'प्याज'),
    ('क̱ ɗूटर', 'कंप्यूटर'),
    ('क̱ɗूटर', 'कंप्यूटर'),
    ('कम्प्यूटर', 'कंप्यूटर'),
    ('ɢोरीन', 'फ्लोरीन'),
    ('पनडुɬी', 'पनडुब्बी'),
    ('ɰैकबोडर्', 'ब्लैकबोर्ड'),
    ('टेबल लैɼ', 'टेबल लैम्प'),
    ('ऑɾोमीटर', 'ऑम्ब्रोमीटर'),
    ('िफ़ʐर', 'फ़िल्टर'),
    ('पानी का िफ़ʐर', 'पानी का फ़िल्टर'),
    ('वोʐ', 'वोल्ट'),
    ('िबʟी', 'बिल्ली'),
    ('केखल्वन', 'केल्विन'),
    ('सेखल्सियस', 'सेल्सियस'),
    ('केखʢन', 'केल्विन'),
    ('सेखʤयस', 'सेल्सियस'),
    ('ʬेल', 'व्हेल'),
    ('कʳीर', 'कश्मीर'),
    ('िवʷसनीय', 'विश्वसनीय'),
    ('सत्यािनʿा', 'सत्यानिष्ठा'),
    ('कृˁा', 'कृष्णा'),
    ('समाजशा˓', 'समाजशास्त्र'),
    ('हा˟पूणर्', 'हास्यपूर्ण'),
    ('हा˟कर', 'हास्यकर'),
    ('ेुिवओमीटर', 'प्लूवियोमीटर'),
    ('मलेरिरया', 'मलेरिया'),
    ('कोरिरया', 'कोरिया'),
    ('दकि्षण', 'दक्षिण'),
    ('Űोमीन', 'ब्रोमीन'),
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
    ('ʮ', 'श्च'),
    ('ŝ', 'रू'),
    ('ȅ', 'त्त'),
    ('̢', 'न्य'),
    ('ƃ', 'क्ट'),
    ('Ɛ', 'ज्ञ'),
    ('ư', 'ग्न्या'),
    ('Ƹ', 'ग्ला'),
    ('ǅ', 'च्छ'),
    ('ǜ', 'ज्व'),
    ('ǭ', 'ड्ड'),
    ('Ƿ', 'ंड'),
    ('ț', 'थ्व'),
    ('Ȟ', 'द्द'),
    ('ȧ', 'द्म'),
    ('ɀ', 'ंध'),
    ('Ʉ', 'न्न'),
    ('ɔ', 'प्प'),
    ('ɗ', 'प्या'),
    ('ɢ', 'फ्लो'),
    ('ɬ', 'ब्बी'),
    ('ɰ', 'ब्ल'),
    ('ɼ', 'म्प'),
    ('ɾ', 'प्ट'),
    ('ʐ', 'ल्ट'),
    ('ʟ', 'ल्ल'),
    ('ʢ', 'ल्व'),
    ('ʤ', 'ल्सि'),
    ('ʬ', 'व्ह'),
    ('ʳ', 'श्म'),
    ('ʷ', 'श्व'),
    ('ʿ', 'ष्ठ'),
    ('ˁ', 'ष्ण'),
    ('˓', 'स्त्र'),
    ('˟', 'स्य'),
    ('Ű', 'ब्रो'),
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
    patterns = [
        r'\b(?:SSC|CGL|CHSL|CPO|MTS|GD|JE)\b',
        r'\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}',
        r'\b(?:Shift|Tier|Morning|Evening|Afternoon)\b',
    ]
    matches = sum(1 for p in patterns if re.search(p, line, re.IGNORECASE))
    return matches >= 1

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
    # Remove leading page headers and chapter headers
    txt = re.sub(r'^\s*(?:Classification\s*\(Odd\s*one\s*Out\)|Pinnacle\s*SSC\s*Reasoning|CLASSIFICATION/वग[Ŏ|र्]करण|Definition\s*of\s*Classification/.*)\s*', '', txt, flags=re.IGNORECASE)
    # Remove trailing page numbers like "86\n"
    txt = re.sub(r'\n\s*\d{2,3}\s*$', '', txt)
    return txt

def main():
    print(f"Opening PDF: {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    # 1. Extract Answer Key (pages 96 to 97)
    print("Extracting Chapter 2 answer key (pages 96-97)...")
    ans_text = ''
    t96 = doc[96].get_text()
    ans_text += t96[t96.find('ANSWERS'):] + '\n'
    t97 = doc[97].get_text()
    ans_text += t97 + '\n'

    key_matches = re.findall(r'(\d+)\s*\.\s*\(([a-dA-D])\)', ans_text)
    ans_key = {}
    for q_str, a_str in key_matches:
        q_num = int(q_str)
        if 1 <= q_num <= 448 and q_num not in ans_key:
            ans_key[str(q_num)] = a_str.upper()

    print(f"Loaded {len(ans_key)} official answer keys for Chapter 2.")
    with open(ANS_KEY_PATH, 'w', encoding='utf-8') as f:
        json.dump(ans_key, f, indent=2)

    # 2. Extract Solutions (pages 97 to 111)
    print("Extracting Chapter 2 solutions (pages 97-111)...")
    sol_stream = ''
    t97 = clean_page_text(doc[97].get_text())
    sol_stream += t97[t97.find('SOLUTIONS'):] + '\n'
    for p in range(98, 112):
        sol_stream += clean_page_text(doc[p].get_text()) + '\n'

    sol_pattern = r'(?:^|\n)\s*(?:Sol|S)\s*\.?\s*(\d+)\s*(?:\.|\(|\s*\()'
    sol_matches = list(re.finditer(sol_pattern, sol_stream, re.IGNORECASE))
    solutions_map = {}
    for i, m in enumerate(sol_matches):
        q_num = int(m.group(1))
        start = m.start()
        end = sol_matches[i+1].start() if i+1 < len(sol_matches) else len(sol_stream)
        raw_sol = sol_stream[start:end].strip()
        clean_sol = re.sub(r'^(?:Sol|S)\s*\.?\s*\d+\s*(?:\.|\(|\s*\([a-dA-D]\)\s*)', '', raw_sol).strip()
        clean_sol = re.sub(r'^\([a-dA-D]\)\s*', '', clean_sol).strip()
        # Remove any running headers/footers in solution text
        clean_sol = re.sub(r'\b\d+\s+(?:Classification|Pinnacle).*', '', clean_sol, flags=re.IGNORECASE).strip()
        clean_sol = re.sub(r'(?:Classification\s*\(Odd\s*one\s*Out\)|Pinnacle\s*SSC\s*Reasoning).*', '', clean_sol, flags=re.IGNORECASE).strip()
        clean_sol = re.sub(r'www\.ssccglpinnacle\.com.*', '', clean_sol, flags=re.IGNORECASE).strip()
        clean_sol = re.sub(r'Download\s+Pinnacle.*', '', clean_sol, flags=re.IGNORECASE).strip()
        clean_sol = clean_hindi(clean_sol)
        clean_sol = re.sub(r'[ \t]+', ' ', clean_sol)
        solutions_map[q_num] = clean_sol
    print(f"Total solutions mapped: {len(solutions_map)} / 448")

    # 3. Extract Questions (pages 85 to 96)
    print("Extracting Chapter 2 questions stream (pages 85-96)...")
    q_stream = ''
    t85 = clean_page_text(doc[85].get_text())
    idx1 = t85.find('Q1.')
    q_stream += t85[idx1:] + '\n'
    for p in range(86, 96):
        q_stream += clean_page_text(doc[p].get_text()) + '\n'
    t96 = clean_page_text(doc[96].get_text())
    idx_ans = t96.find('ANSWERS')
    q_stream += (t96[:idx_ans] if idx_ans != -1 else t96) + '\n'

    q_pattern = r'(?:^|\n)\s*(?:Q\s*\.?\s*|Question\s*)(\d+)\s*(?:\.|\b[A-Za-z\u0900-\u097f])'
    q_matches = list(re.finditer(q_pattern, q_stream, re.IGNORECASE))
    print(f"Total question headers detected: {len(q_matches)} / 448")

    DEFAULT_EN_PROMPT = "Three of the following four options are alike in a certain way and one is different. Select the option that is different / odd one out."
    DEFAULT_HI_PROMPT = "निम्नलिखित चार विकल्पों में से तीन एक निश्चित तरीके से एक समान हैं और एक भिन्न है। उस भिन्न/विषम विकल्प का चयन करें।"

    extracted_questions = []
    bilingual_lookup = {}

    for i, m in enumerate(q_matches):
        q_num = int(m.group(1))
        start = m.start()
        end = q_matches[i+1].start() if i+1 < len(q_matches) else len(q_stream)
        raw_block = q_stream[start:end]

        opt_matches = list(re.finditer(r'[\(\[]\s*([a-dA-D])\s*[\)\]]', raw_block))
        if len(opt_matches) < 4:
            print(f"WARNING: Q{q_num} has only {len(opt_matches)} option matches!")

        q_header_body = raw_block[:opt_matches[0].start()]
        lines = [line.strip() for line in q_header_body.split('\n') if line.strip()]

        # Remove Q header
        lines[0] = re.sub(r'^(?:Q\s*\.?\s*|Question\s*)\d+\s*\.?', '', lines[0]).strip()
        clean_lines = [l for l in lines if l and l != 'Pinnacle SSC Reasoning' and not re.match(r'^\d+$', l) and not l.startswith('Direction')]

        # Find exam citation tag
        exam_tag = ""
        exam_idx = None
        for idx in range(len(clean_lines)-1, -1, -1):
            if is_exam_line(clean_lines[idx]):
                exam_tag = clean_lines[idx]
                exam_idx = idx
                break

        custom_prompt_lines = []
        if exam_idx is not None and exam_idx > 0:
            custom_prompt_lines = clean_lines[:exam_idx]
        elif exam_idx is None and len(clean_lines) > 0:
            custom_prompt_lines = clean_lines

        custom_raw = " ".join(custom_prompt_lines).strip()
        if custom_raw:
            en_parts = []
            hi_parts = []
            for l in custom_prompt_lines:
                if '/' in l:
                    sub = l.split('/', 1)
                    if is_hindi(sub[1]):
                        en_parts.append(sub[0].strip())
                        hi_parts.append(sub[1].strip())
                        continue
                if is_hindi(l):
                    hi_parts.append(l.strip())
                else:
                    en_parts.append(l.strip())
            en_full = clean_english(" ".join(en_parts))
            hi_prompt = clean_hindi(" ".join(hi_parts))
            if not hi_prompt:
                hi_prompt = clean_hindi(en_full)
            if not en_full:
                en_full = hi_prompt
        else:
            en_full = DEFAULT_EN_PROMPT
            hi_prompt = DEFAULT_HI_PROMPT

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
        labels_seq = ['A', 'B', 'C', 'D']
        for j in range(min(4, len(opt_matches))):
            lbl = labels_seq[j]
            o_start = opt_matches[j].end()
            o_end = opt_matches[j+1].start() if j+1 < len(opt_matches) else len(raw_block)
            raw_opt = raw_block[o_start:o_end].strip()
            raw_opt = re.sub(r'\s+', ' ', raw_opt)

            # Strip trailing next section Direction headers from Option D
            if j == 3:
                raw_opt = re.split(r'Direction\s*\(|निर्देश\s*\(', raw_opt, flags=re.IGNORECASE)[0].strip()

            # Clean any embedded running header/footer leaks
            raw_opt = re.sub(r'\b\d+\s+(?:Classification|Pinnacle).*', '', raw_opt, flags=re.IGNORECASE).strip()
            raw_opt = re.sub(r'(?:Classification\s*\(Odd\s*one\s*Out\)|Pinnacle\s*SSC\s*Reasoning).*', '', raw_opt, flags=re.IGNORECASE).strip()
            raw_opt = re.sub(r'www\.ssccglpinnacle\.com.*', '', raw_opt, flags=re.IGNORECASE).strip()
            raw_opt = re.sub(r'Download\s+Pinnacle.*', '', raw_opt, flags=re.IGNORECASE).strip()

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

        # Special fixes for specific misprints in book
        if q_num == 197:
            for opt in options:
                if opt['label'] == 'B':
                    opt['englishText'] = 'Ulcer'
                    opt['hindiText'] = 'अल्सर'
                elif opt['label'] == 'D':
                    opt['englishText'] = 'Anaemia'
                    opt['hindiText'] = 'एनीमिया'

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

    print(f"Total questions processed: {len(extracted_questions)} / 448")

    with open(OUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(extracted_questions, f, ensure_ascii=False, indent=2)
    print(f"Saved extracted questions to: {OUT_JSON_PATH}")

    with open(MAP_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(bilingual_lookup, f, ensure_ascii=False, indent=2)
    print(f"Saved bilingual lookup map ({len(bilingual_lookup)} entries) to: {MAP_JSON_PATH}")

if __name__ == '__main__':
    main()
