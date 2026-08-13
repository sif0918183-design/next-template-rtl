"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldCheck, User, Bell, Globe, Sparkles, ChevronLeft } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifs, setNotifs] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [language, setLanguage] = useState("ar");

  const handleSave = () => {
    alert("تم حفظ تفضيلاتك بنجاح وبشكل آمن.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            تفضيلات الاستخدام والسرية التامة
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">إعدادات المنصة الرقمية</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            خصص مظهر البوابة، إعدادات الإشعارات والتنبيهات، وخيارات سرية وخصوصية البيانات الحساسة المعروضة للعامة.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 space-y-8 text-right">

        {/* Settings Container */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-6">
          <h3 className="font-extrabold text-base text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span>لوحة التحكم والتفضيلات الشخصية</span>
          </h3>

          <div className="space-y-5">
            {/* 1. Theme Configuration */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  <Globe className="w-4.5 h-4.5 text-amber-500" />
                  <span>تخصيص المظهر (Theme Mode)</span>
                </h4>
                <p className="text-[10px] text-muted-foreground font-semibold">اختر وضع الإضاءة الأنسب لهويتك البصرية.</p>
              </div>

              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    theme === "light" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  نهاري
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    theme === "dark" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  ليلي
                </button>
              </div>
            </div>

            {/* 2. Notification Center Toggle */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  <Bell className="w-4.5 h-4.5 text-amber-500" />
                  <span>إشعارات وتنبيهات النظام</span>
                </h4>
                <p className="text-[10px] text-muted-foreground font-semibold">استقبل تنبيهات عاجلة بخصوص الملتقيات وصندوق التكافل.</p>
              </div>

              <button
                onClick={() => setNotifs(!notifs)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  notifs ? "bg-primary" : "bg-muted"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notifs ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* 3. Data Privacy mask settings */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  <User className="w-4.5 h-4.5 text-amber-500" />
                  <span>حجب رقم الهاتف والبيانات الشخصية</span>
                </h4>
                <p className="text-[10px] text-muted-foreground font-semibold">إخفاء معلومات الاتصال وحجبه للخصوصية في قاعدة البيانات العامة.</p>
              </div>

              <button
                onClick={() => setPrivacy(!privacy)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  privacy ? "bg-primary" : "bg-muted"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* 4. Language preferences selection */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  <Globe className="w-4.5 h-4.5 text-amber-500" />
                  <span>لغة واجهة المستخدم</span>
                </h4>
                <p className="text-[10px] text-muted-foreground font-semibold">اللغة الأساسية لتصفح المنصة الرقمية.</p>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-1.5 bg-background border border-border rounded-lg text-xs font-semibold outline-hidden"
              >
                <option value="ar">العربية (الأولى)</option>
                <option value="en">English (Coming soon)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-extrabold transition-all shadow-xs"
          >
            حفظ وتأكيد الخيارات الشخصية
          </button>
        </div>

        {/* Security disclaimer details */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs font-semibold text-muted-foreground flex gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="leading-relaxed">
            جميع خيارات التفضيلات وحجب الخصوصية والسرية يتم تشفيرها وتخزينها تحت شهادة الأمان المتطورة SSL المعتمدة بموقع السادة الركابية. تضمن المنصة عدم إتاحة أي تفاصيل اتصال دقيقة إلا لأصحاب الصلاحية المحددة إدارياً.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
