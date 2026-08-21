"use client";

import React, { useState, useTransition } from "react";
import { signInAction, signUpAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { Shield, UserPlus, LogIn, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signInAction(formData);
      if (res.success) {
        setSuccessMsg("تم تسجيل الدخول بنجاح! جاري تحويلك...");
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        setErrorMsg(res.error || "فشل تسجيل الدخول.");
      }
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signUpAction(formData);
      if (res.success) {
        setSuccessMsg(res.message || "تم إنشاء الحساب بنجاح!");
        setTimeout(() => {
          setActiveTab("login");
        }, 1500);
      } else {
        setErrorMsg(res.error || "فشل إنشاء الحساب.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 dir-rtl">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 mx-auto flex items-center justify-center text-amber-400">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-amber-400">بوابة الحساب الموحد</h1>
          <p className="text-xs text-slate-400">منصة السادة الركابية الرقمية - جمهورية السودان</p>
        </div>

        {/* Auth Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => { setActiveTab("login"); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "login" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </button>
          <button
            onClick={() => { setActiveTab("signup"); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "signup" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            إنشاء حساب جديد
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">البريد الإلكتروني المسجل</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">كلمة المرور</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors text-xs"
            >
              {isPending ? "جاري التحقق..." : "تسجيل الدخول إلى حسابك"}
            </button>
          </form>
        ) : (
          /* Real Signup Form */
          <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">الاسم رباعياً *</label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="أدخل اسمك رباعياً..."
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">البريد الإلكتروني *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="email@domain.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">رقم الهاتف *</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="0912345678"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">الولاية</label>
                <input
                  name="state"
                  type="text"
                  placeholder="مثال: الخرطوم / نهر النيل"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">المحلية</label>
                <input
                  name="locality"
                  type="text"
                  placeholder="اسم المحلية..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">كلمة المرور (6 أحرف على الأقل) *</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors text-xs"
            >
              {isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب ومستند عضوية جديد"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
