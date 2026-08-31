import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { SITE, SUPPORTED_LANGUAGE_CODES } from "../src/config.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const immutableFrontmatterFields = [
  "slug",
  "publishedAt",
  "updatedAt",
  "tags",
  "categories",
  "draft",
  "math",
  "cover"
];

function languageFilename(language) {
  return language === SITE.language ? "index.md" : `${language}.md`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stable(value) {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stable(item)])
    );
  }
  return value;
}

function sameValue(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

function resolveSource(sourceArgument) {
  if (!sourceArgument) throw new Error("A source post path is required.");
  const sourcePath = path.resolve(projectRoot, sourceArgument);
  const relative = path.relative(projectRoot, sourcePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("The source post must be inside this repository.");
  }
  const contentRoot = path.join(projectRoot, "content/posts") + path.sep;
  if (!sourcePath.startsWith(contentRoot)) {
    throw new Error("The translation source must be under content/posts.");
  }
  if (!fs.existsSync(sourcePath)) throw new Error(`Source post not found: ${relative}`);
  const source = parsePost(sourcePath);
  const sourceLanguage = source.data.lang ?? SITE.language;
  if (!SUPPORTED_LANGUAGE_CODES.includes(sourceLanguage)) {
    throw new Error(`Unsupported source language: ${sourceLanguage}`);
  }
  const expectedFilename = languageFilename(sourceLanguage);
  if (path.basename(sourcePath) !== expectedFilename) {
    throw new Error(`Source filename must match lang (${expectedFilename}).`);
  }
  return { sourcePath, relative, source, sourceLanguage };
}

function parsePost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return { raw, ...matter(raw) };
}

function withoutFencedCode(markdown) {
  return markdown.replace(/^([`~]{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gmu, "");
}

function fencedCode(markdown) {
  return [...markdown.matchAll(/^([`~]{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gmu)].map((match) =>
    match[0].replace(/\r\n/gu, "\n")
  );
}

function inlineCode(markdown) {
  const prose = withoutFencedCode(markdown);
  return [...prose.matchAll(/(`+)([^`\n]*?)\1/gu)].map((match) => match[0]);
}

function mathExpressions(markdown) {
  const prose = withoutFencedCode(markdown);
  const blocks = [
    ...prose.matchAll(/\$\$[\s\S]*?\$\$/gu),
    ...prose.matchAll(/\\\[[\s\S]*?\\\]/gu),
    ...prose.matchAll(/\\\([\s\S]*?\\\)/gu)
  ].map((match) => match[0]);
  const withoutBlocks = blocks.reduce((text, block) => text.replace(block, ""), prose);
  const inline = [
    ...withoutBlocks.matchAll(/(?<!\\)\$(?!\s)(?:\\.|[^$\n])+?(?<!\s)(?<!\\)\$/gu)
  ].map((match) => match[0]);
  return [...blocks, ...inline];
}

function destinations(markdown) {
  const prose = withoutFencedCode(markdown);
  const markdownDestinations = [
    ...prose.matchAll(/!?\[[^\]]*\]\(\s*([^\s)]+)(?:\s+["'][^"']*["'])?\s*\)/gu)
  ]
    .map((match) => match[1])
    .filter((destination) => !destination.startsWith("#"));
  const htmlDestinations = [...prose.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/giu)]
    .map((match) => match[1])
    .filter((destination) => !destination.startsWith("#"));
  return [...markdownDestinations, ...htmlDestinations];
}

function headingLevels(markdown) {
  return withoutFencedCode(markdown)
    .split(/\r?\n/u)
    .flatMap((line) => {
      const match = line.match(/^(#{1,6})\s+/u);
      return match ? [match[1].length] : [];
    });
}

function structuralErrors(source, target, targetLanguage) {
  const errors = [];
  const comparisons = [
    ["fenced code blocks", fencedCode(source.content), fencedCode(target.content)],
    ["inline code", inlineCode(source.content), inlineCode(target.content)],
    ["math expressions", mathExpressions(source.content), mathExpressions(target.content)],
    ["link and image destinations", destinations(source.content), destinations(target.content)],
    ["heading levels", headingLevels(source.content), headingLevels(target.content)]
  ];

  for (const [label, sourceValue, targetValue] of comparisons) {
    if (!sameValue(sourceValue, targetValue)) {
      errors.push(`${targetLanguage}: ${label} differ from the source`);
    }
  }
  return errors;
}

export function snapshot(sourceArgument) {
  const { relative, source, sourceLanguage } = resolveSource(sourceArgument);
  return {
    source: relative,
    sourceHash: sha256(source.raw),
    sourceLanguage,
    targetLanguages: SUPPORTED_LANGUAGE_CODES.filter((language) => language !== sourceLanguage)
  };
}

export function verify(sourceArgument, expectedHash) {
  if (!expectedHash) throw new Error("--source-hash is required for verification.");
  const { sourcePath, relative, source, sourceLanguage } = resolveSource(sourceArgument);
  const actualHash = sha256(source.raw);
  const errors = [];
  if (actualHash !== expectedHash) errors.push(`${relative}: source changed after the snapshot`);

  const targetLanguages = SUPPORTED_LANGUAGE_CODES.filter(
    (language) => language !== sourceLanguage
  );
  const translationKey = source.data.translationKey ?? source.data.slug;

  for (const language of targetLanguages) {
    const targetPath = path.join(path.dirname(sourcePath), languageFilename(language));
    const targetRelative = path.relative(projectRoot, targetPath);
    if (!fs.existsSync(targetPath)) {
      errors.push(`${targetRelative}: translation file is missing`);
      continue;
    }

    let target;
    try {
      target = parsePost(targetPath);
    } catch (error) {
      errors.push(`${targetRelative}: cannot parse translation (${error.message})`);
      continue;
    }

    if (target.data.lang !== language) {
      errors.push(`${targetRelative}: lang must be ${language}`);
    }
    if (target.data.slug !== source.data.slug) {
      errors.push(`${targetRelative}: slug must match the source`);
    }
    if (target.data.translationKey !== translationKey) {
      errors.push(`${targetRelative}: translationKey must be ${translationKey}`);
    }
    if (typeof target.data.title !== "string" || !target.data.title.trim()) {
      errors.push(`${targetRelative}: translated title is required`);
    }
    if (!target.content.trim()) errors.push(`${targetRelative}: translated body is empty`);

    for (const field of immutableFrontmatterFields) {
      if (!sameValue(source.data[field], target.data[field])) {
        errors.push(`${targetRelative}: ${field} must match the source`);
      }
    }
    errors.push(
      ...structuralErrors(source, target, language).map(
        (message) => `${targetRelative}: ${message}`
      )
    );
  }

  return {
    source: relative,
    sourceHash: actualHash,
    sourceLanguage,
    targetLanguages,
    errors
  };
}

function parseCliArguments(arguments_) {
  const [command, sourceArgument, ...rest] = arguments_;
  const hashIndex = rest.indexOf("--source-hash");
  return {
    command,
    sourceArgument,
    sourceHash: hashIndex >= 0 ? rest[hashIndex + 1] : undefined
  };
}

async function main() {
  const { command, sourceArgument, sourceHash } = parseCliArguments(process.argv.slice(2));
  let result;
  if (command === "snapshot") result = snapshot(sourceArgument);
  else if (command === "verify") result = verify(sourceArgument, sourceHash);
  else
    throw new Error(
      "Usage: translation-safety.mjs <snapshot|verify> path/to/source.md [--source-hash HASH]"
    );

  console.log(JSON.stringify(result, null, 2));
  if (result.errors?.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
