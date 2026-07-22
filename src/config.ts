import type { Lang } from './i18n/ui';

export interface SiteConfig {
  name: string;
  domain: string;
  phone: string;
  rating: string;
  reviewCount: string;
  coords: { lat: number; lng: number };
  mapsUrl: string;
  googleMapsEmbed: string;
  address: string;
  plusCode: string;
  galleryPrefix: string;
  sameAs: string[];
  sources: { name: string; url: string }[];
  openMeteo: { latitude: number; longitude: number; timezone: string };
}

export const siteConfig: SiteConfig = {
  name: 'Wat Chiang Man',
  domain: 'watchiangman.com',
  phone: '',
  rating: '4.6',
  reviewCount: '6,096',
  coords: { lat: 18.7938, lng: 98.9867 },
  // Google Maps — shared by Hero / Gallery / Reviews / Footer (4 visible links) + JSON-LD sameAs
  mapsUrl: 'https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7',
  // Map embed (right-side thumbnail) — language params are swapped per locale at render time
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.097391520713!2d98.98669001232625!3d18.79381258227997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a97936133d7%3A0x6e33b1cdc659f2dd!2z5riF5pu85a-6!5e0!3m2!1szh-CN!2sus!4v1784707773196!5m2!1szh-CN!2sus',
  address: '171 Ratchapakhinai Rd, Old City, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand',
  plusCode: 'QXVQ+GP',
  galleryPrefix: 'wat-chiang-man-',
  sameAs: [
    'https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7',
    'https://en.wikipedia.org/wiki/Wat_Chiang_Man',
  ],
  sources: [
    { name: 'Wikipedia — Wat Chiang Man', url: 'https://en.wikipedia.org/wiki/Wat_Chiang_Man' },
    { name: 'Tourism Authority of Thailand', url: 'https://www.tourismthailand.org/' },
  ],
  openMeteo: { latitude: 18.7938, longitude: 98.9867, timezone: 'Asia/Bangkok' },
};

export const email = 'hello@watchiangman.com';

// Light textual fallbacks — real per-locale strings live in i18n/*.json
export const fallbackMeta = {
  title: 'Wat Chiang Man · Chiang Mai Old City Temple',
  description:
    'Wat Chiang Man (วัดเชียงมั่น), Chiang Mai’s oldest temple, founded by King Mangrai in 1296. Home of the crystal Buddha Phra Sae Tang Khamani and the elephant-backed chedis.',
};

export function metaFor(lang: Lang) {
  return fallbackMeta;
}
