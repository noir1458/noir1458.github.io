import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import matter from "gray-matter";
import { SITE, SUPPORTED_LANGUAGE_CODES } from "../src/config.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(projectRoot, "content/posts");
const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function slugify(value) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{Letter}\p{Number}._~-]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function splitTerms(value) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ];
}

function todayInConfiguredTimeZone() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: SITE.timeZone
  }).format(new Date());
}

try {
  const title = (await prompt.question("Title: ")).trim();
  if (!title) throw new Error("Title is required.");

  const suggestedSlug = slugify(title);
  const slugInput = (await prompt.question(`Slug (${suggestedSlug || "required"}): `)).trim();
  const slug = slugInput || suggestedSlug;
  if (!slug || /[/\\?#\s]/u.test(slug)) {
    throw new Error("Slug cannot contain spaces, slashes, ?, or #.");
  }

  const languageInput = (
    await prompt.question(`Language [${SUPPORTED_LANGUAGE_CODES.join("/")}] (${SITE.language}): `)
  )
    .trim()
    .toLowerCase();
  const language = languageInput || SITE.language;
  if (!SUPPORTED_LANGUAGE_CODES.includes(language)) {
    throw new Error(`Language must be one of: ${SUPPORTED_LANGUAGE_CODES.join(", ")}.`);
  }

  const categories = splitTerms(await prompt.question("Categories (comma separated): "));
  const mathInput = (await prompt.question("Enable math? [y/N]: ")).trim().toLowerCase();
  const primaryCategory = categories[0] || "uncategorized";
  const categoryDirectory = primaryCategory.replace(/[/\\]/g, "-");
  const sourceGroups = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d+\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const matchingGroups = sourceGroups.filter((group) =>
    fs.existsSync(path.join(contentRoot, group, categoryDirectory))
  );

  let sourceGroup = matchingGroups[0];
  if (!sourceGroup) {
    const fallbackGroup = sourceGroups.includes("99.Other") ? "99.Other" : sourceGroups.at(-1);
    const sourceGroupInput = (
      await prompt.question(
        `Source group (${sourceGroups.join(", ")}; ${fallbackGroup || "required"}): `
      )
    ).trim();
    sourceGroup = sourceGroupInput || fallbackGroup;
  }

  if (!sourceGroup || !/^\d+\.[^/\\]+$/u.test(sourceGroup)) {
    throw new Error("Source group must look like 01.DEV and cannot contain slashes.");
  }

  const directory = path.join(contentRoot, sourceGroup, categoryDirectory, slug);
  const filename = language === SITE.language ? "index.md" : `${language}.md`;
  const postPath = path.join(directory, filename);

  if (fs.existsSync(postPath)) {
    throw new Error(`Post already exists: ${postPath}`);
  }

  fs.mkdirSync(directory, { recursive: true });
  const body = `\nWrite your post here.\n`;
  const frontmatter = {
    title,
    slug,
    ...(language === SITE.language ? {} : { lang: language }),
    ...(language === SITE.language ? {} : { translationKey: slug }),
    publishedAt: todayInConfiguredTimeZone(),
    categories: categories.length === 1 ? categories[0] : categories,
    draft: true,
    math: ["y", "yes"].includes(mathInput)
  };

  fs.writeFileSync(postPath, matter.stringify(body, frontmatter));
  console.log(`\nCreated: ${path.relative(projectRoot, postPath)}`);
  console.log(`Images: place them beside ${path.relative(projectRoot, postPath)}`);
  console.log("Reference a local image as ./filename.png.");
  console.log("The post is a draft. Remove the draft line when ready to publish.");
} finally {
  prompt.close();
}
