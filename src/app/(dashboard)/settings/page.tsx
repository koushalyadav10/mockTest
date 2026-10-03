"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    defaultLanguage: "en",
    lowTimeAlertMinutes: 5,
    autoFullscreen: false,
    enableKeyboardShortcuts: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Candidate Preferences &amp; Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your examination environment, keyboard shortcuts, and language display
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Question Paper Language
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी - Noto Sans Devanagari)</option>
              <option value="bilingual">Bilingual (English + Hindi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Timer Low-Time Alert Threshold (Minutes)
            </label>
            <input
              type="number"
              value={settings.lowTimeAlertMinutes}
              onChange={(e) =>
                setSettings({ ...settings, lowTimeAlertMinutes: parseInt(e.target.value, 10) })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                Enable Keyboard Shortcuts in CBT
              </span>
              <span className="text-xs text-slate-500 block">
                Keys 1/2/3/4 for options, N for next, P for previous, M for review
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableKeyboardShortcuts}
              onChange={(e) =>
                setSettings({ ...settings, enableKeyboardShortcuts: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 rounded"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {saved ? (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </span>
          ) : (
            <span />
          )}

          <Button type="submit" variant="primary" size="md">
            <Save className="w-4 h-4 mr-1.5" />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
