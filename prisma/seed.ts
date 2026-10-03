import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { REAL_SSC_CHSL_SAMPLE_QUESTIONS } from "../src/lib/sample-papers";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ExamForge Database Seeding...");

  // 1. Seed Real Users for all 3 RBAC Roles
  const studentUser = await prisma.user.upsert({
    where: { email: "student@examforge.ai" },
    update: {
      passwordHash: hashPassword("Student@123"),
      isEmailVerified: true,
      role: "STUDENT",
    },
    create: {
      email: "student@examforge.ai",
      name: "Aditya Sharma",
      passwordHash: hashPassword("Student@123"),
      role: "STUDENT",
      studentRollNo: "EF-100179719",
      isEmailVerified: true,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@examforge.ai" },
    update: {
      passwordHash: hashPassword("Teacher@123"),
      isEmailVerified: true,
      role: "TEACHER",
    },
    create: {
      email: "teacher@examforge.ai",
      name: "Prof. Rajesh Kumar Verma",
      passwordHash: hashPassword("Teacher@123"),
      role: "TEACHER",
      studentRollNo: "FAC-TCH-491",
      isEmailVerified: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@examforge.ai" },
    update: {
      passwordHash: hashPassword("Admin@123"),
      isEmailVerified: true,
      role: "ADMIN",
    },
    create: {
      email: "admin@examforge.ai",
      name: "Head Examination Controller",
      passwordHash: hashPassword("Admin@123"),
      role: "ADMIN",
      studentRollNo: "ADM-CTR-001",
      isEmailVerified: true,
    },
  });

  console.log("✅ Seeded Users: student@examforge.ai, teacher@examforge.ai, admin@examforge.ai");

  // 2. Seed Competitive Exams with Dynamic Section Configurations

  // A. SSC CHSL Tier-1
  await prisma.examConfig.upsert({
    where: { code: "SSC_CHSL_TIER_1" },
    update: {},
    create: {
      code: "SSC_CHSL_TIER_1",
      title: "SSC CHSL (10+2) Tier-I Official Mock Test 01",
      description: "Staff Selection Commission Combined Higher Secondary Level Tier-1 Examination CBT Pattern",
      category: "SSC",
      mode: "TIER_1",
      totalQuestions: 100,
      totalMarks: 200,
      totalDurationMinutes: 60,
      marksPerCorrect: 2.0,
      negativeMarks: 0.5,
      sectionalTiming: false,
      sectionLock: false,
      allowBackNavigation: true,
      navigationRules: "FREE",
      questionShuffle: true,
      optionShuffle: true,
      difficulty: "MEDIUM",
      languages: "en,hi",
      instructions: "Each question carries 2 marks. For each wrong answer, 0.50 marks will be deducted. All questions are compulsory.",
      sections: {
        create: [
          { name: "General Intelligence", order: 1, questionCount: 25, durationMinutes: 15, marksPerCorrect: 2.0, negativeMarks: 0.5 },
          { name: "General Awareness", order: 2, questionCount: 25, durationMinutes: 15, marksPerCorrect: 2.0, negativeMarks: 0.5 },
          { name: "Quantitative Aptitude", order: 3, questionCount: 25, durationMinutes: 15, marksPerCorrect: 2.0, negativeMarks: 0.5 },
          { name: "English Language", order: 4, questionCount: 25, durationMinutes: 15, marksPerCorrect: 2.0, negativeMarks: 0.5 },
        ],
      },
    },
  });

  // B. SSC CGL Tier-1
  await prisma.examConfig.upsert({
    where: { code: "SSC_CGL_TIER_1" },
    update: {},
    create: {
      code: "SSC_CGL_TIER_1",
      title: "SSC CGL Tier-I All India Live Mock Test",
      description: "Staff Selection Commission Combined Graduate Level Tier-1 CBT Examination standard blueprint",
      category: "SSC",
      mode: "TIER_1",
      totalQuestions: 100,
      totalMarks: 200,
      totalDurationMinutes: 60,
      marksPerCorrect: 2.0,
      negativeMarks: 0.5,
      sectionalTiming: false,
      sectionLock: false,
      allowBackNavigation: true,
      difficulty: "MEDIUM",
      languages: "en,hi",
      sections: {
        create: [
          { name: "General Intelligence & Reasoning", order: 1, questionCount: 25 },
          { name: "General Awareness", order: 2, questionCount: 25 },
          { name: "Quantitative Aptitude", order: 3, questionCount: 25 },
          { name: "English Comprehension", order: 4, questionCount: 25 },
        ],
      },
    },
  });

  // C. UP Police Constable Exam
  await prisma.examConfig.upsert({
    where: { code: "UP_POLICE_CONSTABLE_2026" },
    update: {},
    create: {
      code: "UP_POLICE_CONSTABLE_2026",
      title: "UP Police Constable Official Mock Test 01",
      description: "Uttar Pradesh Police Recruitment & Promotion Board Constable Civilian Police Examination",
      category: "UP_POLICE",
      mode: "TIER_1",
      totalQuestions: 150,
      totalMarks: 300,
      totalDurationMinutes: 120,
      marksPerCorrect: 2.0,
      negativeMarks: 0.5,
      sectionalTiming: false,
      sectionLock: false,
      allowBackNavigation: true,
      difficulty: "MEDIUM",
      languages: "hi,en",
      instructions: "प्रत्येक प्रश्न 2 अंक का है। प्रत्येक गलत उत्तर के लिए 0.5 अंक काटे जाएंगे।",
      sections: {
        create: [
          { name: "सामान्य ज्ञान (General Knowledge)", order: 1, questionCount: 38 },
          { name: "सामान्य हिन्दी (General Hindi)", order: 2, questionCount: 37 },
          { name: "संख्यात्मक एवं मानसिक योग्यता (Numerical & Mental Ability)", order: 3, questionCount: 38 },
          { name: "मानसिक अभिरुचि, बुद्धिलब्धि एवं तार्किक क्षमता (Reasoning & Aptitude)", order: 4, questionCount: 37 },
        ],
      },
    },
  });

  // D. UP Police SI / UPSI
  await prisma.examConfig.upsert({
    where: { code: "UP_POLICE_SI_2026" },
    update: {},
    create: {
      code: "UP_POLICE_SI_2026",
      title: "UPSI (Sub-Inspector) Full Length Mock Test 01",
      description: "UP Police Sub-Inspector Online CBT Exam with Sectional Qualifying Benchmarks & Law/Constitution",
      category: "UP_POLICE",
      mode: "TIER_1",
      totalQuestions: 160,
      totalMarks: 400,
      totalDurationMinutes: 120,
      marksPerCorrect: 2.5,
      negativeMarks: 0.0,
      sectionalTiming: false,
      sectionLock: false,
      allowBackNavigation: true,
      difficulty: "HARD",
      languages: "hi,en",
      sections: {
        create: [
          { name: "सामान्य हिन्दी (General Hindi)", order: 1, questionCount: 40, marksPerCorrect: 2.5 },
          { name: "मूलविधि / संविधान / सामान्य ज्ञान (Law, Constitution & GK)", order: 2, questionCount: 40, marksPerCorrect: 2.5 },
          { name: "संख्यात्मक एवं मानसिक योग्यता परीक्षा (Numerical Ability)", order: 3, questionCount: 40, marksPerCorrect: 2.5 },
          { name: "मानसिक अभिरुचि परीक्षा / बुद्धिलब्धि / तार्किक परीक्षा (Reasoning)", order: 4, questionCount: 40, marksPerCorrect: 2.5 },
        ],
      },
    },
  });

  // E. Railway RRB NTPC
  await prisma.examConfig.upsert({
    where: { code: "RAILWAY_RRB_NTPC_CBT1" },
    update: {},
    create: {
      code: "RAILWAY_RRB_NTPC_CBT1",
      title: "Railway RRB NTPC Stage-I CBT Mock Test 01",
      description: "Railway Recruitment Board Non-Technical Popular Categories 1st Stage Computer Based Test",
      category: "RAILWAY",
      mode: "TIER_1",
      totalQuestions: 100,
      totalMarks: 100,
      totalDurationMinutes: 90,
      marksPerCorrect: 1.0,
      negativeMarks: 0.33,
      sectionalTiming: false,
      sectionLock: false,
      allowBackNavigation: true,
      difficulty: "MEDIUM",
      languages: "en,hi",
      sections: {
        create: [
          { name: "General Awareness", order: 1, questionCount: 40, marksPerCorrect: 1.0, negativeMarks: 0.33 },
          { name: "Mathematics", order: 2, questionCount: 30, marksPerCorrect: 1.0, negativeMarks: 0.33 },
          { name: "General Intelligence and Reasoning", order: 3, questionCount: 30, marksPerCorrect: 1.0, negativeMarks: 0.33 },
        ],
      },
    },
  });

  // F. Banking IBPS PO Prelims
  await prisma.examConfig.upsert({
    where: { code: "BANKING_IBPS_PO_PRELIMS" },
    update: {},
    create: {
      code: "BANKING_IBPS_PO_PRELIMS",
      title: "IBPS PO Prelims Full Mock Test (Sectional Timing)",
      description: "Institute of Banking Personnel Selection Probationary Officer Preliminary Examination with 20-min sectional timers",
      category: "BANKING",
      mode: "TIER_1",
      totalQuestions: 100,
      totalMarks: 100,
      totalDurationMinutes: 60,
      marksPerCorrect: 1.0,
      negativeMarks: 0.25,
      sectionalTiming: true,
      sectionLock: true,
      allowBackNavigation: false,
      navigationRules: "SEQUENTIAL",
      difficulty: "HARD",
      languages: "en,hi",
      sections: {
        create: [
          { name: "English Language", order: 1, questionCount: 30, durationMinutes: 20, marksPerCorrect: 1.0, negativeMarks: 0.25, allowBackNavigation: false },
          { name: "Quantitative Aptitude", order: 2, questionCount: 35, durationMinutes: 20, marksPerCorrect: 1.0, negativeMarks: 0.25, allowBackNavigation: false },
          { name: "Reasoning Ability", order: 3, questionCount: 35, durationMinutes: 20, marksPerCorrect: 1.0, negativeMarks: 0.25, allowBackNavigation: false },
        ],
      },
    },
  });

  console.log("✅ Seeded Exam Configurations: SSC CHSL, SSC CGL, UP Police Constable, UPSI, Railway NTPC, Banking IBPS PO");

  // 3. Seed Sample Uploaded Document
  const sampleDoc = await prisma.uploadedDocument.create({
    data: {
      userId: adminUser.id,
      fileName: "SSC_CHSL_Tier1_Official_Model_Paper_2026.pdf",
      fileType: "application/pdf",
      fileSize: 1024 * 850,
      pageCount: 5,
      isScanned: false,
      status: "COMPLETED",
      processingStep: "COMPLETED - Verified and structured into Question Bank",
    },
  });

  // 4. Seed Questions with Rich Bilingual Text, KaTeX & Detailed Solutions
  for (const q of REAL_SSC_CHSL_SAMPLE_QUESTIONS) {
    await prisma.question.create({
      data: {
        documentId: sampleDoc.id,
        questionNumber: q.questionNumber,
        language: q.language,
        subject: q.subject,
        topic: q.topic,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        questionText: q.questionText,
        hasVisualContent: q.hasVisualContent,
        imageUrl: q.imageUrl,
        sourcePage: q.sourcePage,
        sourceAnswer: q.sourceAnswer,
        aiSuggestedAnswer: q.aiSuggestedAnswer,
        verifiedAnswer: q.sourceAnswer,
        explanation: q.explanation,
        status: "APPROVED",
        confidenceQuestion: q.confidence.question,
        confidenceOptions: q.confidence.options,
        confidenceClassification: q.confidence.classification,
        confidenceAnswer: q.confidence.answer,
        options: {
          create: q.options.map((opt) => ({
            stableId: `opt_${q.questionNumber}_${opt.label}`,
            label: opt.label,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
    });
  }

  console.log(`✅ Seeded ${REAL_SSC_CHSL_SAMPLE_QUESTIONS.length} high-quality bilingual questions into Question Bank`);

  // 5. Create an initial active practice mock test attempt for instant student testing
  const chslExam = await prisma.examConfig.findUnique({
    where: { code: "SSC_CHSL_TIER_1" },
  });

  if (chslExam) {
    const questions = await prisma.question.findMany({
      include: { options: true },
      take: 20,
    });

    if (questions.length > 0) {
      const attempt = await prisma.testAttempt.create({
        data: {
          userId: studentUser.id,
          studentRollNo: studentUser.studentRollNo || "EF-100179719",
          examConfigId: chslExam.id,
          status: "RUNNING",
          mode: "MOCK",
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + chslExam.totalDurationMinutes * 60 * 1000),
          totalQuestions: questions.length,
          questionOrderJson: JSON.stringify(questions.map((q) => q.id)),
          responses: {
            create: questions.map((q, idx) => ({
              questionId: q.id,
              orderIndex: idx,
              responseState: idx === 0 ? "NOT_ANSWERED" : "NOT_VISITED",
              firstViewedAt: idx === 0 ? new Date() : null,
              lastViewedAt: idx === 0 ? new Date() : null,
              visitCount: idx === 0 ? 1 : 0,
            })),
          },
        },
      });
      console.log(`✅ Seeded ready-to-test Attempt: ${attempt.id} for student ${studentUser.email}`);
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
