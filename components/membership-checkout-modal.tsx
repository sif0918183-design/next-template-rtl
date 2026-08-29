"use client";

import React, { useState, useTransition } from "react";
import { submitPaymentReceiptAction } from "@/lib/actions/payments";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, AlertCircle, X, Upload, ShieldCheck } from "lucide-react";

interface MembershipCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: {
    id?: string;
    name_ar?: string;
    price_sdg?: number;
  };
  bankMethods: Array<{
    id: string;
    provider: string;
    account_name: string;
    account_number: string;
    instructions?: string;
  }>;
}

export default function MembershipCheckoutModal({
  isOpen,
  onClose,
  plan,
  bankMethods,
}: MembershipCheckoutModalProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const [customAmount, setCustomAmount] = useState<number>(plan?.price_sdg || 10000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("paymentType", "membership");

    startTransition(async () => {
      const res = await submitPaymentReceiptAction(formData);
      if (res.success) {
        setSuccessMsg("تم إرسال الدفعية بنجاح وفي انتظار اعتماد الأدمن! جاري تحديث لوحة العضو...");
        setTimeout(() => {
          onClose();
          router.push("/profile");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء رفع إشعار الدفع.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-center sm:text-right">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
            دفع الاشتراك الشهري
          </span>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            دفع اشتراك: <span className="text-emerald-400">{plan?.name_ar || "العضوية الرسمية"}</span>
          </h2>
        </div>

        {/* Bank Transfer Details Section */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> الحسابات البنكية المعتمدة للتحويل:
          </div>

          {bankMethods.length === 0 ? (
            <div className="p-3 bg-slate-900/60 rounded-lg text-slate-400 text-center">
              بنك الخرطوم (بنكك): <span className="font-mono text-emerald-400 font-bold">1234567</span> | باسم: السادة الركابية
            </div>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {bankMethods.map((b) => (
                <div key={b.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200">{b.provider || b.account_name}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">صاحب الحساب: {b.account_name}</span>
                    <span className="font-mono font-bold text-emerald-400">{b.account_number}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <label className="block text-slate-300 mb-1 font-semibold">
              مبلغ الاشتراك المحول (SDG) *
            </label>
            <input
              name="amount"
              type="number"
              min="1"
              required
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              صورة إشعار التحويل البنكي (JPG, PNG, WEBP) *
            </label>
            <input
              name="receiptFile"
              type="file"
              accept="image/*,application/pdf"
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">ملاحظات إضافية (اختياري)</label>
            <input
              name="notes"
              type="text"
              placeholder="أي ملاحظات بخصوص التحويل..."
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              {isPending ? "جاري رفع الإشعار..." : "تأكيد ورفع الإشعار ←"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
