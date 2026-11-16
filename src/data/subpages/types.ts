/** Deep-dive sub-pages rendered at /<lang>/<slug>/ — one type, three locales. */
export interface SubSection {
  /** Section heading (rendered as <h2>) */
  h: string;
  /** Lead paragraph */
  p: string;
  /** Optional supporting points */
  bullets?: string[];
}

export interface SubFaq {
  q: string;
  a: string;
}

/** Optional schema.org HowTo payload — currently used by the transport page. */
export interface SubHowToStep {
  /** Imperative step title, e.g. "Turn north onto Ratchapakhinai Road" */
  name: string;
  /** One-sentence detail — mirrors the visible bullet copy on the page */
  text: string;
}

export interface SubHowTo {
  name: string;
  description: string;
  /** ISO 8601 duration, e.g. PT20M */
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
  steps: SubHowToStep[];
}

export interface SubPage {
  /** URL segment — also used for the sitemap and internal links */
  slug: string;
  /** Short label used on cards and cross-links */
  nav: string;
  /** Meta title (keep under ~60 chars) */
  title: string;
  /** Meta description (keep under ~155 chars) */
  description: string;
  /** Eyebrow above the H1 */
  label: string;
  /** H1 */
  heading: string;
  /** Intro paragraph under the H1 */
  lead: string;
  /** Optional quick-facts row (entry fee / hours / dress code) under the intro. */
  quickFacts?: { label: string; value: string }[];
  /** Destination-specific data, used for nearby attraction pages. */
  destination?: { name: string; address: string; mapsUrl: string; image: string; alt: string };
  /** Second-screen management and historical context. */
  management?: { heading: string; body: string };
  /** Existing or newly sourced location-specific images (1–5). */
  photos?: { src: string; alt: string }[];
  visitPlan?: {
    highlights: string[];
    tips: string[];
    steps: string[];
    photoSpots: string[];
    transport: string[];
    hours: string;
    ticket: string;
  };
  sections: SubSection[];
  faqs: SubFaq[];
  /** Emits schema.org HowTo when present (transport page). */
  howTo?: SubHowTo;
}

export type SubSlug =
  | 'visitor-guide'
  | 'history-and-highlights'
  | 'how-to-get-there'
  | 'nearby-attractions'
  | 'entrance-fee-and-hours'
  | 'lanna-architecture'
  | 'old-city-walking-route'
  | 'three-kings-monument'
  | 'wat-chedi-luang'
  | 'wat-phra-singh'
  | 'wat-lam-chang'
  | 'chiang-mai-city-arts-centre'
  | 'wat-inthakhin-sadue-muang';

export type SubPageSet = Record<SubSlug, SubPage>;
