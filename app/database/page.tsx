"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSiteStore } from "@/lib/state-store";
import { Search, ShieldAlert, ShieldCheck, Filter, UserCheck, EyeOff } from "lucide-react";

export default function Database() {
  const { people } = useSiteStore();
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedProfession, setSelectedProfession] = useState("all");

  const activePeople = people && people.length > 0 ? people : [];

  const statesList = Array.from(new Set(activePeople.map(p => p.state)));
  const professionsList = [
    { value: "scholar", label: "داعية / عالم شرعي" },
    { value: "academic", label: "أكاديمي / بروفيسور" },
    { value: "doctor", label: "طبيب واستشاري" },
    { value: "engineer", label: "مهندس تقني" },
    { value: "lawyer", label: "قانوني ومستشار" },
    { value: "businessman", label: "رجل أعمال ومستثمر" },
    { value: "martyr", label: "شهيد الواجب" },
    { value: "youth", label: "مبادرات شبابية" },
    { value: "student", label: "طالب علم" },
    { value: "woman", label: "عضوة مجتمعية" },
  ];

  // Filtering Logic
  const filteredMembers = activePeople.filter((p) => {
    const matchesQuery = p.name.includes(query) || (p.title && p.title.includes(query)) || p.family.includes(query) || p.branch.includes(query);
    const matchesState = selectedState === "all" || p.state === selectedState;
    const matchesProfession = selectedProfession === "all" || p.profession === selectedProfession;
    return matchesQuery && matchesState && matchesProfession;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            البوابة الإدارية والتحقق الموحد
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">قاعدة بيانات الركابية الوطنية</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            نظام بحث وتثبت متقدم من سجلات العضوية والبطاقات الرقمية المعتمدة لدى لجان الأمانة العامة مع الحفاظ الكامل على سرية الخصوصية والأمان الفردي.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-8 text-right">

        {/* Advanced Filters Block */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-sm">أدوات الفلترة والبحث المتقدم</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground">البحث بالاسم / العائلة / الفرع</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: الطيب الركابي..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                />
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* State filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground">الولاية السودانية</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
              >
                <option value="all">كل الولايات المعتمدة</option>
                {statesList.map((state, idx) => (
                  <option key={idx} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Profession filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground">التخصص المهني</label>
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
              >
                <option value="all">كل التخصصات والمجالات</option>
                {professionsList.map((p, idx) => (
                  <option key={idx} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Database List Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground">قائمة الأعضاء المستوفين لشروط العضوية ({filteredMembers.length})</h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> قنوات اتصال محمية وآمنة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-card border border-border p-5 rounded-xl shadow-xs text-right relative space-y-4 hover:border-primary/50 transition-colors"
              >
                {/* ID badge header */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 text-primary flex items-center justify-center font-extrabold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">{member.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">{member.title || "عضو مسجل بالديوان"}</p>
                    </div>
                  </div>
                  {member.membershipId && (
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-extrabold" dir="ltr">
                      {member.membershipId}
                    </span>
                  )}
                </div>

                {/* Info Fields Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-muted-foreground">
                  <div>
                    <span className="text-[9px] text-muted-foreground block font-medium">الفرع والعائلة</span>
                    <span className="text-foreground">{member.branch} • {member.family}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block font-medium">المنطقة الجغرافية</span>
                    <span className="text-foreground">{member.state} - {member.village}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block font-medium">رقم الهاتف</span>
                    {member.phone ? (
                      <span className="text-foreground text-[10px]" dir="ltr">{member.phone}</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 text-[10px] flex items-center gap-1 justify-start">
                        <EyeOff className="w-3 h-3" /> محجوب للخصوصية
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block font-medium">حالة السجل والتحقق</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-start text-[10px]">
                      <UserCheck className="w-3.5 h-3.5" /> معتمد رسمياً
                    </span>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold border-t border-border pt-2">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground space-y-2">
              <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-foreground">لم نجد أي عضو يطابق المدخلات المحددة</p>
              <p className="text-xs font-medium text-muted-foreground">تأكد من تعديل الفلاتر أو استخدام كلمات بحث أقل تحديداً.</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
