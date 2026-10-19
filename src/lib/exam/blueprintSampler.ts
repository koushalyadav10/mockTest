import { prisma } from "@/lib/db";

export interface ChapterAllocation {
  id: string; // documentId or chapterId
  documentId?: string | null;
  chapterId?: string | null;
  subject: string;
  title: string;
  quota: number;
  selectionMode?: "RANDOM" | "SEQUENTIAL";
}

export interface SampledQuestionResult {
  id: string;
  questionNumber: number;
  questionText: string;
  subject: string;
  topic: string;
  chapterTitle?: string;
  sourceAnswer?: string | null;
  verifiedAnswer?: string | null;
  aiSuggestedAnswer?: string | null;
  options: {
    id: string;
    stableId: string;
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string | null;
}

/**
 * Uniform in-place Fisher-Yates shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Samples questions based on multi-subject / multi-chapter allocations and ordering mode.
 */
export async function sampleBlueprintQuestions(
  allocations: ChapterAllocation[],
  orderingMode: "JUMBLED" | "SECTIONAL" = "JUMBLED"
): Promise<{
  questions: SampledQuestionResult[];
  subjectBreakdown: Record<string, { total: number; chapters: { title: string; count: number }[] }>;
}> {
  const sampledByAllocation: { allocation: ChapterAllocation; questions: any[] }[] = [];
  const subjectBreakdown: Record<string, { total: number; chapters: { title: string; count: number }[] }> = {};

  for (const alloc of allocations) {
    if (!alloc.quota || alloc.quota <= 0) continue;

    const where: any = {};
    if (alloc.documentId) {
      where.documentId = alloc.documentId;
    } else if (alloc.chapterId) {
      where.chapterId = alloc.chapterId;
    } else {
      where.id = alloc.id;
    }

    // Fetch questions from question bank
    const pool = await prisma.question.findMany({
      where,
      include: {
        options: {
          orderBy: { label: "asc" },
        },
      },
      orderBy: { questionNumber: "asc" },
    });

    if (pool.length === 0) continue;

    const mode = alloc.selectionMode || "RANDOM";
    let picked: typeof pool = [];

    if (mode === "SEQUENTIAL") {
      picked = pool.slice(0, Math.min(alloc.quota, pool.length));
    } else {
      const shuffled = shuffleArray(pool);
      picked = shuffled.slice(0, Math.min(alloc.quota, pool.length));
    }

    // Attach metadata
    const enriched = picked.map((q) => ({
      ...q,
      chapterTitle: alloc.title,
    }));

    sampledByAllocation.push({
      allocation: alloc,
      questions: enriched,
    });

    // Track breakdown
    const subj = alloc.subject || "General";
    if (!subjectBreakdown[subj]) {
      subjectBreakdown[subj] = { total: 0, chapters: [] };
    }
    subjectBreakdown[subj].total += enriched.length;
    subjectBreakdown[subj].chapters.push({
      title: alloc.title,
      count: enriched.length,
    });
  }

  let finalQuestions: any[] = [];

  if (orderingMode === "JUMBLED") {
    // Flatten and shuffle across all subjects and chapters
    const all = sampledByAllocation.flatMap((s) => s.questions);
    finalQuestions = shuffleArray(all);
  } else {
    // Group sectional by Subject, keeping chapters sequential within their subject
    const subjectOrder = ["Quantitative Aptitude", "Mathematics", "Reasoning", "English", "General Awareness"];
    const grouped: Record<string, any[]> = {};

    for (const item of sampledByAllocation) {
      const subj = item.allocation.subject || "General";
      if (!grouped[subj]) grouped[subj] = [];
      grouped[subj].push(...item.questions);
    }

    // Order according to subjectOrder
    for (const subj of subjectOrder) {
      if (grouped[subj]) {
        finalQuestions.push(...grouped[subj]);
        delete grouped[subj];
      }
    }
    // Append any remaining subjects
    for (const remainingSubj in grouped) {
      finalQuestions.push(...grouped[remainingSubj]);
    }
  }

  // Format clean output
  const formatted: SampledQuestionResult[] = finalQuestions.map((q, idx) => ({
    id: q.id,
    questionNumber: idx + 1,
    questionText: q.questionText,
    subject: q.subject,
    topic: q.topic,
    chapterTitle: q.chapterTitle,
    sourceAnswer: q.sourceAnswer,
    verifiedAnswer: q.verifiedAnswer,
    aiSuggestedAnswer: q.aiSuggestedAnswer,
    options: q.options.map((opt: any) => ({
      id: opt.id,
      stableId: opt.stableId,
      label: opt.label,
      text: opt.text,
      isCorrect: opt.isCorrect,
    })),
    explanation: q.explanation,
  }));

  return {
    questions: formatted,
    subjectBreakdown,
  };
}
