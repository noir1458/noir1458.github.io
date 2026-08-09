# Customize your site

This folder is the user-facing source for site settings.

1. Edit `site.yaml` for the site identity, author, branding, languages, and
   public service integrations.
2. Edit `navigation.yaml` to change visible links and their order.
3. Edit `social.yaml` to add or remove profile links. Empty values are hidden.
4. Edit `features.yaml` to enable or disable search, RSS, sitemap, dark mode,
   article tables of contents, projects, and comments.
5. Write the About page introduction in `profile.md`.

Paths beginning with `/` refer to files or pages in this site. Place shared
images in `public/images/` as the repository is generalized; post-specific
images stay beside their Markdown files in `content/posts/`.

Do not put API keys, access tokens, passwords, or other secrets in this folder.
Analytics, site-verification, and Giscus identifiers are public browser
configuration, not credentials. Leave an optional value empty to omit it.
