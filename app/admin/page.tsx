"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSiteStore, SiteTexts, PhotoItem, VideoItem } from "@/lib/state-store";
import { Person, NewsItem, EventItem, ServiceItem } from "@/lib/mock-data";
import {
  Shield,
  Edit3,
  Plus,
  Trash2,
  RefreshCw,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Video,
  Users,
  Heart,
  Save,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    isLoaded,
    siteTexts,
    people,
    news,
    events,
    services,
    geoStats,
    photos,
    videos,
    updateSiteTexts,
    updatePeople,
    updateNews,
    updateEvents,
    updateServices,
    updateGeoStats,
    updatePhotos,
    updateVideos,
    resetToDefault,
  } = useSiteStore();

  const [isAdmin, setIsAdmin] = useState(true); // Default to unlocked for immediate testing
  const [activeTab, setActiveTab] = useState<"texts" | "news" | "media" | "people" | "services">("texts");
  const [successMsg, setSuccessMsg] = useState("");

  // News State Editor Form
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
    title: "",
    category: "أخبار رسمية",
    summary: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Media (Photo) State Editor Form
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState<Partial<PhotoItem>>({
    title: "",
    desc: "",
    tag: "رسمي",
    image: "",
  });

  // Media (Video) State Editor Form
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({
    title: "",
    desc: "",
    url: "",
  });

  // People / Member State Editor Form
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [personForm, setPersonForm] = useState<Partial<Person>>({
    name: "",
    title: "",
    bio: "",
    state: "الخرطوم",
    locality: "",
    village: "",
    branch: "",
    family: "",
    isRegistered: true,
  });

  // Text Inputs
  const [textsForm, setTextsForm] = useState<SiteTexts>({ ...siteTexts });

  React.useEffect(() => {
    if (isLoaded) {
      setTextsForm({ ...siteTexts });
    }
  }, [isLoaded, siteTexts]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // --- ACTIONS: SITE TEXTS ---
  const handleSaveTexts = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteTexts(textsForm);
    triggerSuccess("تم حفظ النصوص وإعدادات الموقع بنجاح!");
  };

  // --- ACTIONS: NEWS ---
  const handleEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNewsForm(item);
  };

  const handleAddNewNews = () => {
    setEditingNewsId("new");
    setNewsForm({
      title: "",
      category: "أخبار رسمية",
      summary: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.summary) return;

    if (editingNewsId === "new") {
      const newItem: NewsItem = {
        id: "news-" + Date.now(),
        title: newsForm.title || "",
        summary: newsForm.summary || "",
        content: newsForm.content || "",
        category: newsForm.category as any,
        date: newsForm.date || new Date().toISOString().split("T")[0],
      };
      updateNews([newItem, ...news]);
      triggerSuccess("تم نشر الخبر الجديد بنجاح!");
    } else {
      const updated = news.map((n) => (n.id === editingNewsId ? { ...n, ...newsForm } as NewsItem : n));
      updateNews(updated);
      triggerSuccess("تم تحديث الخبر بنجاح!");
    }
    setEditingNewsId(null);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الخبر؟")) {
      updateNews(news.filter((n) => n.id !== id));
      triggerSuccess("تم حذف الخبر بنجاح.");
    }
  };

  // --- ACTIONS: PHOTOS ---
  const handleEditPhoto = (item: PhotoItem) => {
    setEditingPhotoId(item.id);
    setPhotoForm(item);
  };

  const handleAddNewPhoto = () => {
    setEditingPhotoId("new");
    setPhotoForm({ title: "", desc: "", tag: "أثرية", image: "" });
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title) return;

    if (editingPhotoId === "new") {
      const newItem: PhotoItem = {
        id: "photo-" + Date.now(),
        title: photoForm.title || "",
        desc: photoForm.desc || "",
        tag: photoForm.tag || "عام",
        image: photoForm.image,
      };
      updatePhotos([newItem, ...photos]);
      triggerSuccess("تمت إضافة الصورة الجديدة للمعرض!");
    } else {
      const updated = photos.map((p) => (p.id === editingPhotoId ? { ...p, ...photoForm } as PhotoItem : p));
      updatePhotos(updated);
      triggerSuccess("تمت تعديل تفاصيل الصورة بنجاح!");
    }
    setEditingPhotoId(null);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm("هل تريد حذف هذه الصورة من الأرشيف؟")) {
      updatePhotos(photos.filter((p) => p.id !== id));
      triggerSuccess("تم حذف الصورة.");
    }
  };

  // --- ACTIONS: VIDEOS ---
  const handleEditVideo = (item: VideoItem) => {
    setEditingVideoId(item.id);
    setVideoForm(item);
  };

  const handleAddNewVideo = () => {
    setEditingVideoId("new");
    setVideoForm({ title: "", desc: "", url: "" });
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.url) return;

    if (editingVideoId === "new") {
      const newItem: VideoItem = {
        id: "video-" + Date.now(),
        title: videoForm.title || "",
        desc: videoForm.desc || "",
        url: videoForm.url || "",
      };
      updateVideos([newItem, ...videos]);
      triggerSuccess("تمت إضافة الفيديو الجديد بنجاح!");
    } else {
      const updated = videos.map((v) => (v.id === editingVideoId ? { ...v, ...videoForm } as VideoItem : v));
      updateVideos(updated);
      triggerSuccess("تم تحديث الفيديو بنجاح!");
    }
    setEditingVideoId(null);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("هل تريد حذف هذا الفيديو؟")) {
      updateVideos(videos.filter((v) => v.id !== id));
      triggerSuccess("تم حذف الفيديو.");
    }
  };

  // --- ACTIONS: PEOPLE / MEMBERS ---
  const handleEditPerson = (p: Person) => {
    setEditingPersonId(p.id);
    setPersonForm(p);
  };

  const handleAddNewPerson = () => {
    setEditingPersonId("new");
    setPersonForm({
      name: "",
      title: "",
      bio: "",
      state: "الخرطوم",
      locality: "",
      village: "",
      branch: "",
      family: "",
      isRegistered: true,
    });
  };

  const handleSavePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personForm.name || !personForm.family) return;

    if (editingPersonId === "new") {
      const newItem: Person = {
        id: "person-" + Date.now(),
        name: personForm.name || "",
        title: personForm.title || "",
        bio: personForm.bio || "",
        state: personForm.state || "الخرطوم",
        locality: personForm.locality || "",
        village: personForm.village || "",
        branch: personForm.branch || "",
        family: personForm.family || "",
        isRegistered: personForm.isRegistered ?? true,
      };
      updatePeople([newItem, ...people]);
      triggerSuccess("تمت إضافة العضو الجديد لقاعدة البيانات والشجرة!");
    } else {
      const updated = people.map((p) => (p.id === editingPersonId ? { ...p, ...personForm } as Person : p));
      updatePeople(updated);
      triggerSuccess("تم تحديث بيانات العضو بنجاح!");
    }
    setEditingPersonId(null);
  };

  const handleDeletePerson = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العضو بالكامل؟")) {
      updatePeople(people.filter((p) => p.id !== id));
      triggerSuccess("تم حذف العضو بنجاح.");
    }
  };

  const handleReset = () => {
    if (confirm("هل تريد إعادة تعيين كافة البيانات المكتوبة والمنشورة لوضعها الافتراضي للموقع؟")) {
      resetToDefault();
      triggerSuccess("تمت إعادة تعيين الموقع بنجاح!");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-sm font-bold">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header Panel */}
      <section className="relative py-12 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white text-right px-4 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-emerald-950">
              <Shield className="w-3 h-3" /> لوحة الإدارة الشاملة للمدير العام
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold">التحكم والتوثيق المركزي</h1>
            <p className="text-xs text-emerald-100/80 font-medium">
              مرحبًا بك في واجهة الإدارة الاحترافية. تمكنك هذه اللوحة من تعديل جميع نصوص الموقع، نشر الأخبار، التحكم بمعرض الوسائط، وتعديل سجل الأنساب.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-destructive/25 border border-destructive/40 hover:bg-destructive text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>إعادة تعيين الافتراضي</span>
            </button>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                isAdmin ? "bg-amber-500 text-emerald-950 hover:bg-amber-400" : "bg-emerald-800 text-white"
              }`}
            >
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isAdmin ? "وضع المدير نشط" : "تفعيل الإدارة"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 space-y-8 text-right">
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!isAdmin ? (
          <div className="bg-card border border-border p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto shadow-xl">
            <Lock className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-extrabold text-foreground">الوصول مقيد</h3>
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              يرجى النقر على زر "تفعيل الإدارة" بالأعلى لتشغيل لوحة التحكم ومراجعة التغييرات فوراً.
            </p>
            <button
              onClick={() => setIsAdmin(true)}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary-hover transition-colors"
            >
              تنشيط الدخول الفوري
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Control Navigation Tabs */}
            <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-4 space-y-2">
              <p className="text-[10px] text-muted-foreground font-extrabold px-3 uppercase tracking-wider mb-2">
                أقسام لوحة التحكم
              </p>
              <button
                onClick={() => { setActiveTab("texts"); setEditingNewsId(null); setEditingPhotoId(null); setEditingVideoId(null); setEditingPersonId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-right transition-colors ${
                  activeTab === "texts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>نصوص الموقع والواجهة</span>
              </button>
              <button
                onClick={() => { setActiveTab("news"); setEditingNewsId(null); setEditingPhotoId(null); setEditingVideoId(null); setEditingPersonId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-right transition-colors ${
                  activeTab === "news" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>الأخبار والبيانات ({news.length})</span>
              </button>
              <button
                onClick={() => { setActiveTab("media"); setEditingNewsId(null); setEditingPhotoId(null); setEditingVideoId(null); setEditingPersonId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-right transition-colors ${
                  activeTab === "media" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>معرض الصور والفيديو</span>
              </button>
              <button
                onClick={() => { setActiveTab("people"); setEditingNewsId(null); setEditingPhotoId(null); setEditingVideoId(null); setEditingPersonId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-right transition-colors ${
                  activeTab === "people" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>سجل الأنساب والنسب ({people.length})</span>
              </button>
              <button
                onClick={() => { setActiveTab("services"); setEditingNewsId(null); setEditingPhotoId(null); setEditingVideoId(null); setEditingPersonId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-right transition-colors ${
                  activeTab === "services" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Heart className="w-4 h-4 shrink-0" />
                <span>بوابة التكافل والخدمات</span>
              </button>
            </div>

            {/* Editing Panel (cols-span-9) */}
            <div className="lg:col-span-9 bg-card border border-border rounded-2xl p-6 min-h-[450px]">

              {/* TAB 1: SITE TEXTS */}
              {activeTab === "texts" && (
                <form onSubmit={handleSaveTexts} className="space-y-5">
                  <h3 className="font-extrabold text-base text-foreground border-b border-border pb-3">
                    تعديل نصوص الصفحة الرئيسية والواجهة
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground">وسم / شارة الهيرو العليا</label>
                        <input
                          type="text"
                          value={textsForm.heroBadge}
                          onChange={(e) => setTextsForm({ ...textsForm, heroBadge: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground">عنوان لوجو الهيرو الجانبي</label>
                        <input
                          type="text"
                          value={textsForm.heroLogoTitle}
                          onChange={(e) => setTextsForm({ ...textsForm, heroLogoTitle: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">العنوان الرئيسي للترحيب (Hero Title)</label>
                      <input
                        type="text"
                        value={textsForm.heroTitle}
                        onChange={(e) => setTextsForm({ ...textsForm, heroTitle: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">النص الترحيبي الفرعي بالكامل (Hero Subtitle)</label>
                      <textarea
                        value={textsForm.heroSubtitle}
                        rows={4}
                        onChange={(e) => setTextsForm({ ...textsForm, heroSubtitle: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground">عنوان صندوق التنبيهات العام</label>
                        <input
                          type="text"
                          value={textsForm.warningTitle}
                          onChange={(e) => setTextsForm({ ...textsForm, warningTitle: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground">عنوان فرعي للوجو الهيرو</label>
                        <input
                          type="text"
                          value={textsForm.heroLogoSubtitle}
                          onChange={(e) => setTextsForm({ ...textsForm, heroLogoSubtitle: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">نص التنبيه أو البيان المستعجل الملون بالأصفر</label>
                      <textarea
                        value={textsForm.warningText}
                        rows={3}
                        onChange={(e) => setTextsForm({ ...textsForm, warningText: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden leading-relaxed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-extrabold flex items-center gap-2 transition-colors mt-4"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات النصية فوراً</span>
                  </button>
                </form>
              )}

              {/* TAB 2: NEWS & STATEMENTS */}
              {activeTab === "news" && (
                <div className="space-y-6">
                  {editingNewsId === null ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <h3 className="font-extrabold text-base text-foreground">إدارة الأخبار والبيانات الرسمية</h3>
                        <button
                          onClick={handleAddNewNews}
                          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة خبر جديد</span>
                        </button>
                      </div>

                      <div className="divide-y divide-border">
                        {news.map((item) => (
                          <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-primary px-2 py-0.5 rounded font-bold">
                                {item.category}
                              </span>
                              <h4 className="font-extrabold text-sm text-foreground">{item.title}</h4>
                              <p className="text-[11px] text-muted-foreground line-clamp-1">{item.summary}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleEditNews(item)}
                                className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="تعديل"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNews(item.id)}
                                className="p-2 border border-border rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveNews} className="space-y-4">
                      <h3 className="font-extrabold text-sm text-foreground">
                        {editingNewsId === "new" ? "إضافة خبر رسمي جديد" : "تعديل تفاصيل الخبر"}
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">عنوان الخبر</label>
                            <input
                              type="text"
                              required
                              value={newsForm.title}
                              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">التصنيف</label>
                            <select
                              value={newsForm.category}
                              onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            >
                              <option value="أخبار رسمية">أخبار رسمية</option>
                              <option value="مناسبات">مناسبات</option>
                              <option value="بيان رسمي">بيان رسمي</option>
                              <option value="توعية">توعية</option>
                              <option value="تاريخ">تاريخ</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground">ملخص الخبر المختصر (يظهر بالرئيسية)</label>
                          <input
                            type="text"
                            required
                            value={newsForm.summary}
                            onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground">محتوى وتفاصيل الخبر بالكامل</label>
                          <textarea
                            rows={6}
                            value={newsForm.content}
                            onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1 max-w-xs">
                          <label className="text-[11px] font-bold text-muted-foreground">تاريخ النشر</label>
                          <input
                            type="date"
                            value={newsForm.date}
                            onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-bold"
                        >
                          نشر وحفظ التغيير
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNewsId(null)}
                          className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-xs font-bold"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: PHOTOS & VIDEOS */}
              {activeTab === "media" && (
                <div className="space-y-8">
                  {/* PHOTOS SUBSECTION */}
                  <div className="space-y-4">
                    {editingPhotoId === null ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <h3 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            <span>إدارة معرض الصور ومعالم التراث</span>
                          </h3>
                          <button
                            onClick={handleAddNewPhoto}
                            className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>إضافة صورة</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {photos.map((item) => (
                            <div key={item.id} className="p-4 border border-border rounded-xl bg-muted/20 flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-extrabold">
                                  {item.tag}
                                </span>
                                <h4 className="font-bold text-xs text-foreground">{item.title}</h4>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleEditPhoto(item)}
                                  className="p-1.5 border border-border rounded bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePhoto(item.id)}
                                  className="p-1.5 border border-border rounded bg-card hover:bg-destructive/10 text-destructive transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSavePhoto} className="space-y-4">
                        <h3 className="font-extrabold text-sm text-foreground">
                          {editingPhotoId === "new" ? "إضافة صورة جديدة للمعرض" : "تعديل تفاصيل الصورة"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">عنوان الصورة</label>
                            <input
                              type="text"
                              required
                              value={photoForm.title}
                              onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">الوسم / القسم</label>
                            <input
                              type="text"
                              value={photoForm.tag}
                              onChange={(e) => setPhotoForm({ ...photoForm, tag: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                              placeholder="تراث، أوقاف، رسمي..."
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground">شرح تفصيلي عن الصورة</label>
                          <textarea
                            value={photoForm.desc}
                            onChange={(e) => setPhotoForm({ ...photoForm, desc: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground">رابط مسار الصورة (اختياري - أو تترك افتراضية)</label>
                          <input
                            type="text"
                            value={photoForm.image}
                            onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden text-left"
                            dir="ltr"
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
                            حفظ الصورة
                          </button>
                          <button type="button" onClick={() => setEditingPhotoId(null)} className="px-4 py-2 border border-border text-foreground rounded-lg text-xs font-bold">
                            إلغاء
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* VIDEOS SUBSECTION */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    {editingVideoId === null ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <h3 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                            <Video className="w-5 h-5 text-primary" />
                            <span>إدارة وثائقيات ومقاطع فيديو الطائفة</span>
                          </h3>
                          <button
                            onClick={handleAddNewVideo}
                            className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>إضافة فيديو</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {videos.map((item) => (
                            <div key={item.id} className="p-4 border border-border rounded-xl bg-muted/20 flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-bold text-xs text-foreground">{item.title}</h4>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                                <span className="text-[9px] text-primary hover:underline block truncate max-w-[200px]" dir="ltr">
                                  {item.url}
                                </span>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleEditVideo(item)}
                                  className="p-1.5 border border-border rounded bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(item.id)}
                                  className="p-1.5 border border-border rounded bg-card hover:bg-destructive/10 text-destructive transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveVideo} className="space-y-4">
                        <h3 className="font-extrabold text-sm text-foreground">
                          {editingVideoId === "new" ? "إضافة وثائقي مرئي جديد" : "تعديل تفاصيل الفيديو"}
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-muted-foreground">عنوان الفيديو</label>
                              <input
                                type="text"
                                required
                                value={videoForm.title}
                                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-muted-foreground">رابط فيديو البث المباشر / يوتيوب</label>
                              <input
                                type="text"
                                required
                                value={videoForm.url}
                                onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden text-left"
                                dir="ltr"
                                placeholder="https://youtube.com/watch?v=..."
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">وصف ملخص لمحتوى المقطع</label>
                            <textarea
                              value={videoForm.desc}
                              onChange={(e) => setVideoForm({ ...videoForm, desc: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
                            حفظ الفيديو
                          </button>
                          <button type="button" onClick={() => setEditingVideoId(null)} className="px-4 py-2 border border-border text-foreground rounded-lg text-xs font-bold">
                            إلغاء
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: GENEALOGY & PEOPLE */}
              {activeTab === "people" && (
                <div className="space-y-6">
                  {editingPersonId === null ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <h3 className="font-extrabold text-base text-foreground">سجل شجرة أنساب السادة الركابية</h3>
                        <button
                          onClick={handleAddNewPerson}
                          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة فرد للشجرة</span>
                        </button>
                      </div>

                      <div className="divide-y divide-border max-h-[500px] overflow-y-auto pr-2">
                        {people.map((p) => (
                          <div key={p.id} className="py-3 flex items-center justify-between gap-4 hover:bg-muted/10 px-2 rounded transition-colors">
                            <div className="space-y-0.5 text-right">
                              <h4 className="font-bold text-xs text-foreground flex items-center gap-1">
                                <span>{p.name}</span>
                                {p.title && <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">({p.title})</span>}
                              </h4>
                              <p className="text-[10px] text-muted-foreground">
                                الفرع: {p.branch || "غير مسجل"} • العائلة: {p.family} • الولاية: {p.state}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleEditPerson(p)}
                                className="p-1.5 border border-border rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePerson(p.id)}
                                className="p-1.5 border border-border rounded hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSavePerson} className="space-y-4">
                      <h3 className="font-extrabold text-sm text-foreground">
                        {editingPersonId === "new" ? "إضافة فرد جديد لسجل الأنساب" : "تعديل تفاصيل العضو التاريخي/الحالي"}
                      </h3>

                      <div className="space-y-3 text-right">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">الاسم بالكامل</label>
                            <input
                              type="text"
                              required
                              value={personForm.name}
                              onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">اللقب أو الصفة المهنية</label>
                            <input
                              type="text"
                              value={personForm.title}
                              onChange={(e) => setPersonForm({ ...personForm, title: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">الولاية السودانية</label>
                            <input
                              type="text"
                              value={personForm.state}
                              onChange={(e) => setPersonForm({ ...personForm, state: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">المحلية</label>
                            <input
                              type="text"
                              value={personForm.locality}
                              onChange={(e) => setPersonForm({ ...personForm, locality: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">البلدة / القرية</label>
                            <input
                              type="text"
                              value={personForm.village}
                              onChange={(e) => setPersonForm({ ...personForm, village: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">فرع القبيلة (مثل: الحبيباب، الحليماب...)</label>
                            <input
                              type="text"
                              value={personForm.branch}
                              onChange={(e) => setPersonForm({ ...personForm, branch: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">بيت العائلة / الحوش</label>
                            <input
                              type="text"
                              required
                              value={personForm.family}
                              onChange={(e) => setPersonForm({ ...personForm, family: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-muted-foreground">نبذة وسيرة ذاتية (تاريخية أو معاصرة)</label>
                          <textarea
                            rows={3}
                            value={personForm.bio}
                            onChange={(e) => setPersonForm({ ...personForm, bio: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">معرّف الوالد في الشجرة (Id الوالد إن وجد)</label>
                            <input
                              type="text"
                              value={personForm.fatherId || ""}
                              onChange={(e) => setPersonForm({ ...personForm, fatherId: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden text-left"
                              dir="ltr"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">سنة الميلاد (أو الفترة تاريخياً)</label>
                            <input
                              type="text"
                              value={personForm.birthYear || ""}
                              onChange={(e) => setPersonForm({ ...personForm, birthYear: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground">سنة الوفاة (أو تترك خالية للحاليين)</label>
                            <input
                              type="text"
                              value={personForm.deathYear || ""}
                              onChange={(e) => setPersonForm({ ...personForm, deathYear: e.target.value })}
                              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
                          حفظ الفرد
                        </button>
                        <button type="button" onClick={() => setEditingPersonId(null)} className="px-4 py-2 border border-border text-foreground rounded-lg text-xs font-bold">
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 5: SERVICES & SOCIAL TAKAFUL */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-extrabold text-base text-foreground">بوابة الخدمات الاجتماعية والتكافل</h3>
                    <button
                      onClick={() => alert("لإضافة قطاع تمويلي أو خدمة اجتماعية معينة، يرجى التواصل مع الأمانة التقنية للمنصة.")}
                      className="px-4 py-2 bg-primary text-primary-foreground hover:bg-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة خدمة تضامنية</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-4 border border-border rounded-xl space-y-2 bg-muted/10">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-foreground">{srv.title}</h4>
                          <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-extrabold">
                            {srv.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{srv.description}</p>
                        <input
                          type="text"
                          value={srv.ctaText}
                          onChange={(e) => {
                            const updated = services.map(s => s.id === srv.id ? { ...s, ctaText: e.target.value } : s);
                            updateServices(updated);
                          }}
                          className="w-full p-2 border border-border bg-background rounded text-[10px] font-bold"
                          placeholder="تعديل نص زر الطلب..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
