import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const qs = await prisma.question.findMany({
    select: {
      id: true,
      questionNumber: true,
      questionText: true,
      tags: true,
      exam: true,
      year: true,
    },
    take: 60,
  });

  const tagPatterns = [
    /\*(?:\s*\()?([^*]+(?:SSC|CGL|CHSL|CPO|MTS|GD|Shift|Tier)[^*]+)(?:\)\s*)?\*/i,
    /\[([^[\]]*(?:SSC|CGL|CHSL|CPO|MTS|GD|Shift|Tier)[^[\]]*)\]/i,
    /\(([^\(\)]*(?:SSC|CGL|CHSL|CPO|MTS|GD|Shift|Tier)[^\(\)]*)\)/i,
  ];

  let matchesCount = 0;
  for (const q of qs) {
    for (const pat of tagPatterns) {
      const m = q.questionText.match(pat);
      if (m) {
        matchesCount++;
        console.log(`Q.${q.questionNumber} Tag Found: "${m[0]}" -> Extracted label: "${m[1].trim()}"`);
        break;
      }
    }
  }
  console.log(`Total questions checked: ${qs.length}, matched with tag: ${matchesCount}`);
}

main().finally(() => prisma.$disconnect());
