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
  en: "View Mermaid source",
  ja: "Mermaid ソースを表示",
  ko: "Mermaid 소스 보기"
} as const;

const MERMAID_FONT_SIZE = 16;

export const MERMAID_LIGHT_CONFIG = {
  theme: "base",
  securityLevel: "strict",
  fontFamily: "Arial, sans-serif",
  fontSize: MERMAID_FONT_SIZE,
  flowchart: { useMaxWidth: true, nodeSpacing: 24, rankSpacing: 30, wrappingWidth: 160 },
  er: {
    fontSize: MERMAID_FONT_SIZE,
    entityPadding: 10,
    diagramPadding: 8,
    nodeSpacing: 24,
    rankSpacing: 30
  },
  sequence: {
    actorFontSize: MERMAID_FONT_SIZE,
    messageFontSize: MERMAID_FONT_SIZE,
    noteFontSize: MERMAID_FONT_SIZE,
    wrap: true
  },
  themeVariables: {
    fontSize: `${MERMAID_FONT_SIZE}px`,
    background: "#ffffff",
    primaryColor: "#f7f9f7",
    primaryTextColor: "#28332d",
    primaryBorderColor: "#9bafa2",
    secondaryColor: "#edf4ef",
    tertiaryColor: "#ffffff",
    lineColor: "#4d775d",
    textColor: "#28332d"
  }
};

export const MERMAID_DARK_CONFIG = {
  ...MERMAID_LIGHT_CONFIG,
  theme: "dark",
  themeVariables: {
    fontSize: `${MERMAID_FONT_SIZE}px`,
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

function isElement(node: Root["children"][number] | ElementContent): node is Element {
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
  return node.children
    .map((child) => {
      if (child.type === "text") return child.value;
      return child.type === "element" ? textContent(child) : "";
    })
    .join("");
}

function sourceLabels(language: unknown) {
  const baseLanguage = typeof language === "string" ? language.toLowerCase().split("-")[0] : "en";
  return SOURCE_LABELS[baseLanguage as keyof typeof SOURCE_LABELS] ?? SOURCE_LABELS.en;
}

function createSourceButton(source: string, language: unknown): Element {
  const label = sourceLabels(language);
  return {
    type: "element",
    tagName: "button",
    properties: {
      ariaLabel: label,
      className: ["mermaid-source"],
      dataMermaidSource: source,
      title: label,
      type: "button"
    },
    children: [
      {
        type: "element",
        tagName: "svg",
        properties: {
          ariaHidden: "true",
          fill: "none",
          viewBox: "0 0 24 24"
        },
        children: [
          {
            type: "element",
            tagName: "path",
            properties: { d: "m8 9-3 3 3 3" },
            children: []
          },
          {
            type: "element",
            tagName: "path",
            properties: { d: "m16 9 3 3-3 3" },
            children: []
          },
          {
            type: "element",
            tagName: "path",
            properties: { d: "m14 5-4 14" },
            children: []
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

        const code =
          child.tagName === "pre"
            ? child.children.find(
                (candidate) =>
                  isElement(candidate)
                  && candidate.tagName === "code"
                  && hasClass(candidate, "language-mermaid")
              )
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
              createSourceButton(source, language)
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
  const src = dataUri(source, "src") ?? dataUri(source, "srcSet") ?? dataUri(source, "srcset");
  let svg = "";
  if (src?.startsWith("data:image/svg+xml")) {
    const separator = src.indexOf(",");
    const data = src.slice(separator + 1);
    svg = src.slice(0, separator).includes(";base64")
      ? Buffer.from(data, "base64").toString("utf8")
      : decodeURIComponent(data);
  }
  const viewBox = svg
    .match(/\bviewBox=["']([^"']+)["']/u)?.[1]
    .trim()
    .split(/\s+/u)
    .map(Number);
  const width = viewBox?.[2] ?? Number(source.width ?? fallback.width);
  const height = viewBox?.[3] ?? Number(source.height ?? fallback.height);
  const fontSize = Number(svg.match(/font-size:\s*([\d.]+)px\b/u)?.[1] ?? MERMAID_FONT_SIZE);
  const sizing = [width, height, fontSize].every((value) => Number.isFinite(value) && value > 0)
    ? {
        dataMermaidWidth: width,
        dataMermaidHeight: height,
        dataMermaidFontSize: fontSize,
        style: `--mermaid-width: ${(width / fontSize).toFixed(4)}em; --mermaid-aspect-ratio: ${(width / height).toFixed(6)};`
      }
    : {};
  return {
    type: "element",
    tagName: "img",
    properties: {
      alt: fallback.alt ?? "",
      decoding: "async",
      height: source.height ?? fallback.height,
      loading: "lazy",
      src,
      title: fallback.title,
      width: source.width ?? fallback.width,
      className: ["mermaid-diagram-image", `mermaid-diagram-${theme}`],
      ...sizing
    },
    children: []
  };
}

export function rehypeMermaidTheme() {
  return (tree: Root) => {
    function visit(parent: Root | Element): void {
      parent.children.forEach((child, index) => {
        if (!isElement(child)) return;

        if (
          child.tagName === "picture"
          && parent.type === "element"
          && hasClass(parent, "mermaid-diagram")
        ) {
          const source = child.children.find(
            (candidate) => isElement(candidate) && candidate.tagName === "source"
          );
          const image = child.children.find(
            (candidate) => isElement(candidate) && candidate.tagName === "img"
          );
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

        if (
          child.tagName === "img"
          && parent.type === "element"
          && hasClass(parent, "mermaid-diagram")
        ) {
          child.properties = themedImage(child.properties, child.properties, "light").properties;
          return;
        }

        visit(child);
      });
    }

    visit(tree);
  };
}
