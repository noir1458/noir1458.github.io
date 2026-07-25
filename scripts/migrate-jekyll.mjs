import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const projectRoot = path.resolve(import.meta.dirname, "..");
const defaultSource = path.resolve(projectRoot, "../github_skin");
const sourceArgIndex = process.argv.indexOf("--source");
const sourceRoot =
  sourceArgIndex >= 0 && process.argv[sourceArgIndex + 1]
    ? path.resolve(process.argv[sourceArgIndex + 1])
    : defaultSource;
const force = process.argv.includes("--force");

const postsRoot = path.join(sourceRoot, "_posts");
const outputRoot = path.join(projectRoot, "src/content/posts");
const publicRoot = path.join(projectRoot, "public");
const reportRoot = path.join(projectRoot, "reports");

if (!fs.existsSync(postsRoot)) {
  throw new Error(`Jekyll posts directory not found: ${postsRoot}`);
}

function walk(directory, predicate = () => true) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, predicate);
    return predicate(fullPath) ? [fullPath] : [];
  });
}

function normalizeTerms(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.flatMap(normalizeTerms))];
  }
  if (typeof value !== "string") return [];

  return [
    ...new Set(
      value
        .split(",")
        .map((term) => term.trim())
        .filter(Boolean)
    )
  ];
}

function firstImage(markdown) {
  const markdownMatch = markdown.match(/!\[[^\]]*\]\((\/images\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/);
  if (markdownMatch) return markdownMatch[1];

  const htmlMatch = markdown.match(/<img[^>]+src=["'](\/images\/[^"']+)["']/i);
  return htmlMatch?.[1];
}

function copyTree(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

const files = walk(postsRoot, (file) => file.endsWith(".md")).sort();
const seenSlugs = new Map();
const report = {
  source: sourceRoot,
  generatedAt: new Date().toISOString(),
  totals: {
    discovered: files.length,
    migrated: 0,
    skipped: 0,
    math: 0,
    covers: 0
  },
  duplicateSlugs: [],
  invalidFiles: [],
  unsupportedLiquid: [],
  missingImages: []
};

fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(reportRoot, { recursive: true });

for (const sourcePath of files) {
  const relativeSource = path.relative(sourceRoot, sourcePath).split(path.sep).join("/");
  const filename = path.basename(sourcePath);
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);

  if (!match) {
    report.invalidFiles.push({ path: relativeSource, reason: "Invalid Jekyll post filename" });
    continue;
  }

  const [, filenameDate, slug] = match;
  if (seenSlugs.has(slug)) {
    report.duplicateSlugs.push({
      slug,
      first: seenSlugs.get(slug),
      second: relativeSource
    });
    continue;
  }
  seenSlugs.set(slug, relativeSource);

  const raw = fs.readFileSync(sourcePath, "utf8");
  const parsed = matter(raw);
  const normalizedContent = parsed.content.replace(/\]\(\.\/images\//g, "](/images/");
  if (/\{%|\{\{|\{::/.test(normalizedContent)) {
    report.unsupportedLiquid.push(relativeSource);
  }

  const title = String(parsed.data.title ?? slug).trim();
  const categories = normalizeTerms(parsed.data.categories);
  const publishedAt =
    parsed.data.date instanceof Date
      ? parsed.data.date.toISOString()
      : String(parsed.data.date ?? filenameDate);
  const cover = firstImage(normalizedContent);
  const math =
    parsed.data.math === true ||
    /(?:\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/.test(normalizedContent);
  if (math) report.totals.math += 1;

  const primaryCategory = categories[0] || "uncategorized";
  const categoryDirectory = primaryCategory.replace(/[/\\]/g, "-");
  const destinationDirectory = path.join(outputRoot, categoryDirectory, slug);
  const destinationPath = path.join(destinationDirectory, "index.md");

  if (fs.existsSync(destinationPath) && !force) {
    report.totals.skipped += 1;
    continue;
  }

  let content = normalizedContent;
  const imageReferences = [...new Set(content.match(/\/images\/[^\s)"']+/g) ?? [])];
  for (const imageReference of imageReferences) {
    const imagePath = path.join(sourceRoot, imageReference.replace(/^\//, ""));
    if (!fs.existsSync(imagePath)) {
      report.missingImages.push({ post: relativeSource, image: imageReference });
      continue;
    }

    const localReference = `./${path.basename(imagePath)}`;
    const destinationImage = path.join(destinationDirectory, path.basename(imagePath));
    fs.mkdirSync(destinationDirectory, { recursive: true });
    fs.copyFileSync(imagePath, destinationImage);
    content = content.split(imageReference).join(localReference);
  }

  const localCover = cover ? `./${path.basename(cover)}` : undefined;
  if (localCover) report.totals.covers += 1;
  const frontmatter = {
    title,
    slug,
    publishedAt,
    categories: categories.length === 1 ? categories[0] : categories,
    math,
    ...(parsed.data.published === false ? { draft: true } : {}),
    ...(localCover ? { cover: localCover } : {})
  };

  fs.mkdirSync(destinationDirectory, { recursive: true });
  fs.writeFileSync(destinationPath, matter.stringify(content, frontmatter));
  report.totals.migrated += 1;
}

copyTree(path.join(sourceRoot, "assets/img"), path.join(publicRoot, "assets/img"));

fs.writeFileSync(
  path.join(reportRoot, "migration.json"),
  `${JSON.stringify(report, null, 2)}\n`
);

console.log(JSON.stringify(report, null, 2));

if (
  report.duplicateSlugs.length ||
  report.invalidFiles.length ||
  report.unsupportedLiquid.length ||
  report.missingImages.length
) {
  process.exitCode = 1;
}
