"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Compass, Calendar, BookOpen, MapPin, Users2, ShieldAlert, Award } from "lucide-react";

export default function History() {
  const timelineData = [
    { year: "1350م", title: "وصول الشيخ غلام الله بن عايد للبلاد", desc: "استقرار الشيخ غلام الله بن عايد بجزيرة دنقلا العجوز آتياً من اليمن لتعليم وتحفيظ القرآن وبناء المساجد والخلاوي الكبرى." },
    { year: "1380م", title: "ولادة الشيخ ركاب بن غلام الله", desc: "الجد المباشر الجامع لمعظم السادة الركابية، والذي تفرعت منه الروابط والعشائر العريقة في ربوع السودان الشمالي والأوسط." },
    { year: "1450م - 1500م", title: "تأسيس الخلاوي والمنائر الكبرى بولاية نهر النيل", desc: "إنشاء خلوة الشيخ حبيب وأبنائه لنشر الفقه والعلوم الشرعية واللغة العربية وحفظ التراث العربي الأصيل." },
    { year: "2012م", title: "تدشين الهيئة القومية للمجلس الأعلى", desc: "تأسيس المجلس الأعلى لتنسيق وحماية أوقاف السادة الركابية ودعم العلاقات التكافلية والتوثيق الموحد للأنساب رقمیّاً." }
  ];

  const councilLeaders = [
    { role: "رئيس المجلس الأعلى للسادة الركابية", name: "الشيخ الدكتور علي الركابي", zone: "الخرطوم" },
    { role: "نائب رئيس المجلس والأمين المالي", name: "السيد صلاح الدين الركابي", zone: "نهر النيل" },
    { role: "أمين الشؤون القانونية والمظالم", name: "المستشار القانوني أحمد الركابي", zone: "أم درمان" },
    { role: "رئيس اللجنة العلمية وتحقيق الأنساب", name: "الشيخ عبد المجيد الركابي", zone: "الولاية الشمالية" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            تاريخ السادة والمنظومة الإدارية العليا
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">تاريخ الركابية والمجلس الأعلى</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            استكشف الجدول التاريخي التفاعلي لنشأة وتوسع السادة الركابية، وبنية المجلس الأعلى والهياكل التنظيمية واللجان الإدارية الرسمية.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-16 text-right">

        {/* 1. Timeline Interactive layout */}
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">التسلسل التاريخي للأحداث</h2>
          <div className="relative border-r-2 border-primary/30 mr-4 space-y-8 pb-4">
            {timelineData.map((item, idx) => (
              <div key={idx} className="relative pr-8">
                {/* Visual marker dot */}
                <div className="absolute top-1.5 -right-[9px] w-4 h-4 rounded-full bg-amber-500 border-4 border-background" />

                <div className="bg-card border border-border p-5 rounded-xl shadow-xs space-y-2">
                  <span className="text-xs font-extrabold text-primary bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                    {item.year}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground pt-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Council Leadership board section */}
        <section id="council" className="space-y-6 pt-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">المجلس الأعلى واللجان التنظيمية</h2>
            <p className="text-xs text-muted-foreground font-semibold">الهيكل الإداري والمؤسسي المعتمد لإدارة شؤون الروابط، التكافل المالي، والتوثيق العلمي.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {councilLeaders.map((lead, idx) => (
              <div key={idx} className="bg-card border border-border p-5 rounded-xl shadow-xs text-right space-y-2 hover:border-primary/50 transition-colors">
                <span className="text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded font-bold">
                  {lead.role}
                </span>
                <h4 className="font-extrabold text-sm text-foreground">{lead.name}</h4>
                <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>الفرع الممثل: {lead.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
