import type { Element, Root } from "hast";

interface Options {
  siteUrl: string;
  language: string;
}

interface MarkdownFile {
  data?: { astro?: { frontmatter?: Record<string, unknown> } };
}

const labels: Record<string, string> = {
  ko: "참고 링크",
  en: "Reference links",
  ja: "参考リンク"
};

// Build references once, so printing does not depend on client-side JavaScript.
export function rehypePrint(options: Options) {
  return (tree: Root, file: MarkdownFile) => {
    const frontmatter = file.data?.astro?.frontmatter;
    if (typeof frontmatter?.slug !== "string") return;
    const { language } = options;
    const base = new URL(`/posts/${frontmatter.slug}/`, options.siteUrl);
    const references = new Map<string, number>();

    function visit(parent: Root | Element): void {
      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (child.type !== "element") continue;
        // Off-screen lazy images can be omitted from native print snapshots.
        // Scope eager loading to post bodies; list thumbnails stay lazy.
        if (child.tagName === "img") child.properties.loading = "eager";
        // Code and controls are not document references. Footnote URLs still are.
        if (["pre", "code", "button", "script", "style"].includes(child.tagName)) continue;

        visit(child);
        if (child.tagName !== "a") continue;

        const href = child.properties.href;
        if (typeof href !== "string" || !href.trim() || href.startsWith("#")) continue;
        let url: URL;
        try {
          url = new URL(href, base);
        } catch {
          continue;
        }
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
          continue;
        }
        if (url.origin === base.origin && url.pathname === base.pathname && url.hash) {
          continue;
        }
        const number = references.get(url.href) ?? references.size + 1;
        references.set(url.href, number);
        const marker: Element = {
          type: "element",
          tagName: "sup",
          properties: { className: ["print-reference"], dataPagefindIgnore: true },
          children: [{ type: "text", value: `[${number}]` }]
        };
        parent.children.splice(index + 1, 0, marker);
        index += 1;
      }
    }

    visit(tree);
    if (!references.size) return;
    tree.children.push({
      type: "element",
      tagName: "section",
      properties: { className: ["print-references"], dataPagefindIgnore: true },
      children: [
        {
          type: "element",
          tagName: "p",
          properties: { className: ["print-references-title"] },
          children: [{ type: "text", value: labels[language] ?? labels.en }]
        },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: [...references.keys()].map((href) => ({
            type: "element",
            tagName: "li",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "a",
                properties: { href },
                children: [{ type: "text", value: href }]
              }
            ]
          }))
        }
      ]
    });
  };
}
