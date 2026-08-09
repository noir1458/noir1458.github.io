import { loadSiteConfig } from "../src/lib/config/index.ts";

const config = loadSiteConfig();
const enabledFeatures = Object.entries(config.features)
  .filter(([, enabled]) => enabled)
  .map(([feature]) => feature);
const configuredSocialLinks = Object.values(config.social).filter(Boolean).length;

console.log(JSON.stringify({
  site: config.site.title,
  origin: config.site.url,
  defaultLanguage: config.site.language,
  supportedLanguages: config.supportedLanguageCodes,
  navigationLinks:
    config.navigation.header.length
    + config.navigation.sidebar.length
    + config.navigation.footer.length,
  configuredSocialLinks,
  sidebarCategoryGroups: config.categories.sidebar.groups.length,
  hiddenSidebarCategories: config.categories.sidebar.hidden.length,
  enabledFeatures
}, null, 2));
