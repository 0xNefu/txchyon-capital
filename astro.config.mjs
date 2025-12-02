import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
// import sitemap from "@astrojs/sitemap"; // <-- REMOVE THIS IMPORT
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";

import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: "https://txchyon.com",

  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    mdx(),

    // REMOVED: sitemap integration is replaced by a manual API endpoint (Step 2)
    // sitemap({
    //   changefreq: "weekly",
    //   priority: 0.7,
    //   lastmod: new Date(),
    // }),

    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
  ],

  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
    extendDefaultPlugins: true,
  },
});