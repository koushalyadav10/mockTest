import { z } from "zod";

export const BoundingBoxSchema = z.object({
  x: z.number().min(0).max(100), // Normalized percentage 0 - 100
  y: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
});

export type BoundingBox = z.infer<typeof BoundingBoxSchema>;

export const ExtractedOptionSchema = z.object({
  id: z.string(), // Stable ID
  label: z.string().min(1), // "A", "B", "C", "D"
  text: z.string().min(1, "Option text cannot be empty"),
  isCorrect: z.boolean().default(false),
  boundingBox: BoundingBoxSchema.optional().nullable(),
});

export type ExtractedOption = z.infer<typeof ExtractedOptionSchema>;

export const VisualTypeEnum = z.enum([
  "DIAGRAM",
  "GRAPH",
  "TABLE",
  "IMAGE",
  "MAP",
  "CHART",
  "FIGURE",
  "UNKNOWN",
]);

export type VisualType = z.infer<typeof VisualTypeEnum>;

export const QuestionTypeEnum = z.enum([
  "MCQ",
  "NUMERICAL",
  "STATEMENT_BASED",
  "ASSERTION_REASON",
  "MATCHING",
  "PASSAGE_BASED",
  "CLOZE",
  "DIAGRAM_BASED",
  "TABLE_BASED",
  "UNKNOWN",
]);

export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const QuestionSourceEnum = z.enum([
  "SOURCE_QUESTION",
  "AI_GENERATED_PRACTICE",
]);

export type QuestionSource = z.infer<typeof QuestionSourceEnum>;

export const SourceMetadataSchema = z.object({
  fileId: z.string().optional(),
  page: z.number().int().default(1),
  boundingBox: BoundingBoxSchema.optional().nullable(),
});

export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;

export const ExtractedQuestionSchema = z.object({
  questionId: z.string().optional(),
  questionNumber: z.number().int().positive(),
  language: z.enum(["en", "hi", "bilingual"]).default("en"),
  subject: z.enum([
    "General Intelligence",
    "Quantitative Aptitude",
    "English Language",
    "General Awareness",
  ]),
  topic: z.string().min(1),
  subtopic: z.string().optional().nullable(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  difficultyConfidence: z.number().min(0).max(1).default(0.85),
  questionType: QuestionTypeEnum.default("MCQ"),
  sourceType: QuestionSourceEnum.optional(),
  source: z
    .union([QuestionSourceEnum, SourceMetadataSchema])
    .default("SOURCE_QUESTION"),
  year: z.number().int().optional().nullable(),
  exam: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  questionText: z.string().min(3, "Question text must be at least 3 characters"),
  hasVisualContent: z.boolean().default(false),
  visualType: VisualTypeEnum.default("UNKNOWN"),
  imageUrl: z.string().optional().nullable(),
  diagramUrl: z.string().optional().nullable(),
  visualSourcePage: z.number().int().optional().nullable(),
  visualBoundingBox: BoundingBoxSchema.optional().nullable(),
  questionBoundingBox: BoundingBoxSchema.optional().nullable(),
  optionBoundingBoxes: z
    .array(
      z.object({
        label: z.string(),
        boundingBox: BoundingBoxSchema,
      })
    )
    .optional()
    .nullable(),
  options: z
    .array(ExtractedOptionSchema)
    .min(2, "Question must have at least 2 options")
    .max(5),
  // Three-Level Answer System
  sourceAnswer: z.string().optional().nullable(), // Found in official answer key
  aiSuggestedAnswer: z.string().optional().nullable(), // Inferred by AI
  verifiedAnswer: z.string().optional().nullable(), // Human verified
  explanation: z.string().optional().nullable(),
  confidence: z.object({
    question: z.number().min(0).max(1),
    options: z.number().min(0).max(1),
    classification: z.number().min(0).max(1),
    subject: z.number().min(0).max(1).optional(),
    topic: z.number().min(0).max(1).optional(),
    difficulty: z.number().min(0).max(1).optional(),
    answer: z.number().min(0).max(1),
    visualAssociation: z.number().min(0).max(1).optional(),
  }),
  requiresReview: z.boolean().default(false),
  extractionVersion: z.number().int().default(1),
  aiProvider: z.string().default("LocalHeuristicOCRProvider"),
  aiModel: z.string().optional().nullable(),
  extractionTimestamp: z.string().optional(),
  sourceMetadata: SourceMetadataSchema.optional(),
});

export type ExtractedQuestion = z.infer<typeof ExtractedQuestionSchema>;

export const DocumentExtractionResultSchema = z.object({
  document: z.object({
    fileName: z.string(),
    pageCount: z.number().int().positive(),
    isScanned: z.boolean().default(false),
    detectedLanguage: z.enum(["en", "hi", "bilingual"]).default("en"),
    detectedQuestionCount: z.number().int().nonnegative(),
    hasAnswerKey: z.boolean().default(false),
    hasVisualContent: z.boolean().default(false),
    layoutType: z.enum(["SINGLE_COLUMN", "MULTI_COLUMN"]).default("SINGLE_COLUMN"),
  }),
  questions: z.array(ExtractedQuestionSchema),
});

export type DocumentExtractionResult = z.infer<
  typeof DocumentExtractionResultSchema
>;

export interface PipelineStep {
  step: number;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "SKIPPED";
  message?: string;
  timestamp?: string;
}
