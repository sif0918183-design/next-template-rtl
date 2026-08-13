"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Compass, BookOpen, MapPin, Award, History, Heart, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Page Header banner */}
      <section className="relative py-12 md:py-16 bg-emerald-950 text-white text-right px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            تاريخ، قيم، وانتشار أصيل
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">عن السادة الركابية في السودان</h1>
          <p className="text-xs md:text-sm text-emerald-100/85 leading-relaxed font-semibold max-w-2xl">
            تعريف بالجد الجامع ونشأة الأسرة وقيمها الأساسية ورسالتها التنموية لرعاية ودعم الترابط المجتمعي في شتى البقاع.
          </p>
        </div>
      </section>

      {/* Main Grid content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-12 text-right">

        {/* Paragraph: Al-Kashf al-Tarikhi */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 border-r-4 border-primary pr-2.5">
            <History className="w-5 h-5 text-primary" />
            <span>التعريف والنسب التاريخي</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
            ينتسب السادة الركابية إلى الجد الجامع المغفور له بإذن الله <strong>الشيخ ركاب بن الشيخ غلام الله بن عايد</strong>، والذي يتصل نسبه الشريف بالدوحة النبوية المطهرة. قدم الشيخ غلام الله بن عايد من اليمن إلى السودان في القرن الثامن الهجري (نحو عام 1350 ميلادي) واستقر في منطقة دنقلا العجوز، حيث أسس منارتها التاريخية الشهيرة وعمل على نشر علوم القرآن الكريم والفقه والشريعة الإسلامية السمحة.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
            عقب ذلك، انتشر السادة الركابية في مختلف ولايات وأنحاء السودان كدعاة علم وهداية وإعمار، واشتهروا بتأسيس الخلاوي والمساجد الكبرى وحب الوطن وبناء اللبنات الأولى للتكافل الإنساني في المجتمع السوداني الأصيل.
          </p>
        </div>

        {/* Core Pillars: Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-foreground">رؤيتنا للمستقبل</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              بناء مجتمع رقمي موثق ومترابط بالكامل يحافظ على الهوية الأصيلة والتراث العلمي، ويرسخ قيم المودة والتنمية لخدمة جميع السودانيين.
            </p>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-foreground">رسالتنا السامية</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              تمكين الأسر والفروع عبر برامج التعليم المستمر والتكافل، حماية وتوثيق المخطوطات والأوقاف التاريخية، ومساعدة المعوزين والطلاب بكفاءة.
            </p>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-primary flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-foreground">القيم الراسخة</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              الأصالة الإسلامية، التلاحم والتكافل، الريادة العلمية والأكاديمية، النزاهة في التوثيق التاريخي، وحب الوطن وبنائه.
            </p>
          </div>
        </div>

        {/* Geo Distribution and expansion */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 border-r-4 border-primary pr-2.5">
            <MapPin className="w-5 h-5 text-primary" />
            <span>الانتشار الجغرافي والروابط</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
            يتوزع السادة الركابية اليوم في معظم ولايات جمهورية السودان؛ حيث تتركز كتلتهم التاريخية العريقة في <strong>الولاية الشمالية</strong> (دنقلا العجوز، الغابة، الدبة)، تليها ولاية <strong>نهر النيل</strong> (شندي، المتمة، عطبرة)، بالإضافة إلى وجود واسع ومؤثر في ولايات <strong>الخرطوم</strong> بمحلياتها الثلاث، وولاية <strong>الجزيرة</strong>، القضارف، النيل الأبيض، وغيرها من مدن وبقاع السودان الحبيب.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
            وقد نشأت مجالس ولجان فروع منسقة في كل ولاية لضمان رعاية مصالح الأسر، وتسهيل مشاريع التواصل كحصر النسب وتوثيقه، والزواج الجماعي التكافلي وكفالة الطلاب المعسرين.
          </p>
        </div>

        {/* Organizational Achievements */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 border-r-4 border-primary pr-2.5">
            <Award className="w-5 h-5 text-primary" />
            <span>الجهد المؤسسي والأكاديمي</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>توثيق أكثر من 8950 أسرة سودانية ركابية رقمیّاً.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>تأهيل ورعاية 12 مجمعاً وخلوة قرآنية أثرية.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>تقديم أكثر من 1500 منحة أكاديمية للطلاب المتميزين.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>توفير الرعاية الغذائية والصحية العاجلة لمتضرري الحرب.</span>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
