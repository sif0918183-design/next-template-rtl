import { getCurrentUserAction } from "@/lib/actions/auth";
import { UserCheck, Shield, Award, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userAccount = await getCurrentUserAction();

  if (!userAccount || !userAccount.user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 dir-rtl">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <Shield className="w-12 h-12 text-amber-400 mx-auto" />
          <h1 className="text-lg font-bold text-slate-100">الملف الشخصي والبطاقة الرقمية</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            عذراً، يلزم تسجيل الدخول لعرض معلومات الحساب وبطاقة العضوية الرقمية.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            الانتقال لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const profile = userAccount.profile || {};
  const member = userAccount.member || {};

  return (
    <div className="min-h-screen bg-slate-950 text-white dir-rtl py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-2xl">
              {profile.full_name?.charAt(0) || userAccount.user.email?.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">{profile.full_name || "عضو مسجل"}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{userAccount.user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {userAccount.roles?.length ? userAccount.roles.join(", ") : "عضو مسجل"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">رقم الهاتف</span>
              <p className="font-semibold text-slate-200">{profile.phone || "غير محدد"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">الموقع الجغرافي</span>
              <p className="font-semibold text-slate-200">{profile.state ? `${profile.state} - ${profile.locality}` : "غير محدد"}</p>
            </div>
          </div>
        </div>

        {/* Digital Membership Card Preview */}
        {member.membership_number ? (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="text-xs font-bold text-amber-400">بطاقة العضوية الرقمية المعتمدة</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">رقم العضوية الرسمية</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-400">{member.membership_number}</div>
            </div>
            <div className="pt-2 text-left">
              <Link
                href={`/verify/${member.membership_number}`}
                className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                معاينة صفحة التحقق العام ←
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">لم يتم إصدار بطاقة عضوية رسمية لهذا الحساب بعد.</p>
            <Link href="/login" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-block">
              تقديم طلب عضوية جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
