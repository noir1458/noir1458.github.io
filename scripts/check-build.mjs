import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const distRoot = path.join(projectRoot, "dist");

function walk(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, predicate);
    return predicate(fullPath) ? [fullPath] : [];
  });
}

function resolvesPublicPath(urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]);
  const candidate = path.join(distRoot, clean.replace(/^\//, ""));
  return (
    fs.existsSync(candidate) ||
    fs.existsSync(`${candidate}.html`) ||
    fs.existsSync(path.join(candidate, "index.html"))
  );
}

if (!fs.existsSync(distRoot)) {
  throw new Error("dist does not exist. Run npm run build first.");
}

const htmlFiles = walk(distRoot, (file) => file.endsWith(".html"));
const errors = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/\shref=["']([^"']+)["']/g)) {
    const href = match[1];
    if (
      !href.startsWith("/") ||
      href.startsWith("//") ||
      href.startsWith("/_pagefind/") ||
      checked.has(href)
    ) {
      continue;
    }
    checked.add(href);
    if (!resolvesPublicPath(href)) {
      errors.push(`${path.relative(distRoot, file)}: broken internal link ${href}`);
    }
  }
}

const required = [
  "index.html",
  "404.html",
  "rss.xml",
  "sitemap-index.xml",
  "search/index.html",
  "tags/index.html",
  "categories/index.html",
  "archives/index.html",
  "pagefind/pagefind.js"
];
for (const target of required) {
  if (!fs.existsSync(path.join(distRoot, target))) {
    errors.push(`missing required build artifact: ${target}`);
  }
}

const postPages = walk(path.join(distRoot, "posts"), (file) =>
  file.endsWith("/index.html")
);
if (postPages.length < 136) {
  errors.push(`expected at least 136 post pages, found ${postPages.length}`);
}

let postDescriptions = 0;
for (const file of postPages) {
  const html = fs.readFileSync(file, "utf8");
  const description = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  )?.[1]?.trim();
  if (!description) {
    errors.push(`${path.relative(distRoot, file)}: missing generated meta description`);
    continue;
  }
  postDescriptions += 1;
}

console.log(
  JSON.stringify(
    {
      htmlFiles: htmlFiles.length,
      postPages: postPages.length,
      postDescriptions,
      checkedInternalLinks: checked.size,
      errors
    },
    null,
    2
  )
);

if (errors.length) process.exitCode = 1;
