import { loadSiteConfig } from "./lib/config/index.ts";
import { localeTags } from "./lib/config/locale.ts";
import { prefixSitePath, siteBasePath } from "./lib/config/sitePaths.ts";

export const USER_CONFIG = loadSiteConfig();

export const NAVIGATION = USER_CONFIG.navigation;
export const SOCIAL = USER_CONFIG.social;
export const FEATURES = USER_CONFIG.features;
export const PROFILE = USER_CONFIG.profile;
export const APPEARANCE = USER_CONFIG.appearance;

const basePath = siteBasePath(USER_CONFIG.site.url);

export const SITE = {
  title: USER_CONFIG.site.title,
  description: USER_CONFIG.site.description,
  url: USER_CONFIG.site.url,
  basePath,
  locale: localeTags(USER_CONFIG.site.language).locale,
  language: USER_CONFIG.site.language,
  timeZone: USER_CONFIG.site.timeZone,
  socialImage: USER_CONFIG.branding.defaultOgImage,
  favicon: USER_CONFIG.branding.favicon,
  manifestIcon: USER_CONFIG.branding.manifestIcon,
  postsPerPage: USER_CONFIG.site.postsPerPage,
  author: {
    name: USER_CONFIG.author.name,
    displayName: USER_CONFIG.author.displayName,
    profileImage: USER_CONFIG.author.profileImage,
    url: USER_CONFIG.social.github
  },
  analyticsId: USER_CONFIG.integrations.analyticsId,
  googleVerification: USER_CONFIG.integrations.googleSiteVerification,
  giscus: USER_CONFIG.integrations.giscus
} as const;

/** Open Graph locale for a page language; the About page may differ from the site language. */
export function ogLocale(language: string = SITE.language): string {
  return localeTags(language).ogLocale;
}

export function sitePath(value: string): string {
  return prefixSitePath(value, SITE.basePath);
}
