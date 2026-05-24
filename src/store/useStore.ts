// src/store/useStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NewsArticle } from '../services/newsService';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ReadingFont = 'sans' | 'serif' | 'mono';
export type ReadingBg = 'dark' | 'warm' | 'cool' | 'night';
export type LineSpacing = 'compact' | 'normal' | 'relaxed';

export interface Settings {
  themeMode: ThemeMode;
  autoTheme: boolean;
  readingFont: ReadingFont;
  fontSize: number;
  readingBg: ReadingBg;
  lineSpacing: LineSpacing;
  breakingAlerts: boolean;
  dailyDigest: boolean;
  personalisation: boolean;
}

interface AppState {
  articles: NewsArticle[];
  savedIds: Set<string>;
  savedArticles: NewsArticle[];
  settings: Settings;
  loading: boolean;
  error: string | null;
  activeCategory: string;
  setArticles: (articles: NewsArticle[]) => void;
  toggleSave: (article: NewsArticle) => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  setActiveCategory: (c: string) => void;
  loadSaved: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  autoTheme: false,
  readingFont: 'sans',
  fontSize: 15,
  readingBg: 'dark',
  lineSpacing: 'normal',
  breakingAlerts: true,
  dailyDigest: true,
  personalisation: true,
};

export const useStore = create<AppState>((set, get) => ({
  articles: [],
  savedIds: new Set<string>(),
  savedArticles: [],
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,
  activeCategory: 'For You',

  setArticles: (articles) => set({ articles }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  toggleSave: async (article: NewsArticle) => {
    const savedIds = new Set(get().savedIds);
    const savedArticles = [...get().savedArticles];
    if (savedIds.has(article.id)) {
      savedIds.delete(article.id);
      const idx = savedArticles.findIndex(a => a.id === article.id);
      if (idx !== -1) savedArticles.splice(idx, 1);
    } else {
      savedIds.add(article.id);
      savedArticles.unshift(article);
    }
    set({ savedIds, savedArticles });
    try {
      await AsyncStorage.setItem('saved_ids', JSON.stringify([...savedIds]));
      await AsyncStorage.setItem('saved_articles', JSON.stringify(savedArticles));
    } catch (_) {}
  },

  updateSetting: async (key, value) => {
    const settings = { ...get().settings, [key]: value };
    set({ settings });
    try { await AsyncStorage.setItem('settings', JSON.stringify(settings)); } catch (_) {}
  },

  loadSaved: async () => {
    try {
      const [savedRaw, articlesRaw, settingsRaw] = await Promise.all([
        AsyncStorage.getItem('saved_ids'),
        AsyncStorage.getItem('saved_articles'),
        AsyncStorage.getItem('settings'),
      ]);
      if (savedRaw) set({ savedIds: new Set(JSON.parse(savedRaw)) });
      if (articlesRaw) set({ savedArticles: JSON.parse(articlesRaw) });
      if (settingsRaw) set({ settings: { ...DEFAULT_SETTINGS, ...JSON.parse(settingsRaw) } });
    } catch (_) {}
  },
}));
