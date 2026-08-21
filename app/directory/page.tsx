import { getFamiliesAction } from "@/lib/actions/cms";
import { FolderTree, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const families = await getFamiliesAction();

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <FolderTree className="w-4 h-4" />
          الدليل الجغرافي العائلي
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          دليل الأسر والفروع والمحليات
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          بيانات حية ومباشرة مستمدة كلياً من قاعدة البيانات الرسمية.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {families.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <p className="font-bold text-slate-300">لا توجد أسر مسجلة حالياً في دليل المحليات.</p>
            <p className="text-[11px] text-slate-500">سيتم إظهار السجلات فور إدخال البيانات المعتمدة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {families.map((f: any) => (
              <div key={f.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="font-bold text-slate-100 text-sm">{f.name_ar}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {f.main_locality || "السودان"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
