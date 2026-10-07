"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  // Handle outside click to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Brand */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1b212d] text-white flex items-center justify-center font-black text-lg tracking-tight shadow-xs select-none">
                EF
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                  ExamForge<span className="text-[#5a4bda]">.AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  CBT Testing Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5">
              {activeNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#f4f2ff] text-[#5a4bda] font-bold shadow-xs border border-purple-200/60"
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pathname?.startsWith("/admin")
                      ? "bg-purple-100 text-purple-900 border border-purple-200"
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pathname?.startsWith("/teacher")
                      ? "bg-blue-100 text-blue-900 border border-blue-200"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Faculty</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Area: Role-appropriate Action, Profile & Logout */}
          <div className="flex items-center gap-3">

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

            {/* Profile Avatar & Greeting with Dropdown */}
            {user ? (
              <div className="relative pl-3 border-l border-slate-200" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 transition-all focus:outline-hidden group"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  {/* Greeting Text: "Hi, Koushal" */}
                  <span className="font-bold text-slate-800 text-sm hidden sm:inline-block tracking-tight">
                    Hi, <span className="text-slate-900">{user?.name ? user.name.split(" ")[0] : "Candidate"}</span>
                  </span>

                  {/* Illustrated Round Avatar (Male or Female based on user.gender) */}
                  <UserAvatar
                    gender={user?.gender || "MALE"}
                    size="sm"
                    className="ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all shadow-xs"
                  />

                  {/* Dropdown Chevron Arrow */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Card (2 options: My Profile, Logout) */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>My Profile</span>
                    </Link>

                    <div className="h-px bg-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/60 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  Login
                </Link>
              </div>
            )}

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
          {user && (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <UserAvatar gender={user?.gender || "MALE"} size="xs" />
              <span>My Profile ({user?.name || "Candidate"})</span>
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
