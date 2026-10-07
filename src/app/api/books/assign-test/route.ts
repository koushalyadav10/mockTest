import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      subject = "ENGLISH", // "ENGLISH" | "GK_GS" | "MATHS"
      bookId,
      volumeId,
      chapterIds = [],
      questionCount = 20,
      difficulty = "ALL",
      durationMinutes = 30,
      marksPerCorrect = 2.0,
      negativeMarks = 0.5,
      mode = "EXAM", // "EXAM" | "MOCK"
      startDate,
      endDate,
    } = body;

    // Optional user authentication
    let userId: string | null = null;
    let userEmail = "faculty@examforge.ai";
    const token = cookies().get("auth-token")?.value;
    if (token) {
      try {
        const decoded = verifyJwt(token);
        if (decoded?.userId) {
          userId = decoded.userId;
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user?.email) userEmail = user.email;
        }
      } catch (e) {}
    }

    // 1. Resolve questions matching the criteria
    const whereClause: any = {};

    if (chapterIds.length > 0) {
      whereClause.chapterId = { in: chapterIds };
    } else if (volumeId) {
      whereClause.volumeId = volumeId;
    } else if (bookId) {
      whereClause.bookId = bookId;
    }

    if (difficulty && difficulty !== "ALL") {
      whereClause.difficulty = difficulty;
    }

    const availableQuestions = await prisma.question.findMany({
      where: whereClause,
      include: {
        options: true,
        chapter: {
          select: { title: true, chapterNumber: true },
        },
      },
    });

    if (availableQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions found matching your chapter/topic selection." },
        { status: 400 }
      );
    }

    // Pick target question count randomly
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const countToPick = Math.min(
      shuffled.length,
      Math.max(1, parseInt(String(questionCount), 10) || 20)
    );
    const selectedQuestions = shuffled.slice(0, countToPick);

    // 2. Prepare clean assigned title
    const examCode = `ASSIGNED_${Date.now()}`;
    const cleanTitle = title?.trim()
      ? title.trim().startsWith("[Assigned]")
        ? title.trim()
        : `[Assigned] ${title.trim()}`
      : `[Assigned] ${subject === "GK_GS" ? "Static GK" : "English"} Practice (${selectedQuestions.length} Qs)`;

    // 3. Create UploadedDocument container
    const doc = await prisma.uploadedDocument.create({
      data: {
        fileName: `${examCode}.pdf`,
        fileType: "application/pdf",
        fileSize: 2048,
        isPublic: true,
        status: "COMPLETED",
        pageCount: Math.ceil(selectedQuestions.length / 5),
        rawText: cleanTitle,
      },
    });

    // 4. Create ExamConfig
    const examConfig = await prisma.examConfig.create({
      data: {
        code: examCode,
        title: cleanTitle,
        description: `Custom instructor-assigned CBT test from selected textbook chapters. Total ${selectedQuestions.length} questions.`,
        category: "ASSIGNED",
        mode: mode === "EXAM" ? "EXAM" : "MOCK",
        totalQuestions: selectedQuestions.length,
        totalMarks: selectedQuestions.length * marksPerCorrect,
        totalDurationMinutes: Number(durationMinutes) || Math.max(15, Math.ceil(selectedQuestions.length * 1.2)),
        marksPerCorrect: Number(marksPerCorrect),
        negativeMarks: Number(negativeMarks),
        sectionalTiming: false,
        sectionLock: false,
        allowBackNavigation: true,
        navigationRules: "FREE",
        questionShuffle: true,
        optionShuffle: false,
        allowedQuestionTypes: "MCQ",
        difficulty: difficulty === "ALL" ? "MEDIUM" : difficulty,
        languages: "en,hi",
        availability: startDate && endDate ? "SCHEDULED" : "ALWAYS",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        scheduledStatus: "LIVE",
        status: "PUBLISHED",
        documentId: doc.id,
        instructions: JSON.stringify({
          subject,
          chapterIds,
          bookId,
          instantFeedback: false,
          isAssigned: true,
        }),
      },
    });

    // 5. Update doc publishedExamId
    await prisma.uploadedDocument.update({
      where: { id: doc.id },
      data: { publishedExamId: examConfig.id },
    });

    // 6. Create Section
    await prisma.examSectionConfig.create({
      data: {
        examConfigId: examConfig.id,
        name: subject === "GK_GS" ? "General Awareness" : "English Language",
        order: 1,
        questionCount: selectedQuestions.length,
        durationMinutes: examConfig.totalDurationMinutes,
        marksPerCorrect: examConfig.marksPerCorrect,
        negativeMarks: examConfig.negativeMarks,
        allowBackNavigation: true,
      },
    });

    // 7. Duplicate/attach questions to this documentId so CBT exam loads them smoothly
    for (let idx = 0; idx < selectedQuestions.length; idx++) {
      const q = selectedQuestions[idx];
      await prisma.question.create({
        data: {
          documentId: doc.id,
          bookId: q.bookId,
          volumeId: q.volumeId,
          chapterId: q.chapterId,
          questionNumber: idx + 1,
          language: q.language,
          subject: q.subject,
          topic: q.topic,
          subtopic: q.subtopic,
          difficulty: q.difficulty,
          questionType: q.questionType,
          source: "AI_GENERATED_PRACTICE",
          sourceType: q.sourceType,
          year: q.year,
          exam: q.exam,
          tags: q.tags,
          directionText: q.directionText,
          questionText: q.questionText,
          hasVisualContent: q.hasVisualContent,
          visualType: q.visualType,
          imageUrl: q.imageUrl,
          sourceAnswer: q.sourceAnswer,
          verifiedAnswer: q.verifiedAnswer,
          explanation: q.explanation,
          status: "APPROVED",
          generationType: "ORIGINAL",
          sourceConcept: q.sourceConcept,
          options: {
            create: q.options.map((opt) => ({
              stableId: `asg_${Date.now()}_q${idx + 1}_${opt.label.toLowerCase()}`,
              label: opt.label,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action: "ASSIGN_BOOK_TEST",
        entity: "ExamConfig",
        entityId: examConfig.id,
        details: JSON.stringify({
          title: cleanTitle,
          code: examCode,
          questionsCount: selectedQuestions.length,
          chapterCount: chapterIds.length,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test assigned and published successfully!",
      examId: examConfig.id,
      documentId: doc.id,
      code: examConfig.code,
      title: examConfig.title,
      totalQuestions: selectedQuestions.length,
      redirectUrl: `/exams?tab=ASSIGNED`,
    });
  } catch (error: any) {
    console.error("Error creating assigned book test:", error);
    return NextResponse.json(
      { error: error.message || "Failed to assign test" },
      { status: 500 }
    );
  }
}
