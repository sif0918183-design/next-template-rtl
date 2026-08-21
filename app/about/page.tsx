import { getLeadershipAction } from "@/lib/actions/cms";
import { ShieldCheck, Award, Building, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const leadershipMembers = await getLeadershipAction();

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          الهيكلة المؤسسية والتاريخ العريق
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          عن السادة الركابية والأمانة العامة
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto leading-relaxed">
          المنصة والديوان الرقمي الرسمي الجامع لأبناء السادة الركابية بجمهورية السودان. كيان مجتمعي ومؤسسي يُعنى بتوثيق النسب الشريف، وتعزيز التكافل الأسري، وبناء شبكة الخدمات المتكاملة.
        </p>
      </div>

      {/* Leadership Body Section */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-amber-400">الهيئة القيادية والمجلس التنفيذي</h2>
          <p className="text-xs text-slate-400">الأعضاء القياديون المسجلون والمعتمدون في قاعدة البيانات الرسمية</p>
        </div>

        {leadershipMembers.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <Users className="w-8 h-8 text-amber-500/40 mx-auto" />
            <p className="font-bold text-slate-300">سيتم الإعلان عن أعضاء القيادة فور اعتمادهم في قاعدة البيانات.</p>
            <p className="text-[11px] text-slate-500">تجري الأمانة العامة حالياً استكمال بيانات التكليف الرسمية.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {leadershipMembers.map((l: any) => (
              <div key={l.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {l.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{l.full_name}</h3>
                  <p className="text-xs text-amber-400 font-medium">{l.role_title}</p>
                </div>
                {l.bio && <p className="text-[11px] text-slate-400 line-clamp-2">{l.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
