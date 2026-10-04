import { prisma } from "../src/lib/db";
import { evaluateTestAttempt } from "../src/lib/exam/scoring-engine";

async function main() {
  const docId = "bac08bdf-8ecf-4cd7-af0e-2764bd609144";
  const doc = await prisma.uploadedDocument.findUnique({
    where: { id: docId },
    include: { questions: { include: { options: true } } },
  });

  if (!doc || !doc.publishedExamId) {
    console.error("Document or publishedExamId not found");
    return;
  }

  const examConfig = await prisma.examConfig.findUnique({
    where: { id: doc.publishedExamId },
  });

  if (!examConfig) {
    console.error("ExamConfig not found");
    return;
  }

  // Find or create test candidate (e.g. Koushal)
  const candidateUser = await prisma.user.findFirst({
    where: { email: "koushalyadavyadav01@gmail.com" },
  });

  console.log("Candidate User:", candidateUser?.name, candidateUser?.email, candidateUser?.studentRollNo);

  // Create Test Attempt
  const attempt = await prisma.testAttempt.create({
    data: {
      userId: candidateUser?.id,
      studentRollNo: candidateUser?.studentRollNo || "EF-KY2026",
      examConfigId: examConfig.id,
      status: "IN_PROGRESS",
      mode: "PRACTICE",
      totalQuestions: doc.questions.length,
      questionOrderJson: JSON.stringify(doc.questions.map((q) => q.id)),
    },
  });

  console.log("Created Test Attempt:", attempt.id);

  // Populate responses (Answer Q.1 correctly, Q.2 correctly, leave some unattempted)
  const q1 = doc.questions.find((q) => q.questionNumber === 1);
  const q2 = doc.questions.find((q) => q.questionNumber === 2);
  const q1Correct = q1?.options.find((o) => o.label === q1.sourceAnswer);
  const q2Correct = q2?.options.find((o) => o.label === q2.sourceAnswer);

  if (q1 && q1Correct) {
    await prisma.testResponse.create({
      data: {
        testAttemptId: attempt.id,
        questionId: q1.id,
        selectedOptionStableId: q1Correct.stableId,
        correctOptionStableId: q1Correct.stableId,
        responseState: "ANSWERED",
        timeSpentSeconds: 45,
      },
    });
  }

  if (q2 && q2Correct) {
    await prisma.testResponse.create({
      data: {
        testAttemptId: attempt.id,
        questionId: q2.id,
        selectedOptionStableId: q2Correct.stableId,
        correctOptionStableId: q2Correct.stableId,
        responseState: "ANSWERED",
        timeSpentSeconds: 30,
      },
    });
  }

  // Simulate Submission Evaluation
  const evalItems = [
    {
      questionId: q1!.id,
      selectedOptionStableId: q1Correct!.stableId,
      correctOptionStableId: q1Correct!.stableId,
      timeSpentSeconds: 45,
      responseState: "ANSWERED",
      subject: q1!.subject,
      topic: q1!.topic,
    },
    {
      questionId: q2!.id,
      selectedOptionStableId: q2Correct!.stableId,
      correctOptionStableId: q2Correct!.stableId,
      timeSpentSeconds: 30,
      responseState: "ANSWERED",
      subject: q2!.subject,
      topic: q2!.topic,
    },
  ];

  const evalResult = evaluateTestAttempt(evalItems, {
    marksPerCorrect: examConfig.marksPerCorrect,
    negativeMarks: examConfig.negativeMarks,
    totalMarks: examConfig.totalMarks,
  });

  await prisma.testAttempt.update({
    where: { id: attempt.id },
    data: {
      status: "EVALUATED",
      completedAt: new Date(),
      attemptedCount: evalResult.attemptedCount,
      correctCount: evalResult.correctCount,
      incorrectCount: evalResult.incorrectCount,
      unattemptedCount: evalResult.unattemptedCount,
      markedCount: 0,
      rawScore: evalResult.rawScore,
      finalScore: evalResult.finalScore,
      accuracy: evalResult.accuracy,
      timeSpentSeconds: evalResult.totalTimeSeconds,
    },
  });

  console.log("Attempt submitted & evaluated: Final Score =", evalResult.finalScore, "Accuracy =", evalResult.accuracy + "%");

  // Verify Admin Results query
  const orConditions: any[] = [{ examConfig: { documentId: docId } }];
  if (doc.publishedExamId) {
    orConditions.push({ examConfigId: doc.publishedExamId });
  }

  const adminQueryResults = await prisma.testAttempt.findMany({
    where: { OR: orConditions },
    include: {
      user: { select: { name: true, email: true, studentRollNo: true } },
      examConfig: { select: { title: true, totalMarks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Admin results query returned ${adminQueryResults.length} attempt(s):`);
  for (const r of adminQueryResults) {
    console.log(`- Candidate: ${r.user?.name} (${r.user?.email}) | Roll: ${r.studentRollNo} | Score: ${r.finalScore}/${r.examConfig?.totalMarks} | Status: ${r.status}`);
  }
}

main().finally(() => prisma.$disconnect());
