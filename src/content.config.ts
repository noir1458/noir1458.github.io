import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { FEATURES } from "@/config";
import { postCategoriesSchema } from "@/lib/content/postCategories";
import { projectSchema } from "@/lib/content/projectSchema";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/u, "")
  }),
  schema: ({ image }) =>
    postCategoriesSchema.safeExtend({
      title: z.string().min(1),
      slug: z.string().regex(/^[^/\\?#\s]+$/u),
      description: z.string().min(1).max(220).optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string().min(1)).default([]),
      math: z.boolean().default(false),
      cover: image().optional()
    })
});

const projects = defineCollection({
  loader: FEATURES.projects
    ? glob({
        pattern: ["*.md", "*/index.md"],
        base: "./content/projects",
        generateId: ({ entry }) => entry.replace(/(?:\/index)?\.md$/u, "")
      })
    : async () => [],
  schema: ({ image }) => projectSchema(image())
});

export const collections = { posts, projects };
