import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "scratch", "pipe-images");
const files = fs.readdirSync(dir).sort((a, b) => {
  const na = parseInt(a.match(/\d+/)?.[0] || "0");
  const nb = parseInt(b.match(/\d+/)?.[0] || "0");
  return na - nb;
});

for (const f of files) {
  const p = path.join(dir, f);
  const stat = fs.statSync(p);
  console.log(`${f}: ${stat.size} bytes`);
}
