import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const temporaryRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), "astro-blog-features-")
);
const configDirectory = path.join(temporaryRoot, "config");
const outputDirectory = path.join(temporaryRoot, "dist");
const astroEntry = path.join(projectRoot, "node_modules/astro/bin/astro.mjs");

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

  console.log(JSON.stringify({
    disabledFeatures: [
      "search",
      "rss",
      "sitemap",
      "darkMode",
      "tableOfContents",
      "comments"
    ],
    generatedPostPages: postHtmlFiles.length,
    errors: []
  }, null, 2));
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
