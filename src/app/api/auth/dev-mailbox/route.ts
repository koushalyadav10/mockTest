import { NextResponse } from "next/server";
import { devMailbox } from "@/lib/auth/email";

export async function GET() {
  return NextResponse.json({
    total: devMailbox.length,
    latestEmails: devMailbox.slice(0, 10),
  });
}
