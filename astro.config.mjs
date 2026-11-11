import fs from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeMermaid from "rehype-mermaid";
import { FEATURES, SITE } from "./src/config.ts";
import {
  MERMAID_DARK_CONFIG,
  MERMAID_LIGHT_CONFIG,
  rehypeMermaidSource,
  rehypeMermaidTheme
} from "./src/lib/markdown/rehypeMermaid.ts";
import { remarkAdmonitions } from "./src/lib/markdown/remarkAdmonitions.ts";
import { rehypePrint } from "./src/lib/markdown/rehypePrint.ts";

// Translated posts were retired, but their published addresses stay alive: every
// language-prefixed route in the public route contract redirects to the original post.
const retiredTranslationRedirects = Object.fromEntries(
  fs
    .readFileSync(new URL("./tests/baselines/published-post-routes.txt", import.meta.url), "utf8")
    .split("\n")
    .map((route) => route.trim())
    .map((route) => [route, route.match(/^\/[a-z][a-z0-9-]*(\/posts\/[^/?#]+\/)$/u)?.[1]])
    .filter(([, original]) => original)
);
const redirects = { "/categories/": "/#categories", ...retiredTranslationRedirects };

const mermaidPlugins = FEATURES.mermaid
  ? [
      [rehypeMermaidSource, { language: SITE.language }],
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          colorScheme: "light",
          mermaidConfig: MERMAID_LIGHT_CONFIG,
          dark: FEATURES.darkMode ? MERMAID_DARK_CONFIG : undefined
        }
      ],
      rehypeMermaidTheme
    ]
  : [];

export default defineConfig({
  site: SITE.url,
  cacheDir: process.env.ASTRO_BLOG_CACHE_DIR ?? "./node_modules/.astro",
  output: "static",
  trailingSlash: "always",
  redirects,
  prefetch: false,
  integrations: FEATURES.sitemap
    ? [
        sitemap({
          filter: (page) =>
            !["/search/", ...Object.keys(redirects)].includes(new URL(page).pathname)
        })
      ]
    : [],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: FEATURES.mermaid ? ["mermaid"] : []
    },
    processor: unified({
      remarkPlugins: [remarkMath, remarkAdmonitions],
      rehypePlugins: [
        rehypeRaw,
        [rehypeKatex, { output: "htmlAndMathml", strict: false }],
        ...mermaidPlugins,
        [
          rehypePrint,
          {
            siteUrl: SITE.url,
            language: SITE.language
          }
        ]
      ]
    }),
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha"
      },
      wrap: true
    }
  },
  vite: {
    build: {
      cssMinify: "lightningcss"
    }
  }
});
