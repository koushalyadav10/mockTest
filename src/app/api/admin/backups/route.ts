import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "@/lib/db";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const backupDir = path.join(process.cwd(), "prisma", "backups");
    let localBackups: any[] = [];

    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter(f => f.endsWith(".db"));
      localBackups = files.map(file => {
        const filePath = path.join(backupDir, file);
        const stat = fs.statSync(filePath);
        return {
          filename: file,
          sizeMb: (stat.size / (1024 * 1024)).toFixed(2),
          createdAt: stat.mtime,
          type: "LOCAL_SERVER_SNAPSHOT"
        };
      }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Database stats
    const [totalUsers, totalAttempts, totalQuestions, totalExams] = await Promise.all([
      prisma.user.count(),
      prisma.testAttempt.count(),
      prisma.question.count(),
      prisma.examConfig.count(),
    ]);

    const dbPath = path.join(process.cwd(), "prisma", "examforge.db");
    let dbSizeMb = "0.00";
    if (fs.existsSync(dbPath)) {
      const stat = fs.statSync(dbPath);
      dbSizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalAttempts,
        totalQuestions,
        totalExams,
        dbSizeMb,
      },
      cloudStorage: {
        provider: "AWS S3",
        bucket: "examforge-persistent-cloud-backups",
        region: "ap-south-1",
        versioning: "ENABLED",
        persistencePolicy: "IMMUTABLE_VERSIONED",
        cronSchedule: "Every 6 Hours (00:00, 06:00, 12:00, 18:00 UTC)",
      },
      localBackups,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const scriptPath = path.join(process.cwd(), "scripts", "cloud_backup_s3.py");
    const cmd = process.platform === "win32" ? `python "${scriptPath}"` : `python3 "${scriptPath}"`;
    
    const { stdout, stderr } = await execAsync(cmd, { cwd: process.cwd() });

    return NextResponse.json({
      success: true,
      message: "Cloud backup completed successfully!",
      output: stdout,
      error: stderr || null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
