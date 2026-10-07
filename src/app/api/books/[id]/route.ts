import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const volumeNumber = searchParams.get("vol");

    // Optional user authentication for learning progress
    let userId: string | null = null;
    const token = cookies().get("auth-token")?.value;
    if (token) {
      try {
        const decoded = verifyJwt(token);
        if (decoded?.userId) userId = decoded.userId;
      } catch (e) {}
    }

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        volumes: {
          orderBy: { volumeNumber: "asc" },
        },
        chapters: {
          include: {
            volume: {
              select: {
                id: true,
                volumeNumber: true,
                title: true,
              },
            },
            userProgress: userId
              ? {
                  where: { userId },
                }
              : false,
          },
          orderBy: [{ volumeId: "asc" }, { chapterNumber: "asc" }],
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Filter by volume if specified
    let filteredChapters = book.chapters;
    if (volumeNumber && volumeNumber !== "ALL") {
      const volNum = parseInt(volumeNumber, 10);
      filteredChapters = book.chapters.filter((ch: any) => ch.volume?.volumeNumber === volNum);
    }

    return NextResponse.json({
      success: true,
      book: {
        ...book,
        chapters: filteredChapters,
      },
    });
  } catch (error: any) {
    console.error("Error fetching book details:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch book" }, { status: 500 });
  }
}
