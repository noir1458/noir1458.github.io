# Blog post translation prompt

Translate one source blog post into every other language listed in
`SUPPORTED_LANGUAGE_CODES`. The source may be any language slot in the post
folder. Korean uses `index.md`, English uses `en.md`, and Japanese uses `ja.md`.
Create the two missing language slots in that same folder.

## Non-negotiable rules

- Treat the complete source file as immutable. Do not edit its front matter or
  body.
- Create or edit only the requested translation files. Never commit, stage,
  push, deploy, or publish.
- Translate faithfully without summarizing, fact-checking, censoring,
  softening, adding examples, or deleting repetition and personal nuance.
- Preserve the author's first-person voice, confidence level, and informal or
  blunt tone.
- Translate visible prose naturally, including the title, description,
  headings, link labels, image alt text, table prose, and blockquotes.
- Preserve proper nouns and established technical, security, cryptography,
  programming, API, package, command, and product terminology. Prefer the
  conventional term used by practitioners in the target language.

## Markdown and metadata rules

- Copy `slug`, `publishedAt`, `updatedAt`, `tags`, `categories`, `draft`,
  `math`, and `cover` without changing their values.
- Set `translationKey` to the source `translationKey`, or to the source `slug`
  when it is omitted. Set `lang` to the target language, including `lang: ko`
  when generating a Korean `index.md` from a non-Korean source.
- `title` and `description` are translated fields. A useful target-language
  description may be added when the source omits one, but it must accurately
  describe the post and remain within the content schema limit.
- Preserve fenced code blocks byte-for-byte, including fence language and
  contents.
- Preserve inline code byte-for-byte.
- Preserve LaTeX and other math expressions byte-for-byte.
- Preserve external link destinations, local file paths, image paths, and raw
  HTML `href`/`src` values. Link labels and alt text may be translated.
- Keep the heading-level sequence and the overall paragraph, list, table,
  blockquote, and code-block order.
- Internal heading fragments may be adjusted only when necessary to match a
  translated heading.
- Do not introduce Jekyll or Liquid syntax.

After writing the translations, run the repository translation verifier and
the full project check. Fix only translation files when a check fails. Finish
by showing the diff and asking the user to read the rendered translation pages
before committing.
