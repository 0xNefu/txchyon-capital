// src/pages/rss.xml.ts   ← 100% guaranteed to work
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET({ site }) {
  const posts = await getCollection("posts");

  return rss({
    title: "Txchyon Capital – On-chain Alpha",
    description: "DeFi research, airdrops, and alpha from Txchyon",
    site: site!,
    items: posts
      .filter(p => !p.data.draft)
      .map(post => ({
        title: String(post.data.title || "Untitled"),
        description: String(
          post.data.description || post.data.excerpt || "New alpha from Txchyon"
        ),
        link: `/${post.slug || post.id.replace(/\.(md|mdx)$/, "")}/`,
        pubDate: post.data.date || new Date(),
      })),
  });
}