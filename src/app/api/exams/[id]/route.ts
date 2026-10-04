import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET single exam configuration with live calculated status
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.examConfig.findUnique({
      where: { id: params.id },
      include: {
        sections: { orderBy: { order: "asc" } },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam configuration not found" }, { status: 404 });
    }

    // Dynamic Server-Time Scheduled Status Calculation
    const now = new Date();
    let computedStatus = exam.scheduledStatus || "LIVE";
    if (exam.availability === "SCHEDULED") {
      if (exam.startDate && now < new Date(exam.startDate)) {
        computedStatus = "UPCOMING";
      } else if (exam.endDate && now > new Date(exam.endDate)) {
        computedStatus = "EXPIRED";
      } else {
        computedStatus = "LIVE";
      }
    } else {
      computedStatus = "LIVE";
    }

    return NextResponse.json({
      success: true,
      exam: {
        ...exam,
        scheduledStatus: computedStatus,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch exam configuration" },
      { status: 500 }
    );
  }
}

// PATCH update exam configuration (Schedule, Mode, Public/Private, Timing)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const existing = await prisma.examConfig.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Exam configuration not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      mode, // MOCK | EXAM | TIER_1 | PRACTICE
      status, // PUBLISHED (Public) | DRAFT (Private)
      availability, // ALWAYS (Unlimited) | SCHEDULED (Time-based)
      startDate,
      endDate,
      totalDurationMinutes,
      marksPerCorrect,
      negativeMarks,
      totalQuestions,
      totalMarks,
      sectionLock,
      sectionalTiming,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (category !== undefined) updateData.category = category;
    if (mode !== undefined) updateData.mode = mode;
    if (status !== undefined) updateData.status = status;
    if (availability !== undefined) updateData.availability = availability;
    if (totalDurationMinutes !== undefined) updateData.totalDurationMinutes = Number(totalDurationMinutes);
    if (marksPerCorrect !== undefined) updateData.marksPerCorrect = Number(marksPerCorrect);
    if (negativeMarks !== undefined) updateData.negativeMarks = Number(negativeMarks);
    if (totalQuestions !== undefined) updateData.totalQuestions = Number(totalQuestions);
    if (totalMarks !== undefined) updateData.totalMarks = Number(totalMarks);
    if (sectionLock !== undefined) updateData.sectionLock = Boolean(sectionLock);
    if (sectionalTiming !== undefined) updateData.sectionalTiming = Boolean(sectionalTiming);

    // Date & Time Scheduling
    if (availability === "ALWAYS") {
      updateData.startDate = null;
      updateData.endDate = null;
      updateData.scheduledStatus = "LIVE";
    } else if (availability === "SCHEDULED" || startDate !== undefined || endDate !== undefined) {
      const start = startDate ? new Date(startDate) : existing.startDate;
      const end = endDate ? new Date(endDate) : existing.endDate;
      updateData.startDate = start;
      updateData.endDate = end;

      const now = new Date();
      if (start && now < new Date(start)) {
        updateData.scheduledStatus = "UPCOMING";
      } else if (end && now > new Date(end)) {
        updateData.scheduledStatus = "EXPIRED";
      } else {
        updateData.scheduledStatus = "LIVE";
      }
    }

    const updated = await prisma.examConfig.update({
      where: { id: params.id },
      data: updateData,
      include: { sections: true },
    });

    // If linked to an uploaded document, keep its public flag synchronized
    if (existing.documentId && status !== undefined) {
      await prisma.uploadedDocument.update({
        where: { id: existing.documentId },
        data: { isPublic: status === "PUBLISHED" },
      }).catch(() => {});
    }

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "EXAM_UPDATED",
        entity: "ExamConfig",
        entityId: updated.id,
        details: `Updated exam '${updated.title}' (${updated.mode}, ${updated.status}, Availability: ${updated.availability})`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Exam '${updated.title}' updated successfully.`,
      exam: updated,
    });
  } catch (error: any) {
    console.error("Failed to update exam:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update exam configuration" },
      { status: 500 }
    );
  }
}

// DELETE exam configuration
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const existing = await prisma.examConfig.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Exam configuration not found" }, { status: 404 });
    }

    await prisma.examConfig.delete({
      where: { id: params.id },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "EXAM_DELETED",
        entity: "ExamConfig",
        entityId: params.id,
        details: `Deleted exam '${existing.title}' (${existing.code})`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Exam '${existing.title}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete exam configuration" },
      { status: 500 }
    );
  }
}
