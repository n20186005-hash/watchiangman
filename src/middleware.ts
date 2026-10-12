import { defineMiddleware } from 'astro:middleware';
import { entity } from './config';

/**
 * Host canonicalisation: every request on the BARE domain is 301-redirected to
 * the `www.` host, so search engines index one version only (canonical tags,
 * hreflang, the sitemap and robots.txt all use `https://www.watchiangman.com`).
 *
 * Runs at runtime in the Cloudflare Worker. During the build, prerendered pages
 * are requested with the `site` origin (www host), so nothing is redirected
 * at build time.
 */
export const onRequest = defineMiddleware((context, next) => {
  const host = context.url.hostname.toLowerCase();
  const bare = entity.domain.toLowerCase().replace(/^www\./, '');

  if (host === bare) {
    const target = new URL(context.url);
    target.hostname = `www.${bare}`;
    target.protocol = 'https:';
    target.port = '';
    return context.redirect(target.toString(), 301);
  }

  return next();
});
