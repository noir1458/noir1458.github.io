import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";

const projectRoot = path.resolve(import.meta.dirname, "..");
const workflowPath = path.join(projectRoot, ".github/workflows/deploy.yml");
const source = fs.readFileSync(workflowPath, "utf8");
const document = parseDocument(source, {
  prettyErrors: true,
  uniqueKeys: true
});

if (document.errors.length > 0) {
  throw new Error(document.errors.map((error) => error.message).join("\n"));
}

const workflow = document.toJS({ maxAliasCount: 20 });
const errors = [];

function expect(condition, message) {
  if (!condition) errors.push(message);
}

expect(workflow?.on?.push?.branches?.includes("main"), "push must validate main");
expect(workflow?.on?.pull_request !== undefined, "pull requests must be validated");
expect(workflow?.on?.workflow_dispatch !== undefined, "manual deployment must be available");
expect(
  workflow?.permissions?.contents === "read",
  "workflow contents permission must be read-only"
);
expect(
  Object.keys(workflow?.permissions ?? {}).length === 1,
  "write permissions must not be global"
);

const build = workflow?.jobs?.build;
const deploy = workflow?.jobs?.deploy;
expect(build?.permissions?.contents === "read", "build must use contents: read");
expect(build?.permissions?.pages === "read", "build must use pages: read");
expect(
  build?.steps?.some((step) => step.run === "npm run check"),
  "build must run the complete local validation"
);
expect(
  build?.steps?.some(
    (step) => step.run === "npx playwright install --with-deps --only-shell chromium"
  ),
  "build must install the Chromium headless shell for Mermaid rendering"
);
expect(deploy?.needs === "build", "deploy must depend on build");
expect(deploy?.permissions?.pages === "write", "deploy requires pages: write");
expect(deploy?.permissions?.["id-token"] === "write", "deploy requires id-token: write");
expect(
  String(deploy?.if).includes("github.event_name != 'pull_request'"),
  "deploy must be disabled for pull requests"
);

const actionReferences = Object.values(workflow?.jobs ?? {})
  .flatMap((job) => job.steps ?? [])
  .map((step) => step.uses)
  .filter(Boolean);
for (const reference of actionReferences) {
  expect(
    /@[0-9a-f]{40}$/u.test(reference),
    `action must be pinned to a full commit SHA: ${reference}`
  );
}

console.log(
  JSON.stringify(
    {
      workflow: path.relative(projectRoot, workflowPath),
      triggers: Object.keys(workflow?.on ?? {}),
      pinnedActions: actionReferences.length,
      errors
    },
    null,
    2
  )
);

if (errors.length > 0) process.exitCode = 1;
