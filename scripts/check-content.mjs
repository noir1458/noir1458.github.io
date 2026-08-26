import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CATEGORY_SIDEBAR, SITE, SUPPORTED_LANGUAGE_CODES } from "../src/config.ts";
import {
  arrangeSidebarCategories,
  slugifyTermValue
} from "../src/lib/content/sidebarCategories.ts";
import { projectFrontmatterSchema } from "../src/lib/content/projectSchema.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(projectRoot, "content/posts");
const projectContentRoot = path.join(projectRoot, "content/projects");
const supportedLanguages = [...SUPPORTED_LANGUAGE_CODES];
const defaultLanguage = SITE.language;

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

  const { title, slug, description, publishedAt, tags, categories, translationKey } = parsed.data;
  const lang = parsed.data.lang ?? defaultLanguage;
  const filename = path.basename(file);
  const expectedFilename = lang === defaultLanguage ? "index.md" : `${lang}.md`;

  if (!title || typeof title !== "string") errors.push(`${relative}: title is required`);
  if (!slug || typeof slug !== "string") errors.push(`${relative}: slug is required`);
  if (!supportedLanguages.includes(lang)) {
    errors.push(`${relative}: unsupported lang "${lang}"`);
  }
  if (
    translationKey !== undefined
    && (typeof translationKey !== "string" || !translationKey.trim() || /[/\\?#\s]/u.test(translationKey))
  ) {
    errors.push(`${relative}: translationKey must be a non-empty URL-safe identifier`);
  }
  if (filename !== expectedFilename) {
    errors.push(`${relative}: filename must match lang (${expectedFilename})`);
  }
  if (description !== undefined && (typeof description !== "string" || !description.trim())) {
    errors.push(`${relative}: description must be a non-empty string when provided`);
  }
  if (!publishedAt) errors.push(`${relative}: publishedAt is required`);
  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push(`${relative}: tags must be an array when provided`);
  }
  if (typeof categories !== "string" && !Array.isArray(categories)) {
    errors.push(`${relative}: categories must be a string or an array`);
  }
  if (typeof categories === "string" && !categories.trim()) {
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

  const routeKey = `${lang}:${slug}`;
  if (routes.has(routeKey)) {
    errors.push(`${relative}: duplicate ${lang} slug "${slug}" also used by ${routes.get(routeKey)}`);
  } else {
    routes.set(routeKey, relative);
  }

  entries.push({
    file,
    relative,
    directory: path.dirname(file),
    filename,
    lang,
    slug,
    translationKey: translationKey ?? slug,
    draft: parsed.data.draft === true,
    categories: (Array.isArray(categories) ? categories : [categories])
      .filter((category) => typeof category === "string" && category.trim())
  });

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

const groups = new Map();
for (const entry of entries) {
  const group = groups.get(entry.translationKey) ?? [];
  group.push(entry);
  groups.set(entry.translationKey, group);
}

for (const [translationKey, group] of groups) {
  const directories = new Set(group.map((entry) => entry.directory));
  const slugs = new Set(group.map((entry) => entry.slug));
  const draftStates = new Set(group.map((entry) => entry.draft));
  const languages = new Map();

  for (const entry of group) {
    const existing = languages.get(entry.lang);
    if (existing) {
      errors.push(
        `${entry.relative}: duplicate ${entry.lang} translation for "${translationKey}" also used by ${existing.relative}`
      );
    } else {
      languages.set(entry.lang, entry);
    }
  }

  if (directories.size > 1) {
    errors.push(`translationKey "${translationKey}" must be colocated in one post directory`);
  }
  if (slugs.size > 1) {
    errors.push(`translationKey "${translationKey}" has mismatched slugs: ${[...slugs].join(", ")}`);
  }
  if (draftStates.size > 1) {
    errors.push(`translationKey "${translationKey}" has inconsistent draft states`);
  }
}

const translations = entries.length - groups.size;
const sidebarCategoryCounts = new Map();
for (const entry of entries) {
  if (entry.draft || entry.lang !== defaultLanguage) continue;
  for (const category of new Set(entry.categories)) {
    const slug = slugifyTermValue(category);
    const current = sidebarCategoryCounts.get(slug);
    sidebarCategoryCounts.set(slug, {
      name: current?.name ?? category,
      slug,
      count: (current?.count ?? 0) + 1
    });
  }
}
const sidebarCategories = [...sidebarCategoryCounts.values()];
const { unconfigured: unconfiguredSidebarCategories } = arrangeSidebarCategories(
  sidebarCategories,
  CATEGORY_SIDEBAR
);
const warnings = unconfiguredSidebarCategories.length > 0
  ? [`config/categories.yaml: unconfigured sidebar categories: ${unconfiguredSidebarCategories.map((category) => category.slug).join(", ")}`]
  : [];
const projectFiles = walk(projectContentRoot, (file) => file.endsWith(".md"));
let publishedProjects = 0;

for (const file of projectFiles) {
  const relative = path.relative(projectRoot, file);
  const nestedPath = path.relative(projectContentRoot, file);
  const nestedDirectory = path.dirname(nestedPath);
  const isDirectFile = nestedDirectory === ".";
  const isProjectIndex = path.basename(file) === "index.md"
    && path.dirname(nestedDirectory) === ".";
  if (!isDirectFile && !isProjectIndex) {
    errors.push(
      `${relative}: use content/projects/<slug>.md or content/projects/<slug>/index.md`
    );
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

  const slug = isProjectIndex
    ? path.basename(path.dirname(file))
    : path.basename(file, ".md");
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
  logicalPosts: groups.size,
  translations,
  contentEntries: entries.length,
  uniqueRoutes: routes.size,
  projectEntries: projectFiles.length,
  publishedProjects,
  mathPosts,
  imageReferences,
  unconfiguredSidebarCategories: unconfiguredSidebarCategories.map(
    (category) => category.slug
  ),
  warnings,
  errors
};
console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exitCode = 1;
