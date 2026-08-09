import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SITE } from "./src/config.ts";

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== "/search/"
    })
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { output: "htmlAndMathml", strict: false }]]
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
