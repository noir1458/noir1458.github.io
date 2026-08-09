import type { CategoriesConfig } from "../config/types.ts";

export interface CountedCategory {
  name: string;
  slug: string;
  count: number;
}

export interface SidebarCategoryGroup {
  categories: CountedCategory[];
  automatic: boolean;
}

export function slugifyTermValue(term: string): string {
  const slug = term
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled";
}

export function arrangeSidebarCategories(
  categories: CountedCategory[],
  config: CategoriesConfig["sidebar"]
): { groups: SidebarCategoryGroup[]; unconfigured: CountedCategory[] } {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  const configured = new Set(config.groups.flatMap((group) => group.categories));
  const hidden = new Set(config.hidden);

  const groups = config.groups
    .map((group) => ({
      categories: group.categories.flatMap((slug) => {
        const category = bySlug.get(slug);
        return category ? [category] : [];
      }),
      automatic: false
    }))
    .filter((group) => group.categories.length > 0);

  const unconfigured = categories.filter(
    (category) => !configured.has(category.slug) && !hidden.has(category.slug)
  );

  if (unconfigured.length > 0) {
    groups.push({ categories: unconfigured, automatic: true });
  }

  return { groups, unconfigured };
}
