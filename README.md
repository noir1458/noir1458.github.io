# noir1458 Astro Blog

`noir1458.github.io`를 위한 Astro 정적 블로그입니다. 기존 Jekyll 블로그를
마이그레이션한 뒤 현재 112개 논리 글과 번역을 포함한 114개 글 경로를 제공하며
`/posts/<slug>/` 주소를 유지합니다. Markdown, 수식, 검색, 태그, 카테고리,
아카이브와 Giscus 댓글을 지원합니다.

> 사이트를 운영할 때 수정하는 영역은 `config/`, `content/`,
> `public/images/` 세 곳뿐입니다.

일반 사용자는 `astro.config.mjs`, `package.json`, `src/**/*.ts`,
`src/**/*.astro`, `src/content.config.ts`, `.github/workflows/deploy.yml`을 수정하지
않아도 사이트 정보, 글, 프로젝트, 이미지와 GitHub Pages 배포를 관리할 수
있습니다.

## 사용자 편집 영역

| 경로 | 용도 |
| --- | --- |
| `config/` | 사이트 정보, 프로필, 메뉴, 소셜 링크, 기능 켜기/끄기 |
| `content/` | 게시물 Markdown, 글 전용 이미지, 프로젝트 Markdown |
| `public/images/` | 프로필, 프로젝트, favicon, manifest, 기본 OG 이미지 |

## 주요 기능

- Astro 정적 빌드와 GitHub Pages 자동 배포
- 기존 Jekyll permalink를 보존한 Markdown 게시물
- 카테고리, 태그, 아카이브, 페이지네이션과 Pagefind 검색
- RSS, sitemap, robots.txt, canonical, Open Graph, JSON-LD
- 한국어·영어·일본어 번역 경로와 `hreflang`
- 다크 모드, 수식, 코드 하이라이팅, 목차와 Giscus 댓글
- 설정으로 노출을 제어하는 프로젝트 목록과 상세 페이지

## 기본 설정

`config/README.md`의 순서대로 다음 파일을 수정합니다.

1. `config/site.yaml`: 사이트 URL, 제목, 설명, 언어, 시간대, 작성자, 공용 이미지,
   Analytics·Search Console·Giscus 공개 식별자
2. `config/navigation.yaml`: header, sidebar, footer 메뉴와 순서
3. `config/social.yaml`: GitHub, LinkedIn, 이메일, 이력서 링크
4. `config/features.yaml`: search, RSS, sitemap, dark mode, 목차, 프로젝트, 댓글
5. `config/profile.md`: About 제목과 소개 Markdown

빈 선택 값은 화면에서 자동으로 숨겨집니다. 메뉴의 `requiresFeature`를 사용하면
기능이 꺼졌을 때 연결된 메뉴도 함께 숨길 수 있습니다. YAML과 Markdown 설정은
빌드 전에 스키마와 파일 경로를 검증합니다.

```md
---
title: 글 제목
slug: post-slug
publishedAt: '2026-07-25'
categories: blog
math: false
---
```

## 로컬 실행

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

질문에 답하면 `content/posts/<번호-큰분류>/<대표-category>/<slug>/` 아래에
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

`public/images/`는 여러 페이지에서 공유하는 사용자 교체 이미지에 사용합니다.
프로필 이미지는 `public/images/profile/`, 프로젝트 이미지는
`public/images/projects/`, 파비콘·manifest 아이콘·기본 OG 이미지는
`public/images/site/`에 둡니다. 실제 파일 경로는 `config/site.yaml`의
`author.profileImage`와 `branding` 설정에서 지정합니다. 글 전용 이미지는 계속
각 글 폴더에 둡니다.

## 프로젝트

프로젝트는 `content/projects/<project-slug>.md`에 추가합니다. 파일명이
`/projects/<project-slug>/` URL이 됩니다.

```md
---
title: 프로젝트 이름
description: 프로젝트를 설명하는 짧은 문장
repository: https://github.com/username/project
demo:
image: /images/projects/project.webp
tags:
  - Astro
  - TypeScript
featured: true
order: 1
---

프로젝트에 관한 자세한 설명을 Markdown으로 작성합니다.
```

`repository`, `demo`, `image`는 선택 사항이며 빈 값은 화면에서 숨겨집니다.
프로젝트 이미지는 `public/images/projects/`에 둡니다. `featured: true`인
프로젝트가 먼저 나오고, 그 안에서는 `order`가 작은 순서로 정렬됩니다.
공개 전에는 `draft: true`를 사용합니다. 프로젝트 화면을 표시하려면
`config/features.yaml`의 `projects`를 `true`로 바꾸면 설정된 Projects 메뉴와
목록·상세 페이지가 함께 생성됩니다.

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
content/posts/00.blog/blog/sample-post/
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
> `content/posts/.../글-slug/ja.md`

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
npm run translate:snapshot -- content/posts/.../ja.md
npm run translate:verify -- content/posts/.../ja.md --source-hash <출력된 해시>
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

지원 언어를 늘릴 때는 `config/site.yaml`의 `languages`에 언어 코드, 표시 이름,
locale, OG locale, URL prefix를 추가합니다. 라우트와 콘텐츠 스키마는 이 설정을
공통으로 사용합니다. 기본 언어만 `index.md`를 사용하고 다른 언어 파일명은 언어
코드와 같아야 합니다.

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
- 개인 블로그 기준선의 legacy 게시물 URL 114개

## 배포

최초 한 번 GitHub 저장소의 **Settings → Pages → Build and deployment →
Source**를 **GitHub Actions**로 설정합니다. 그다음 `config/site.yaml`의
`site.url`이 실제 공개 주소인지 확인하고 `main`에 push합니다.

`.github/workflows/deploy.yml`은 다음을 자동으로 수행합니다.

- pull request: 읽기 전용 권한으로 `npm ci`와 전체 `npm run check`
- `main` push 또는 수동 실행: 같은 검증 후 Pages artifact 생성과 배포
- deploy job만 `pages: write`와 `id-token: write` 사용
- 모든 외부 GitHub Action을 전체 commit SHA로 고정

```bash
npm run publish
git add .
git commit -m "feat: rebuild blog with Astro"
git push origin main
```

`npm run publish`는 실제 push를 실행하지 않고 검사와 명령 안내만 합니다.

배포가 시작되지 않으면 Pages Source가 **GitHub Actions**인지, Actions 탭에서
workflow 실행이 허용됐는지, 기본 브랜치가 `main`인지 확인합니다. URL이 잘못된
경우 `config/site.yaml`만 고친 뒤 다시 push합니다.

## 커스텀 도메인

1. `config/site.yaml`의 `site.url`을 `https://example.com`처럼 실제 도메인으로
   변경하고 push합니다.
2. GitHub 저장소의 **Settings → Pages → Custom domain**에 같은 도메인을
   저장합니다.
3. DNS 제공자에서 subdomain은 `<username>.github.io`를 향하는 `CNAME`, apex
   domain은 GitHub가 안내하는 `A`/`AAAA` 또는 `ALIAS`/`ANAME` 레코드를
   설정합니다.
4. DNS 적용 후 **Enforce HTTPS**를 켭니다.

GitHub Actions 방식에서는 저장소의 `CNAME` 파일이 필요하지 않습니다. 도메인
탈취를 막기 위해 계정의 Pages 설정에서 도메인을 검증하고 wildcard DNS는
사용하지 않는 것을 권장합니다. 자세한 절차는
[GitHub Pages custom domain 문서](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)를
따릅니다.

## 설정 오류 해결

- `config/*.yaml` 오류: 메시지에 표시된 파일과 필드의 들여쓰기·필수값을 확인
- `site.url` 오류: `https://`를 포함한 전체 공개 URL 사용
- `public asset does not exist`: `config/site.yaml`의 이미지 경로와
  `public/images/`의 실제 파일명 일치 여부 확인
- 게시물 날짜 오류: `publishedAt: 'YYYY-MM-DD'` 형식 사용
- 중복 slug 오류: 같은 언어의 게시물마다 고유한 `slug` 사용
- 프로젝트 URL 오류: `repository`와 `demo`에 `http://` 또는 `https://` 사용
- 빈 프로젝트 경고: `content/projects/`가 비어 있고 projects 기능이 꺼진 운영
  블로그에서는 정상이며 build 실패가 아님

문제를 고친 뒤 `npm run check`를 다시 실행하면 설정, 콘텐츠, 타입, production
build, 링크와 기능 플래그를 한 번에 재검증합니다.

## 공개 설정과 비밀값

`config/`에는 브라우저에 공개되어도 되는 값만 둡니다. Analytics 측정 ID,
Search Console verification 문자열, Giscus repository/category ID는 공개
클라이언트 설정입니다. API token, 비밀번호, private key 같은 비밀값은 절대
`config/`, Markdown 또는 `.env.example`에 실제 값으로 커밋하지 않습니다.
향후 비밀값이 필요한 자동화를 추가할 때는 GitHub Actions Secrets와 환경변수를
사용합니다.

## 주요 경로

- `content/posts/<ordered-group>/<category>/<slug>/` — Markdown 글과 글 전용 이미지
- `content/projects/<slug>.md` — 프로젝트 정보와 상세 Markdown
- `config/` — 사이트, 내비게이션, 소셜 링크와 기능 설정
- `public/images/` — 프로필, 프로젝트, favicon과 기본 OG 이미지
- `src/components/` — 공통 UI
- `src/layouts/` — HTML/SEO 레이아웃
- `src/pages/` — 정적 페이지와 동적 경로
- `src/styles/global.css` — 디자인 토큰과 반응형 스타일
- `scripts/` — 새 글·번역·검증·배포 안내
- `archive/migration/` — 일회성 Jekyll 변환기와 당시 결과 기록
- `tests/baselines/legacy-post-routes.txt` — 기존 게시물 URL 보존 기준선
- `AGENT.md` — 구현·검증 계획과 유지보수 기준

## 고급 사용자와 라이선스

레이아웃이나 기능 자체를 바꾸려는 고급 사용자만 `src/`와 내부 Astro 설정을
수정합니다. 일반적인 사이트 운영에는 해당 변경이 필요하지 않습니다.

현재 개인 블로그 저장소의 코드와 콘텐츠에는 별도 재사용 라이선스가 지정되어
있지 않습니다. 공개 템플릿 저장소를 추출할 때 코드·예제 asset에 적용할
라이선스를 별도로 확정해야 하며, 이 개인 블로그의 실제 글과 이미지는 템플릿에
포함하지 않습니다.
