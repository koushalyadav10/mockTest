"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  UploadCloud,
  FileText,
  PhoneCall,
  Atom,
  Stethoscope,
  GraduationCap,
  Landmark,
  Compass,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Users,
  Menu,
  X,
  Play,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function PWCloneLandingPage() {
  const router = useRouter();
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const examCategories = [
    {
      id: "neet",
      title: "NEET",
      tags: ["Class 11", "Class 12", "Dropper"],
      href: "/exams",
      bgBlob: "bg-rose-50",
      accentColor: "text-rose-600",
      icon: (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-100 flex items-center justify-center relative overflow-hidden shadow-xs">
          <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-rose-200/60" />
        </div>
      ),
    },
    {
      id: "iit-jee",
      title: "IIT JEE",
      tags: ["Class 11", "Class 12", "Dropper"],
      href: "/exams",
      bgBlob: "bg-amber-50/70",
      accentColor: "text-amber-700",
      isFeatured: true,
      icon: (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100/90 flex items-center justify-center relative overflow-hidden shadow-xs">
          <Atom className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 animate-spin-slow" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-200/70" />
        </div>
      ),
    },
    {
      id: "pre-foundation",
      title: "Pre Foundation",
      tags: [],
      href: "/exams",
      bgBlob: "bg-orange-50",
      accentColor: "text-orange-600",
      icon: (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100/70 flex items-center justify-center relative overflow-hidden shadow-xs">
          <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-amber-700" />
          <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-amber-200/50" />
        </div>
      ),
    },
    {
      id: "school-boards",
      title: "School Boards",
      tags: ["CBSE", "ICSE", "UP Board", "Maharashtra Board"],
      href: "/exams",
      bgBlob: "bg-sky-50",
      accentColor: "text-sky-600",
      icon: (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sky-100 flex items-center justify-center relative overflow-hidden shadow-xs">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-sky-600" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-200/60" />
        </div>
      ),
    },
    {
      id: "upsc",
      title: "UPSC",
      tags: [],
      href: "/exams",
      bgBlob: "bg-teal-50",
      accentColor: "text-teal-600",
      icon: (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-100 flex items-center justify-center relative overflow-hidden shadow-xs">
          <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-teal-200/60" />
        </div>
      ),
    },
    {
      id: "govt-exams",
      title: "Govt Job Exams",
      tags: ["SSC", "Banking", "Teaching", "Judiciary"],
      href: "/exams",
      bgBlob: "bg-purple-50",
      accentColor: "text-purple-600",
      icon: (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-purple-100 flex items-center justify-center relative overflow-hidden shadow-xs">
          <Landmark className="w-10 h-10 sm:w-12 sm:h-12 text-purple-700" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-200/60" />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-900 font-sans selection:bg-[#5a4bda] selection:text-white relative">
      {/* 1. TOP NAVIGATION (AUTHENTIC PW STYLE) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Monogram & All Courses */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#1b212d] text-white flex items-center justify-center font-serif font-black text-xl tracking-tighter shadow-xs select-none">
                PW
              </div>
            </Link>

            {/* All Courses Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#5a4bda] text-[#5a4bda] text-xs sm:text-sm font-semibold hover:bg-purple-50/50 transition-colors"
              >
                <span>All Courses</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {coursesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Popular Exam Streams
                  </div>
                  {[
                    { label: "Govt Job Exams (SSC, Banking)", href: "/exams" },
                    { label: "IIT JEE (Class 11, 12, Dropper)", href: "/exams" },
                    { label: "NEET (Medical Entrance)", href: "/exams" },
                    { label: "UPSC Civil Services", href: "/exams" },
                    { label: "School Boards (CBSE / ICSE)", href: "/exams" },
                    { label: "Upload & OCR Document", href: "/upload" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#5a4bda] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
              <Link href="/exams" className="hover:text-[#5a4bda] transition-colors">
                Vidyapeeth
              </Link>
              <Link href="/practice" className="hover:text-[#5a4bda] transition-colors">
                PW Skills
              </Link>
              <Link href="/question-bank" className="hover:text-[#5a4bda] transition-colors">
                PW Store
              </Link>
              <Link href="/exams" className="hover:text-[#5a4bda] transition-colors">
                Class 1st - 8th
              </Link>
              <Link href="/upload" className="hover:text-[#5a4bda] transition-colors">
                Power Batch
              </Link>
              <Link href="/exams" className="hover:text-[#5a4bda] transition-colors">
                Test Series
              </Link>
            </nav>
          </div>

          {/* Right: Login/Register Button */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button
                type="button"
                className="bg-[#1b212d] hover:bg-black text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-lg shadow-sm transition-all"
              >
                Login/Register
              </button>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 text-sm font-semibold text-slate-700 shadow-lg">
            <Link
              href="/exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Vidyapeeth
            </Link>
            <Link
              href="/practice"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              PW Skills
            </Link>
            <Link
              href="/question-bank"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              PW Store
            </Link>
            <Link
              href="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Upload &amp; OCR Engine
            </Link>
            <Link
              href="/exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Test Series
            </Link>
          </div>
        )}
      </header>

      {/* 2. PROMOTIONAL CAROUSEL BANNER (NSAT VIDYAPEETH STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 text-white p-4 sm:p-6 lg:p-8">
          {/* Subtle patterned overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Alakh Sir Cutout Card & Vidyapeeth Badge */}
            <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
              <div className="relative">
                {/* Alakh Sir Illustrated Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-400 mx-auto mb-1 flex items-center justify-center font-bold text-slate-900 text-lg">
                      AS
                    </div>
                    <span className="text-[10px] font-bold text-white tracking-wide">ALAKH SIR</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                  FOUNDER
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
                  VIDYAPEETH &bull; IIT-JEE | NEET | FOUNDATION
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                  NSAT 2026
                </h3>
                <p className="text-xs text-rose-100 font-medium">
                  The National Scholarship &amp; Admission Test
                </p>
              </div>
            </div>

            {/* Middle: Feature Highlights Badges */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs font-semibold">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15">
                <div className="text-yellow-300 font-extrabold text-sm sm:text-base">Top 500</div>
                <div className="text-[11px] text-white/90">Free Education &amp; Stay</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15">
                <div className="text-yellow-300 font-extrabold text-sm sm:text-base">Up to ₹ 2.5 CR*</div>
                <div className="text-[11px] text-white/90">Worth Cash Prizes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/15 col-span-2 sm:col-span-1">
                <div className="text-yellow-300 font-extrabold text-sm sm:text-base">Up to 100%*</div>
                <div className="text-[11px] text-white/90">Merit Scholarship</div>
              </div>
            </div>

            {/* Right: Exam Dates & Yellow Register Now Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 flex-shrink-0">
              <div className="text-center sm:text-right lg:text-center text-[11px] font-medium text-rose-100">
                <span className="font-bold text-white uppercase tracking-wider block text-xs">EXAM DATES</span>
                <span>Online: 1st - 15th Oct &bull; Offline: 3rd, 4th, 10th Oct</span>
              </div>

              <Link href="/dashboard">
                <button
                  type="button"
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wide flex items-center gap-2"
                >
                  <span>FOR FREE REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-white transition-all" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* 3. HERO SECTION (BHARAT'S TRUSTED & AFFORDABLE PLATFORM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headings & Direct CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[#5a4bda] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Bharat&apos;s No.1 Exam Preparation Platform
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Bharat&apos;s{" "}
              <span className="text-[#5a4bda] bg-clip-text text-transparent bg-gradient-to-r from-[#5a4bda] to-[#4338ca]">
                Trusted &amp; Affordable
              </span>{" "}
              Educational Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              Unlock your potential by signing up with Physics Wallah &bull; The most affordable learning solution with authentic CBT mock exams, 15-stage AI OCR document understanding, and smart weak-topic diagnostics.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#categories">
                <button
                  type="button"
                  className="bg-[#5a4bda] hover:bg-[#4838cc] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Explore Category</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/upload">
                <button
                  type="button"
                  className="border-2 border-slate-200 bg-white hover:border-[#5a4bda] hover:text-[#5a4bda] text-slate-700 font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-xs"
                >
                  <UploadCloud className="w-4 h-4 text-[#5a4bda]" />
                  <span>Upload Question Paper</span>
                </button>
              </Link>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-xs font-semibold text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Upload PDF or Paste Raw Text</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Real SSC Negative Marking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Authoritative Server CBT Timer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Bilingual English &amp; Hindi (Devanagari)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Circular Orbit with Alakh Sir & Student Conversation */}
          <div className="lg:col-span-6 flex items-center justify-center relative py-6">
            {/* Outer Orbit Circle */}
            <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-purple-200/80 relative flex items-center justify-center">
              {/* Inner Orbit Circle */}
              <div className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-purple-100 absolute" />

              {/* Center Orbit Point with Gradient Glow */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-2xl flex items-center justify-center text-white text-center p-3 relative z-10">
                <div>
                  <div className="font-extrabold text-base tracking-tight">PW</div>
                  <div className="text-[10px] text-purple-100 font-medium">ExamForge</div>
                </div>
              </div>

              {/* Student Avatar (Top Right Orbit) */}
              <div className="absolute -top-4 right-6 sm:right-12 z-20 flex flex-col items-center">
                {/* Speech Bubble: "Alakh Sir, What is PW?" */}
                <div className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-2xl shadow-md mb-2 relative">
                  <span>Alakh Sir, What is PW?</span>
                  <div className="w-2 h-2 bg-white border-b border-r border-slate-200 transform rotate-45 absolute -bottom-1 left-6" />
                </div>
                {/* Student Photo Avatar */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-3 border-purple-400 shadow-md bg-rose-50 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-rose-200 to-indigo-100 flex items-center justify-center font-bold text-slate-700 text-xs text-center p-1">
                    👩‍🎓 Student
                  </div>
                </div>
              </div>

              {/* Alakh Sir Avatar (Bottom Left Orbit) */}
              <div className="absolute -bottom-6 left-2 sm:left-6 z-20 flex flex-col items-start max-w-[240px]">
                {/* Alakh Sir Photo Avatar */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-3 border-purple-600 shadow-md bg-slate-900 flex items-center justify-center overflow-hidden mb-2">
                  <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center font-bold text-xs">
                    <span className="text-amber-400 font-black">PW</span>
                    <span className="text-[9px]">Alakh Sir</span>
                  </div>
                </div>
                {/* Speech Bubble: "PW is where students learn with love and can grow with guidance" */}
                <div className="bg-[#1b212d] text-white text-[11px] sm:text-xs font-semibold p-3 rounded-2xl shadow-xl relative leading-snug">
                  <div className="w-2 h-2 bg-[#1b212d] transform rotate-45 absolute -top-1 left-6" />
                  <span>&ldquo;PW is where students learn with love and can grow with guidance&rdquo;</span>
                </div>
              </div>

              {/* Floating Decorative Planetary Badges */}
              <div className="absolute top-1/2 -left-3 w-7 h-7 rounded-full bg-blue-500 shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                A+
              </div>
              <div className="absolute bottom-12 right-2 w-6 h-6 rounded-full bg-emerald-500 shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXAM CATEGORIES SECTION (AUTHENTIC 2X3 GRID FROM SCREENSHOT 2) */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Exam Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            PW is preparing students for 35+ exam categories. Scroll down to find the one you are preparing for
          </p>
        </div>

        {/* 2x3 Grid of Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examCategories.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md ${
                cat.isFeatured
                  ? "bg-[#fffdf5] border-amber-300/80 ring-2 ring-amber-200/50 shadow-xs"
                  : "bg-white border-slate-200/80 hover:border-slate-300"
              }`}
            >
              {/* Top Row: Category Title & Right-Aligned Illustration */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                    {cat.title}
                  </h3>

                  {/* Class Tags */}
                  {cat.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {cat.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Illustration Blob */}
                <div className="flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
                  {cat.icon}
                </div>
              </div>

              {/* Bottom Action: Explore Category */}
              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={cat.href}
                  className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    cat.isFeatured
                      ? "text-[#5a4bda] hover:text-[#4838cc]"
                      : "text-slate-800 hover:text-[#5a4bda]"
                  }`}
                >
                  <span>Explore Category</span>
                  {cat.isFeatured ? (
                    <div className="w-6 h-6 rounded-full bg-[#5a4bda] text-white flex items-center justify-center shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Link>

                {cat.isFeatured && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    POPULAR
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. QUICK UPLOAD / PASTED TEXT ACTION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" /> Direct Text Paste &amp; OCR Engine
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Have a Question Paper or Notes to Test?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Upload any PDF or simply paste raw questions directly. Our 15-stage AI engine instantly generates a full Computer-Based Test (CBT) with timer, palette, and automated scoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/upload">
              <button
                type="button"
                className="bg-[#5a4bda] hover:bg-[#4838cc] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload PDF / Image</span>
              </button>
            </Link>

            <Link href="/upload">
              <button
                type="button"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Paste Question Text</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM TRUST METRICS */}
      <section className="bg-slate-50 border-t border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">10 Million+</div>
              <div className="text-xs font-semibold text-slate-500">Happy Aspirants across Bharat</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#5a4bda]">35+ Exams</div>
              <div className="text-xs font-semibold text-slate-500">SSC, Banking, JEE, NEET &amp; Boards</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">100% CBT</div>
              <div className="text-xs font-semibold text-slate-500">Server-Authoritative Test Environment</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-600">15-Step AI</div>
              <div className="text-xs font-semibold text-slate-500">High-Precision OCR &amp; Formula Parsing</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTHENTIC PW-STYLE FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="w-6 h-6 rounded-full bg-[#1b212d] text-white flex items-center justify-center font-serif text-xs">
              PW
            </div>
            <span>Physics Wallah &bull; ExamForge AI Mock Platform</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/exams" className="hover:text-[#5a4bda]">
              All Exams
            </Link>
            <Link href="/upload" className="hover:text-[#5a4bda]">
              Upload Paper
            </Link>
            <Link href="/question-bank" className="hover:text-[#5a4bda]">
              Question Bank
            </Link>
            <Link href="/dashboard" className="hover:text-[#5a4bda]">
              Student Portal
            </Link>
          </div>

          <div>&copy; 2026 Physics Wallah. All rights reserved.</div>
        </div>
      </footer>

      {/* 8. FLOATING CALL SUPPORT BUTTON (PURPLE CIRCLE AT BOTTOM RIGHT) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          title="Talk to Student Counselor"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#5a4bda] hover:bg-[#4838cc] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all p-3 border-2 border-white ring-4 ring-purple-200/50"
        >
          <PhoneCall className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
