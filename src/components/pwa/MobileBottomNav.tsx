"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCheck2, BookOpen, History, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, [pathname]);

  // Hide on test taking screen, on login page, or unauthenticated
  if (
    !isLoggedIn ||
    pathname === "/" ||
    pathname === "/login" ||
    (pathname?.includes("/mock/") && pathname?.endsWith("/test"))
  ) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/exams", label: "Tests", icon: FileCheck2 },
    { href: "/books", label: "Books", icon: BookOpen, badge: "NEW" },
    { href: "/history", label: "History", icon: History },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none">
      <div className="flex items-center justify-around h-15 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? "text-[#5a4bda]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-[#5a4bda]" : "text-slate-500"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 px-1 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[8px] rounded-full uppercase leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? "font-bold text-[#5a4bda]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[#5a4bda] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
