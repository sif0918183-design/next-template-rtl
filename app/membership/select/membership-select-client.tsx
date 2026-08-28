"use client";

import React, { useState, useTransition } from "react";
import { Award, HeartHandshake, Check, Sparkles } from "lucide-react";
import MembershipCheckoutModal from "@/components/membership-checkout-modal";
import { selectUserMembershipPlanAction } from "@/lib/actions/membership";
import { useRouter } from "next/navigation";

interface MembershipSelectClientProps {
  plans: any[];
  goal: any;
  bankMethods: any[];
}

export default function MembershipSelectClient({
  plans,
  goal,
  bankMethods,
}: MembershipSelectClientProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectFreePlan = (planId: string) => {
    startTransition(async () => {
      const res = await selectUserMembershipPlanAction(planId);
      if (res.success) {
        alert(res.message);
        router.push("/profile");
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <HeartHandshake className="w-4 h-4" />
          أثر مساهمتك في بناء واستدامة أعمال الركابية
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          اختر مستوى المساهمة الشهرية
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          جميع مستويات العضوية محل تقدير واعتزاز بالغ. تساهم اشتراكات الأعضاء مباشرة في كفالة الأيتام، التكافل الاجتماعي، دعم الطلاب، والرعاية الصحية. الترقية إلى مستويات أعلى مساهمة اختيارية.
        </p>
      </div>

      {/* Goal Impact Progress Bar */}
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> هدف العضوية هذا الشهر: {goal.description}
          </span>
          <span className="font-mono text-emerald-400">
            {goal.currentMembersCount} / {goal.targetMembersCount} عضو ({goal.percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${goal.percentage}%` }}
          />
        </div>
      </div>

      {/* Plans Selection Grid */}
      {plans.length === 0 ? (
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center space-y-3">
          <Award className="w-10 h-10 text-amber-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-200">لا توجد مستويات عضوية معرفة حالياً في قاعدة البيانات</h3>
          <p className="text-xs text-slate-400">
            يمكن للمدير إضافة مستويات العضوية وتحديد أسعارها واشتراكاتها من لوحة الإدارة.
          </p>
        </div>
      ) : (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p: any) => {
          const isRecommended = p.is_recommended || p.code === "supporting";
          const isFree = Number(p.price_sdg) === 0 || p.is_payment_required === false;
          const featuresList = typeof p.features === "string" ? JSON.parse(p.features) : (p.features || []);

          return (
            <div
              key={p.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-200 ${
                isRecommended
                  ? "bg-slate-900 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-105"
                  : "bg-slate-900/80 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                  موصى به لدعم المبادرات
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-100">{p.name_ar}</h3>
                  <Award className={`w-6 h-6 ${isRecommended ? "text-amber-400" : "text-slate-500"}`} />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{p.description}</p>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-3xl font-mono font-extrabold text-amber-400">
                    {Number(p.price_sdg).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mr-1.5">جنيه سوداني / شهرياً</span>
                  {isFree && (
                    <span className="block text-[11px] text-emerald-400 font-semibold mt-1">
                      ✨ دفع الاشتراك الشهري في هذا المستوى غير إلزامي
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-300 block">مميزات ومساهمة المستوى:</span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {featuresList.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {isFree ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSelectFreePlan(p.id)}
                  className="w-full py-3 rounded-xl font-bold text-xs text-center transition-colors bg-emerald-600 hover:bg-emerald-500 text-white block"
                >
                  {isPending ? "جاري الاعتماد..." : "اختيار المستوى الأول (غير إلزامي الدفع) ←"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedPlan(p)}
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-colors block ${
                    isRecommended
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  اختيار ورفع إشعار الدفع ←
                </button>
              )}
            </div>
          );
        })}
      </div>
      )}

      <div className="max-w-2xl mx-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 text-center leading-relaxed">
        💡 تنبيه السياسة المالية: دفع الاشتراك الشهري غير إلزامي في المستوى الأول. أما بقية المستويات المدفوعة، في حال عدم سداد الاشتراك لمدة <span className="text-amber-400 font-bold">شهرين متتاليين</span> يتم تحويل العضو تلقائياً للمستوى الأدنى. تأكيد واعتماد كافة عمليات الدفع يتم حصراً عبر لوحة الإدارة.
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <MembershipCheckoutModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
          bankMethods={bankMethods}
        />
      )}
    </div>
  );
}
