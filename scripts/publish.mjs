import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["run", "check"], {
  stdio: "inherit",
  shell: process.platform === "win32"
});

if (result.status !== 0) {
  console.error("\nPublish stopped because validation failed.");
  process.exit(result.status ?? 1);
}

console.log(`
Validation passed.

Review and publish explicitly:
  git status
  git diff --check
  git add -A
  git commit -m "content: publish <post-slug>"
  git push origin main

GitHub Actions will build and deploy the validated source.
`);
