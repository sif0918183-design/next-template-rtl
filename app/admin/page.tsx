"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getAdminMetricsAction, getPendingPaymentsAction, getAllMembersAdminAction, AdminMetrics } from "@/lib/actions/admin";
import { reviewPaymentReceiptAction, getReceiptSignedUrlAction, getPaymentMethodsAction, savePaymentMethodAction } from "@/lib/actions/payments";
import { getNewsAction, saveNewsAction, deleteNewsAction, getMediaAction, saveMediaAction, deleteMediaAction, getLeadershipAction, saveLeadershipAction, deleteLeadershipAction, getFamiliesAction, saveFamilyAction } from "@/lib/actions/cms";
import { getCurrentUserAction, signInAction, changeAdminPasswordAction } from "@/lib/actions/auth";
import { getAdminPhysicalCardRequestsAction, reviewPhysicalCardRequestAction } from "@/lib/actions/physical-cards";
import { updateMembershipPlanAction, setMonthlyMembershipGoalAction, getMembershipPlansAction, getMonthlyMembershipGoalAction } from "@/lib/actions/membership";
import { ShieldAlert, Users, CreditCard, HeartHandshake, RefreshCw, CheckCircle2, XCircle, Eye, Lock, FileText, Image as ImageIcon, BookOpen, Plus, Trash2, ShieldCheck, KeyRound, AlertCircle, Award, Target } from "lucide-react";

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "members" | "payments" | "banks" | "news" | "media" | "leadership" | "families" | "plans" | "cards" | "security">("overview");

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [bankMethods, setBankMethods] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [leadershipList, setLeadershipList] = useState<any[]>([]);
  const [familiesList, setFamiliesList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [cardRequests, setCardRequests] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [goalData, setGoalData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeReceiptId, setActiveReceiptId] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isPending, startTransition] = useTransition();

  const checkAuth = async () => {
    setIsAuthLoading(true);
    const userRes = await getCurrentUserAction();
    setCurrentUser(userRes);
    setIsAuthLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    const m = await getAdminMetricsAction();
    const p = await getPendingPaymentsAction();
    const bm = await getPaymentMethodsAction();
    const n = await getNewsAction();
    const med = await getMediaAction();
    const l = await getLeadershipAction();
    const f = await getFamiliesAction();
    const mems = await getAllMembersAdminAction();
    const cr = await getAdminPhysicalCardRequestsAction();
    const pl = await getMembershipPlansAction();
    const g = await getMonthlyMembershipGoalAction();

    setMetrics(m);
    setPayments(p);
    setBankMethods(bm);
    setNewsList(n);
    setMediaList(med);
    setLeadershipList(l);
    setFamiliesList(f);
    setMembersList(mems);
    setCardRequests(cr);
    setPlans(pl);
    setGoalData(g);
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      loadAdminData();
    }
  }, [currentUser]);

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signInAction(formData);
      if (res.success) {
        await checkAuth();
      } else {
        setLoginError(res.error || "فشل تسجيل الدخول كمدير للنظام.");
      }
    });
  };

  const handleSaveBankMethod = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await savePaymentMethodAction(formData);
      if (res.success) {
        alert(res.message);
        (e.target as HTMLFormElement).reset();
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    startTransition(async () => {
      const res = await changeAdminPasswordAction(newPassword);
      if (res.success) {
        setPasswordMsg(res.message || "تم تحديث كلمة المرور بنجاح.");
        setNewPassword("");
      } else {
        setPasswordError(res.error || "فشل تحديث كلمة المرور.");
      }
    });
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

  const handleReviewCard = (requestId: string, status: string) => {
    startTransition(async () => {
      const res = await reviewPhysicalCardRequestAction(requestId, status);
      if (res.success) {
        alert(res.message);
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handleUpdatePlan = (planId: string, nameAr: string, priceSdg: number, isRecommended: boolean) => {
    startTransition(async () => {
      const res = await updateMembershipPlanAction(planId, nameAr, priceSdg, isRecommended);
      if (res.success) {
        alert(res.message);
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handleSetGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const targetCount = parseInt(formData.get("targetCount") as string, 10);
    const description = formData.get("description") as string;

    startTransition(async () => {
      const res = await setMonthlyMembershipGoalAction(targetCount, description);
      if (res.success) {
        alert(res.message);
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

  const handleSaveNews = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveNewsAction(formData);
      if (res.success) {
        alert(res.message);
        (e.target as HTMLFormElement).reset();
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteNews = (id: string) => {
    if (!confirm("هل أنت تأكد من حذف هذا الخبر؟")) return;
    startTransition(async () => {
      const res = await deleteNewsAction(id);
      if (res.success) loadAdminData();
    });
  };

  const handleSaveMedia = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveMediaAction(formData);
      if (res.success) {
        alert(res.message);
        (e.target as HTMLFormElement).reset();
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteMedia = (id: string) => {
    if (!confirm("هل أنت تأكد من حذف هذه المادة؟")) return;
    startTransition(async () => {
      const res = await deleteMediaAction(id);
      if (res.success) loadAdminData();
    });
  };

  const handleSaveLeadership = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveLeadershipAction(formData);
      if (res.success) {
        alert(res.message);
        (e.target as HTMLFormElement).reset();
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteLeadership = (id: string) => {
    if (!confirm("هل أنت تأكد من حذف العضو القيادي؟")) return;
    startTransition(async () => {
      const res = await deleteLeadershipAction(id);
      if (res.success) loadAdminData();
    });
  };

  const handleSaveFamily = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveFamilyAction(formData);
      if (res.success) {
        alert(res.message);
        (e.target as HTMLFormElement).reset();
        loadAdminData();
      } else {
        alert(res.error);
      }
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white dir-rtl">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">جاري التحقق من الصلاحيات الإدارية...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 dir-rtl text-white">
        <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 mx-auto flex items-center justify-center text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-amber-400">تسجيل الدخول للوحة الإدارة والتحكم</h1>
            <p className="text-xs text-slate-400">منصة السادة الركابية - الأمانة العامة</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">البريد الإلكتروني للمدير</label>
              <input
                name="email"
                type="email"
                required
                defaultValue="mosabkry@gmail.com"
                placeholder="أدخل البريد الإلكتروني للمدير..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">كلمة المرور (Default: 12345678)</label>
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
              {isPending ? "جاري التحقق من الصلاحيات..." : "تسجيل الدخول إلى لوحة التحكم"}
            </button>
          </form>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
            🔒 كلمة المرور الافتراضية للبدء هي: <span className="font-mono text-amber-400 font-bold">12345678</span> (يمكنك تعديلها لاحقاً من داخل اللوحة).
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
            نظام إدارة المحتوى المؤسسي (Central Institutional CMS)
          </div>
          <h1 className="text-2xl font-bold text-amber-400">لوحة التحكم التنفيذية الشاملة</h1>
        </div>

        <button
          onClick={loadAdminData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-xl text-xs font-semibold text-slate-200 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          مزامنة المحتوى وقاعدة البيانات
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "overview" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <Users className="w-4 h-4" /> الإحصائيات العامة
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "members" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <Users className="w-4 h-4" /> أعضاء المنصة ({membersList.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "payments" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <CreditCard className="w-4 h-4" /> المراجعة المالية ({metrics?.pendingPaymentsCount || 0})
        </button>
        <button
          onClick={() => setActiveTab("banks")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "banks" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <CreditCard className="w-4 h-4" /> الحسابات البنكية ({bankMethods.length})
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "plans" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <Award className="w-4 h-4" /> خطط وأهداف العضوية
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "cards" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <CreditCard className="w-4 h-4" /> البطاقات المادية ({cardRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("news")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "news" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <FileText className="w-4 h-4" /> الأخبار والبيانات ({newsList.length})
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "media" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <ImageIcon className="w-4 h-4" /> معرض الوسائط ({mediaList.length})
        </button>
        <button
          onClick={() => setActiveTab("leadership")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "leadership" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <ShieldCheck className="w-4 h-4" /> الهيئة القيادية ({leadershipList.length})
        </button>
        <button
          onClick={() => setActiveTab("families")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "families" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <BookOpen className="w-4 h-4" /> سجل الأسر والنسب ({familiesList.length})
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "security" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          <KeyRound className="w-4 h-4" /> كلمة المرور
        </button>
      </div>

      {/* MEMBERS TAB */}
      {activeTab === "members" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              سجل أعضاء السادة الركابية المحدث تلقائياً ({membersList.length})
            </h2>
          </div>

          {membersList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
              لا يوجد أعضاء مسجلون بعد.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">اسم العضو</th>
                    <th className="p-3">رقم الهاتف</th>
                    <th className="p-3">الواتساب</th>
                    <th className="p-3">الولاية / المحلية</th>
                    <th className="p-3">الفرع والعائلة</th>
                    <th className="p-3">المهنة والمؤهل</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {membersList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-slate-100">{m.full_name}</td>
                      <td className="p-3 font-mono text-slate-300">{m.phone || "غير محدد"}</td>
                      <td className="p-3 font-mono text-emerald-400">{m.whatsapp || "غير محدد"}</td>
                      <td className="p-3">{m.state} - {m.locality}</td>
                      <td className="p-3">{m.family || "-"} ({m.branch || "-"})</td>
                      <td className="p-3">{m.occupation || "-"} / {m.education || "-"}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          m.status === "active" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          {m.status === "active" ? "نشط" : "قيد المراجعة"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
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
              <span>طلبات البطاقات المادية</span>
              <Award className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-rose-400">
              {cardRequests.length}
            </div>
            <p className="text-[11px] text-slate-500">مقدمة لاستخراج بطاقة بلاستيكية</p>
          </div>
        </div>
      )}

      {/* PLANS & GOALS CMS TAB */}
      {activeTab === "plans" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> تعيين هدف العضوية الشهرية
            </h3>
            <form onSubmit={handleSetGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">العدد المستهدف من الأعضاء *</label>
                <input name="targetCount" type="number" defaultValue={goalData?.targetMembersCount || 1000} required className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">وصف الهدف أو الشعار *</label>
                <input name="description" defaultValue={goalData?.description || "هدفنا هذا الشهر لمواصلة الدعم والتكافل"} required className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl">
                تأكيد وحفظ الهدف
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">إدارة مستويات العضوية والاشتراكات ({plans.length})</h3>
            <div className="space-y-3">
              {plans.map((p) => (
                <div key={p.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-100">{p.name_ar}</div>
                    <div className="text-amber-400 font-mono font-bold mt-1">{Number(p.price_sdg).toLocaleString()} SDG / شهرياً</div>
                  </div>
                  <button
                    onClick={() => {
                      const newPrice = prompt(`أدخل السعر الشهري الجديد لخطة (${p.name_ar}):`, p.price_sdg);
                      if (newPrice && !isNaN(parseFloat(newPrice))) {
                        handleUpdatePlan(p.id, p.name_ar, parseFloat(newPrice), p.is_recommended);
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-bold transition-colors self-start sm:self-auto"
                  >
                    تعديل السعر الشهري
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHYSICAL CARDS CMS TAB */}
      {activeTab === "cards" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              طلبات استخراج بطاقات العضوية المادية ({cardRequests.length})
            </h2>
          </div>

          {cardRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
              لا توجد طلبات بطاقات مادية حالياً في قاعدة البيانات.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">رقم الطلب</th>
                    <th className="p-3">اسم العضو</th>
                    <th className="p-3">رقم العضوية</th>
                    <th className="p-3">الرسوم (SDG)</th>
                    <th className="p-3">الحالة الحالية</th>
                    <th className="p-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {cardRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-amber-400">{req.request_number}</td>
                      <td className="p-3 font-bold text-slate-100">{req.members?.full_name || "عضو مسجل"}</td>
                      <td className="p-3 font-mono">{req.members?.membership_number}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{Number(req.fee_sdg).toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleReviewCard(req.id, "in_printing")}
                            className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-500/40 text-blue-300 rounded-lg text-[10px]"
                          >
                            قيد الطباعة
                          </button>
                          <button
                            onClick={() => handleReviewCard(req.id, "ready_for_pickup")}
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px]"
                          >
                            جاهزة للتسليم
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === "security" && (
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <KeyRound className="w-5 h-5" /> تغيير كلمة المرور الخاصة بحساب المدير
          </h3>

          {passwordMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">كلمة المرور الجديدة (6 أحرف على الأقل)</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !newPassword}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
            >
              تأكيد وحفظ كلمة المرور الجديدة
            </button>
          </form>
        </div>
      )}

      {/* BANK ACCOUNTS TAB */}
      {activeTab === "banks" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> إضافة حساب بنكي للمساهمات
            </h3>
            <form onSubmit={handleSaveBankMethod} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">اسم البنك / المزود *</label>
                <input name="provider" required placeholder="مثال: بنك الخرطوم (بنكك)" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">اسم صاحب الحساب المعني *</label>
                <input name="accountName" required placeholder="اسم الحساب..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">رقم الحساب البنكي / رقم التحويل *</label>
                <input name="accountNumber" required placeholder="رقم الحساب..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">تعليمات التحويل (اختياري)</label>
                <input name="instructions" placeholder="تعليمات إضافية للمتبرع..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl">
                إضافة الحساب فوراً
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">الحسابات البنكية المعتمدة حالياً ({bankMethods.length})</h3>
            {bankMethods.length === 0 ? (
              <p className="text-xs text-slate-500">لا توجد حسابات بنكية مضافة حالياً في قاعدة البيانات.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bankMethods.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="font-bold text-amber-400 text-sm">{b.provider || b.name}</div>
                    <div className="text-slate-200">صاحب الحساب: <span className="font-semibold text-slate-100">{b.account_name}</span></div>
                    <div className="text-emerald-400 font-mono font-bold text-sm">{b.account_number}</div>
                    {b.instructions && <div className="text-[10px] text-slate-400">{b.instructions}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === "payments" && (
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
                                title="اعتماد التحويل"
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
      )}

      {/* NEWS CMS TAB */}
      {activeTab === "news" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> إضافة/نشر خبر جديد
            </h3>
            <form onSubmit={handleSaveNews} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">عنوان الخبر الرئيسي *</label>
                <input name="title" required placeholder="عنوان الخبر..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">الموجز التنفيذي</label>
                <input name="excerpt" placeholder="موجز عن الخبر..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">نص الخبر الكامل *</label>
                <textarea name="content" required rows={4} placeholder="تفاصيل الخبر..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">رابط الصورة البارزة (URL)</label>
                <input name="featuredImage" placeholder="https://..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400" />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors">
                نشر الخبر فوراً
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">الأخبار والبيانات المنشورة ({newsList.length})</h3>
            {newsList.length === 0 ? (
              <p className="text-xs text-slate-500">لا توجد أخبار منشورة حالياً في قاعدة البيانات.</p>
            ) : (
              <div className="space-y-3">
                {newsList.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-100">{n.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{new Date(n.created_at).toLocaleDateString("ar-SD")}</div>
                    </div>
                    <button onClick={() => handleDeleteNews(n.id)} className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEDIA CMS TAB */}
      {activeTab === "media" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> إضافة مادة لمعرض الوسائط
            </h3>
            <form onSubmit={handleSaveMedia} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">نوع المادة</label>
                <select name="mediaType" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white">
                  <option value="photo">صورة توثيقية</option>
                  <option value="video">فيديو وثائقي</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">العنوان *</label>
                <input name="title" required placeholder="عنوان المادة..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">رابط الصورة/الفيديو (URL) *</label>
                <input name="url" required placeholder="https://..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl">
                حفظ في المعرض
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">مواد المعرض الرقمي ({mediaList.length})</h3>
            {mediaList.length === 0 ? (
              <p className="text-xs text-slate-500">لا توجد وسائط مضافة حالياً في قاعدة البيانات.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mediaList.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{m.title}</div>
                      <div className="text-[10px] text-amber-400">{m.media_type === "photo" ? "صورة" : "فيديو"}</div>
                    </div>
                    <button onClick={() => handleDeleteMedia(m.id)} className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEADERSHIP CMS TAB */}
      {activeTab === "leadership" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> إضافة عضو للهيئة القيادية
            </h3>
            <form onSubmit={handleSaveLeadership} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">الاسم الكامل *</label>
                <input name="fullName" required placeholder="الاسم رباعياً..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">المنصب القيادي *</label>
                <input name="roleTitle" required placeholder="مثال: رئيس المجلس / الأمين العام..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl">
                إضافة العضو القيادي
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">أعضاء الهيئة القيادية المعتمدون ({leadershipList.length})</h3>
            {leadershipList.length === 0 ? (
              <p className="text-xs text-slate-500">سيتم الإعلان عن أعضاء القيادة فور اعتمادهم في قاعدة البيانات.</p>
            ) : (
              <div className="space-y-3">
                {leadershipList.map((l) => (
                  <div key={l.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-100">{l.full_name}</div>
                      <div className="text-[11px] text-amber-400">{l.role_title}</div>
                    </div>
                    <button onClick={() => handleDeleteLeadership(l.id)} className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAMILIES CMS TAB */}
      {activeTab === "families" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> إدخال أسرة/عائلة جديدة
            </h3>
            <form onSubmit={handleSaveFamily} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">اسم الأسرة / الفخذ *</label>
                <input name="nameAr" required placeholder="اسم الأسرة..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">المنشأ التاريخي والمحلية</label>
                <input name="locality" placeholder="المحلية / الولاية..." className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl">
                اعتماد الأسرة في النسب
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">سجل الأسر الموثقة ({familiesList.length})</h3>
            {familiesList.length === 0 ? (
              <p className="text-xs text-slate-500">لا توجد أسر مسجلة حالياً في قاعدة البيانات.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {familiesList.map((f) => (
                  <div key={f.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <div className="font-bold text-slate-100">{f.name_ar}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{f.main_locality || "السودان"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Rejection Reason */}
      {activeReceiptId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-rose-400">سبب رفض الإشعار المالي:</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="اكتب سبب الرفض المالي..."
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
