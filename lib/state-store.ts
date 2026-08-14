"use client";

import { useEffect, useState } from "react";
import {
  peopleDatabase as initialPeople,
  geographicStats as initialGeographicStats,
  newsDatabase as initialNews,
  eventsDatabase as initialEvents,
  servicesDatabase as initialServices,
  Person,
  StateStats,
  NewsItem,
  EventItem,
  ServiceItem,
} from "./mock-data";

export interface SiteTexts {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroLogoTitle: string;
  heroLogoSubtitle: string;
  warningTitle: string;
  warningText: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  image?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  desc: string;
  url: string;
}

const DEFAULT_TEXTS: SiteTexts = {
  heroBadge: "بوابة النسب والعلم والتكافل",
  heroTitle: "منصة السادة الركابية الرقمية الموحدة في السودان",
  heroSubtitle: "أهلاً بكم في المنصة والديوان الرقمي الرسمي الجامع لأبناء السادة الركابية في جمهورية السودان وخارجها. نافذة تواصلية ومؤسسية تعنى بشجرة الأنساب الموثقة، السجل المدني والمهني، والخدمات الاجتماعية والتكافلية المتكاملة.",
  heroLogoTitle: "مجتمع وتكافل وتوثيق",
  heroLogoSubtitle: "سند دائم يربط الأسر والمحليات بفروعها في شتى أنحاء القطر السوداني الحبيب",
  warningTitle: "تنبيه هام ومستعجل للأعضاء",
  warningText: "نهيب بالسادة الكرام ضرورة تحديث بيانات فروع عائلاتهم والمحليات المسجلين بها لضمان كفاءة وصول الدعم من صندوق التكافل العاجل.",
};

const DEFAULT_PHOTOS: PhotoItem[] = [
  { id: "p-1", title: "خلوة دنقلا العجوز الأثرية للقرآن", desc: "بناء تاريخي عريق يمتد لأكثر من 500 عام.", tag: "تراث" },
  { id: "p-2", title: "صورة جماعية لملتقى السادة بنهر النيل", desc: "حضور لافت ومناقشات حول كفالة الأسر.", tag: "رسمي" },
  { id: "p-3", title: "أوقاف ومسجد السادة الركابية ببحري", desc: "منارة دينية واجتماعية وثقافية كبرى.", tag: "أوقاف" }
];

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: "v-1", title: "وثائقي: رحلة الشيخ غلام الله بن عايد", desc: "شرح مرئي مفصل لأول من أدخل الخلاوي الكبرى للسودان.", url: "https://www.youtube.com" },
  { id: "v-2", title: "تقرير مصور: تدشين المرحلة الرابعة لصندوق التكافل", desc: "تغطية ميدانية لتوزيع كفالة الأيتام للأسر والوافدين.", url: "https://www.youtube.com" }
];

// Helper to broadcast storage changes
const STORAGE_EVENT = "rikabiya_store_change";

export function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading localStorage", error);
    return defaultValue;
  }
}

export function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Trigger local event so other components on same page update
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch (error) {
    console.error("Error writing localStorage", error);
  }
}

export function useSiteStore() {
  const [siteTexts, setSiteTextsState] = useState<SiteTexts>(DEFAULT_TEXTS);
  const [people, setPeopleState] = useState<Person[]>(initialPeople);
  const [news, setNewsState] = useState<NewsItem[]>(initialNews);
  const [events, setEventsState] = useState<EventItem[]>(initialEvents);
  const [services, setServicesState] = useState<ServiceItem[]>(initialServices);
  const [geoStats, setGeoStatsState] = useState<StateStats[]>(initialGeographicStats);
  const [photos, setPhotosState] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [videos, setVideosState] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadAll = () => {
    setSiteTextsState(getStoredValue("rk_site_texts", DEFAULT_TEXTS));
    setPeopleState(getStoredValue("rk_people", initialPeople));
    setNewsState(getStoredValue("rk_news", initialNews));
    setEventsState(getStoredValue("rk_events", initialEvents));
    setServicesState(getStoredValue("rk_services", initialServices));
    setGeoStatsState(getStoredValue("rk_geo_stats", initialGeographicStats));
    setPhotosState(getStoredValue("rk_photos", DEFAULT_PHOTOS));
    setVideosState(getStoredValue("rk_videos", DEFAULT_VIDEOS));
    setIsLoaded(true);
  };

  useEffect(() => {
    loadAll();

    const handleStoreChange = () => {
      loadAll();
    };

    window.addEventListener(STORAGE_EVENT, handleStoreChange);
    window.addEventListener("storage", handleStoreChange); // for cross-tab sync

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStoreChange);
      window.removeEventListener("storage", handleStoreChange);
    };
  }, []);

  const updateSiteTexts = (newTexts: Partial<SiteTexts>) => {
    const updated = { ...siteTexts, ...newTexts };
    setSiteTextsState(updated);
    setStoredValue("rk_site_texts", updated);
  };

  const updatePeople = (newPeople: Person[]) => {
    setPeopleState(newPeople);
    setStoredValue("rk_people", newPeople);
  };

  const updateNews = (newNews: NewsItem[]) => {
    setNewsState(newNews);
    setStoredValue("rk_news", newNews);
  };

  const updateEvents = (newEvents: EventItem[]) => {
    setEventsState(newEvents);
    setStoredValue("rk_events", newEvents);
  };

  const updateServices = (newServices: ServiceItem[]) => {
    setServicesState(newServices);
    setStoredValue("rk_services", newServices);
  };

  const updateGeoStats = (newGeoStats: StateStats[]) => {
    setGeoStatsState(newGeoStats);
    setStoredValue("rk_geo_stats", newGeoStats);
  };

  const updatePhotos = (newPhotos: PhotoItem[]) => {
    setPhotosState(newPhotos);
    setStoredValue("rk_photos", newPhotos);
  };

  const updateVideos = (newVideos: VideoItem[]) => {
    setVideosState(newVideos);
    setStoredValue("rk_videos", newVideos);
  };

  const resetToDefault = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("rk_site_texts");
    window.localStorage.removeItem("rk_people");
    window.localStorage.removeItem("rk_news");
    window.localStorage.removeItem("rk_events");
    window.localStorage.removeItem("rk_services");
    window.localStorage.removeItem("rk_geo_stats");
    window.localStorage.removeItem("rk_photos");
    window.localStorage.removeItem("rk_videos");
    loadAll();
    window.dispatchEvent(new Event(STORAGE_EVENT));
  };

  return {
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
  };
}
