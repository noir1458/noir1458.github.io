import type { z } from "zod";
import type {
  categoriesFileSchema,
  featuresFileSchema,
  navigationFileSchema,
  profileFrontmatterSchema,
  siteFileSchema,
  socialFileSchema
} from "./schema.ts";

export type SiteFileConfig = z.infer<typeof siteFileSchema>;
export type NavigationConfig = z.infer<typeof navigationFileSchema>;
export type SocialConfig = z.infer<typeof socialFileSchema>;
export type FeatureConfig = z.infer<typeof featuresFileSchema>;
export type CategoriesConfig = z.infer<typeof categoriesFileSchema>;
export type ProfileFrontmatter = z.infer<typeof profileFrontmatterSchema>;

export interface ProfileConfig {
  data: ProfileFrontmatter;
  body: string;
}

export interface UserConfig extends SiteFileConfig {
  navigation: NavigationConfig;
  social: SocialConfig;
  features: FeatureConfig;
  categories: CategoriesConfig;
  profile: ProfileConfig;
  supportedLanguageCodes: string[];
}
