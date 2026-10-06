"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Lock,
  Edit3,
  HelpCircle,
  X,
  Save,
  AlertCircle,
  ShieldCheck,
  Star,
  Award,
  BookOpen,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  gender: "MALE" | "FEMALE";
  academicClass?: string | null;
  board?: string | null;
  targetExam?: string | null;
  language: string;
  isProfileLocked: boolean;
  role: string;
  studentRollNo?: string | null;
}

interface UserStats {
  totalTestsAttended: number;
  highestScore: number | string;
  starsEarned: number;
  overallPerformance: string;
  levelTitle: string;
  badgeTitle: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalTestsAttended: 0,
    highestScore: "-",
    starsEarned: 0,
    overallPerformance: "Needs Practice",
    levelTitle: "No Current Level",
    badgeTitle: "Student Master",
  });

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isConfirmLockOpen, setIsConfirmLockOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form edit fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    gender: "MALE" as "MALE" | "FEMALE",
    academicClass: "12+",
    board: "CBSE",
    targetExam: "SSC CHSL",
    language: "English",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load profile");
      }
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          city: data.user.city || "",
          gender: data.user.gender === "FEMALE" ? "FEMALE" : "MALE",
          academicClass: data.user.academicClass || "12+",
          board: data.user.board || "CBSE",
          targetExam: data.user.targetExam || "SSC CHSL",
          language: data.user.language || "English",
        });
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Quick gender / avatar switch
  const handleGenderSwitch = async (newGender: "MALE" | "FEMALE") => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: newGender,
          toggleGenderOnly: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, gender: newGender } : null));
        setFormData((prev) => ({ ...prev, gender: newGender }));
        setIsAvatarModalOpen(false);
        setSaveSuccessMsg(`Avatar updated to ${newGender === "MALE" ? "Male" : "Female"}!`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      } else {
        setSaveErrorMsg(data.error || "Failed to switch avatar");
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Failed to switch avatar");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit and permanently lock profile
  const handleSaveAndLock = async () => {
    try {
      setSubmitting(true);
      setSaveErrorMsg(null);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          gender: formData.gender,
          academicClass: formData.academicClass,
          board: formData.board,
          targetExam: formData.targetExam,
          language: formData.language,
          lockNow: true, // Once saved, it will be fixed and permanently locked
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsConfirmLockOpen(false);
        setIsEditModalOpen(false);
        setSaveSuccessMsg("Profile details saved & permanently locked for candidate records!");
        setTimeout(() => setSaveSuccessMsg(null), 4000);
        await fetchProfile();
      } else {
        setSaveErrorMsg(data.error || "Failed to save profile details");
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Network error while saving details");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading candidate profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-800 pb-20 selection:bg-purple-100">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Profile</span>
          </button>

          {profile?.isProfileLocked ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified &amp; Locked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Draft (Editable)
            </span>
          )}
        </div>
      </header>

      {/* Floating Success / Error Toasts */}
      {saveSuccessMsg && (
        <div className="fixed top-18 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {saveErrorMsg && (
        <div className="fixed top-18 right-6 z-50 bg-rose-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* User Identity & Avatar Section */}
        <section className="flex flex-col items-center justify-center text-center space-y-3">
          {/* Avatar with Camera Icon Overlay */}
          <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <div className="p-1 rounded-full ring-4 ring-purple-100 shadow-md">
              <UserAvatar gender={profile?.gender || "MALE"} size="xl" className="shadow-xs" />
            </div>
            {/* Camera Edit Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAvatarModalOpen(true);
              }}
              title="Change Avatar (Male / Female)"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#5a4bda] hover:bg-[#493bbd] text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform hover:scale-110 active:scale-95"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Full Name */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile?.name || "Candidate Name"}
            </h1>
            {profile?.studentRollNo && (
              <p className="text-xs font-mono font-medium text-slate-400">
                Roll No: {profile.studentRollNo}
              </p>
            )}
          </div>

          {/* Badges Pill Row */}
          <div className="flex items-center gap-2.5 pt-1">
            {/* Level Pill */}
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs">
              {stats.levelTitle}
            </div>

            {/* Role / Master Pill */}
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{stats.badgeTitle}</span>
            </div>
          </div>
        </section>

        {/* 4 Metric Cards Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Total Tests Attempted (Replaces Total XP) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold tracking-tight">Total Tests Attempted</span>
              <span title="Total mock tests attended across the platform (persists even if attempt records are cleared)">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats.totalTestsAttended}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tests</span>
            </div>
          </div>

          {/* Card 2: Highest Score (Replaces Highest Level) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold tracking-tight">Highest Score</span>
              <span title="Your top evaluated score achieved across all attempted tests">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats.highestScore}
              </span>
              {typeof stats.highestScore === "number" && (
                <span className="text-[11px] font-bold text-purple-600 uppercase">Pts</span>
              )}
            </div>
          </div>

          {/* Card 3: Stars Earned (Replaces Doubts Solved) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold tracking-tight">Stars Earned</span>
              <span title="Stars awarded based on high accuracy, consistency, and test completions">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
                {stats.starsEarned}
              </span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline-block" />
            </div>
          </div>

          {/* Card 4: Overall Performance (Replaces Satisfactory Rate) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold tracking-tight">Overall Performance</span>
              <span title="Performance rating: Needs Practice, Average, Good, or Better based on accuracy">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
              </span>
            </div>
            <div className="mt-1">
              <span
                className={`text-base sm:text-lg font-black tracking-tight px-2.5 py-0.5 rounded-lg inline-block ${
                  stats.overallPerformance === "Better"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : stats.overallPerformance === "Good"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : stats.overallPerformance === "Average"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {stats.overallPerformance}
              </span>
            </div>
          </div>
        </section>

        {/* Two Column Details Section (Personal & Academic) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Personal Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Personal Details
              </h2>
              {profile?.isProfileLocked ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  Locked
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4 text-sm">
              {/* Name */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Name</span>
                <span className="font-bold text-slate-900 block">{profile?.name || "Not Set"}</span>
              </div>

              {/* Mobile Number */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Mobile Number</span>
                <span className="font-bold text-slate-900 block font-mono">{profile?.phone || "Not Set"}</span>
              </div>

              {/* Email - Strictly Non-Editable */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 relative">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-slate-400">E-mail</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Non-editable
                  </span>
                </div>
                <span className="font-bold text-slate-800 block truncate">{profile?.email}</span>
              </div>

              {/* City / Village / Town */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                  City / Village / Town
                </span>
                <span className="font-bold text-slate-900 block">{profile?.city || "Not Set"}</span>
              </div>

              {/* Gender */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">Gender</span>
                  <span className="font-bold text-slate-900 block capitalize">
                    {profile?.gender ? profile.gender.toLowerCase() : "Male"}
                  </span>
                </div>
                <UserAvatar gender={profile?.gender || "MALE"} size="xs" />
              </div>
            </div>
          </div>

          {/* Right Card: Academic Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Academic Details
              </h2>
              {profile?.isProfileLocked ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  Locked
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4 text-sm">
              {/* Class */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Class</span>
                <span className="font-bold text-slate-900 block">{profile?.academicClass || "12+"}</span>
              </div>

              {/* Board / State Board */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                  Board / State Board
                </span>
                <span className="font-bold text-slate-900 block">{profile?.board || "CBSE"}</span>
              </div>

              {/* Target Exams */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Exams</span>
                <span className="font-bold text-slate-900 block">{profile?.targetExam || "SSC CHSL / CGL"}</span>
              </div>

              {/* Language */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Language</span>
                <span className="font-bold text-slate-900 block">{profile?.language || "English"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Seal & India Brand Stamp */}
        <section className="flex flex-col items-center justify-center pt-8 pb-4 space-y-2 select-none">
          <div className="w-20 h-20 rounded-full border border-dashed border-slate-300 flex flex-col items-center justify-center p-2 text-slate-400 bg-white shadow-xs">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">LOVE</span>
            <span className="text-base text-rose-500 font-bold leading-none my-0.5">♡</span>
            <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">LEARNING</span>
          </div>
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
            Made with <span className="text-rose-500">♡</span> in India
          </p>
        </section>
      </main>

      {/* MODAL 1: Choose Avatar (Male / Female) */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Choose Candidate Avatar</h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select your profile avatar. This avatar will appear across the navbar, profile dashboard, and CBT exam header.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Male Option */}
              <button
                type="button"
                onClick={() => handleGenderSwitch("MALE")}
                disabled={submitting}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  profile?.gender === "MALE"
                    ? "border-indigo-600 bg-indigo-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50"
                }`}
              >
                <UserAvatar gender="MALE" size="lg" className="mb-2" />
                <span className="font-bold text-sm text-slate-800">Male</span>
                {profile?.gender === "MALE" && (
                  <span className="text-[10px] font-bold text-indigo-600 mt-1 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                )}
              </button>

              {/* Female Option */}
              <button
                type="button"
                onClick={() => handleGenderSwitch("FEMALE")}
                disabled={submitting}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  profile?.gender === "FEMALE"
                    ? "border-purple-600 bg-purple-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50"
                }`}
              >
                <UserAvatar gender="FEMALE" size="lg" className="mb-2" />
                <span className="font-bold text-sm text-slate-800">Female</span>
                {profile?.gender === "FEMALE" && (
                  <span className="text-[10px] font-bold text-purple-600 mt-1 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Candidate Details Form */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Edit Profile Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update candidate personal and academic demographics
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* E-mail (Disabled & Locked) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-1">
                  <span>E-mail Address</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Permanent (Cannot be changed)
                  </span>
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Koushal Yadav"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9555236625"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* City / Town */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  City / Village / Town
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Lucknow"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Gender Radio */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "MALE" })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      formData.gender === "MALE"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <UserAvatar gender="MALE" size="xs" />
                    <span>Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      formData.gender === "FEMALE"
                        ? "border-purple-600 bg-purple-50 text-purple-800"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <UserAvatar gender="FEMALE" size="xs" />
                    <span>Female</span>
                  </button>
                </div>
              </div>

              {/* Class */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Class / Qualification
                </label>
                <select
                  value={formData.academicClass}
                  onChange={(e) => setFormData({ ...formData, academicClass: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="10th">10th (Matriculation)</option>
                  <option value="12th">12th (Intermediate)</option>
                  <option value="12+">12+ (Aspirant)</option>
                  <option value="Graduation">Graduation (BA / BSc / BTech / BCom)</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Board */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Board / State Board
                </label>
                <input
                  type="text"
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  placeholder="e.g. CBSE, UP Board, ICSE"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Target Exam */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Exam
                </label>
                <input
                  type="text"
                  value={formData.targetExam}
                  onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                  placeholder="e.g. SSC CGL, SSC CHSL, NEET, UPSI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Language */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Medium / Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Bilingual">Bilingual (English + Hindi)</option>
                </select>
              </div>
            </div>

            {/* Alert note on locking */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Important Policy:</strong> Once you submit and save your candidate details, they will be fixed permanently in the database to preserve examination audit integrity.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmLockOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#5a4bda] hover:bg-[#493bbd] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; Lock Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Confirmation Dialog for Permanent Lock */}
      {isConfirmLockOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">Lock Candidate Profile?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                As per your specification, once saved these details will be permanently locked with your account and cannot be modified again.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <div><strong>Name:</strong> {formData.name || profile?.name}</div>
              <div><strong>Phone:</strong> {formData.phone || "Not Set"}</div>
              <div><strong>City:</strong> {formData.city || "Not Set"}</div>
              <div><strong>Email:</strong> {profile?.email} (Fixed)</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setIsConfirmLockOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Review Again
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSaveAndLock}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200"
              >
                {submitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm &amp; Lock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
