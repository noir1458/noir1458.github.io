export interface LocaleTags {
  /** BCP 47 tag for `Intl` and `localeCompare`, such as `ko-KR`. */
  locale: string;
  /** Open Graph locale, such as `ko_KR`. */
  ogLocale: string;
}

/** Adds the most likely region to a bare language code: `ko` becomes `ko-KR` and `ko_KR`. */
export function localeTags(language: string): LocaleTags {
  try {
    const { language: base, region } = new Intl.Locale(language).maximize();
    if (region) return { locale: `${base}-${region}`, ogLocale: `${base}_${region}` };
  } catch {
    // An unknown code falls through and is used as written.
  }
  return { locale: language, ogLocale: language };
}
