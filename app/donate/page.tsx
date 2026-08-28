"use client";

import React, { useState, useTransition } from "react";
import { submitPaymentReceiptAction } from "@/lib/actions/payments";
import { Heart, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function DonatePage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("paymentType", "donation");

    startTransition(async () => {
      const res = await submitPaymentReceiptAction(formData);
      if (res.success) {
        setSuccessMsg(res.message || "تم إرسال إشعار التبرع بنجاح!");
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء تقديم التبرع.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">المساهمة والتبرع للمشاريع التكافلية</h1>
          <p className="text-xs text-slate-400">
            يمكنك المساهمة كزائر (بدون تسجيل دخول) عن طريق تحويل المبلغ ورفع إشعار التحويل المالي للمراجعة.
          </p>
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
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> طرق التحويل المعتمدة:
            </div>
            <p className="text-slate-300">
              بنكك - بنك الخرطوم | أوكاش - أمدرمان الوطني | فوري - الفيصل الإسلامي
            </p>
            <p className="text-[11px] text-slate-500">
              يرجى تحويل المبلغ وحفظ رقم مرجع التحويل وصورة الإشعار لرفعها أدناه.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">مبلغ التبرع (SDG) *</label>
              <input
                name="amount"
                type="number"
                required
                min={100}
                placeholder="أدخل المبلغ بالجنيه السوداني..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
              />
            </div>


            <div>
              <label className="block text-slate-300 mb-1 font-semibold">صورة إشعار التحويل (JPG, PNG, WEBP) *</label>
              <input
                name="receiptFile"
                type="file"
                accept="image/*,application/pdf"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">ملاحظات أو توجيه التبرع (اختياري)</label>
              <textarea
                name="notes"
                rows={2}
                placeholder="مثال: تبرع لصندوق الطلاب / كفالة أيتام..."
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors text-xs"
            >
              {isPending ? "جاري رفع إشعار التبرع..." : "إرسال إشعار التبرع للمراجعة المالية"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
