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
    Percentage: ["percentage", "percent", "%", "fraction", "rate of increase", "प्रतिशत"],
    "Profit & Loss": ["profit", "loss", "cost price", "selling price", "cp", "sp", "discount", "marked price", "लाभ", "हानि"],
    "Ratio & Proportion": ["ratio", "proportion", "proportional", "divided among", "share of", "अनुपात", "समानुपात"],
    "Simple & Compound Interest": ["simple interest", "compound interest", "si", "ci", "per annum", "principal", "ब्याज"],
    "Time & Work": ["time and work", "work done", "pipes and cistern", "days to complete", "कार्य", "समय"],
    "Time, Speed & Distance": ["speed", "distance", "train", "km/h", "m/s", "boat and stream", "चाल", "दूरी"],
    Algebra: ["x +", "x^2", "x²", "equation", "polynomial", "quadratic", "value of x", "बीजगणित"],
    Geometry: ["triangle", "circle", "radius", "diameter", "angle", "tangent", "chord", "polygon", "त्रिभुज", "वृत्त"],
    Mensuration: ["area", "perimeter", "volume", "surface area", "cylinder", "cone", "sphere", "क्षेत्रफल", "आयतन"],
    Trigonometry: ["sin", "cos", "tan", "theta", "cosec", "sec", "cot", "triangular height", "त्रिकोणमिति"],
    "Number System": ["divisible", "prime", "remainder", "hcf", "lcm", "integer", "संख्या पद्धति"],
  },
  "General Intelligence": {
    Analogy: ["analogy", "related to", "in the same way", "is related as", "सादृश्यता"],
    Classification: ["odd one out", "does not belong", "different from the rest", "वर्गीकरण", "भिन्न"],
    Series: ["next number in the series", "series", "sequence", "missing number", "श्रृंखला"],
    "Coding-Decoding": ["coded as", "code", "in a certain code language", "कूटलेखन"],
    "Blood Relations": ["mother", "father", "sister", "brother", "maternal", "paternal", "रक्त संबंध"],
    "Direction & Distance": ["north", "south", "east", "west", "turns left", "turns right", "दिशा"],
    Syllogism: ["statements", "conclusions", "some are", "all are", "no is", "न्याय निगमन"],
    "Venn Diagram": ["venn diagram", "represents", "diagram represents", "वेन आरेख"],
    "Non-Verbal / Pattern": ["figure", "fold", "mirror image", "water image", "embedded figure", "दर्पण प्रतिबिंब"],
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
    "Indian Polity": ["article", "constitution", "parliament", "president", "fundamental rights", "amendment", "संविधान", "अनुच्छेद"],
    "Modern History": ["revolt of 1857", "british", "gandhi", "congress", "viceroy", "battle of", "इतिहास"],
    "Ancient & Medieval History": ["maurya", "mughal", "gupta", "sultanate", "harappa", "vedic", "सिंधु घाटी"],
    Geography: ["river", "mountain", "himalayas", "soil", "climate", "equator", "tributary", "भूगोल"],
    "Economics & Budget": ["gdp", "inflation", "rbi", "repo rate", "fiscal deficit", "monetary policy", "अर्थशास्त्र"],
    "General Science": ["photosynthesis", "cell", "newton", "periodic table", "acid", "voltage", "chromosome", "विज्ञान"],
    "Current Affairs & Static GK": ["headquarters", "unesco", "national park", "classical dance", "festival", "stadium"],
  },
};

export function classifySubjectAndTopic(
  questionText: string,
  options: { text: string }[]
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
        if (combinedText.includes(kw.toLowerCase())) {
          score += kw.length > 5 ? 3 : 2;
        }
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
    if (/[\+\-\*\/\=\^\√\%\$\<\>]/.test(questionText) || /\d+[\.,]\d+/.test(questionText)) {
      bestSubject = "Quantitative Aptitude";
      bestTopic = "Arithmetic";
      maxScore = 2;
    } else if (
      /(\bwhich\b|\bwho\b|\bwhen\b|\bwhere\b|\bcapital\b|\btreaty\b|\bminister\b)/i.test(
        questionText
      )
    ) {
      bestSubject = "General Awareness";
      bestTopic = "Static GK";
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
