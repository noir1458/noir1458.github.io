import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import rehypeMermaid from "rehype-mermaid";

const projectRoot = path.resolve(import.meta.dirname, "..");
const temporaryRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), "astro-blog-features-")
);
const configDirectory = path.join(temporaryRoot, "config");
const outputDirectory = path.join(temporaryRoot, "dist");
const projectsOutputDirectory = path.join(temporaryRoot, "dist-projects");
const astroEntry = path.join(projectRoot, "node_modules/astro/bin/astro.mjs");
const projectFixture = path.join(
  projectRoot,
  "content/projects/feature-build-fixture.md"
);

function walk(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, predicate);
    return predicate(fullPath) ? [fullPath] : [];
  });
}

try {
  fs.cpSync(path.join(projectRoot, "config"), configDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(configDirectory, "features.yaml"),
    [
      "search: false",
      "rss: false",
      "sitemap: false",
      "darkMode: false",
      "tableOfContents: false",
      "mermaid: false",
      "projects: false",
      "comments: false",
      ""
    ].join("\n")
  );

  const build = spawnSync(
    process.execPath,
    [astroEntry, "build", "--outDir", outputDirectory],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        ASTRO_BLOG_CONFIG_DIR: configDirectory
      }
    }
  );

  if (build.status !== 0) {
    process.stdout.write(build.stdout ?? "");
    process.stderr.write(build.stderr ?? "");
    throw new Error(`disabled-feature build exited with status ${build.status}`);
  }

  assert.equal(fs.existsSync(path.join(outputDirectory, "search/index.html")), false);
  assert.equal(fs.existsSync(path.join(outputDirectory, "rss.xml")), false);
  assert.equal(fs.existsSync(path.join(outputDirectory, "sitemap-index.xml")), false);
  assert.equal(fs.existsSync(path.join(outputDirectory, "projects/index.html")), false);

  const indexHtml = fs.readFileSync(path.join(outputDirectory, "index.html"), "utf8");
  const robots = fs.readFileSync(path.join(outputDirectory, "robots.txt"), "utf8");
  const postHtmlFiles = walk(outputDirectory, (file) => (
    file.endsWith("/index.html")
    && /(?:^|\/)posts\//u.test(path.relative(outputDirectory, file))
  ));
  const postHtml = postHtmlFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

  assert.equal(indexHtml.includes("data-search-shell"), false);
  assert.equal(indexHtml.includes("data-theme-picker"), false);
  assert.equal(indexHtml.includes('type="application/rss+xml"'), false);
  assert.equal(indexHtml.includes('data-theme="light"'), true);
  assert.equal(robots.includes("Sitemap:"), false);
  assert.equal(postHtml.includes('class="article-toc"'), false);
  assert.equal(postHtml.includes('class="comments"'), false);
  assert.equal(postHtml.includes('class="mermaid-block"'), false);
  assert.equal(postHtml.includes('data-language="mermaid"'), true);

  assert.equal(fs.existsSync(projectFixture), false, "feature fixture already exists");
  fs.writeFileSync(
    projectFixture,
    [
      "---",
      "title: Feature Build Project",
      "description: Verifies project list and detail generation.",
      "repository: https://github.com/example/project",
      "demo: https://example.com/project",
      "tags:",
      "  - Astro",
      "featured: true",
      "order: 1",
      "---",
      "",
      "## Project overview",
      "",
      "This body verifies Markdown rendering.",
      "",
      "```mermaid",
      "flowchart LR",
      "    User --> Frontend",
      "    Frontend --> API",
      "    API --> Database",
      "```",
      "",
      "```mermaid",
      "sequenceDiagram",
      "    Browser->>API: GET /user",
      "    API->>DB: SELECT user",
      "    DB-->>API: User",
      "    API-->>Browser: JSON",
      "```",
      "",
      "```mermaid",
      "stateDiagram-v2",
      "    [*] --> Ready",
      "    Ready --> Running",
      "    Running --> Finished",
      "    Finished --> [*]",
      "```",
      "",
      "```mermaid",
      "erDiagram",
      "    AUTHOR ||--o{ POST : writes",
      "    AUTHOR {",
      "        string id PK",
      "    }",
      "    POST {",
      "        string slug PK",
      "    }",
      "```",
      "",
      "```python",
      "print(\"ordinary code remains highlighted\")",
      "```",
      ""
    ].join("\n")
  );
  fs.writeFileSync(
    path.join(configDirectory, "features.yaml"),
    [
      "search: false",
      "rss: false",
      "sitemap: false",
      "darkMode: true",
      "tableOfContents: false",
      "mermaid: true",
      "projects: true",
      "comments: false",
      ""
    ].join("\n")
  );

  const projectBuild = spawnSync(
    process.execPath,
    [astroEntry, "build", "--outDir", projectsOutputDirectory],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        ASTRO_BLOG_CONFIG_DIR: configDirectory
      }
    }
  );

  if (projectBuild.status !== 0) {
    process.stdout.write(projectBuild.stdout ?? "");
    process.stderr.write(projectBuild.stderr ?? "");
    throw new Error(`project-feature build exited with status ${projectBuild.status}`);
  }

  const projectsHtml = fs.readFileSync(
    path.join(projectsOutputDirectory, "projects/index.html"),
    "utf8"
  );
  const projectHtml = fs.readFileSync(
    path.join(
      projectsOutputDirectory,
      "projects/feature-build-fixture/index.html"
    ),
    "utf8"
  );
  assert.equal(projectsHtml.includes("Feature Build Project"), true);
  assert.equal(projectHtml.includes("Project overview"), true);
  assert.equal(projectHtml.includes("https://github.com/example/project"), true);
  assert.equal(projectHtml.includes("https://example.com/project"), true);
  assert.equal((projectHtml.match(/class="mermaid-block"/gu) ?? []).length, 4);
  assert.equal((projectHtml.match(
    /<button\b[^>]*class="mermaid-source"/gu
  ) ?? []).length, 4);
  assert.equal(projectHtml.includes("mermaid-diagram-light"), true);
  assert.equal(projectHtml.includes("mermaid-diagram-dark"), true);
  assert.equal(projectHtml.includes("flowchart LR"), true);
  assert.equal(projectHtml.includes('data-language="python"'), true);
  const darkMermaidSvgs = [...projectHtml.matchAll(
    /src="(data:image\/svg\+xml,[^"]+)"[^>]*class="mermaid-diagram-image mermaid-diagram-dark"/gu
  )].map((match) => (
    decodeURIComponent(match[1].slice(match[1].indexOf(",") + 1))
      .replaceAll("&#x27;", "'")
      .replaceAll("&quot;", '"')
      .replaceAll("&amp;", "&")
  ));
  const darkErSvg = darkMermaidSvgs.find((svg) => svg.includes("row-rect-odd"));
  assert.ok(darkErSvg, "dark ER diagram was not generated");
  assert.match(darkErSvg, /fill=["']#1e293b["']/u);
  assert.match(darkErSvg, /fill=["']#172d59["']/u);
  assert.equal(/96\.960784|#ffffff|#f2f2f2/iu.test(darkErSvg), false);

  const invalidMermaidTree = {
    type: "root",
    children: [{
      type: "element",
      tagName: "pre",
      properties: {},
      children: [{
        type: "element",
        tagName: "code",
        properties: { className: ["language-mermaid"] },
        children: [{
          type: "text",
          value: "flowchart TD\n    A --> D{gcd(A,N) == 1?}\n"
        }]
      }]
    }]
  };
  const invalidMermaidFile = {
    message(reason) {
      return new Error(String(reason));
    }
  };
  const renderInvalidMermaid = rehypeMermaid({ strategy: "img-svg" });
  await assert.rejects(
    async () => renderInvalidMermaid(invalidMermaidTree, invalidMermaidFile),
    /parse error/iu
  );

  console.log(JSON.stringify({
    disabledFeatures: [
      "search",
      "rss",
      "sitemap",
      "darkMode",
      "tableOfContents",
      "mermaid",
      "projects",
      "comments"
    ],
    enabledProjectRoutes: 2,
    invalidMermaidRejected: true,
    generatedPostPages: postHtmlFiles.length,
    errors: []
  }, null, 2));
} finally {
  if (fs.existsSync(projectFixture)) fs.rmSync(projectFixture);
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
