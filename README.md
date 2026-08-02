# noir1458 Astro Blog

`noir1458.github.io`를 위한 Astro 정적 블로그입니다. 기존 Jekyll 글 136개를
마이그레이션한 뒤 현재 134개의 공개 글을 제공하며
`/posts/<slug>/` 주소를 유지합니다. Markdown, 수식, 검색, 태그, 카테고리,
아카이브와 Giscus 댓글을 지원합니다.

```md
---
title: 글 제목
slug: post-slug
publishedAt: '2026-07-25'
categories: blog
math: false
---
```

## 준비

- Node.js 24 이상
- npm

```bash
nvm use
npm ci
npm run dev
```

로컬 주소는 기본적으로 `http://localhost:4321`입니다.

## 글 쓰기

```bash
npm run new
```

질문에 답하면 `src/content/posts/<번호-큰분류>/<대표-category>/<slug>/` 아래에
한국어는 `index.md`, 영어는 `en.md`, 일본어는 `ja.md`로 생성됩니다.
기존 카테고리는 해당 큰 분류를 자동으로 재사용하고, 새 카테고리일 때만
큰 분류를 묻습니다. 번호 큰 분류와 그 안의 카테고리 폴더 순서가 우측
사이드바 순서가 되며 큰 분류 경계에는 두 줄 구분선이 표시됩니다. 초안은
기본적으로 `draft: true`입니다. 확인이 끝나면 `draft` 줄을 제거합니다.
글 분류에는 `categories`만 사용합니다. `description`은 선택 사항이며,
생략하면 본문의 첫 번째 유효 문단이 글 목록, 검색, RSS와 SEO 설명으로
자동 사용됩니다. Tags 화면은 호환성을 위해 유지되지만 태그를 지정하지
않으면 비어 있습니다. 카테고리가 하나면 `categories: blog`처럼 한 줄로
쓰고, 여러 개면 YAML 목록 형식을 사용합니다. 빌드 과정에서는 두 형식
모두 항상 문자열 배열로 정규화됩니다.

수식은 Markdown 안에서 다음처럼 작성합니다.

```md
인라인 수식: $E = mc^2$

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

글 전용 이미지는 언어 파일과 같은 글 폴더에 둡니다. 본문에서 처음 사용한
로컬 이미지가 글 목록과 공유 메타데이터의 대표 이미지로 자동 선택됩니다.
다른 이미지를 대표로 지정하고 싶을 때만 `cover`를 추가합니다. Astro는
빌드할 때 파일 존재 여부와 이미지 정보를 검사하고 최적화합니다.

```yaml
cover: ./cover.png
```

```md
![설명](./diagram.png)
```

`public/`은 파비콘처럼 여러 페이지에서 고정 주소로 공유하는 전역 정적
파일에만 사용합니다.

## 글 언어와 번역본

지원 언어는 한국어(`ko`), 영어(`en`), 일본어(`ja`)입니다. 기존 글처럼
`lang`을 생략하면 한국어로 처리되므로 기존 `index.md`와 공개 URL은 바뀌지
않습니다.

```yaml
---
title: 한국어 글
slug: sample-post
publishedAt: '2026-08-02'
categories: blog
---
```

파일명은 언어 슬롯을 나타냅니다. 한국어는 기존 호환성을 위해 `index.md`,
영어는 `en.md`, 일본어는 `ja.md`를 사용합니다. `npm run new`에서 처음 작성할
언어를 선택하면 해당 파일을 생성합니다.

```yaml
---
title: An English Post
slug: english-post
translationKey: english-post
lang: en
publishedAt: '2026-08-02'
categories: blog
---
```

번역본은 원문과 이미지 폴더를 공유하도록 같은 글 폴더에 언어 코드 파일로
추가합니다. 원문과 모든 번역본은 같은 `slug`와 논리적 번역 식별자를
사용해야 합니다.

```text
src/content/posts/00.blog/blog/sample-post/
├── index.md  # 한국어, lang 생략 시 ko
├── en.md     # 영어, lang: en
├── ja.md     # 일본어, lang: ja
└── diagram.png
```

```yaml
---
title: English Translation
slug: sample-post
translationKey: sample-post
lang: en
publishedAt: '2026-08-02'
categories: blog
---
```

처음 작성한 언어 파일에 `translationKey`가 있으면 다른 언어 파일도 같은 값을
사용합니다. 생략한 경우에는 `slug`가 논리적 글 식별자가 됩니다. 어느 언어를
먼저 작성했는지는 라우팅에 영향을 주지 않습니다. 한국어 기본 글은 `/posts/<slug>/`, 영어는
`/en/posts/<slug>/`, 일본어는 `/ja/posts/<slug>/`에 생성됩니다. 실제 번역본이
두 개 이상 있는 글에서만 우상단 테마 버튼 왼쪽에 언어 선택기가 나타나며,
존재하지 않는 번역 언어는 표시하지 않습니다.

### Codex로 글 번역하기

글을 완성한 뒤 Codex에 다음처럼 요청합니다.

> 이 글 블로그 번역 스크립트대로 번역해줘:
> `src/content/posts/.../글-slug/ja.md`

Codex는 지정한 파일을 원문으로 보고 현재 폴더에 없는 나머지 두 언어 슬롯을
바로 생성합니다. 예를 들어 `ja.md`로 시작했다면 `index.md`와 `en.md`를
만듭니다. 작업 전에 원문 해시를 기록하고, 생성 후 코드 블록·인라인 코드·
수식·링크·이미지 경로·front matter와 원문 해시를 검사합니다. 이어서 전체
`npm run check`를 실행하고 번역 diff와 로컬 확인 URL을 알려줍니다.

이 과정은 번역 파일을 커밋 직전 상태까지 준비하지만 `git add`, 커밋, push,
배포는 실행하지 않습니다. 안내받은 한국어·영어·일본어 페이지를 로컬에서 직접
읽어본 다음 사용자가 커밋합니다. 기존 번역 파일은 사용자가 갱신을 명시적으로
요청하지 않는 한 덮어쓰지 않습니다.

수동으로 안전 검사를 실행할 때는 먼저 원문 해시를 얻고, 번역 후 그 값을 다시
전달합니다.

```bash
npm run translate:snapshot -- src/content/posts/.../ja.md
npm run translate:verify -- src/content/posts/.../ja.md --source-hash <출력된 해시>
npm run check
```

각 언어 페이지는 자기 URL을 canonical로 사용하고 `html lang`, Open Graph,
Twitter, JSON-LD `inLanguage`, Pagefind 색인 언어를 해당 글에 맞게 생성합니다.
같은 글의 페이지들은 `hreflang`과 `x-default`로 서로 연결됩니다. 사이트맵은
Astro가 생성된 언어별 URL을 자동으로 포함합니다.

기본 홈페이지·카테고리·아카이브와 `/rss.xml`은 기존 동작을 보존하기 위해
한국어 글만 표시합니다. 번역 페이지는 언어별 Pagefind 색인에 포함됩니다.
Giscus는 기존 댓글을 보존하기 위해 pathname 매핑을 유지하므로 번역 URL의
댓글은 한국어 원문과 분리됩니다.

지원 언어를 늘릴 때는 `src/config.ts`의 `SUPPORTED_LANGUAGE_CODES`와
`LANGUAGES`에 언어 코드, 표시 이름, locale, URL prefix를 추가합니다. 라우트와
콘텐츠 스키마는 이 설정을 공통으로 사용합니다. 기본 한국어만 `index.md`를
사용하고 다른 언어 파일명은 언어 코드와 같아야 합니다.

## 검사

```bash
npm run check
```

다음을 한 번에 검사합니다.

- front matter, 언어별 중복 slug와 지원하지 않는 lang
- 언어 파일명, 번역본 중복, translationKey·slug와 draft 상태 불일치
- 로컬 이미지 누락
- Astro/TypeScript
- 프로덕션 빌드와 Pagefind 색인
- 생성된 내부 링크, 언어별 페이지와 상호 hreflang
- canonical, html lang과 기본 Open Graph 이미지
- RSS, sitemap, search, archive, 404와 기존 글 페이지

## 배포

GitHub 저장소의 **Settings → Pages → Build and deployment → Source**를
`GitHub Actions`로 설정합니다. `main` 브랜치에 push하면
`.github/workflows/deploy.yml`이 검증 후 GitHub Pages에 배포합니다.

```bash
npm run publish
git add .
git commit -m "feat: rebuild blog with Astro"
git push origin main
```

`npm run publish`는 실제 push를 실행하지 않고 검사와 명령 안내만 합니다.

## 주요 경로

- `src/content/posts/<ordered-group>/<category>/<slug>/` — Markdown 글과 글 전용 이미지
- `src/components/` — 공통 UI
- `src/layouts/` — HTML/SEO 레이아웃
- `src/pages/` — 정적 페이지와 동적 경로
- `src/styles/global.css` — 디자인 토큰과 반응형 스타일
- `scripts/` — 마이그레이션·새 글·검증·배포 안내
- `archive/unassigned-images/` — 글과 연결되지 않은 Jekyll 가져오기 이미지
- `reports/migration.json` — Jekyll 마이그레이션 결과
- `AGENT.md` — 구현·검증 계획과 유지보수 기준

## 설정

사이트 주소, 작성자, Giscus, Google Analytics와 Search Console 값은
`src/config.ts`에 있습니다. 공개 설정만 두고 토큰이나 비밀키는 커밋하지
않습니다.

## 기존 Jekyll에서 다시 가져오기

마이그레이션은 현재 프로젝트의 글을 덮어쓰지 않는 것이 기본값입니다.

```bash
npm run migrate
node scripts/migrate-jekyll.mjs --source /path/to/jekyll
```

의도적으로 다시 생성할 때만 `--force`를 사용합니다. 먼저 Git 커밋으로
복구 지점을 만든 뒤 실행하세요.
