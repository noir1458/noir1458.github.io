import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadSiteConfig, SiteConfigError } from "../src/lib/config/index.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceConfigDirectory = path.join(projectRoot, "config");
const temporaryDirectories = [];

function configFixture() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "astro-blog-config-"));
  fs.cpSync(sourceConfigDirectory, directory, { recursive: true });
  temporaryDirectories.push(directory);
  return directory;
}

function replaceInFile(directory, filename, from, to) {
  const filePath = path.join(directory, filename);
  const source = fs.readFileSync(filePath, "utf8");
  const containsPattern = typeof from === "string" ? source.includes(from) : from.test(source);
  assert.ok(containsPattern, `${filename} fixture did not contain ${from}`);
  fs.writeFileSync(filePath, source.replace(from, to));
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
test("the repository configuration is valid", () => {
  const config = loadSiteConfig();
  assert.match(config.site.url, /^https:\/\//u);
  assert.deepEqual(config.supportedLanguageCodes, ["ko", "en", "ja"]);
  assert.equal(config.social.x, undefined);
  assert.equal(config.social.facebook, undefined);
  assert.equal(config.social.email, undefined);
  assert.equal("resume" in config.social, false);
  assert.equal(config.appearance.accentHue, 250);
});

test("an invalid site URL reports its file and field", () => {
  const directory = configFixture();
  const sitePath = path.join(directory, "site.yaml");
  const source = fs.readFileSync(sitePath, "utf8");
  fs.writeFileSync(sitePath, source.replace(/^ {2}url: .*$/mu, "  url: not-a-url"));

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError && /config\/site\.yaml: site\.url:/u.test(error.message)
  );
});

test("a configured accent hue is valid", () => {
  const directory = configFixture();
  replaceInFile(directory, "site.yaml", /^ {2}accentHue: .*$/mu, "  accentHue: 248");

  assert.deepEqual(loadSiteConfig({ configDirectory: directory }).appearance, { accentHue: 248 });
});

test("accent hue accepts both range boundaries", () => {
  for (const hue of [0, 360]) {
    const directory = configFixture();
    replaceInFile(directory, "site.yaml", /^ {2}accentHue: .*$/mu, `  accentHue: ${hue}`);
    assert.equal(loadSiteConfig({ configDirectory: directory }).appearance.accentHue, hue);
  }
});

test("accent hue rejects values outside its range", () => {
  for (const hue of [-1, 361]) {
    const directory = configFixture();
    replaceInFile(directory, "site.yaml", /^ {2}accentHue: .*$/mu, `  accentHue: ${hue}`);
    assert.throws(
      () => loadSiteConfig({ configDirectory: directory }),
      (error) =>
        error instanceof SiteConfigError
        && /config\/site\.yaml: appearance\.accentHue:/u.test(error.message)
    );
  }
});

test("accent hue rejects fractional values", () => {
  const directory = configFixture();
  replaceInFile(directory, "site.yaml", /^ {2}accentHue: .*$/mu, "  accentHue: 248.5");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError
      && /config\/site\.yaml: appearance\.accentHue:/u.test(error.message)
  );
});

test("a missing appearance section uses the default hue", () => {
  const directory = configFixture();
  replaceInFile(directory, "site.yaml", /\nappearance:\n {2}accentHue: [^\n]+\n/u, "");

  assert.deepEqual(loadSiteConfig({ configDirectory: directory }).appearance, { accentHue: 250 });
});

test("removed accent presets are rejected", () => {
  const directory = configFixture();
  replaceInFile(directory, "site.yaml", /^ {2}accentHue: .*$/mu, "  accent: purple");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError && /config\/site\.yaml: appearance:/u.test(error.message)
  );
});

test("a navigation item without href reports its exact field", () => {
  const directory = configFixture();
  fs.writeFileSync(
    path.join(directory, "navigation.yaml"),
    "header:\n  - label: Home\nsidebar: []\nfooter: []\n"
  );

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError
      && /config\/navigation\.yaml: header\.0\.href:/u.test(error.message)
  );
});

test("duplicate language path prefixes are rejected", () => {
  const directory = configFixture();
  replaceInFile(directory, "site.yaml", "pathPrefix: /ja", "pathPrefix: /en");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError
      && /languages\.ja\.pathPrefix: duplicates languages\.en\.pathPrefix/u.test(error.message)
  );
});

test("broken YAML reports the configuration filename", () => {
  const directory = configFixture();
  fs.writeFileSync(path.join(directory, "features.yaml"), "search: [true\n");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) => error instanceof SiteConfigError && /config\/features\.yaml:/u.test(error.message)
  );
});

test("an empty profile body reports the configuration file", () => {
  const directory = configFixture();
  fs.writeFileSync(path.join(directory, "profile.md"), "---\ntitle: About\neyebrow: About\n---\n");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) => error instanceof SiteConfigError && /config\/profile\.md: body:/u.test(error.message)
  );
});

test("comments require a complete Giscus configuration", () => {
  const directory = configFixture();
  replaceInFile(directory, "site.yaml", / {2}giscus:\n(?: {4}.*\n?)+$/u, "  giscus:\n");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError
      && /comments: requires integrations\.giscus/u.test(error.message)
  );
});

test("a missing user-replaceable image reports its exact field", () => {
  const directory = configFixture();
  replaceInFile(
    directory,
    "site.yaml",
    "/images/profile/profile.png",
    "/images/profile/missing.png"
  );

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError
      && /config\/site\.yaml: author\.profileImage: public asset does not exist/u.test(
        error.message
      )
  );
});

test("a sidebar category cannot be both grouped and hidden", () => {
  const directory = configFixture();
  replaceInFile(directory, "categories.yaml", "  hidden: []", "  hidden:\n    - blog");

  assert.throws(
    () => loadSiteConfig({ configDirectory: directory }),
    (error) =>
      error instanceof SiteConfigError
      && /config\/categories\.yaml: sidebar\.hidden\.0: duplicates sidebar\.groups\.0\.categories\.0/u.test(
        error.message
      )
  );
});
