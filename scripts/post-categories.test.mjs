import assert from "node:assert/strict";
import { test } from "node:test";
import { postCategoriesSchema } from "../src/lib/content/postCategories.ts";

test("only drafts can omit categories or use an empty list", () => {
  for (const fields of [{}, { categories: [] }]) {
    assert.deepEqual(postCategoriesSchema.parse({ ...fields, draft: true }).categories, []);
    for (const post of [fields, { ...fields, draft: false }]) {
      const result = postCategoriesSchema.safeParse(post);
      assert.equal(result.success, false);
      assert.deepEqual(result.error.issues[0].path, ["categories"]);
    }
  }
});

test("published posts accept category names as text or a list", () => {
  for (const categories of [" Rust ", [" Rust "]]) {
    assert.deepEqual(postCategoriesSchema.parse({ categories }).categories, ["Rust"]);
  }
  assert.equal(postCategoriesSchema.safeParse({ categories: [" "] }).success, false);
});
