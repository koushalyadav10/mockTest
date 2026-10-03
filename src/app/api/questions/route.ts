import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");
    const questionType = searchParams.get("questionType");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const requiresReview = searchParams.get("requiresReview");
    const documentId = searchParams.get("documentId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const where: any = {};
    if (documentId && documentId !== "ALL") where.documentId = documentId;
    if (subject && subject !== "ALL") where.subject = subject;
    if (topic && topic !== "ALL") where.topic = topic;
    if (difficulty && difficulty !== "ALL") where.difficulty = difficulty;
    if (questionType && questionType !== "ALL") where.questionType = questionType;
    if (source && source !== "ALL") where.source = source;
    if (status && status !== "ALL") where.status = status;
    if (requiresReview === "true") where.requiresReview = true;
    if (search) {
      where.OR = [
        { questionText: { contains: search } },
        { topic: { contains: search } },
      ];
    }

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        include: {
          options: true,
        },
        orderBy: { questionNumber: "asc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      limit,
      questions: questions.map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        language: q.language,
        subject: q.subject,
        topic: q.topic,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        questionType: q.questionType,
        source: q.source,
        year: q.year,
        exam: q.exam,
        tags: q.tags,
        questionText: q.questionText,
        hasVisualContent: q.hasVisualContent,
        visualType: q.visualType,
        imageUrl: q.imageUrl,
        sourceAnswer: q.sourceAnswer,
        aiSuggestedAnswer: q.aiSuggestedAnswer,
        verifiedAnswer: q.verifiedAnswer,
        explanation: q.explanation,
        requiresReview: q.requiresReview,
        status: q.status,
        confidence: {
          question: q.confidenceQuestion,
          options: q.confidenceOptions,
          classification: q.confidenceClassification,
          answer: q.confidenceAnswer,
        },
        options: q.options.map((opt) => ({
          id: opt.id,
          stableId: opt.stableId,
          label: opt.label,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      questionText,
      subject,
      topic,
      difficulty = "MEDIUM",
      language = "en",
      options,
      explanation,
    } = body;

    if (!questionText || !subject || !topic || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Missing required question fields or insufficient options." },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        questionNumber: (await prisma.question.count()) + 1,
        questionText,
        subject,
        topic,
        difficulty,
        language,
        explanation,
        status: "APPROVED",
        requiresReview: false,
        confidenceQuestion: 1.0,
        confidenceOptions: 1.0,
        confidenceClassification: 1.0,
        confidenceAnswer: 1.0,
        options: {
          create: options.map((opt: any, idx: number) => ({
            stableId: opt.stableId || `opt_manual_${Date.now()}_${idx}`,
            label: opt.label || String.fromCharCode(65 + idx),
            text: opt.text,
            isCorrect: Boolean(opt.isCorrect),
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create question" },
      { status: 500 }
    );
  }
}
