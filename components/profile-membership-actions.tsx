"use client";

import React, { useState } from "react";
import { CreditCard, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import MembershipCheckoutModal from "@/components/membership-checkout-modal";

interface ProfileMembershipActionsProps {
  currentPlan: any;
  bankMethods: any[];
  hasPendingPayment: boolean;
  hasActiveSubscription: boolean;
}

export default function ProfileMembershipActions({
  currentPlan,
  bankMethods,
  hasPendingPayment,
  hasActiveSubscription,
}: ProfileMembershipActionsProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Dynamic Status & Upgrade Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="text-slate-400">مستوى العضوية الحالي:</div>
          <div className="text-base font-bold text-amber-400 mt-0.5">
            {currentPlan?.name_ar || "العضوية الأساسية"}
            <span className="text-xs font-mono font-normal text-slate-400 mr-2">
              ({currentPlan?.price_sdg ? `${Number(currentPlan.price_sdg).toLocaleString()} SDG / شهرياً` : "غير إلزامي الدفع"})
            </span>
          </div>
          {hasActiveSubscription && (
            <div className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> اشتراك شهري مدفوع ومفعل
            </div>
          )}
          {hasPendingPayment && !hasActiveSubscription && (
            <div className="text-amber-400 text-[11px] font-semibold flex items-center gap-1 mt-1">
              🟡 تم إرسال الدفعية وفي انتظار اعتماد الأدمن
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <CreditCard className="w-4 h-4" /> دفع الاشتراك الشهري
          </button>
          <Link
            href="/membership/select"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <ArrowUpCircle className="w-4 h-4 text-amber-400" /> ترقية مستوى العضوية
          </Link>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <MembershipCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          plan={currentPlan || { name_ar: "العضوية الرسمية", price_sdg: 10000 }}
          bankMethods={bankMethods}
        />
      )}
    </div>
  );
}
