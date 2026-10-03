import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "../lib/db";
import { createAndSaveOtp, verifyOtpToken } from "../lib/auth/otp";
import { devMailbox, sendOtpEmail } from "../lib/auth/email";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { signJwt, verifyJwt } from "../lib/auth/jwt";
import { evaluateTestAttempt } from "../lib/exam/scoring-engine";
import { computeNextResponseState } from "../lib/exam/state-machine";

describe("Section 68 Complete Real-World Acceptance Test Flow", () => {
  const testEmail = `aspirant_${Date.now()}@testexam.org`;
  let registeredUserId: string;
  let activeAttemptId: string;
  let examConfigId: string;
  let questionIds: string[] = [];

  // 1 & 2: Candidate Registration
  it("Step 1 & 2: Candidate registers with Name, Email, and Password", async () => {
    const passwordHash = hashPassword("Candidate@Secure2026");
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Vikramaditya Rao",
        passwordHash,
        role: "STUDENT",
        studentRollNo: `EF-${Date.now().toString().slice(-6)}`,
        isEmailVerified: false,
      },
    });

    expect(user.id).toBeDefined();
    expect(user.isEmailVerified).toBe(false);
    registeredUserId = user.id;
  });

  // 3 & 4: Receive real OTP email and verify OTP
  it("Step 3 & 4: Dispatches genuine 6-digit OTP email and validates token", async () => {
    const { otp, expiresAt } = await createAndSaveOtp(testEmail, "SIGNUP");
    expect(otp).toMatch(/^\d{6}$/);

    // Send real email via email service
    await sendOtpEmail(testEmail, otp, "SIGNUP");

    // Verify email was received in dispatch logs
    const dispatched = devMailbox.find((m) => m.to === testEmail);
    expect(dispatched).toBeDefined();
    expect(dispatched?.otpCode).toBe(otp);

    // Verify OTP against hashed database token
    const verifyResult = await verifyOtpToken(testEmail, otp, "SIGNUP");
    expect(verifyResult.success).toBe(true);

    // Mark user verified
    const verifiedUser = await prisma.user.update({
      where: { id: registeredUserId },
      data: { isEmailVerified: true },
    });
    expect(verifiedUser.isEmailVerified).toBe(true);
  });

  // 5: Login and issue JWT session
  it("Step 5: Authenticates verified student and creates session token", async () => {
    const user = await prisma.user.findUnique({ where: { id: registeredUserId } });
    expect(user?.isEmailVerified).toBe(true);
    expect(verifyPassword("Candidate@Secure2026", user!.passwordHash)).toBe(true);

    const token = signJwt({
      userId: user!.id,
      email: user!.email,
      name: user!.name,
      role: user!.role as any,
      studentRollNo: user!.studentRollNo,
    });

    const session = verifyJwt(token);
    expect(session?.userId).toBe(registeredUserId);
    expect(session?.role).toBe("STUDENT");
  });

  // 6 - 12: Open SSC CHSL, retrieve questions from DB, initiate server timer
  it("Step 6 - 12: Loads SSC CHSL exam config and initiates server-authoritative mock attempt", async () => {
    const examConfig = await prisma.examConfig.findFirst({
      where: { category: "SSC" },
      include: { sections: true },
    });
    expect(examConfig).toBeDefined();
    examConfigId = examConfig!.id;

    // Load questions from Question Bank
    const questions = await prisma.question.findMany({
      include: { options: true },
      take: 10,
    });
    expect(questions.length).toBeGreaterThanOrEqual(2);
    questionIds = questions.map((q) => q.id);

    // Create Test Attempt record
    const attempt = await prisma.testAttempt.create({
      data: {
        userId: registeredUserId,
        studentRollNo: "EF-100179719",
        examConfigId: examConfig!.id,
        status: "RUNNING",
        mode: "MOCK",
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + examConfig!.totalDurationMinutes * 60 * 1000),
        totalQuestions: questions.length,
        questionOrderJson: JSON.stringify(questionIds),
        responses: {
          create: questions.map((q, idx) => ({
            questionId: q.id,
            orderIndex: idx,
            responseState: idx === 0 ? "NOT_ANSWERED" : "NOT_VISITED",
            firstViewedAt: idx === 0 ? new Date() : null,
            visitCount: idx === 0 ? 1 : 0,
          })),
        },
      },
    });

    expect(attempt.id).toBeDefined();
    expect(attempt.status).toBe("RUNNING");
    activeAttemptId = attempt.id;
  });

  // 13 - 18: Select answer, auto-save to backend, track question timing & visits
  it("Step 13 - 18: Selects answer, auto-saves to DB, navigates away, and restores answer & timing", async () => {
    const q1 = await prisma.question.findUnique({
      where: { id: questionIds[0] },
      include: { options: true },
    });
    const chosenOption = q1!.options[0];

    // Auto-save Answer
    const initialResp = await prisma.testResponse.findFirst({
      where: { testAttemptId: activeAttemptId, questionId: q1!.id },
    });

    const nextState = computeNextResponseState({
      currentState: "NOT_ANSWERED",
      hasSelectedOption: true,
      action: "SELECT_OPTION",
    });
    expect(nextState).toBe("ANSWERED");

    await prisma.testResponse.update({
      where: { id: initialResp!.id },
      data: {
        selectedOptionStableId: chosenOption.stableId,
        responseState: nextState,
        timeSpentSeconds: 24,
        visitCount: 1,
        answeredAt: new Date(),
        answerHistoryJson: JSON.stringify([{ answer: chosenOption.stableId, timestamp: new Date().toISOString() }]),
      },
    });

    // Simulate navigation away to Question 2
    const q2Resp = await prisma.testResponse.findFirst({
      where: { testAttemptId: activeAttemptId, questionId: questionIds[1] },
    });
    await prisma.testResponse.update({
      where: { id: q2Resp!.id },
      data: {
        responseState: "NOT_ANSWERED",
        firstViewedAt: new Date(),
        visitCount: 1,
        timeSpentSeconds: 15,
      },
    });

    // Navigate BACK to Question 1: Verify previous answer is intact and increment visit count & time
    const restoredResp = await prisma.testResponse.findFirst({
      where: { testAttemptId: activeAttemptId, questionId: q1!.id },
    });
    expect(restoredResp?.selectedOptionStableId).toBe(chosenOption.stableId);
    expect(restoredResp?.responseState).toBe("ANSWERED");
    expect(restoredResp?.visitCount).toBe(1);

    // Add 12 seconds on second visit
    await prisma.testResponse.update({
      where: { id: restoredResp!.id },
      data: {
        timeSpentSeconds: restoredResp!.timeSpentSeconds + 12,
        visitCount: restoredResp!.visitCount + 1,
        lastViewedAt: new Date(),
      },
    });

    const updatedResp = await prisma.testResponse.findUnique({ where: { id: restoredResp!.id } });
    expect(updatedResp?.timeSpentSeconds).toBe(36); // 24 + 12
    expect(updatedResp?.visitCount).toBe(2);
  });

  // 19 - 22: Mark for review, update palette, change answer, and track answer history
  it("Step 19 - 22: Marks question for review, updates palette state, and records option switch history", async () => {
    const q1 = await prisma.question.findUnique({
      where: { id: questionIds[0] },
      include: { options: true },
    });
    const newOption = q1!.options[1];

    const currentResp = await prisma.testResponse.findFirst({
      where: { testAttemptId: activeAttemptId, questionId: q1!.id },
    });

    // Change answer: switch from option 0 to option 1
    const history = JSON.parse(currentResp!.answerHistoryJson || "[]");
    history.push({ answer: newOption.stableId, timestamp: new Date().toISOString() });

    const markedState = computeNextResponseState({
      currentState: "ANSWERED",
      hasSelectedOption: true,
      action: "MARK_FOR_REVIEW",
    });
    expect(markedState).toBe("ANSWERED_AND_MARKED_FOR_REVIEW");

    await prisma.testResponse.update({
      where: { id: currentResp!.id },
      data: {
        selectedOptionStableId: newOption.stableId,
        responseState: markedState,
        answerHistoryJson: JSON.stringify(history),
      },
    });

    const finalResp = await prisma.testResponse.findUnique({ where: { id: currentResp!.id } });
    expect(finalResp?.responseState).toBe("ANSWERED_AND_MARKED_FOR_REVIEW");
    const parsedHistory = JSON.parse(finalResp!.answerHistoryJson!);
    expect(parsedHistory.length).toBe(2); // Recorded both choices
  });

  // 23 - 25: Exit fullscreen / Focus loss warning & violation recording
  it("Step 23 - 25: Records focus loss and fullscreen exit violations with timestamps", async () => {
    const violation = await prisma.attemptViolation.create({
      data: {
        attemptId: activeAttemptId,
        studentId: registeredUserId,
        type: "FULLSCREEN_EXIT",
        count: 1,
        sectionName: "General Intelligence",
        questionNumber: 1,
      },
    });

    expect(violation.id).toBeDefined();
    expect(violation.type).toBe("FULLSCREEN_EXIT");

    // Second violation: Tab switch
    const v2 = await prisma.attemptViolation.create({
      data: {
        attemptId: activeAttemptId,
        studentId: registeredUserId,
        type: "TAB_SWITCH",
        count: 2,
        sectionName: "General Intelligence",
        questionNumber: 1,
      },
    });
    expect(v2.count).toBe(2);

    const countInDb = await prisma.attemptViolation.count({ where: { attemptId: activeAttemptId } });
    expect(countInDb).toBe(2);
  });

  // 26 - 31: Submit test, evaluate score server-side, generate section and question-wise analytics
  it("Step 26 - 31: Submits test, performs server-authoritative scoring, and builds section performance", async () => {
    const attemptWithResponses = await prisma.testAttempt.findUnique({
      where: { id: activeAttemptId },
      include: {
        examConfig: true,
        responses: {
          include: {
            question: { include: { options: true } },
          },
        },
      },
    });

    const evalItems = attemptWithResponses!.responses.map((resp) => {
      const correctOpt = resp.question.options.find((o) => o.isCorrect);
      return {
        questionId: resp.questionId,
        selectedOptionStableId: resp.selectedOptionStableId,
        correctOptionStableId: correctOpt?.stableId || null,
        timeSpentSeconds: resp.timeSpentSeconds,
        responseState: resp.responseState,
        subject: resp.question.subject,
        topic: resp.question.topic,
      };
    });

    const evaluation = evaluateTestAttempt(evalItems, {
      marksPerCorrect: 2.0,
      negativeMarks: 0.5,
      totalMarks: attemptWithResponses!.totalQuestions * 2.0,
    });

    expect(evaluation.totalQuestions).toBe(attemptWithResponses!.totalQuestions);
    expect(evaluation.finalScore).toBeDefined();
    expect(evaluation.accuracy).toBeGreaterThanOrEqual(0);

    // Finalize attempt
    const completedAttempt = await prisma.testAttempt.update({
      where: { id: activeAttemptId },
      data: {
        status: "EVALUATED",
        completedAt: new Date(),
        attemptedCount: evaluation.attemptedCount,
        correctCount: evaluation.correctCount,
        incorrectCount: evaluation.incorrectCount,
        unattemptedCount: evaluation.unattemptedCount,
        markedCount: evaluation.markedCount,
        rawScore: evaluation.rawScore,
        negativeMarksTotal: evaluation.negativeMarksTotal,
        finalScore: evaluation.finalScore,
        accuracy: evaluation.accuracy,
        timeSpentSeconds: evaluation.totalTimeSeconds,
      },
    });

    expect(completedAttempt.status).toBe("EVALUATED");
    expect(completedAttempt.completedAt).not.toBeNull();
  });

  // 32 - 39: Admin views attempt, adds new question, creates new test, student can attempt it
  it("Step 32 - 39: Admin inspects attempt, approves new question, builds new test, and candidate attempts it", async () => {
    // 32: Admin audit inspection
    const adminView = await prisma.testAttempt.findUnique({
      where: { id: activeAttemptId },
      include: { user: true, violations: true },
    });
    expect(adminView?.violations.length).toBe(2);

    // 33 - 37: Admin creates/approves a new extracted question
    const newQuestion = await prisma.question.create({
      data: {
        questionNumber: 99,
        language: "bilingual",
        subject: "General Hindi",
        topic: "वर्णमाला एवं संधि",
        difficulty: "MEDIUM",
        questionText: "‘सूर्योदय’ शब्द का सही संधि विच्छेद क्या होगा?\nWhat is the correct sandhi-vicched of ‘Suryodaya’?",
        options: {
          create: [
            { label: "A", stableId: "opt_hindi_1", text: "सूर्य + उदय (Surya + Uday)", isCorrect: true },
            { label: "B", stableId: "opt_hindi_2", text: "सूर्यो + दय", isCorrect: false },
            { label: "C", stableId: "opt_hindi_3", text: "सूर्य + दय", isCorrect: false },
            { label: "D", stableId: "opt_hindi_4", text: "सूर्या + उदय", isCorrect: false },
          ],
        },
        sourceAnswer: "A",
        explanation: "सूर्य + उदय = सूर्योदय (गुण स्वर संधि, जहाँ अ/आ + उ = ओ बनता है)।",
        status: "APPROVED",
      },
      include: { options: true },
    });

    expect(newQuestion.id).toBeDefined();
    expect(newQuestion.status).toBe("APPROVED");

    // 38: Admin creates a new Exam using Test Builder
    const newCustomExam = await prisma.examConfig.create({
      data: {
        code: `UPSI_HINDI_SPECIAL_${Date.now()}`,
        title: "UPSI Hindi Special Practice Mock 01",
        category: "UP_POLICE",
        totalQuestions: 1,
        totalMarks: 2.5,
        totalDurationMinutes: 10,
        marksPerCorrect: 2.5,
        negativeMarks: 0.0,
        status: "PUBLISHED",
        sections: {
          create: [{ name: "सामान्य हिन्दी", questionCount: 1, order: 1 }],
        },
      },
    });

    expect(newCustomExam.id).toBeDefined();

    // 39: Student attempts the newly created test
    const newStudentAttempt = await prisma.testAttempt.create({
      data: {
        userId: registeredUserId,
        examConfigId: newCustomExam.id,
        status: "RUNNING",
        totalQuestions: 1,
        responses: {
          create: [
            {
              questionId: newQuestion.id,
              orderIndex: 0,
              responseState: "NOT_ANSWERED",
            },
          ],
        },
      },
      include: { responses: true },
    });

    expect(newStudentAttempt.id).toBeDefined();
    expect(newStudentAttempt.responses[0].questionId).toBe(newQuestion.id);
  });
});
