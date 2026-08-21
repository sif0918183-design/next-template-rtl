import { createAdminClient } from "@/lib/supabase/admin";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const supabaseAdmin = createAdminClient();
  const { data: requests } = await supabaseAdmin
    .from("social_requests")
    .select("id, title, category, amount_requested, status, created_at")
    .order("created_at", { ascending: false });

  const requestsList = requests || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <HeartHandshake className="w-4 h-4" />
          خدمات صندوق التكافل والأنشطة الاجتماعية
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          صندوق التكافل والدعم الأسري
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          تقديم الدعم الاجتماعي، الكفالة الطبية والتعليمية وفق معايير الدائرة الاجتماعية.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
          <h2 className="text-base font-bold text-amber-400">تقديم طلب دعم اجتماعي أو كفالة</h2>
          <p className="text-xs text-slate-400">يتطلب تقديم طلب الدعم تسجيل الدخول بحساب موثق لربط المستندات والبيانات الشخصية صاحبة الطلب.</p>
          <div>
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-block">
              تسجيل الدخول لتقديم طلب كفالة
            </Link>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-200 border-r-4 border-amber-500 pr-3">
          طلبات التكافل المقدمة للدائرة الاجتماعية
        </h3>

        {requestsList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <ShieldCheck className="w-8 h-8 text-amber-500/40 mx-auto" />
            <p className="font-bold text-slate-300">لا توجد طلبات دعم اجتماعي أو كفالة مسجلة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requestsList.map((r: any) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-xs">{r.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">{r.category}</span>
                </div>
                <p className="text-xs font-mono text-emerald-400 font-bold">المبلغ المطلوب: {Number(r.amount_requested).toLocaleString()} SDG</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
