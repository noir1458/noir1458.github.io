# Repository instructions

## Blog post translation workflow

When the user asks to translate a post "using the blog translation workflow"
(including natural Korean requests such as `이 글 블로그 번역 스크립트대로 번역해줘`),
use the workflow below.

1. Resolve one source post file. The language slots are `index.md` for Korean,
   `en.md` for English, and `ja.md` for Japanese. If the user did not give a
   path, use the only changed or untracked file matching one of those names;
   ask which post only when that is ambiguous.
2. Read and follow `prompts/translate-post.md` completely.
3. Before editing anything, run:

   ```bash
   npm run translate:snapshot -- path/to/source.md
   ```

   Retain the reported `sourceHash`.
4. Create the missing language-slot files directly beside the source. For
   example, a Japanese `ja.md` source produces Korean `index.md` and English
   `en.md`. Do not modify the source file. Do not overwrite an existing
   language file unless the user explicitly asked to replace or update it.
5. Verify the result with the retained hash:

   ```bash
   npm run translate:verify -- path/to/source.md --source-hash HASH
   npm run check
   ```

6. Do not run `git add`, commit, push, deploy, or publish. Show the changed-file
   summary and translation diff, report both local translation URLs, and tell
   the user to read the rendered translations before committing.
