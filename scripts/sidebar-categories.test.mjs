import assert from "node:assert/strict";
import { test } from "node:test";
import { arrangeSidebarCategories } from "../src/lib/content/sidebarCategories.ts";

const categories = [
  { name: "New", slug: "new", count: 2 },
  { name: "Blog", slug: "blog", count: 4 },
  { name: "Internal", slug: "internal", count: 1 },
  { name: "Code", slug: "code", count: 3 }
];

test("configured categories keep their group order", () => {
  const result = arrangeSidebarCategories(categories, {
    groups: [
      { categories: ["blog"] },
      { categories: ["code"] }
    ],
    hidden: ["internal"]
  });

  assert.deepEqual(
    result.groups.map((group) => group.categories.map((category) => category.slug)),
    [["blog"], ["code"], ["new"]]
  );
  assert.deepEqual(result.groups.map((group) => group.automatic), [false, false, true]);
});

test("hidden categories are omitted and unconfigured categories are reported", () => {
  const result = arrangeSidebarCategories(categories, {
    groups: [{ categories: ["blog", "missing"] }],
    hidden: ["internal"]
  });

  assert.deepEqual(result.unconfigured.map((category) => category.slug), ["new", "code"]);
  assert.equal(result.groups.flatMap((group) => group.categories).some(
    (category) => category.slug === "internal"
  ), false);
});
