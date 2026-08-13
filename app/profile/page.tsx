"use client";

import React, { useRef, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { peopleDatabase } from "@/lib/mock-data";
import { Printer, Download, Eye, QrCode, BadgeCheck, Phone, Mail, MapPin, Award, Calendar } from "lucide-react";

export default function Profile() {
  const profileUser = peopleDatabase.find(p => p.id === "101") || peopleDatabase[4]; // Default to Prof. Al-Tayeb
  const cardRef = useRef<HTMLDivElement>(null);
  const [printStatus, setPrintStatus] = useState("");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            البطاقة الرقمية الرسمية والاشتراك
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">الملف الشخصي الرقمي الموحد</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            استعرض بطاقة هويتك الرقمية الخاصة بالسادة الركابية، صالحة للطباعة والتثبت السريع عبر مسح رمز الاستجابة السريعة QR المدمج.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">

        {/* Right Pane: Profile Metadata list (cols-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-primary flex items-center justify-center font-extrabold text-lg shadow-sm">
                ر
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                  <span>{profileUser.name}</span>
                  <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                </h3>
                <p className="text-xs text-muted-foreground font-semibold">{profileUser.title || "عضو نشط بالديوان"}</p>
              </div>
            </div>

            {/* Profile Fields list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block font-medium">الرقم الوطني الموثق</span>
                <span className="text-foreground text-xs" dir="ltr">{profileUser.nationalId || "1010000000"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block font-medium">البريد الإلكتروني المعتمد</span>
                <span className="text-foreground text-xs">{profileUser.email || "support@alrikabiyyah.org"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block font-medium">رقم الهاتف</span>
                <span className="text-foreground text-xs" dir="ltr">{profileUser.phone || "+249 9123 45678"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block font-medium">الفرع العائلي المسجل</span>
                <span className="text-foreground text-xs">{profileUser.branch} - آل {profileUser.family}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block font-medium">الولاية والمحلية والقرية</span>
                <span className="text-foreground text-xs">{profileUser.state} • {profileUser.locality} • {profileUser.village}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block font-medium">تاريخ الانضمام والاعتماد</span>
                <span className="text-foreground text-xs flex items-center gap-1 justify-start">
                  <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{profileUser.joinDate || "2024-01-15"}</span>
                </span>
              </div>
            </div>

            {/* Achievements and history */}
            {profileUser.achievements && profileUser.achievements.length > 0 && (
              <div className="pt-4 border-t border-border space-y-2">
                <h4 className="text-xs font-bold text-foreground">الإنجازات والجوائز المعتمدة:</h4>
                <ul className="space-y-1.5">
                  {profileUser.achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Left Pane: Digital Premium ID Card Preview (cols-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-extrabold text-sm text-foreground">معاينة بطاقة الهوية الرقمية</h3>
            <p className="text-xs text-muted-foreground font-semibold">تأكد من دقة المعلومات قبل حفظ أو طباعة البطاقة.</p>
          </div>

          {/* Premium Vector Style ID Card */}
          <div
            ref={cardRef}
            className="relative overflow-hidden w-full max-w-sm mx-auto aspect-[1.58/1] rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 shadow-2xl flex flex-col justify-between"
          >
            {/* Elegant Background Patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]" />
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-amber-400/5 blur-2xl" />

            {/* Card Header Stamp */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5 relative z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-sm shadow-inner">
                  ر
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold text-white leading-tight">السادة الركابية</span>
                  <span className="text-[7px] font-medium text-amber-400 leading-none">المنصة الرقمية الموحدة</span>
                </div>
              </div>
              <span className="text-[8px] bg-emerald-900 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-extrabold tracking-widest">
                بطاقة عضوية
              </span>
            </div>

            {/* Card Body details */}
            <div className="grid grid-cols-12 gap-2 my-auto relative z-10 text-right items-center">
              {/* Profile Main details (col-span-8) */}
              <div className="col-span-8 space-y-1.5">
                <h4 className="text-xs font-extrabold text-white leading-normal truncate">{profileUser.name}</h4>
                <p className="text-[8px] text-amber-300 font-bold leading-none">{profileUser.title || "عضو معتمد"}</p>

                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-amber-500/10 text-[7px] text-emerald-200/90 font-semibold">
                  <div>
                    <span className="text-amber-400/60 block text-[6px] font-medium leading-none">العائلة والفرع</span>
                    <span>آل {profileUser.family} • {profileUser.branch}</span>
                  </div>
                  <div>
                    <span className="text-amber-400/60 block text-[6px] font-medium leading-none">الولاية والمحلية</span>
                    <span>{profileUser.state} • {profileUser.locality}</span>
                  </div>
                </div>
              </div>

              {/* QR Code and Avatar (col-span-4) */}
              <div className="col-span-4 flex flex-col items-center justify-center space-y-1">
                <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-md flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-black" />
                </div>
                {profileUser.membershipId && (
                  <span className="text-[7px] text-amber-400 font-extrabold" dir="ltr">
                    {profileUser.membershipId}
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer stamp */}
            <div className="border-t border-amber-500/15 pt-2 flex items-center justify-between text-[7px] text-emerald-200/80 font-bold relative z-10">
              <span>تاريخ الاعتماد: {profileUser.joinDate || "2024-01-15"}</span>
              <span className="text-amber-400 flex items-center gap-0.5">
                <BadgeCheck className="w-3 h-3 text-amber-400" /> موثق رقميّاً
              </span>
            </div>
          </div>

          {/* Quick Print actions */}
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-border bg-card hover:bg-muted text-foreground rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-500" />
              <span>طباعة بطاقة الهوية</span>
            </button>
            <button
              onClick={() => {
                alert("تم إرسال بطاقة الهوية الرقمية بصيغة PDF لبريدكم الإلكتروني المسجل بنجاح.");
              }}
              className="px-4 py-2 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>حفظ كملف PDF</span>
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
