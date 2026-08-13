"use client";

import React, { useState } from "react";
import { Search, X, ChevronRight, User, BookOpen, Newspaper } from "lucide-react";
import { peopleDatabase, newsDatabase, eventsDatabase } from "@/lib/mock-data";
import Link from "next/link";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  // Real-time filtering
  const matchingPeople = query.trim()
    ? peopleDatabase.filter(p => p.name.includes(query) || (p.title && p.title.includes(query)))
    : [];

  const matchingNews = query.trim()
    ? newsDatabase.filter(n => n.title.includes(query) || n.summary.includes(query))
    : [];

  const matchingEvents = query.trim()
    ? eventsDatabase.filter(e => e.title.includes(query) || e.description.includes(query))
    : [];

  const totalResults = matchingPeople.length + matchingNews.length + matchingEvents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Search Input Area */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن أفراد، عائلات، أخبار، وثائق، أو خدمات..."
            className="flex-1 bg-transparent text-foreground outline-hidden text-lg font-medium placeholder-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[450px] overflow-y-auto p-4 space-y-6">
          {query.trim() === "" ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-muted-foreground text-sm">ابدأ بكتابة كلمات البحث للعثور على النتائج المطلوبة</p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded">الشيخ غلام الله</span>
                <span className="bg-muted px-2 py-1 rounded">صندوق التكافل</span>
                <span className="bg-muted px-2 py-1 rounded">البروفيسور الطيب</span>
                <span className="bg-muted px-2 py-1 rounded">الندوة الكبرى</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-lg font-semibold text-foreground">لم يتم العثور على نتائج لـ &ldquo;{query}&rdquo;</p>
              <p className="text-muted-foreground text-sm">تأكد من كتابة الاسم بشكل صحيح أو استخدام كلمات عامة</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* People/Ancestry Section */}
              {matchingPeople.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> السجل المدني والأنساب ({matchingPeople.length})
                  </h3>
                  <div className="divide-y divide-border rounded-lg border border-border overflow-hidden bg-muted/10">
                    {matchingPeople.map(person => (
                      <Link
                        key={person.id}
                        href={`/database?search=${encodeURIComponent(person.name)}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors group text-right"
                      >
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {person.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>{person.title || "عضو مسجل"}</span>
                            <span>•</span>
                            <span>{person.state} - {person.village}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* News Section */}
              {matchingNews.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> الأخبار والبيانات الرسمية ({matchingNews.length})
                  </h3>
                  <div className="divide-y divide-border rounded-lg border border-border overflow-hidden bg-muted/10">
                    {matchingNews.map(news => (
                      <Link
                        key={news.id}
                        href={`/media`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors group text-right"
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {news.title}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {news.summary}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Section */}
              {matchingEvents.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> الفعاليات والندوات ({matchingEvents.length})
                  </h3>
                  <div className="divide-y divide-border rounded-lg border border-border overflow-hidden bg-muted/10">
                    {matchingEvents.map(event => (
                      <Link
                        key={event.id}
                        href={`/media`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors group text-right"
                      >
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {event.date} • {event.location}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer/Info Bar */}
        <div className="p-3 border-t border-border bg-muted/30 text-xs text-center text-muted-foreground">
          اضغط على أي نتيجة للانتقال المباشر وتفحص التفاصيل الكاملة
        </div>

      </div>
    </div>
  );
}
