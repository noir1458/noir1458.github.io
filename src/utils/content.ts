import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { SITE } from "@/config";

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
    .replace(/\/index\.md$/i, "");
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

export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
}

export function postUrl(post: PostEntry): string {
  return `/posts/${post.data.slug}/`;
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(SITE.locale, {
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
