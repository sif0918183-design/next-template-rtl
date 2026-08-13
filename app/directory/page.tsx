"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { geographicStats, StateStats } from "@/lib/mock-data";
import { Search, MapPin, Building, Users2, ChevronRight, HelpCircle } from "lucide-react";

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStats = geographicStats.filter(stat =>
    stat.state.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            البوابة الجغرافية للتجمعات الركابية
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">دليل الأسر والفروع بالولايات</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            استعرض التوزيع الجغرافي الشامل وحجم التجمعات السكنية والأسر والفروع التابعة للسادة الركابية بمختلف ولايات ومحليات السودان.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-8 text-right">

        {/* Search and filter controls */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-foreground">فرز وتصفية التوزيع الولائي</h3>
            <p className="text-xs text-muted-foreground font-semibold">ادخل اسم الولاية لمطابقة الإحصائيات المسجلة فوراً.</p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="ابحث باسم الولاية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2.5 pl-9 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* State stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border p-5 rounded-xl shadow-xs space-y-4 hover:border-primary/50 transition-colors text-right relative overflow-hidden group"
            >
              {/* Corner state stamp decoration */}
              <div className="absolute top-0 left-0 bg-primary/10 text-primary text-[10px] px-2.5 py-1 rounded-br-lg font-bold">
                ولاية معتمدة
              </div>

              <div className="flex items-center gap-2 border-b border-border pb-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="font-extrabold text-base text-foreground">{stat.state}</h4>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[9px] text-muted-foreground font-semibold block mb-0.5">الأسر</span>
                  <span className="text-sm font-extrabold text-foreground" dir="ltr">{stat.familiesCount}</span>
                </div>
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[9px] text-muted-foreground font-semibold block mb-0.5">الفروع</span>
                  <span className="text-sm font-extrabold text-foreground" dir="ltr">{stat.branchesCount}</span>
                </div>
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[9px] text-muted-foreground font-semibold block mb-0.5">الأعضاء</span>
                  <span className="text-sm font-extrabold text-foreground" dir="ltr">{stat.membersCount}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-primary">
                <span>تصفح دليل المحليات والقرى</span>
                <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Directory Matrix structural disclaimer info */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-muted-foreground">
          <HelpCircle className="w-6 h-6 text-primary shrink-0" />
          <p className="leading-relaxed text-right">
            يتم تحديث هذه المصفوفة الجغرافية تلقائياً كل 24 ساعة استناداً لطلبات العضوية الجديدة والتقارير المرفوعة من ممثلي لجان الولايات. يتم حجب بيانات الاتصال الدقيقة للعامة لأسباب تتعلق بالخصوصية والأمان الوطني.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
