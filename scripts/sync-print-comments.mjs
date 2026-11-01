import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { snapshotSchema } from "../src/lib/comments/snapshot.ts";
import { loadSiteConfig } from "../src/lib/config/index.ts";

const pageFields = "totalCount pageInfo { hasNextPage endCursor }";
const commentFields = "id author { login } createdAt url bodyHTML isMinimized deletedAt";
const discussionsQuery = `query PrintDiscussions($owner:String!,$name:String!,$categoryId:ID!,$after:String) {
  repository(owner:$owner,name:$name) {
    isPrivate
    discussions(categoryId:$categoryId,first:100,after:$after,orderBy:{field:CREATED_AT,direction:ASC}) {
      ${pageFields} nodes { id body url }
    }
  }
}`;
const commentsQuery = `query PrintComments($id:ID!,$after:String) {
  node(id:$id) { ... on Discussion {
    comments(first:100,after:$after) {
      ${pageFields} nodes { ${commentFields} replies { totalCount } }
    }
  } }
}`;
const repliesQuery = `query PrintReplies($id:ID!,$after:String) {
  node(id:$id) { ... on DiscussionComment {
    replies(first:100,after:$after) { ${pageFields} nodes { ${commentFields} } }
  } }
}`;

async function paginate(request, query, variables, select) {
  const nodes = [];
  const cursors = new Set();
  let after = null;
  while (true) {
    const connection = select(await request(query, { ...variables, after }));
    if (!connection?.nodes || !connection.pageInfo) throw new Error("Incomplete comments response");
    nodes.push(...connection.nodes);
    if (!connection.pageInfo.hasNextPage) {
      if (
        nodes.length !== connection.totalCount
        || new Set(nodes.map((node) => node?.id)).size !== nodes.length
      ) {
        throw new Error(
          "Comments changed during collection; retry instead of publishing a partial snapshot"
        );
      }
      return nodes;
    }
    after = connection.pageInfo.endCursor;
    if (!after || cursors.has(after)) throw new Error("Invalid comments pagination cursor");
    cursors.add(after);
  }
}

const visible = (comment) => comment && !comment.isMinimized && !comment.deletedAt;
const normalize = (comment) => ({
  id: comment.id,
  author: comment.author?.login ?? "ghost",
  createdAt: comment.createdAt,
  url: comment.url,
  bodyHTML: comment.bodyHTML
});

export async function collectPrintComments(giscus, request, fetchedAt = new Date().toISOString()) {
  const [owner, name] = giscus.repo.split("/");
  const discussions = await paginate(
    request,
    discussionsQuery,
    {
      owner,
      name,
      categoryId: giscus.categoryId
    },
    (data) => {
      if (data.repository?.isPrivate !== false)
        throw new Error("Only public repository comments may be printed");
      return data.repository.discussions;
    }
  );
  const result = [];
  const hashes = new Set();
  for (const discussion of discussions) {
    const hash = discussion.body.match(/<!--\s*sha1:\s*([a-f0-9]{40})\s*-->/u)?.[1];
    if (!hash) continue;
    if (hashes.has(hash)) throw new Error("Multiple discussions match the same post");
    hashes.add(hash);
    const comments = await paginate(
      request,
      commentsQuery,
      { id: discussion.id },
      (data) => data.node?.comments
    );
    const entries = [];
    for (const comment of comments) {
      const replies = comment.replies.totalCount
        ? await paginate(request, repliesQuery, { id: comment.id }, (data) => data.node?.replies)
        : [];
      const publicReplies = replies.filter(visible).map(normalize);
      if (visible(comment)) {
        entries.push({ ...normalize(comment), replies: publicReplies });
      } else if (publicReplies.length) {
        // A removed parent must not take its still-public replies out of the printout.
        entries.push({
          ...normalize(comment),
          author: "",
          bodyHTML: "",
          unavailable: true,
          replies: publicReplies
        });
      }
    }
    result.push({ hash, url: discussion.url, comments: entries });
  }
  return snapshotSchema.parse({
    version: 1,
    repo: giscus.repo,
    categoryId: giscus.categoryId,
    fetchedAt,
    discussions: result
  });
}

async function githubQuery(query, variables) {
  // gh uses the existing local login, or the step-scoped read-only GH_TOKEN in Actions.
  // No credentials are written to the snapshot, logs or browser bundle.
  const response = spawnSync("gh", ["api", "graphql", "--input", "-"], {
    input: JSON.stringify({ query, variables }),
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 32 * 1024 * 1024
  });
  if (response.error || response.status !== 0) {
    throw new Error(
      "GitHub comments query failed. Check gh authentication and discussions:read access."
    );
  }
  const body = JSON.parse(response.stdout);
  if (body.errors?.length || !body.data)
    throw new Error("GitHub returned an incomplete comments query");
  return body.data;
}

async function main() {
  const config = loadSiteConfig();
  const filename = path.resolve(".cache/print-comments.json");
  // Never retain a previous successful snapshot after a failed refresh.
  fs.rmSync(filename, { force: true });
  if (!config.features.comments || !config.integrations.giscus) return;
  const snapshot = await collectPrintComments(config.integrations.giscus, githubQuery);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(snapshot)}\n`);
  const count = snapshot.discussions.reduce(
    (total, discussion) =>
      total + discussion.comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0),
    0
  );
  console.log(
    `Collected ${count} public comments/replies in ${snapshot.discussions.length} discussions.`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
