import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import rehypeRaw from "rehype-raw";
import { rehypePrint } from "../src/lib/markdown/rehypePrint.ts";

const options = {
  siteUrl: "https://example.com/",
  defaultLanguage: "ko",
  languagePrefixes: { ko: "", en: "/en", ja: "/ja" }
};
const transform = rehypePrint(options);
const link = (href) => ({
  type: "element",
  tagName: "a",
  properties: { href },
  children: [{ type: "text", value: "Link" }]
});
const file = (lang = "ko") => ({ data: { astro: { frontmatter: { slug: "sample", lang } } } });
const list = (tree) => tree.children.at(-1).children[1].children;

test("deduplicates resolved links while preserving their original destinations", () => {
  const links = [
    link("/guide/"),
    link("https://example.com/guide/"),
    link("https://other.test/a?b=1&c=2")
  ];
  const tree = { type: "root", children: structuredClone(links) };
  transform(tree, file());
  assert.deepEqual(
    tree.children.filter((node) => node.tagName === "a"),
    links
  );
  assert.deepEqual(
    tree.children.filter((node) => node.tagName === "sup").map((node) => node.children[0].value),
    ["[1]", "[1]", "[2]"]
  );
  assert.deepEqual(
    list(tree).map((node) => node.children[0].properties.href),
    ["https://example.com/guide/", "https://other.test/a?b=1&c=2"]
  );
  assert.equal(tree.children.at(-1).properties.dataPagefindIgnore, true);
});

test("ignores fragments, unsupported schemes, credentials and code examples", () => {
  const tree = {
    type: "root",
    children: [
      ...[
        "#section",
        "https://example.com/posts/sample/#section",
        "mailto:a@example.com",
        "javascript:alert(1)",
        "data:text/plain,example",
        "https://user:password@example.com/",
        "http://[",
        ""
      ].map(link),
      { type: "element", tagName: "pre", properties: {}, children: [link("https://example.org/")] }
    ]
  };
  const original = structuredClone(tree);
  transform(tree, file());
  assert.deepEqual(tree, original);
});

test("localizes labels and resolves relative URLs against the translated post", () => {
  const tree = { type: "root", children: [link("attachment.pdf")] };
  transform(tree, file("ja"));
  assert.equal(tree.children.at(-1).children[0].children[0].value, "参考リンク");
  assert.equal(
    list(tree)[0].children[0].properties.href,
    "https://example.com/ja/posts/sample/attachment.pdf"
  );
});

test("leaves non-post Markdown alone but preserves external URLs in footnotes", () => {
  const tree = { type: "root", children: [link("https://example.org/")] };
  const original = structuredClone(tree);
  transform(tree, {});
  assert.deepEqual(tree, original);
  const footnotes = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "section",
        properties: { dataFootnotes: true },
        children: [link("https://example.org/"), link("#user-content-fnref-1")]
      }
    ]
  };
  transform(footnotes, file());
  assert.equal(list(footnotes).length, 1);
  assert.equal(list(footnotes)[0].children[0].properties.href, "https://example.org/");
  assert.equal(footnotes.children[0].children.at(-1).properties.href, "#user-content-fnref-1");
});

test("preloads post images for native printing while leaving other Markdown unchanged", () => {
  const image = {
    type: "element",
    tagName: "img",
    properties: { src: "/image.webp", loading: "lazy" },
    children: []
  };
  const post = { type: "root", children: [structuredClone(image)] };
  transform(post, file());
  assert.equal(post.children[0].properties.loading, "eager");
  const other = { type: "root", children: [structuredClone(image)] };
  transform(other, {});
  assert.equal(other.children[0].properties.loading, "lazy");
});

test("processes authored HTML images and links inside collapsible Markdown", async () => {
  const processor = await createMarkdownProcessor({
    syntaxHighlight: false,
    rehypePlugins: [rehypeRaw, [rehypePrint, options]]
  });
  const { code } = await processor.render(
    '<details><summary>Notes</summary><a href="https://example.org/">Source</a><img src="/notes.webp" alt="Notes" loading="lazy"></details>',
    { frontmatter: { slug: "sample", lang: "ko" } }
  );
  assert.match(code, /loading="eager"/u);
  assert.match(code, /class="print-reference"/u);
  assert.match(code, /참고 링크/u);
  assert.match(code, /<details><summary>Notes<\/summary>/u);
  assert.doesNotMatch(code, /<details open/u);
});
