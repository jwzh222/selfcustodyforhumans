import type { APIRoute } from 'astro';

export const GET: APIRoute = (context) => {
  const site = context.site ?? new URL('http://localhost:4321');
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
