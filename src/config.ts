import { loadSiteConfig } from "./lib/config/index.ts";

export const USER_CONFIG = loadSiteConfig();

export const SUPPORTED_LANGUAGE_CODES = USER_CONFIG.supportedLanguageCodes;

export type SupportedLanguage = string;

export const LANGUAGES = USER_CONFIG.languages;
export const NAVIGATION = USER_CONFIG.navigation;
export const SOCIAL = USER_CONFIG.social;
export const FEATURES = USER_CONFIG.features;
export const CATEGORY_SIDEBAR = USER_CONFIG.categories.sidebar;
export const PROFILE = USER_CONFIG.profile;

const defaultLanguage = LANGUAGES[USER_CONFIG.site.language];

if (!defaultLanguage) {
  throw new Error(
    `No language configuration found for ${USER_CONFIG.site.language}.`
  );
}

export const SITE = {
  title: USER_CONFIG.site.title,
  description: USER_CONFIG.site.description,
  url: USER_CONFIG.site.url,
  locale: defaultLanguage.locale,
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
