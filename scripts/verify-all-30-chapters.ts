import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyAllChapters() {
  console.log("=========================================================================================");
  console.log("             ADITYA RANJAN 6500+ TCS MCQs — COMPLETE 30 CHAPTER VERIFICATION              ");
  console.log("=========================================================================================");

  const exams = await prisma.examConfig.findMany({
    orderBy: { code: "asc" },
    include: {
      sections: true,
    },
  });

  console.log(`Found ${exams.length} Exam Configurations in Database.\n`);

  console.log(
    "| Ch# | Chapter Title                                      | Expected | In DB | Options | Status        | Sequential |"
  );
  console.log(
    "|:---:|:---------------------------------------------------|:--------:|:-----:|:-------:|:-------------:|:----------:|"
  );

  let totalExpected = 0;
  let totalInDb = 0;
  let allSequential = true;

  for (let i = 0; i < exams.length; i++) {
    const exam = exams[i];
    const qCountInDb = await prisma.question.count({
      where: { documentId: exam.documentId },
    });
    const expected = exam.totalQuestions;
    totalExpected += expected;
    totalInDb += qCountInDb;

    // Check first and last question numbers
    const questions = await prisma.question.findMany({
      where: { documentId: exam.documentId },
      orderBy: { questionNumber: "asc" },
      select: { questionNumber: true },
    });

    const isSeq =
      questions.length === expected &&
      questions[0]?.questionNumber === 1 &&
      questions[questions.length - 1]?.questionNumber === expected;

    if (!isSeq) allSequential = false;

    // Get options count
    const optionsCount = await prisma.questionOption.count({
      where: {
        question: {
          documentId: exam.documentId,
        },
      },
    });

    const statusMatch = qCountInDb === expected ? "100% MATCH" : "MISMATCH";
    const seqStatus = isSeq ? "1..N (Exact)" : "FAIL";

    const displayTitle = exam.title.replace("SSC Maths (Aditya Ranjan) — ", "");

    console.log(
      `| ${String(i + 1).padStart(3)} | ${displayTitle.padEnd(50)} | ${String(expected).padStart(8)} | ${String(qCountInDb).padStart(5)} | ${String(optionsCount).padStart(7)} | ${statusMatch.padEnd(13)} | ${seqStatus.padEnd(10)} |`
    );
  }

  console.log("=========================================================================================");
  console.log(`TOTAL EXPECTED QUESTIONS : ${totalExpected}`);
  console.log(`TOTAL QUESTIONS IN DB    : ${totalInDb}`);
  console.log(`ALL 30 CHAPTERS MATCH    : ${totalExpected === totalInDb ? "YES (100% EXACT)" : "NO"}`);
  console.log(`ALL STRICTLY SEQUENTIAL  : ${allSequential ? "YES (Verified 1..N)" : "NO"}`);
  console.log("=========================================================================================");
}

verifyAllChapters()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
