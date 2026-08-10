import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import { FEATURES, SITE } from "./src/config.ts";
import {
  MERMAID_DARK_CONFIG,
  MERMAID_LIGHT_CONFIG,
  rehypeMermaidSource,
  rehypeMermaidTheme
} from "./src/lib/markdown/rehypeMermaid.ts";

const mermaidPlugins = FEATURES.mermaid
  ? [
    [rehypeMermaidSource, { defaultLanguage: SITE.language }],
    [rehypeMermaid, {
      strategy: "img-svg",
      colorScheme: "light",
      mermaidConfig: MERMAID_LIGHT_CONFIG,
      dark: FEATURES.darkMode ? MERMAID_DARK_CONFIG : undefined
    }],
    rehypeMermaidTheme
  ]
  : [];

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "always",
  integrations: FEATURES.sitemap
    ? [sitemap({
      filter: (page) => new URL(page).pathname !== "/search/"
    })]
    : [],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: FEATURES.mermaid ? ["mermaid"] : []
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, { output: "htmlAndMathml", strict: false }],
        ...mermaidPlugins
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
