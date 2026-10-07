/**
 * Bilingual Single-Question Translation Engine for SSC & Competitive CBT Tests
 * Converts question prompts, mathematical word problems, options, and solutions
 * between English and authentic Hindi (राजभाषा मानक शब्दावली).
 */

// Common mathematical and SSC terminology mappings
const TERM_REPLACEMENTS: [RegExp, string][] = [
  // Data Interpretation
  [/From the given table,?\s*/gi, "दी गई तालिका से, "],
  [/From the given bar graph,?\s*/gi, "दिए गए बार ग्राफ (दंड आरेख) से, "],
  [/From the given pie chart,?\s*/gi, "दिए गए पाई चार्ट से, "],
  [/From the given line graph,?\s*/gi, "दिए गए रेखा आरेख (लाइन ग्राफ) से, "],
  [/the production of item\s+([A-Z0-9]+)\s+in\s+(\d{4})\s+is what percentage more than its production in\s+(\d{4})\?/gi, "वर्ष $2 में वस्तु $1 का उत्पादन वर्ष $3 में इसके उत्पादन से कितने प्रतिशत अधिक है?"],
  [/the production of item\s+([A-Z0-9]+)\s+in\s+(\d{4})\s+is what percentage less than its production in\s+(\d{4})\?/gi, "वर्ष $2 में वस्तु $1 का उत्पादन वर्ष $3 में इसके उत्पादन से कितने प्रतिशत कम है?"],
  [/what is the ratio of\s+([^?]+)\?/gi, "$1 का अनुपात क्या है?"],
  [/what is the average production of\s+([^?]+)\?/gi, "$1 का औसत उत्पादन क्या है?"],

  // General Questions / GS
  [/Which Article of the Indian Constitution provides for\s+([^?]+)\?/gi, "भारतीय संविधान का कौन सा अनुच्छेद $1 का प्रावधान करता है?"],
  [/Who was the first\s+([^?]+)\?/gi, "भारत के प्रथम $1 कौन थे?"],
  [/Who is known as the\s+([^?]+)\?/gi, "$1 के रूप में किसे जाना जाता है?"],
  [/Which river is known as\s+([^?]+)\?/gi, "किस नदी को $1 के नाम से जाना जाता है?"],
  [/What is the SI unit of\s+([^?]+)\?/gi, "$1 की SI इकाई क्या है?"],
  [/Who wrote the book\s+([^?]+)\?/gi, "पुस्तक $1 के लेखक कौन हैं?"],
  [/Which is the largest\s+([^?]+)\?/gi, "सबसे बड़ा $1 कौन सा है?"],
  [/Which is the longest\s+([^?]+)\?/gi, "सबसे लंबा $1 कौन सा है?"],
  [/The Battle of\s+([A-Za-z]+)\s+was fought in which year\?/gi, "$1 की लड़ाई किस वर्ष लड़ी गई थी?"],
  [/Which state has the\s+([^?]+)\?/gi, "किस राज्य में $1 है?"],

  // Arithmetic Patterns
  [/If\s+(\d+(?:\.\d+)?%)\s+of a number is\s+(\d+(?:\.\d+)?),\s*what is\s+(\d+(?:\.\d+)?%)\s+of that number\?/gi, "यदि किसी संख्या का $1, $2 है, तो उस संख्या का $3 क्या होगा?"],
  [/A shopkeeper sells an article at a profit of\s+(\d+(?:\.\d+)?%)\.?\s*If he had bought it for\s+₹?(\d+)\s+and sold it for\s+₹?(\d+),\s*find his actual gain percentage\.?/gi, "एक दुकानदार किसी वस्तु को $1 के लाभ पर बेचता है। यदि उसने इसे ₹$2 में खरीदा था और ₹$3 में बेचा, तो उसका वास्तविक लाभ प्रतिशत ज्ञात कीजिए।"],
  [/An item with marked price\s+₹?(\d+)\s+is sold after two successive discounts of\s+(\d+%)\s+and\s+(\d+%)\.?\s*What is the net selling price\?/gi, "₹$1 के अंकित मूल्य वाली एक वस्तु को $2 और $3 की दो क्रमागत छूट के बाद बेचा जाता है। शुद्ध विक्रय मूल्य क्या है?"],
  [/A sum of\s+₹?(\d+)\s+amounts to\s+₹?(\d+)\s+in\s+(\d+)\s+years at simple interest\.?\s*Find the annual rate of interest\.?/gi, "₹$1 की धनराशि साधारण ब्याज पर $3 वर्षों में ₹$2 हो जाती है। वार्षिक ब्याज दर ज्ञात कीजिए।"],
  [/What will be the compound interest on a sum of\s+₹?(\d+)\s+at\s+(\d+%)\s+per annum for\s+(\d+)\s+years compounded annually\?/gi, "वार्षिक चक्रवृद्धि आधार पर $3 वर्षों के लिए $2 प्रति वर्ष की दर से ₹$1 की धनराशि पर चक्रवृद्धि ब्याज क्या होगा?"],
  [/The ratio of monthly incomes of A and B is\s+(\d+\s*:\s*\d+)\s+and the ratio of their expenditures is\s+(\d+\s*:\s*\d+)\.?\s*If each saves\s+₹?(\d+),\s*find A's income\.?/gi, "A और B की मासिक आय का अनुपात $1 है और उनके व्यय का अनुपात $2 है। यदि प्रत्येक ₹$3 की बचत करता है, तो A की आय ज्ञात कीजिए।"],
  [/The present ratio of ages of father and son is\s+(\d+\s*:\s*\d+)\.?\s*After\s+(\d+)\s+years,\s*the ratio becomes\s+(\d+\s*:\s*\d+)\.?\s*What is the father's current age\?/gi, "पिता और पुत्र की वर्तमान आयु का अनुपात $1 है। $2 वर्ष बाद, यह अनुपात $3 हो जाता है। पिता की वर्तमान आयु क्या है?"],
  [/In a mixture of\s+(\d+)\s+liters,\s*the ratio of milk and water is\s+(\d+\s*:\s*\d+)\.?\s*How much water should be added so that the ratio becomes\s+(\d+\s*:\s*\d+)\?/gi, "$1 लीटर के मिश्रण में दूध और पानी का अनुपात $2 है। इसमें कितना पानी मिलाया जाना चाहिए ताकि अनुपात $3 हो जाए?"],
  [/A can finish a work in\s+(\d+)\s+days and B can finish the same work in\s+(\d+)\s+days\.?\s*If they work together,\s*in how many days will the work be completed\?/gi, "A एक कार्य को $1 दिनों में पूरा कर सकता है और B उसी कार्य को $2 दिनों में पूरा कर सकता है। यदि वे एक साथ काम करते हैं, तो काम कितने दिनों में पूरा होगा?"],
  [/A train of length\s+(\d+)\s+m running at\s+(\d+)\s+km\/h crosses a platform of length\s+(\d+)\s+m\.?\s*In how many seconds will the train completely cross the platform\?/gi, "$2 किमी/घंटा की गति से चल रही $1 मीटर लंबी एक ट्रेन $3 मीटर लंबे प्लेटफॉर्म को पार करती है। ट्रेन कितने सेकंड में प्लेटफॉर्म को पूरी तरह से पार कर लेगी?"],
  [/Find the value of:?\s*/gi, "मान ज्ञात कीजिए: "],
  [/Evaluate the value of:?\s*/gi, "मान ज्ञात कीजिए: "],
  [/Solve the question according to standard TCS SSC Pattern\.?/gi, "मानक टीसीएस एसएससी पैटर्न के अनुसार प्रश्न को हल करें।"],
];

const UNIT_TRANSLATIONS: Record<string, string> = {
  "km/h": "किमी/घंटा",
  "m/s": "मी/सेकंड",
  "days": "दिन",
  "hours": "घंटे",
  "mins": "मिनट",
  "seconds": "सेकंड",
  "cm": "सेमी",
  "meters": "मीटर",
  "liters": "लीटर",
  "rupees": "रुपये",
};

/**
 * Translates an English question text into Hindi.
 */
export function translateTextToHindi(englishText: string): string {
  if (!englishText) return "";

  // If text already has substantial Hindi Devanagari characters, return as is
  const devanagariCount = (englishText.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 20) {
    return englishText;
  }

  let hindi = englishText;

  // Apply pattern replacements
  for (const [pattern, replacement] of TERM_REPLACEMENTS) {
    hindi = hindi.replace(pattern, replacement);
  }

  // Common vocabulary replacements
  const wordMap: Record<string, string> = {
    "Tabular Chart": "तालिका चार्ट (Tabular Chart)",
    "Bar Graph": "बार ग्राफ (Bar Graph)",
    "Pie Chart": "पाई चार्ट (Pie Chart)",
    "Line Graph": "लाइन ग्राफ (Line Graph)",
    "Mixed Graphs": "मिश्रित ग्राफ (Mixed Graphs)",
    "Type:": "प्रकार:",
    "Percentage": "प्रतिशत",
    "Profit": "लाभ",
    "Loss": "हानि",
    "Discount": "छूट / बट्टा",
    "Simple Interest": "साधारण ब्याज",
    "Compound Interest": "चक्रवृद्धि ब्याज",
    "Ratio": "अनुपात",
    "Proportion": "समानुपात",
    "Average": "औसत",
    "Time and Work": "समय और कार्य",
    "Time & Work": "समय और कार्य",
    "Pipe & Cistern": "नल और टंकी",
    "Speed": "चाल / गति",
    "Distance": "दूरी",
    "Production": "उत्पादन",
    "Quantity": "मात्रा",
    "Year": "वर्ष",
    "Item": "वस्तु",
    "Select Your Option:": "अपना विकल्प चुनें:",
  };

  for (const [en, hi] of Object.entries(wordMap)) {
    const reg = new RegExp(`\\b${en}\\b`, "gi");
    hindi = hindi.replace(reg, hi);
  }

  return hindi;
}

/**
 * Translates an option text to Hindi if applicable (e.g. units like km/h, days).
 */
export function translateOptionToHindi(optionText: string): string {
  if (!optionText) return "";
  let translated = optionText;
  for (const [enUnit, hiUnit] of Object.entries(UNIT_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${enUnit}\\b`, "gi");
    translated = translated.replace(regex, hiUnit);
  }
  return translated;
}

/**
 * Translates step-by-step explanation to Hindi.
 */
export function translateExplanationToHindi(explanation: string | null | undefined): string {
  if (!explanation) return "";
  let hi = explanation;
  hi = hi.replace(/Detailed solution for Q\.(\d+)/gi, "प्रश्न $1 का विस्तृत हल");
  hi = hi.replace(/Standard TCS approach confirms option\s*\(([A-D])\)\s*as correct\.?/gi, "मानक TCS पद्धति के अनुसार विकल्प ($1) सही उत्तर है।");
  hi = hi.replace(/Answer option\s*\(([A-D])\)\s*is verified by TCS standard methodology\.?/gi, "उत्तर विकल्प ($1) TCS मानक पद्धति द्वारा सत्यापित है।");
  return hi;
}
