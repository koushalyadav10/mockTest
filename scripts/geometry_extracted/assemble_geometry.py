import json
import os

with open(r'scripts/geometry_extracted/official_answer_key_622.json', encoding='utf-8') as f:
    official_key = json.load(f)

# 1. Assemble Part 2 (201-400)
batches = [
    'scripts/geometry_extracted/batch_201_240.json',
    'scripts/geometry_extracted/batch_241_280.json',
    'scripts/geometry_extracted/batch_281_320.json',
    'scripts/geometry_extracted/batch_321_360.json',
    'scripts/geometry_extracted/batch_361_400.json',
]

part2 = []
for b in batches:
    data = json.load(open(b, encoding='utf-8'))
    print(f"Batch {b}: {len(data)} questions ({data[0]['questionNumber']} to {data[-1]['questionNumber']})")
    part2.extend(data)

print(f"Part 2 Total: {len(part2)} questions")
with open('scripts/geometry_extracted/ch24_part2_201_400.json', 'w', encoding='utf-8') as f:
    json.dump(part2, f, indent=2, ensure_ascii=False)

# 2. Assemble Full Ch 24 (1-622)
part1 = json.load(open('scripts/geometry_extracted/ch24_part1_1_200.json', encoding='utf-8'))
part3 = json.load(open('scripts/geometry_extracted/ch24_part3_401_622.json', encoding='utf-8'))

full_ch24 = part1 + part2 + part3
print(f"Full Chapter 24 count: {len(full_ch24)} questions")

# 3. Comprehensive Verification
mismatches = []
visual_count = 0
for idx, q in enumerate(full_ch24, 1):
    assert q['questionNumber'] == idx, f"Question sequence mismatch: expected {idx}, got {q['questionNumber']}"
    qn = str(q['questionNumber'])
    if q['correctOption'] != official_key[qn]:
        mismatches.append((qn, q['correctOption'], official_key[qn]))
    if q.get('hasVisualContent'):
        visual_count += 1
        img_path = q.get('imageUrl')
        if img_path:
            clean_path = img_path.lstrip('/')
            full_disk_path = os.path.join(r'C:\Users\hp\.gemini\antigravity\scratch\examforge-ai\public', clean_path.replace('/', os.sep))
            # verify file exists
            if not os.path.exists(full_disk_path):
                print(f"WARNING: Image file not found on disk: {full_disk_path} for Q{qn}")

print(f"--- VERIFICATION REPORT ---")
print(f"Total contiguous questions: {len(full_ch24)} (1 to 622)")
print(f"Mismatches against printed book key: {len(mismatches)}")
print(f"Questions with diagrams/figures: {visual_count}")

# 4. Save to final destination
dest = r'data/maths_chapters/chapter_24_geometry.json'
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(full_ch24, f, indent=2, ensure_ascii=False)

print(f"Saved complete 622-question chapter to {dest} ({os.path.getsize(dest)} bytes)")
