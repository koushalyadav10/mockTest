import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    // Allow admin or teacher or staff
    if (session && session.role !== "ADMIN" && session.role !== "TEACHER") {
      return NextResponse.json({ error: "Access denied. Admin or Teacher role required." }, { status: 403 });
    }

    // 1. Fetch Maths chapters from UploadedDocument (SSC_MATHS_Ch%.pdf)
    const mathsDocs = await prisma.uploadedDocument.findMany({
      where: {
        fileName: {
          startsWith: "SSC_MATHS_Ch",
        },
      },
      select: {
        id: true,
        fileName: true,
        _count: {
          select: { questions: true },
        },
      },
    });

    const mathsChapters = mathsDocs
      .map((doc) => {
        const match = doc.fileName.match(/SSC_MATHS_Ch(\d+)_([A-Za-z0-9_&-]+)\.pdf/);
        const chnum = match ? parseInt(match[1], 10) : 0;
        const rawName = match ? match[2].replace(/_/g, " ").replace(/-/g, " ").trim() : doc.fileName.replace(".pdf", "");
        return {
          id: doc.id,
          documentId: doc.id,
          chapterId: null,
          chapterNumber: chnum,
          title: `Chapter ${chnum.toString().padStart(2, "0")}: ${rawName}`,
          questionCount: doc._count.questions,
          subject: "Quantitative Aptitude",
        };
      })
      .filter((c) => c.questionCount > 0)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    // 2. Fetch Reasoning chapters
    const reasoningQuestions = await prisma.question.groupBy({
      by: ["documentId", "chapterId"],
      where: {
        subject: "Reasoning",
        documentId: { startsWith: "doc_pinnacle_reasoning" },
      },
      _count: { id: true },
    });

    const reasoningChapterIds = reasoningQuestions.map((q) => q.chapterId).filter(Boolean) as string[];
    const bookChapters = await prisma.bookChapter.findMany({
      where: { id: { in: reasoningChapterIds } },
      select: { id: true, title: true, chapterNumber: true },
    });
    const bookChapterMap = new Map(bookChapters.map((bc) => [bc.id, bc]));

    const reasoningChapters = reasoningQuestions
      .map((item) => {
        const bc = item.chapterId ? bookChapterMap.get(item.chapterId) : null;
        const chnum = bc?.chapterNumber || 0;
        const title = bc?.title || item.documentId?.replace("doc_pinnacle_reasoning_", "").replace(/_/g, " ").toUpperCase() || "Reasoning Topic";
        return {
          id: item.documentId || item.chapterId || "",
          documentId: item.documentId || null,
          chapterId: item.chapterId || null,
          chapterNumber: chnum,
          title: chnum > 0 ? `Chapter ${chnum.toString().padStart(2, "0")}: ${title}` : title,
          questionCount: item._count.id,
          subject: "Reasoning",
        };
      })
      .filter((c) => c.questionCount > 0)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    // 3. Fetch English chapters
    const englishQuestions = await prisma.question.groupBy({
      by: ["documentId", "chapterId"],
      where: {
        subject: { contains: "English" },
      },
      _count: { id: true },
    });

    const engChapterIds = englishQuestions.map((q) => q.chapterId).filter(Boolean) as string[];
    const engDocIds = englishQuestions.map((q) => q.documentId).filter(Boolean) as string[];

    const [engBookChapters, engDocs] = await Promise.all([
      prisma.bookChapter.findMany({
        where: { id: { in: engChapterIds } },
        select: { id: true, title: true, chapterNumber: true },
      }),
      prisma.uploadedDocument.findMany({
        where: { id: { in: engDocIds } },
        select: { id: true, fileName: true },
      }),
    ]);

    const engBcMap = new Map(engBookChapters.map((bc) => [bc.id, bc]));
    const engDocMap = new Map(engDocs.map((d) => [d.id, d]));

    const englishChapters = englishQuestions
      .map((item) => {
        const bc = item.chapterId ? engBcMap.get(item.chapterId) : null;
        const doc = item.documentId ? engDocMap.get(item.documentId) : null;
        let title = bc?.title;
        if (!title && doc?.fileName) {
          title = doc.fileName
            .replace(".pdf", "")
            .replace("SSC_ENG_V1_CH_", "Ch ")
            .replace(/_/g, " ");
        }
        if (!title) title = "English Topic";
        return {
          id: item.documentId || item.chapterId || "",
          documentId: item.documentId || null,
          chapterId: item.chapterId || null,
          chapterNumber: bc?.chapterNumber || 0,
          title: bc?.chapterNumber ? `Ch ${bc.chapterNumber.toString().padStart(2, "0")}: ${title}` : title,
          questionCount: item._count.id,
          subject: "English",
        };
      })
      .filter((c) => c.questionCount > 0)
      .sort((a, b) => a.title.localeCompare(b.title));

    // 4. Fetch General Awareness chapters
    const gaQuestions = await prisma.question.groupBy({
      by: ["documentId", "chapterId"],
      where: {
        subject: { contains: "General Awareness" },
      },
      _count: { id: true },
    });

    const gaChapterIds = gaQuestions.map((q) => q.chapterId).filter(Boolean) as string[];
    const gaDocIds = gaQuestions.map((q) => q.documentId).filter(Boolean) as string[];

    const [gaBookChapters, gaDocs] = await Promise.all([
      prisma.bookChapter.findMany({
        where: { id: { in: gaChapterIds } },
        select: { id: true, title: true, chapterNumber: true },
      }),
      prisma.uploadedDocument.findMany({
        where: { id: { in: gaDocIds } },
        select: { id: true, fileName: true },
      }),
    ]);

    const gaBcMap = new Map(gaBookChapters.map((bc) => [bc.id, bc]));
    const gaDocMap = new Map(gaDocs.map((d) => [d.id, d]));

    const gaChapters = gaQuestions
      .map((item) => {
        const bc = item.chapterId ? gaBcMap.get(item.chapterId) : null;
        const doc = item.documentId ? gaDocMap.get(item.documentId) : null;
        let title = bc?.title;
        if (!title && doc?.fileName) {
          title = doc.fileName
            .replace(".pdf", "")
            .replace("SSC_GK_CH_", "Ch ")
            .replace(/_/g, " ");
        }
        if (!title) title = "General Awareness Topic";
        return {
          id: item.documentId || item.chapterId || "",
          documentId: item.documentId || null,
          chapterId: item.chapterId || null,
          chapterNumber: bc?.chapterNumber || 0,
          title: bc?.chapterNumber ? `Ch ${bc.chapterNumber.toString().padStart(2, "0")}: ${title}` : title,
          questionCount: item._count.id,
          subject: "General Awareness",
        };
      })
      .filter((c) => c.questionCount > 0)
      .sort((a, b) => a.title.localeCompare(b.title));

    const subjects = [
      {
        id: "QUANTITATIVE_APTITUDE",
        name: "Quantitative Aptitude (Maths)",
        displayName: "Mathematics / Quantitative Aptitude",
        totalQuestions: mathsChapters.reduce((acc, c) => acc + c.questionCount, 0),
        chapters: mathsChapters,
      },
      {
        id: "REASONING",
        name: "Reasoning",
        displayName: "Reasoning (General Intelligence)",
        totalQuestions: reasoningChapters.reduce((acc, c) => acc + c.questionCount, 0),
        chapters: reasoningChapters,
      },
      {
        id: "ENGLISH",
        name: "English",
        displayName: "English Language & Comprehension",
        totalQuestions: englishChapters.reduce((acc, c) => acc + c.questionCount, 0),
        chapters: englishChapters,
      },
      {
        id: "GENERAL_AWARENESS",
        name: "General Awareness",
        displayName: "General Awareness & Static GK",
        totalQuestions: gaChapters.reduce((acc, c) => acc + c.questionCount, 0),
        chapters: gaChapters,
      },
    ];

    return NextResponse.json({
      success: true,
      subjects,
    });
  } catch (error: any) {
    console.error("Error in chapters-by-subject:", error);
    return NextResponse.json({ error: error.message || "Failed to load chapters" }, { status: 500 });
  }
}
