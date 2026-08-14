"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSiteStore } from "@/lib/state-store";
import { ShieldCheck, Heart, AlertCircle, Sparkles, Receipt, CheckCircle } from "lucide-react";

export default function Services() {
  const { services } = useSiteStore();
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nationalId: "",
    amount: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeServices = services && services.length > 0 ? services : [];

  const handleApply = (service: any) => {
    setSelectedService(service);
    setIsSubmitted(false);
    setFormData({
      name: "",
      phone: "",
      nationalId: "",
      amount: "",
      notes: "",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative py-12 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            بوابة التكافل الأسري والزكاة الموحدة
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">الخدمات الاجتماعية وصندوق التكافل</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            نظام متكامل لدعم الأسر المتعففة، تقديم مساهمات واشتراكات صندوق التكافل والزكاة والصدقات، وبنك التوظيف والتدريب المهني.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-12 text-right">

        {/* Services List Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="bg-card border border-border p-6 rounded-2xl shadow-xs text-right space-y-4 hover:border-primary/50 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                  قسم {service.category}
                </span>
                <h3 className="font-extrabold text-base text-foreground">{service.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  {service.description}
                </p>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium bg-muted/30 p-3 rounded-lg border border-border">
                  {service.details}
                </p>
              </div>

              <button
                onClick={() => handleApply(service)}
                className="mt-6 w-full text-center py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-extrabold transition-all shadow-xs"
              >
                {service.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Application Modal overlay */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full text-right space-y-5 animate-in fade-in zoom-in-95 duration-200 relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-400" />

              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="font-extrabold text-base text-foreground">{selectedService.title}</h4>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  إغلاق
                </button>
              </div>

              {isSubmitted ? (
                <div className="text-center p-6 space-y-4">
                  <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h5 className="font-extrabold text-foreground text-sm">تم إرسال طلبكم بنجاح</h5>
                  <p className="text-xs text-muted-foreground font-semibold">
                    تم استلام المعاملة وتوثيقها تحت الرمز المرجعي الآمن. سيقوم ممثلو لجنة التكافل بالفرع بالتواصل معكم قريباً للتحقق والتنفيذ الشرعي والمالي.
                  </p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-all"
                  >
                    موافق
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground">الاسم الكامل رباعي كما بالبطاقة الوطنية</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                      placeholder="محمد أحمد عثمان الركابي..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground">رقم الهاتف المحمول الفعال</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                      placeholder="0912345678"
                    />
                  </div>

                  {selectedService.category === "زكاة" || selectedService.category === "تبرعات" || selectedService.category === "اشتراكات" ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-foreground">المبلغ المقترح للتبرع / الاشتراك (جنيه سوداني)</label>
                      <input
                        type="number"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                        placeholder="أدخل قيمة المساهمة بالعملة المحلية..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-foreground">الرقم الوطني المكون من 11 رقماً</label>
                      <input
                        type="text"
                        required
                        value={formData.nationalId}
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden"
                        placeholder="101XXXXXXXX"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground">شروحات وملاحظات إضافية عاجلة</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary outline-hidden min-h-[70px]"
                      placeholder="تفاصيل التماس الرعاية أو طلب التمكين والمساعدة..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-emerald-800 text-primary-foreground rounded-lg text-xs font-extrabold transition-all"
                  >
                    تأكيد وإرسال المعاملة
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
