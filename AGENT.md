# GitHub Blog Astro Rebuild Plan

## 1. Objective

Rebuild `noir1458.github.io` as an Astro static site that:

- preserves the existing 136 Markdown posts and public post URLs;
- keeps search indexing, Giscus comment mapping, analytics, tags, categories, archives, RSS, sitemap, and 404 behavior;
- supports Markdown, build-time KaTeX/MathML, syntax highlighting, tables, footnotes, and local images;
- adopts the refined editorial design language from the Blogger skin without copying Blogger-specific XML or widget code;
- provides a low-friction authoring workflow for creating, previewing, validating, and publishing posts;
- deploys to GitHub Pages through GitHub Actions.

The legacy Jekyll repository is read-only migration input. All implementation work belongs in this Astro project.

## 2. Existing-site contracts to preserve

- Canonical origin: `https://noir1458.github.io`
- Post permalink: `/posts/:title/`
- Existing Markdown body content and dates
- Existing category values, normalized where YAML shapes differ. Tags remain
  supported by the skin for compatibility but are optional and unused by the
  category-only authoring workflow.
- Existing post images, relocated beside their owning `index.md`
- Giscus repository and pathname mapping
- Google Search Console verification and Google Analytics identifier
- Korean locale and `Asia/Seoul` timezone
- Redirect-safe handling for any normalized slug collisions

## 3. Target stack

- Astro static output
- TypeScript
- Astro Content Collections with schema validation
- Markdown with `remark-math`, `rehype-katex`, and KaTeX CSS
- Astro’s built-in Shiki code highlighting
- Pagefind for static full-text search
- Giscus for comments
- RSS and sitemap integrations
- GitHub Actions for build, validation, link checking, and Pages deployment
- npm scripts so the project works without a globally installed Astro CLI

## 4. Information architecture

- `/` — paginated editorial post list
- `/posts/[slug]/` — individual article
- `/tags/` and `/tags/[tag]/` — tag index and filtered lists
- `/categories/` and `/categories/[category]/` — category index and filtered lists
- `/archives/` — year/month archive
- `/search/` — Pagefind-backed search
- `/about/` — about page
- `/404.html` — editorial 404 page
- `/rss.xml` — feed

Existing post paths must continue to resolve at `/posts/<legacy-title>/`.

## 5. Design system

- Korean editorial/magazine typography with Pretendard-compatible system fallback
- Light, dark, and system color modes
- Restrained neutral palette with a darker blue accent in dark mode
- Flat site title; angular glass-like top navigation and sidebar frames
- Collapsible desktop sidebar and single-column mobile layout
- One post per list row with a consistent reserved thumbnail slot
- Compact metadata using calendar, tag, and category icons
- Consistent empty, loading, and error states
- Accessible focus states, reduced-motion support, and semantic landmarks

## 6. Content migration

1. Parse every `_posts/**/*.md` file.
2. Derive the legacy slug from the filename after the `YYYY-MM-DD-` prefix.
3. Accept scalar and array `categories` values and normalize both into arrays.
   Prefer scalar frontmatter when a post has one category. Do not add
   migrated tags to the category-only post model.
4. Preserve body Markdown without rewriting prose.
5. Copy each referenced post image beside its owning `index.md` and rewrite it
   to a `./filename` reference. Do not recreate a duplicate `public/images`
   backup.
6. Set `publishedAt` from the filename date unless an explicit date exists.
7. Preserve `math: true` and also detect common math delimiters.
8. Generate a migration report for invalid front matter, duplicate slugs, missing images, and unsupported Jekyll/Liquid syntax.
9. Refuse to overwrite migrated content when validation fails.

## 7. Authoring automation

- `npm run new`:
  - prompt for title, slug, categories, and math support;
  - write a single category as scalar frontmatter and multiple categories as
    a YAML list;
  - create
    `src/content/posts/<primary-category>/<slug>/index.md`;
  - keep post-specific images directly beside `index.md`;
  - use ISO dates and validated front matter.
- `npm run dev`: local live preview.
- `npm run check`: content schema, TypeScript, build, link, and asset checks.
- `npm run migrate`: import from the existing Jekyll source.
- `npm run publish`: run checks and print safe Git commit/push instructions; do not silently publish.

## 8. SEO and compatibility

- Per-page canonical URLs
- Open Graph and Twitter metadata
- JSON-LD BlogPosting data
- Sitemap and RSS
- `robots.txt`
- descriptive titles and excerpts
- optional explicit descriptions; otherwise derive one shared excerpt from the
  first usable Markdown paragraph for lists, search, RSS, and SEO metadata
- Omit `draft` for published posts and write only `draft: true` for unpublished
  work. Migration-only source paths do not belong in post frontmatter.
- noindex for search and 404 pages
- preserved post URLs to protect existing search traffic
- responsive images with width/height where locally imported

## 9. Security and privacy

- Static output only; no server runtime or secrets in client bundles
- Treat Markdown as trusted author content but avoid enabling arbitrary injected scripts
- External links opened in new tabs must use `rel="noopener noreferrer"`
- Giscus and analytics configuration must be explicit and documented
- No credentials in the repository
- Dependabot-compatible lockfile and pinned GitHub Action majors

## 10. Verification gates

- Content migration completes with zero duplicate slugs
- All 136 legacy posts are represented
- All referenced local images exist
- Production Astro build passes
- Generated HTML has no broken internal links
- Existing `/posts/:title/` URLs appear in build output
- RSS, sitemap, tags, categories, archives, search index, and 404 are generated
- Light/dark/system controls persist and respect OS changes
- Sidebar and navigation work at desktop, tablet, and mobile widths
- Giscus only loads on post pages
- GitHub Pages workflow is syntactically valid

## 11. Delivery sequence

1. Scaffold and pin the Astro project.
2. Establish content schema and migration script.
3. Migrate posts and assets, then validate compatibility.
4. Implement shared layout, design tokens, header, sidebar, and theme controls.
5. Implement listing, post, taxonomy, archive, search, RSS, sitemap, and 404 pages.
6. Add math, code, comments, SEO, and accessibility behavior.
7. Add authoring scripts and documentation.
8. Run all verification gates and record results.
9. Keep the old Jekyll repository untouched until visual and URL parity is confirmed.

## 12. Navigation and hierarchy refinement

- Use the same lightweight editorial hierarchy as the finalized Blogger skin.
- Sidebar widget separators use the theme's `1px` neutral line instead of a
  heavy dark rule. The first widget remains unruled.
- Article breadcrumbs keep their compact size but receive slightly more bottom
  space so the article title reads as a separate hierarchy level.
- At `700px` and below, the primary navigation becomes a three-line menu
  button. It opens Home, Categories, Tags, Archives, and About in that order
  as a vertical dropdown rather than hiding or duplicating them.
- The mobile navigation and expandable search are mutually exclusive. The
  navigation closes after link activation, outside interaction, Escape, or a
  transition back to desktop width.
- Keep taxonomy navigation focused: the sidebar shows the most-used
  Categories, while complete Categories, Tags, and Archives views remain
  available from the primary navigation.
- Place a compact quick-links widget above Categories with verified
  destinations only: GitHub, Profile, and RSS. Keep all three controls
  perfectly circular and group them around the horizontal center at every
  responsive width.
- When the sidebar drops below the main content, keep it as one full-width
  column: quick links remain a single centered row and Categories follows
  beneath it instead of forming a second grid column.
- Keep the sidebar toggle available in that stacked layout. While the expanded
  sidebar is being scrolled, the toggle stays sticky above the panel with the
  same visual gap; collapsing hides only the panel and leaves the control
  available.
- Keep the paginated post index structurally consistent: page one and later
  pages all show the same Latest writing, All posts, and page-count heading.
- Paginate post, category, and tag listings at six posts per page. Search
  results use the same six-result page size with client-side navigation and
  load only the visible Pagefind result details for the active page.
- Organize source posts as
  `src/content/posts/<primary-category>/<post-slug>/index.md`. The folder
  hierarchy is for authoring and asset colocation only; public URLs continue
  to come from frontmatter `slug`, list order from `publishedAt`, and taxonomy
  pages from `categories`; tag routes remain as an empty compatibility surface.
- Keep post-specific images directly beside that post's `index.md`, reference
  body images as `./filename.ext`, and define local covers the same way.
  When `cover` is omitted, the first local body image is the automatic cover;
  use an explicit `cover` only to override that choice.
  Reserve `public/` for shared fixed-path assets. Imported images that cannot
  be associated with a post belong in the non-deployed
  `archive/unassigned-images/` folder until reviewed.
- Pagination exposes first, previous, numbered, next, and last navigation when
  those destinations exist. The desktop sidebar toggle keeps its chevron
  optically centered and uses the same rightward motion curve as the sidebar.
- Keep the title row focused on site identity and theme selection; repository
  access belongs in the footer rather than a separate header icon.
- When mobile search expands, it fills the top bar's usable width and covers
  the navigation trigger area so no partial menu icon remains visible.
