import json
import os

os.makedirs("scripts/race_motion_extracted", exist_ok=True)

ANSWER_KEY_78 = {
    1: "A", 2: "D", 3: "D", 4: "C", 5: "D", 6: "A", 7: "B", 8: "D", 9: "B", 10: "A",
    11: "C", 12: "D", 13: "A", 14: "C", 15: "C", 16: "B", 17: "A", 18: "C", 19: "A", 20: "B",
    21: "A", 22: "C", 23: "A", 24: "B", 25: "C", 26: "D", 27: "A", 28: "B", 29: "B", 30: "D",
    31: "A", 32: "A", 33: "C", 34: "B", 35: "B", 36: "D", 37: "D", 38: "A", 39: "B", 40: "B",
    41: "B", 42: "D", 43: "B", 44: "D", 45: "A", 46: "C", 47: "B", 48: "A", 49: "B", 50: "C",
    51: "B", 52: "A", 53: "C", 54: "D", 55: "A", 56: "D", 57: "C", 58: "D", 59: "C", 60: "C",
    61: "A", 62: "B", 63: "C", 64: "B", 65: "C", 66: "D", 67: "C", 68: "A", 69: "C", 70: "C",
    71: "C", 72: "B", 73: "B", 74: "B", 75: "D", 76: "A", 77: "A", 78: "D"
}

out_file = "scripts/race_motion_extracted/official_answer_key_78.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump({str(k): v for k, v in ANSWER_KEY_78.items()}, f, indent=2)

print(f"Saved {len(ANSWER_KEY_78)} official answer keys to {out_file}")
