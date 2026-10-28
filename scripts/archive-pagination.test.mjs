import assert from "node:assert/strict";
import test from "node:test";
import { archivePages, archivePath } from "../src/lib/content/archives.ts";

test("archive page boundaries keep every post exactly once, at most 30 per page", () => {
  for (const count of [0, 1, 29, 30, 31, 59, 60, 61, 2000]) {
    const posts = Array.from({ length: count }, (_, index) => `post-${index}`);
    const pages = archivePages([[2026, posts]]);
    assert.equal(pages.length, Math.ceil(count / 30));
    assert.deepEqual(
      pages.flatMap((page) => page.posts),
      posts
    );
    for (const page of pages) {
      assert.ok(page.posts.length > 0 && page.posts.length <= 30);
      assert.equal(page.totalPosts, count);
      assert.equal(page.totalPages, pages.length);
    }
  }
});

test("each year starts at page one and pagination never crosses into another year", () => {
  const newer = Array.from({ length: 31 }, (_, index) => ({ id: `new-${index}` }));
  const older = Array.from({ length: 60 }, (_, index) => ({ id: `old-${index}` }));
  const pages = archivePages([
    [2026, newer],
    [2025, older]
  ]);
  assert.deepEqual(
    pages.map((page) => [page.year, page.currentPage, page.firstPost]),
    [
      [2026, 1, 1],
      [2026, 2, 31],
      [2025, 1, 1],
      [2025, 2, 31]
    ]
  );
  assert.deepEqual(
    pages.filter((page) => page.year === 2026).flatMap((page) => page.posts),
    newer
  );
  assert.deepEqual(
    pages.filter((page) => page.year === 2025).flatMap((page) => page.posts),
    older
  );
  assert.equal(pages[1].posts.length, 1);
  assert.equal(pages[3].posts.length, 30);
  assert.equal(newer.length, 31);
  assert.equal(older.length, 60);
});

test("archive URLs preserve the selected year, including when returning to page one", () => {
  assert.equal(archivePath(2025), "/archives/2025/");
  assert.equal(archivePath(2025, 1), "/archives/2025/");
  assert.equal(archivePath(2025, 2), "/archives/2025/page/2/");
  assert.equal(archivePath(2026, 67), "/archives/2026/page/67/");
  assert.deepEqual(archivePages([]), []);
});
