"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Bell, User, Settings } from "lucide-react";
import { GlobalSearch } from "./global-search";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Public Menu Items (Admin link strictly removed)
  const menuItems = [
    { name: "الرئيسية", href: "/" },
    { name: "عن الركابية", href: "/about" },
    { name: "النسب والشجرة", href: "/genealogy" },
    { name: "دليل الأسر", href: "/directory" },
    { name: "قاعدة البيانات", href: "/database" },
    { name: "الأقسام المتخصصة", href: "/specialized" },
    { name: "الخدمات الاجتماعية", href: "/services" },
    { name: "المعرفة والإعلام", href: "/media" },
    { name: "تاريخ السادة", href: "/history" },
    { name: "اتصل بنا", href: "/contact" },
  ];

  const notifications = [
    { id: 1, text: "انعقاد الملتقى السنوي العام بنهر النيل السبت المقبل.", time: "قبل ساعتين" },
    { id: 2, text: "بيان هام من اللجنة القانونية حول توثيق وحماية الأوقاف التاريخية.", time: "قبل يوم واحد" },
    { id: 3, text: "تدشين مشروع الرابط الرقمي لشجرة الأنساب التفاعلية.", time: "قبل يومين" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md support-[backdrop-filter]:bg-background/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Right: Logo Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
                  ر
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight">
                    السادة الركابية
                  </span>
                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 leading-none tracking-widest mt-0.5">
                    المنصة الرقمية الرسمية
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Left: Quick Actions Area */}
            <div className="flex items-center gap-2">
              {/* Trigger Global Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="البحث الموحد"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications Hub */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
                  title="الإشعارات والتنبيهات"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-xl py-3 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200 z-50 text-right">
                    <div className="px-4 pb-2 border-b border-border flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">مركز الإشعارات</span>
                      <span className="text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded-full font-semibold">3 غير مقروءة</span>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-muted/30 transition-colors cursor-pointer">
                          <p className="text-xs text-foreground font-medium leading-relaxed">{n.text}</p>
                          <span className="text-[9px] text-muted-foreground mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pt-2 border-t border-border text-center">
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-xs font-semibold text-primary hover:underline">
                        إغلاق القائمة
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Shortcut */}
              <Link
                href="/profile"
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hidden sm:inline-flex"
                title="الملف الشخصي والبطاقة الرقمية"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Settings Shortcut */}
              <Link
                href="/settings"
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hidden sm:inline-flex"
                title="الإعدادات الشخصية"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Member Dashboard / Login Button */}
              <Link
                href="/profile"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all duration-200 shadow-sm flex items-center gap-1.5"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>لوحة العضوية</span>
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground xl:hidden transition-colors"
                title="القائمة الكاملة"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-background border-t border-border animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-border pt-3 mt-3 flex items-center justify-around">
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  <span>الملف</span>
                </Link>
                <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>الإعدادات</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Global Auto-complete Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
