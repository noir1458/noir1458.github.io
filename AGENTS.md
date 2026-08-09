# Astro blog maintenance

This repository is the production source for `noir1458.github.io`.

## User-facing areas

Normal site updates belong in:

- `config/` for site identity, navigation, sidebar categories, social links, and features
- `content/` for posts and projects
- `public/images/` for replaceable profile, project, and site images

Do not require routine users to edit Astro, TypeScript, package, or workflow files.

## Compatibility

- Preserve published post URLs and frontmatter slugs.
- Keep category, tag, archive, RSS, sitemap, search, and static asset routes working.
- Treat `tests/baselines/published-post-routes.txt` as the required public route contract.
- Do not rewrite public Git history or force-push the production repository.

## Implementation

- Load and validate user settings through `src/lib/config/`.
- Keep structured settings in YAML and long profile text in Markdown.
- Keep site-specific values out of reusable components and internal utilities.
- Preserve the current design unless a change is explicitly requested.
- Avoid unnecessary dependencies and large framework upgrades.

## Verification

After relevant changes, run:

```bash
npm run check
```

The complete check must pass before publishing. Existing warnings that do not fail
the check should be reported rather than hidden.
