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
  // Synced from Google Maps user reviews — see `sync.time` in i18n/*.json
  rating: '4.7',
  reviewCount: '6,192',
  coords: { lat: 18.7938, lng: 98.9867 },
  // Google Maps — shared by Hero / Gallery / Reviews / Footer (4 visible links) + JSON-LD sameAs
  mapsUrl: 'https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7',
  // Map embed (right-side thumbnail) — language params are swapped per locale at render time
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.097391520713!2d98.98669001232625!3d18.79381258227997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a97936133d7%3A0x6e33b1cdc659f2dd!2z5riF5pu85a-6!5e0!3m2!1szh-CN!2sus!4v1784707773196!5m2!1szh-CN!2sus',
  address: '171 Ratchapakhinai Rd, Old City, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand',
  plusCode: 'QXVQ+GP',
  // Canonical photo naming: wat-chiang-man-chiang-mai-1.jpg …
  galleryPrefix: 'wat-chiang-man-chiang-mai-',
  sameAs: [
    'https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7',
    'https://en.wikipedia.org/wiki/Wat_Chiang_Man',
    'https://www.tourismthailand.org/',
  ],
  sources: [
    { name: 'Wikipedia — Wat Chiang Man', url: 'https://en.wikipedia.org/wiki/Wat_Chiang_Man' },
    { name: 'Tourism Authority of Thailand', url: 'https://www.tourismthailand.org/' },
    { name: 'Google Maps — Wat Chiang Man', url: 'https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7' },
  ],
  openMeteo: { latitude: 18.7938, longitude: 98.9867, timezone: 'Asia/Bangkok' },
};

/**
 * Single-attraction SEO entity binding.
 * Every SEO slot (JSON-LD / TDK / headings / copy / alt / PWA) reads from here,
 * so swapping in another attraction only requires editing this object.
 */
export interface AttractionEntity {
  domain: string;
  fullName: string;
  shortName: string;
  localName: string;
  category: string;
  city: string;
  stateProvince: string;
  country: string;
  countryCode2Letter: string;
  postalCode: string;
  streetAddress: string;
  latitude: number;
  longitude: number;
  plusCode: string;
  mapsShareUrl: string;
  mapsEmbedSrc: string;
  nearbyLandmark1: string;
  nearbyLandmark2: string;
  govtTourismUrl: string;
  heroImage: string;
}

export const entity: AttractionEntity = {
  domain: 'watchiangman.com',
  fullName: 'Wat Chiang Man',
  // Domain meaning: watchiangman.com → “Wat Chiang Man”
  shortName: 'Wat Chiang Man',
  localName: 'วัดเชียงมั่น',
  category: 'Buddhist temple',
  city: 'Chiang Mai',
  stateProvince: 'Chiang Mai',
  country: 'Thailand',
  countryCode2Letter: 'TH',
  postalCode: '50200',
  streetAddress: '171 Ratchapakhinai Rd, Old City, Si Phum',
  latitude: 18.7938,
  longitude: 98.9867,
  plusCode: 'QXVQ+GP',
  mapsShareUrl: 'https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7',
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.097391520713!2d98.98669001232625!3d18.79381258227997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a97936133d7%3A0x6e33b1cdc659f2dd!2z5riF5pu85a-6!5e0!3m2!1szh-CN!2sus!4v1784707773196!5m2!1szh-CN!2sus',
  nearbyLandmark1: 'Wat Phra Singh',
  nearbyLandmark2: 'Three Kings Monument',
  govtTourismUrl: 'https://www.tourismthailand.org/',
  heroImage: '/gallery/wat-chiang-man-chiang-mai-13.jpg',
};

export const email = 'n20186005@gmail.com';

// GA4 measurement id
export const ga4Id = 'G-HXM22WWPKP';

// Light textual fallbacks — real per-locale strings live in i18n/*.json
export const fallbackMeta = {
  title: 'Wat Chiang Man (Chiang Mai) - Visitor Guide & Location',
  description:
    'Discover Wat Chiang Man, the iconic Buddhist temple in Chiang Mai, Chiang Mai, Thailand. View location map, opening details, nearby Wat Phra Singh, and travel tips.',
};

export function metaFor(lang: Lang) {
  return fallbackMeta;
}

/** Renders `**bold**` segments coming from i18n strings into <strong> nodes. */
export function richParts(text: string): { text: string; bold: boolean }[] {
  if (!text) return [];
  return text
    .split('**')
    .map((chunk, i) => ({ text: chunk, bold: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);
}
