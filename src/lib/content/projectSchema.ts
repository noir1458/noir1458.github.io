import { z } from "astro/zod";

const emptyToUndefined = (value: unknown) => {
  if (value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
};

const nonEmptyString = z.string().trim().min(1);
const webUrl = z.url().refine(
  (value) => /^https?:\/\//u.test(value),
  "must use http or https"
);
const publicImagePath = nonEmptyString.refine(
  (value) => value.startsWith("/") && !value.startsWith("//"),
  "must be an absolute site path beginning with one /"
).refine(
  (value) => !value.split("/").includes(".."),
  "must not contain parent-directory segments"
).refine(
  (value) => !value.includes("\\") && !/[?#]/u.test(value),
  "must not contain backslashes, a query, or a fragment"
);

export const projectSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString.max(220),
  repository: z.preprocess(emptyToUndefined, webUrl.optional()),
  demo: z.preprocess(emptyToUndefined, webUrl.optional()),
  image: z.preprocess(emptyToUndefined, publicImagePath.optional()),
  tags: z.array(nonEmptyString).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  draft: z.boolean().default(false)
}).strict();
