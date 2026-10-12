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
  sections: SubSection[];
  faqs: SubFaq[];
  /** Emits schema.org HowTo when present (transport page). */
  howTo?: SubHowTo;
}

export type SubSlug =
  | 'visitor-guide'
  | 'history-and-highlights'
  | 'how-to-get-there'
  | 'nearby-attractions';

export type SubPageSet = Record<SubSlug, SubPage>;
