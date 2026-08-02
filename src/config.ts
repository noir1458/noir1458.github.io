export const SUPPORTED_LANGUAGE_CODES = ["ko", "en", "ja"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGE_CODES)[number];

export const LANGUAGES: Record<
  SupportedLanguage,
  { label: string; locale: string; ogLocale: string; pathPrefix: string }
> = {
  ko: { label: "한국어", locale: "ko-KR", ogLocale: "ko_KR", pathPrefix: "" },
  en: { label: "English", locale: "en-US", ogLocale: "en_US", pathPrefix: "/en" },
  ja: { label: "日本語", locale: "ja-JP", ogLocale: "ja_JP", pathPrefix: "/ja" }
};

export const SITE = {
  title: "noir1458's blog",
  description:
    "Computer science, software, cybersecurity, cryptography, mathematics, problem solving, and personal notes.",
  url: "https://noir1458.github.io",
  locale: "ko-KR",
  language: "ko" as SupportedLanguage,
  timeZone: "Asia/Seoul",
  socialImage: "/assets/img/social-card.png",
  postsPerPage: 6,
  author: {
    name: "noir1458",
    github: "https://github.com/noir1458"
  },
  repository: "https://github.com/noir1458/noir1458.github.io",
  analyticsId: "G-DR2Z1J9NQ4",
  googleVerification: "yLWIwMLKZv5QhvnUzTwIhY46AnghOhoCDKUSEM6Tsvk",
  giscus: {
    repo: "noir1458/noir1458.github.io",
    repoId: "R_kgDOQj5fXQ",
    category: "Announcements",
    categoryId: "DIC_kwDOQj5fXc4Czey2"
  }
} as const;
