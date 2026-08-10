import type { Element, ElementContent, Root } from "hast";

interface RehypeMermaidSourceOptions {
  defaultLanguage: string;
}

interface MarkdownVFile {
  data?: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
}

const SOURCE_LABELS = {
  en: { show: "View Mermaid source", hide: "Hide Mermaid source" },
  ja: { show: "Mermaid ソースを表示", hide: "Mermaid ソースを隠す" },
  ko: { show: "Mermaid 소스 보기", hide: "Mermaid 소스 숨기기" }
} as const;

export const MERMAID_LIGHT_CONFIG = {
  theme: "base",
  securityLevel: "strict",
  fontFamily: "Arial, sans-serif",
  flowchart: { useMaxWidth: true },
  themeVariables: {
    background: "#ffffff",
    primaryColor: "#f7f9f7",
    primaryTextColor: "#334139",
    primaryBorderColor: "#9bafa2",
    secondaryColor: "#edf4ef",
    tertiaryColor: "#ffffff",
    lineColor: "#4d775d",
    textColor: "#334139"
  }
};

export const MERMAID_DARK_CONFIG = {
  ...MERMAID_LIGHT_CONFIG,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "#111827",
    primaryColor: "#172d59",
    primaryTextColor: "#e2e8f0",
    primaryBorderColor: "#00f0ff",
    secondaryColor: "#27223f",
    secondaryTextColor: "#e2e8f0",
    secondaryBorderColor: "#8b5cf6",
    tertiaryColor: "#1e293b",
    tertiaryTextColor: "#e2e8f0",
    tertiaryBorderColor: "#475569",
    lineColor: "#63f6ff",
    textColor: "#e2e8f0",
    mainBkg: "#172d59",
    nodeBkg: "#172d59",
    nodeTextColor: "#e2e8f0",
    nodeBorder: "#00f0ff",
    actorBkg: "#172d59",
    actorTextColor: "#e2e8f0",
    actorBorder: "#00f0ff",
    labelBoxBkgColor: "#172d59",
    labelBoxBorderColor: "#00f0ff",
    labelTextColor: "#e2e8f0",
    signalColor: "#63f6ff",
    signalTextColor: "#e2e8f0",
    edgeLabelBackground: "#111827",
    rowOdd: "#1e293b",
    rowEven: "#172d59",
    attributeBackgroundColorOdd: "#172d59",
    attributeBackgroundColorEven: "#1e293b",
    noteBkgColor: "#27223f",
    noteTextColor: "#e2e8f0",
    noteBorderColor: "#8b5cf6"
  }
};

function isElement(
  node: Root["children"][number] | ElementContent
): node is Element {
  return node.type === "element";
}

function classNames(element: Element): string[] {
  const value = element.properties.className;
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function hasClass(element: Element, className: string): boolean {
  return classNames(element).includes(className);
}

function textContent(node: Element): string {
  return node.children.map((child) => {
    if (child.type === "text") return child.value;
    return child.type === "element" ? textContent(child) : "";
  }).join("");
}

function sourceLabels(language: unknown) {
  const baseLanguage = typeof language === "string"
    ? language.toLowerCase().split("-")[0]
    : "en";
  return SOURCE_LABELS[baseLanguage as keyof typeof SOURCE_LABELS]
    ?? SOURCE_LABELS.en;
}

function createSourceToggle(source: string, language: unknown): Element {
  const labels = sourceLabels(language);
  return {
    type: "element",
    tagName: "details",
    properties: { className: ["mermaid-source"] },
    children: [
      {
        type: "element",
        tagName: "summary",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["mermaid-source-show"] },
            children: [{ type: "text", value: labels.show }]
          },
          {
            type: "element",
            tagName: "span",
            properties: { className: ["mermaid-source-hide"] },
            children: [{ type: "text", value: labels.hide }]
          }
        ]
      },
      {
        type: "element",
        tagName: "pre",
        properties: { className: ["mermaid-source-pre"] },
        children: [
          {
            type: "element",
            tagName: "code",
            properties: { className: ["mermaid-source-code"] },
            children: [{ type: "text", value: source }]
          }
        ]
      }
    ]
  };
}

export function rehypeMermaidSource({ defaultLanguage }: RehypeMermaidSourceOptions) {
  return (tree: Root, file: MarkdownVFile) => {
    const language = file.data?.astro?.frontmatter?.lang ?? defaultLanguage;

    function visit(parent: Root | Element): void {
      parent.children.forEach((child, index) => {
        if (!isElement(child)) return;

        const code = child.tagName === "pre"
          ? child.children.find((candidate) => (
            isElement(candidate)
            && candidate.tagName === "code"
            && hasClass(candidate, "language-mermaid")
          ))
          : undefined;

        if (code && isElement(code)) {
          const source = textContent(code);
          parent.children[index] = {
            type: "element",
            tagName: "div",
            properties: { className: ["mermaid-block"] },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: { className: ["mermaid-diagram"] },
                children: [child]
              },
              createSourceToggle(source, language)
            ]
          };
          return;
        }

        visit(child);
      });
    }

    visit(tree);
  };
}

function dataUri(properties: Element["properties"], property: "src" | "srcSet" | "srcset") {
  const value = properties[property];
  return typeof value === "string" ? value : undefined;
}

function themedImage(
  source: Element["properties"],
  fallback: Element["properties"],
  theme: "light" | "dark"
): Element {
  return {
    type: "element",
    tagName: "img",
    properties: {
      alt: fallback.alt ?? "",
      decoding: "async",
      height: source.height ?? fallback.height,
      loading: "lazy",
      src: dataUri(source, "src") ?? dataUri(source, "srcSet")
        ?? dataUri(source, "srcset"),
      title: fallback.title,
      width: source.width ?? fallback.width,
      className: ["mermaid-diagram-image", `mermaid-diagram-${theme}`]
    },
    children: []
  };
}

export function rehypeMermaidTheme() {
  return (tree: Root) => {
    function visit(parent: Root | Element): void {
      parent.children.forEach((child, index) => {
        if (!isElement(child)) return;

        if (child.tagName === "picture" && parent.type === "element"
          && hasClass(parent, "mermaid-diagram")) {
          const source = child.children.find((candidate) => (
            isElement(candidate) && candidate.tagName === "source"
          ));
          const image = child.children.find((candidate) => (
            isElement(candidate) && candidate.tagName === "img"
          ));
          if (source && image && isElement(source) && isElement(image)) {
            parent.children[index] = {
              type: "element",
              tagName: "span",
              properties: { className: ["mermaid-theme-images"] },
              children: [
                themedImage(image.properties, image.properties, "light"),
                themedImage(source.properties, image.properties, "dark")
              ]
            };
            return;
          }
        }

        if (child.tagName === "img" && parent.type === "element"
          && hasClass(parent, "mermaid-diagram")) {
          child.properties = themedImage(
            child.properties,
            child.properties,
            "light"
          ).properties;
          return;
        }

        visit(child);
      });
    }

    visit(tree);
  };
}
