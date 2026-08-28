"use client";

import React, { useState, useTransition } from "react";
import { submitPhysicalCardRequestAction } from "@/lib/actions/physical-cards";
import { CreditCard, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function PhysicalCardRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("حجم الصورة يتجاوز الحد المسموح به (5 ميجابايت).");
        return;
      }
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("feeSdg", "50000");

    startTransition(async () => {
      const res = await submitPhysicalCardRequestAction(formData);
      if (res.success) {
        setSuccessMsg(res.message || "تم إرسال طلب البطاقة المادية بنجاح!");
        setTimeout(() => {
          setIsOpen(false);
          setPhotoPreview(null);
          setSuccessMsg("");
        }, 1500);
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء تقديم الطلب.");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
      >
        <CreditCard className="w-4 h-4" /> طلب بطاقة عضوية مادية (50,000 SDG)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl text-white">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xs font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-right space-y-1">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> استخراج بطاقة عضوية مادية
              </h3>
              <p className="text-[11px] text-slate-400">
                يرجى رفع صورة شخصية حديثة وإدخال مرجع تحويل رسوم الاستخراج (50,000 SDG).
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">رقم العملية / مرجع تحويل الرسوم (50,000 SDG) *</label>
                <input
                  name="transactionRef"
                  type="text"
                  required
                  placeholder="أدخل رقم عملية التحويل..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">الصورة الشخصية (JPG, PNG, WEBP) *</label>
                <input
                  name="photoFile"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePhotoChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs"
                />
              </div>

              {photoPreview && (
                <div className="flex justify-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <img src={photoPreview} alt="معاينة الصورة" className="w-24 h-28 object-cover rounded-lg border border-amber-500/30" />
                </div>
              )}

              <div className="flex justify-end gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs"
                >
                  {isPending ? "جاري الإرسال..." : "تأكيد وتقديم الطلب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
