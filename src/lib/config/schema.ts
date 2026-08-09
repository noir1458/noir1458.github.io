import { z } from "zod";

export const FEATURE_NAMES = [
  "search",
  "rss",
  "sitemap",
  "darkMode",
  "tableOfContents",
  "projects",
  "comments"
] as const;

const emptyToUndefined = (value: unknown) => {
  if (value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
};

const nonEmptyString = z.string().trim().min(1);

const webUrl = z.url().refine(
  (value) => /^https?:\/\//u.test(value),
  "must use http or https"
);

const optionalWebUrl = z.preprocess(emptyToUndefined, webUrl.optional());
const optionalString = z.preprocess(emptyToUndefined, nonEmptyString.optional());
const optionalEmail = z.preprocess(emptyToUndefined, z.email().optional());

const publicPath = nonEmptyString.refine(
  (value) => value.startsWith("/") && !value.startsWith("//"),
  "must be an absolute site path beginning with one /"
).refine(
  (value) => !value.split("/").includes(".."),
  "must not contain parent-directory segments"
).refine(
  (value) => !value.includes("\\") && !/[?#]/u.test(value),
  "must not contain backslashes, a query, or a fragment"
);

const languageCode = z.string().regex(
  /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/u,
  "must be a lowercase language code such as ko, en, or pt-br"
);

const languageDefinition = z.object({
  label: nonEmptyString,
  locale: nonEmptyString,
  ogLocale: z.string().regex(
    /^[A-Za-z]{2,3}_[A-Za-z]{2,4}$/u,
    "must look like ko_KR or en_US"
  ),
  pathPrefix: z.string().refine(
    (value) => value === "" || /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value),
    "must be empty or a path such as /en"
  )
}).strict();

const giscusSchema = z.object({
  repo: nonEmptyString.regex(
    /^[^/\s]+\/[^/\s]+$/u,
    "must look like owner/repository"
  ),
  repoId: nonEmptyString,
  category: nonEmptyString,
  categoryId: nonEmptyString
}).strict();

export const siteFileSchema = z.object({
  site: z.object({
    title: nonEmptyString,
    description: nonEmptyString.max(220),
    url: webUrl.transform((value) => value.replace(/\/+$/u, "")),
    language: languageCode,
    timeZone: nonEmptyString,
    postsPerPage: z.number().int().min(1).max(100)
  }).strict(),
  author: z.object({
    name: nonEmptyString,
    displayName: nonEmptyString,
    profileImage: publicPath
  }).strict(),
  branding: z.object({
    favicon: publicPath,
    manifestIcon: publicPath,
    defaultOgImage: publicPath
  }).strict(),
  languages: z.record(languageCode, languageDefinition).refine(
    (languages) => Object.keys(languages).length > 0,
    "must define at least one language"
  ),
  integrations: z.object({
    analyticsId: optionalString,
    googleSiteVerification: optionalString,
    giscus: z.preprocess(
      (value) => value === null ? undefined : value,
      giscusSchema.optional()
    )
  }).strict()
}).strict();

const navigationHref = nonEmptyString.refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("mailto:")) return value.length > "mailto:".length;
  try {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}, "must be a site path, an http(s) URL, or a mailto link");

const navigationLinkSchema = z.object({
  label: nonEmptyString,
  href: navigationHref,
  external: z.boolean().default(false),
  icon: z.enum(["user", "github", "linkedin", "rss"]).optional(),
  requiresFeature: z.enum(FEATURE_NAMES).optional()
}).strict().superRefine((link, context) => {
  if (link.external && link.href.startsWith("/")) {
    context.addIssue({
      code: "custom",
      path: ["external"],
      message: "cannot be true for an internal site path"
    });
  }
});

export const navigationFileSchema = z.object({
  header: z.array(navigationLinkSchema),
  sidebar: z.array(navigationLinkSchema).default([]),
  footer: z.array(navigationLinkSchema).default([])
}).strict();

export const socialFileSchema = z.object({
  github: optionalWebUrl,
  linkedin: optionalWebUrl,
  email: optionalEmail,
  resume: optionalWebUrl
}).strict();

export const featuresFileSchema = z.object({
  search: z.boolean(),
  rss: z.boolean(),
  sitemap: z.boolean(),
  darkMode: z.boolean(),
  tableOfContents: z.boolean(),
  projects: z.boolean(),
  comments: z.boolean()
}).strict();

const categorySlug = nonEmptyString.regex(
  /^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u,
  "must be a category URL slug such as web-development"
).transform((value) => value.normalize("NFKC").toLocaleLowerCase("en-US"));

export const categoriesFileSchema = z.object({
  sidebar: z.object({
    groups: z.array(z.object({
      categories: z.array(categorySlug).min(1)
    }).strict()).default([]),
    hidden: z.array(categorySlug).default([])
  }).strict()
}).strict().superRefine((config, context) => {
  const locations = new Map<string, Array<string | number>>();

  config.sidebar.groups.forEach((group, groupIndex) => {
    group.categories.forEach((category, categoryIndex) => {
      const path = ["sidebar", "groups", groupIndex, "categories", categoryIndex];
      const existing = locations.get(category);
      if (existing) {
        context.addIssue({
          code: "custom",
          path,
          message: `duplicates ${existing.join(".")}`
        });
      } else {
        locations.set(category, path);
      }
    });
  });

  config.sidebar.hidden.forEach((category, categoryIndex) => {
    const path = ["sidebar", "hidden", categoryIndex];
    const existing = locations.get(category);
    if (existing) {
      context.addIssue({
        code: "custom",
        path,
        message: `duplicates ${existing.join(".")}`
      });
    } else {
      locations.set(category, path);
    }
  });
});

export const profileFrontmatterSchema = z.object({
  title: nonEmptyString,
  eyebrow: nonEmptyString.default("About"),
  subtitle: nonEmptyString.optional()
}).strict();
