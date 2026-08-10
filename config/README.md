# Customize your site

This folder is the user-facing source for site settings.

1. Edit `site.yaml` for the site identity, author, branding, languages, and
   public service integrations.
2. Edit `navigation.yaml` to change visible links and their order.
3. Edit `categories.yaml` to group, order, or hide sidebar categories. Categories
   omitted from both `groups` and `hidden` appear automatically in a final group.
4. Edit `social.yaml` to add or remove profile links. Empty values are hidden.
5. Edit `features.yaml` to enable or disable search, RSS, sitemap, dark mode,
   article tables of contents, Mermaid diagrams, projects, and comments.
6. Write the About page introduction in `profile.md`.

Category values in `categories.yaml` use the URL slug shown after
`/categories/`. The build reports categories that are displayed automatically
because they are not configured. `hidden` only removes a category from the
sidebar; its page and post links remain available.

Paths beginning with `/` refer to files or pages in this site. Replace the
profile image in `public/images/profile/`, project images in
`public/images/projects/`, and favicon or social-card images in
`public/images/site/`. Keep the paths in `site.yaml` in sync with their files.
The build reports the exact field when a configured image is missing.
Post-specific images stay beside their Markdown files in `content/posts/`.

Do not put API keys, access tokens, passwords, or other secrets in this folder.
Analytics, site-verification, and Giscus identifiers are public browser
configuration, not credentials. Leave an optional value empty to omit it.
