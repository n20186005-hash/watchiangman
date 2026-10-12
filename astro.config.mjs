import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.watchiangman.com',
  // Cloudflare Workers (Workers + Assets, directory mode)
  // Static pages are prerendered; the weather block is a server island (server:defer)
  // rendered on demand inside the Worker.
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en', 'zh'],
    routing: { prefixDefaultLocale: true },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  compressHTML: true,
  scopedStyleStrategy: 'class',
  meta: {
    // Used as fallback <title>/<description> when a page does not override them.
    title: 'Wat Chiang Man · Chiang Mai Old City Temple',
    description:
      'Wat Chiang Man (วัดเชียงมั่น), the oldest temple in Chiang Mai, founded by King Mangrai in 1296 — home of the crystal Buddha and the elephant-backed chedis.',
    // Per-locale overrides (index page uses messages.meta.description instead).
    langs: {
      th: 'วัดเชียงมั่น วัดเก่าแก่ที่สุดในเชียงใหม่ ก่อตั้งโดยพ่อขุนเม็งรายมหาราช เมื่อปี 1296',
      en: 'Wat Chiang Man, Chiang Mai’s oldest temple, founded by King Mangrai in 1296.',
      zh: '清迈最古老的寺庙清曼寺（Wat Chiang Man），由孟莱王于 1296 年创立。',
    },
  },
});
