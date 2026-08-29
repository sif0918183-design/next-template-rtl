import { createAdminClient } from "@/lib/supabase/admin";
import { Briefcase, Building2, GraduationCap, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SpecializedPage() {
  const supabaseAdmin = createAdminClient();
  const { data: businesses } = await supabaseAdmin.from("businesses").select("*");
  const { data: jobs } = await supabaseAdmin.from("jobs").select("*").eq("is_active", true);

  const businessList = businesses || [];
  const jobsList = jobs || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Briefcase className="w-4 h-4" />
          شبكة الأعمال والكفاءات والوظائف
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          شبكة الكفاءات وبنك الوظائف الركابي
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          ربط أصحاب الخبرات والشركات لتقديم فرص العمل والتدريب والرعاية التنموية.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Businesses Network */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-amber-400 border-r-4 border-amber-500 pr-3">
            شبكة الشركات والأعمال المعتمدة
          </h2>

          {businessList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
              <Building2 className="w-8 h-8 text-amber-500/40 mx-auto" />
              <p className="font-bold text-slate-300">لا توجد أعمال أو شركات مسجلة حالياً في الشبكة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {businessList.map((b: any) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-slate-100 text-xs">{b.name}</h3>
                  <p className="text-[11px] text-amber-400">{b.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jobs Bank */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-lg font-bold text-amber-400 border-r-4 border-amber-500 pr-3">
            بنك الوظائف وفرص التدريب
          </h2>

          {jobsList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
              <GraduationCap className="w-8 h-8 text-amber-500/40 mx-auto" />
              <p className="font-bold text-slate-300">لا توجد فرص عمل أو تدريب معلنة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobsList.map((j: any) => (
                <div key={j.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-slate-100 text-xs">{j.title}</h3>
                  <p className="text-[11px] text-slate-400">{j.location} • {j.industry}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
