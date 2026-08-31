import { z } from "astro/zod";
import type { ImageMetadata } from "astro";

const emptyToUndefined = (value: unknown) => {
  if (value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
};

const nonEmptyString = z.string().trim().min(1);
const webUrl = z.url().refine((value) => /^https?:\/\//u.test(value), "must use http or https");
const localImagePath = nonEmptyString
  .refine((value) => value.startsWith("./"), "must be a relative path beginning with ./")
  .refine((value) => !value.split("/").includes(".."), "must not contain parent-directory segments")
  .refine(
    (value) => !value.includes("\\") && !/[?#]/u.test(value),
    "must not contain backslashes, a query, or a fragment"
  );

const projectFields = {
  title: nonEmptyString,
  description: nonEmptyString.max(220),
  repository: z.preprocess(emptyToUndefined, webUrl.optional()),
  demo: z.preprocess(emptyToUndefined, webUrl.optional()),
  tags: z.array(nonEmptyString).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  draft: z.boolean().default(false)
};

export const projectFrontmatterSchema = z
  .object({
    ...projectFields,
    image: z.preprocess(emptyToUndefined, localImagePath.optional())
  })
  .strict();

export function projectSchema(imageSchema: z.ZodType<ImageMetadata>) {
  return z
    .object({
      ...projectFields,
      image: z.preprocess(emptyToUndefined, imageSchema.optional())
    })
    .strict();
}
