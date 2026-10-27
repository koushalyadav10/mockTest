"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileCheck2,
  BookOpen,
  History,
  User,
  Shield,
  Award,
  GraduationCap,
  Upload,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  // Track search query param on client for tabs like /admin?tab=SUBMISSIONS
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentSearch(window.location.search);
    }
  }, [pathname]);

  // HIDE RULES:
  // 1. Unauthenticated / auth pages
  // 2. "test dene ke time": during CBT examination (/mock/.../test) or SVAR spoken assessment (/svar)
  // 3. "padhai krte time": when reading/studying specific book chapters (/books/[bookId]/...)
  const isTakingTest =
    (pathname?.includes("/mock/") && (pathname?.endsWith("/test") || pathname?.includes("/test/"))) ||
    pathname?.startsWith("/svar");
  const isStudyingBook = Boolean(pathname?.startsWith("/books/") && pathname !== "/books");
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  if (!currentUser || isAuthPage || isTakingTest || isStudyingBook) {
    return null;
  }

  const role = currentUser?.role;

  interface NavItem {
    href: string;
    label: string;
    icon: any;
    badge?: string;
  }

  // Role-appropriate bottom navigation
  const adminNavItems: NavItem[] = [
    { href: "/admin", label: "Admin", icon: Shield },
    { href: "/exams", label: "Tests", icon: FileCheck2 },
    { href: "/admin?tab=SUBMISSIONS", label: "Scores", icon: Award },
    { href: "/books", label: "Books", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const facultyNavItems: NavItem[] = [
    { href: "/teacher", label: "Faculty", icon: GraduationCap },
    { href: "/exams", label: "Tests", icon: FileCheck2 },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/books", label: "Books", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const studentNavItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/exams", label: "Tests", icon: FileCheck2 },
    { href: "/books", label: "Books", icon: BookOpen, badge: "NEW" },
    { href: "/history", label: "History", icon: History },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const navItems =
    role === "ADMIN"
      ? adminNavItems
      : role === "TEACHER"
      ? facultyNavItems
      : studentNavItems;

  return (
    <>
      {/* Scroll Spacer: Guarantees page contents are fully readable above the locked bar */}
      <div className="lg:hidden h-20 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Permanently Locked Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
        }}
      >
        <div className="flex items-center justify-around h-14 px-1 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            // Check active state accurately taking query params into account
            let isActive = false;
            if (item.href === "/admin?tab=SUBMISSIONS") {
              isActive = pathname === "/admin" && currentSearch.includes("SUBMISSIONS");
            } else if (item.href === "/admin") {
              isActive = pathname === "/admin" && !currentSearch.includes("SUBMISSIONS");
            } else if (item.href === "/dashboard") {
              isActive = pathname === "/dashboard";
            } else {
              isActive =
                pathname === item.href ||
                Boolean(pathname?.startsWith(item.href.split("?")[0]));
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.href.includes("?")) {
                    setCurrentSearch(item.href.substring(item.href.indexOf("?")));
                  } else {
                    setCurrentSearch("");
                  }
                }}
                className={`flex-1 h-full flex flex-col items-center justify-center relative touch-manipulation transition-all duration-150 ${
                  isActive ? "text-[#5a4bda]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110 text-[#5a4bda] stroke-[2.4]" : "text-slate-500 stroke-[1.8]"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3 px-1 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[7.5px] rounded-full uppercase leading-none shadow-xs pointer-events-none">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10.5px] mt-0.5 tracking-tight ${
                    isActive ? "font-bold text-[#5a4bda]" : "font-medium text-slate-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute bottom-0.5 w-6 h-0.5 bg-[#5a4bda] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
