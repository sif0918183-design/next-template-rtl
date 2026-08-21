import { getFamiliesAction } from "@/lib/actions/cms";
import { BookOpen, TreePine, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GenealogyPage() {
  const families = await getFamiliesAction();

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <TreePine className="w-4 h-4" />
          شجرة الأنساب الموثقة والسجل العائلي
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          توثيق شجرة الأنساب والأسر الركابية
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto leading-relaxed">
          دليل الأسر والفروع الموثقة رسمياً بإشراف دائرة التوثيق والنسب بالأمانة العامة.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {families.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-3">
            <BookOpen className="w-8 h-8 text-amber-500/40 mx-auto" />
            <p className="font-bold text-slate-300">لا توجد أسر أو سلالات موثقة حالياً في قاعدة البيانات.</p>
            <p className="text-[11px] text-slate-500">يتطلب إضافة أسرة جديدة تسجيل الدخول بحساب معتمد وإكمال استمارة التوثيق.</p>
            <div className="pt-2">
              <Link href="/login" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-block">
                تسجيل الدخول لإضافة أسرة
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {families.map((f: any) => (
              <div key={f.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-sm">{f.name_ar}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">موثق</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{f.main_locality || "جمهورية السودان"}</span>
                </div>
                {f.description && <p className="text-[11px] text-slate-400 leading-relaxed">{f.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
