import Link from "next/link";
import { Award, Shield, Users, BookOpen, HeartHandshake, MapPin, Building2 } from "lucide-react";
import { getPublicSiteStatsAction } from "@/lib/actions/public-stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const publicStats = await getPublicSiteStatsAction();

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            البوابة الرقمية الموحدة للسادة الركابية في السودان
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
            أصالة تحفظ التاريخ، ومؤسسة تبني المستقبل
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            المنصة والديوان الرقمي الرسمي الجامع لأبناء السادة الركابية في جمهورية السودان وخارجها. نافذة تواصلية ومؤسسية تعنى بشجرة الأنساب الموثقة، السجل المدني والمهني، والخدمات الاجتماعية والتكافلية المتكاملة.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              انضم إلى المنصة
            </Link>
            <Link
              href="/donate"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors border border-emerald-500/40"
            >
              ساهم الآن
            </Link>
            <Link
              href="/genealogy"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              اكتشف النسب
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Production Statistics Grid (Zero Fallback if DB Empty) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1">
              الإحصائيات الرسمية الحية (Database Verified)
            </h2>
            <p className="text-slate-400 text-xs">بيانات حقيقية مستمدة مباشرة من قاعدة بيانات المنصة</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <Users className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="text-2xl font-mono font-bold text-slate-100">
                {publicStats.totalActiveMembers}
              </div>
              <div className="text-xs text-slate-400 font-medium">أعضاء موثقون</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <Building2 className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-2xl font-mono font-bold text-slate-100">
                {publicStats.totalApprovedDonations.toLocaleString()} SDG
              </div>
              <div className="text-xs text-slate-400 font-medium">تبرعات معتمدة</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <HeartHandshake className="w-6 h-6 text-rose-400 mx-auto" />
              <div className="text-2xl font-mono font-bold text-slate-100">
                {publicStats.activeCampaignsCount}
              </div>
              <div className="text-xs text-slate-400 font-medium">حملات تكافلية نشطة</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <Award className="w-6 h-6 text-blue-400 mx-auto" />
              <div className="text-2xl font-mono font-bold text-slate-100">
                {publicStats.totalApprovedMemberships.toLocaleString()} SDG
              </div>
              <div className="text-xs text-slate-400 font-medium">اشتراكات مفعلة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">الركائز المؤسسية للمنصة</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              بنية رقمية متكاملة لخدمة النسب الشريف، التكافل الاجتماعي، وتوثيق التاريخ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">سجل الأنساب وشجرة العائلات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                توثيق الأسر والفروع التاريخية وفق آلية تدقيق موثقة تشرف عليها دائرة التوثيق والنسب.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">صندوق التكافل الاجتماعي</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                دعم الأسر المتعففة والحالات الطبية والتعليمية بآلية تحويلات مراجعة وشفافية مالية تامة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">شبكة الأعمال والكفاءات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ربط أصحاب الخبرات ورجال الأعمال لتقديم فرص العمل والاستثمار والتدريب لأبناء الطائفة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
