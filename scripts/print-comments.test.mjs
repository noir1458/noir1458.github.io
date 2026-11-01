import assert from "node:assert/strict";
import test from "node:test";
import { renderPrintComment } from "../src/lib/comments/render.ts";
import { giscusPathHash } from "../src/lib/comments/snapshot.ts";
import { collectPrintComments } from "./sync-print-comments.mjs";

const giscus = { repo: "owner/blog", categoryId: "category" };
const hash = giscusPathHash("/posts/example/");
const url = "https://github.com/owner/blog/discussions/1";
const discussion = { id: "discussion", body: `<!-- sha1: ${hash} -->`, url };
const comment = (id, extra = {}) => ({
  id,
  author: { login: "reader" },
  createdAt: "2026-11-01T00:00:00.000Z",
  url: `${url}#discussioncomment-${id}`,
  bodyHTML: `<p>${id}</p>`,
  isMinimized: false,
  deletedAt: null,
  replies: { totalCount: 0 },
  ...extra
});
const page = (nodes, totalCount = nodes.length, endCursor = null) => ({
  nodes,
  totalCount,
  pageInfo: { hasNextPage: endCursor !== null, endCursor }
});

test("uses the same strict pathname hash as the existing giscus discussion", () => {
  assert.equal(
    giscusPathHash("/posts/security-model/"),
    "54fe64d4b95a26dcee4ad1417fcced37dba90269"
  );
  assert.notEqual(giscusPathHash("/en/posts/example/"), hash);
  assert.notEqual(giscusPathHash("/posts/example"), hash);
});

test("collects every discussion/comment/reply page, excluding hidden and deleted content", async () => {
  const comments = Array.from({ length: 101 }, (_, i) => comment(`c${i}`));
  comments[0].replies.totalCount = 101;
  comments[1].isMinimized = true;
  comments[2].deletedAt = "2026-11-01T00:00:00.000Z";
  comments[3].author = null;
  const replies = Array.from({ length: 101 }, (_, i) => comment(`r${i}`));
  replies[1].isMinimized = true;
  const requests = [];
  const snapshot = await collectPrintComments(giscus, async (query, variables) => {
    requests.push({ query, variables });
    if (query.includes("query PrintDiscussions")) {
      assert.equal(variables.categoryId, giscus.categoryId);
      return {
        repository: {
          isPrivate: false,
          discussions: variables.after
            ? page([{ ...discussion, id: "unrelated", body: "No mapping hash" }], 2)
            : page([discussion], 2, "next-discussion")
        }
      };
    }
    const entries = query.includes("query PrintComments") ? comments : replies;
    return {
      node: {
        [query.includes("query PrintComments") ? "comments" : "replies"]: variables.after
          ? page(entries.slice(100), 101)
          : page(entries.slice(0, 100), 101, "next")
      }
    };
  });
  assert.equal(requests.length, 6);
  assert.equal(snapshot.discussions.length, 1);
  assert.equal(snapshot.discussions[0].comments.length, 99);
  assert.equal(snapshot.discussions[0].comments[0].replies.length, 100);
  assert.equal(snapshot.discussions[0].comments.at(-1).id, "c100");
  assert.equal(snapshot.discussions[0].comments[0].replies.at(-1).id, "r100");
  assert.equal(snapshot.discussions[0].comments[1].author, "ghost");
  assert.doesNotMatch(JSON.stringify(snapshot), /isMinimized|deletedAt/u);
});

test("rejects private repositories, missing pages, duplicate mappings and API failures", async () => {
  await assert.rejects(
    collectPrintComments(giscus, async () => ({ repository: { isPrivate: true } })),
    /public/u
  );
  await assert.rejects(
    collectPrintComments(giscus, async () => ({
      repository: { isPrivate: false, discussions: page([], 1) }
    })),
    /partial/u
  );
  await assert.rejects(
    collectPrintComments(giscus, async (query) =>
      query.includes("PrintDiscussions")
        ? {
            repository: {
              isPrivate: false,
              discussions: page([discussion, { ...discussion, id: "other" }])
            }
          }
        : { node: { comments: page([]) } }
    ),
    /Multiple/u
  );
  await assert.rejects(
    collectPrintComments(giscus, async () => {
      throw new Error("API unavailable");
    }),
    /unavailable/u
  );
});

test("retains public replies to a removed parent without storing its author or body", async () => {
  const snapshot = await collectPrintComments(giscus, async (query) => {
    if (query.includes("PrintDiscussions"))
      return { repository: { isPrivate: false, discussions: page([discussion]) } };
    if (query.includes("PrintComments"))
      return {
        node: {
          comments: page([
            comment("removed", { deletedAt: "2026-11-01T00:00:00Z", replies: { totalCount: 1 } })
          ])
        }
      };
    return { node: { replies: page([comment("public-reply")]) } };
  });
  const parent = snapshot.discussions[0].comments[0];
  assert.equal(parent.unavailable, true);
  assert.equal(parent.author, "");
  assert.equal(parent.bodyHTML, "");
  assert.equal(parent.replies[0].id, "public-reply");
});

test("removes executable comment markup while retaining code, tables, images and disclosures", async () => {
  const html =
    await renderPrintComment(`<script>alert('bad')</script><iframe src="https://evil.test"></iframe>
<p class="site-header" style="display:none" onclick="alert(1)">Keep this text <a href="javascript:alert(1)">unsafe link</a></p>
<pre><code>first line\nlast line</code></pre>
<table><tr><th>Column</th></tr><tr><td>Cell</td></tr></table>
<details><summary>Read more</summary><p>Hidden explanation</p></details>
<img src="https://example.org/image.png" onerror="alert(1)" loading="lazy" alt="Diagram">`);
  assert.doesNotMatch(
    html,
    /<script|<iframe|onclick|onerror|javascript:|display:none|site-header/u
  );
  assert.match(html, /Keep this text/u);
  assert.match(html, /first line\nlast line/u);
  assert.match(html, /<td>Cell<\/td>/u);
  assert.match(html, /<details open>/u);
  assert.match(html, /loading="eager"/u);
});
