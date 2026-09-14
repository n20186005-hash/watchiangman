import th from './th.json';
import en from './en.json';
import zh from './zh.json';

export const defaultLang = 'th';
export const languagesList = ['th', 'en', 'zh'] as const;
export type Lang = (typeof languagesList)[number];

// Language switcher labels (default locale: th)
export const languages: Record<Lang, string> = {
  th: 'ไทย',
  zh: '中',
  en: 'EN',
};

const messagesMap: Record<Lang, any> = { th, en, zh };

/** Direct access to a locale bundle — used by server islands (which receive only `lang`). */
export const messagesFor = (lang: Lang): any => messagesMap[lang] ?? messagesMap[defaultLang];

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
