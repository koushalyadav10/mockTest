"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  X,
  Smartphone,
  Sparkles,
  Share,
  MoreVertical,
  PlusSquare,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");

  useEffect(() => {
    // 1. Register Service Worker for offline caching & PWA compliance
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration:", err);
        });
    }

    if (typeof window !== "undefined") {
      // Auto-upgrade plain HTTP to HTTPS so Chrome enables native PWA installation
      if (
        window.location.protocol === "http:" &&
        window.location.hostname !== "localhost" &&
        !window.location.hostname.startsWith("127.")
      ) {
        window.location.replace("https://13.235.234.124.nip.io" + window.location.pathname + window.location.search);
        return;
      }

      // 2. Check if already running in standalone PWA mode
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(standalone);

      // Detect OS
      const ua = window.navigator.userAgent.toLowerCase();
      const apple = /iphone|ipad|ipod/.test(ua);
      const android = /android/.test(ua);
      setIsIos(apple);
      setIsAndroid(android);
      if (apple) setActiveTab("ios");
      else setActiveTab("android");

      // Check session dismissal
      const dismissed = sessionStorage.getItem("pwa_banner_dismissed");
      if (dismissed === "true" || standalone) {
        setShowBanner(false);
      }

      // 3. Listen for native Android/Chrome beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        console.log("[PWA] beforeinstallprompt event captured");
      };

      // 4. Custom global event listener for any "Install App" button in UI
      const handleOpenInstallModal = () => {
        setShowModal(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("open-pwa-install", handleOpenInstallModal);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("open-pwa-install", handleOpenInstallModal);
      };
    }
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("[PWA] User choice outcome:", outcome);
        if (outcome === "accepted") {
          setShowModal(false);
          setShowBanner(false);
          setDeferredPrompt(null);
          return;
        }
      } catch (e) {
        console.warn("[PWA] Install prompt error:", e);
      }
    }
    // If native prompt didn't show or isn't available, open step-by-step modal guide
    setShowModal(true);
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa_banner_dismissed", "true");
  };

  return (
    <>
      {/* 1. FLOATING BOTTOM APP INSTALL BANNER (Visible on both mobile & desktop unless running as standalone app) */}
      {!isStandalone && showBanner && (
        <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/app-icon.png"
                  alt="StudyBae"
                  className="w-11 h-11 rounded-xl object-cover shadow-md ring-1 ring-white/40 shrink-0"
                />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Install StudyBae App</span>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.5 rounded font-bold border border-pink-500/30">
                      Live AWS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Phone screen par App ki tarah chalayein bina browser link ke!
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismissBanner}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-3">
              <button
                type="button"
                onClick={handleTriggerInstall}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>📲 Phone me Install Karein</span>
              </button>
              <button
                type="button"
                onClick={handleDismissBanner}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Baad Me
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPREHENSIVE INTERACTIVE INSTALLATION MODAL GUIDE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <img
                src="/app-icon.png"
                alt="StudyBae"
                className="w-13 h-13 rounded-2xl object-cover shadow-md ring-2 ring-purple-300 shrink-0"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Install StudyBae App</span>
                  <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    PWA App
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Direct Home Screen App with Real-Time AWS Sync (No manual APK updates)
                </p>
              </div>
            </div>

            {/* Native 1-Tap button if deferred prompt is available */}
            {deferredPrompt && (
              <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="text-xs text-blue-900">
                  <div className="font-bold">Automatic 1-Tap Installation Ready</div>
                  <div className="text-blue-700 text-[11px]">Click below to install directly to home screen.</div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      deferredPrompt.prompt();
                      const res = await deferredPrompt.userChoice;
                      if (res.outcome === "accepted") {
                        setShowModal(false);
                        setShowBanner(false);
                      }
                    } catch (e) {}
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shrink-0"
                >
                  Install Now
                </button>
              </div>
            )}

            {/* Platform Tab Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("android")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "android"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Android (Chrome)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ios")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "ios"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Share className="w-4 h-4 text-blue-600" />
                <span>iPhone / iPad (Safari)</span>
              </button>
            </div>

            {/* STEP-BY-STEP INSTRUCTIONS */}
            {activeTab === "android" ? (
              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Chrome Browser me Top-Right 3 Dots (⋮) dabayein</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>Open Chrome menu at top right corner</span>
                      <MoreVertical className="w-3.5 h-3.5 inline text-slate-700" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      &quot;Install app&quot; ya &quot;Add to Home screen&quot; par click karein
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      (हिंदी में: &quot;ऐप इंस्टॉल करें&quot; या &quot;होम स्क्रीन पर जोड़ें&quot;)
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Pop-up me &quot;Install&quot; ya &quot;Add&quot; dabayein</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      StudyBae ka App icon aapke mobile home screen par aa jayega!
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Safari browser me bottom bar me Share icon dabayein</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>Tap the Share icon</span>
                      <Share className="w-3.5 h-3.5 inline text-blue-600" />
                      <span>(square with up-arrow)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Niche scroll karke &quot;Add to Home Screen&quot; chunein</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />
                      <span>Tap &quot;Add to Home Screen&quot;</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Top-right me &quot;Add&quot; dabayein</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      StudyBae app iPhone screen par add ho jayegi aur bina browser address bar ke khulegi.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Why PWA Benefits Box */}
            <div className="mt-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>App Ke Fayde (Advantages):</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                <li>Baar-baar browser me link type karne ki jarurat nahi.</li>
                <li>Full screen CBT Test mode — koi browser URL bar nahi dikhega.</li>
                <li>AWS server se 100% real-time connected — kabhi manual update nahi karna padega.</li>
              </ul>
            </div>

            {/* Close / Got It Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
              >
                Samajh Gaya (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

