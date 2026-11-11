# Customize your site

This folder is the user-facing source for site settings.

1. Edit `site.yaml` for the site identity, language, author, branding, accent
   color, and public service integrations.
2. Edit `navigation.yaml` to change visible links and their order.
3. Edit `social.yaml` to add GitHub, LinkedIn, X, Facebook, or email profile
   links. Empty values are hidden.
4. Edit `features.yaml` to enable or disable search, RSS, sitemap, dark mode,
   article tables of contents, Mermaid diagrams, projects, and comments.
5. The top of About retains the profile image and display name from `site.yaml`
   and icon links from `social.yaml`. This top profile is omitted when printing.
   Edit `profile.md` for the document below it and its printable CV. Both render
   the same Markdown body. Set `name`, `email`, an optional `subtitle`, and `language`
   in its frontmatter. Blank name/email values fall back to the site display
   name and social email. `language` is a lowercase language code such as `en`;
   omitting it uses the site language. The top profile's icon links
   use `social.yaml`; the CV below shows only email and GitHub. Keep a valid
   email address in the settings; it is displayed as `(at)` instead of `@`
   in the page and printed document.
   Use `##` for sections, `###` for entries, and an italic date at the end of
   an entry heading: `### Institution or project *Date range*`. Ordinary lists,
   bold text, and links work as usual. There is no second print-only body.
   Ctrl+P, ⌘P, or the PDF button prints the same content in a compact A4 layout.
   All profile content is public. Update this file instead of maintaining
   separate LaTeX and blog copies of the CV.

The standalone Projects feature is disabled on this blog, and its header link has
been removed. Keep project write-ups in ordinary posts with a `project` category.

Category pages are generated automatically from each post's `categories` value.
Edit `categories.yaml` to order the groups and category links on the Categories
page. Use the slug from each category URL. Groups with no published posts are
omitted, and unlisted categories appear under “More categories”. The content
check lists their slugs without blocking deployment or editing the YAML file. Navigation settings contain only
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
  accentHue: 250
```

This blog defaults to the system theme and hue 250. A hue of 18 preserves the original Orange
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
