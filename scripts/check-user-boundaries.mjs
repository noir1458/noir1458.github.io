import fs from "node:fs";
import path from "node:path";
import { loadSiteConfig } from "../src/lib/config/index.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const config = loadSiteConfig();
const implementationTargets = [
  "astro.config.mjs",
  "src",
  "public/sw.js",
  ".github/workflows"
];
const textExtensions = new Set([
  ".astro",
  ".css",
  ".js",
  ".mjs",
  ".ts",
  ".yaml",
  ".yml"
]);

function walk(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];

  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(target, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const userValues = new Set([
  config.site.title,
  config.site.url,
  config.author.name,
  config.author.displayName,
  ...Object.values(config.social),
  config.integrations.analyticsId,
  config.integrations.googleSiteVerification,
  config.integrations.giscus?.repo,
  config.integrations.giscus?.repoId,
  config.integrations.giscus?.category,
  config.integrations.giscus?.categoryId
].filter((value) => typeof value === "string" && value.length >= 5));

const violations = [];
const files = implementationTargets
  .flatMap((target) => walk(path.join(projectRoot, target)))
  .filter((file) => textExtensions.has(path.extname(file)));

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const value of userValues) {
    if (source.includes(value)) {
      violations.push({
        file: path.relative(projectRoot, file),
        value
      });
    }
  }
}

console.log(JSON.stringify({
  scannedImplementationFiles: files.length,
  checkedUserValues: userValues.size,
  violations
}, null, 2));

if (violations.length > 0) process.exitCode = 1;
