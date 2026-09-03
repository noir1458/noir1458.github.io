# Customize your site

This folder is the user-facing source for site settings.

1. Edit `site.yaml` for the site identity, author, branding, accent color,
   languages, and public service integrations.
2. Edit `navigation.yaml` to change visible links and their order.
3. Edit `categories.yaml` to group, order, or hide sidebar categories. Categories
   omitted from both `groups` and `hidden` appear automatically in a final group.
4. Edit `social.yaml` to add GitHub, LinkedIn, X, Facebook, or email profile
   links. Empty values are hidden.
5. Edit `features.yaml` to enable or disable search, RSS, sitemap, dark mode,
   article tables of contents, Mermaid diagrams, projects, and comments.
6. Write the About page introduction in `profile.md`.

Category values in `categories.yaml` use the URL slug shown after
`/categories/`. The build reports categories that are displayed automatically
because they are not configured. `hidden` only removes a category from the
sidebar; its page and post links remain available.

Paths beginning with `/` refer to files or pages in this site. Replace the
profile image in `public/images/profile/`, and favicon or social-card images in
`public/images/site/`. Keep the paths in `site.yaml` in sync with their files.
The build reports the exact field when a configured image is missing.
Post- and project-specific images stay beside their Markdown files in `content/`.

Choose the site's default accent hue in `site.yaml` with a value from 0 through
360:

```yaml
appearance:
  accentHue: 248
```

The theme controls saturation, lightness, and contrast for consistent light and
dark palettes. Every visitor starts with the configured hue. They can adjust it
with the vertical slider in the palette menu, and that personal hue is stored in
their browser.

The optional site-wide background banner is disabled by default. To use it, place a local
image under `public/` and configure `appearance.banner` in `site.yaml`:

```yaml
appearance:
  banner:
    enabled: true
    image: /images/site/banner.webp
    position: center
    height: 600
    mobileHeight: 420
    overlayOpacity: 0.18
```

`position` accepts `center`, `top`, `bottom`, `left`, or `right`. Heights accept
100–800 pixels, and `overlayOpacity` accepts 0–1. The enabled image path must
identify an existing file under `public/`.

Do not put API keys, access tokens, passwords, or other secrets in this folder.
Analytics, site-verification, and Giscus identifiers are public browser
configuration, not credentials. Leave an optional value empty to omit it.
