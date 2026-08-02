import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import {
  LANGUAGES,
  SITE,
  SUPPORTED_LANGUAGE_CODES,
  type SupportedLanguage
} from "@/config";

export type PostEntry = CollectionEntry<"posts">;

const localPostImages = import.meta.glob<ImageMetadata>(
  "/src/content/posts/**/*.{avif,gif,jpeg,jpg,png,webp}",
  { eager: true, import: "default" }
);

export function postCover(post: PostEntry): ImageMetadata | undefined {
  if (post.data.cover) return post.data.cover;

  const localReference =
    post.body?.match(
      /!\[[^\]]*\]\((\.\/[^)\s]+\.(?:avif|gif|jpe?g|png|webp))(?:\s+["'][^"']*["'])?\)/i
    )?.[1] ??
    post.body?.match(
      /<img[^>]+src=["'](\.\/[^"']+\.(?:avif|gif|jpe?g|png|webp))["']/i
    )?.[1];

  if (!localReference || !post.filePath) return undefined;

  const postDirectory = post.filePath
    .replaceAll("\\", "/")
    .replace(/\/[^/]+\.md$/i, "");
  const imagePath = `/${postDirectory}/${localReference.replace(/^\.\//, "")}`;

  return localPostImages[imagePath];
}

const DESCRIPTION_LIMIT = 180;

function truncateDescription(value: string): string {
  const characters = Array.from(value.trim());
  if (characters.length <= DESCRIPTION_LIMIT) return characters.join("");
  return `${characters.slice(0, DESCRIPTION_LIMIT - 1).join("").trimEnd()}…`;
}

function markdownParagraphs(body: string): string[] {
  const withoutCode = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\[[^\]]+\]:\s+\S+.*$/gm, "");

  return withoutCode.split(/\n\s*\n/u).map((block) =>
    block
      .split("\n")
      .filter((line) => !/^\s*(?:#{1,6}\s+|[-*_]{3,}\s*$|\|?(?:\s*:?-+:?\s*\|)+)/u.test(line))
      .join(" ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/^\s*(?:>\s*|[-+*]\s+|\d+[.)]\s+)/u, "")
      .replace(/[`*_~]/g, "")
      .replace(/\\([\\`*_[\]{}()#+.!-])/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
  ).filter(Boolean);
}

export function postDescription(post: PostEntry): string {
  const explicitDescription = post.data.description?.trim();
  if (explicitDescription) return explicitDescription;

  const firstParagraph = markdownParagraphs(post.body ?? "")
    .find((paragraph) => paragraph.length >= 12);

  return truncateDescription(firstParagraph ?? post.data.title);
}

export async function getAllPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
}

export async function getPublishedPosts(
  language: SupportedLanguage = SITE.language
): Promise<PostEntry[]> {
  return (await getAllPublishedPosts()).filter((post) => post.data.lang === language);
}

export function postUrl(post: PostEntry): string {
  const prefix = LANGUAGES[post.data.lang].pathPrefix;
  return `${prefix}/posts/${post.data.slug}/`;
}

export function postTranslationKey(post: PostEntry): string {
  return post.data.translationKey ?? post.data.slug;
}

export interface PostTranslation {
  lang: SupportedLanguage;
  label: string;
  href: string;
  post: PostEntry;
}

export function getPostTranslations(
  post: PostEntry,
  posts: PostEntry[]
): PostTranslation[] {
  const key = postTranslationKey(post);
  const order = new Map(SUPPORTED_LANGUAGE_CODES.map((lang, index) => [lang, index]));

  return posts
    .filter((entry) => postTranslationKey(entry) === key)
    .map((entry) => ({
      lang: entry.data.lang,
      label: LANGUAGES[entry.data.lang].label,
      href: postUrl(entry),
      post: entry
    }))
    .sort((a, b) => (order.get(a.lang) ?? 99) - (order.get(b.lang) ?? 99));
}

export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
  language: SupportedLanguage = SITE.language
): string {
  return new Intl.DateTimeFormat(LANGUAGES[language].locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: SITE.timeZone,
    ...options
  }).format(date);
}

export function slugifyTerm(term: string): string {
  const slug = term
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled";
}

export function countTerms(
  posts: PostEntry[],
  field: "tags" | "categories"
): Array<{ name: string; slug: string; count: number }> {
  const counts = new Map<string, { name: string; count: number }>();

  for (const post of posts) {
    const seenInPost = new Set<string>();
    for (const term of post.data[field]) {
      const slug = slugifyTerm(term);
      if (seenInPost.has(slug)) continue;
      seenInPost.add(slug);
      const current = counts.get(slug);
      counts.set(slug, {
        name: current?.name ?? term,
        count: (current?.count ?? 0) + 1
      });
    }
  }

  return [...counts]
    .map(([slug, value]) => ({ slug, ...value }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, SITE.locale));
}

export interface CategorySourceGroup {
  sourceFolder: string;
  categories: Array<{ name: string; slug: string; count: number }>;
}

const sourceFolderCollator = new Intl.Collator(SITE.locale, {
  numeric: true,
  sensitivity: "base"
});

function postSourceFolders(post: PostEntry) {
  const sourcePath = (post.filePath ?? post.id).replaceAll("\\", "/");
  const parts = sourcePath.split("/").filter(Boolean);
  const postsIndex = parts.lastIndexOf("posts");

  if (postsIndex < 0 || parts.length < postsIndex + 4) return undefined;

  return {
    groupFolder: parts[postsIndex + 1],
    categoryFolder: parts[postsIndex + 2]
  };
}

/**
 * Groups visible categories by the first two source folders below `posts/`.
 *
 * Example: `posts/01.DEV/BOJ/some-post/index.md` becomes group `01.DEV`
 * and category `BOJ`. Only categories backed by published posts are returned.
 */
export function groupCategoriesBySource(posts: PostEntry[]): CategorySourceGroup[] {
  const categoryCounts = new Map<
    string,
    {
      name: string;
      count: number;
      groupFolder: string;
      categoryFolder: string;
    }
  >();

  for (const post of posts) {
    const source = postSourceFolders(post);
    const seenInPost = new Set<string>();

    for (const category of post.data.categories) {
      const slug = slugifyTerm(category);
      if (seenInPost.has(slug)) continue;
      seenInPost.add(slug);

      const current = categoryCounts.get(slug);
      categoryCounts.set(slug, {
        name: current?.name ?? category,
        count: (current?.count ?? 0) + 1,
        groupFolder: current?.groupFolder ?? source?.groupFolder ?? "99.Other",
        categoryFolder: current?.categoryFolder ?? source?.categoryFolder ?? category
      });
    }
  }

  const groups = new Map<string, CategorySourceGroup["categories"]>();

  for (const [slug, category] of categoryCounts) {
    const group = groups.get(category.groupFolder) ?? [];
    group.push({ name: category.name, slug, count: category.count });
    groups.set(category.groupFolder, group);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => sourceFolderCollator.compare(a, b))
    .map(([sourceFolder, categories]) => ({
      sourceFolder,
      categories: categories.sort((a, b) => {
        const aFolder = categoryCounts.get(a.slug)?.categoryFolder ?? a.name;
        const bFolder = categoryCounts.get(b.slug)?.categoryFolder ?? b.name;
        return sourceFolderCollator.compare(aFolder, bFolder);
      })
    }));
}

export function groupPostsByYear(posts: PostEntry[]) {
  const groups = new Map<number, PostEntry[]>();

  for (const post of posts) {
    const year = Number(
      new Intl.DateTimeFormat("en", {
        year: "numeric",
        timeZone: SITE.timeZone
      }).format(post.data.publishedAt)
    );
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }

  return [...groups.entries()].sort(([a], [b]) => b - a);
}

export function paginatePosts(posts: PostEntry[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / SITE.postsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * SITE.postsPerPage;

  return {
    posts: posts.slice(start, start + SITE.postsPerPage),
    currentPage: safePage,
    totalPages
  };
}

export function postsWithTerm(
  posts: PostEntry[],
  field: "tags" | "categories",
  termSlug: string
) {
  return posts.filter((post) =>
    post.data[field].some((term) => slugifyTerm(term) === termSlug)
  );
}

export function termNameFromSlug(
  posts: PostEntry[],
  field: "tags" | "categories",
  termSlug: string
) {
  return posts
    .flatMap((post) => post.data[field])
    .find((term) => slugifyTerm(term) === termSlug);
}
