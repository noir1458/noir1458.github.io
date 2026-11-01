import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeMermaid from "rehype-mermaid";
import { FEATURES, LANGUAGES, SITE } from "./src/config.ts";
import {
  MERMAID_DARK_CONFIG,
  MERMAID_LIGHT_CONFIG,
  rehypeMermaidSource,
  rehypeMermaidTheme
} from "./src/lib/markdown/rehypeMermaid.ts";
import { remarkAdmonitions } from "./src/lib/markdown/remarkAdmonitions.ts";
import { rehypePrint } from "./src/lib/markdown/rehypePrint.ts";

const mermaidPlugins = FEATURES.mermaid
  ? [
      [rehypeMermaidSource, { defaultLanguage: SITE.language }],
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
  prefetch: false,
  integrations: FEATURES.sitemap
    ? [
        sitemap({
          filter: (page) => new URL(page).pathname !== "/search/"
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
            defaultLanguage: SITE.language,
            languagePrefixes: Object.fromEntries(
              Object.entries(LANGUAGES).map(([language, settings]) => [
                language,
                settings.pathPrefix
              ])
            )
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
