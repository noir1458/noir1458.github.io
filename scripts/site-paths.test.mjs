import assert from "node:assert/strict";
import { test } from "node:test";
import { prefixSitePath, siteBasePath } from "../src/lib/config/sitePaths.ts";

test("siteBasePath derives root and project-site paths", () => {
  assert.equal(siteBasePath("https://example.com"), "");
  assert.equal(siteBasePath("https://username.github.io/example-blog/"), "/example-blog");
});

test("prefixSitePath applies a base path once to local paths", () => {
  assert.equal(
    prefixSitePath("/images/site/banner.webp", "/example-blog"),
    "/example-blog/images/site/banner.webp"
  );
  assert.equal(
    prefixSitePath("/example-blog/images/site/banner.webp", "/example-blog"),
    "/example-blog/images/site/banner.webp"
  );
  assert.equal(
    prefixSitePath("https://example.com/banner.webp", "/example-blog"),
    "https://example.com/banner.webp"
  );
});
