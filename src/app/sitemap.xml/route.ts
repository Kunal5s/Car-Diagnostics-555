import { getAllArticleSlugs } from '@/lib/data';
import { categories } from '@/lib/definitions';

const URL = 'https://oudworkstations.dev';

export async function GET() {
  const slugs = await getAllArticleSlugs();

  const articleUrls = (slugs || []).map(slug => {
    return `<url><loc>${URL}/articles/${slug}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`;
  }).join('');

  const categoryUrls = categories
    .map(category => {
      return `<url><loc>${URL}/category/${category.toLowerCase()}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`;
    }).join('');

  const staticPageUrls = [
    '/',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
  ].map(path => {
    return `<url><loc>${URL}${path}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`;
  }).join('');


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPageUrls}
  ${categoryUrls}
  ${articleUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
