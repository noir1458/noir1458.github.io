import type { Blockquote, Paragraph, Root, RootContent, Text } from "mdast";

const ADMONITION_TITLES = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution"
} as const;

type AdmonitionType = keyof typeof ADMONITION_TITLES;

const ADMONITION_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:[ \t]*\r?\n|[ \t]*$)/iu;

function isParagraph(node: RootContent | undefined): node is Paragraph {
  return node?.type === "paragraph";
}

function isText(node: Paragraph["children"][number] | undefined): node is Text {
  return node?.type === "text";
}

function transformBlockquote(node: Blockquote): void {
  const firstParagraph = node.children[0];
  if (!isParagraph(firstParagraph)) return;

  const firstText = firstParagraph.children[0];
  if (!isText(firstText)) return;

  const marker = firstText.value.match(ADMONITION_MARKER);
  if (!marker) return;

  const type = marker[1].toLowerCase() as AdmonitionType;
  firstText.value = firstText.value.slice(marker[0].length);
  if (!firstText.value) firstParagraph.children.shift();
  if (firstParagraph.children.length === 0) node.children.shift();

  node.data = {
    ...node.data,
    hName: "aside",
    hProperties: {
      className: ["admonition", `admonition-${type}`]
    }
  };
  node.children.unshift({
    type: "paragraph",
    data: {
      hName: "div",
      hProperties: { className: ["admonition-title"] }
    },
    children: [{ type: "text", value: ADMONITION_TITLES[type] }]
  });
}

export function remarkAdmonitions() {
  return (tree: Root) => {
    function visit(node: Root | RootContent): void {
      if (node.type === "blockquote") transformBlockquote(node);
      if ("children" in node) {
        for (const child of node.children) visit(child as RootContent);
      }
    }

    visit(tree);
  };
}
