import { prisma } from "../src/lib/db";
import fs from "fs";
import path from "path";
const pdfParse = require("pdf-parse");

async function main() {
  const docs = await prisma.uploadedDocument.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  for (const doc of docs) {
    console.log(`\n========================================`);
    console.log(`ID: ${doc.id}`);
    console.log(`FileName: ${doc.fileName}`);
    console.log(`Status: ${doc.status}`);
    console.log(`Questions Extracted Count: ${(doc as any).questionsExtracted}`);
    console.log(`RawText Length in DB: ${doc.rawText?.length || 0}`);
    
    // Check file on disk
    const filePath = path.join(process.cwd(), "public", "uploads", `${doc.id}.pdf`);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      console.log(`File on disk size: ${buf.length} bytes`);
      try {
        const parsed = await pdfParse(buf);
        console.log(`pdf-parse pages: ${parsed.numpages}`);
        console.log(`pdf-parse text length: ${parsed.text?.length}`);
        console.log(`pdf-parse snippet: ${parsed.text?.slice(0, 300)}`);
      } catch (err: any) {
        console.log(`pdf-parse error: ${err.message}`);
      }
    } else {
      console.log(`File not on disk at ${filePath}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
