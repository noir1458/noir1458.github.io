import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { FEATURES, NAVIGATION, PROFILE, SITE, SOCIAL } from "../src/config.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const distRoot = path.join(projectRoot, "dist");
const contentRoot = path.join(projectRoot, "content/posts");
const siteOrigin = SITE.url;
const defaultLanguage = SITE.language;

function walk(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath, predicate);
    return predicate(fullPath) ? [fullPath] : [];
  });
}

function resolvesPublicPath(urlPath) {
  const clean = decodeURI(urlPath.split(/[?#]/)[0]);
  const candidate = path.join(distRoot, clean.replace(/^\//, ""));
  return (
    fs.existsSync(candidate)
    || fs.existsSync(`${candidate}.html`)
    || fs.existsSync(path.join(candidate, "index.html"))
  );
}

function postPath(entry) {
  const prefix = entry.lang === defaultLanguage ? "" : `/${entry.lang}`;
  return `${prefix}/posts/${entry.slug}/`;
}

function outputFileForPath(urlPath) {
  return path.join(distRoot, urlPath.replace(/^\//, ""), "index.html");
}

function tagAttribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']+)["']`, "i"))?.[1];
}

function findTag(html, tagName, attribute, value) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))]
    .map((match) => match[0])
    .find((tag) => tagAttribute(tag, attribute) === value);
}

function escapeXml(value) {
  return value.replace(/[&<>"']/gu, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&apos;"
  })[character] ?? character);
}

if (!fs.existsSync(distRoot)) {
  throw new Error("dist does not exist. Run npm run build first.");
}

const htmlFiles = walk(distRoot, (file) => file.endsWith(".html"));
const errors = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/\shref=["']([^"']+)["']/g)) {
    const href = match[1];
    if (
      !href.startsWith("/")
      || href.startsWith("//")
      || href.startsWith("/_pagefind/")
      || checked.has(href)
    ) {
      continue;
    }
    checked.add(href);
    if (!resolvesPublicPath(href)) {
      errors.push(`${path.relative(distRoot, file)}: broken internal link ${href}`);
    }
  }
}

const required = [
  "index.html",
  "404.html",
  "robots.txt",
  "manifest.webmanifest",
  "tags/index.html",
  "categories/index.html",
  "archives/index.html",
  "pagefind/pagefind.js",
  ...(FEATURES.rss ? ["rss.xml"] : []),
  ...(FEATURES.sitemap ? ["sitemap-index.xml"] : []),
  ...(FEATURES.search ? ["search/index.html"] : []),
  ...(FEATURES.projects ? ["projects/index.html"] : [])
];
for (const target of required) {
  if (!fs.existsSync(path.join(distRoot, target))) {
    errors.push(`missing required build artifact: ${target}`);
  }
}

const indexHtml = fs.readFileSync(path.join(distRoot, "index.html"), "utf8");
const visibleNavigationLinks = [
  ...NAVIGATION.header,
  ...NAVIGATION.sidebar,
  ...NAVIGATION.footer
].filter((link) => !link.requiresFeature || FEATURES[link.requiresFeature]);

for (const link of visibleNavigationLinks) {
  if (!indexHtml.includes(`href="${link.href}"`)) {
    errors.push(`index.html: configured navigation link is missing: ${link.href}`);
  }
}

if (!indexHtml.includes(`rel="icon" href="${SITE.favicon}"`)) {
  errors.push(`index.html: configured favicon is missing: ${SITE.favicon}`);
}

if (indexHtml.includes("data-search-shell") !== FEATURES.search) {
  errors.push(`index.html: search UI does not match features.search=${FEATURES.search}`);
}

if (indexHtml.includes("data-theme-picker") !== FEATURES.darkMode) {
  errors.push(`index.html: theme UI does not match features.darkMode=${FEATURES.darkMode}`);
}

if (indexHtml.includes('type="application/rss+xml"') !== FEATURES.rss) {
  errors.push(`index.html: RSS metadata does not match features.rss=${FEATURES.rss}`);
}

if (
  !FEATURES.projects
  && fs.existsSync(path.join(distRoot, "projects/index.html"))
) {
  errors.push("projects/index.html: generated while features.projects is disabled");
}

if (
  SITE.googleVerification
  && !indexHtml.includes(`content="${SITE.googleVerification}"`)
) {
  errors.push("index.html: configured Google site verification is missing");
}

const robots = fs.readFileSync(path.join(distRoot, "robots.txt"), "utf8");
const sitemapUrl = new URL("/sitemap-index.xml", SITE.url).toString();
if (FEATURES.sitemap && !robots.includes(`Sitemap: ${sitemapUrl}`)) {
  errors.push(`robots.txt: configured sitemap URL is missing: ${sitemapUrl}`);
}
if (!FEATURES.sitemap && robots.includes("Sitemap:")) {
  errors.push("robots.txt: sitemap is present while features.sitemap is disabled");
}

if (FEATURES.rss) {
  const rssFeed = fs.readFileSync(path.join(distRoot, "rss.xml"), "utf8");
  if (!rssFeed.includes(`<dc:creator>${escapeXml(SITE.author.name)}</dc:creator>`)) {
    errors.push("rss.xml: configured author is missing");
  }
}

const aboutHtml = fs.readFileSync(path.join(distRoot, "about/index.html"), "utf8");
if (!aboutHtml.includes(`>${SITE.author.displayName}</h1>`)) {
  errors.push("about/index.html: configured author display name is missing");
}
if (!PROFILE.body || !aboutHtml.includes('class="profile-copy"')) {
  errors.push("about/index.html: configured profile Markdown is missing");
}
for (const href of Object.values(SOCIAL).filter(Boolean)) {
  const renderedHref = href === SOCIAL.email ? `mailto:${href}` : href;
  if (!aboutHtml.includes(`href="${renderedHref}"`)) {
    errors.push(`about/index.html: configured social link is missing: ${renderedHref}`);
  }
}

let manifest;
try {
  manifest = JSON.parse(
    fs.readFileSync(path.join(distRoot, "manifest.webmanifest"), "utf8")
  );
} catch (error) {
  errors.push(`manifest.webmanifest: invalid JSON (${error.message})`);
}
if (manifest) {
  if (manifest.name !== SITE.title) {
    errors.push(`manifest.webmanifest: expected name ${SITE.title}`);
  }
  if (manifest.short_name !== SITE.author.displayName) {
    errors.push(`manifest.webmanifest: expected short_name ${SITE.author.displayName}`);
  }
  if (manifest.icons?.[0]?.src !== SITE.manifestIcon) {
    errors.push(`manifest.webmanifest: expected icon ${SITE.manifestIcon}`);
  }
}

const contentEntries = walk(contentRoot, (file) => file.endsWith(".md"))
  .map((file) => {
    const data = matter(fs.readFileSync(file, "utf8")).data;
    return {
      file,
      filename: path.basename(file),
      slug: data.slug,
      lang: data.lang ?? defaultLanguage,
      translationKey: data.translationKey ?? data.slug,
      draft: data.draft === true
    };
  })
  .filter((entry) => !entry.draft);

const groups = new Map();
for (const entry of contentEntries) {
  const group = groups.get(entry.translationKey) ?? [];
  group.push(entry);
  groups.set(entry.translationKey, group);
}

if (FEATURES.sitemap) {
  const sitemap = walk(distRoot, (file) => /^sitemap-.*\.xml$/u.test(path.basename(file)))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  for (const entry of contentEntries) {
    const expectedLocation = `<loc>${siteOrigin}${postPath(entry)}</loc>`;
    if (!sitemap.includes(expectedLocation)) {
      errors.push(`sitemap is missing post URL: ${postPath(entry)}`);
    }
  }
}

let postDescriptions = 0;
let multilingualPostPages = 0;
for (const entry of contentEntries) {
  const urlPath = postPath(entry);
  const outputFile = outputFileForPath(urlPath);
  if (!fs.existsSync(outputFile)) {
    errors.push(`missing generated post page: ${urlPath}`);
    continue;
  }

  const html = fs.readFileSync(outputFile, "utf8");
  const relativeOutput = path.relative(distRoot, outputFile);
  const htmlLanguage = html.match(/<html\b[^>]*\slang=["']([^"']+)["']/i)?.[1];
  if (htmlLanguage !== entry.lang) {
    errors.push(`${relativeOutput}: expected html lang ${entry.lang}, found ${htmlLanguage ?? "none"}`);
  }

  const canonicalTag = findTag(html, "link", "rel", "canonical");
  const canonical = canonicalTag ? tagAttribute(canonicalTag, "href") : undefined;
  const expectedCanonical = `${siteOrigin}${urlPath}`;
  if (canonical !== expectedCanonical) {
    errors.push(`${relativeOutput}: expected canonical ${expectedCanonical}, found ${canonical ?? "none"}`);
  }

  const description = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
  )?.[1]?.trim();
  if (!description) {
    errors.push(`${relativeOutput}: missing generated meta description`);
  } else {
    postDescriptions += 1;
  }

  const ogImageTag = findTag(html, "meta", "property", "og:image");
  const twitterImageTag = findTag(html, "meta", "name", "twitter:image");
  if (!ogImageTag || !tagAttribute(ogImageTag, "content")) {
    errors.push(`${relativeOutput}: missing Open Graph image`);
  }
  if (!twitterImageTag || !tagAttribute(twitterImageTag, "content")) {
    errors.push(`${relativeOutput}: missing Twitter image`);
  }

  const group = groups.get(entry.translationKey) ?? [];
  if (group.length > 1) {
    multilingualPostPages += 1;
    for (const translation of group) {
      const alternateTag = [...html.matchAll(/<link\b[^>]*>/gi)]
        .map((match) => match[0])
        .find((tag) => (
          tagAttribute(tag, "rel") === "alternate"
          && tagAttribute(tag, "hreflang") === translation.lang
        ));
      const expectedHref = `${siteOrigin}${postPath(translation)}`;
      if (!alternateTag || tagAttribute(alternateTag, "href") !== expectedHref) {
        errors.push(`${relativeOutput}: missing reciprocal hreflang ${translation.lang}`);
      }
    }
    const xDefaultTag = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map((match) => match[0])
      .find((tag) => (
        tagAttribute(tag, "rel") === "alternate"
        && tagAttribute(tag, "hreflang") === "x-default"
      ));
    if (!xDefaultTag) {
      errors.push(`${relativeOutput}: missing hreflang x-default`);
    }
    if (!html.includes('class="language-menu"')) {
      errors.push(`${relativeOutput}: missing article language selector`);
    }
  }
}

const generatedPostPages = walk(distRoot, (file) => (
  file.endsWith("/index.html") && /(?:^|\/)posts\//u.test(path.relative(distRoot, file))
));
if (generatedPostPages.length !== contentEntries.length) {
  errors.push(
    `expected ${contentEntries.length} post pages, found ${generatedPostPages.length}`
  );
}

console.log(
  JSON.stringify(
    {
      htmlFiles: htmlFiles.length,
      expectedPostPages: contentEntries.length,
      postPages: generatedPostPages.length,
      multilingualPostPages,
      postDescriptions,
      checkedInternalLinks: checked.size,
      errors
    },
    null,
    2
  )
);

if (errors.length) process.exitCode = 1;
