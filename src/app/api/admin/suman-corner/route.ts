import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import {
  SUMAN_THEMES,
  getSumanCornerSettings,
  saveSumanCornerSettings,
  resolveActiveSumanTheme,
} from "@/lib/suman-corner";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const settings = getSumanCornerSettings();
    const active = resolveActiveSumanTheme();

    return NextResponse.json({
      success: true,
      settings,
      activeTheme: active.theme,
      mode: active.mode,
      customTitle: active.customTitle,
      customMessage: active.customMessage,
      expiresAt: active.expiresAt,
      timeSlot: active.timeSlot,
      availableThemes: SUMAN_THEMES,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { mode, pinnedThemeId, customTitle, customMessage, durationHours } = body;

    let expiresAt: string | null = null;
    const hours = parseInt(durationHours || "0", 10);

    if (mode === "PINNED") {
      if (hours > 0) {
        const exp = new Date(Date.now() + hours * 60 * 60 * 1000);
        expiresAt = exp.toISOString();
      } else if (hours === 24) {
        // Today until midnight
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        expiresAt = endOfDay.toISOString();
      }
    }

    const updated = saveSumanCornerSettings({
      mode: mode === "PINNED" ? "PINNED" : "AUTO",
      pinnedThemeId: mode === "PINNED" ? pinnedThemeId || null : null,
      customTitle: customTitle?.trim() || null,
      customMessage: customMessage?.trim() || null,
      durationHours: hours,
      expiresAt,
    });

    const active = resolveActiveSumanTheme();

    return NextResponse.json({
      success: true,
      message:
        mode === "PINNED"
          ? `Suman ke liye layout "${active.theme.name}" safaltapoorvak set ho gaya!`
          : "Auto-Rotation mode shuru ho gaya! Ab din me 3 baar layout badalta rahega.",
      settings: updated,
      activeTheme: active.theme,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
