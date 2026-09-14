import { codeKey } from './weather';
import type { WeatherData, WeatherDay } from './weather';

/**
 * Turns raw forecast numbers into plain-language, actionable advice for
 * visitors. Every rule below emits i18n *keys* — the wording lives in
 * `src/i18n/*.json` under `weather.advice.*` / `weather.gear.*`.
 *
 * Two guarantees drive the design:
 *  1. Nothing renders unless its condition is actually true — no rain means
 *     no umbrella line, no warning means the risk block stays hidden.
 *  2. When a risk is active, comfort-level advice is dropped so the visitor
 *     sees safety first instead of a wall of text.
 */

export interface Advice {
  /** Keys shown in the red risk banner. Empty => the banner is not rendered. */
  alerts: string[];
  dress: string[];
  plan: string[];
  gear: string[];
  /** Single key describing the best window to visit today. */
  best: string;
}

const RAINY = new Set(['drizzle', 'rain', 'showers', 'storm']);

/** Beaufort bucket for a wind speed given in km/h. */
export function windBand(kmh: number): 'calm' | 'breeze' | 'strong' | 'gale' {
  if (kmh >= 50) return 'gale';
  if (kmh >= 29) return 'strong';
  if (kmh >= 12) return 'breeze';
  return 'calm';
}

/** Humidity in words instead of a raw percentage a visitor has to interpret. */
export function humidityBand(h: number): 'muggy' | 'humid' | 'comfy' | 'dry' {
  if (h >= 80) return 'muggy';
  if (h >= 65) return 'humid';
  if (h >= 40) return 'comfy';
  return 'dry';
}

/** UV index in words: “strong”, not “irradiance”. */
export function uvBand(uv: number): 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme' {
  if (uv >= 11) return 'extreme';
  if (uv >= 8) return 'veryHigh';
  if (uv >= 6) return 'high';
  if (uv >= 3) return 'moderate';
  return 'low';
}

/** Fixed display order so the packing chips never jump around. */
const GEAR_ORDER = [
  'umbrella',
  'foldingUmbrella',
  'raincoat',
  'windBreaker',
  'shoesGrip',
  'hat',
  'sunglasses',
  'sunscreen',
  'water',
  'layer',
  'thickCoat',
  'scarf',
  'slipOn',
  'socks',
  'mask',
];

/** Gear that still matters during a weather risk; everything else is comfort. */
const CRITICAL_GEAR = new Set(['raincoat', 'windBreaker', 'shoesGrip', 'mask', 'thickCoat', 'scarf']);

interface Line {
  k: string;
  /** Safety line: survives when a risk banner is showing. */
  c: boolean;
}

/** One short tag per forecast day (umbrella / sun / heat …). */
export function dayTip(day: WeatherDay): string {
  const key = codeKey(day.code);
  if (key === 'storm') return 'storm';
  if (RAINY.has(key) && day.precipSum >= 10) return 'heavyRain';
  if (RAINY.has(key) || day.precipProb >= 60) return 'umbrella';
  if (day.tmax >= 35) return 'heat';
  if (day.uvMax >= 8) return 'sun';
  if (day.tmax - day.tmin > 8) return 'swing';
  if (key === 'fog') return 'fog';
  return 'comfy';
}

export function buildAdvice(data: WeatherData): Advice {
  const now = data.now;
  const today: WeatherDay =
    data.today ?? {
      date: '',
      code: now.code,
      tmax: now.temp,
      tmin: now.temp,
      precipProb: 0,
      precipSum: now.precip,
      uvMax: 0,
    };

  const nowKey = codeKey(now.code);
  const dayKey = codeKey(today.code);
  const alerts: string[] = [];
  const dress: Line[] = [];
  const plan: Line[] = [];
  const gear = new Set<string>();

  const tmax = today.tmax;
  const tmin = today.tmin;
  const prob = today.precipProb;
  const uv = today.uvMax;
  const swing = tmax - tmin;
  const stormy = nowKey === 'storm' || dayKey === 'storm';
  const wet = RAINY.has(nowKey) || RAINY.has(dayKey);
  const heavy =
    !stormy &&
    (today.precipSum >= 10 ||
      now.precip >= 2.5 ||
      today.code === 82 ||
      today.code === 65 ||
      today.code === 67);
  const band = windBand(now.wind);

  // 1. Rain — one branch only, the strongest signal wins.
  if (stormy) {
    alerts.push('storm');
    dress.push({ k: 'storm', c: true });
    plan.push({ k: 'storm', c: true });
    gear.add('raincoat');
    gear.add('shoesGrip');
  } else if (heavy) {
    alerts.push('heavyRain');
    dress.push({ k: 'heavyRain', c: true });
    plan.push({ k: 'heavyRain', c: true });
    gear.add('raincoat');
    gear.add('shoesGrip');
  } else if (prob >= 60 || (wet && prob >= 40)) {
    // Probability, not certainty — never say it "will" rain.
    dress.push({ k: 'rainLikely', c: false });
    plan.push({ k: 'rainLikely', c: false });
    gear.add('umbrella');
    gear.add('shoesGrip');
  } else if (wet || now.precip > 0 || prob >= 30) {
    dress.push({ k: 'lightRain', c: false });
    plan.push({ k: 'lightRain', c: false });
    gear.add('foldingUmbrella');
    gear.add('shoesGrip');
  }

  // 2. Heat — the real risk on a walkable old-city temple visit.
  if (tmax >= 38 || now.apparent >= 41) {
    alerts.push('heat');
    dress.push({ k: 'heat', c: true });
    plan.push({ k: 'heat', c: true });
    gear.add('water');
  } else if (tmax >= 32 || now.temp >= 32) {
    dress.push({ k: 'hot', c: false });
    plan.push({ k: 'hot', c: false });
    gear.add('water');
  }

  // 3. Sun / UV.
  if (uv >= 8) {
    dress.push({ k: 'uvExtreme', c: false });
    plan.push({ k: 'uv', c: false });
    gear.add('sunscreen');
    gear.add('sunglasses');
    gear.add('hat');
  } else if (uv >= 5) {
    dress.push({ k: 'uv', c: false });
    gear.add('sunscreen');
    gear.add('sunglasses');
    gear.add('hat');
  }

  // 4. Temperature swing and cold.
  if (tmax <= 10) {
    dress.push({ k: 'cold', c: false });
    gear.add('thickCoat');
    gear.add('scarf');
  } else if (swing > 8) {
    dress.push({ k: 'swing', c: false });
    gear.add('layer');
  }

  // 5. Wind.
  if (band === 'gale') {
    alerts.push('wind');
    dress.push({ k: 'wind7', c: true });
    plan.push({ k: 'wind7', c: true });
    gear.add('windBreaker');
  } else if (band === 'strong') {
    dress.push({ k: 'wind', c: false });
    plan.push({ k: 'wind', c: false });
    gear.add('windBreaker');
  }

  // 6. Sky — only while it is not already raining.
  if (!wet && prob < 40) {
    if (nowKey === 'clear' || nowKey === 'mainlyClear') {
      plan.push({ k: 'sunny', c: false });
      gear.add('sunscreen');
    } else if (nowKey === 'partly' || nowKey === 'overcast') {
      plan.push({ k: 'cloudy', c: false });
    }
  }
  if (nowKey === 'fog' || dayKey === 'fog') {
    alerts.push('fog');
    plan.push({ k: 'fog', c: true });
    gear.add('mask');
  }

  // 7. Muggy air — humidity only matters once it is warm.
  if (now.humidity >= 80 && (now.temp >= 28 || tmax >= 32)) {
    plan.push({ k: 'muggy', c: false });
    gear.add('water');
  }

  // 8. Site context: an open courtyard temple in a hot city.
  if (tmax >= 30 && !stormy) {
    plan.push({ k: 'courtyard', c: false });
    gear.add('slipOn');
    gear.add('socks');
  }

  // With a risk active, keep the safety lines and drop the comfort ones.
  const risky = alerts.length > 0;
  const lines = (arr: Line[]): string[] => {
    if (!arr.length) return ['ok'];
    const kept = risky ? arr.filter((l) => l.c) : arr;
    return (kept.length ? kept : arr.slice(0, 1)).map((l) => l.k);
  };

  const gearList = GEAR_ORDER.filter((g) => {
    if (!gear.has(g)) return false;
    if (!risky) return true;
    return CRITICAL_GEAR.has(g) || (alerts.includes('heat') && g === 'water');
  });

  // Best window to be outside today.
  let best = 'any';
  if (stormy || heavy) best = 'wait';
  else if (tmax >= 33 || uv >= 8 || prob >= 60) best = 'morning';

  return { alerts, dress: lines(dress), plan: lines(plan), gear: gearList, best };
}
