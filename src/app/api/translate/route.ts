import { NextRequest, NextResponse } from "next/server";

// In-memory cache for fast, zero-latency repetitive translations
const translationCache = new Map<string, string>();

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

  const devanagariCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;

  // If target is Hindi and text is ALREADY in Hindi Devanagari, preserve it EXACTLY (do not modify original Hindi)
  if (targetLang === "hi" && devanagariCount > 3) {
    return trimmed;
  }

  // If target is English and text is ALREADY in English (no Devanagari characters), preserve it EXACTLY
  if (targetLang === "en" && devanagariCount === 0) {
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
