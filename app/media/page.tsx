"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { newsDatabase } from "@/lib/mock-data";
import { Image as ImageIcon, Video, FileText, Search, ExternalLink, HelpCircle, Film } from "lucide-react";

export default function Media() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "news" | "photos" | "videos" | "docs">("all");

  const filteredNews = newsDatabase.filter(news =>
    news.title.includes(searchQuery) || news.summary.includes(searchQuery)
  );

  const mockPhotos = [
    { title: "خلوة دنقلا العجوز الأثرية للقرآن", desc: "بناء تاريخي عريق يمتد لأكثر من 500 عام.", tag: "تراث" },
    { title: "صورة جماعية لملتقى السادة بنهر النيل", desc: "حضور لافت ومناقشات حول كفالة الأسر.", tag: "رسمي" },
    { title: "أوقاف ومسجد السادة الركابية ببحري", desc: "منارة دينية واجتماعية وثقافية كبرى.", tag: "أوقاف" }
  ];

  const mockVideos = [
    { title: "وثائقي: رحلة الشيخ غلام الله بن عايد", desc: "شرح مرئي مفصل لأول من أدخل الخلاوي الكبرى للسودان.", url: "https://www.youtube.com" },
    { title: "تقرير مصور: تدشين المرحلة الرابعة لصندوق التكافل", desc: "تغطية ميدانية لتوزيع كفالة الأيتام للأسر والوافدين.", url: "https://www.youtube.com" }
  ];

  const mockDocs = [
    { title: "كتاب: منارة الهدى في نسب الركابية الكبرى", desc: "أكبر مؤلف تاريخي شامل يتناول تاريخ الفروع وتفرعاتها.", author: "الشيخ عبد المجيد الركابي" },
    { title: "وثيقة تحقيق رحلة ملوك النوبة وترحيبهم", desc: "مخطوطة نادرة تم مراجعتها بمعرفة أمانة المعرفة والنسب.", author: "لجنة التحقيق العلمي" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            أخبار، أرشيف صور، ومخطوطات تاريخية
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">المعرض الإعلامي والمكتبة</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            تصفح الأخبار الرسمية الموثقة، معرض الصور، الفيديوهات التوثيقية، وتحميل الكتب والمخطوطات العائلية المصورة بدقة.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-12 text-right">

        {/* Gallery navigation menu tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-border">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeCategory === "all" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            استعراض الكل
          </button>
          <button
            onClick={() => setActiveCategory("news")}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeCategory === "news" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            الأخبار الرسمية والبيانات
          </button>
          <button
            onClick={() => setActiveCategory("photos")}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeCategory === "photos" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            معرض الصور والآثار
          </button>
          <button
            onClick={() => setActiveCategory("videos")}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeCategory === "videos" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            الفيديوهات والوثائقيات
          </button>
          <button
            onClick={() => setActiveCategory("docs")}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeCategory === "docs" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            المكتبة والمخطوطات
          </button>
        </div>

        {/* 1. Official News section */}
        {(activeCategory === "all" || activeCategory === "news") && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">التقارير الإخبارية الأخيرة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((news) => (
                <div key={news.id} className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3 hover:border-primary/50 transition-colors">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-primary">
                    {news.category}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">{news.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{news.summary}</p>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium pt-2 border-t border-border">
                    {news.content}
                  </p>
                  <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between">
                    <span>تاريخ النشر: {news.date}</span>
                    <span className="font-bold text-primary">معتمد رسمي</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Photo Gallery Grid */}
        {(activeCategory === "all" || activeCategory === "photos") && (
          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">أرشيف الصور ومعرض الآثار</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPhotos.map((photo, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  {/* Photo Placeholder vector layout */}
                  <div className="aspect-video bg-emerald-950/20 flex flex-col items-center justify-center p-4 border-b border-border text-center">
                    <ImageIcon className="w-10 h-10 text-primary mb-2 opacity-60" />
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">{photo.tag}</span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-extrabold text-sm text-foreground">{photo.title}</h4>
                    <p className="text-xs text-muted-foreground font-semibold">{photo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Video streaming sections */}
        {(activeCategory === "all" || activeCategory === "videos") && (
          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">الفيديوهات والوثائقيات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockVideos.map((vid, idx) => (
                <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs text-right space-y-3 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Film className="w-5 h-5 text-amber-500 shrink-0" />
                    <h4 className="text-sm font-extrabold text-foreground">{vid.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{vid.desc}</p>
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-2"
                  >
                    <span>مشاهدة البث المرئي</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Library and Documents books list */}
        {(activeCategory === "all" || activeCategory === "docs") && (
          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">المكتبة وتحميل المخطوطات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockDocs.map((doc, idx) => (
                <div key={idx} className="bg-card border border-border p-5 rounded-2xl shadow-xs text-right space-y-4 hover:border-primary/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                      <h4 className="text-sm font-extrabold text-foreground">{doc.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{doc.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>إعداد وتحقيق: {doc.author}</span>
                    <button
                      onClick={() => alert("سيتم بدء تحميل المخطوطة كملف PDF عالي الدقة قريباً.")}
                      className="text-primary hover:underline font-extrabold text-[10px]"
                    >
                      تحميل النسخة PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
