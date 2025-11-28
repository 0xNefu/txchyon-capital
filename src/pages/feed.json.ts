// src/pages/feed.json.ts ← THIS ONE WORKS 100%
import { getCollection } from "astro:content";

export async function GET({ site }) {
  const posts = await getCollection("posts");

  const items = posts
    .filter(p => !p.data.draft)
    .map(post => {
      const slug = (post.slug || post.id.replace(/\.(md|mdx)$/, "")).trim();
      const url = `${site}${slug}/`;

      return {
        id: url,
        url: url,
        title: String(post.data.title || "Untitled"),
        summary: String(post.data.description || post.data.excerpt || "New alpha from Txchyon Capital"),
        date_published: (post.data.date || new Date()).toISOString(),
        image: post.data.image
          ? new URL(post.data.image.startsWith("/") ? post.data.image : `/${post.data.image}`, site!).toString()
          : undefined,
      };
    })
    .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

  return new Response(
    JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Txchyon Capital",
      home_page_url: site,
      feed_url: `${site}rss.xml`,
      items,
    }, null, 2),
    {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
      },
    }
  );
}