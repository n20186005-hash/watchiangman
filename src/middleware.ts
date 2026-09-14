import { defineMiddleware } from 'astro:middleware';
import { entity } from './config';

/**
 * Host canonicalisation: every request on the `www.` host is 301-redirected to
 * the bare domain, so search engines index one version only (canonical tags,
 * hreflang and the sitemap all use `https://watchiangman.com`).
 *
 * Runs at runtime in the Cloudflare Worker. During the build, prerendered pages
 * are requested with the `site` origin (bare domain), so nothing is redirected
 * at build time.
 */
export const onRequest = defineMiddleware((context, next) => {
  const host = context.url.hostname.toLowerCase();
  const bare = entity.domain.toLowerCase();

  if (host === `www.${bare}`) {
    const target = new URL(context.url);
    target.hostname = bare;
    target.protocol = 'https:';
    target.port = '';
    return context.redirect(target.toString(), 301);
  }

  return next();
});
