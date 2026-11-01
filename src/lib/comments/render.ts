import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { Element, Root } from "hast";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Strip executable markup and user-supplied styles/classes before adding our own print markup.
const processor = createMarkdownProcessor({
  syntaxHighlight: false,
  rehypePlugins: [
    rehypeRaw,
    rehypeSanitize,
    () => (tree: Root) => {
      function visit(node: Root | Element) {
        for (const child of node.children) {
          if (child.type !== "element") continue;
          if (child.tagName === "img") child.properties.loading = "eager";
          if (child.tagName === "details") child.properties.open = true;
          visit(child);
        }
      }
      visit(tree);
    }
  ]
});

export async function renderPrintComment(html: string) {
  return (await (await processor).render(html)).code;
}
