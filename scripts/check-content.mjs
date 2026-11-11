import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { USER_CONFIG } from "../src/config.ts";
import { postCategoriesSchema } from "../src/lib/content/postCategories.ts";
import { projectFrontmatterSchema } from "../src/lib/content/projectSchema.ts";
import { slugifyTermValue } from "../src/lib/content/termSlugs.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(projectRoot, "content/posts");
const projectContentRoot = path.join(projectRoot, "content/projects");

function walk(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, predicate);
    return predicate(fullPath) ? [fullPath] : [];
  });
}

const files = walk(contentRoot, (file) => file.endsWith(".md"));
const errors = [];
const entries = [];
const routes = new Map();
const projectRoutes = new Map();
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

  const { title, slug, description, publishedAt, tags } = parsed.data;
  const filename = path.basename(file);

  if (!title || typeof title !== "string") errors.push(`${relative}: title is required`);
  if (!slug || typeof slug !== "string") errors.push(`${relative}: slug is required`);
  if (filename !== "index.md") {
    errors.push(`${relative}: a post must be named index.md inside its own folder`);
  }
  if (description !== undefined && (typeof description !== "string" || !description.trim())) {
    errors.push(`${relative}: description must be a non-empty string when provided`);
  }
  if (!publishedAt) errors.push(`${relative}: publishedAt is required`);
  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push(`${relative}: tags must be an array when provided`);
  }
  const categoryResult = postCategoriesSchema.safeParse(parsed.data);
  if (!categoryResult.success) {
    for (const issue of categoryResult.error.issues) {
      errors.push(`${relative}: ${issue.path.join(".")}: ${issue.message}`);
    }
  }
  if (/\{%|\{\{|\{::/.test(parsed.content)) {
    errors.push(`${relative}: unsupported Jekyll/Liquid syntax`);
  }

  if (routes.has(slug)) {
    errors.push(`${relative}: duplicate slug "${slug}" also used by ${routes.get(slug)}`);
  } else {
    routes.set(slug, relative);
  }

  entries.push({
    file,
    relative,
    slug,
    draft: parsed.data.draft === true,
    categories: categoryResult.success ? categoryResult.data.categories : []
  });

  if (parsed.data.math) mathPosts += 1;
  const references = [
    ...parsed.content.matchAll(
      /(?:\]\(|src=["'])(\.\/[^)"'\s]+\.(?:avif|gif|jpe?g|png|svg|webp))/gi
    )
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

const configuredCategories = new Set(USER_CONFIG.categories.groups.flatMap((g) => g.categories));
const ungroupedCategories = new Set();
for (const entry of entries) {
  if (entry.draft) continue;
  for (const category of entry.categories) {
    const slug = slugifyTermValue(category);
    if (!configuredCategories.has(slug)) ungroupedCategories.add(slug);
  }
}
if (ungroupedCategories.size > 0) {
  console.warn(
    `[config/categories.yaml] 미분류 카테고리: ${[...ungroupedCategories].sort().join(", ")} (More categories에 표시됩니다.)`
  );
}

const projectFiles = walk(projectContentRoot, (file) => file.endsWith(".md"));
let publishedProjects = 0;

for (const file of projectFiles) {
  const relative = path.relative(projectRoot, file);
  const nestedPath = path.relative(projectContentRoot, file);
  const nestedDirectory = path.dirname(nestedPath);
  const isDirectFile = nestedDirectory === ".";
  const isProjectIndex =
    path.basename(file) === "index.md" && path.dirname(nestedDirectory) === ".";
  if (!isDirectFile && !isProjectIndex) {
    errors.push(`${relative}: use content/projects/<slug>.md or content/projects/<slug>/index.md`);
  }

  let parsed;
  try {
    parsed = matter(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${relative}: invalid front matter (${error.message})`);
    continue;
  }

  const result = projectFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path.length > 0 ? issue.path.join(".") : "<root>";
      errors.push(`${relative}: ${field}: ${issue.message}`);
    }
    continue;
  }

  const slug = isProjectIndex ? path.basename(path.dirname(file)) : path.basename(file, ".md");
  const existing = projectRoutes.get(slug);
  if (existing) {
    errors.push(`${relative}: duplicate project slug "${slug}" also used by ${existing}`);
  } else {
    projectRoutes.set(slug, relative);
  }

  if (!result.data.draft) publishedProjects += 1;
  const references = [
    ...parsed.content.matchAll(
      /(?:\]\(|src=["'])(\.\/[^)"'\s]+\.(?:avif|gif|jpe?g|png|svg|webp))/gi
    )
  ];
  if (result.data.image) references.push([result.data.image, result.data.image]);
  for (const match of references) {
    imageReferences += 1;
    const imagePath = path.resolve(path.dirname(file), match[1]);
    if (!fs.existsSync(imagePath)) {
      errors.push(`${relative}: missing project image ${match[1]}`);
    }
  }
}

const result = {
  contentEntries: entries.length,
  uniqueRoutes: routes.size,
  projectEntries: projectFiles.length,
  publishedProjects,
  mathPosts,
  imageReferences,
  errors
};
console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exitCode = 1;
