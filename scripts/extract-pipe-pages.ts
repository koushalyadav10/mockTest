import fs from "fs";
import path from "path";

// A script to extract JPEG images from the PDF stream
const filePath = path.join(process.cwd(), "public", "uploads", "2c8feba3-8ea4-4336-981d-86403913ed4d.pdf");
const buf = fs.readFileSync(filePath);
console.log("PDF buffer length:", buf.length);

const outDir = path.join(process.cwd(), "scratch", "pipe-images");
fs.mkdirSync(outDir, { recursive: true });

// Search for DCTDecode or image streams
// JPEG begins with 0xFF 0xD8 and ends with 0xFF 0xD9
let imgIndex = 0;
let pos = 0;

while (pos < buf.length - 4) {
  if (buf[pos] === 0xFF && buf[pos + 1] === 0xD8 && buf[pos + 2] === 0xFF) {
    // Found JPEG header!
    let endPos = pos + 3;
    while (endPos < buf.length - 1) {
      if (buf[endPos] === 0xFF && buf[endPos + 1] === 0xD9) {
        // Found end of JPEG
        const imgBuf = buf.slice(pos, endPos + 2);
        if (imgBuf.length > 50000) { // only full page scans
          const imgName = `page_${imgIndex + 1}.jpg`;
          fs.writeFileSync(path.join(outDir, imgName), imgBuf);
          console.log(`Saved ${imgName} with size: ${imgBuf.length} bytes`);
          imgIndex++;
        }
        pos = endPos + 2;
        break;
      }
      endPos++;
    }
  }
  pos++;
}

console.log(`Total full page images extracted: ${imgIndex}`);
