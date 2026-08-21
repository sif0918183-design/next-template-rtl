import { getNewsAction, getMediaAction } from "@/lib/actions/cms";
import { Newspaper, Image as ImageIcon, Play, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const news = await getNewsAction();
  const media = await getMediaAction();

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Newspaper className="w-4 h-4" />
          المركز الإعلامي والمحتوى الرقمي
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          الأخبار والبيانات الرسمية ومعرض الميديا
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          المصدر الرسمي للبيانات والأخبار والوثائق المرئية الصادرة عن الأمانة العامة.
        </p>
      </div>

      {/* News Section */}
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-lg font-bold text-amber-400 border-r-4 border-amber-500 pr-3">
          أحدث الأخبار والبيانات الرسمية
        </h2>

        {news.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <FileText className="w-8 h-8 text-amber-500/40 mx-auto" />
            <p className="font-bold text-slate-300">لا توجد أخبار أو بيانات رسمية منشورة حالياً.</p>
            <p className="text-[11px] text-slate-500">سيتم النشر فور اعتماد البيانات من الدائرة الإعلامية.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((n: any) => (
              <div key={n.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  {n.category || "خبر رسمى"}
                </span>
                <h3 className="font-bold text-slate-100 text-base">{n.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{n.excerpt || n.content}</p>
                <p className="text-[10px] text-slate-500">{new Date(n.created_at).toLocaleDateString("ar-SD")}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Gallery Section */}
      <div className="max-w-6xl mx-auto space-y-6 pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-amber-400 border-r-4 border-amber-500 pr-3">
          معرض الوسائط الرقمي (صور وفيديوهات)
        </h2>

        {media.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <ImageIcon className="w-8 h-8 text-amber-500/40 mx-auto" />
            <p className="font-bold text-slate-300">لا توجد وسائط مضافة حالياً في المعرض الرقمي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {media.map((m: any) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  {m.media_type === "photo" ? <ImageIcon className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-rose-400" />}
                  <span>{m.title}</span>
                </div>
                {m.description && <p className="text-[11px] text-slate-400">{m.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
