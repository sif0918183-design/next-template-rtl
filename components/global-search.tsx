"use client";

import React, { useState } from "react";
import { Search, X, BookOpen, Users, Newspaper } from "lucide-react";
import Link from "next/link";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 dir-rtl text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-300 w-full">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الأنساب، الأخبار، أو الأسر..."
              className="bg-transparent w-full text-xs text-white focus:outline-none placeholder-slate-500"
              autoFocus
            />
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 text-center text-slate-500 text-xs space-y-1">
          <p className="font-semibold text-slate-400">البحث الحركي المباشر في قاعدة البيانات</p>
          <p className="text-[11px] text-slate-600">اكتب كلمة البحث للوصول المباشر إلى السجلات المعتمدة.</p>
        </div>
      </div>
    </div>
  );
}
