import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DocumentProcessingPipeline } from "@/lib/ai/pipeline";
import fs from "fs";
import path from "path";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Try reading saved buffer if present
    let fileBuffer: Buffer | undefined;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    for (const ext of ["pdf", "txt", "png", "jpg", "jpeg", "webp"]) {
      const filePath = path.join(uploadsDir, `${documentId}.${ext}`);
      if (fs.existsSync(filePath)) {
        try {
          fileBuffer = fs.readFileSync(filePath);
          break;
        } catch (e) {}
      }
    }

    // Run the 15-step AI extraction pipeline with actual document text
    const pipeline = new DocumentProcessingPipeline();

    const result = await pipeline.runPipeline({
      documentId,
      fileName: document.fileName,
      fileType: document.fileType,
      fileBuffer,
      textFallback: document.rawText || undefined,
    });

    return NextResponse.json({
      success: true,
      documentId,
      extraction: result,
    });
  } catch (error: any) {
    console.error("Document processing failed:", error);
    return NextResponse.json(
      { error: error.message || "Document processing failed" },
      { status: 500 }
    );
  }
}
