import type { Lang } from '../../i18n/ui';
import { en } from './en';
import { th } from './th';
import { zh } from './zh';
import type { SubPage, SubSlug } from './types';

/** Fixed order — drives getStaticPaths, sitemap and internal cross-links. */
export const subSlugs: SubSlug[] = [
  'visitor-guide',
  'history-and-highlights',
  'how-to-get-there',
  'nearby-attractions',
  'entrance-fee-and-hours',
  'lanna-architecture',
  'old-city-walking-route',
  'three-kings-monument',
  'wat-chedi-luang',
  'wat-phra-singh',
  'wat-lam-chang',
  'chiang-mai-city-arts-centre',
  'wat-inthakhin-sadue-muang',
];

export const subPages: Record<Lang, Record<SubSlug, SubPage>> = { en, th, zh };

export function subPageFor(lang: Lang, slug: string): SubPage | undefined {
  return subPages[lang]?.[slug as SubSlug];
}

export type { SubPage, SubSlug, SubSection, SubFaq } from './types';
