import { siteConfig } from '../config';

export interface WeatherNow {
  temp: number;
  apparent: number;
  humidity: number;
  wind: number;
  code: number;
  isDay: boolean;
  precip: number;
}

export interface WeatherDay {
  date: string;
  code: number;
  tmax: number;
  tmin: number;
  precipProb: number;
  precipSum: number;
  uvMax: number;
}

export interface WeatherData {
  place: string;
  timezone: string;
  now: WeatherNow;
  days: WeatherDay[];
  today: WeatherDay | null;
  umbrellaToday: boolean;
  umbrellaWeek: boolean[];
  observedAt: string;
}

/** Maps a WMO weather code to a compact i18n key. */
export function codeKey(code: number): string {
  if (code === 0) return 'clear';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partly';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 56 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 65) return 'rain';
  if (code >= 66 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  if (code >= 85 && code <= 86) return 'snow';
  if (code === 95) return 'storm';
  if (code >= 96) return 'storm';
  return 'clear';
}

/** Simple icon glyph per condition key. */
export function codeIcon(code: number, isDay = true): string {
  switch (codeKey(code)) {
    case 'clear':
      return isDay ? '☀' : '☾';
    case 'mainlyClear':
      return isDay ? '🌤' : '☾';
    case 'partly':
      return '⛅';
    case 'overcast':
      return '☁';
    case 'fog':
      return '🌫';
    case 'drizzle':
      return '🌦';
    case 'rain':
      return '🌧';
    case 'showers':
      return '🌧';
    case 'snow':
      return '❄';
    case 'storm':
      return '⛈';
    default:
      return '☀';
  }
}

const RAIN_KEYS = new Set(['drizzle', 'rain', 'showers', 'storm', 'snow']);

function umbrella(code: number, precipProb: number): boolean {
  return RAIN_KEYS.has(codeKey(code)) || precipProb >= 50;
}

const API = 'https://api.open-meteo.com/v1/forecast';
const TTL_MS = 10 * 60 * 1000;

let memory: { at: number; data: WeatherData } | null = null;

function buildUrl(): string {
  const { latitude, longitude, timezone } = siteConfig.openMeteo;
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max',
    timezone,
    forecast_days: '7',
  });
  return `${API}?${params.toString()}`;
}

function normalize(json: any): WeatherData | null {
  const cur = json?.current;
  const daily = json?.daily;
  if (!cur || !daily?.time?.length) return null;

  const now: WeatherNow = {
    temp: Math.round(cur.temperature_2m ?? 0),
    apparent: Math.round(cur.apparent_temperature ?? 0),
    humidity: Math.round(cur.relative_humidity_2m ?? 0),
    wind: Math.round(cur.wind_speed_10m ?? 0),
    code: Number(cur.weather_code ?? 0),
    isDay: cur.is_day === 1 || cur.is_day === true,
    precip: Number(cur.precipitation ?? 0),
  };

  const days: WeatherDay[] = daily.time.map((date: string, i: number) => ({
    date,
    code: Number(daily.weather_code?.[i] ?? 0),
    tmax: Math.round(daily.temperature_2m_max?.[i] ?? 0),
    tmin: Math.round(daily.temperature_2m_min?.[i] ?? 0),
    precipProb: Math.round(daily.precipitation_probability_max?.[i] ?? 0),
    precipSum: Number(daily.precipitation_sum?.[i] ?? 0),
    uvMax: Math.round(daily.uv_index_max?.[i] ?? 0),
  }));

  const today = days[0] ?? null;

  return {
    place: `${siteConfig.name} · ${siteConfig.address.split(',').slice(-2)[0]?.trim() ?? ''}`,
    timezone: json?.timezone ?? siteConfig.openMeteo.timezone,
    now,
    days,
    today,
    umbrellaToday: today ? umbrella(today.code, today.precipProb) || umbrella(now.code, 0) : umbrella(now.code, 0),
    umbrellaWeek: days.map((d) => umbrella(d.code, d.precipProb)),
    observedAt: cur.time ?? new Date().toISOString(),
  };
}

/**
 * Server-side weather lookup.
 * The response is cached for 10 minutes by the Cloudflare edge cache
 * (subrequest `cacheTtl`) plus an in-isolate memory cache.
 */
export async function getWeather(): Promise<WeatherData | null> {
  const now = Date.now();
  if (memory && now - memory.at < TTL_MS) return memory.data;

  try {
    const request = new Request(buildUrl(), { method: 'GET' });
    const response = await fetch(request, {
      cf: { cacheTtl: 600, cacheEverything: true },
    } as RequestInit & { cf: Record<string, unknown> });
    if (!response.ok) return memory?.data ?? null;
    const data = normalize(await response.json());
    if (data) memory = { at: now, data };
    return data ?? memory?.data ?? null;
  } catch {
    return memory?.data ?? null;
  }
}
