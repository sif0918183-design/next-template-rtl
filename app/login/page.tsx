"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Phone, Mail, ShieldAlert, CheckCircle, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [method, setMethod] = useState<"phone" | "email" | "nationalId">("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("الرجاء إدخال الحقلين لإكمال عملية التحقق.");
      return;
    }

    // Simple simulated authentication success
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full text-right space-y-6 relative overflow-hidden">
          {/* Top visual accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800" />

          {/* Logo badge */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-amber-400 flex items-center justify-center text-primary font-extrabold text-xl shadow-md">
              ر
            </div>
            <h2 className="text-xl font-extrabold text-foreground">تسجيل الدخول للمنصة الرقمية</h2>
            <p className="text-xs text-muted-foreground font-semibold max-w-[280px]">
              ادخل حسابك لمشاهدة بطاقتك الرقمية الرسمية وتعديل بيانات شجرة نسب عائلتك.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-4 text-center">
              <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-12 h-12 animate-bounce" />
              </div>
              <h3 className="font-extrabold text-foreground text-base">تم التحقق بنجاح</h3>
              <p className="text-xs text-muted-foreground font-semibold">
                مرحباً بك مجدداً في الديوان الرقمي للسادة الركابية. يمكنك الآن تصفح كافة الصلاحيات والبيانات الحساسة.
              </p>
              <Link
                href="/profile"
                className="inline-block px-5 py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-bold transition-all w-full"
              >
                الانتقال للملف الشخصي والبطاقة الرقمية
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login Method Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setMethod("phone"); setIdentifier(""); }}
                  className={`py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${
                    method === "phone"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  رقم الهاتف
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod("email"); setIdentifier(""); }}
                  className={`py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${
                    method === "email"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  البريد الإلكتروني
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod("nationalId"); setIdentifier(""); }}
                  className={`py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${
                    method === "nationalId"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  الرقم الوطني
                </button>
              </div>

              {/* Dynamic Input Placeholder */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {method === "phone" && "رقم الهاتف المحمول (مع رمز الدولة)"}
                  {method === "email" && "عنوان البريد الإلكتروني"}
                  {method === "nationalId" && "الرقم الوطني المكون من 11 رقم"}
                </label>
                <input
                  type={method === "email" ? "email" : "text"}
                  required
                  placeholder={
                    method === "phone"
                      ? "مثال: 249912345678"
                      : method === "email"
                      ? "example@alrikabiyyah.org"
                      : "101XXXXXXXX"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">كلمة المرور / الرمز السري</label>
                  <a href="#" className="text-[10px] text-primary hover:underline font-semibold">هل نسيت كلمة المرور؟</a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              {/* Form Validation Errors */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Trigger */}
              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                تحقق ودخول للمنصة
              </button>

              {/* Security info disclaimer */}
              <div className="border-t border-border pt-3 mt-4 text-[10px] text-muted-foreground text-center font-medium leading-relaxed">
                هذه البوابة تخضع لنظام الحماية والأمن المتطور المعتمد بالمجلس الأعلى للركابية. لن يتم مشاركة بيانات هويتك الشخصية لأي جهة خارجية.
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
