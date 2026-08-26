import assert from "node:assert/strict";
import test from "node:test";
import { projectFrontmatterSchema } from "../src/lib/content/projectSchema.ts";

const validProject = {
  title: "Example Project",
  description: "A concise project description.",
  repository: "https://github.com/example/project",
  demo: "https://example.com/project",
  image: "./example.webp",
  tags: ["Astro", "TypeScript"],
  featured: true,
  order: 1
};

test("a valid project is normalized", () => {
  const result = projectFrontmatterSchema.parse(validProject);
  assert.equal(result.draft, false);
  assert.deepEqual(result.tags, ["Astro", "TypeScript"]);
});

test("a project title is required", () => {
  const result = projectFrontmatterSchema.safeParse({
    ...validProject,
    title: ""
  });
  assert.equal(result.success, false);
  assert.match(result.error?.issues[0]?.path.join(".") ?? "", /title/u);
});

test("repository and demo must use HTTP URLs", () => {
  for (const field of ["repository", "demo"]) {
    const result = projectFrontmatterSchema.safeParse({
      ...validProject,
      [field]: "ftp://example.com/project"
    });
    assert.equal(result.success, false);
    assert.match(result.error?.issues[0]?.path.join(".") ?? "", new RegExp(field, "u"));
  }
});

test("project images must use local relative paths", () => {
  const result = projectFrontmatterSchema.safeParse({
    ...validProject,
    image: "/images/projects/example.webp"
  });
  assert.equal(result.success, false);
  assert.match(result.error?.issues[0]?.path.join(".") ?? "", /image/u);
});
