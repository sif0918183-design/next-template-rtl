import { getMemberByNumberAction } from "@/lib/actions/membership";
import { CheckCircle2, XCircle, ShieldCheck, UserCheck, MapPin, Award } from "lucide-react";
import Link from "next/link";

export default async function VerifyMembershipPage({
  params,
}: {
  params: Promise<{ membershipNumber: string }>;
}) {
  const { membershipNumber } = await params;
  const member = await getMemberByNumberAction(membershipNumber);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 dir-rtl">
      <div className="w-full max-w-md bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        {/* Institutional Header */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 mb-3 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-amber-400">بوابة التحقق الرقمي الموحدة</h1>
          <p className="text-xs text-slate-400 mt-1">منصة السادة الركابية الرقمية - جمهورية السودان</p>
        </div>

        {member ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-sm text-slate-300">حالة العضوية</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" />
                عضوية موثوقة ومفعلة
              </span>
            </div>

            <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400">الاسم الكامل</div>
                  <div className="font-bold text-slate-100">{member.full_name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400">رقم العضوية الرسمية</div>
                  <div className="font-mono font-bold text-emerald-400">{member.membership_number}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                <MapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400">الموقع الجغرافي</div>
                  <div className="text-slate-200 text-sm">{member.state} - {member.locality}</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 pt-2">
              🔒 هذه الصفحة مخصصة فقط للتحقق من سريان العضوية دون إظهار أي بيانات شخصية أو حمالية حساسة.
            </p>
          </div>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 space-y-2">
              <XCircle className="w-12 h-12 mx-auto text-red-400" />
              <div className="font-bold">سجل غير موجود أو ملغى</div>
              <p className="text-xs text-slate-300">
                لم يتم العثور على عضوية مسجلة برقم (<span className="font-mono">{membershipNumber}</span>). يرجى التأكد من الرقم الممسوح.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
