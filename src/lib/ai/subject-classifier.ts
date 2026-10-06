export type SSCSubject =
  | "General Intelligence"
  | "Quantitative Aptitude"
  | "English Language"
  | "General Awareness";

interface SubjectClassificationResult {
  subject: SSCSubject;
  topic: string;
  subtopic?: string;
  confidence: number;
}

const TOPIC_TAXONOMY: Record<SSCSubject, Record<string, string[]>> = {
  "Quantitative Aptitude": {
    Percentage: ["percentage", "percent", "fraction", "rate of increase", "प्रतिशत"],
    "Profit & Loss": ["profit", "loss", "cost price", "selling price", "discount", "marked price", "लाभ", "हानि"],
    "Ratio & Proportion": ["ratio", "proportion", "proportional", "divided among", "share of", "अनुपात", "समानुपात"],
    "Simple & Compound Interest": ["simple interest", "compound interest", "per annum", "principal", "ब्याज"],
    "Time & Work": ["time and work", "work done", "pipes and cistern", "days to complete", "कार्य", "समय"],
    "Time, Speed & Distance": ["speed", "distance", "train", "km/h", "m/s", "boat and stream", "चाल", "दूरी"],
    Algebra: ["equation", "polynomial", "quadratic", "value of x", "बीजगणित"],
    Geometry: ["triangle", "circle", "radius", "diameter", "tangent", "chord", "polygon", "त्रिभुज", "वृत्त"],
    Mensuration: ["perimeter", "cylinder", "cone", "क्षेत्रफल", "आयतन"],
    Trigonometry: ["sin", "cos", "tan", "theta", "cosec", "sec", "cot", "triangular height", "त्रिकोणमिति"],
    "Number System": ["divisible", "prime", "remainder", "hcf", "lcm", "integer", "संख्या पद्धति"],
  },
  "General Intelligence": {
    Analogy: ["analogy", "related to", "in the same way", "is related as", "सादृश्यता"],
    Classification: ["odd one out", "does not belong", "different from the rest", "वर्गीकरण", "भिन्न"],
    Series: ["next number in the series", "series", "sequence", "missing number", "श्रृंखला"],
    "Coding-Decoding": ["coded as", "in a certain code language", "कूटलेखन"],
    "Blood Relations": ["mother", "father", "sister", "brother", "maternal", "paternal", "रक्त संबंध"],
    "Direction & Distance": ["north", "south", "east", "west", "turns left", "turns right", "दिशा"],
    Syllogism: ["statements", "conclusions", "some are", "all are", "no is", "न्याय निगमन"],
    "Venn Diagram": ["venn diagram", "represents", "diagram represents", "वेन आरेख"],
    "Non-Verbal / Pattern": ["fold", "mirror image", "water image", "embedded figure", "दर्पण प्रतिबिंब"],
  },
  "English Language": {
    "Spot the Error": ["spot the error", "grammatical error", "error in the sentence", "contains an error"],
    "Fill in the Blanks": ["fill in the blank", "appropriate word to fill", "blank"],
    "Synonyms & Antonyms": ["most nearly the same in meaning", "synonym", "antonym", "opposite in meaning"],
    "Idioms & Phrases": ["idiom", "phrase", "underlined idiom", "meaning of the idiom"],
    "Sentence Improvement": ["substitute the underlined", "no improvement required", "select the alternative"],
    "Active & Passive Voice": ["active voice", "passive voice", "converted to passive"],
    "Direct & Indirect Speech": ["direct speech", "indirect speech", "narration", "reported speech"],
    "Cloze Test / Reading Comprehension": ["comprehension", "passage", "passage below", "according to the author"],
  },
  "General Awareness": {
    "Indian Polity": [
      "article",
      "constitution",
      "right to equality",
      "fundamental rights",
      "parliament",
      "president",
      "governor",
      "amendment",
      "preamble",
      "lok sabha",
      "rajya sabha",
      "supreme court",
      "high court",
      "writs",
      "habeas corpus",
      "father of the indian constitution",
      "b. r. ambedkar",
      "संविधान",
      "अनुच्छेद",
    ],
    "Modern History": [
      "governor-general",
      "viceroy",
      "battle of plassey",
      "plassey",
      "1757",
      "revolt of 1857",
      "1857",
      "lord mountbatten",
      "c. rajagopalachari",
      "warren hastings",
      "lord canning",
      "discovery of india",
      "jawaharlal nehru",
      "mahatma gandhi",
      "sardar patel",
      "brahmo samaj",
      "arya samaj",
      "quit india",
      "swadeshi",
      "dandi march",
      "इतिहास",
    ],
    "Ancient & Medieval History": [
      "maurya",
      "ashoka",
      "gupta",
      "mughal",
      "babur",
      "akbar",
      "shah jahan",
      "delhi sultanate",
      "harappa",
      "mohenjo-daro",
      "indus valley",
      "vedic",
      "buddhism",
      "jainism",
    ],
    Geography: [
      "sorrow of bihar",
      "sorrow of bengal",
      "kosi",
      "ganga",
      "yamuna",
      "son river",
      "godavari",
      "narmada",
      "brahmaputra",
      "river",
      "coastline",
      "longest coastline",
      "gujarat",
      "lake",
      "freshwater lake",
      "wular",
      "chilika",
      "tropic of cancer",
      "western ghats",
      "himalayas",
      "equator",
      "soil",
      "capital of",
      "port",
      "mountain",
      "atmosphere",
      "भूगोल",
    ],
    "General Science": [
      "si unit",
      "electric current",
      "ampere",
      "volt",
      "ohm",
      "watt",
      "joule",
      "solar system",
      "largest planet",
      "jupiter",
      "saturn",
      "neptune",
      "planet",
      "vitamin",
      "sunlight",
      "vitamin a",
      "vitamin b",
      "vitamin b12",
      "vitamin c",
      "vitamin d",
      "rickets",
      "photosynthesis",
      "mitochondria",
      "powerhouse of the cell",
      "blood group",
      "universal donor",
      "universal recipient",
      "o negative",
      "periodic table",
      "chemical formula",
      "acid",
      "base",
      "science",
      "विज्ञान",
    ],
    "Economics & Current Affairs": [
      "green revolution",
      "crop",
      "gdp",
      "inflation",
      "rbi",
      "reserve bank",
      "repo rate",
      "niti aayog",
      "five year plan",
      "headquarters",
      "unesco",
      "national park",
      "dance",
      "festival",
    ],
  },
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function classifySubjectAndTopic(
  questionText: string,
  options: { text: string }[],
  targetSubjectHint?: string
): SubjectClassificationResult {
  const combinedText = `${questionText} ${options.map((o) => o.text).join(" ")}`.toLowerCase();

  let bestSubject: SSCSubject = "General Intelligence";
  let bestTopic = "General";
  let maxScore = 0;

  for (const [subjectKey, topics] of Object.entries(TOPIC_TAXONOMY)) {
    const subject = subjectKey as SSCSubject;
    for (const [topicName, keywords] of Object.entries(topics)) {
      let score = 0;
      for (const kw of keywords) {
        const lowerKw = kw.toLowerCase();
        // Use word boundaries for short words or words without spaces to avoid accidental substring matching
        let matched = false;
        if (lowerKw.length <= 4 || !lowerKw.includes(" ")) {
          const regex = new RegExp(`\\b${escapeRegex(lowerKw)}\\b`, "i");
          matched = regex.test(combinedText);
        } else {
          matched = combinedText.includes(lowerKw);
        }

        if (matched) {
          score += lowerKw.length > 5 ? 4 : 2;
        }
      }

      // If user/document gave an explicit targetSubjectHint, boost that subject
      if (
        targetSubjectHint &&
        (targetSubjectHint === "GK_GS" || targetSubjectHint === "General Awareness") &&
        subject === "General Awareness"
      ) {
        score += 3;
      } else if (
        targetSubjectHint &&
        (targetSubjectHint === "MATHS" || targetSubjectHint === "Quantitative Aptitude") &&
        subject === "Quantitative Aptitude"
      ) {
        score += 3;
      }

      if (score > maxScore) {
        maxScore = score;
        bestSubject = subject;
        bestTopic = topicName;
      }
    }
  }

  // Heuristic fallbacks if no specific keyword matched
  if (maxScore === 0) {
    if (targetSubjectHint === "GK_GS" || targetSubjectHint === "General Awareness") {
      bestSubject = "General Awareness";
      bestTopic = "Static GK";
      maxScore = 2;
    } else if (targetSubjectHint === "MATHS" || targetSubjectHint === "Quantitative Aptitude") {
      bestSubject = "Quantitative Aptitude";
      bestTopic = "Arithmetic";
      maxScore = 2;
    } else if (
      /(\bwhich\b|\bwho\b|\bwhen\b|\bwhere\b|\bcapital\b|\btreaty\b|\bminister\b|\barticle\b|\briver\b|\bplanet\b)/i.test(
        questionText
      )
    ) {
      bestSubject = "General Awareness";
      bestTopic = "Static GK";
      maxScore = 2;
    } else if (/[\+\-\*\/\=\^\√\%\$\<\>]/.test(questionText) || /\d+[\.,]\d+/.test(questionText)) {
      bestSubject = "Quantitative Aptitude";
      bestTopic = "Arithmetic";
      maxScore = 2;
    } else if (
      /(\bthe\b|\ba\b|\ban\b|\bis\b|\bare\b|\bwas\b|\bwere\b)/i.test(questionText) &&
      !/[0-9]/.test(questionText)
    ) {
      bestSubject = "English Language";
      bestTopic = "Vocabulary & Grammar";
      maxScore = 2;
    }
  }

  const confidence = Math.min(0.98, Math.max(0.75, 0.7 + maxScore * 0.05));

  return {
    subject: bestSubject,
    topic: bestTopic,
    confidence: Number(confidence.toFixed(2)),
  };
}
