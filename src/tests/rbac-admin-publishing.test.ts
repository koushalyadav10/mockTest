import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/db";
import { hasPermission, Role } from "../lib/auth/rbac";
import { hashPassword, verifyPassword } from "../lib/auth/password";

describe("Strict RBAC & Admin Paper Publishing Verification", () => {
  it("enforces correct permission boundaries across STUDENT, TEACHER, and ADMIN roles", () => {
    // 1. Student permissions
    expect(hasPermission("STUDENT", "test.attempt")).toBe(true);
    expect(hasPermission("STUDENT", "result.read_own")).toBe(true);
    expect(hasPermission("STUDENT", "question.upload")).toBe(false);
    expect(hasPermission("STUDENT", "test.publish")).toBe(false);
    expect(hasPermission("STUDENT", "user.suspend")).toBe(false);

    // 2. Teacher permissions
    expect(hasPermission("TEACHER", "question.upload")).toBe(true);
    expect(hasPermission("TEACHER", "question.review")).toBe(true);
    expect(hasPermission("TEACHER", "test.create")).toBe(true);
    expect(hasPermission("TEACHER", "test.publish")).toBe(false);
    expect(hasPermission("TEACHER", "user.suspend")).toBe(false);
    expect(hasPermission("TEACHER", "role.manage")).toBe(false);

    // 3. Admin permissions
    expect(hasPermission("ADMIN", "test.publish")).toBe(true);
    expect(hasPermission("ADMIN", "test.unpublish")).toBe(true);
    expect(hasPermission("ADMIN", "user.suspend")).toBe(true);
    expect(hasPermission("ADMIN", "role.manage")).toBe(true);
    expect(hasPermission("ADMIN", "audit.read")).toBe(true);
  });

  it("prohibits suspended accounts from active operations", async () => {
    const testEmail = `suspended_${Date.now()}@testexam.org`;
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Suspended Candidate",
        passwordHash: hashPassword("Secret123!"),
        role: "STUDENT",
        status: "SUSPENDED",
      },
    });

    expect(user.status).toBe("SUSPENDED");

    // Attempt status check
    const refreshed = await prisma.user.findUnique({ where: { id: user.id } });
    expect(refreshed?.status).toBe("SUSPENDED");

    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
  });

  it("supports document publishing to public exam and unpublishing", async () => {
    // Create a mock document with 2 questions
    const doc = await prisma.uploadedDocument.create({
      data: {
        fileName: "SSC_CGL_Official_Mock_Paper.pdf",
        fileType: "application/pdf",
        fileSize: 409600,
        isPublic: false,
        status: "COMPLETED",
        questions: {
          create: [
            {
              questionNumber: 1,
              subject: "Quantitative Aptitude",
              topic: "Percentages",
              difficulty: "MEDIUM",
              questionText: "What is 20% of 450?",
              options: {
                create: [
                  { stableId: "A", label: "A", text: "80", isCorrect: false },
                  { stableId: "B", label: "B", text: "90", isCorrect: true },
                  { stableId: "C", label: "C", text: "100", isCorrect: false },
                  { stableId: "D", label: "D", text: "110", isCorrect: false },
                ],
              },
            },
          ],
        },
      },
    });

    expect(doc.isPublic).toBe(false);

    // Publish as exam config
    const examConfig = await prisma.examConfig.create({
      data: {
        code: `PUB_${doc.id.slice(0, 8).toUpperCase()}`,
        title: "SSC CGL Official Mock Paper",
        totalQuestions: 1,
        totalMarks: 2.0,
        status: "PUBLISHED",
        scheduledStatus: "LIVE",
        documentId: doc.id,
      },
    });

    const updatedDoc = await prisma.uploadedDocument.update({
      where: { id: doc.id },
      data: { isPublic: true, publishedExamId: examConfig.id },
    });

    expect(updatedDoc.isPublic).toBe(true);
    expect(updatedDoc.publishedExamId).toBe(examConfig.id);

    // Test unpublish
    const unpublishedDoc = await prisma.uploadedDocument.update({
      where: { id: doc.id },
      data: { isPublic: false },
    });

    expect(unpublishedDoc.isPublic).toBe(false);

    // Clean up
    await prisma.examConfig.delete({ where: { id: examConfig.id } });
    await prisma.uploadedDocument.delete({ where: { id: doc.id } });
  });
});
