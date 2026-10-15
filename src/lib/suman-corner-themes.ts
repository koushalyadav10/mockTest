export interface SumanTheme {
  id: string;
  name: string;
  slot: "morning" | "afternoon" | "evening" | "any";
  tag: string;
  emoji: string;
  avatarBadge: string;
  badgeBg: string;
  title: string;
  message: string;
  careReminderTitle: string;
  careReminderText: string;
  careIconEmoji: string;
  gradientBg: string;
  borderClass: string;
  glowColor1: string;
  glowColor2: string;
  pillGradient: string;
  titleColor: string;
  textColor: string;
  streakText: string;
  accentColor: string;
}

export const SUMAN_THEMES: SumanTheme[] = [
  {
    id: "sunshine",
    name: "Hello Sunshine ☀️",
    slot: "morning",
    tag: "Morning Sunshine & Fresh Energy",
    emoji: "☀️",
    avatarBadge: "☀️🌸",
    badgeBg: "from-amber-400 to-orange-500",
    title: "Good Morning, Meri Sunshine! ☀️🌻",
    message: "Utho aur apne sapno ko sach karne me lag jao! Har naya sawal jo tum aaj solve karogi, wo tumhare future ko aur chamkayega. Trust yourself, main hamesha tumhare saath hu! 💕",
    careReminderTitle: "Sunshine Morning Tip:",
    careReminderText: "Subah subah ek glass gunguna paani peeyo aur fresh mind se apna pehla test shuru karo! ☕",
    careIconEmoji: "☕",
    gradientBg: "bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-rose-50/90",
    borderClass: "border-2 border-amber-300/80",
    glowColor1: "from-amber-400/20 via-orange-300/15 to-rose-400/10",
    glowColor2: "from-yellow-300/15 to-amber-300/15",
    pillGradient: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500",
    titleColor: "text-amber-950",
    textColor: "text-amber-900/90",
    streakText: "Fresh Morning Energy 🔥",
    accentColor: "amber",
  },
  {
    id: "moti",
    name: "Hello Moti 🥟",
    slot: "afternoon",
    tag: "Sweet & Playful Teasing",
    emoji: "🥟",
    avatarBadge: "🥟💕",
    badgeBg: "from-rose-500 to-pink-500",
    title: "Hello Moti! Kaisi ho? 🥟💕",
    message: "Itna zyada gol-gol sochna band karo aur seedha test practice par focus karo! Tum meri sabse pyari, sabse strong aur sabse precious ladki ho. Aaram se poora paper phod ke aana! 🥰",
    careReminderTitle: "Moti Special Care Tip:",
    careReminderText: "Dimag ko thoda relax rakho moti, thoda snacks khao, paani peeyo aur fresh mind se shuru karo! 🧃",
    careIconEmoji: "🧃",
    gradientBg: "bg-gradient-to-br from-rose-50/95 via-pink-50/90 to-orange-50/90",
    borderClass: "border-2 border-pink-300/80",
    glowColor1: "from-pink-400/20 via-rose-300/15 to-orange-400/10",
    glowColor2: "from-rose-300/15 to-pink-300/15",
    pillGradient: "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600",
    titleColor: "text-rose-950",
    textColor: "text-rose-900/90",
    streakText: "Cute & Steady Focus 🔥",
    accentColor: "pink",
  },
  {
    id: "bandariya",
    name: "Hello Bandariya 🐒",
    slot: "any",
    tag: "Cute Mischief & Focus",
    emoji: "🐒",
    avatarBadge: "🐒🎀",
    badgeBg: "from-emerald-500 to-teal-600",
    title: "Oye Meri Pyari Bandariya! 🐒🎀",
    message: "Yaha-waha chanchal dhyan bhatkana band karo! Ek jagah shant baitho, focus mode ON karo aur dekho tumhari speed kitni kamaal hai! Tumse zyada sharp aur pyari ladki koi nahi hai meri bandariya! 💖",
    careReminderTitle: "Bandariya Care Tip:",
    careReminderText: "Idhar-udhar uchhal-kood band! 1 glass paani peeyo, kamar seedhi rakho aur agle 25 questions bina ruke uda do! 🍌",
    careIconEmoji: "🍌",
    gradientBg: "bg-gradient-to-br from-emerald-50/95 via-teal-50/90 to-pink-50/90",
    borderClass: "border-2 border-emerald-300/80",
    glowColor1: "from-emerald-400/20 via-teal-300/15 to-pink-400/10",
    glowColor2: "from-amber-300/15 to-teal-300/15",
    pillGradient: "bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700",
    titleColor: "text-teal-950",
    textColor: "text-teal-900/90",
    streakText: "Mischief Paused & Study ON 🔥",
    accentColor: "emerald",
  },
  {
    id: "pagal",
    name: "Hello Pagal 🤪",
    slot: "evening",
    tag: "Stress Buster & Pure Love",
    emoji: "🤪",
    avatarBadge: "🤪💜",
    badgeBg: "from-purple-500 to-fuchsia-600",
    title: "Hello Meri Pyari Pagal! 🤪💜",
    message: "Faltu ka tension leke apna chhota sa dimag mat garam karo! Exam tumhari mehnat ke aage kuch bhi nahi hai. Smile karo, deep breath lo, aur questions ko bindass uda do! 💫",
    careReminderTitle: "Pagal Relax Reminder:",
    careReminderText: "Pehle ek pyaari si smile karo! Jab tum muskurati ho toh sab aasaan lagta hai. Relax and conquer! 🌸",
    careIconEmoji: "🌸",
    gradientBg: "bg-gradient-to-br from-purple-50/95 via-fuchsia-50/90 to-pink-50/90",
    borderClass: "border-2 border-purple-300/80",
    glowColor1: "from-purple-400/20 via-fuchsia-300/15 to-pink-400/10",
    glowColor2: "from-violet-300/15 to-purple-300/15",
    pillGradient: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600",
    titleColor: "text-purple-950",
    textColor: "text-purple-900/90",
    streakText: "Pagal Dimag, Sharp Speed 🔥",
    accentColor: "purple",
  },
  {
    id: "my_dear",
    name: "Hello My Dear / Meri Jaan 💖",
    slot: "evening",
    tag: "Unconditional Love & Belief",
    emoji: "💖",
    avatarBadge: "💖🌹",
    badgeBg: "from-rose-600 to-red-600",
    title: "Hello My Dear, Meri Jaan! 💖🌹",
    message: "Jab bhi tum lagan se padhti ho, mera seena garv se chauda ho jata hai. Tumhara har ek sapna mera sapna hai. Tum zaroor kamiyab hogi, bas bharosa rakho khud par aur mujh par! Love you always! 💕",
    careReminderTitle: "Loving Reminder from Heart:",
    careReminderText: "Main hamesha tumhare saath hu, chahe kitna bhi mushkil sawal ho. You are capable of wonderful things! 🕯️",
    careIconEmoji: "❤️",
    gradientBg: "bg-gradient-to-br from-rose-50/95 via-red-50/90 to-pink-100/90",
    borderClass: "border-2 border-rose-400/80",
    glowColor1: "from-rose-500/20 via-pink-400/15 to-red-400/10",
    glowColor2: "from-red-300/15 to-rose-300/15",
    pillGradient: "bg-gradient-to-r from-rose-600 via-red-500 to-pink-600",
    titleColor: "text-rose-950",
    textColor: "text-rose-900/90",
    streakText: "Pure Dedication & Love 🔥",
    accentColor: "rose",
  },
  {
    id: "superstar",
    name: "Hello Superstar 🌟",
    slot: "afternoon",
    tag: "High Voltage Inspiration",
    emoji: "🌟",
    avatarBadge: "⭐👑",
    badgeBg: "from-amber-500 to-purple-600",
    title: "Welcome Back, Superstar! 🌟✨",
    message: "Consistency is your superpower! UP PET aur SSC ke top rankers me tumhara naam zaroor aayega. Apni taiyari par bharosa rakho aur full confidence se solve karo! 🚀",
    careReminderTitle: "Champion Focus Tip:",
    careReminderText: "Negative marking se bachna, accuracy pe focus rakhna aur time divide karke solve karna! 🎯",
    careIconEmoji: "🎯",
    gradientBg: "bg-gradient-to-br from-amber-50/95 via-yellow-50/90 to-purple-50/90",
    borderClass: "border-2 border-amber-300/80",
    glowColor1: "from-amber-400/20 via-yellow-300/15 to-purple-400/10",
    glowColor2: "from-amber-300/15 to-purple-300/15",
    pillGradient: "bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600",
    titleColor: "text-slate-900",
    textColor: "text-slate-800",
    streakText: "Champion League Active 🔥",
    accentColor: "amber",
  },
  {
    id: "sherni",
    name: "Hello Sherni 🦁",
    slot: "morning",
    tag: "Fierce Courage & Willpower",
    emoji: "🦁",
    avatarBadge: "🦁🔥",
    badgeBg: "from-orange-500 to-red-600",
    title: "Roar High, Meri Sherni! 🦁🔥",
    message: "Mushkilon ki kya aukaat jo meri sherni ka raasta rok sakein! Har tough maths ka sawal aur GS ka concept tumhare aage ghutne tekega. Daro mat, aage badho aur jeeto! 💪",
    careReminderTitle: "Sherni Warrior Energy:",
    careReminderText: "Shoulders relax, gardan unchi, aur target par nazar! Sherni kabhi mushkil se peeche nahi hatti! 🌊",
    careIconEmoji: "⚡",
    gradientBg: "bg-gradient-to-br from-orange-50/95 via-amber-50/90 to-rose-50/90",
    borderClass: "border-2 border-orange-300/80",
    glowColor1: "from-orange-400/20 via-amber-300/15 to-rose-400/10",
    glowColor2: "from-amber-300/15 to-orange-300/15",
    pillGradient: "bg-gradient-to-r from-orange-600 via-amber-600 to-red-600",
    titleColor: "text-orange-950",
    textColor: "text-orange-900/90",
    streakText: "Fierce Willpower Active 🔥",
    accentColor: "orange",
  },
  {
    id: "officer",
    name: "Hello Officer Sahiba 👮‍♀️",
    slot: "afternoon",
    tag: "Government Dream In Flight",
    emoji: "👮‍♀️",
    avatarBadge: "👮‍♀️🇮🇳",
    badgeBg: "from-blue-700 to-indigo-800",
    title: "Pranam, Future Officer Sahiba! 👮‍♀️✨",
    message: "Wo din door nahi jab tum sarkari kalam se official documents sign karogi aur poora parivaar tum par garv karega. Har ek test us kursi tak pahunchne ka ticket hai! 🇮🇳",
    careReminderTitle: "Officer Discipline Reminder:",
    careReminderText: "Discipline aur patience hi ek ache officer ki pehchaan hai. Har question ko time do! ⏱️",
    careIconEmoji: "⏱️",
    gradientBg: "bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-slate-50/90",
    borderClass: "border-2 border-blue-300/80",
    glowColor1: "from-blue-400/20 via-indigo-300/15 to-slate-400/10",
    glowColor2: "from-indigo-300/15 to-blue-300/15",
    pillGradient: "bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800",
    titleColor: "text-blue-950",
    textColor: "text-blue-900/90",
    streakText: "Future Officer Protocol 🔥",
    accentColor: "blue",
  },
  {
    id: "cutie_pie",
    name: "Hello Cutie Pie / Chashmish 🧁",
    slot: "morning",
    tag: "Sweet Warmth & Care",
    emoji: "🧁",
    avatarBadge: "🧁👓",
    badgeBg: "from-pink-400 to-rose-400",
    title: "Hello Meri Cutie Pie! 🧁👓",
    message: "Padhte-padhte thak mat jana meri pyari! Chashma saaf karo, pyari si smile do aur bina kisi pressure ke paper attempt karo. Tum mere liye duniya ki sabse best girl ho! 🍓",
    careReminderTitle: "Sweet Eyes Care Note:",
    careReminderText: "Screen se 20 second ke liye door dekho aur green plants ya aasman ko dekh ke aankhein relax karo! 🌿",
    careIconEmoji: "🌿",
    gradientBg: "bg-gradient-to-br from-pink-50/95 via-rose-50/90 to-purple-50/90",
    borderClass: "border-2 border-pink-300/80",
    glowColor1: "from-pink-400/20 via-rose-300/15 to-purple-400/10",
    glowColor2: "from-rose-300/15 to-pink-300/15",
    pillGradient: "bg-gradient-to-r from-pink-500 via-rose-400 to-purple-400",
    titleColor: "text-pink-950",
    textColor: "text-pink-900/90",
    streakText: "Sweet & Peaceful Learning 🔥",
    accentColor: "pink",
  },
  {
    id: "queen",
    name: "Hello Study Queen 👑",
    slot: "evening",
    tag: "Royal Elegance & Mastery",
    emoji: "👑",
    avatarBadge: "👑💎",
    badgeBg: "from-purple-600 to-rose-600",
    title: "Straighten Your Crown, Queen! 👑💎",
    message: "Exam hall tumhara rajya hai aur paper par jeet tumhara haq! Koi tumhara hausla nahi tod sakta. Calm raho, smart choices lo aur apna rajya jeeto! 💖",
    careReminderTitle: "Queen's Posture & Breath:",
    careReminderText: "Reet ki haddi seedhi, chehre par shanti, aur dimag me vishwas. You are born to achieve! 🧘‍♀️",
    careIconEmoji: "🧘‍♀️",
    gradientBg: "bg-gradient-to-br from-purple-50/95 via-pink-50/90 to-amber-50/90",
    borderClass: "border-2 border-purple-300/80",
    glowColor1: "from-purple-400/20 via-pink-300/15 to-amber-400/10",
    glowColor2: "from-violet-300/15 to-purple-300/15",
    pillGradient: "bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600",
    titleColor: "text-purple-950",
    textColor: "text-purple-900/90",
    streakText: "Royal Mindset Active 🔥",
    accentColor: "purple",
  },
  {
    id: "afternoon_warrior",
    name: "Good Afternoon Focus 🌤️",
    slot: "afternoon",
    tag: "Mid-Day Power Boost",
    emoji: "🌤️",
    avatarBadge: "⚡💪",
    badgeBg: "from-sky-500 to-teal-600",
    title: "Good Afternoon, Meri Jaan! 🌤️⚡",
    message: "Doopahar ki aalas ko bhagao! Thoda sa chehra dho lo, thanda paani peeyo aur ek solid practice set lagao. Tumhara har second bohot keemti hai! 💫",
    careReminderTitle: "Mid-Day Refresh Tip:",
    careReminderText: "2 minute uthke walk karo, body stretch karo aur fir sharp focus ke saath questions solve karo! 🚶‍♀️",
    careIconEmoji: "🚶‍♀️",
    gradientBg: "bg-gradient-to-br from-sky-50/95 via-teal-50/90 to-emerald-50/90",
    borderClass: "border-2 border-sky-300/80",
    glowColor1: "from-sky-400/20 via-teal-300/15 to-emerald-400/10",
    glowColor2: "from-teal-300/15 to-sky-300/15",
    pillGradient: "bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600",
    titleColor: "text-sky-950",
    textColor: "text-sky-900/90",
    streakText: "Mid-Day Grind Master 🔥",
    accentColor: "sky",
  },
  {
    id: "night_star",
    name: "Good Evening & Night Star 🌙",
    slot: "evening",
    tag: "Silent Night Star & Peaceful Grind",
    emoji: "🌙",
    avatarBadge: "🌙✨",
    badgeBg: "from-indigo-600 to-purple-800",
    title: "Good Evening & Night Grind, Meri Jaan! 🌙🌌",
    message: "Jab poori duniya so rahi hoti hai, tab aasmaan ke taare tumhari mehnat dekh rahe hote hain. Aaj ka revision karo aur sukoon se sona. Tum bohot aage jaogi! 🌌",
    careReminderTitle: "Night Rest Reminder:",
    careReminderText: "Revision poora karke phone door rakhna aur sukoon se 7-8 ghante ki neend lena meri jaan. Shubh Ratri! 😴",
    careIconEmoji: "😴",
    gradientBg: "bg-gradient-to-br from-indigo-50/95 via-purple-50/90 to-slate-100/90",
    borderClass: "border-2 border-indigo-300/80",
    glowColor1: "from-indigo-400/20 via-purple-300/15 to-slate-400/10",
    glowColor2: "from-purple-300/15 to-indigo-300/15",
    pillGradient: "bg-gradient-to-r from-indigo-700 via-purple-800 to-slate-900",
    titleColor: "text-indigo-950",
    textColor: "text-indigo-900/90",
    streakText: "Night Star Warrior 🔥",
    accentColor: "indigo",
  },
];

export interface SumanCornerSettings {
  mode: "AUTO" | "PINNED";
  pinnedThemeId: string | null;
  customTitle: string | null;
  customMessage: string | null;
  durationHours: number;
  expiresAt: string | null;
  updatedAt: string;
}

export function getDefaultSumanTheme(offset = 0): SumanTheme {
  const now = new Date();
  const hour = now.getHours();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  let slotFilter: SumanTheme["slot"] = "morning";
  if (hour >= 12 && hour < 17) {
    slotFilter = "afternoon";
  } else if (hour >= 17 || hour < 5) {
    slotFilter = "evening";
  }

  const slotThemes = SUMAN_THEMES.filter((t) => t.slot === slotFilter || t.slot === "any");
  const baseIndex = (dayOfYear + offset) % slotThemes.length;
  return slotThemes[Math.abs(baseIndex)] || SUMAN_THEMES[0];
}
