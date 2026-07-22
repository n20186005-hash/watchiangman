import th from './th.json';
import en from './en.json';
import zh from './zh.json';

export const defaultLang = 'th';
export const languagesList = ['th', 'en', 'zh'] as const;
export type Lang = (typeof languagesList)[number];

export const languages: Record<Lang, string> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
};

const messagesMap: Record<Lang, any> = { th, en, zh };

// mapping for <html lang> / hreflang
export const htmlLang: Record<Lang, string> = {
  th: 'th',
  en: 'en',
  zh: 'zh-CN',
};

const lookup = (obj: Record<string, unknown>, key: string): string => {
  const parts = key.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof cur === 'string' ? cur : key;
};

export const getI18n = async (url: URL) => {
  const raw = url.pathname.split('/').filter(Boolean)[0] as Lang;
  const lang = (languagesList.includes(raw) ? raw : defaultLang) as Lang;
  const messages = messagesMap[lang];
  const t = (key: string) => lookup(messages as unknown as Record<string, unknown>, key);
  return { lang, t, messages };
};
