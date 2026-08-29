"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 dark:bg-emerald-995 text-emerald-100 border-t-2 border-amber-500/30 pt-12 pb-6 relative overflow-hidden">
      {/* Visual Background Motifs */}
      <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">

          {/* Main Block Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-xl shadow-inner">
                ر
              </div>
              <span className="text-lg font-extrabold text-white">السادة الركابية</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">
              المنصة الرقمية الرسمية وبوابة البيانات الموحدة للسادة الركابية بجمهورية السودان. نسعى للحفاظ على التراث والأنساب، وترسيخ روح التضامن والتكافل.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-emerald-900 hover:bg-amber-500 hover:text-emerald-950 transition-all duration-200 text-emerald-200" title="فيسبوك">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3.3 0-5 1.7-5 5v2z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-emerald-900 hover:bg-amber-500 hover:text-emerald-950 transition-all duration-200 text-emerald-200" title="تويتر">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 border-r-2 border-amber-500 pr-2">روابط سريعة</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/about" className="text-emerald-200 hover:text-white transition-colors">عن الركابية ونسبهم</Link></li>
              <li><Link href="/genealogy" className="text-emerald-200 hover:text-white transition-colors">شجرة الأنساب التفاعلية</Link></li>
              <li><Link href="/directory" className="text-emerald-200 hover:text-white transition-colors">دليل الأسر والفروع</Link></li>
              <li><Link href="/database" className="text-emerald-200 hover:text-white transition-colors">قاعدة البيانات الرقمية</Link></li>
              <li><Link href="/financial-transparency" className="text-emerald-200 hover:text-white transition-colors">الشفافية المالية</Link></li>
            </ul>
          </div>

          {/* Services Hub */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 border-r-2 border-amber-500 pr-2">أمانة الخدمات</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/services" className="text-emerald-200 hover:text-white transition-colors">صندوق التكافل الأسري</Link></li>
              <li><Link href="/services" className="text-emerald-200 hover:text-white transition-colors">حسابات الزكاة والصدقات</Link></li>
              <li><Link href="/services" className="text-emerald-200 hover:text-white transition-colors">صندوق دعم الطلاب المتفوقين</Link></li>
              <li><Link href="/services" className="text-emerald-200 hover:text-white transition-colors">طلب المساعدة والرعاية العاجلة</Link></li>
              <li><Link href="/services" className="text-emerald-200 hover:text-white transition-colors">بنك الوظائف والتدريب المهني</Link></li>
            </ul>
          </div>

          {/* Communication Channels */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 border-r-2 border-amber-500 pr-2">اتصل بنا</h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/90 font-medium">
              <li className="flex items-center gap-2 justify-start">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>عطبرة، ولاية نهر النيل، جمهورية السودان</span>
              </li>
              <li className="flex items-center gap-2 justify-start">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr">+249 9123 45678</span>
              </li>
              <li className="flex items-center gap-2 justify-start">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@alrikabiyyah.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-emerald-900 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-emerald-300">
          <div className="flex items-center gap-1">
            <span>جميع الحقوق محفوظة © {year}</span>
            <span>•</span>
            <span className="text-white font-extrabold">المنصة الرقمية الرسمية للسادة الركابية</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span>شروط الاستخدام</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
