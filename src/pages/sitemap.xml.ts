import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// NOTE: This assumes your blog content is in a collection named 'blog'.
// If your content folder is different (e.g., 'posts'), change 'blog' below.

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Sitemap generation failed: Site URL is not set in astro.config.mjs', { status: 500 });
  }
  
  // 1. Fetch all blog posts
  const blogPosts = await getCollection('blog');

  // 2. Map blog posts to sitemap URL entries
  const postsMap = blogPosts
    .map((post) => {
      // Use 'updatedDate' if available, otherwise fall back to 'pubDate'
      // You must ensure your frontmatter has a 'pubDate' or similar field.
      const lastModDate = post.data.updatedDate ?? post.data.pubDate;
      const lastMod = lastModDate ? new Date(lastModDate).toISOString() : new Date().toISOString();

      return `
        <url>
          <loc>${new URL(`/blog/${post.slug}`, site).href}</loc>
          <lastmod>${lastMod}</lastmod>
          <priority>0.8</priority>
        </url>
      `;
    })
    .join('\n');

  // 3. Define static pages (Home, About, etc.)
  // You can set a static lastmod for these, or use the build date (new Date().toISOString())
  const staticUrls = [
    { loc: site.href, priority: 1.0, changefreq: 'daily' },
    { loc: new URL('/about', site).href, priority: 0.6, changefreq: 'monthly' },
    // Add any other static pages here
  ];

  const staticUrlsMap = staticUrls
    .map((item) => `
      <url>
        <loc>${item.loc}</loc>
        <priority>${item.priority}</priority>
        <changefreq>${item.changefreq}</changefreq>
      </url>
    `)
    .join('\n');


  // 4. Construct the full XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrlsMap}
  ${postsMap}
</urlset>`.trim();

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};