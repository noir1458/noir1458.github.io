import { z } from "astro/zod";

export const postCategoriesSchema = z
  .object({
    draft: z.boolean().default(false),
    categories: z.preprocess(
      (value) => (typeof value === "string" ? [value] : value),
      z.array(z.string().trim().min(1)).default([])
    )
  })
  .refine((post) => post.draft || post.categories.length > 0, {
    path: ["categories"],
    message: "공개 글에는 카테고리를 하나 이상 지정하세요."
  });
