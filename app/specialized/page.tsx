"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSiteStore } from "@/lib/state-store";
import { Search, ChevronLeft, MapPin, UserCheck, PhoneCall, HelpCircle } from "lucide-react";

export default function Specialized() {
  const { people } = useSiteStore();
  const [activeTab, setActiveTab] = useState<"all" | "scholar" | "academic" | "doctor" | "engineer" | "lawyer" | "businessman" | "martyr" | "youth" | "student" | "woman">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activePeople = people && people.length > 0 ? people : [];

  const tabsList = [
    { value: "all", label: "الجميع" },
    { value: "scholar", label: "العلماء والدعاة" },
    { value: "academic", label: "الأكاديميون" },
    { value: "doctor", label: "الأطباء" },
    { value: "engineer", label: "المهندسون" },
    { value: "lawyer", label: "القانونيون" },
    { value: "businessman", label: "رجال الأعمال" },
    { value: "martyr", label: "شهداء الركابية" },
    { value: "youth", label: "الشباب" },
    { value: "student", label: "الطلاب" },
    { value: "woman", label: "المرأة" },
  ];

  // Filtering Logic
  const filteredProfessionals = activePeople.filter((p) => {
    const matchesTab = activeTab === "all" || p.profession === activeTab;
    const matchesSearch = p.name.includes(searchQuery) || (p.title && p.title.includes(searchQuery)) || p.state.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            الشبكة المهنية للأعمال والخبرات
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">سجل الكفاءات والأقسام المتخصصة</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            استعرض الخبرات، النخب الأكاديمية والشرعية، رجال الأعمال، الكوادر الطبية، شهداء الواجب الإنساني، وقسم الشباب والمرأة والطلاب.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-8 text-right">

        {/* Navigation Tabs (RTL scrollable for mobile-first) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-border">
          {tabsList.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search within tab */}
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-muted-foreground hidden sm:inline">فرز سريع داخل التخصص المحدد:</span>
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="ابحث بالاسم أو اللقب أو الولاية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2.5 pl-9 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Specialized directory cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProfessionals.map((person) => (
            <div
              key={person.id}
              className="bg-card border border-border p-5 rounded-2xl shadow-xs text-right space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 text-primary flex items-center justify-center font-extrabold text-base shadow-sm">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1">
                      <span>{person.name}</span>
                      {person.isRegistered && (
                        <UserCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                      )}
                    </h4>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{person.title || "عضو متخصص"}</p>
                  </div>
                </div>
                <span className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
                  {tabsList.find(t => t.value === person.profession)?.label || "عام"}
                </span>
              </div>

              {person.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  {person.bio}
                </p>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{person.state} - {person.village}</span>
                </span>

                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="text-primary hover:underline flex items-center gap-1 text-[10px] font-bold"
                  >
                    <span>تواصل مهني</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground">
            لا توجد كفاءات مسجلة حالياً ضمن هذا القسم التخصصي بالمواصفات المحددة.
          </div>
        )}

        {/* Bottom specialized matrix notes */}
        <div className="p-4 bg-muted/40 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-muted-foreground">
          <HelpCircle className="w-6 h-6 text-primary shrink-0" />
          <p className="leading-relaxed text-right">
            تسعى هذه الشبكات المهنية لتوفير قاعدة معارف وطنية قوية تدعم توظيف الكفاءات، وتقدم استشارات مجانية للأسر الركابية المحتاجة في السودان بالتعاون مع لجان الأطباء، المهندسين والمستشارين القانونيين.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
