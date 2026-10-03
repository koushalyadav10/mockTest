import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "Uploaded_Document.pdf";
    let fileType = "application/pdf";
    let fileSize = 0;
    let buffer: Buffer = Buffer.alloc(0);
    let rawText: string | null = null;
    let pageCount = 1;

    // Handle Direct Text Paste (JSON payload)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      rawText = (body.rawText || "").trim();
      if (!rawText) {
        return NextResponse.json({ error: "No text content provided to extract" }, { status: 400 });
      }
      fileName = (body.fileName || `Pasted_Questions_${Date.now()}.txt`).trim();
      fileType = "text/plain";
      buffer = Buffer.from(rawText, "utf-8");
      fileSize = buffer.length;
      pageCount = Math.max(1, Math.ceil(rawText.split(/\n\s*\n/).length / 4));
    } else {
      // Handle Multipart Form Data (File upload or Form text)
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const formText = formData.get("rawText") as string | null;

      if (formText && formText.trim().length > 0) {
        rawText = formText.trim();
        fileName = (formData.get("fileName") as string) || `Pasted_Paper_${Date.now()}.txt`;
        fileType = "text/plain";
        buffer = Buffer.from(rawText, "utf-8");
        fileSize = buffer.length;
        pageCount = Math.max(1, Math.ceil(rawText.split(/\n\s*\n/).length / 4));
      } else if (file) {
        fileName = file.name;
        const rawMime = file.type || "";
        fileSize = file.size;

        const lowerName = fileName.toLowerCase();
        const isPdfExt = lowerName.endsWith(".pdf");
        const isImgExt = /\.(png|jpe?g|webp)$/i.test(lowerName);
        const isTxtExt = lowerName.endsWith(".txt");

        // Determine real fileType with extension fallback for Windows
        if (isPdfExt || rawMime === "application/pdf" || rawMime === "application/x-pdf") {
          fileType = "application/pdf";
        } else if (isImgExt || rawMime.startsWith("image/")) {
          fileType = rawMime || "image/png";
        } else if (isTxtExt || rawMime === "text/plain") {
          fileType = "text/plain";
        } else {
          return NextResponse.json(
            { error: `Unsupported file format (${fileName}). Please upload a PDF, image, or text file.` },
            { status: 400 }
          );
        }

        // Validate max file size (25MB)
        if (fileSize > 25 * 1024 * 1024) {
          return NextResponse.json(
            { error: "File exceeds maximum size of 25MB." },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);

        if (fileType === "application/pdf") {
          try {
            const pdf = require("pdf-parse");
            const parsed = await pdf(buffer);
            if (parsed?.text && parsed.text.trim().length > 0) {
              rawText = parsed.text;
              pageCount = parsed.numpages || 1;
            }
          } catch (pdfErr) {
            console.warn("PDF parsing warning in upload route:", pdfErr);
          }
        } else if (fileType === "text/plain") {
          rawText = buffer.toString("utf-8");
        }
      } else {
        return NextResponse.json({ error: "No file or text content provided" }, { status: 400 });
      }
    }

    // Get or create default student user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "student@examforge.ai",
          name: "Aditya Sharma",
          passwordHash: "mock_hash",
        },
      });
    }

    const documentRecord = await prisma.uploadedDocument.create({
      data: {
        userId: user.id,
        fileName,
        fileType,
        fileSize,
        pageCount,
        isScanned: fileType.startsWith("image/") || (rawText === null || rawText.trim().length < 50),
        status: "UPLOADING",
        processingStep: "STEP 1: Document uploaded successfully",
        rawText,
      },
    });

    // Save uploaded file to public/uploads directory for preview & embedding
    let pdfUrl: string | null = null;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const ext = fileType === "application/pdf" ? "pdf" : fileType.startsWith("image/") ? "png" : "txt";
      const savedFilePath = path.join(uploadsDir, `${documentRecord.id}.${ext}`);
      fs.writeFileSync(savedFilePath, buffer);
      pdfUrl = `/uploads/${documentRecord.id}.${ext}`;
    } catch (saveErr) {
      console.warn("Could not write file to public/uploads:", saveErr);
    }

    return NextResponse.json({
      success: true,
      documentId: documentRecord.id,
      fileName,
      fileSize,
      fileType,
      pageCount,
      hasExtractedText: Boolean(rawText && rawText.length > 0),
      pdfUrl,
    });
  } catch (error: any) {
    console.error("Document upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload document" },
      { status: 500 }
    );
  }
}
