import { getCurrentUserAction } from "@/lib/actions/auth";
import { getMemberCardAndReceiptsHistoryAction } from "@/lib/actions/physical-cards";
import { getMonthlyMembershipGoalAction, getMembershipPlansAction } from "@/lib/actions/membership";
import { getPaymentMethodsAction } from "@/lib/actions/payments";
import { UserCheck, Shield, Award, Sparkles, CreditCard, HeartHandshake, FileText, CheckCircle2, Clock, AlertCircle, Calendar, Receipt } from "lucide-react";
import Link from "next/link";
import PhysicalCardRequestModal from "@/components/physical-card-modal";
import ProfileMembershipActions from "@/components/profile-membership-actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userAccount = await getCurrentUserAction();

  if (!userAccount || !userAccount.user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 dir-rtl">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <Shield className="w-12 h-12 text-amber-400 mx-auto" />
          <h1 className="text-lg font-bold text-slate-100">الملف الشخصي والبطاقة الرقمية</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            عذراً، يلزم تسجيل الدخول لعرض معلومات الحساب وبطاقة العضوية الرقمية.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            الانتقال لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const profile = userAccount.profile || {};
  const member = userAccount.member || {};
  const { cardRequests, receipts, subscriptions } = await getMemberCardAndReceiptsHistoryAction();
  const goal = await getMonthlyMembershipGoalAction();
  const plans = await getMembershipPlansAction();
  const bankMethods = await getPaymentMethodsAction();

  const currentPlan = plans.find((p: any) => p.id === member.plan_id) || plans.find((p: any) => p.code === "basic") || plans[0];
  const completionPct = profile.profile_completion_pct || 40;

  const hasPendingPayment = receipts.some((r: any) => r.payment_type === "membership" && r.status === "pending_review");
  const hasActiveSubscription = subscriptions.some((s: any) => s.status === "active") || receipts.some((r: any) => r.payment_type === "membership" && r.status === "approved");

  // Calculate total user contributions
  const totalApprovedContributions = receipts
    .filter((r: any) => r.status === "approved")
    .reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* User Profile Summary Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-2xl">
                {profile.full_name?.charAt(0) || userAccount.user.email?.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">{profile.full_name || "عضو مسجل"}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{userAccount.user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {userAccount.roles?.length ? userAccount.roles.join(", ") : "عضو مسجل"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors"
              >
                تصفح المنصة الشاملة 🌐
              </Link>
              <Link
                href="/profile/complete"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
              >
                تعديل واستكمال الملف ({completionPct}%) ←
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">رقم الهاتف</span>
              <p className="font-semibold text-slate-200">{profile.phone || "غير محدد"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">بلد الإقامة</span>
              <p className="font-semibold text-slate-200">{profile.country_residence || "السودان"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">المهنة</span>
              <p className="font-semibold text-slate-200">{profile.profession || "غير محدد"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">أعضاء الأسرة</span>
              <p className="font-semibold text-slate-200">{profile.family_members_count || 1} أفراد</p>
            </div>
          </div>
        </div>

        {/* Impact & Contributions Section */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-400" /> أثر مساهمتك في مجتمع السادة الركابية
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-400">
              إجمالي المساهمات المعتمدة: {totalApprovedContributions.toLocaleString()} SDG
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            تساهم مشاركاتك العضوية الشهرية بشكل مباشر في تمويل مبادرات صندوق التكافل والخدمات الاجتماعية والتعليمية والصحية لخدمة أبناء المجتمع السوداني.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">حالة الاشتراك الشهري</div>
              <div className="font-bold text-emerald-400 mt-1">{hasActiveSubscription ? "اشتراك شهري مدفوع ومفعل" : hasPendingPayment ? "تم إرسال الدفعية وفي انتظار اعتماد الأدمن" : "المستوى الأساسي (غير إلزامي الدفع)"}</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">عدد العمليات المسجلة</div>
              <div className="font-bold text-amber-400 mt-1">{receipts.length} معاملات</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">هدف العضوية الشهرية</div>
              <div className="font-bold text-blue-400 mt-1">{goal.currentMembersCount} / {goal.targetMembersCount} عضو</div>
            </div>
          </div>

          <ProfileMembershipActions
            currentPlan={currentPlan}
            bankMethods={bankMethods}
            hasPendingPayment={hasPendingPayment}
            hasActiveSubscription={hasActiveSubscription}
          />
        </div>

        {/* Digital Card & Physical Request */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {member.membership_number ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <span className="text-xs font-bold text-amber-400">بطاقة العضوية الرقمية المعتمدة</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-400">رقم العضوية الرسمية</div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400">{member.membership_number}</div>
              </div>
              <div className="pt-2 text-left">
                <Link
                  href={`/verify/${member.membership_number}`}
                  className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  معاينة صفحة التحقق العام ←
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3 flex flex-col justify-center">
              <p className="text-xs text-slate-400">لم يتم إصدار بطاقة عضوية رسمية لهذا الحساب بعد.</p>
              <div>
                <Link href="/membership/select" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-block">
                  اختيار مستوى العضوية والدفع
                </Link>
              </div>
            </div>
          )}

          {/* Physical Card Request Section */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> طلب بطاقة عضوية مادية (اختياري)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                يمكنك طلب بطاقة مادية محمولة تحمل بياناتك وصورتك الشخصية مقابل رسوم استخراج قدرها <span className="text-amber-400 font-bold font-mono">50,000 SDG</span>.
              </p>
            </div>

            <div>
              {member.status === "active" ? (
                <PhysicalCardRequestModal />
              ) : (
                <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] text-slate-500 text-center border border-slate-800">
                  يتطلب طلب البطاقة المادية تفعيل العضوية أولاً.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Subscription Timeline */}
        {subscriptions.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" /> سجل الاشتراكات والفترات الزمنية النشطة
            </h3>
            <div className="space-y-3">
              {subscriptions.map((sub: any) => (
                <div key={sub.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-100">{sub.membership_plans?.name_ar || "عضوية شهرية"}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      الفترة: {sub.start_date} ← {sub.end_date}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {sub.status === "active" ? "نشط ومفعل" : sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Member Payment & Receipts History Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-amber-400" /> سجل المعاملات المالية والإيصالات المرفوعة ({receipts.length})
            </h3>
          </div>

          {receipts.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-500">
              لم تسجل أي معاملات مالية بعد.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">نوع المعاملة</th>
                    <th className="p-3">المبلغ (SDG)</th>
                    <th className="p-3">مرجع التحويل</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {receipts.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">
                        {new Date(r.created_at).toLocaleDateString("ar-SD")}
                      </td>
                      <td className="p-3 font-medium">
                        {r.payment_type === "membership" ? "اشتراك عضوية" : r.payment_type === "physical_card_fee" ? "رسوم بطاقة مادية" : "تبرع مساهمة"}
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-400">
                        {Number(r.amount).toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-slate-300">{r.transaction_reference}</td>
                      <td className="p-3">
                        {r.status === "approved" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            معتمد
                          </span>
                        ) : r.status === "rejected" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            مرفوض
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            قيد المراجعة
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Existing Physical Card Requests Tracker */}
        {cardRequests.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200">سجل طلبات البطاقات المادية</h3>
            <div className="space-y-3">
              {cardRequests.map((req: any) => (
                <div key={req.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-amber-400 font-bold">{req.request_number}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{new Date(req.created_at).toLocaleDateString("ar-SD")}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {req.status === "pending_review" ? "🟡 قيد المراجعة" : req.status === "in_printing" ? "🔵 قيد الطباعة" : req.status === "ready_for_pickup" ? "🟢 جاهزة للتسليم" : req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
