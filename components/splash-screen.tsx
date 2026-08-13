"use client";

import React, { useState, useEffect } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in the current session
    const hasShown = sessionStorage.getItem("rikabi_splash_shown_v2");
    if (!hasShown) {
      // Defer showing to avoid synchronous state-in-effect linter triggers
      const showTimer = setTimeout(() => {
        setVisible(true);
      }, 50);

      const hideTimer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("rikabi_splash_shown_v2", "true");
      }, 3550);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-radial from-emerald-950 via-emerald-900 to-black text-white p-4 animate-fade-in transition-all duration-1000">
      <div className="absolute inset-0 bg-[radial-gradient(#e0a96d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08]" />

      <div className="relative flex flex-col items-center text-center max-w-lg w-full px-6">
        {/* Elegant Arabesque Star Motif */}
        <div className="w-28 h-28 md:w-36 md:h-36 relative mb-6 animate-pulse flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-amber-400 rotate-45 rounded-lg opacity-40" />
          <div className="absolute inset-0 border-2 border-amber-300 rotate-12 rounded-lg opacity-60" />
          <div className="absolute inset-0 border-2 border-amber-500 -rotate-30 rounded-lg opacity-30" />
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-2xl md:text-3xl shadow-xl shadow-amber-500/10">
            ر
          </div>
        </div>

        {/* Traditional Gold Embossed Calligraphy & Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
          السادة الركابية
        </h1>
        <p className="text-amber-300/90 text-sm md:text-base font-medium tracking-widest mb-6 border-y border-amber-500/20 py-2 w-full">
          المنصة الرقمية الرسمية — السودان
        </p>

        <p className="text-emerald-100/80 text-xs md:text-sm italic leading-relaxed max-w-sm">
          &ldquo;نسبٌ عريق وعلمٌ وثيق وتكافلٌ مستمر يجمعنا على مر العصور&rdquo;
        </p>

        {/* Loading Spinner */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
          <span className="text-xs text-amber-200/50">جاري تحميل البوابة الرسمية...</span>
        </div>
      </div>
    </div>
  );
}
