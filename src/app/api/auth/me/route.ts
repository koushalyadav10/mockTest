import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      studentRollNo: true,
      phone: true,
      city: true,
      gender: true,
      academicClass: true,
      board: true,
      targetExam: true,
      language: true,
      isProfileLocked: true,
      avatarUrl: true,
      totalTestsAttended: true,
      highestScore: true,
      starsEarned: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
  }

  return NextResponse.json({ authenticated: true, user });
}
