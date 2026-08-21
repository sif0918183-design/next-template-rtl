"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminMetricsAction, getPendingPaymentsAction, AdminMetrics } from "@/lib/actions/admin";
import { reviewPaymentReceiptAction, getReceiptSignedUrlAction } from "@/lib/actions/payments";
import { ShieldAlert, Users, CreditCard, HeartHandshake, RefreshCw, CheckCircle2, XCircle, Eye, Lock, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeReceiptId, setActiveReceiptId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const loadAdminData = async () => {
    setIsLoading(true);
    const m = await getAdminMetricsAction();
    const p = await getPendingPaymentsAction();
    setMetrics(m);
    setPayments(p);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "rk_admin_2026_secured") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("رمز المرور غير صحيح. الرجاء إدخال رمز الوصول الإداري الموقت.");
    }
  };

  const handleReview = (receiptId: string, decision: "approve" | "reject") => {
    startTransition(async () => {
      const res = await reviewPaymentReceiptAction(receiptId, decision, rejectionReason);
      if (res.success) {
        alert(res.message);
        setActiveReceiptId(null);
        setRejectionReason("");
        setSelectedReceiptUrl(null);
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handlePreviewReceipt = async (filePath: string) => {
    const signedUrl = await getReceiptSignedUrlAction(filePath);
    if (signedUrl) {
      setSelectedReceiptUrl(signedUrl);
    } else {
      alert("تعذر فتح ملف الإشعار. قد يكون المسار غير صحيح أو يتعذر الوصول للخدمة.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 dir-rtl text-white">
        <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-amber-400">لوحة التحكم والإدارة المؤسسية</h1>
            <p className="text-xs text-slate-400">منصة السادة الركابية - الدائرة المالية والأمانة العامة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">رمز الوصول المعتمد (Admin Security Code)</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل رمز الإدارة الحصري..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {authError && <p className="text-xs text-red-400 font-semibold">{authError}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors text-sm"
            >
              تسجيل الدخول الآمن
            </button>
          </form>
          <div className="p-3 bg-slate-950 rounded-lg text-[11px] text-slate-400 text-center border border-slate-800">
            💡 رمز الدخول التجريبي المعتمد لهذه البيئة: <span className="font-mono text-amber-400">rk_admin_2026_secured</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            النظام المؤسسي - الإدارة العليا للرقابة المالية والعضوية
          </div>
          <h1 className="text-2xl font-bold text-amber-400">لوحة التحكم التنفيذية الشاملة</h1>
        </div>

        <button
          onClick={loadAdminData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-xl text-xs font-semibold text-slate-200 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          تحديث البيانات الحية
        </button>
      </div>

      {/* Dynamic Metrics Cards - Displays EXACT 0 when empty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>إجمالي الأعضاء المسجلين</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {metrics ? metrics.totalMembers : 0}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>نشط: {metrics?.activeMembers || 0}</span>
            <span>قيد المراجعة: {metrics?.pendingMembers || 0}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>إيصالات قيد الانتظار</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {metrics ? metrics.pendingPaymentsCount : 0}
          </div>
          <p className="text-[11px] text-slate-500">تحويلات تتطلب التدقيق المالي</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>إجمالي المبالغ المعتمدة</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-mono font-bold text-blue-400">
            {metrics ? metrics.approvedPaymentsTotal.toLocaleString() : 0} SDG
          </div>
          <p className="text-[11px] text-slate-500">مجموع التحويلات المؤكدة فقط</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>طلبات التكافل الاجتماعي</span>
            <HeartHandshake className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400">
            {metrics ? metrics.socialRequestsCount : 0}
          </div>
          <p className="text-[11px] text-slate-500">حالات مقدمة للدائرة الاجتماعية</p>
        </div>
      </div>

      {/* Payment Receipts Review Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            سجل إيصالات التحويل البنكي للمراجعة والاعتماد
          </h2>
          <span className="text-xs px-3 py-1 bg-slate-800 rounded-full text-slate-400">
            عدد السجلات: {payments.length}
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
            لا توجد إيصالات أو معاملات قيد المراجعة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3">المبلغ (SDG)</th>
                  <th className="p-3">رقم المعاملة</th>
                  <th className="p-3">العضو / مقدم الطلب</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("ar-SD")}
                    </td>
                    <td className="p-3 font-medium">
                      {p.payment_type === "membership" ? "اشتراك عضوية" : "تبرع مساهمة"}
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-slate-300">{p.transaction_reference}</td>
                    <td className="p-3 text-slate-200">
                      {p.members?.full_name || "متبرع / عضو مسجل"}
                    </td>
                    <td className="p-3">
                      {p.status === "approved" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          معتمد
                        </span>
                      ) : p.status === "rejected" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          مرفوض
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          قيد المراجعة
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePreviewReceipt(p.receipt_path)}
                          title="عرض صُورة الإيصال"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {p.status === "pending_review" && (
                          <>
                            <button
                              disabled={isPending}
                              onClick={() => handleReview(p.id, "approve")}
                              title="اعتماد الشفافية والتحويل"
                              className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>

                            <button
                              disabled={isPending}
                              onClick={() => setActiveReceiptId(p.id)}
                              title="رفض الإيصال"
                              className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Rejection Reason */}
      {activeReceiptId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-rose-400">سبب رفض الإشعار المالي:</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="اكتب سبب الرفض المالي (مثال: الإيصال غير واضح أو المبلغ لا يطابق)..."
              className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveReceiptId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                إلغاء
              </button>
              <button
                disabled={isPending || !rejectionReason.trim()}
                onClick={() => handleReview(activeReceiptId, "reject")}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
              >
                تأكيد الرفض المالي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Image Preview */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-amber-400">صورة إشعار التحويل المرفقة (Signed Preview)</h3>
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-950 p-2 rounded-xl border border-slate-800">
              <img src={selectedReceiptUrl} alt="إشعار التحويل" className="max-w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
