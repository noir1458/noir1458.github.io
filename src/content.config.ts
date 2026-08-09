import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { SITE, SUPPORTED_LANGUAGE_CODES } from "@/config";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/u, "")
  }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[^/\\?#\s]+$/u),
    lang: z.enum(SUPPORTED_LANGUAGE_CODES).default(SITE.language),
    translationKey: z.string().regex(/^[^/\\?#\s]+$/u).optional(),
    description: z.string().min(1).max(220).optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    categories: z.preprocess(
      (value) => typeof value === "string" ? [value] : value,
      z.array(z.string().trim().min(1)).default([])
    ),
    draft: z.boolean().default(false),
    math: z.boolean().default(false),
    cover: image().optional()
  })
});

export const collections = { posts };
