import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(projectRoot, "src/content/posts");

function walk(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, predicate);
    return predicate(fullPath) ? [fullPath] : [];
  });
}

const files = walk(contentRoot, (file) => file.endsWith("/index.md"));
const errors = [];
const slugs = new Map();
let imageReferences = 0;
let mathPosts = 0;

for (const file of files) {
  const relative = path.relative(projectRoot, file);
  let parsed;
  try {
    parsed = matter(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${relative}: invalid front matter (${error.message})`);
    continue;
  }

  const { title, slug, description, publishedAt, tags, categories } = parsed.data;
  if (!title || typeof title !== "string") errors.push(`${relative}: title is required`);
  if (!slug || typeof slug !== "string") errors.push(`${relative}: slug is required`);
  if (description !== undefined && (typeof description !== "string" || !description.trim())) {
    errors.push(`${relative}: description must be a non-empty string when provided`);
  }
  if (!publishedAt) errors.push(`${relative}: publishedAt is required`);
  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push(`${relative}: tags must be an array when provided`);
  }
  if (
    typeof categories !== "string"
    && !Array.isArray(categories)
  ) {
    errors.push(`${relative}: categories must be a string or an array`);
  }
  if (
    typeof categories === "string"
    && !categories.trim()
  ) {
    errors.push(`${relative}: categories cannot be empty`);
  }
  if (
    Array.isArray(categories)
    && categories.some((category) => typeof category !== "string" || !category.trim())
  ) {
    errors.push(`${relative}: categories must contain non-empty strings`);
  }
  if (/\{%|\{\{|\{::/.test(parsed.content)) {
    errors.push(`${relative}: unsupported Jekyll/Liquid syntax`);
  }

  if (slugs.has(slug)) {
    errors.push(`${relative}: duplicate slug "${slug}" also used by ${slugs.get(slug)}`);
  } else {
    slugs.set(slug, relative);
  }

  if (parsed.data.math) mathPosts += 1;
  const references = [
    ...parsed.content.matchAll(/(?:\]\(|src=["'])(\.\/[^)"'\s]+\.(?:avif|gif|jpe?g|png|svg|webp))/gi)
  ];
  if (typeof parsed.data.cover === "string" && parsed.data.cover.startsWith("./")) {
    references.push([parsed.data.cover, parsed.data.cover]);
  }
  for (const match of references) {
    imageReferences += 1;
    const filePath = path.resolve(path.dirname(file), match[1]);
    if (!fs.existsSync(filePath)) {
      errors.push(`${relative}: missing image ${match[1]}`);
    }
  }
}

const result = {
  posts: files.length,
  uniqueSlugs: slugs.size,
  mathPosts,
  imageReferences,
  errors
};
console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exitCode = 1;
