"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SplashScreen } from "@/components/splash-screen";
import {
  globalStatistics,
  newsDatabase,
  eventsDatabase,
  servicesDatabase,
} from "@/lib/mock-data";
import {
  Users2,
  MapPin,
  Calendar,
  Building,
  ArrowLeft,
  Search,
  BookOpen,
  Award,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Splash/Welcome Screen */}
      <SplashScreen />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 md:py-24 px-4">
        {/* Pattern backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06]" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-right">
          {/* Right column: Intro Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 border border-amber-300">
              بوابة النسب والعلم والتكافل
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight md:leading-normal">
              منصة{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                السادة الركابية
              </span>{" "}
              الرقمية الموحدة في السودان
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-emerald-100/95 font-medium max-w-xl">
              أهلاً بكم في المنصة والديوان الرقمي الرسمي الجامع لأبناء السادة
              الركابية في جمهورية السودان وخارجها. نافذة تواصلية ومؤسسية تعنى
              بشجرة الأنساب الموثقة، السجل المدني والمهني، والخدمات الاجتماعية
              والتكافلية المتكاملة.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/genealogy"
                className="px-6 py-3 rounded-lg text-sm font-bold bg-amber-500 text-emerald-950 hover:bg-amber-400 transition-all shadow-md flex items-center gap-2"
              >
                <span>تصفح شجرة الأنساب</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                href="/database"
                className="px-6 py-3 rounded-lg text-sm font-bold border border-emerald-300/30 bg-emerald-900/40 hover:bg-emerald-900/70 transition-all text-white flex items-center gap-2"
              >
                <span>البحث في قاعدة البيانات</span>
                <Search className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Left column: Visual Star Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center p-6 border-2 border-amber-500/15 rounded-full bg-emerald-950/40 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-0 border border-amber-400 rotate-45 rounded-lg opacity-20" />
              <div className="absolute inset-0 border border-amber-400 -rotate-45 rounded-lg opacity-20" />
              <div className="w-60 h-60 rounded-full border-2 border-amber-500/30 flex flex-col items-center justify-center text-center p-4">
                <span className="text-xs text-amber-400/80 tracking-widest uppercase font-bold mb-1">
                  شعار الأمانة العامة
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  مجتمع وتكافل وتوثيق
                </h3>
                <span className="text-[10px] text-emerald-200/80 leading-relaxed font-semibold max-w-[200px]">
                  سند دائم يربط الأسر والمحليات بفروعها في شتى أنحاء القطر
                  السوداني الحبيب
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Statistics Board */}
        <section className="space-y-6">
          <div className="text-right space-y-1">
            <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2 justify-start">
              <TrendingUp className="w-5.5 h-5.5 text-primary" />
              <span>مؤشرات السجل والإحصائيات العامة</span>
            </h2>
            <p className="text-xs text-muted-foreground font-semibold">
              بيانات موثقة مرصودة وقابلة للتحديث المستمر لتسهيل التنمية والتواصل
              الأسري.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-xl shadow-xs text-right space-y-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary">
                <Users2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-muted-foreground">عدد الأعضاء المسجلين</p>
              <h3 className="text-2xl font-extrabold text-foreground" dir="ltr">
                +{globalStatistics.totalRegisteredMembers.toLocaleString()}
              </h3>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-xs text-right space-y-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary">
                <Building className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-muted-foreground">عدد الأسر والعوائل</p>
              <h3 className="text-2xl font-extrabold text-foreground" dir="ltr">
                +{globalStatistics.totalFamiliesCount.toLocaleString()}
              </h3>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-xs text-right space-y-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-muted-foreground">عدد الفروع والروابط</p>
              <h3 className="text-2xl font-extrabold text-foreground" dir="ltr">
                +{globalStatistics.totalBranchesCount.toLocaleString()}
              </h3>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-xs text-right space-y-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-muted-foreground">العلماء والأكاديميون</p>
              <h3 className="text-2xl font-extrabold text-foreground" dir="ltr">
                +{ (globalStatistics.scholarsCount + globalStatistics.academicsCount).toLocaleString() }
              </h3>
            </div>
          </div>
        </section>

        {/* Highlighted Alerts & Bulletins */}
        <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-right">
            <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">تنبيه هام ومستعجل للأعضاء</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
                نهيب بالسادة الكرام ضرورة تحديث بيانات فروع عائلاتهم والمحليات المسجلين بها لضمان كفاءة وصول الدعم من صندوق التكافل العاجل.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 self-end md:self-center"
          >
            تحديث البيانات الآن
          </Link>
        </section>

        {/* News Feed Matrix & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* News Stream (Right column) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">
                آخر الأخبار والتقارير
              </h2>
              <Link href="/media" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span>عرض الكل</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsDatabase.map((news) => (
                <div
                  key={news.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200 text-right flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-primary">
                      {news.category}
                    </span>
                    <h3 className="font-extrabold text-base text-foreground leading-snug hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                  <div className="px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>تاريخ: {news.date}</span>
                    <Link href="/media" className="text-primary hover:underline flex items-center gap-1">
                      <span>اقرأ المزيد</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Stream (Left column) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">
                الفعاليات القادمة
              </h2>
            </div>

            <div className="space-y-4">
              {eventsDatabase.map((event) => (
                <div
                  key={event.id}
                  className="bg-card border border-border p-4 rounded-xl shadow-xs text-right space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      event.isUpcoming
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {event.isUpcoming ? "قريب جداً" : "فعالية سابقة"}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{event.date}</span>
                    </div>
                  </div>
                  <h4 className="font-extrabold text-sm text-foreground hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-[10px] text-muted-foreground font-semibold pt-1 border-t border-border flex items-center justify-between">
                    <span>الوقت: {event.time}</span>
                    <span className="text-amber-600 truncate max-w-[150px]">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Quick Social Action Services Directory */}
        <section className="space-y-6">
          <div className="text-right">
            <h2 className="text-xl font-extrabold text-foreground border-r-4 border-primary pr-2.5">
              بوابة التكافل والخدمات السريعة
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-semibold">
              اختر إحدى الخدمات الاجتماعية المتاحة لتقديم الدعم أو الاستفسار أو طلب المساعدات العاجلة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesDatabase.map((service) => (
              <div
                key={service.id}
                className="bg-card border border-border p-5 rounded-xl shadow-xs text-right flex flex-col justify-between items-start hover:border-primary/50 transition-colors"
              >
                <div className="space-y-3 w-full">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                    قسم {service.category}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    {service.description}
                  </p>
                </div>
                <Link
                  href="/services"
                  className="mt-5 w-full text-center py-2 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-bold transition-all"
                >
                  {service.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
