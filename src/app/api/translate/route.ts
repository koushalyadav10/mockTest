import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In-memory cache for fast, zero-latency repetitive translations
const translationCache = new Map<string, string>();

// Preload authentic book bilingual mappings
try {
  const dataDir = path.join(process.cwd(), "src", "lib", "data");
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith("_bilingual_map.json"));
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === "string" && v.trim()) {
          translationCache.set(k, v.trim());
          translationCache.set(`hi:${k.trim()}`, v.trim());
        } else if (v && typeof v === "object") {
          const item: any = v;
          if (item.englishQuestion && item.hindiQuestion) {
            translationCache.set(`hi:${item.englishQuestion.trim()}`, item.hindiQuestion.trim());
            translationCache.set(`en:${item.hindiQuestion.trim()}`, item.englishQuestion.trim());
          }
          if (item.questionText && typeof item.questionText === "string") {
            translationCache.set(`hi:${item.questionText.trim()}`, item.questionText.trim());
          }
          if (item.options && typeof item.options === "object") {
            for (const optVal of Object.values(item.options)) {
              if (typeof optVal === "string" && optVal.trim()) {
                translationCache.set(`hi:${optVal.trim()}`, optVal.trim());
                translationCache.set(`en:${optVal.trim()}`, optVal.trim());
              } else if (optVal && typeof optVal === "object") {
                const optObj: any = optVal;
                if (optObj.english && optObj.hindi) {
                  translationCache.set(`hi:${optObj.english.trim()}`, optObj.hindi.trim());
                  translationCache.set(`en:${optObj.hindi.trim()}`, optObj.english.trim());
                }
              }
            }
          }
        }
      }
    }
  }
} catch (e) {
  console.warn("[Translate API] Could not preload authentic bilingual maps:", e);
}

async function translateWithGoogle(text: string, targetLang: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const parts = data[0].map((part: any) => part[0] || "").join("");
      if (parts && parts.trim()) return parts.trim();
    }
  } catch (err) {
    // Fail silently to fallback
  }
  return null;
}

async function translateWithMyMemory(text: string, targetLang: string): Promise<string | null> {
  try {
    const isHindiTarget = targetLang === "hi";
    const langpair = isHindiTarget ? "en|hi" : "hi|en";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${langpair}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.responseData?.translatedText && !data.responseData.translatedText.startsWith("MYMEMORY WARNING")) {
      return data.responseData.translatedText.trim();
    }
  } catch (err) {
    // Fail silently to fallback
  }
  return null;
}

async function translateSingleText(text: string, targetLang: string = "hi"): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Never translate numbers, hyphenated numbers, codes, or uppercase abbreviations to Hindi
  // (e.g. "RSTGIN", "19-18-10-4-15-5-4", "44", "BZD, DXF, GUI")
  if (
    /^[\d\s,\-_+*/\\()=?:.><%^&!$]+$/.test(trimmed) ||
    (/^[A-Z0-9\s,\-_+*/\\()=?:.><%^&!$]+$/.test(trimmed) && !/[a-z]/.test(trimmed)) ||
    (trimmed.length <= 15 && !/\s/.test(trimmed) && /^[A-Z0-9]+$/i.test(trimmed))
  ) {
    return trimmed;
  }

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Tier 1: Google Dict API
  let translated = await translateWithGoogle(trimmed, targetLang);

  // Tier 2: MyMemory API Fallback
  if (!translated) {
    translated = await translateWithMyMemory(trimmed, targetLang);
  }

  if (translated) {
    translationCache.set(cacheKey, translated);
    return translated;
  }

  // If both failed, return original
  return trimmed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, texts, targetLang = "hi" } = body;

    if (Array.isArray(texts)) {
      // Parallel batch translation
      const results = await Promise.all(
        texts.map((t: string) => translateSingleText(String(t || ""), targetLang))
      );
      return NextResponse.json({ translatedTexts: results });
    }

    if (typeof text === "string") {
      const translated = await translateSingleText(text, targetLang);
      return NextResponse.json({ translatedText: translated });
    }

    return NextResponse.json({ error: "Invalid payload: text or texts required" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Translation error" }, { status: 500 });
  }
}
