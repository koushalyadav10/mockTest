"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  Shuffle,
  Pin,
  MessageSquareHeart,
  Save,
  Flame,
} from "lucide-react";
import { SUMAN_THEMES, SumanTheme } from "@/lib/suman-corner-themes";

interface SumanCornerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const SumanCornerAdminModal: React.FC<SumanCornerAdminModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [mode, setMode] = useState<"AUTO" | "PINNED">("AUTO");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("bandariya");
  const [durationHours, setDurationHours] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [currentExpiresAt, setCurrentExpiresAt] = useState<string | null>(null);

  // Fetch current settings on open
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setFeedback(null);
    fetch("/api/admin/suman-corner")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setMode(data.settings.mode || "AUTO");
          setSelectedThemeId(data.settings.pinnedThemeId || data.activeTheme?.id || "bandariya");
          setDurationHours(data.settings.durationHours || 0);
          setCustomTitle(data.settings.customTitle || "");
          setCustomMessage(data.settings.customMessage || "");
          setCurrentExpiresAt(data.settings.expiresAt || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedTheme: SumanTheme =
    SUMAN_THEMES.find((t) => t.id === selectedThemeId) || SUMAN_THEMES[0];

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/suman-corner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          pinnedThemeId: selectedThemeId,
          customTitle: customTitle.trim() || null,
          customMessage: customMessage.trim() || null,
          durationHours,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(data.message || "Layout saved successfully!");
        if (data.settings?.expiresAt) {
          setCurrentExpiresAt(data.settings.expiresAt);
        } else {
          setCurrentExpiresAt(null);
        }
        if (onSaved) onSaved();
      } else {
        alert(data.error || "Failed to save settings");
      }
    } catch (e: any) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-pink-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg shadow-2xs">
              🌸
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg flex items-center gap-1.5 leading-tight">
                <span>Special Corner for Suman &bull; Controller</span>
                <Heart className="w-4 h-4 fill-white text-white" />
              </h3>
              <p className="text-[11px] text-pink-100 font-medium">
                Suman ke liye layout choose karein, duration set karein ya auto-rotate chalu rakhein
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Feedback banner */}
          {feedback && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Mode Selector Toggle */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
              Display Mode Selection
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode("AUTO")}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  mode === "AUTO"
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-purple-300"
                }`}
              >
                <Shuffle className={`w-4 h-4 mt-0.5 shrink-0 ${mode === "AUTO" ? "text-purple-200" : "text-purple-600"}`} />
                <div>
                  <div className="font-bold text-xs">Auto-Rotation (3x Daily)</div>
                  <div className={`text-[10px] mt-0.5 leading-relaxed ${mode === "AUTO" ? "text-purple-100" : "text-slate-500"}`}>
                    Morning (05-12), Afternoon (12-17), aur Night (17+) me card automatically rotate hota rahega.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("PINNED")}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  mode === "PINNED"
                    ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-pink-300"
                }`}
              >
                <Pin className={`w-4 h-4 mt-0.5 shrink-0 ${mode === "PINNED" ? "text-pink-200" : "text-pink-600"}`} />
                <div>
                  <div className="font-bold text-xs">Manual Pin Mode</div>
                  <div className={`text-[10px] mt-0.5 leading-relaxed ${mode === "PINNED" ? "text-pink-100" : "text-slate-500"}`}>
                    Apna pasandida card (jaise Bandariya ya Moti) fix karein aur time duration set karein.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Theme Gallery (12 Cards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                Select Card Theme ({SUMAN_THEMES.length} Available Cards)
              </span>
              <span className="text-[11px] text-pink-600 font-semibold">
                Tap any card to preview &amp; select
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
              {SUMAN_THEMES.map((t) => {
                const isSelected = selectedThemeId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedThemeId(t.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? "bg-white border-pink-500 shadow-md ring-2 ring-pink-400"
                        : "bg-white/80 border-slate-200 hover:bg-white hover:border-pink-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{t.emoji}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                        {t.slot}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-xs leading-tight">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {t.tag}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview of Selected Theme */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">
              Live Preview for Suman:
            </span>

            <div
              className={`p-4 rounded-2xl ${selectedTheme.gradientBg} ${selectedTheme.borderClass} shadow-2xs space-y-2.5`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr ${selectedTheme.badgeBg} shrink-0`}
                  >
                    <img
                      src="/avatars/suman.jpg"
                      alt="Suman"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full ${selectedTheme.pillGradient} text-white font-black text-[10px] uppercase`}
                    >
                      Special Corner for Suman
                    </span>
                    <h4 className={`font-black text-sm ${selectedTheme.titleColor} mt-0.5`}>
                      {customTitle.trim() || selectedTheme.title}
                    </h4>
                  </div>
                </div>

                <span className="text-2xl">{selectedTheme.emoji}</span>
              </div>

              <p className={`text-xs ${selectedTheme.textColor} font-medium leading-relaxed`}>
                {customMessage.trim() || selectedTheme.message}
              </p>

              <div className="bg-white/80 p-2 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <span>{selectedTheme.careIconEmoji}</span>
                <span>
                  <strong>{selectedTheme.careReminderTitle}</strong> {selectedTheme.careReminderText}
                </span>
              </div>
            </div>
          </div>

          {/* Pin Duration Settings (Shown only in PINNED mode) */}
          {mode === "PINNED" && (
            <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-pink-600" />
                  <span>Pin Duration (Kitni der ke liye set rahe?)</span>
                </div>
                {currentExpiresAt && (
                  <span className="text-[10px] font-mono text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                    Expires: {new Date(currentExpiresAt).toLocaleTimeString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 0, label: "Always Pinned", desc: "Jab tak main change na karu" },
                  { value: 2, label: "2 Hours", desc: "Agle 2 ghante tak" },
                  { value: 4, label: "4 Hours", desc: "Agle 4 ghante tak" },
                  { value: 24, label: "Today Only", desc: "Aaj raat 12 baje tak" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDurationHours(opt.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      durationHours === opt.value
                        ? "bg-pink-600 text-white border-pink-600 font-bold shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-pink-50"
                    }`}
                  >
                    <div className="text-xs">{opt.label}</div>
                    <div className={`text-[10px] ${durationHours === opt.value ? "text-pink-100" : "text-slate-400"}`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Loving Message Input (Optional) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-pink-600" />
              <span>Personal Loving Message for Suman (Optional Custom Override):</span>
            </label>
            <input
              type="text"
              placeholder={`Custom title e.g. ${selectedTheme.title}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <textarea
              rows={2}
              placeholder="Type your own sweet personal note e.g. Aaj 2 test acche se finish karo, fir shaam ko celebration karenge! Love you! 💕"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <span className="text-[10px] text-slate-400">
              Agar blank chodenge toh is theme ka official curated sweet message dikhega.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "Saving Layout..." : "Save & Activate for Suman 💖"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
