"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Layers,
  Upload,
  BookOpen,
  FileCheck2,
  BarChart3,
  History,
  Flame,
  Menu,
  X,
  PlayCircle,
  Shield,
  GraduationCap,
  LogOut,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (e) {
      router.push("/login");
    }
  };

  // On root landing page or during an active exam test, let the page control its own header
  if (pathname === "/" || (pathname?.includes("/mock/") && pathname?.endsWith("/test"))) {
    return null;
  }

  const isTeacherOrAdmin = user?.role === "TEACHER" || user?.role === "ADMIN";

  // Strict Role-Based Navigation: Students must never see Upload & OCR or Question Bank
  const studentNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Layers },
    { href: "/exams", label: "Mock Tests", icon: FileCheck2 },
    { href: "/practice", label: "Quick Practice", icon: PlayCircle },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/history", label: "Test History", icon: History },
  ];

  const facultyNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Layers },
    { href: "/exams", label: "Exams", icon: FileCheck2 },
    { href: "/upload", label: "Upload & OCR", icon: Upload },
    { href: "/question-bank", label: "Question Bank", icon: BookOpen },
    { href: "/practice", label: "Practice Mode", icon: PlayCircle },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/history", label: "History", icon: History },
  ];

  const activeNavLinks = isTeacherOrAdmin ? facultyNavLinks : studentNavLinks;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Brand */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
                EF
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                  ExamForge
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  CBT Testing Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {activeNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-800 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Conditional Admin link */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                    pathname?.startsWith("/admin")
                      ? "bg-purple-100 text-purple-900"
                      : "text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Conditional Teacher / Faculty link */}
              {user?.role === "TEACHER" && (
                <Link
                  href="/teacher"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                    pathname?.startsWith("/teacher")
                      ? "bg-blue-100 text-blue-900"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Faculty</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Area: Streak, Role-appropriate Action, Profile & Logout */}
          <div className="flex items-center gap-3">
            {/* Student Streak Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs text-amber-800 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>4 Day Streak</span>
            </div>

            {/* Faculty Action: Upload Paper */}
            {isTeacherOrAdmin ? (
              <Link href="/upload">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Paper</span>
                </button>
              </Link>
            ) : (
              /* Student Action: Browse Mock Tests */
              <Link href="/exams">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Browse Tests</span>
                </button>
              </Link>
            )}

            {/* Profile Avatar / Initials */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name[0].toUpperCase() : "EF"}
              </div>
              <div className="hidden md:block leading-tight text-left">
                <div className="font-bold text-slate-800 truncate max-w-[120px]">
                  {user?.name || "Candidate"}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {user?.role || "STUDENT"}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {activeNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-teal-50 text-teal-800 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-bold text-purple-700 hover:bg-purple-50"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
          {user?.role === "TEACHER" && (
            <Link
              href="/teacher"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Faculty Workspace</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};
