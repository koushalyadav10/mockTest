"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  BarChart3,
  BookOpen,
  Target,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function ExamForgeLandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const examCategories = [
    {
      id: "ssc",
      name: "SSC",
      fullName: "Staff Selection Commission",
      subExams: ["SSC CHSL", "SSC CGL", "SSC MTS", "SSC CPO", "SSC GD", "Stenographer"],
      pattern: "100 Questions • 60 Mins • Negative Marking 0.50",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      featured: true,
      href: "/exams",
    },
    {
      id: "up-police",
      name: "UP Police",
      fullName: "UP Police Constable",
      subExams: ["Civilian Police", "PAC", "Fireman"],
      pattern: "150 Questions • 120 Mins • Bilingual Devanagari",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      featured: false,
      href: "/exams",
    },
    {
      id: "upsi",
      name: "UPSI",
      fullName: "UP Police Sub-Inspector",
      subExams: ["Moolvidhi / Constitution", "General Hindi", "Numerical Ability"],
      pattern: "160 Questions • 120 Mins • Sectional Qualifying",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      featured: true,
      href: "/exams",
    },
    {
      id: "railway",
      name: "Railway",
      fullName: "RRB Recruitment",
      subExams: ["RRB NTPC CBT-1 & 2", "RRB Group D", "RRB ALP"],
      pattern: "100 Questions • 90 Mins • Negative Marking 1/3",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      featured: false,
      href: "/exams",
    },
    {
      id: "banking",
      name: "Banking",
      fullName: "IBPS & SBI Examinations",
      subExams: ["IBPS PO Prelims", "IBPS Clerk", "SBI PO"],
      pattern: "Sectional 20-Min Timers • Strict Section Locking",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      featured: false,
      href: "/exams",
    },
    {
      id: "other",
      name: "UPPSC & State",
      fullName: "State Public Service Commission",
      subExams: ["UPPSC PCS Prelims", "RO / ARO", "State Govt Jobs"],
      pattern: "Custom Blueprints • Comprehensive Question Bank",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      featured: false,
      href: "/exams",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Real Exam Interface",
      description: "Authentic CBT interface with server-authoritative timers, section tabs, and standard question palette.",
    },
    {
      icon: Target,
      title: "Sectional Timing",
      description: "Automated per-section time limits with configurable back-navigation lock according to exam rules.",
    },
    {
      icon: BarChart3,
      title: "Detailed Analysis",
      description: "Comprehensive question-wise time breakdown, accuracy percentages, speed matrix, and weak-topic diagnostics.",
    },
    {
      icon: BookOpen,
      title: "Question Bank",
      description: "Standardized repository of curated questions with verified answers, bilingual Hindi/English text, and KaTeX math.",
    },
    {
      icon: Sparkles,
      title: "Performance Tracking",
      description: "Monitor cumulative mock scores, percentile rankings, question visit history, and attempt improvements over time.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Test Environment",
      description: "Fullscreen enforcement and real focus-loss monitoring with warning overlays to simulate real exam discipline.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 font-sans selection:bg-teal-600 selection:text-white">
      {/* 1. TOP HEADER (Reference: Screenshot 1) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo + ExamForge */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
              EF
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-xl tracking-tight leading-tight">
                ExamForge
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Mock Test Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <Link href="/" className="text-teal-700 font-bold transition-colors">
              Home
            </Link>
            <Link href="/exams" className="hover:text-teal-700 transition-colors">
              Exams
            </Link>
            <Link href="/exams" className="hover:text-teal-700 transition-colors">
              Mock Tests
            </Link>
            <Link href="/practice" className="hover:text-teal-700 transition-colors">
              Practice
            </Link>
            <Link href="/history" className="hover:text-teal-700 transition-colors">
              Results
            </Link>
            <Link href="#features" className="hover:text-teal-700 transition-colors">
              About
            </Link>
          </nav>

          {/* Right: Login & Sign Up */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-700 hover:text-black font-semibold text-sm px-3 py-1.5 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Sign Up
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-700 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 text-sm font-semibold text-slate-700 shadow-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
              Home
            </Link>
            <Link href="/exams" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
              Exams &amp; Mock Tests
            </Link>
            <Link href="/practice" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
              Practice Questions
            </Link>
            <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">
              Results &amp; Analytics
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-teal-700 font-bold">
              Login / Sign Up
            </Link>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Large Educational Image + Clean Overlay inspired by Screenshot 1) */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image: Clean classroom & students studying */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')",
          }}
        />

        {/* Dark Linear & Radial Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Official CBT Examination Simulation Engine</span>
          </div>

          {/* Main Overlay Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Prepare. Practice. Improve.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Realistic mock tests for SSC, UP Police, UPSI and other competitive examinations.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/exams">
              <button
                type="button"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all flex items-center gap-2"
              >
                <span>Explore Exams</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/dashboard">
              <button
                type="button"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-teal-300" />
                <span>Start Free Test</span>
              </button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-white/10 text-xs font-medium text-slate-400 max-w-3xl mx-auto">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">100% Real</div>
              <div className="text-[11px] text-slate-400">Server-Side Scoring</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-teal-400 font-mono">SSC &bull; UPSI</div>
              <div className="text-[11px] text-slate-400">Configurable Blueprints</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">6-Digit OTP</div>
              <div className="text-[11px] text-slate-400">Real Email Authentication</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">Anti-Cheat</div>
              <div className="text-[11px] text-slate-400">Focus &amp; Tab-Switch Warnings</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXAM CATEGORIES SECTION */}
      <section id="exams" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Target Examination Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Select your target competitive examination to access full-length mock tests and sectional papers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-teal-500/60 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                    {cat.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                    {cat.fullName}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {cat.pattern}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.subExams.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-teal-700">
                <span>View Mock Tests</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. IMPORTANT FEATURES SECTION */}
      <section id="features" className="bg-[#f8fafc] border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for Serious Competitive Aspirants
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Every feature is engineered to replicate real exam pressure and provide deep analytical feedback
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SIMPLE PROFESSIONAL FOOTER */}
      <footer className="bg-white py-10 text-xs text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
              EF
            </div>
            <span>ExamForge Testing Systems</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-slate-600">
            <Link href="/exams" className="hover:text-black">
              Exams
            </Link>
            <Link href="/practice" className="hover:text-black">
              Practice
            </Link>
            <Link href="/upload" className="hover:text-black">
              Question Uploader
            </Link>
            <Link href="/login" className="hover:text-black">
              Candidate Login
            </Link>
          </div>

          <div>&copy; 2026 ExamForge. Professional Mock Testing Platform.</div>
        </div>
      </footer>
    </div>
  );
}
