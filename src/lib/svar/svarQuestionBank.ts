/**
 * SVAR & Accenture Spoken English & Communication Assessment Question Bank
 * Features authentic questions categorized into Easy, Medium, and Hard tiers.
 * 
 * Supports both:
 * 1. ACCENTURE_VERSANT Mode (Reading, Repeat Sentences, Short Answers, Sentence Builds, Story Retelling, Open Speaking)
 * 2. SVAR_CORPORATE Mode (Pronunciation, Fluency & Pace, Listening Comprehension, Grammar Correction, Read Aloud, Spontaneous)
 */

export interface SvarQuestion {
  id: string;
  sectionId: string;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  targetText?: string;
  phonetic?: string;
  stressNote?: string;
  tip?: string;
  audioScript?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: number;
  expectedShortAnswer?: string[];
  jumbledFragments?: string[];
  correctSentence?: string;
  rule?: string;
  storyPrompt?: {
    character: string;
    setting: string;
    conflict: string;
    resolution: string;
  };
  openTopic?: string;
  prepFormulaTips?: {
    point: string;
    reason: string;
    example: string;
    summary: string;
  };
}

export interface SvarSectionDefinition {
  id: string;
  title: string;
  code: string;
  description: string;
  defaultQuestionCount: number;
  accentureEquivalent: string;
  weight: number;
  icon: string;
}

export const SVAR_SECTIONS: SvarSectionDefinition[] = [
  {
    id: "reading",
    title: "Section 1 — Reading (Sentence Pronunciation)",
    code: "SEC-1",
    description: "Read the displayed sentence aloud clearly into the microphone. AI evaluates pronunciation, word stress, and punctuation pauses.",
    defaultQuestionCount: 8,
    accentureEquivalent: "Part A: Reading",
    weight: 15,
    icon: "📖",
  },
  {
    id: "repeat_sentences",
    title: "Section 2 — Repeat Sentences",
    code: "SEC-2",
    description: "Listen to the sentence audio carefully. After the beep, repeat the exact sentence in natural flow without unnecessary pauses.",
    defaultQuestionCount: 16,
    accentureEquivalent: "Part B: Repeat Sentences",
    weight: 25,
    icon: "🔁",
  },
  {
    id: "short_answers",
    title: "Section 3 — Questions (Short Answers)",
    code: "SEC-3",
    description: "Listen to the question and give a simple, direct answer in one or two words only. Do not speak long sentences.",
    defaultQuestionCount: 20,
    accentureEquivalent: "Part C: Questions",
    weight: 15,
    icon: "❓",
  },
  {
    id: "sentence_builds",
    title: "Section 4 — Sentence Builds",
    code: "SEC-4",
    description: "Listen to the three jumbled sentence fragments. Rearrange them mentally and speak the complete, grammatically correct sentence.",
    defaultQuestionCount: 10,
    accentureEquivalent: "Part D: Sentence Builds",
    weight: 15,
    icon: "🧩",
  },
  {
    id: "story_retelling",
    title: "Section 5 — Story Retelling",
    code: "SEC-5",
    description: "Listen to the short narrative story. After the 30-second preparation countdown, retell the story in your own words covering Character, Conflict, and Resolution.",
    defaultQuestionCount: 3,
    accentureEquivalent: "Part E: Story Retelling",
    weight: 15,
    icon: "📚",
  },
  {
    id: "open_speaking",
    title: "Section 6 — Open Speaking (Spontaneous)",
    code: "SEC-6",
    description: "Speak on the general prompt for 45 to 60 seconds. Use the PREP Framework (Point, Reason, Example, Point Summary) with zero filler words.",
    defaultQuestionCount: 2,
    accentureEquivalent: "Part F: Open Questions",
    weight: 15,
    icon: "🎙️",
  },
  {
    id: "listening_comp",
    title: "SVAR Module — Listening Comprehension",
    code: "SEC-L",
    description: "Listen to corporate audio scenarios and answer multiple-choice questions based on facts, numbers, and instructions.",
    defaultQuestionCount: 5,
    accentureEquivalent: "Corporate SVAR Listening",
    weight: 15,
    icon: "🎧",
  },
  {
    id: "grammar_correction",
    title: "SVAR Module — Grammar & Sentence Correction",
    code: "SEC-G",
    description: "Identify errors, correct subject-verb agreements, prepositions, and tenses in professional conversational English.",
    defaultQuestionCount: 5,
    accentureEquivalent: "Corporate SVAR Grammar",
    weight: 15,
    icon: "✍️",
  },
];

export const SVAR_QUESTION_BANK: Record<string, SvarQuestion[]> = {
  // -------------------------------------------------------------
  // SECTION 1: READING (SENTENCE PRONUNCIATION) - 30 Questions
  // -------------------------------------------------------------
  reading: [
    // 10 EASY
    {
      id: "rd_e01",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "The team will meet in the main conference room tomorrow morning.",
      phonetic: "/ðə tiːm wɪl miːt ɪn ðə meɪn ˈkɒnfərəns ruːm təˈmɒroʊ ˈmɔːrnɪŋ/",
      stressNote: "Stress on MAIN, CON-ference, and MOR-ning.",
      tip: "Ensure clear pronunciation of 'tomorrow' without slurring syllables.",
    },
    {
      id: "rd_e02",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "Please submit your completed project report by five o'clock.",
      phonetic: "/pliːz səbˈmɪt jɔːr kəmˈpliːtɪd ˈprɒdʒɛkt rɪˈpɔːrt baɪ faɪv əˈklɒk/",
      stressNote: "Notice the rising intonation on 'project' and falling on 'five o'clock'.",
      tip: "Pronounce the final '-ed' in 'completed' as /ɪd/.",
    },
    {
      id: "rd_e03",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "All employees should wear their identification badges at all times.",
      phonetic: "/ɔːl ɪmˈplɔɪiːz ʃʊd wɛər ðɛər aɪˌdɛntɪfɪˈkeɪʃən ˈbædʒɪz æt ɔːl taɪmz/",
      stressNote: "Stress on em-PLOY-ees and i-den-ti-fi-CA-tion.",
      tip: "Keep a steady rhythm through 'identification'.",
    },
    {
      id: "rd_e04",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "Our company provides comprehensive health insurance for all staff members.",
      phonetic: "/ˈaʊər ˈkʌmpəni prəˈvaɪdz ˌkɒmprɪˈhɛnsɪv hɛlθ ɪnˈʃʊərəns fɔːr ɔːl stæf ˈmɛmbərz/",
      stressNote: "Stress on COM-pany, com-pre-HEN-sive, and IN-su-rance.",
      tip: "Articulate the 'th' in 'health' clearly without turning it into 's'.",
    },
    {
      id: "rd_e05",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "The new software update will be installed automatically tonight.",
      phonetic: "/ðə njuː ˈsɒftwɛər ˈʌpdeɪt wɪl biː ɪnˈstɔːld ˌɔːtəˈmætɪkli təˈnaɪt/",
      stressNote: "Stress on SOFT-ware, UP-date, and au-to-MA-ti-cally.",
      tip: "Smoothly connect 'will be installed' without unnatural pauses.",
    },
    {
      id: "rd_e06",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "Customer service representatives are available twenty-four hours a day.",
      phonetic: "/ˈkʌstəmər ˈsɜːrvɪs ˌrɛprɪˈzɛntətɪvz ɑːr əˈveɪləbəl ˈtwɛnti fɔːr ˈaʊərz ə deɪ/",
      stressNote: "Stress on CUS-tomer, SER-vice, and a-VAIL-able.",
      tip: "Do not swallow the ending 's' on 'representatives'.",
    },
    {
      id: "rd_e07",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "Fresh fruit and hot coffee are served in the cafeteria daily.",
      phonetic: "/frɛʃ fruːt ænd hɒt ˈkɒfi ɑːr sɜːrvd ɪn ðə ˌkæfəˈtɪəriə ˈdeɪli/",
      stressNote: "Stress on FRUIT, COF-fee, and ca-fe-TE-ria.",
      tip: "Pronounce 'fruit' with a clean /uː/ sound without an extra 'i'.",
    },
    {
      id: "rd_e08",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "We received very positive feedback from our international clients.",
      phonetic: "/wiː rɪˈsiːvd ˈvɛri ˈpɒzətɪv ˈfiːdbæk frɒm ˈaʊər ˌɪntərˈnæʃənl ˈklaɪənts/",
      stressNote: "Stress on POS-i-tive, FEED-back, and in-ter-NA-tion-al.",
      tip: "Clear ending /ts/ sound on 'clients'.",
    },
    {
      id: "rd_e09",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "Please verify your email address to complete the registration process.",
      phonetic: "/pliːz ˈvɛrɪfaɪ jɔːr ˈiːmeɪl əˈdrɛs tuː kəmˈpliːt ðə ˌrɛdʒɪˈstreɪʃən ˈprɒsɛs/",
      stressNote: "Stress on VER-i-fy, COM-plete, and re-gis-TRA-tion.",
      tip: "Notice the difference between 'v' in 'verify' and 'w'.",
    },
    {
      id: "rd_e10",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Easy",
      targetText: "The train departs from platform four in approximately ten minutes.",
      phonetic: "/ðə treɪn dɪˈpɑːrts frɒm ˈplætfɔːrm fɔːr ɪn əˈprɒksɪmətli tɛn ˈmɪnɪts/",
      stressNote: "Stress on de-PARTS, PLAT-form, and ap-PROX-i-mate-ly.",
      tip: "Keep the consonant cluster in 'approximately' crisp.",
    },

    // 10 MEDIUM
    {
      id: "rd_m01",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Although the system encountered unexpected latency, the redundancy protocols prevented data loss.",
      phonetic: "/ɔːlˈðoʊ ðə ˈsɪstəm ɪnˈkaʊntərd ˌʌnɪkˈspɛktɪd ˈleɪtənsi, ðə rɪˈdʌndənsi ˈproʊtəkɒlz prɪˈvɛntɪd ˈdeɪtə lɒs/",
      stressNote: "Pause slightly at the comma after 'latency'. Stress on re-DUN-dan-cy.",
      tip: "Do not rush through 'unexpected latency'; pronounce every syllable.",
    },
    {
      id: "rd_m02",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "The quarterly financial forecast indicated a substantial increase in international market penetration.",
      phonetic: "/ðə ˈkwɔːrtərli faɪˈnænʃəl ˈfɔːrkæst ˈɪndɪkeɪtɪd ə səbˈstænʃəl ˈɪnkriːs ɪn ˌɪntərˈnæʃənl ˈmɑːrkɪt ˌpɛnɪˈtreɪʃən/",
      stressNote: "Stress on QUAR-ter-ly, fi-NAN-cial, and sub-STAN-tial.",
      tip: "Pronounce 'penetration' smoothly: pen-e-TRA-tion.",
    },
    {
      id: "rd_m03",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Effective communication between cross-functional departments is essential for organizational efficiency.",
      phonetic: "/ɪˈfɛktɪv kəˌmjuːnɪˈkeɪʃən bɪˈtwiːn krɒs ˈfʌŋkʃənl dɪˈpɑːrtmənts ɪz ɪˈsɛnʃəl fɔːr ˌɔːrɡənaɪˈzeɪʃənl ɪˈfɪʃənsi/",
      stressNote: "Stress on com-mu-ni-CA-tion, es-SEN-tial, and or-gan-i-za-tion-al.",
      tip: "Maintain consistent volume across the multi-syllable adjectives.",
    },
    {
      id: "rd_m04",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Preliminary research demonstrated that renewable energy sources significantly diminish carbon emissions.",
      phonetic: "/prɪˈlɪmɪnəri rɪˈsɜːrtʃ ˈdɛmənstreɪtɪd ðæt rɪˈnjuːəbəl ˈɛnərdʒi sɔːrsɪz sɪɡˈnɪfɪkəntli dɪˈmɪnɪʃ ˈkɑːrbən ɪˈmɪʃənz/",
      stressNote: "Stress on pre-LIM-i-na-ry, sig-NIF-i-cant-ly, and e-MIS-sions.",
      tip: "Notice the /ʃ/ sound in 'diminish' and 'emissions'.",
    },
    {
      id: "rd_m05",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Engineers implemented sophisticated security mechanisms to counteract unauthorized cyber vulnerabilities.",
      phonetic: "/ˌɛndʒɪˈnɪərz ˈɪmplɪmɛntɪd səˈfɪstɪkeɪtɪd sɪˈkjʊərɪti ˈmɛkənɪzəmz tuː ˌkaʊntərˈækt ʌnˈɔːθəraɪzd ˈsaɪbər ˌvʌlnərəˈbɪlɪtiz/",
      stressNote: "Stress on so-PHIS-ti-ca-ted, MECH-a-nisms, and vul-ner-a-BIL-i-ties.",
      tip: "Break 'sophisticated' into 5 clear beats: so-phis-ti-ca-ted.",
    },
    {
      id: "rd_m06",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Customer satisfaction elevated dramatically following the introduction of the intuitive mobile interface.",
      phonetic: "/ˈkʌstəmər ˌsætɪsˈfækʃən ˈɛlɪveɪtɪd drəˈmætɪkli ˈfɒloʊɪŋ ðə ˌɪntrəˈdʌkʃən ɒv ði ɪnˈtjuːɪtɪv ˈmoʊbaɪl ˈɪntərfeɪs/",
      stressNote: "Stress on dra-MAT-i-cal-ly, in-TRO-duc-tion, and in-TU-i-tive.",
      tip: "Pronounce 'intuitive' as in-TOO-i-tiv.",
    },
    {
      id: "rd_m07",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "The laboratory analyst documented meticulous observations regarding the chemical reaction rates.",
      phonetic: "/ðə ˈlæbrətɔːri ˈænəlɪst ˈdɒkjʊmɛntɪd mɪˈtɪkjʊləs ˌɒbzərˈveɪʃənz rɪˈɡɑːrdɪŋ ðə ˈkɛmɪkəl riˈækʃən reɪts/",
      stressNote: "Stress on me-TIC-u-lous and ob-ser-VA-tions.",
      tip: "Keep the 't' in 'meticulous' crisp.",
    },
    {
      id: "rd_m08",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Prior to finalizing the contract, corporate attorneys reviewed the intellectual property clauses.",
      phonetic: "/ˈpraɪər tuː ˈfaɪnəlaɪzɪŋ ðə ˈkɒntrækt, ˈkɔːrpərət əˈtɜːrniz rɪˈvjuːd ði ˌɪntəˈlɛktʃuəl ˈprɒpərti ˈklɔːzɪz/",
      stressNote: "Pause after 'contract'. Stress on in-tel-LEC-tu-al and PROP-er-ty.",
      tip: "Pronounce 'clauses' with a clear /zɪz/ plural ending.",
    },
    {
      id: "rd_m09",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Statistical algorithms successfully detected anomalous transaction patterns across multiple banking servers.",
      phonetic: "/stəˈtɪstɪkəl ˈælɡərɪðəmz səkˈsɛsfəli dɪˈtɛktɪd əˈnɒmələs trænˈzækʃən ˈpætərnz əˈkrɒs ˈmʌltɪpəl ˈbæŋkɪŋ ˈsɜːrvərz/",
      stressNote: "Stress on al-go-RITH-ms and a-NOM-a-lous.",
      tip: "Do not stumble on 'anomalous'; practice a-NOM-uh-luhs.",
    },
    {
      id: "rd_m10",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Medium",
      targetText: "Sustainable agricultural initiatives aim to conserve biodiversity while maximizing seasonal crop yields.",
      phonetic: "/səˈsteɪnəbəl ˌæɡrɪˈkʌltʃərəl ɪˈnɪʃətɪvz eɪm tuː kənˈsɜːrv ˌbaɪoʊdaɪˈvɜːrsɪti waɪl ˈmæksɪmaɪzɪŋ ˈsiːzənl krɒp jiːldz/",
      stressNote: "Stress on sus-TAIN-a-ble, bio-di-VER-si-ty, and MAX-i-miz-ing.",
      tip: "Pronounce 'yields' as /jiːldz/ with a clean final consonant blend.",
    },

    // 10 HARD
    {
      id: "rd_h01",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "The meteorological department predicted sporadic precipitation across the northwestern archipelago.",
      phonetic: "/ðə ˌmiːtiərəˈlɒdʒɪkəl dɪˈpɑːrtmənt prɪˈdɪktɪd spəˈrædɪk prɪˌsɪpɪˈteɪʃən əˈkrɒs ðə ˌnɔːrθˈwɛstərn ˌɑːrkɪˈpɛləɡoʊ/",
      stressNote: "Stress on me-te-or-o-LOG-i-cal, spo-RAD-ic, and ar-chi-PEL-a-go.",
      tip: "Pronounce 'archipelago' as /ˌɑːrkɪˈpɛləɡoʊ/ with a hard 'k' sound.",
    },
    {
      id: "rd_h02",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Entrepreneurial initiatives in decentralized finance necessitate rigorous regulatory compliance and auditing.",
      phonetic: "/ˌɒntrəprəˈnɜːriəl ɪˈnɪʃətɪvz ɪn diːˈsɛntrəlaɪzd faɪˈnæns nɪˈsɛsɪteɪt ˈrɪɡərəs ˈrɛɡjʊlətɔːri kəmˈplaɪəns ænd ˈɔːdɪtɪŋ/",
      stressNote: "Stress on en-tre-pre-NEUR-i-al, ne-CES-si-tate, and REG-u-la-to-ry.",
      tip: "Start 'entrepreneurial' cleanly without inserting an extra 'm'.",
    },
    {
      id: "rd_h03",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Physiological adaptations in high-altitude mammals exemplify evolutionary biological resilience.",
      phonetic: "/ˌfɪziəˈlɒdʒɪkəl ˌædæpˈteɪʃənz ɪn haɪ ˈæltɪtjuːd ˈmæməlz ɪɡˈzɛmplɪfaɪ ˌiːvəˈluːʃənɛri ˌbaɪəˈlɒdʒɪkəl rɪˈzɪljəns/",
      stressNote: "Stress on phys-i-o-LOG-i-cal, ex-EM-pli-fy, and re-SIL-ience.",
      tip: "Ensure clear /z/ in 'resilience' (/rɪˈzɪljəns/).",
    },
    {
      id: "rd_h04",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "The pharmaceutical conglomerate synthesized innovative therapeutic compounds to combat chronic neurodegenerative diseases.",
      phonetic: "/ðə ˌfɑːrməˈsjuːtɪkəl kənˈɡlɒmərɪt ˈsɪnθɪsaɪzd ˈɪnəvətɪv ˌθɛrəˈpjuːtɪk ˈkɒmpaʊndz tuː ˈkɒmbæt ˈkrɒnɪk ˌnjʊəroʊdɪˈdʒɛnərətɪv dɪˈziːzɪz/",
      stressNote: "Stress on phar-ma-CEU-ti-cal, ther-a-PEU-tic, and neu-ro-de-GEN-er-a-tive.",
      tip: "Notice the voiceless /θ/ in 'synthesized' and 'therapeutic'.",
    },
    {
      id: "rd_h05",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Simultaneous multilateral negotiations dissolved persistent ideological controversies regarding territorial sovereignty.",
      phonetic: "/ˌsɪməlˈteɪniəs ˌmʌltiˈlætərəl nɪˌɡoʊʃiˈeɪʃənz dɪˈzɒlvd pərˈsɪstənt ˌaɪdiəˈlɒdʒɪkəl ˈkɒntrəvɜːrsiz rɪˈɡɑːrdɪŋ ˌtɛrɪˈtɔːriəl ˈsɒvrɪnti/",
      stressNote: "Stress on si-mul-TA-ne-ous, con-tro-VER-sies, and SOV-ereign-ty.",
      tip: "Pronounce 'sovereignty' in three beats: SOV-rin-tee.",
    },
    {
      id: "rd_h06",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Quantum computational architectures exhibit unprecedented algorithmic capabilities for cryptographic decryption.",
      phonetic: "/ˈkwɒntəm ˌkɒmpjʊˈteɪʃənl ˈɑːrkɪtɛktʃərz ɪɡˈzɪbɪt ʌnˈprɛsɪdɛntɪd ˌælɡəˈrɪðmɪk ˌkeɪpəˈbɪlɪtiz fɔːr ˌkrɪptəˈɡræfɪk dɪˈkrɪpʃən/",
      stressNote: "Stress on un-PREC-e-dent-ed and cryp-to-GRAPH-ic.",
      tip: "Make sure 'exhibit' has the silent 'h' sound: /ɪɡˈzɪbɪt/.",
    },
    {
      id: "rd_h07",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Anesthesiologists continuously monitor hemodynamic equilibrium throughout complex laparoscopic surgical procedures.",
      phonetic: "/ˌænəsˌθiːziˈɒlədʒɪsts kənˈtɪnjuəsli ˈmɒnɪtər ˌhiːmoʊdaɪˈnæmɪk ˌiːkwɪˈlɪbriəm θruːˈaʊt ˈkɒmplɛks ˌlæpərəˈskɒpɪk ˈsɜːrdʒɪkəl prəˈsiːdʒərz/",
      stressNote: "Stress on an-es-the-si-OL-o-gists, e-qui-LIB-ri-um, and lap-a-ro-SCOP-ic.",
      tip: "Do not rush the complex vowel transitions in 'anesthesiologists'.",
    },
    {
      id: "rd_h08",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Macroeconomic volatility exacerbated by supply chain disruptions precipitated widespread inflationary pressures.",
      phonetic: "/ˌmækroʊˌiːkəˈnɒmɪk ˌvɒləˈtɪlɪti ɪɡˈzæsərbeɪtɪd baɪ səˈplaɪ tʃeɪn dɪsˈrʌpʃənz prɪˈsɪpɪteɪtɪd ˈwaɪdsprɛd ɪnˈfleɪʃənɛri ˈprɛʃərz/",
      stressNote: "Stress on ex-AC-er-bat-ed and pre-CIP-i-tat-ed.",
      tip: "Clear /ks/ sound in 'exacerbated' (/ɪɡˈzæsərbeɪtɪd/).",
    },
    {
      id: "rd_h09",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Philosophical epistemology distinguishes empirical observation from deductive transcendental rationalism.",
      phonetic: "/ˌfɪləˈsɒfɪkəl ɪˌpɪstɪˈmɒlədʒi dɪˈstɪŋɡwɪʃɪz ɪmˈpɪrɪkəl ˌɒbzərˈveɪʃən frɒm dɪˈdʌktɪv ˌtrænsɛnˈdɛntl ˈræʃənəlɪzəm/",
      stressNote: "Stress on e-pis-te-MOL-o-gy, em-PIR-i-cal, and RASH-o-nal-ism.",
      tip: "Pronounce 'epistemology' smoothly: eh-pis-tuh-MOL-uh-jee.",
    },
    {
      id: "rd_h10",
      sectionId: "reading",
      type: "sentence_reading",
      difficulty: "Hard",
      targetText: "Architectural acoustic engineers minimize reverberation by strategically deploying sound-absorbent porous materials.",
      phonetic: "/ˌɑːrkɪˈtɛktʃərəl əˈkuːstɪk ˌɛndʒɪˈnɪərz ˈmɪnɪmaɪz rɪˌvɜːrbəˈreɪʃən baɪ strəˈtiːdʒɪkli dɪˈplɔɪɪŋ saʊnd əbˈzɔːrbənt ˈpɔːrəs məˈtɪəriəlz/",
      stressNote: "Stress on a-COUS-tic, re-ver-ber-A-tion, and stra-TE-gi-cal-ly.",
      tip: "Distinct 'reverberation' with emphasis on the third syllable.",
    },
  ],

  // -------------------------------------------------------------
  // SECTION 2: REPEAT SENTENCES - 30 Questions
  // -------------------------------------------------------------
  repeat_sentences: [
    // 10 EASY
    {
      id: "rs_e01",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "The meeting will start in five minutes.",
      targetText: "The meeting will start in five minutes.",
      tip: "Remember the word sequence: meeting -> start -> five minutes.",
    },
    {
      id: "rs_e02",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "Please leave your feedback on the portal.",
      targetText: "Please leave your feedback on the portal.",
      tip: "Repeat clearly without pausing between words.",
    },
    {
      id: "rs_e03",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "Turn off your computers before leaving the office.",
      targetText: "Turn off your computers before leaving the office.",
      tip: "Match the natural rhythm and intonation.",
    },
    {
      id: "rs_e04",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "She has sent the updated schedule by email.",
      targetText: "She has sent the updated schedule by email.",
      tip: "Don't miss the word 'updated'.",
    },
    {
      id: "rs_e05",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "The library is closed on Sunday afternoons.",
      targetText: "The library is closed on Sunday afternoons.",
      tip: "Focus on the days and time indicator.",
    },
    {
      id: "rs_e06",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "We need three volunteers for the upcoming event.",
      targetText: "We need three volunteers for the upcoming event.",
      tip: "Catch the number 'three' and word 'volunteers'.",
    },
    {
      id: "rs_e07",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "He forgot his access card on the desk.",
      targetText: "He forgot his access card on the desk.",
      tip: "Remember the location 'on the desk'.",
    },
    {
      id: "rs_e08",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "All project files have been saved successfully.",
      targetText: "All project files have been saved successfully.",
      tip: "Deliver with a confident, steady tone.",
    },
    {
      id: "rs_e09",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "You can collect your badge at the reception.",
      targetText: "You can collect your badge at the reception.",
      tip: "Keep the words 'at the reception' connected.",
    },
    {
      id: "rs_e10",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Easy",
      audioScript: "Breakfast will be served at eight o'clock tomorrow.",
      targetText: "Breakfast will be served at eight o'clock tomorrow.",
      tip: "Clear pronunciation of 'breakfast' and 'eight o'clock'.",
    },

    // 10 MEDIUM
    {
      id: "rs_m01",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "All team members should complete their performance reviews before Wednesday afternoon.",
      targetText: "All team members should complete their performance reviews before Wednesday afternoon.",
      tip: "Hold the mental image: team members -> reviews -> Wednesday afternoon.",
    },
    {
      id: "rs_m02",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "Our technical support team will investigate the network connectivity issue immediately.",
      targetText: "Our technical support team will investigate the network connectivity issue immediately.",
      tip: "Notice the adverb 'immediately' at the very end.",
    },
    {
      id: "rs_m03",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "The marketing director delivered an inspiring presentation about emerging digital trends.",
      targetText: "The marketing director delivered an inspiring presentation about emerging digital trends.",
      tip: "Keep the pace natural: marketing director -> inspiring presentation -> digital trends.",
    },
    {
      id: "rs_m04",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "Students are advised to review the examination syllabus thoroughly before next Monday.",
      targetText: "Students are advised to review the examination syllabus thoroughly before next Monday.",
      tip: "Do not replace 'thoroughly' with 'completely'.",
    },
    {
      id: "rs_m05",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "The newly renovated laboratory features advanced equipment for scientific research.",
      targetText: "The newly renovated laboratory features advanced equipment for scientific research.",
      tip: "Repeat 'newly renovated laboratory' as a continuous phrase.",
    },
    {
      id: "rs_m06",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "Please ensure that all confidential documents are locked in the cabinet securely.",
      targetText: "Please ensure that all confidential documents are locked in the cabinet securely.",
      tip: "Catch the adjective 'confidential' and adverb 'securely'.",
    },
    {
      id: "rs_m07",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "Several candidates demonstrated outstanding technical expertise during the initial interview.",
      targetText: "Several candidates demonstrated outstanding technical expertise during the initial interview.",
      tip: "Focus on 'demonstrated outstanding technical expertise'.",
    },
    {
      id: "rs_m08",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "The flight was delayed due to severe thunderstorms over the southern region.",
      targetText: "The flight was delayed due to severe thunderstorms over the southern region.",
      tip: "Repeat the exact cause: 'severe thunderstorms over the southern region'.",
    },
    {
      id: "rs_m09",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "Our human resources department has introduced flexible working hours for all employees.",
      targetText: "Our human resources department has introduced flexible working hours for all employees.",
      tip: "Chunk as: HR department -> flexible working hours -> all employees.",
    },
    {
      id: "rs_m10",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Medium",
      audioScript: "The software application crashed unexpectedly while processing large financial transactions.",
      targetText: "The software application crashed unexpectedly while processing large financial transactions.",
      tip: "Ensure you don't drop 'large financial transactions'.",
    },

    // 10 HARD
    {
      id: "rs_h01",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "The annual financial audit revealed a remarkable increase in international market penetration across developing economies.",
      targetText: "The annual financial audit revealed a remarkable increase in international market penetration across developing economies.",
      tip: "Accenture Hack: Even if you forget one middle word, KEEP SPEAKING smoothly without pausing!",
    },
    {
      id: "rs_h02",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "Participants are strictly requested to silence all electronic devices during the international keynote presentation.",
      targetText: "Participants are strictly requested to silence all electronic devices during the international keynote presentation.",
      tip: "Repeat with confidence right after the beep.",
    },
    {
      id: "rs_h03",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "The senior architect emphasized the necessity of implementing rigorous automated security testing before deployment.",
      targetText: "The senior architect emphasized the necessity of implementing rigorous automated security testing before deployment.",
      tip: "Remember: senior architect -> emphasized necessity -> automated security testing.",
    },
    {
      id: "rs_h04",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "Recent macroeconomic developments suggest that international consumer demand will stabilize significantly next quarter.",
      targetText: "Recent macroeconomic developments suggest that international consumer demand will stabilize significantly next quarter.",
      tip: "Maintain a steady 130 WPM speaking rhythm without hesitation.",
    },
    {
      id: "rs_h05",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "The research committee published comprehensive guidelines regarding ethical considerations in artificial intelligence development.",
      targetText: "The research committee published comprehensive guidelines regarding ethical considerations in artificial intelligence development.",
      tip: "Break into 2 thoughts: research committee published guidelines -> ethical considerations in AI.",
    },
    {
      id: "rs_h06",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "Despite facing considerable supply chain constraints, the manufacturing facility exceeded its quarterly production targets.",
      targetText: "Despite facing considerable supply chain constraints, the manufacturing facility exceeded its quarterly production targets.",
      tip: "Notice the contrast: supply chain constraints vs exceeded production targets.",
    },
    {
      id: "rs_h07",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "Our multidisciplinary engineering team collaborates effectively across multiple global time zones and continents.",
      targetText: "Our multidisciplinary engineering team collaborates effectively across multiple global time zones and continents.",
      tip: "Pronounce 'multidisciplinary' smoothly: mul-ti-dis-ci-pli-na-ry.",
    },
    {
      id: "rs_h08",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "Substantial investments in renewable energy infrastructure will accelerate the transition toward environmental sustainability.",
      targetText: "Substantial investments in renewable energy infrastructure will accelerate the transition toward environmental sustainability.",
      tip: "Retain key terms: investments -> infrastructure -> accelerate transition -> sustainability.",
    },
    {
      id: "rs_h09",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "The keynote speaker eloquently addressed historical misconceptions surrounding modern algorithmic decision-making models.",
      targetText: "The keynote speaker eloquently addressed historical misconceptions surrounding modern algorithmic decision-making models.",
      tip: "Deliver the phrase 'modern algorithmic decision-making models' with clean clarity.",
    },
    {
      id: "rs_h10",
      sectionId: "repeat_sentences",
      type: "repeat_sentence",
      difficulty: "Hard",
      audioScript: "Thorough documentation of system architectures is indispensable for maintaining seamless collaborative software engineering workflows.",
      targetText: "Thorough documentation of system architectures is indispensable for maintaining seamless collaborative software engineering workflows.",
      tip: "Flow smoothly through 'indispensable for maintaining seamless collaborative workflows'.",
    },
  ],

  // -------------------------------------------------------------
  // SECTION 3: QUESTIONS (SHORT ANSWERS) - 30 Questions
  // -------------------------------------------------------------
  short_answers: [
    // 10 EASY
    {
      id: "sa_e01",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Would you find sand at a beach or in a forest?",
      questionText: "Would you find sand at a beach or in a forest?",
      expectedShortAnswer: ["at a beach", "beach", "a beach"],
      tip: "Speak 1-2 words directly: 'At a beach'. Do NOT say full sentences.",
    },
    {
      id: "sa_e02",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Do people wear sunglasses on a sunny day or on a rainy night?",
      questionText: "Do people wear sunglasses on a sunny day or on a rainy night?",
      expectedShortAnswer: ["sunny day", "on a sunny day", "a sunny day"],
      tip: "Answer directly: 'On a sunny day'.",
    },
    {
      id: "sa_e03",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Do you use a hammer to drive a nail or to cut wood?",
      questionText: "Do you use a hammer to drive a nail or to cut wood?",
      expectedShortAnswer: ["to drive a nail", "drive a nail", "drive nail"],
      tip: "Answer: 'To drive a nail'.",
    },
    {
      id: "sa_e04",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Which is hotter, ice or boiling water?",
      questionText: "Which is hotter, ice or boiling water?",
      expectedShortAnswer: ["boiling water", "water"],
      tip: "Answer: 'Boiling water'.",
    },
    {
      id: "sa_e05",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "If you want to buy medicine, do you go to a pharmacy or a bakery?",
      questionText: "If you want to buy medicine, do you go to a pharmacy or a bakery?",
      expectedShortAnswer: ["pharmacy", "a pharmacy", "to a pharmacy"],
      tip: "Answer: 'Pharmacy'.",
    },
    {
      id: "sa_e06",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "How many months are there in one year?",
      questionText: "How many months are there in one year?",
      expectedShortAnswer: ["twelve", "12", "twelve months"],
      tip: "Answer: 'Twelve'.",
    },
    {
      id: "sa_e07",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Does a cow produce milk or orange juice?",
      questionText: "Does a cow produce milk or orange juice?",
      expectedShortAnswer: ["milk"],
      tip: "Answer: 'Milk'.",
    },
    {
      id: "sa_e08",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Is midnight at twelve in the day or twelve in the night?",
      questionText: "Is midnight at twelve in the day or twelve in the night?",
      expectedShortAnswer: ["twelve in the night", "night", "at night"],
      tip: "Answer: 'Twelve in the night'.",
    },
    {
      id: "sa_e09",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "What device do you use to tell the time: a watch or a calculator?",
      questionText: "What device do you use to tell the time: a watch or a calculator?",
      expectedShortAnswer: ["a watch", "watch"],
      tip: "Answer: 'A watch'.",
    },
    {
      id: "sa_e10",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Easy",
      audioScript: "Is freezing water called steam or ice?",
      questionText: "Is freezing water called steam or ice?",
      expectedShortAnswer: ["ice"],
      tip: "Answer: 'Ice'.",
    },

    // 10 MEDIUM
    {
      id: "sa_m01",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Does a surgeon perform medical operations or manage legal disputes?",
      questionText: "Does a surgeon perform medical operations or manage legal disputes?",
      expectedShortAnswer: ["medical operations", "operations", "perform medical operations"],
      tip: "Answer: 'Medical operations'.",
    },
    {
      id: "sa_m02",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "If a company has a quarterly review, how many times does it meet in a year?",
      questionText: "If a company has a quarterly review, how many times does it meet in a year?",
      expectedShortAnswer: ["four", "four times", "4"],
      tip: "Quarterly = 4 times. Answer: 'Four times'.",
    },
    {
      id: "sa_m03",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Would you find an anchor on a ship or an airplane?",
      questionText: "Would you find an anchor on a ship or an airplane?",
      expectedShortAnswer: ["on a ship", "ship", "a ship"],
      tip: "Answer: 'On a ship'.",
    },
    {
      id: "sa_m04",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Is a biography a book about someone's life or a book of cooking recipes?",
      questionText: "Is a biography a book about someone's life or a book of cooking recipes?",
      expectedShortAnswer: ["someone's life", "about someone's life", "a person's life"],
      tip: "Answer: 'Someone's life'.",
    },
    {
      id: "sa_m05",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "What do we call a period of ten consecutive years: a decade or a century?",
      questionText: "What do we call a period of ten consecutive years: a decade or a century?",
      expectedShortAnswer: ["a decade", "decade"],
      tip: "Answer: 'A decade'.",
    },
    {
      id: "sa_m06",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Do people celebrate their birthdays once every month or once every year?",
      questionText: "Do people celebrate their birthdays once every month or once every year?",
      expectedShortAnswer: ["once every year", "every year", "once a year"],
      tip: "Answer: 'Once every year'.",
    },
    {
      id: "sa_m07",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Which instrument produces sound by striking keys: a piano or a flute?",
      questionText: "Which instrument produces sound by striking keys: a piano or a flute?",
      expectedShortAnswer: ["a piano", "piano"],
      tip: "Answer: 'A piano'.",
    },
    {
      id: "sa_m08",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "If you borrow money from a bank, are you a lender or a borrower?",
      questionText: "If you borrow money from a bank, are you a lender or a borrower?",
      expectedShortAnswer: ["a borrower", "borrower"],
      tip: "Answer: 'A borrower'.",
    },
    {
      id: "sa_m09",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Would you consult an accountant for tax advice or tooth pain?",
      questionText: "Would you consult an accountant for tax advice or tooth pain?",
      expectedShortAnswer: ["tax advice", "for tax advice", "taxes"],
      tip: "Answer: 'For tax advice'.",
    },
    {
      id: "sa_m10",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Medium",
      audioScript: "Is paper primarily manufactured from wood pulp or petroleum?",
      questionText: "Is paper primarily manufactured from wood pulp or petroleum?",
      expectedShortAnswer: ["wood pulp", "from wood pulp", "wood"],
      tip: "Answer: 'Wood pulp'.",
    },

    // 10 HARD
    {
      id: "sa_h01",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Does an optometrist examine patients' eyesight or cardiovascular health?",
      questionText: "Does an optometrist examine patients' eyesight or cardiovascular health?",
      expectedShortAnswer: ["eyesight", "patients' eyesight", "eyes"],
      tip: "Answer: 'Eyesight'.",
    },
    {
      id: "sa_h02",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Is a triangle with all three equal sides referred to as scalene or equilateral?",
      questionText: "Is a triangle with all three equal sides referred to as scalene or equilateral?",
      expectedShortAnswer: ["equilateral", "an equilateral triangle"],
      tip: "Answer: 'Equilateral'.",
    },
    {
      id: "sa_h03",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "If two events happen simultaneously, do they occur at the same time or at different times?",
      questionText: "If two events happen simultaneously, do they occur at the same time or at different times?",
      expectedShortAnswer: ["at the same time", "same time"],
      tip: "Answer: 'At the same time'.",
    },
    {
      id: "sa_h04",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Does an omnivorous animal consume plants, meat, or both plants and meat?",
      questionText: "Does an omnivorous animal consume plants, meat, or both plants and meat?",
      expectedShortAnswer: ["both", "both plants and meat"],
      tip: "Answer: 'Both plants and meat'.",
    },
    {
      id: "sa_h05",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "In legal terminology, is the person accused of a crime called the plaintiff or the defendant?",
      questionText: "In legal terminology, is the person accused of a crime called the plaintiff or the defendant?",
      expectedShortAnswer: ["the defendant", "defendant"],
      tip: "Answer: 'The defendant'.",
    },
    {
      id: "sa_h06",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Which celestial body orbits around the Earth: the Sun or the Moon?",
      questionText: "Which celestial body orbits around the Earth: the Sun or the Moon?",
      expectedShortAnswer: ["the moon", "moon"],
      tip: "Answer: 'The Moon'.",
    },
    {
      id: "sa_h07",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Is an animal that is active primarily during nighttime called diurnal or nocturnal?",
      questionText: "Is an animal that is active primarily during nighttime called diurnal or nocturnal?",
      expectedShortAnswer: ["nocturnal"],
      tip: "Answer: 'Nocturnal'.",
    },
    {
      id: "sa_h08",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Does a botanist specialize in the scientific study of plants or celestial stars?",
      questionText: "Does a botanist specialize in the scientific study of plants or celestial stars?",
      expectedShortAnswer: ["plants", "study of plants"],
      tip: "Answer: 'Plants'.",
    },
    {
      id: "sa_h09",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "If a document is published semiannually, how many times is it released per year?",
      questionText: "If a document is published semiannually, how many times is it released per year?",
      expectedShortAnswer: ["two", "twice", "two times", "2"],
      tip: "Semiannually = twice a year. Answer: 'Twice'.",
    },
    {
      id: "sa_h10",
      sectionId: "short_answers",
      type: "short_answer",
      difficulty: "Hard",
      audioScript: "Is water classified as a chemical compound or a single element?",
      questionText: "Is water classified as a chemical compound or a single element?",
      expectedShortAnswer: ["chemical compound", "compound", "a compound"],
      tip: "Water is H2O (compound). Answer: 'A chemical compound'.",
    },
  ],

  // -------------------------------------------------------------
  // SECTION 4: SENTENCE BUILDS (JUMBLED SENTENCE REORDERING) - 30 Questions
  // -------------------------------------------------------------
  sentence_builds: [
    // 10 EASY
    {
      id: "sb_e01",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["was reading", "my brother", "a book"],
      correctSentence: "My brother was reading a book.",
      tip: "Subject (my brother) + Verb (was reading) + Object (a book).",
    },
    {
      id: "sb_e02",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["the coffee shop", "is located", "near the station"],
      correctSentence: "The coffee shop is located near the station.",
      tip: "The coffee shop + is located + near the station.",
    },
    {
      id: "sb_e03",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["yesterday morning", "arrived late", "the delivery van"],
      correctSentence: "The delivery van arrived late yesterday morning.",
      tip: "The delivery van + arrived late + yesterday morning.",
    },
    {
      id: "sb_e04",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["new computers", "ordered", "our office"],
      correctSentence: "Our office ordered new computers.",
      tip: "Our office + ordered + new computers.",
    },
    {
      id: "sb_e05",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["fresh vegetables", "sells", "the grocery store"],
      correctSentence: "The grocery store sells fresh vegetables.",
      tip: "The grocery store + sells + fresh vegetables.",
    },
    {
      id: "sb_e06",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["on the whiteboard", "wrote", "the teacher"],
      correctSentence: "The teacher wrote on the whiteboard.",
      tip: "The teacher + wrote + on the whiteboard.",
    },
    {
      id: "sb_e07",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["every evening", "takes a walk", "my grandfather"],
      correctSentence: "My grandfather takes a walk every evening.",
      tip: "My grandfather + takes a walk + every evening.",
    },
    {
      id: "sb_e08",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["a delicious dinner", "cooked", "she"],
      correctSentence: "She cooked a delicious dinner.",
      tip: "She + cooked + a delicious dinner.",
    },
    {
      id: "sb_e09",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["the flight to London", "on time", "departed"],
      correctSentence: "The flight to London departed on time.",
      tip: "The flight to London + departed + on time.",
    },
    {
      id: "sb_e10",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Easy",
      jumbledFragments: ["very quickly", "the athlete", "ran"],
      correctSentence: "The athlete ran very quickly.",
      tip: "The athlete + ran + very quickly.",
    },

    // 10 MEDIUM
    {
      id: "sb_m01",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["the software engineer", "tested thoroughly", "the new algorithm"],
      correctSentence: "The software engineer tested the new algorithm thoroughly.",
      tip: "The software engineer + tested the new algorithm + thoroughly.",
    },
    {
      id: "sb_m02",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["customer inquiries", "handled efficiently", "the support team"],
      correctSentence: "The support team handled customer inquiries efficiently.",
      tip: "The support team + handled customer inquiries + efficiently.",
    },
    {
      id: "sb_m03",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["at the conference", "delivered", "an inspiring keynote", "the CEO"],
      correctSentence: "The CEO delivered an inspiring keynote at the conference.",
      tip: "The CEO + delivered an inspiring keynote + at the conference.",
    },
    {
      id: "sb_m04",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["during the summer", "increased significantly", "hotel reservations"],
      correctSentence: "Hotel reservations increased significantly during the summer.",
      tip: "Hotel reservations + increased significantly + during the summer.",
    },
    {
      id: "sb_m05",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["before the deadline", "the final proposal", "the committee approved"],
      correctSentence: "The committee approved the final proposal before the deadline.",
      tip: "The committee + approved the final proposal + before the deadline.",
    },
    {
      id: "sb_m06",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["advanced training", "will receive", "all new recruits", "next week"],
      correctSentence: "All new recruits will receive advanced training next week.",
      tip: "All new recruits + will receive advanced training + next week.",
    },
    {
      id: "sb_m07",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["financial markets", "fluctuated rapidly", "following the news"],
      correctSentence: "Financial markets fluctuated rapidly following the news.",
      tip: "Financial markets + fluctuated rapidly + following the news.",
    },
    {
      id: "sb_m08",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["meticulous attention", "requires", "this complex task", "to detail"],
      correctSentence: "This complex task requires meticulous attention to detail.",
      tip: "This complex task + requires meticulous attention + to detail.",
    },
    {
      id: "sb_m09",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["renewable energy projects", "heavily invested in", "the government"],
      correctSentence: "The government invested heavily in renewable energy projects.",
      tip: "The government + invested heavily in + renewable energy projects.",
    },
    {
      id: "sb_m10",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Medium",
      jumbledFragments: ["unauthorized access", "prevented successfully", "the updated firewall"],
      correctSentence: "The updated firewall successfully prevented unauthorized access.",
      tip: "The updated firewall + successfully prevented + unauthorized access.",
    },

    // 10 HARD
    {
      id: "sb_h01",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["despite heavy delays", "the shipment arrived", "in perfect condition", "at the warehouse"],
      correctSentence: "The shipment arrived at the warehouse in perfect condition despite heavy delays.",
      tip: "Assemble logically: The shipment arrived at the warehouse in perfect condition despite heavy delays.",
    },
    {
      id: "sb_h02",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["strategic restructuring", "initiated", "to improve operational agility", "the multinational corporation"],
      correctSentence: "The multinational corporation initiated strategic restructuring to improve operational agility.",
      tip: "Subject + verb + direct object + purpose clause.",
    },
    {
      id: "sb_h03",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["unprecedented scientific breakthroughs", "the interdisciplinary research team", "announced yesterday", "in nanotechnology"],
      correctSentence: "The interdisciplinary research team announced unprecedented scientific breakthroughs in nanotechnology yesterday.",
      tip: "Combine the subject phrase, action verb, and descriptive field.",
    },
    {
      id: "sb_h04",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["regulatory compliance guidelines", "must adhere strictly to", "all pharmaceutical manufacturing facilities"],
      correctSentence: "All pharmaceutical manufacturing facilities must adhere strictly to regulatory compliance guidelines.",
      tip: "Subject (All facilities) + modal (must adhere) + prepositional phrase.",
    },
    {
      id: "sb_h05",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["automated machine learning algorithms", "consumer purchasing behaviors", "analyze accurately", "across digital platforms"],
      correctSentence: "Automated machine learning algorithms analyze consumer purchasing behaviors across digital platforms accurately.",
      tip: "Algorithms + analyze behaviors + across platforms.",
    },
    {
      id: "sb_h06",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["preliminary environmental impact assessments", "the urban development council", "conducted meticulously", "before construction began"],
      correctSentence: "The urban development council meticulously conducted preliminary environmental impact assessments before construction began.",
      tip: "Subject + adverb + verb + object + temporal clause.",
    },
    {
      id: "sb_h07",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["robust cybersecurity measures", "necessitates", "rapid expansion in cloud computing", "across enterprise systems"],
      correctSentence: "Rapid expansion in cloud computing necessitates robust cybersecurity measures across enterprise systems.",
      tip: "Cause (Rapid expansion) + verb (necessitates) + requirement (cybersecurity measures).",
    },
    {
      id: "sb_h08",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["sustainable supply chain practices", "demonstrated a firm commitment to", "by reducing carbon footprints", "the leading retail brand"],
      correctSentence: "The leading retail brand demonstrated a firm commitment to sustainable supply chain practices by reducing carbon footprints.",
      tip: "Brand + demonstrated commitment to practices + method.",
    },
    {
      id: "sb_h09",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["collaborative international partnerships", "facilitate seamless knowledge transfer", "among global academic institutions"],
      correctSentence: "Collaborative international partnerships facilitate seamless knowledge transfer among global academic institutions.",
      tip: "Partnerships + facilitate knowledge transfer + among institutions.",
    },
    {
      id: "sb_h10",
      sectionId: "sentence_builds",
      type: "sentence_build",
      difficulty: "Hard",
      jumbledFragments: ["substantial productivity improvements", "the introduction of automated workflows", "generated immediately", "across the entire organization"],
      correctSentence: "The introduction of automated workflows immediately generated substantial productivity improvements across the entire organization.",
      tip: "Introduction of workflows + generated improvements + across organization.",
    },
  ],

  // -------------------------------------------------------------
  // SECTION 5: STORY RETELLING - 15 Questions
  // -------------------------------------------------------------
  story_retelling: [
    // 5 EASY
    {
      id: "sr_e01",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Easy",
      audioScript: "Rahul was an aspiring software engineer preparing for a major client presentation. Ten minutes before the meeting, his laptop unexpectedly shut down. Fortunately, Rahul had backed up his presentation slides on a cloud drive. He quickly borrowed his colleague's tablet, logged into his account, and delivered a successful demonstration to the client on time.",
      storyPrompt: {
        character: "Rahul, a software engineer",
        setting: "Preparing for a client presentation in the office",
        conflict: "His laptop crashed ten minutes before the meeting",
        resolution: "He used cloud backup on a colleague's tablet and delivered the presentation on time",
      },
      tip: "Accenture Hack Opening: 'The story is about Rahul, who was preparing for a client presentation... He faced a problem when his laptop crashed, but resolved it by using cloud backup on a colleague's tablet.'",
    },
    {
      id: "sr_e02",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Easy",
      audioScript: "Sneha was scheduled to board a morning flight for an important interview in Mumbai. On her way to the airport, her cab got stuck in heavy traffic due to sudden rainfall. Realizing she might miss the flight, Sneha immediately contacted the airline desk through their mobile app. The airline staff rebooked her on the next available departure without any cancellation penalty, allowing her to attend the afternoon interview.",
      storyPrompt: {
        character: "Sneha, a job applicant traveling to Mumbai",
        setting: "Traveling to the airport in heavy traffic",
        conflict: "Cab was stuck in rain traffic, risking missing her flight",
        resolution: "She contacted customer support via mobile app and rebooked onto an afternoon flight",
      },
      tip: "Name the character (Sneha), the city (Mumbai), traffic delay, and app rebooking.",
    },
    {
      id: "sr_e03",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Easy",
      audioScript: "Karan organized an outdoor corporate picnic for forty colleagues at a scenic park. Right after lunch, dark clouds appeared and rain started pouring heavily. Karan remained calm and quickly guided the entire team inside a nearby indoor banquet hall that he had reserved as a backup plan. The team enjoyed indoor games and hot snacks, making the event a memorable success.",
      storyPrompt: {
        character: "Karan, corporate event organizer",
        setting: "Outdoor company picnic at a park",
        conflict: "Sudden heavy rain interrupted the outdoor event",
        resolution: "He moved everyone to a pre-booked backup banquet hall for indoor games",
      },
      tip: "Highlight Karan's proactive backup plan.",
    },
    {
      id: "sr_e04",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Easy",
      audioScript: "Anita was baking a large chocolate cake for her sister's birthday celebration. Halfway through the preparation, she discovered that she had run out of baking powder. She immediately checked with her friendly neighbor Mrs. Sharma, who kindly lent her an unopened container. Anita completed the cake on schedule, and her sister was delighted with the surprise party.",
      storyPrompt: {
        character: "Anita",
        setting: "Home kitchen baking a birthday cake",
        conflict: "Ran out of baking powder mid-recipe",
        resolution: "Neighbor Mrs. Sharma lent her baking powder, and the party was a success",
      },
      tip: "Mention Anita, sister's birthday, missing ingredient, and neighbor's help.",
    },
    {
      id: "sr_e05",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Easy",
      audioScript: "David lost his wallet containing his transit pass and office access card at a subway station. He reported the loss to the transit authority lost-and-found booth before leaving. Two hours later, a commuter turned in the wallet with all cards and cash intact. David expressed his sincere gratitude and rewarded the honest commuter with a gift card.",
      storyPrompt: {
        character: "David",
        setting: "Subway station commute",
        conflict: "Lost his wallet with transit pass and office card",
        resolution: "Honest commuter returned it to lost-and-found; David rewarded them",
      },
      tip: "Focus on David, the lost wallet at subway, and honest return.",
    },

    // 5 MEDIUM
    {
      id: "sr_m01",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Medium",
      audioScript: "Vikram was leading an international software migration project with a strict midnight deadline. At ten in the evening, a critical database synchronization error halted the automated pipeline. Instead of panicking, Vikram gathered his senior developers on an emergency conference bridge, identified an outdated index as the bottleneck, and deployed an optimized patch within forty minutes. The migration concluded seamlessly ahead of the scheduled launch.",
      storyPrompt: {
        character: "Vikram, project lead",
        setting: "Late night software migration with midnight deadline",
        conflict: "Database synchronization error halted the deployment pipeline",
        resolution: "Assembled an emergency developer bridge, patched the outdated index, and completed on time",
      },
      tip: "Mention Vikram, midnight deadline, database error, and the quick index patch.",
    },
    {
      id: "sr_m02",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Medium",
      audioScript: "Meera managed customer success for an e-commerce platform during the annual festive sale. A payment gateway outage left hundreds of customer orders unconfirmed, causing widespread frustration. Meera proactively drafted a transparent status announcement, set up an automated refund protocol, and offered a ten percent discount voucher on their next purchase. Customers appreciated the prompt communication and brand loyalty remained high.",
      storyPrompt: {
        character: "Meera, customer success manager",
        setting: "Festive e-commerce sale",
        conflict: "Payment gateway outage caused unconfirmed orders and customer frustration",
        resolution: "Sent transparent updates, initiated automated refunds, and provided discount vouchers",
      },
      tip: "Highlight transparent communication and customer voucher remedy.",
    },
    {
      id: "sr_m03",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Medium",
      audioScript: "Dr. Arvind was coordinating an international medical symposium when the keynote speaker missed his connecting flight due to severe turbulence. With over three hundred medical professionals gathered in the auditorium, Dr. Arvind arranged a high-definition remote video conference within fifteen minutes. The speaker delivered his presentation virtually, and the audience participated actively in an interactive question and answer session.",
      storyPrompt: {
        character: "Dr. Arvind, symposium coordinator",
        setting: "Medical conference with 300 professionals",
        conflict: "Keynote speaker missed his flight due to turbulence",
        resolution: "Arranged an interactive HD remote video session within 15 minutes",
      },
      tip: "State character name, audience size, missed flight, and remote video solution.",
    },
    {
      id: "sr_m04",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Medium",
      audioScript: "Tanvi was preparing a comprehensive audit report for a major corporate client. While reconciling the ledger records, she detected a substantial discrepancy between invoice amounts and bank receipts. Rather than overlooking the variation, Tanvi conducted an exhaustive cross-reference with the procurement department and discovered an automated currency conversion glitch. Her diligence saved the company from potential fiscal penalties.",
      storyPrompt: {
        character: "Tanvi, corporate auditor",
        setting: "Audit report reconciliation",
        conflict: "Discrepancy found between invoices and bank receipts",
        resolution: "Investigated procurement logs and identified a currency conversion glitch",
      },
      tip: "Retell Tanvi's audit discovery and how it prevented fiscal penalties.",
    },
    {
      id: "sr_m05",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Medium",
      audioScript: "Rohan was spearheading an experimental renewable energy prototype in an off-grid village. During the initial trial, solar inverters failed to withstand excessive humidity. Rohan collaborated with local technicians to design moisture-resistant ventilated enclosures utilizing readily available composite materials. The modified solar system operated uninterrupted, providing steady electricity to over fifty households.",
      storyPrompt: {
        character: "Rohan, renewable energy engineer",
        setting: "Off-grid rural village solar trial",
        conflict: "Inverters failed due to high humidity",
        resolution: "Built ventilated moisture-resistant enclosures with local technicians, powering 50 homes",
      },
      tip: "Focus on problem (humidity inverter failure) and collaborative solution.",
    },

    // 5 HARD
    {
      id: "sr_h01",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Hard",
      audioScript: "Elena was the chief logistics officer overseeing a critical humanitarian relief shipment to an earthquake-stricken coastal district. When a sudden landslide destroyed the primary highway corridor, conventional cargo trucks were stranded eighty miles from the relief distribution center. Recognizing that medical supplies were depleting rapidly, Elena coordinated with regional maritime authorities to requisition commercial fishing vessels. Operating through shallow waterways overnight, the maritime convoy delivered twenty tons of emergency supplies directly to coastal makeshift clinics.",
      storyPrompt: {
        character: "Elena, chief logistics officer",
        setting: "Humanitarian relief operation in an earthquake-stricken coastal district",
        conflict: "Landslide destroyed highway corridor, stranding cargo trucks 80 miles away",
        resolution: "Requisitioned commercial fishing vessels to transport 20 tons of medical supplies via shallow waterways",
      },
      tip: "Chronological formula: Character (Elena) -> Disaster & roadblock (landslide) -> Strategic pivot (fishing vessels) -> Successful delivery.",
    },
    {
      id: "sr_h02",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Hard",
      audioScript: "Marcus was managing a high-stakes merger between two leading telecommunications conglomerates. During regulatory scrutiny, antitrust authorities expressed grave concerns regarding regional market monopolization. Marcus engaged senior economic consultants to model a strategic asset divestiture proposal, pledging to sell redundant regional cell towers to competitive local carriers. This calculated compromise satisfied regulatory requirements and secured unanimous approval for the multi-billion-dollar merger.",
      storyPrompt: {
        character: "Marcus, merger & acquisition director",
        setting: "Telecom corporate merger regulatory review",
        conflict: "Antitrust authorities raised monopoly concerns threatening the deal",
        resolution: "Engineered a strategic tower asset divestiture proposal to local carriers, earning regulatory approval",
      },
      tip: "Cover the high-stakes merger, monopoly objection, asset divestiture solution, and approval.",
    },
    {
      id: "sr_h03",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Hard",
      audioScript: "Dr. Chen was conducting a pivotal clinical trial for an innovative cardiovascular drug. An unexpected statistical anomaly indicated that trial participants in a specific demographic were experiencing elevated blood pressure. Rather than abandoning the trial, Dr. Chen initiated deep genomic sequencing and discovered that a common dietary salt interaction was triggering the side effect. By modifying the patient nutritional protocol, the trial continued safely and achieved therapeutic efficacy across all cohorts.",
      storyPrompt: {
        character: "Dr. Chen, clinical research scientist",
        setting: "Cardiovascular drug trial",
        conflict: "Unexpected elevated blood pressure in a specific participant group",
        resolution: "Identified a dietary salt interaction via genomic sequencing, adjusted diet, and rescued the trial",
      },
      tip: "Highlight Dr. Chen's scientific rigor in finding the dietary cause rather than canceling the drug.",
    },
    {
      id: "sr_h04",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Hard",
      audioScript: "Siddharth was directing the architectural launch of a sustainable smart skyscraper in Dubai. Weeks before the grand opening, structural sensors recorded microscopic thermal expansion vibrations exceeding tolerance thresholds under extreme desert temperatures. Siddharth consulted aerospace materials scientists to install liquid-tuned mass dampers on the upper mechanical floors. The innovative dampers counterbalanced the thermal oscillations, allowing the architectural landmark to open with full safety certifications.",
      storyPrompt: {
        character: "Siddharth, architectural project director",
        setting: "Dubai smart skyscraper construction",
        conflict: "Extreme heat triggered micro thermal vibrations exceeding safety tolerances",
        resolution: "Installed liquid-tuned mass dampers with aerospace scientists, securing safety certification",
      },
      tip: "Mention Siddharth, Dubai skyscraper, heat vibrations, and liquid damper solution.",
    },
    {
      id: "sr_h05",
      sectionId: "story_retelling",
      type: "story_retell",
      difficulty: "Hard",
      audioScript: "Kavita led cybersecurity for a prominent international banking consortium. In the early morning hours, automated intrusion detection systems flagged anomalous data exfiltration attempts targeting encrypted transaction databases. Kavita immediately quarantined the compromised virtual network segment, deployed decoy honeypots to capture the hackers' operational signatures, and patched an unpublicized zero-day vulnerability. Her rapid counter-response thwarted the breach, safeguarding millions of client records.",
      storyPrompt: {
        character: "Kavita, cybersecurity lead",
        setting: "International banking consortium datacenter",
        conflict: "Early morning zero-day intrusion attempt targeting encrypted databases",
        resolution: "Quarantined the network, deployed honeypots, patched the vulnerability, and protected client records",
      },
      tip: "Detail the breach detection, network quarantine, honeypot tactics, and full defense.",
    },
  ],

  // -------------------------------------------------------------
  // SECTION 6: OPEN SPEAKING / SPONTANEOUS - 18 Questions
  // -------------------------------------------------------------
  open_speaking: [
    // 6 EASY
    {
      id: "os_e01",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Easy",
      openTopic: "Do you prefer working from home or working in an office? Give reasons for your preference.",
      prepFormulaTips: {
        point: "I personally prefer working in an office / hybrid model for professional collaboration.",
        reason: "Firstly, face-to-face interaction allows immediate problem solving and strengthens team bonding.",
        example: "For example, during complex project discussions, in-person whiteboarding saves hours of back-and-forth emails.",
        summary: "Therefore, while remote work provides flexibility, the office environment fosters greater productivity and focus.",
      },
      tip: "Accenture PREP Formula: State your Point clearly, give 1-2 Reasons, provide 1 concrete Example, and conclude with a Point Summary.",
    },
    {
      id: "os_e02",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Easy",
      openTopic: "Do you prefer reading physical books or reading on digital screens? Explain your choice.",
      prepFormulaTips: {
        point: "I prefer reading physical books rather than digital screens.",
        reason: "Physical books reduce eye fatigue and allow deeper concentration without digital notifications.",
        example: "For instance, when reading technical literature in the evening, printed books help me absorb concepts better without screen glare.",
        summary: "Hence, physical reading offers unmatched tactile focus and cognitive retention.",
      },
      tip: "Avoid filler words like 'um', 'like', 'you know'. Take a 1-second breath if thinking.",
    },
    {
      id: "os_e03",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Easy",
      openTopic: "Describe a person who has inspired you in your life or career.",
      prepFormulaTips: {
        point: "My college mentor / team lead has been the greatest inspiration in my career.",
        reason: "She demonstrated exceptional technical resilience and calm leadership under demanding deadlines.",
        example: "For example, during our final year capstone project, she guided us through complex software debugging with immense patience.",
        summary: "Consequently, her disciplined work ethic continues to guide my professional ambition.",
      },
      tip: "Structure clearly: Who, What they did, How they influenced you.",
    },
    {
      id: "os_e04",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Easy",
      openTopic: "Do you prefer exercising in the morning or in the evening? Why?",
      prepFormulaTips: {
        point: "I strongly favor exercising early in the morning.",
        reason: "Morning workouts energize my body and establish a proactive, disciplined mindset for the rest of the day.",
        example: "For instance, whenever I begin with a thirty-minute run, I stay alert and productive throughout my working hours.",
        summary: "Thus, morning physical activity ensures both mental clarity and consistent fitness.",
      },
      tip: "Maintain a steady pace around 130 words per minute.",
    },
    {
      id: "os_e05",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Easy",
      openTopic: "Should students learn to cook before leaving home for college or work? Explain your opinion.",
      prepFormulaTips: {
        point: "I firmly believe cooking is an essential life skill every student should acquire before leaving home.",
        reason: "Cooking guarantees nutritious dietary habits and saves significant financial expenses.",
        example: "For instance, students who cook their own meals avoid unhealthy processed fast foods during hectic examination weeks.",
        summary: "Therefore, culinary independence is crucial for personal well-being and budgeting.",
      },
      tip: "Keep sentences grammatically clean and finish before the 60-second limit.",
    },
    {
      id: "os_e06",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Easy",
      openTopic: "What is your favorite way to spend a free weekend?",
      prepFormulaTips: {
        point: "My ideal weekend involves a balance of outdoor recreation and personal skill development.",
        reason: "Stepping outside helps recharge mental faculties, while reading keeps me updated with emerging technologies.",
        example: "For example, I enjoy cycling in nearby nature parks on Saturday mornings followed by learning new software frameworks on Sundays.",
        summary: "This balanced routine ensures both relaxation and continuous personal growth.",
      },
      tip: "Deliver with a confident, cheerful tone.",
    },

    // 6 MEDIUM
    {
      id: "os_m01",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Medium",
      openTopic: "Some people believe that artificial intelligence will eliminate jobs, while others argue it creates new opportunities. What is your view?",
      prepFormulaTips: {
        point: "In my perspective, artificial intelligence will transform the nature of employment rather than completely eliminating it.",
        reason: "AI automates repetitive operational tasks, which allows human professionals to focus on creative problem-solving and strategic planning.",
        example: "For example, in software engineering, AI assistants generate boilerplate code while human developers architect complex, secure systems.",
        summary: "Therefore, workforce upskilling in AI collaboration will lead to higher value job opportunities.",
      },
      tip: "Accenture Special: Show balanced analytical thinking and highlight upskilling.",
    },
    {
      id: "os_m02",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Medium",
      openTopic: "Do you believe online education can completely replace traditional classroom universities?",
      prepFormulaTips: {
        point: "I believe online education serves as a valuable supplement, but cannot entirely replace classroom universities.",
        reason: "Classrooms provide spontaneous peer interactions, laboratory hands-on exposure, and social networking essential for leadership.",
        example: "For instance, collaborative engineering hardware projects require physical equipment calibration that virtual simulations cannot replicate.",
        summary: "Consequently, a blended hybrid model offers the most effective educational outcome.",
      },
      tip: "Express your argument with structured reasons and a balanced conclusion.",
    },
    {
      id: "os_m03",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Medium",
      openTopic: "Is it better to specialize deeply in one skill or develop a broad generalist knowledge across multiple domains?",
      prepFormulaTips: {
        point: "I advocate for a T-shaped skill profile, combining deep expertise in one core domain with broad multi-disciplinary awareness.",
        reason: "Deep specialization builds credibility, while broad knowledge enables cross-functional collaboration and adaptability.",
        example: "For example, a data engineer with broad business acumen can communicate insights far more effectively to corporate stakeholders.",
        summary: "Thus, balancing core mastery with holistic context ensures sustained career growth.",
      },
      tip: "Use professional business terms like 'T-shaped profile' and 'cross-functional collaboration'.",
    },
    {
      id: "os_m04",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Medium",
      openTopic: "Should corporate employees be evaluated based on total hours worked or on their project outcomes and deliverables?",
      prepFormulaTips: {
        point: "I believe employee performance evaluations should be strictly outcome-oriented rather than hours-driven.",
        reason: "Outcome metrics reward efficiency, innovation, and quality of deliverables, preventing burnout and superficial clock-watching.",
        example: "For instance, a developer who completes high-quality software features in four hours delivers far more value than someone struggling for ten hours.",
        summary: "Therefore, merit-based outcome appraisal cultivates high-performance corporate cultures.",
      },
      tip: "Speak with conviction and clear logical flow.",
    },
    {
      id: "os_m05",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Medium",
      openTopic: "What are the key advantages and drawbacks of social media platforms in modern society?",
      prepFormulaTips: {
        point: "Social media provides unprecedented global connectivity, yet demands disciplined usage to prevent mental distractions.",
        reason: "While it democratizes information dissemination and networking, algorithms often encourage digital addiction and superficial comparison.",
        example: "For example, professionals leverage platforms to secure employment opportunities, yet excessive passive scrolling diminishes productivity.",
        summary: "In conclusion, conscious digital hygiene is essential to harness benefits while mitigating psychological harms.",
      },
      tip: "Present both sides before summarizing your viewpoint.",
    },
    {
      id: "os_m06",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Medium",
      openTopic: "How can individuals effectively manage stress and maintain a healthy work-life balance?",
      prepFormulaTips: {
        point: "Maintaining work-life balance requires establishing clear psychological boundaries and prioritizing restorative activities.",
        reason: "Disconnecting from corporate communication after hours prevents emotional exhaustion and sharpens cognitive acuity.",
        example: "For instance, dedicating evenings to regular exercise and family conversations revitalizes mental energy for the next working day.",
        summary: "Hence, disciplined boundary setting is the bedrock of sustained professional excellence.",
      },
      tip: "Maintain smooth cadence with natural pauses at commas and full stops.",
    },

    // 6 HARD
    {
      id: "os_h01",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Hard",
      openTopic: "Should modern organizations transition toward a four-day work week? Discuss the economic and operational implications.",
      prepFormulaTips: {
        point: "I strongly support the four-day work week model as it enhances workforce productivity while reducing institutional overhead.",
        reason: "Studies demonstrate that well-rested employees exhibit heightened focus, lower absenteeism, and superior creative problem-solving.",
        example: "For example, trials conducted in European technology sectors reported a twenty percent increase in output alongside marked reductions in turnover.",
        summary: "Consequently, modern enterprises must adapt to flexible scheduling to attract and retain top-tier talent in competitive markets.",
      },
      tip: "Aim for 130-140 WPM. Articulate complex phrases like 'institutional overhead' and 'absenteeism' clearly.",
    },
    {
      id: "os_h02",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Hard",
      openTopic: "How can corporations balance rapid technological automation with ethical responsibilities toward employee welfare?",
      prepFormulaTips: {
        point: "Corporations must pursue a policy of compassionate automation by pairing technological investments with proactive employee retraining.",
        reason: "Automation creates economic efficiency, but sustainable prosperity requires reinvesting profits into reskilling programs for displaced workers.",
        example: "For instance, forward-thinking consulting firms train legacy operations teams in cloud data analytics rather than executing mass layoffs.",
        summary: "Thus, ethical technological stewardship aligns long-term shareholder value with broader social stability.",
      },
      tip: "Accenture Core Value: Highlight ethical leadership, corporate responsibility, and continuous learning.",
    },
    {
      id: "os_h03",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Hard",
      openTopic: "Is economic growth fundamentally incompatible with environmental sustainability? Provide your perspective.",
      prepFormulaTips: {
        point: "I believe economic progress and ecological sustainability can be harmonized through circular economy innovations.",
        reason: "Green technologies, such as renewable energy and waste recycling, decouple wealth generation from environmental degradation.",
        example: "For example, the global electric vehicle and solar battery sectors are generating millions of high-paying jobs while curtailing emissions.",
        summary: "Therefore, sustainable industrial design demonstrates that ecological preservation can drive economic growth.",
      },
      tip: "Use strong cohesive discourse markers: 'Furthermore', 'Moreover', 'In contrast', 'Ultimately'.",
    },
    {
      id: "os_h04",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Hard",
      openTopic: "Should governments strictly regulate artificial intelligence algorithms to prevent privacy invasion and algorithmic bias?",
      prepFormulaTips: {
        point: "Rigorous yet adaptive governmental regulation of artificial intelligence is imperative to safeguard democratic privacy and civil liberties.",
        reason: "Without institutional oversight, black-box algorithms can perpetuate systemic racial or gender biases in hiring and credit scoring.",
        example: "For instance, regulatory frameworks like the European AI Act enforce transparency audits on high-risk algorithmic applications.",
        summary: "Hence, proactive governance ensures artificial intelligence develops safely as an equitable public good.",
      },
      tip: "State clear stance with academic vocabulary: 'algorithmic bias', 'institutional oversight', 'public good'.",
    },
    {
      id: "os_h05",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Hard",
      openTopic: "Discuss how globalization and cross-cultural communication have reshaped modern leadership styles.",
      prepFormulaTips: {
        point: "Globalization has fundamentally transformed leadership from authoritative command-and-control into empathetic, culturally adaptive mentorship.",
        reason: "Leading distributed global teams demands emotional intelligence, cultural sensitivity, and active listening across diverse backgrounds.",
        example: "For instance, global executives must tailor communication nuances between direct Western feedback styles and consensual Asian consensus models.",
        summary: "Ultimately, inclusive global leadership is the defining competitive advantage of modern multinational enterprises.",
      },
      tip: "Express with high clarity and steady rhythm without filler words.",
    },
    {
      id: "os_h06",
      sectionId: "open_speaking",
      type: "open_spontaneous",
      difficulty: "Hard",
      openTopic: "In an era of rapid technological obsolescence, what is the most important skill for a young professional entering the corporate workforce?",
      prepFormulaTips: {
        point: "The paramount skill for modern professionals is meta-learning—the agility to rapidly acquire, unlearn, and master novel competencies.",
        reason: "Specific programming languages or tools may become obsolete in five years, but intellectual curiosity and adaptive learning endure.",
        example: "For example, professionals who quickly adapted from traditional server management to cloud-native microservices remained indispensable.",
        summary: "Therefore, cultivating relentless intellectual agility is the ultimate insurance for long-term career resilience.",
      },
      tip: "Deliver the conclusion with authoritative confidence.",
    },
  ],

  // -------------------------------------------------------------
  // SVAR MODULE: LISTENING COMPREHENSION (Audio Passage + MCQs) - 15 Questions
  // -------------------------------------------------------------
  listening_comp: [
    {
      id: "lc_01",
      sectionId: "listening_comp",
      type: "listening_mcq",
      difficulty: "Easy",
      audioScript: "Attention passengers on flight BA-249 to Singapore. Your departure gate has been reassigned from Gate B12 to Gate C18 due to maintenance on the tarmac. Boarding will commence promptly in twenty minutes at five thirty PM.",
      questionText: "What is the new departure gate for flight BA-249?",
      options: ["Gate B12", "Gate C18", "Gate A20", "Gate D14"],
      correctAnswer: 1,
      rule: "The announcement explicitly states: 'Your departure gate has been reassigned from Gate B12 to Gate C18.'",
    },
    {
      id: "lc_02",
      sectionId: "listening_comp",
      type: "listening_mcq",
      difficulty: "Easy",
      audioScript: "Good morning team. Please note that the main cafeteria will be closed for quarterly pest control this Friday afternoon from two PM to six PM. Complimentary refreshments and boxed lunches will be distributed in the second floor lounge during this interval.",
      questionText: "Where can employees collect refreshments on Friday afternoon?",
      options: ["Main cafeteria", "Second floor lounge", "Reception desk", "Parking basement"],
      correctAnswer: 1,
      rule: "The speaker clarifies: 'Complimentary refreshments... will be distributed in the second floor lounge.'",
    },
    {
      id: "lc_03",
      sectionId: "listening_comp",
      type: "listening_mcq",
      difficulty: "Medium",
      audioScript: "This is IT helpdesk support. We detected unusual outbound traffic from your workstation IP address around three AM. As a precaution, your network credentials have been temporarily suspended. Please visit Room 402 with your employee ID badge before noon to reset your multi-factor authentication tokens.",
      questionText: "Why were the employee's network credentials suspended?",
      options: [
        "Routine password expiration after ninety days",
        "Unusual outbound traffic detected at three AM",
        "Failure to submit the weekly attendance log",
        "Hardware upgrade on the primary server",
      ],
      correctAnswer: 1,
      rule: "The reason given: 'We detected unusual outbound traffic from your workstation IP address around three AM.'",
    },
    {
      id: "lc_04",
      sectionId: "listening_comp",
      type: "listening_mcq",
      difficulty: "Medium",
      audioScript: "Thank you for contacting Apex Medical Clinic. To schedule an appointment with a general physician, press one. For dental and orthodontic specialists, press two. If you are calling regarding laboratory blood test reports or prescription refills, please remain on the line to speak with our registered nurse.",
      questionText: "What should a caller do to inquire about blood test reports?",
      options: [
        "Press one",
        "Press two",
        "Remain on the line to speak with a nurse",
        "Disconnect and visit the clinic website",
      ],
      correctAnswer: 2,
      rule: "The prompt states: 'If you are calling regarding laboratory blood test reports... please remain on the line.'",
    },
    {
      id: "lc_05",
      sectionId: "listening_comp",
      type: "listening_mcq",
      difficulty: "Hard",
      audioScript: "Quarterly review summary: Our subscription revenue expanded by fourteen percent, driven largely by European enterprise adoptions. However, customer acquisition cost rose twenty-two percent as competitive bidding for digital advertising intensified. Consequently, the executive board has mandated a shift toward organic referral partnerships and enterprise account retention for the forthcoming semester.",
      questionText: "What strategy has the executive board mandated to counter rising acquisition costs?",
      options: [
        "Double the paid digital advertising budget",
        "Shift toward organic referral partnerships and enterprise retention",
        "Downsize European customer support operations",
        "Increase annual subscription prices by fourteen percent",
      ],
      correctAnswer: 1,
      rule: "The audio concludes: '...the executive board has mandated a shift toward organic referral partnerships and enterprise account retention.'",
    },
  ],

  // -------------------------------------------------------------
  // SVAR MODULE: GRAMMAR & SENTENCE CORRECTION - 15 Questions
  // -------------------------------------------------------------
  grammar_correction: [
    {
      id: "gc_01",
      sectionId: "grammar_correction",
      type: "grammar_mcq",
      difficulty: "Easy",
      questionText: "Identify the grammatically correct sentence from the choices below:",
      options: [
        "Neither the manager nor his assistants was present at the meeting.",
        "Neither the manager nor his assistants were present at the meeting.",
        "Neither the manager or his assistants was present at the meeting.",
        "Neither the manager nor his assistants are present yesterday.",
      ],
      correctAnswer: 1,
      rule: "Rule of Proximity: When subjects are joined by 'neither... nor', the verb agrees with the subject closest to it ('assistants' is plural, so 'were' is correct).",
    },
    {
      id: "gc_02",
      sectionId: "grammar_correction",
      type: "grammar_mcq",
      difficulty: "Easy",
      questionText: "Choose the sentence with correct preposition usage:",
      options: [
        "She congratulated him for his remarkable achievement in software engineering.",
        "She congratulated him on his remarkable achievement in software engineering.",
        "She congratulated him with his remarkable achievement in software engineering.",
        "She congratulated him at his remarkable achievement in software engineering.",
      ],
      correctAnswer: 1,
      rule: "The standard preposition with the verb 'congratulate' is 'on' (congratulate someone ON something).",
    },
    {
      id: "gc_03",
      sectionId: "grammar_correction",
      type: "grammar_mcq",
      difficulty: "Medium",
      questionText: "Which of the following sentences correctly expresses a past conditional?",
      options: [
        "If they would have tested the code, the bug would not have occurred.",
        "If they had tested the code, the bug would not have occurred.",
        "If they tested the code, the bug would not have occur.",
        "If they have tested the code, the bug had not occurred.",
      ],
      correctAnswer: 1,
      rule: "Third Conditional: 'If + past perfect (had tested), would have + past participle (would not have occurred)'. Never use 'would have' in the if-clause.",
    },
    {
      id: "gc_04",
      sectionId: "grammar_correction",
      type: "grammar_mcq",
      difficulty: "Medium",
      questionText: "Select the sentence with accurate subject-verb agreement:",
      options: [
        "The committee have decided to postpone the annual conference.",
        "A collection of rare manuscripts was donated to the city library.",
        "A collection of rare manuscripts were donated to the city library.",
        "Each of the participants have received their verification pass.",
      ],
      correctAnswer: 1,
      rule: "'A collection' is the singular head noun of the prepositional phrase 'of rare manuscripts', requiring the singular verb 'was donated'.",
    },
    {
      id: "gc_05",
      sectionId: "grammar_correction",
      type: "grammar_mcq",
      difficulty: "Hard",
      questionText: "Select the sentence with the most natural and grammatically precise phrasing:",
      options: [
        "Having finished the technical audit, the discrepancies were rectified by the engineering team.",
        "Having finished the technical audit, the engineering team rectified the discrepancies.",
        "The discrepancies having finished the technical audit was rectified by the team.",
        "Having been finished the technical audit, discrepancies were rectified.",
      ],
      correctAnswer: 1,
      rule: "Dangling Participle: The participial phrase 'Having finished the technical audit' must modify the subject who performed the action ('the engineering team').",
    },
  ],
};

/**
 * Generator helper that dynamically builds an authentic test attempt based on user configuration.
 */
export function generateTestQuestions(
  configOrMode?:
    | {
        mode?: "accenture_versant" | "svar_corporate" | "full_mock";
        difficulty?: "All" | "Easy" | "Medium" | "Hard" | "Mixed";
        questionCount?: number;
      }
    | "accenture_versant"
    | "svar_corporate"
    | "full_mock",
  maybeDiff?: "All" | "Easy" | "Medium" | "Hard" | "Mixed"
): {
  questions: SvarQuestion[];
  mode: string;
  totalTimeMinutes: number;
} {
  const mode =
    typeof configOrMode === "string"
      ? configOrMode
      : configOrMode?.mode || "accenture_versant";
  const diff =
    typeof configOrMode === "string"
      ? maybeDiff || "Mixed"
      : configOrMode?.difficulty || "Mixed";

  const filterByDiff = (list: SvarQuestion[]) => {
    if (!list || list.length === 0) return [];
    if (diff === "All" || diff === "Mixed") return list;
    const filtered = list.filter((q) => q.difficulty === diff);
    return filtered.length > 0 ? filtered : list;
  };

  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  let chosenQuestions: SvarQuestion[] = [];
  let totalTime = 20;

  if (mode === "accenture_versant") {
    totalTime = 25;
    // Exactly matches Accenture Communication Round pattern:
    // 1. Reading (8 Qs)
    // 2. Repeat Sentences (16 Qs)
    // 3. Questions / Short Answers (20 Qs)
    // 4. Sentence Builds (10 Qs)
    // 5. Story Retelling (3 Qs)
    // 6. Open Speaking (2 Qs)
    const r = shuffle(filterByDiff(SVAR_QUESTION_BANK.reading)).slice(0, 8);
    const rs = shuffle(filterByDiff(SVAR_QUESTION_BANK.repeat_sentences)).slice(0, 16);
    const sa = shuffle(filterByDiff(SVAR_QUESTION_BANK.short_answers)).slice(0, 20);
    const sb = shuffle(filterByDiff(SVAR_QUESTION_BANK.sentence_builds)).slice(0, 10);
    const sr = shuffle(filterByDiff(SVAR_QUESTION_BANK.story_retelling)).slice(0, 3);
    const os = shuffle(filterByDiff(SVAR_QUESTION_BANK.open_speaking)).slice(0, 2);

    chosenQuestions = [...r, ...rs, ...sa, ...sb, ...sr, ...os];
  } else {
    // SVAR Corporate Mode (Balanced 30 Qs)
    totalTime = 20;
    const r = shuffle(filterByDiff(SVAR_QUESTION_BANK.reading)).slice(0, 5);
    const rs = shuffle(filterByDiff(SVAR_QUESTION_BANK.repeat_sentences)).slice(0, 5);
    const lc = shuffle(filterByDiff(SVAR_QUESTION_BANK.listening_comp)).slice(0, 5);
    const gc = shuffle(filterByDiff(SVAR_QUESTION_BANK.grammar_correction)).slice(0, 5);
    const sr = shuffle(filterByDiff(SVAR_QUESTION_BANK.story_retelling)).slice(0, 5);
    const os = shuffle(filterByDiff(SVAR_QUESTION_BANK.open_speaking)).slice(0, 5);

    chosenQuestions = [...r, ...rs, ...lc, ...gc, ...sr, ...os];
  }

  return {
    questions: chosenQuestions,
    mode,
    totalTimeMinutes: totalTime,
  };
}
