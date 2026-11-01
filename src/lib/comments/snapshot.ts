import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const commentSchema = z.object({
  id: z.string(),
  author: z.string(),
  createdAt: z.iso.datetime(),
  url: z.url().startsWith("https://github.com/"),
  bodyHTML: z.string(),
  unavailable: z.boolean().default(false)
});

export const snapshotSchema = z.object({
  version: z.literal(1),
  repo: z.string(),
  categoryId: z.string(),
  fetchedAt: z.iso.datetime(),
  discussions: z.array(
    z.object({
      hash: z.string().regex(/^[a-f0-9]{40}$/u),
      url: z.url().startsWith("https://github.com/"),
      comments: z.array(commentSchema.extend({ replies: z.array(commentSchema) }))
    })
  )
});

export type CommentSnapshot = z.infer<typeof snapshotSchema>;
export type PrintComment = z.infer<typeof commentSchema>;

export function giscusPathHash(pathname: string) {
  // Match giscus/client's pathname mapping, including trailing slashes.
  const term = pathname.length < 2 ? "index" : pathname.substring(1).replace(/\.\w+$/u, "");
  return createHash("sha1").update(term).digest("hex");
}

export function readCommentSnapshot() {
  const filename =
    process.env.ASTRO_BLOG_PRINT_COMMENTS_FILE ?? path.resolve(".cache/print-comments.json");
  if (!fs.existsSync(filename)) return null;
  return snapshotSchema.parse(JSON.parse(fs.readFileSync(filename, "utf8")));
}
