"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "استفسار عام",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            قنوات الاتصال المباشرة ولجان المحليات
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">اتصل بنا وقدم استفسارك</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            يسعدنا تواصلكم الدائم معنا. يمكنك مراسلة الأمانة العامة للمجلس الأعلى أو تقديم الشكاوى والاقتراحات مباشرة.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">

        {/* Contact Info (Right column, cols-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-foreground">قنوات التواصل المباشرة</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">المكتب الرئيسي للأمانة</h4>
                  <p className="text-xs text-muted-foreground font-semibold">عطبرة، ولاية نهر النيل، جمهورية السودان</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">رقم الهاتف الفعال</h4>
                  <p className="text-xs text-muted-foreground font-semibold" dir="ltr">+249 9123 45678</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">البريد الإلكتروني الرسمي</h4>
                  <p className="text-xs text-muted-foreground font-semibold">support@alrikabiyyah.org</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs font-semibold text-muted-foreground flex gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="leading-relaxed">
              جميع الرسائل والطلبات تخضع لمراجعة فورية من وحدة العلاقات العامة بالمجلس، ويتم تحويل الشكاوى والمظالم مباشرة للجنة القانونية العليا.
            </p>
          </div>
        </div>

        {/* Contact Form (Left column, cols-span-8) */}
        <div className="lg:col-span-8">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-foreground">تقديم طلب اتصال أو استفسار عاجل</h3>

            {submitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-4 text-center">
                <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h4 className="font-extrabold text-foreground text-sm">تم استلام رسالتكم بنجاح</h4>
                <p className="text-xs text-muted-foreground font-semibold">
                  شكراً لتواصلكم معنا. تم تسجيل المعاملة وسيقوم ممثلو مكتب السادة الركابية بالرد على استفساركم عبر الهاتف أو البريد المرفق خلال 48 ساعة كأقصى حد.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-all w-full"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">الاسم رباعي (كما في السجل المدني)</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                      placeholder="أدخل اسمك الكريم..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">رقم الهاتف للتواصل</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                      placeholder="مثال: 0912345678"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">البريد الإلكتروني الشخصي</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">موضوع وطبيعة الرسالة</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                  >
                    <option value="استفسار عام">استفسار عام وتكافل</option>
                    <option value="توثيق نسب وعائلة">توثيق نسب أو عائلة جديدة في الشجرة</option>
                    <option value="شكوى أو مقترح">تقديم شكوى أو اقتراح تحسيني</option>
                    <option value="تبرع أو اشتراك مال">دعم مالي أو اشتراك بالصندوق</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">تفاصيل الرسالة أو الشكوى</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden min-h-[120px]"
                    placeholder="ادخل تفاصيل رسالتك أو استفسارك هنا بكل دقة..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>إرسال الطلب للأمانة</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
