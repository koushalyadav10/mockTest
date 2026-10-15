import fs from "fs";
import path from "path";
import {
  SumanTheme,
  SUMAN_THEMES,
  SumanCornerSettings,
  getDefaultSumanTheme,
} from "./suman-corner-themes";

export { SUMAN_THEMES, getDefaultSumanTheme };
export type { SumanTheme, SumanCornerSettings };

const SETTINGS_FILE_PATH = path.join(process.cwd(), "prisma", "suman_corner_settings.json");

export function getSumanCornerSettings(): SumanCornerSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      // Check if pinned mode has expired
      if (parsed.mode === "PINNED" && parsed.expiresAt) {
        const exp = new Date(parsed.expiresAt).getTime();
        if (Date.now() > exp) {
          // Expired, auto-revert to AUTO
          return {
            mode: "AUTO",
            pinnedThemeId: null,
            customTitle: null,
            customMessage: null,
            durationHours: 0,
            expiresAt: null,
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to read suman_corner_settings.json", e);
  }

  return {
    mode: "AUTO",
    pinnedThemeId: null,
    customTitle: null,
    customMessage: null,
    durationHours: 0,
    expiresAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function saveSumanCornerSettings(settings: Partial<SumanCornerSettings>): SumanCornerSettings {
  const current = getSumanCornerSettings();
  const updated: SumanCornerSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write suman_corner_settings.json", e);
  }

  return updated;
}

/**
 * Resolves the active theme for Suman:
 * 1. If Admin has pinned a theme and it hasn't expired -> return that theme.
 * 2. Otherwise auto-rotates based on time-of-day:
 *    - Morning: 05:00 - 12:00 (Sunshine, Bandariya, Sherni, Cutie Pie)
 *    - Afternoon: 12:00 - 17:00 (Moti, Superstar, Officer, Afternoon Warrior)
 *    - Evening/Night: 17:00 - 05:00 (My Dear, Queen, Pagal, Night Star)
 *    - Rotates at least 3 times in 24 hours.
 */
export function resolveActiveSumanTheme(customOffsetIndex = 0): {
  theme: SumanTheme;
  mode: "AUTO" | "PINNED";
  customTitle: string | null;
  customMessage: string | null;
  expiresAt: string | null;
  timeSlot: string;
} {
  const settings = getSumanCornerSettings();

  // If Admin manually pinned a theme and it hasn't expired
  if (settings.mode === "PINNED" && settings.pinnedThemeId) {
    const matched = SUMAN_THEMES.find((t) => t.id === settings.pinnedThemeId);
    if (matched) {
      return {
        theme: matched,
        mode: "PINNED",
        customTitle: settings.customTitle || null,
        customMessage: settings.customMessage || null,
        expiresAt: settings.expiresAt || null,
        timeSlot: "pinned",
      };
    }
  }

  // AUTO ROTATION (Time of day + Day of Year Hash)
  const now = new Date();
  const hour = now.getHours();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  let slotFilter: SumanTheme["slot"] = "morning";
  let slotName = "Morning (05:00 - 12:00)";
  if (hour >= 12 && hour < 17) {
    slotFilter = "afternoon";
    slotName = "Afternoon (12:00 - 17:00)";
  } else if (hour >= 17 || hour < 5) {
    slotFilter = "evening";
    slotName = "Evening & Night (17:00 - 05:00)";
  }

  // Filter candidate themes for this slot (or 'any')
  const slotThemes = SUMAN_THEMES.filter((t) => t.slot === slotFilter || t.slot === "any");
  const baseIndex = (dayOfYear + customOffsetIndex) % slotThemes.length;
  const selectedTheme = slotThemes[Math.abs(baseIndex)] || SUMAN_THEMES[0];

  return {
    theme: selectedTheme,
    mode: "AUTO",
    customTitle: null,
    customMessage: null,
    expiresAt: null,
    timeSlot: slotName,
  };
}
