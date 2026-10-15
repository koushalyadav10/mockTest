"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Sparkles, Share } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Check if already installed as standalone App
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      // Check if iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isApple);

      // Check localStorage for dismissal
      const isDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
      if (isDismissed) setDismissed(true);

      // 3. Listen for Android/Chrome beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        if (!standalone && !isDismissed) {
          setShowPrompt(true);
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // If iOS and not standalone, show prompt after 3s
      if (isApple && !standalone && !isDismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIos) {
        alert("To install ExamForge on iPhone:\n1. Tap the Share icon (square with arrow) at the bottom.\n2. Scroll down and tap 'Add to Home Screen'.");
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] User response to install prompt:", outcome);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  // If already running as installed App, do not render anything
  if (isStandalone || !showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
              <span className="font-black text-white text-base font-mono">EF</span>
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Install ExamForge App</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Phone ke home screen per add karein. 1-tap me full-screen bina browser URL bar ke open hoga!
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIos ? (
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
            <Share className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              iPhone me install karne ke liye: Niche <strong>Share</strong> button dabayein, fir <strong>Add to Home Screen</strong> select karein.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>📲 Phone me Install Karein</span>
            </button>
            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Baad Me
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
