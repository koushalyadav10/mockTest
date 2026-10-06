import easyocr
import re
import sys

reader = easyocr.Reader(['en'], gpu=False)

def extract_answers_from_image(image_path):
    results = reader.readtext(image_path)
    ans_map = {}
    
    # Text tokens often look like "1. (c)" or "1." followed by "(c)" or "1" "c"
    # Or text string has "1. (c)"
    text_items = [r[1] for r in results]
    full_str = " ".join(text_items)
    
    # Try finding patterns like `(\d+)[\.\s]+[\(\[]?([a-dA-D])[\)\]]?`
    matches = re.findall(r'\b(\d{1,4})\s*[\.\:\-\)]\s*\(?([a-dA-D])\)?', full_str)
    for q_num, ans in matches:
        q_int = int(q_num)
        ans_map[q_int] = ans.upper()
        
    print(f"Extracted {len(ans_map)} answers from {image_path}")
    first_10 = {k: ans_map[k] for k in sorted(ans_map.keys())[:10]}
    print("First 10:", first_10)
    return ans_map

if __name__ == "__main__":
    extract_answers_from_image("scratch/pdf_pages/train_p291.png")
