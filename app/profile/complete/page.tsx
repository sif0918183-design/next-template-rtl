"use client";

import React, { useState, useTransition } from "react";
import { updateProfileCompletionAction } from "@/lib/actions/membership";
import { useRouter } from "next/navigation";
import { UserCheck, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProfileCompletionAction(formData);
      if (res.success) {
        setSuccessMsg(res.message || "تم استكمال بيانات الملف التعريفي بنجاح!");
        setTimeout(() => {
          router.push("/membership/select");
        }, 1200);
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء حفظ البيانات.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 mx-auto flex items-center justify-center text-amber-400">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">أكمل ملفك التعريفي</h1>
          <p className="text-xs text-slate-400">
            خطوة واحدة للوصول إلى 100% واختيار مستوى العضوية المعتمد
          </p>
        </div>

        {/* Progress Score Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" /> نسبة اكتمال الملف الشخصي
            </span>
            <span className="font-mono text-emerald-400">اكتمال الملف 40% ← 100%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-[60%]" />
          </div>
        </div>

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

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">تاريخ الميلاد *</label>
                <input
                  name="birthDate"
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">مكان الميلاد *</label>
                <input
                  name="birthPlace"
                  type="text"
                  required
                  placeholder="المدينة / الولاية..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">بلد الإقامة الحالي *</label>
                <input
                  name="countryResidence"
                  type="text"
                  required
                  defaultValue="السودان"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">أعلى مؤهل أكاديمي</label>
                <input
                  name="qualification"
                  type="text"
                  placeholder="بكالوريوس / ماجستير / دبلوم..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">التخصص / المجال</label>
                <input
                  name="specialization"
                  type="text"
                  placeholder="هندسة / طب / تعليم..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">المهنة الحالية</label>
                <input
                  name="profession"
                  type="text"
                  placeholder="الوظيفة..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">الحالة الاجتماعية</label>
                <select name="maritalStatus" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400">
                  <option value="أعزب">أعزب / عزباء</option>
                  <option value="متزوج">متزوج / متزوجة</option>
                  <option value="غير ذلك">غير ذلك</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">عدد أفراد الأسرة</label>
                <input
                  name="familyMembersCount"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors text-xs"
            >
              {isPending ? "جاري حفظ البيانات..." : "حفظ والتأطير لاختيار مستوى العضوية ←"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
