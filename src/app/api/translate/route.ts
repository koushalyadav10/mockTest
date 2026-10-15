import { NextRequest, NextResponse } from "next/server";

// In-memory cache for fast, zero-latency repetitive translations
const translationCache = new Map<string, string>();

async function translateSingleText(text: string, targetLang: string = "hi"): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // If already Devanagari Hindi, no need to translate
  const devanagariCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 3 && targetLang === "hi") {
    return trimmed;
  }

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(trimmed)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      // Cache response for 1 day
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`Translation API error: ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0].map((part: any) => part[0] || "").join("");
      if (translated) {
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
    return trimmed;
  } catch (err) {
    console.warn("Translation failed for text:", trimmed.slice(0, 30), err);
    return trimmed;
  }
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
