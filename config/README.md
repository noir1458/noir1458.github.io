# Customize your site

This folder is the user-facing source for site settings.

1. Edit `site.yaml` for the site identity, author, branding, accent color,
   languages, and public service integrations.
2. Edit `navigation.yaml` to change visible links and their order.
3. Edit `social.yaml` to add GitHub, LinkedIn, X, Facebook, or email profile
   links. Empty values are hidden.
4. Edit `features.yaml` to enable or disable search, RSS, sitemap, dark mode,
   article tables of contents, Mermaid diagrams, projects, and comments.
5. Write the About page introduction and the project summaries below it in
   `profile.md`. Both use ordinary Markdown. Add each project under `## Projects`
   with a `###` heading, a short description, and repository or related-post links.
   Replace the empty-list message when adding the first project; a commented
   example is included in the file.

The standalone Projects feature is disabled on this blog, and its header link has
been removed. Keep project write-ups in ordinary posts with a `project` category.

Category pages are generated automatically from each post's `categories` value.
No separate category settings file is needed. Navigation settings contain only
header and footer links; pages do not render a sidebar.

Paths beginning with `/` refer to files or pages in this site. Replace the
profile image in `public/images/profile/`, and favicon or social-card images in
`public/images/site/`. Keep the paths in `site.yaml` in sync with their files.
The build reports the exact field when a configured image is missing.
Post- and project-specific images stay beside their Markdown files in `content/`.

Choose the site's default theme (`light`, `dark`, or `system`) and accent hue
(an integer from 0 through 360) in `site.yaml`:

```yaml
appearance:
  defaultTheme: system
  accentHue: 0
```

This blog defaults to the system theme and hue 0. A hue of 18 preserves the original Orange
Square 0.1.2 light and dark accent colors. Other values rotate that palette's hue.
Visitor choices override these defaults and persist in their browser. The system
theme follows the operating system. The hue choice is stored under
an Orange Square-specific key, independently of the previous skin's hue setting.

The optional site-wide background banner is disabled by default. To use it, place a local
image under `public/` and configure `appearance.banner` in `site.yaml`:

```yaml
appearance:
  banner:
    enabled: true
    image: /images/site/banner.webp
    titleTone: light
    position: center
    height: 600
    mobileHeight: 420
    overlayOpacity: 0.18
```

`titleTone` controls the title contrast over the image: use `light` for light text
on a dark image area or `dark` for dark text on a bright image area. `position`
accepts `center`, `top`, `bottom`, `left`, or `right`. Heights accept 100–800
pixels, and `overlayOpacity` accepts 0–1. The enabled image path must identify an
existing file under `public/`.

Do not put API keys, access tokens, passwords, or other secrets in this folder.
Analytics, site-verification, and Giscus identifiers are public browser
configuration, not credentials. Leave an optional value empty to omit it.
