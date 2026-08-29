import { createAdminClient } from "@/lib/supabase/admin";
import { Database, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DatabasePage() {
  const supabaseAdmin = createAdminClient();
  const { data: members } = await supabaseAdmin
    .from("members")
    .select("membership_number, full_name, state, locality, status, created_at")
    .eq("status", "active")
    .limit(50);

  const activeMembersList = members || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Database className="w-4 h-4" />
          السجل المدني الموحد
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          قاعدة بيانات السجل المدني والأعضاء
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          بيانات السجل المدني المعتمدة من واقع قاعدة بيانات المنصة.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {activeMembersList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <Users className="w-8 h-8 text-amber-500/40 mx-auto" />
            <p className="font-bold text-slate-300">لا يوجد أعضاء مفعلون مسجلون في السجل المدني حالياً.</p>
            <p className="text-[11px] text-slate-500">يتم إدراج الأعضاء تلقائياً بعد تقديم طلب العضوية واعتماد التحويل المالي.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">رقم العضوية</th>
                  <th className="p-3">الاسم الكامل</th>
                  <th className="p-3">الولاية</th>
                  <th className="p-3">المحلية</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeMembersList.map((m: any) => (
                  <tr key={m.membership_number} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-amber-400 font-bold">{m.membership_number}</td>
                    <td className="p-3 font-bold text-slate-100">{m.full_name}</td>
                    <td className="p-3">{m.state}</td>
                    <td className="p-3">{m.locality}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
                        مفعل
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
