"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSiteStore } from "@/lib/state-store";
import { Search, GitFork, ArrowLeft, ArrowRight, UserCheck, HelpCircle } from "lucide-react";

export default function Genealogy() {
  const { people, isLoaded } = useSiteStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

  // Fallback if state hasn't fully hydrated yet
  const activePeopleList = people && people.length > 0 ? people : [];

  // Find current selected person based on state id
  const selectedPerson = activePeopleList.find(p => p.id === localSelectedId) || activePeopleList[0] || null;

  // Filter people matching query for manual lookup
  const filteredPeople = searchQuery.trim()
    ? activePeopleList.filter(p => p.name.includes(searchQuery))
    : [];

  // Find relatives of the currently selected person in our custom database
  const father = selectedPerson?.fatherId
    ? activePeopleList.find(p => p.id === selectedPerson.fatherId)
    : null;

  const children = selectedPerson
    ? activePeopleList.filter(p => p.fatherId === selectedPerson.id)
    : [];

  // Tracing back the full lineage line to Ghulamallah
  const getFullLineage = (person: any): string[] => {
    const lineage: string[] = [person.name];
    let current = person;
    while (current.fatherId) {
      const dad = activePeopleList.find(p => p.id === current.fatherId);
      if (dad) {
        lineage.push(dad.name);
        current = dad;
      } else {
        break;
      }
    }
    return lineage;
  };

  const lineageList = selectedPerson ? getFullLineage(selectedPerson) : [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            أداة تتبع الأنساب وحفظ الذاكرة
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">شجرة أنساب السادة الركابية</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            استكشف وتصفح عمود النسب الشريف المتصل وسلسلة الآباء والأبناء بداية من الجد الجامع الشيخ غلام الله بن عايد وتفرعاته العريقة.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">

        {/* Right Pane: Search and Person List (cols-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <span>البحث السريع في الشجرة</span>
            </h3>

            <div className="relative">
              <input
                type="text"
                placeholder="ادخل الاسم للبحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 pl-9 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>

            {searchQuery.trim() !== "" ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <p className="text-[10px] text-muted-foreground font-semibold">نتائج البحث ({filteredPeople.length})</p>
                {filteredPeople.length > 0 ? (
                  filteredPeople.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setLocalSelectedId(p.id); setSearchQuery(""); }}
                      className="w-full text-right p-2.5 rounded-lg border border-border hover:bg-muted/50 text-xs font-bold block transition-colors"
                    >
                      {p.name}
                      <span className="text-[9px] text-muted-foreground block font-medium mt-0.5">{p.state} • {p.branch}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center font-medium">لا توجد نتائج مطابقة لبحثك.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-semibold">روابط تاريخية سريعة</p>
                <div className="space-y-1.5">
                  {activePeopleList.slice(0, 6).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setLocalSelectedId(p.id)}
                      className={`w-full text-right p-2.5 rounded-lg text-xs font-bold block transition-colors ${
                        selectedPerson?.id === p.id
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-muted/50"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
              <span>هل اسمك أو عائلتك غائبة؟</span>
            </h4>
            <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
              المشروع يدار رقمياً تحت رقابة اللجنة العلمية لتوثيق الأنساب. يمكنك تقديم طلب إضافة عائلتك برفع وثائق النسب للمراجعة الشرعية عبر أمانة التواصل والنسب.
            </p>
          </div>
        </div>

        {/* Left Pane: Family Tree Navigator (cols-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPerson ? (
            <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-8 relative">
              <div className="flex items-center gap-2 border-r-4 border-primary pr-2.5">
                <GitFork className="w-5.5 h-5.5 text-primary rotate-180" />
                <h2 className="text-lg font-extrabold text-foreground">
                  مستكشف التفرع والعمود النسبي
                </h2>
              </div>

              {/* Graphical Box Representation of Relatives */}
              <div className="flex flex-col items-center justify-center space-y-6 pt-4">

                {/* 1. Parent Node */}
                {father ? (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setLocalSelectedId(father.id)}
                      className="bg-muted hover:bg-muted/80 border border-border px-5 py-2.5 rounded-lg text-xs font-bold text-muted-foreground shadow-xs transition-transform hover:-translate-y-0.5 text-center"
                    >
                      <span className="text-[9px] block text-amber-600 dark:text-amber-400 font-semibold mb-0.5">الوالد</span>
                      {father.name}
                    </button>
                    <div className="w-0.5 h-6 bg-border" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-muted/40 border border-border/60 border-dashed px-5 py-2 rounded-lg text-[10px] text-muted-foreground font-semibold">
                      الجد الأكبر (غلاف الله بن عايد أو بداية الفرع)
                    </div>
                    <div className="w-0.5 h-6 bg-border" />
                  </div>
                )}

                {/* 2. Selected/Focus Node */}
                <div className="relative z-10 flex flex-col items-center max-w-sm w-full bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border-2 border-primary/50 p-5 rounded-xl shadow-md text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-extrabold mx-auto">
                    ر
                  </div>
                  <h3 className="font-extrabold text-base text-foreground">{selectedPerson.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    الفترة: {selectedPerson.birthYear || "غير معروف"} — {selectedPerson.deathYear || "غير معروف"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    {selectedPerson.bio || "لم يتم تسجيل نبذة تفصيلية بعد."}
                  </p>
                  <div className="pt-2 border-t border-border w-full flex items-center justify-around text-[10px] text-muted-foreground font-bold">
                    <span>الفرع: {selectedPerson.branch}</span>
                    <span>الولاية: {selectedPerson.state}</span>
                  </div>
                </div>

                {/* 3. Children Nodes (with fork-style connector) */}
                {children.length > 0 && (
                  <div className="flex flex-col items-center w-full">
                    <div className="w-0.5 h-6 bg-border" />

                    {/* Horizontal fork line if multiple children */}
                    {children.length > 1 && (
                      <div className="w-4/5 h-0.5 bg-border -mt-0.5 mb-3" />
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setLocalSelectedId(child.id)}
                          className="bg-card hover:bg-muted/40 border border-border hover:border-primary/50 px-4 py-2 rounded-lg text-xs font-bold text-foreground transition-all duration-150 shadow-xs"
                        >
                          <span className="text-[8px] block text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">الابن</span>
                          {child.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trace Text Pathway Lineage to Ghulamallah */}
              <div className="pt-8 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-foreground">العمود النسبي المباشر (من اليمين لليسر):</h4>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground" dir="rtl">
                  {lineageList.map((name, i) => (
                    <React.Fragment key={i}>
                      <span className={`${i === 0 ? "text-primary font-bold" : ""}`}>{name}</span>
                      {i < lineageList.length - 1 && (
                        <ArrowLeft className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-card border border-border p-12 rounded-2xl shadow-xs text-center text-muted-foreground">
              الرجاء تحديد فرد من القائمة الجانبية أو البدء بالبحث لعرض تفاصيل شجرة النسب وعمود الأجداد.
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
