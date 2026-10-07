import fitz
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def extract_gk_questions_from_pages(doc, start_page, end_page):
    questions = []
    full_text = ""
    for p in range(start_page - 1, min(end_page, len(doc))):
        full_text += doc[p].get_text("text") + "\n"

    # Pattern for numbered questions: e.g. "1.\nWhere is the description... (a) ... (b) ... (c) ... (d) ... Answer: (a) ... Solution: ..."
    # Split by lines starting with numbers like "1.", "2.", etc.
    q_blocks = re.split(r'\n(?=\d+\.\s*\n)', full_text)
    for block in q_blocks:
        match = re.search(r'^(\d+)\.\s*\n([\s\S]+?)(?=\n\([a-d]\)|\nAnswer:)', block)
        if match:
            q_num = match.group(1)
            q_text = match.group(2).strip().replace('\n', ' ')
            
            # Options
            opt_a = re.search(r'\(a\)\s*([^\n\()]+)', block)
            opt_b = re.search(r'\(b\)\s*([^\n\()]+)', block)
            opt_c = re.search(r'\(c\)\s*([^\n\()]+)', block)
            opt_d = re.search(r'\(d\)\s*([^\n\()]+)', block)
            
            # Answer
            ans_match = re.search(r'Answer:\s*\(?([a-d])\)?', block, re.I)
            ans = ans_match.group(1).upper() if ans_match else "A"
            
            # Solution / Explanation
            sol_match = re.search(r'Solution:\s*([\s\S]+?)(?=\nImportant facts|\n\d+\.|\Z)', block, re.I)
            sol = sol_match.group(1).strip().replace('\n', ' ') if sol_match else ""
            
            # Important facts
            facts_match = re.search(r'Important facts\s*([\s\S]+?)(?=\n\d+\.|\Z)', block, re.I)
            facts = facts_match.group(1).strip() if facts_match else ""

            if opt_a and opt_b:
                questions.append({
                    "qNum": int(q_num),
                    "text": q_text,
                    "options": [
                        {"label": "A", "text": opt_a.group(1).strip()},
                        {"label": "B", "text": opt_b.group(1).strip()},
                        {"label": "C", "text": opt_c.group(1).strip() if opt_c else ""},
                        {"label": "D", "text": opt_d.group(1).strip() if opt_d else ""},
                    ],
                    "answer": ans,
                    "explanation": sol,
                    "facts": facts
                })
    return questions

doc_gk = fitz.open(r"C:\Users\hp\Downloads\BRAHMASTRA Static GK English Medium PDF- APNA-PDF.IN.pdf")
# Test Chapter 2: Jainism & Buddhism (pp. 22 to 30)
sample_qs = extract_gk_questions_from_pages(doc_gk, 22, 30)
print(f"Extracted {len(sample_qs)} questions from Jainism & Buddhism!")
if sample_qs:
    q1 = sample_qs[0]
    print("Q1:", q1["qNum"], q1["text"])
    print("Options:", q1["options"])
    print("Answer:", q1["answer"])
    print("Explanation:", q1["explanation"][:120])
    print("Facts:", q1["facts"][:120])
doc_gk.close()
