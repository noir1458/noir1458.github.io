import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import matter from "gray-matter";

const projectRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(projectRoot, "src/content/posts");
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
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function todayInSeoul() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul"
  }).format(new Date());
}

try {
  const title = (await prompt.question("Title: ")).trim();
  if (!title) throw new Error("Title is required.");

  const suggestedSlug = slugify(title);
  const slugInput = (
    await prompt.question(`Slug (${suggestedSlug || "required"}): `)
  ).trim();
  const slug = slugInput || suggestedSlug;
  if (!slug || /[/\\?#\s]/u.test(slug)) {
    throw new Error("Slug cannot contain spaces, slashes, ?, or #.");
  }

  const categories = splitTerms(
    await prompt.question("Categories (comma separated): ")
  );
  const mathInput = (
    await prompt.question("Enable math? [y/N]: ")
  ).trim().toLowerCase();
  const primaryCategory = categories[0] || "uncategorized";
  const categoryDirectory = primaryCategory.replace(/[/\\]/g, "-");
  const directory = path.join(contentRoot, categoryDirectory, slug);
  const postPath = path.join(directory, "index.md");

  if (fs.existsSync(postPath)) {
    throw new Error(`Post already exists: ${postPath}`);
  }

  fs.mkdirSync(directory, { recursive: true });
  const body = `\nWrite your post here.\n`;
  const frontmatter = {
    title,
    slug,
    publishedAt: todayInSeoul(),
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
