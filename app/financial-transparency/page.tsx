import { getApprovedFinancialStatsAction } from "@/lib/actions/finance";
import { ShieldCheck, BarChart3, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function FinancialTransparencyPage() {
  const stats = await getApprovedFinancialStatsAction();

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            منصة الحوكمة والشفافية المالية المعتمدة
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            تقارير الشفافية والإفصاح المالي
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            تلتزم الأمانة العامة والدائرة المالية بمنصة السادة الركابية بأعلى معايير الحوكمة والشفافية. يتم نشر جميع الميزانيات والتقارير المعتمدة بناءً على التحويلات المؤكدة والمفحوصة فقط.
          </p>
        </div>

        {/* Dynamic Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>إجمالي التبرعات المعتمدة</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stats.totalApprovedDonations.toLocaleString()} SDG
            </div>
            <p className="text-[11px] text-slate-500">حساب حقيقي مبني على إيصالات التحويل المقبولة فقط</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>إجمالي اشتراكات العضوية المعتمدة</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {stats.totalApprovedMemberships.toLocaleString()} SDG
            </div>
            <p className="text-[11px] text-slate-500">العضويات المفعلة والمؤكدة مالياً</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>الحملات والمشاريع النشطة</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400">
              {stats.activeCampaignsCount}
            </div>
            <p className="text-[11px] text-slate-500">مشاريع تكافلية وتنموية قائمة</p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs leading-relaxed space-y-2">
          <h3 className="font-bold text-amber-400 text-sm">سياسة الحماية والخصوصية المالية:</h3>
          <p>
            تطبيقاً لقواعد حماية البيانات الشخصية والأعراف المؤسسية، لا يتم إظهار أسماء أو أرقام هواتف المتبرعين أو إيصالاتهم الفردية للعامة، وتقتصر التقارير العامة على المبالغ الكلية المعتمدة.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors inline-block text-xs"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
