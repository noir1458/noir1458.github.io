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

질문에 답하면
`src/content/posts/<번호-큰분류>/<대표-category>/<slug>/index.md`가 생성됩니다.
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

글 전용 이미지는 `index.md`와 같은 폴더에 둡니다. 본문에서 처음 사용한
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

## 검사

```bash
npm run check
```

다음을 한 번에 검사합니다.

- front matter와 중복 slug
- 로컬 이미지 누락
- Astro/TypeScript
- 프로덕션 빌드와 Pagefind 색인
- 생성된 내부 링크
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
