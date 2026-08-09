import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { parseDocument } from "yaml";
import type { z } from "zod";
import {
  categoriesFileSchema,
  featuresFileSchema,
  navigationFileSchema,
  profileFrontmatterSchema,
  siteFileSchema,
  socialFileSchema
} from "./schema.ts";
import type { ProfileConfig, UserConfig } from "./types.ts";

const DEFAULT_CONFIG_DIRECTORY = fileURLToPath(
  new URL("../../../config/", import.meta.url)
);
const DEFAULT_PUBLIC_DIRECTORY = fileURLToPath(
  new URL("../../../public/", import.meta.url)
);
const CONFIG_DIRECTORY_ENVIRONMENT_VARIABLE = "ASTRO_BLOG_CONFIG_DIR";

export class SiteConfigError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "SiteConfigError";
  }
}

function relativeConfigPath(configDirectory: string, filePath: string): string {
  return path.posix.join(
    "config",
    path.relative(configDirectory, filePath).replaceAll(path.sep, "/")
  );
}

function readConfigFile(configDirectory: string, filename: string): string {
  const filePath = path.join(configDirectory, filename);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    throw new SiteConfigError(
      `${relativeConfigPath(configDirectory, filePath)}: unable to read required configuration file`,
      { cause: error }
    );
  }
}

function formatSchemaIssues(fileLabel: string, error: z.ZodError): string {
  return error.issues.map((issue) => {
    const field = issue.path.length > 0 ? issue.path.join(".") : "<root>";
    return `${fileLabel}: ${field}: ${issue.message}`;
  }).join("\n");
}

function loadYaml<T extends z.ZodType>(
  configDirectory: string,
  filename: string,
  schema: T
): z.output<T> {
  const filePath = path.join(configDirectory, filename);
  const fileLabel = relativeConfigPath(configDirectory, filePath);
  const source = readConfigFile(configDirectory, filename);
  const document = parseDocument(source, {
    prettyErrors: true,
    uniqueKeys: true
  });

  if (document.errors.length > 0) {
    throw new SiteConfigError(
      document.errors.map((error) => `${fileLabel}: ${error.message}`).join("\n")
    );
  }

  let value: unknown;
  try {
    value = document.toJS({ maxAliasCount: 50 });
  } catch (error) {
    throw new SiteConfigError(`${fileLabel}: unable to read YAML values`, { cause: error });
  }

  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new SiteConfigError(formatSchemaIssues(fileLabel, parsed.error));
  }
  return parsed.data;
}

function loadProfile(configDirectory: string): ProfileConfig {
  const filename = "profile.md";
  const filePath = path.join(configDirectory, filename);
  const fileLabel = relativeConfigPath(configDirectory, filePath);
  const source = readConfigFile(configDirectory, filename);

  let parsedMatter: matter.GrayMatterFile<string>;
  try {
    parsedMatter = matter(source);
  } catch (error) {
    throw new SiteConfigError(`${fileLabel}: invalid Markdown frontmatter`, { cause: error });
  }

  const parsedData = profileFrontmatterSchema.safeParse(parsedMatter.data);
  if (!parsedData.success) {
    throw new SiteConfigError(formatSchemaIssues(fileLabel, parsedData.error));
  }

  const body = parsedMatter.content.trim();
  if (!body) {
    throw new SiteConfigError(
      `${fileLabel}: body: must contain the About page introduction`
    );
  }

  return {
    data: parsedData.data,
    body
  };
}

function validateCombinedConfig(config: UserConfig, publicDirectory: string): void {
  const errors: string[] = [];
  const { language, timeZone } = config.site;
  const languageEntries = Object.entries(config.languages);

  if (!config.languages[language]) {
    errors.push(`config/site.yaml: site.language: no matching languages.${language} entry`);
  } else if (config.languages[language].pathPrefix !== "") {
    errors.push(`config/site.yaml: languages.${language}.pathPrefix: default language must use an empty pathPrefix`);
  }

  const prefixes = new Map<string, string>();
  for (const [code, definition] of languageEntries) {
    const existing = prefixes.get(definition.pathPrefix);
    if (existing) {
      errors.push(
        `config/site.yaml: languages.${code}.pathPrefix: duplicates languages.${existing}.pathPrefix`
      );
    } else {
      prefixes.set(definition.pathPrefix, code);
    }
  }

  try {
    new Intl.DateTimeFormat("en", { timeZone }).format();
  } catch {
    errors.push(`config/site.yaml: site.timeZone: unsupported IANA time zone "${timeZone}"`);
  }

  if (config.features.comments && !config.integrations.giscus) {
    errors.push(
      "config/features.yaml: comments: requires integrations.giscus in config/site.yaml"
    );
  }

  const publicAssets = [
    ["author.profileImage", config.author.profileImage],
    ["branding.favicon", config.branding.favicon],
    ["branding.manifestIcon", config.branding.manifestIcon],
    ["branding.defaultOgImage", config.branding.defaultOgImage]
  ] as const;
  for (const [field, publicPath] of publicAssets) {
    const filePath = path.join(publicDirectory, publicPath.slice(1));
    try {
      if (!fs.statSync(filePath).isFile()) {
        errors.push(`config/site.yaml: ${field}: public asset is not a file (${publicPath})`);
      }
    } catch {
      errors.push(`config/site.yaml: ${field}: public asset does not exist (${publicPath})`);
    }
  }

  if (errors.length > 0) throw new SiteConfigError(errors.join("\n"));
}

export interface LoadSiteConfigOptions {
  configDirectory?: string;
  publicDirectory?: string;
}

export function loadSiteConfig(
  options: LoadSiteConfigOptions = {}
): UserConfig {
  const configDirectory = path.resolve(
    options.configDirectory
      ?? process.env[CONFIG_DIRECTORY_ENVIRONMENT_VARIABLE]
      ?? DEFAULT_CONFIG_DIRECTORY
  );
  const publicDirectory = path.resolve(
    options.publicDirectory ?? DEFAULT_PUBLIC_DIRECTORY
  );
  const site = loadYaml(configDirectory, "site.yaml", siteFileSchema);
  const navigation = loadYaml(
    configDirectory,
    "navigation.yaml",
    navigationFileSchema
  );
  const social = loadYaml(configDirectory, "social.yaml", socialFileSchema);
  const features = loadYaml(configDirectory, "features.yaml", featuresFileSchema);
  const categories = loadYaml(
    configDirectory,
    "categories.yaml",
    categoriesFileSchema
  );
  const profile = loadProfile(configDirectory);
  const config: UserConfig = {
    ...site,
    navigation,
    social,
    features,
    categories,
    profile,
    supportedLanguageCodes: Object.keys(site.languages)
  };

  validateCombinedConfig(config, publicDirectory);
  return config;
}
