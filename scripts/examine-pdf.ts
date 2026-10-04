import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "uploads", "2c8feba3-8ea4-4336-981d-86403913ed4d.pdf");
const buf = fs.readFileSync(filePath);
console.log("File size:", buf.length);

// Search for strings or streams
const str = buf.toString("latin1");
const xobjectCount = (str.match(/\/Type\s*\/XObject/g) || []).length;
const imageCount = (str.match(/\/Subtype\s*\/Image/g) || []).length;
const textBlocks = (str.match(/BT[\s\S]*?ET/g) || []).length;
const pages = (str.match(/\/Type\s*\/Page\b/g) || []).length;

console.log({
  xobjectCount,
  imageCount,
  textBlocks,
  pages,
});

// Check if there are any words in latin1 text
const matches = str.match(/\b(pipe|tank|hours|minutes|cistern)\b/gi);
console.log("Found keywords in raw buffer:", matches ? matches.length : 0);
