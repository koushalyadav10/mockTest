import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        testAttempts: {
          select: {
            id: true,
            status: true,
            finalScore: true,
            accuracy: true,
            examConfig: {
              select: {
                totalMarks: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate real-time stats
    const evaluatedAttempts = user.testAttempts.filter((a) => a.status === "EVALUATED");
    const liveAttemptsCount = user.testAttempts.length;

    // Total tests attended: max of live DB attempts count and stored historical count
    // (guarantees count never decreases even if individual attempts are deleted)
    const totalTestsAttended = Math.max(liveAttemptsCount, user.totalTestsAttended || 0);

    // Highest score calculation
    let maxScoreInDb = 0;
    evaluatedAttempts.forEach((a) => {
      if (typeof a.finalScore === "number" && a.finalScore > maxScoreInDb) {
        maxScoreInDb = a.finalScore;
      }
    });
    const highestScore = Math.max(maxScoreInDb, user.highestScore || 0);

    // Stars earned calculation:
    // 1 star for attempt, 2 stars for >= 60%, 3 stars for >= 80%
    let calculatedStars = 0;
    let totalScorePctSum = 0;

    evaluatedAttempts.forEach((a) => {
      const maxMarks = a.examConfig?.totalMarks || 100;
      const scorePct = Math.max(0, (a.finalScore / maxMarks) * 100);
      totalScorePctSum += scorePct;

      if (scorePct >= 80) {
        calculatedStars += 3;
      } else if (scorePct >= 50) {
        calculatedStars += 2;
      } else {
        calculatedStars += 1;
      }
    });

    const starsEarned = Math.max(calculatedStars, user.starsEarned || 0);

    // Overall Performance rate: "Needs Practice", "Average", "Good", "Better"
    let overallPerformance = "Needs Practice";
    if (evaluatedAttempts.length > 0) {
      const avgPct = totalScorePctSum / evaluatedAttempts.length;
      if (avgPct >= 80) {
        overallPerformance = "Better";
      } else if (avgPct >= 60) {
        overallPerformance = "Good";
      } else if (avgPct >= 40) {
        overallPerformance = "Average";
      } else {
        overallPerformance = "Needs Practice";
      }
    }

    // Persist stats if DB values were lower
    if (
      totalTestsAttended > (user.totalTestsAttended || 0) ||
      highestScore > (user.highestScore || 0) ||
      starsEarned > (user.starsEarned || 0)
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalTestsAttended,
          highestScore,
          starsEarned,
        },
      }).catch(() => {});
    }

    // Level badge
    let levelTitle = "No Current Level";
    if (totalTestsAttended >= 20) {
      levelTitle = "Level 5 - Elite Scholar";
    } else if (totalTestsAttended >= 10) {
      levelTitle = "Level 4 - Expert Aspirant";
    } else if (totalTestsAttended >= 5) {
      levelTitle = "Level 3 - Skilled Challenger";
    } else if (totalTestsAttended >= 1) {
      levelTitle = "Level 1 - Starter";
    }

    const { passwordHash, testAttempts, ...sanitizedUser } = user;

    return NextResponse.json({
      success: true,
      user: sanitizedUser,
      stats: {
        totalTestsAttended,
        highestScore: highestScore > 0 ? highestScore : "-",
        starsEarned,
        overallPerformance,
        levelTitle,
        badgeTitle: user.role === "ADMIN" ? "Admin Master" : user.role === "TEACHER" ? "Faculty Master" : "Student Master",
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/user/profile:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      phone,
      city,
      gender,
      academicClass,
      board,
      targetExam,
      language,
      lockNow,
    } = body;

    // If profile is already locked, prevent non-admin users from altering details
    if (currentUser.isProfileLocked && currentUser.role !== "ADMIN") {
      // Allow gender avatar toggle only if explicitly requested, but keep details locked
      if (body.toggleGenderOnly && gender) {
        const updated = await prisma.user.update({
          where: { id: currentUser.id },
          data: { gender: gender === "FEMALE" ? "FEMALE" : "MALE" },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            gender: true,
            academicClass: true,
            board: true,
            targetExam: true,
            language: true,
            isProfileLocked: true,
          },
        });
        return NextResponse.json({
          success: true,
          user: updated,
          message: "Avatar gender updated successfully",
        });
      }

      return NextResponse.json(
        {
          error: "Your profile details are permanently locked. Please contact support or administrator to request any changes.",
        },
        { status: 403 }
      );
    }

    // Build update object (STRICT RULE: email is NEVER updated)
    const updateData: any = {};

    if (name && typeof name === "string") updateData.name = name.trim();
    if (typeof phone === "string") updateData.phone = phone.trim();
    if (typeof city === "string") updateData.city = city.trim();
    if (gender === "FEMALE" || gender === "MALE") updateData.gender = gender;
    if (typeof academicClass === "string") updateData.academicClass = academicClass.trim();
    if (typeof board === "string") updateData.board = board.trim();
    if (typeof targetExam === "string") updateData.targetExam = targetExam.trim();
    if (typeof language === "string") updateData.language = language.trim();

    // Lock profile if requested or if user explicitly clicked "Save and Lock"
    if (lockNow === true) {
      updateData.isProfileLocked = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        gender: true,
        academicClass: true,
        board: true,
        targetExam: true,
        language: true,
        isProfileLocked: true,
        totalTestsAttended: true,
        highestScore: true,
        starsEarned: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: lockNow
        ? "Profile details have been saved and permanently locked!"
        : "Profile details updated successfully.",
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
