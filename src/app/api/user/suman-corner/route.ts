import { NextRequest, NextResponse } from "next/server";
import { resolveActiveSumanTheme, SUMAN_THEMES } from "@/lib/suman-corner";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const active = resolveActiveSumanTheme(offset);

    return NextResponse.json({
      success: true,
      activeTheme: active.theme,
      mode: active.mode,
      customTitle: active.customTitle,
      customMessage: active.customMessage,
      expiresAt: active.expiresAt,
      timeSlot: active.timeSlot,
      totalThemes: SUMAN_THEMES.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
