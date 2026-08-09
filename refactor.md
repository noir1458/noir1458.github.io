# Astro 블로그 일반화 및 템플릿 추출 계획

작성일: 2026-08-09

이 문서는 현재 운영 중인 `noir1458.github.io`를 먼저 감사한 결과와, 기존
기능 및 URL을 보존하면서 설정 기반 구조로 리팩터링한 뒤 독립적인 템플릿을
추출하기 위한 실행 계획을 기록한다.

이번 단계에서는 애플리케이션 코드를 변경하지 않았다. 이후 작업은 아래 단계별로
진행하고, 각 단계가 독립적으로 검증 가능한 상태를 유지한다.

## 1. 현재 기준선

### Git 상태

- 브랜치: `main`
- 기준 커밋: `5894962` (`fix(content): correct R-squared formula`)
- 원격 상태: `main...origin/main`
- 작업 시작 전부터 존재한 사용자 변경:
  - 수정됨: `AGENTS.md`
  - 추적되지 않음: `refactor.md`
- 기존 사용자 변경은 덮어쓰거나 되돌리지 않는다.

### 현재 검증 결과

실행한 명령:

```bash
npm run check
```

결과:

- 번역 안전성 테스트: 6개 통과
- Astro/TypeScript: 오류 0개
- 힌트 1개: `document.execCommand("copy")` deprecated API 사용
- 논리 게시물: 112개
- 번역 파일: 2개
- 공개 콘텐츠 엔트리 및 고유 게시물 경로: 114개
- 수식 사용 게시물: 50개
- 검사한 로컬 이미지 참조: 922개
- 생성 HTML: 167개
- 생성 게시물 페이지: 114개
- Pagefind 색인 페이지: 113개, 언어 3개(`ko`, `en`, `ja`)
- 내부 링크, canonical, hreflang, RSS, sitemap, 검색 인덱스 검사: 통과
- production build: 성공

README와 `reports/migration.json`에는 과거 마이그레이션 시점의 136개가 기록되어
있지만 현재 작업 트리에는 논리 게시물 112개가 있다. Git 기록에는
`content: clean up personal blog posts`, `feat: organize categories by content groups`
등의 의도적인 콘텐츠 정리 이력이 있다. 따라서 136개를 자동 복원하지 않고,
현재 검증된 112개 논리 게시물과 114개 공개 경로를 리팩터링 기준선으로 삼는다.
README의 오래된 개수 표기는 이후 문서 정리 단계에서 현재 값 또는 자동 계산
설명으로 교체한다.

## 2. 현재 구조 감사

### 설정과 개인정보

현재 대부분의 공개 사이트 설정은 `src/config.ts`의 `SITE`에 모여 있으나 사용자
편집 영역이 아니라 내부 TypeScript 코드이며 다음 실제 값이 포함되어 있다.

- 사이트 제목, 설명, URL, 기본 언어, locale, 시간대
- 기본 OG 이미지와 페이지당 게시물 수
- 작성자명과 GitHub URL
- 저장소 URL
- Google Analytics ID
- Google Search Console 검증 값
- Giscus 저장소, 저장소 ID, 카테고리, 카테고리 ID
- 한국어·영어·일본어 표시명, locale, OG locale, 경로 prefix

추가 하드코딩 위치:

| 위치 | 하드코딩된 값 또는 역할 | 처리 방향 |
| --- | --- | --- |
| `astro.config.mjs` | `https://noir1458.github.io` | 검증된 사이트 설정에서 읽기 |
| `src/content/pages/about.md` | 사용자명, GitHub, LinkedIn, CV | `config/profile.md`, `social.yaml`로 이동 |
| `src/components/Header.astro` | 상단 메뉴와 순서 | `navigation.yaml`로 이동 |
| `src/components/Footer.astro` | RSS, Sitemap, GitHub 링크 | `navigation.yaml` 및 기능 설정으로 이동 |
| `src/components/Sidebar.astro` | Profile, GitHub, RSS 링크 | 검증된 navigation/social/features 사용 |
| `src/layouts/BaseLayout.astro` | favicon 경로, 개발 캐시 prefix | branding 및 내부 파생값 사용 |
| `src/components/Giscus.astro` | 댓글 UI 문구와 고정 동작 옵션 | 안전한 항목만 설정과 연결 |
| `src/components/PostPage.astro` | 목차·댓글 항상 표시, 영문 UI 문구 | 기능 설정 및 UI 문자열 설정과 연결 |
| `public/robots.txt` | 실제 sitemap URL | 설정 기반으로 생성 |
| `public/manifest.webmanifest` | 실제 사이트명과 short name | 설정 기반으로 생성 |
| `public/sw.js` | `noir1458-blog-v2` 캐시명 | 개인 식별자가 없는 내부 이름으로 변경 |
| `package.json` | 개인 블로그 기반 패키지명 | 템플릿 추출 시 일반 이름으로 변경 |

현재 저장소 검색에서 실제 이메일은 발견되지 않았다. 실제 이름 대신 사용자명,
개인 LinkedIn 경로, CV 링크, 분석/검증/댓글 서비스 식별자가 개인정보 제거
대상이다. 게시물 본문과 첨부 이미지는 템플릿 추출 단계에서 전부 제외한다.

`SITE.repository`는 현재 선언만 있고 화면이나 빌드에서 사용되지 않는다.
`public/assets/img/avatar.png`는 현재 렌더링되지 않는다. 공개 SVG 아이콘 두 개는
About 링크 스타일에서 사용되므로 제거 대상이 아니다.

### 콘텐츠

현재 콘텐츠는 다음과 같다.

```text
src/content/
├── pages/about.md
└── posts/<ordered-group>/<category>/<post>/
    ├── index.md
    ├── en.md 또는 ja.md (번역이 있는 경우)
    └── 게시물 전용 이미지
```

- Markdown 파일: 114개 (`index.md` 112개, `en.md` 1개, `ja.md` 1개)
- 이미지: WebP 838개, PNG 85개
- 게시물 slug는 frontmatter에서 결정되며 소스 폴더 이동과 분리되어 있다.
- 한국어는 `/posts/<slug>/`, 번역은 `/<lang>/posts/<slug>/`로 생성된다.
- 게시물 전용 이미지를 Markdown과 같은 폴더에 두는 현재 방식은 Astro 이미지
  검증과 최적화에 사용되므로 유지할 가치가 높다.
- 프로젝트 콘텐츠 컬렉션과 프로젝트 페이지는 현재 구현되어 있지 않다.
- About 본문은 현재 frontmatter만 사용하며 Markdown 본문 렌더링은 없다.

최종 사용자 편집 영역 요구사항에 맞추기 위해 게시물과 프로젝트는 루트
`content/`로 이동하되, 기존 slug와 생성 URL은 변경하지 않는다. 게시물 전용
이미지는 `content/posts/` 내부에 계속 함께 둘 수 있다. 사이트 공용, 프로필,
프로젝트 이미지는 `public/images/`로 정리한다.

### 현재 기능

이미 구현되어 있고 반드시 보존할 기능:

- 정적 Astro 빌드와 GitHub Pages 배포
- 기존 `/posts/<slug>/` permalink
- 영어·일본어 번역 경로와 `hreflang`, `x-default`
- 카테고리, 태그, 아카이브, 페이지네이션
- Pagefind 검색과 개발 환경 fallback 검색
- RSS, sitemap, robots.txt
- canonical, Open Graph, Twitter card, JSON-LD
- Giscus pathname 댓글 매핑
- Google Analytics 및 Search Console 검증
- light/dark/system 테마와 반응형 내비게이션/사이드바
- Shiki 코드 강조, KaTeX/MathML, 목차, 읽기 진행률
- 404 페이지, 서비스워커와 PWA manifest
- 콘텐츠·번역·이미지·중복 slug·생성 링크 검증

현재 구현되지 않은 기능:

- 프로젝트 컬렉션과 프로젝트 목록/상세 화면
- YAML 기반 사용자 설정과 설정 스키마
- 기능 플래그
- PR 전용 GitHub Actions 검증
- 설정 기반 robots/manifest 생성

기능 플래그는 실제로 안전하게 켜고 끌 수 있는 항목만 노출한다. 처음부터 모든
후보를 YAML에 넣지 않고, 각 기능의 조건부 렌더링과 빌드를 검증한 뒤 공개한다.

### 배포

`.github/workflows/deploy.yml`은 다음 장점이 있다.

- `npm ci`, 콘텐츠 검증, Astro check, production build, 생성물 검증 실행
- GitHub Pages 공식 artifact/deploy 흐름 사용
- Actions를 commit SHA로 고정
- 동시 배포 취소 설정

개선할 점:

- `pull_request` 이벤트에서 별도 build 검증이 없다.
- 최상위 `pages: write`, `id-token: write` 권한이 build job에도 적용된다.
- build와 deploy 권한을 job별로 분리해 최소 권한을 더 명확히 할 수 있다.

현재 정상 배포 흐름을 유지하며 위 두 항목만 최소 범위로 보완한다.

## 3. 마이그레이션 흔적 분류

### 1) 현재도 필수이므로 유지

- `src/utils/content.ts`의 slug·언어별 URL 생성
- `src/pages/posts/[slug].astro`와 `src/pages/[lang]/posts/[slug].astro`
- 카테고리/태그/아카이브 및 페이지네이션 경로
- `scripts/check-content.mjs`: 중복 slug, 언어, 이미지, Liquid 잔존 검사
- `scripts/check-build.mjs`: 기존 경로, canonical, hreflang, RSS/sitemap,
  내부 링크 검사
- 게시물 frontmatter의 기존 slug와 날짜·카테고리 값
- 게시물 폴더에 함께 있는 기존 이미지
- Giscus의 pathname 매핑

현재 별도의 redirect 테이블은 없다. URL 호환은 frontmatter slug와 정적 경로
생성 규칙으로 보장된다. 따라서 이 규칙을 변경하지 않는 것이 핵심이다.

### 2) 일반 기능으로 정리하여 유지

- `src/config.ts`: 루트 YAML/Markdown을 읽는 공통 설정 로더와 타입으로 교체
- `scripts/new-post.mjs`: 루트 `content/posts/`와 설정 기반 언어/시간대를 사용
- 번역 안전성 스크립트: 새 콘텐츠 경로와 공통 설정을 사용
- 검증 스크립트: 하드코딩된 콘텐츠 경로와 사이트 URL을 공통 로더에서 사용
- `README.md`: 운영 블로그 설명과 템플릿 사용자 설명의 역할을 분리

### 3) 일회성 도구이므로 별도 보관 후보

- `scripts/migrate-jekyll.mjs`
- `reports/migration.json`
- `AGENT.md`의 과거 Astro 재구축 계획

현재 실행 코드에서 필수 참조되지는 않지만 README와 `npm run migrate`에서 공식
도구처럼 노출되어 있다. 개인 블로그의 리팩터링이 안정화되기 전에는 삭제하지
않는다. 이후 `archive/migration/` 또는 `docs/history/`로 이동할지, 계속 지원할지
결정한다. 템플릿 저장소에는 기본적으로 포함하지 않는다.

### 4) 완전히 불필요하므로 제거 후보

- `template/index.md`: `scripts/new-post.mjs`가 파일 내용을 직접 생성하므로 현재
  어디에서도 참조되지 않는다.

Jekyll `_config.yml`, Gemfile, Liquid 템플릿, 옛 테마, 중복 워크플로는 현재
저장소에서 발견되지 않았다. 이름만 보고 삭제하지 않고 실제 참조 확인 후 별도
정리 커밋에서 처리한다.

## 4. 목표 구조

```text
/
├── config/
│   ├── README.md
│   ├── site.yaml
│   ├── navigation.yaml
│   ├── social.yaml
│   ├── features.yaml
│   └── profile.md
├── content/
│   ├── posts/
│   └── projects/
├── public/
│   └── images/
│       ├── profile/
│       ├── projects/
│       └── site/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── lib/config/
│   ├── pages/
│   ├── styles/
│   └── content.config.ts
├── scripts/
├── astro.config.mjs
├── package.json
└── .github/workflows/
```

설정의 단일 출처는 루트 `config/`이고, 모든 소비자는 `src/lib/config/`의 검증된
객체를 사용한다. `astro.config.mjs`, Astro 페이지, SEO, RSS, 검증 스크립트가
서로 다른 사이트 URL이나 locale을 갖지 않게 한다.

YAML 파서는 transitive dependency에 기대지 않고 직접 dependency로 선언한다.
스키마는 현재 Astro가 사용하는 Zod 계열과 호환되는 방식으로 중앙화한다.
설정 오류는 최소한 파일명과 필드 경로를 포함해 보고한다.

## 5. 단계별 구현 및 커밋 계획

각 단계에서 `npm run check`를 통과시킨 뒤 다음 단계로 이동한다. 대량 이동 전후에는
게시물 slug 목록과 생성 URL 목록을 비교한다. 사용자의 기존 `AGENTS.md` 변경은
명시적으로 요청받지 않는 한 구현 커밋에 포함하지 않는다.

### 1단계: 기준선과 감사 기록 확정

예상 커밋: `docs: record refactor audit and baseline`

- 이 문서를 저장한다.
- 현재 게시물/경로/페이지 수를 기준선으로 기록한다.
- `npm run check` 성공 결과를 남긴다.
- 삭제 후보는 아직 삭제하지 않는다.

검증: 문서 diff와 Git 상태 확인.

### 2단계: 사용자 설정 파일과 공통 로더 추가

예상 커밋: `refactor: add validated user configuration`

- `config/site.yaml`, `navigation.yaml`, `social.yaml`, `features.yaml`,
  `profile.md`, `config/README.md`를 추가한다.
- 현재 개인 블로그의 실제 값은 YAML로 옮겨 그대로 유지한다.
- `src/lib/config/`에 파서, 스키마, 타입, 오류 포맷팅을 둔다.
- 빈 social 값은 정규화 후 렌더링 대상에서 제외한다.
- 잘못된 URL, 필수 제목 누락, 잘못된 navigation 구조를 작은 fixture 또는
  검증 스크립트로 확인한다.
- 비밀값은 설정 스키마에 추가하지 않는다.

검증: 설정 검증, Astro check, production build, 기존 페이지 메타데이터 비교.

### 3단계: 사이트·SEO·내비게이션 하드코딩 제거

예상 커밋: `refactor: drive site chrome and metadata from config`

- `src/config.ts` 소비자를 검증된 설정 객체로 전환한다.
- Header, Footer, Sidebar 메뉴를 YAML에서 렌더링한다.
- title, description, canonical, OG, Twitter, JSON-LD, RSS 작성자 정보를
  설정에서 생성한다.
- `astro.config.mjs`의 `site`를 같은 설정에서 읽는다.
- robots와 manifest를 설정 기반 정적 endpoint로 생성한다.
- favicon, 기본 OG 이미지, 프로필 이미지 경로를 branding 설정과 연결한다.
- 댓글, 분석, 사이트 검증 값은 빈 값일 때 관련 태그/스크립트를 렌더링하지 않는다.
- 서비스워커 캐시명에서 개인 식별자를 제거하되 캐시 갱신 동작을 확인한다.

검증: 기존 canonical/OG/JSON-LD/RSS/sitemap 값과 기능이 동일한지 확인.

### 4단계: 프로필과 기능 설정 연결

예상 커밋: `refactor: move profile and supported feature controls to user config`

- `src/content/pages/about.md`를 `config/profile.md`로 옮기고 Markdown 본문을
  About 페이지에서 렌더링한다.
- 프로필 링크는 `social.yaml`과 중복되지 않도록 한 출처만 사용한다.
- 실제로 안전하게 조건부 처리할 수 있는 기능만 `features.yaml`에 노출한다.
- 우선 후보는 comments, table of contents, search UI, RSS 링크, projects이다.
- 비활성화 시 링크만 숨고 깨진 페이지가 남는 식의 불일치를 만들지 않는다.

검증: 각 공개 기능 플래그의 on/off build를 모두 실행.

### 5단계: 콘텐츠를 루트 사용자 영역으로 이동

예상 커밋: `refactor: move editable content to repository root`

- `src/content/posts/`를 `content/posts/`로 이동한다.
- Content Collections glob, 이미지 glob, 새 글/번역/검증/마이그레이션 스크립트의
  경로를 함께 갱신한다.
- 기존 114개 Markdown과 923개 게시물 이미지 파일을 보존한다.
- frontmatter와 본문은 경로 갱신에 필요한 경우 외에는 수정하지 않는다.
- 이동 전후의 `(lang, slug)` 집합과 생성 URL 집합을 자동 비교한다.

검증 기준:

- 논리 게시물 112개
- 콘텐츠 엔트리와 게시물 페이지 114개
- 중복 slug 0개
- 누락 이미지 0개
- 기존 `/posts/<slug>/` 및 번역 경로 100% 일치
- 전체 `npm run check` 통과

### 6단계: 프로젝트 콘텐츠 지원

예상 커밋: `feat: add config-driven project content`

- `content/projects/` 컬렉션과 필요한 최소 스키마를 추가한다.
- 기존 디자인 언어를 재사용하는 프로젝트 목록 페이지를 구현한다.
- 개인 블로그의 실제 프로젝트 정보는 Markdown으로 이동한다. 현재 코드에는
  프로젝트 배열이 없으므로 새 데이터는 사용자가 제공했거나 저장소에서 확인된
  실제 링크만 사용한다.
- projects 기능을 끄면 메뉴와 페이지 노출이 일관되게 처리되도록 한다.

검증: 잘못된 repository/demo URL, 필수 제목 누락, order 정렬, 빈 컬렉션 build.

### 7단계: 공용 이미지와 잔여 하드코딩 정리

예상 커밋: `refactor: organize user-replaceable images and remove stale files`

- 프로필, 프로젝트, favicon, 기본 OG 이미지를 `public/images/`로 정리한다.
- 이미 공개된 `/assets/...` 경로는 참조 여부를 확인하고 필요한 경우 호환 파일을
  유지한다.
- 저장소 전체에서 실제 사용자명, 개인 URL, 서비스 ID가 내부 컴포넌트에 남지
  않았는지 검사한다. 개인 블로그 값은 `config/`와 실제 콘텐츠에만 존재해야 한다.
- 참조되지 않는 `template/index.md`를 제거한다.
- 마이그레이션 도구와 보고서는 3번 분류 방침에 따라 보관 또는 제거한다.
- dependency 사용 여부를 확인하되 대규모 버전 업그레이드는 하지 않는다.

검증: 정적 asset 경로, favicon/manifest, OG 이미지, 전체 build.

### 8단계: 배포와 문서 완성

예상 커밋: `docs: document customization and harden pages workflow`

- README 첫 부분에 사용자가 수정할 영역이 `config/`, `content/`,
  `public/images/`뿐임을 명시한다.
- 로컬 실행, 설정, 프로필, 메뉴, 게시물, 프로젝트, 이미지, Pages, custom domain,
  오류 해결, secret 관리, license를 문서화한다.
- deploy job과 build job 권한을 분리한다.
- pull request에서 배포 없이 검증만 수행하는 workflow/event를 추가한다.
- 기본 브랜치 이름이나 저장소명 수정을 사용자에게 요구하지 않는지 확인한다.

검증: workflow 구문 검토, 로컬 `npm ci && npm run check`.

### 9단계: 개인 블로그 최종 회귀 검증

예상 커밋: `test: verify refactored blog compatibility`

- 깨끗한 설치에서 전체 검사한다.
- 기준선의 114개 공개 게시물 URL과 새 build를 비교한다.
- 주요 페이지, RSS, sitemap, robots, Pagefind, 404, canonical, JSON-LD,
  OG, 다국어 메타데이터를 검사한다.
- 컴포넌트와 내부 코드에서 개인정보 잔존 검색을 수행한다.
- 운영 블로그에서만 필요한 legacy 호환 요소와 남은 기술 부채를 기록한다.

### 10단계: 깨끗한 템플릿 작업 트리 추출

예상 커밋: 새 템플릿 저장소의 최초 커밋

- 저장소 이름이 정해지지 않았으므로 임시 로컬 디렉터리명을 사용한다.
- 현재 작업 트리만 복사하고 `.git`, `node_modules`, `dist`, `.astro`는 제외한다.
- 개인 블로그의 Git 이력을 복사하거나 현재 저장소 이력을 재작성하지 않는다.
- 별도 디렉터리에서 `git init`으로 새 이력을 시작한다.
- 이 단계가 현재 workspace 밖 쓰기를 요구하면 실행 전에 권한 승인을 받는다.

### 11단계: 템플릿 개인정보 제거와 예제화

- 실제 게시물과 게시물 이미지를 모두 제거한다.
- 예제 게시물 2~3개, 예제 프로젝트 1~2개, 일반적인 프로필을 추가한다.
- 직접 제작한 단순 placeholder 프로필/OG/project 이미지를 사용한다.
- 실제 사용자명, 이름, 이메일, 개인 URL, LinkedIn/CV, Analytics, Search Console,
  Giscus ID, 실제 게시물·프로젝트·이미지 파일명이 남지 않았는지 검사한다.
- package name, README, manifest, service worker도 일반값으로 바꾼다.

검증: 개인정보 검색 결과 0건(허용된 LICENSE/credit 예외는 별도 기록), build 성공.

### 12단계: 새 사용자 흐름 검증

- 깨끗한 임시 복사본에서 의존성을 설치하고 기본 build를 실행한다.
- `config/site.yaml`, `config/profile.md`, `navigation.yaml`만 바꿔 다시 build한다.
- 새 게시물과 프로젝트 Markdown을 추가하고 이미지를 교체한 뒤 다시 build한다.
- 이 과정에서 `astro.config.mjs`, `package.json`, `src/**/*.ts`,
  `src/**/*.astro`, workflow를 수정하지 않는다.
- GitHub Pages 활성화의 수동 UI 단계와 GitHub Template Repository 활성화는
  저장소 생성 후 사용자가 GitHub에서 수행할 작업으로 명확히 보고한다.

## 6. 주요 위험과 대응

### 게시물 개수 불일치

과거 보고서 136개를 완료 조건으로 강제하면 사용자가 의도적으로 정리한 콘텐츠를
되살릴 수 있다. 현재 HEAD의 112개 논리 게시물/114개 경로를 기준으로 삼고,
별도 요청 없이는 삭제된 과거 글을 복원하지 않는다.

### 대량 콘텐츠 이동

1,000개가 넘는 파일 이동은 diff가 크다. 설정/검증 로직을 먼저 준비하고,
콘텐츠 이동만 별도 커밋으로 분리한다. frontmatter와 본문 변경을 섞지 않는다.

### URL과 검색 호환

소스 경로가 아니라 frontmatter slug가 공개 URL의 출처라는 현재 계약을 유지한다.
이동 전후 URL manifest를 비교하고 `check-build`에서 누락을 실패 처리한다.

### 설정과 Astro config의 이중화

Node에서 읽는 설정과 Astro에서 읽는 설정이 서로 다른 파서를 사용하지 않도록
공통 로더를 만든다. Astro config, 페이지, RSS, 검증 스크립트가 같은 객체를
사용한다.

### 기능 플래그의 거짓 약속

구현상 완전히 끌 수 없는 기능은 YAML에 노출하지 않는다. 공개한 플래그는 on/off
양쪽 production build를 검증한다.

### 개인정보가 Git 이력에 남는 문제

템플릿은 clone으로 만들지 않는다. `.git`을 제외한 최신 작업 트리만 복사하고
새 저장소로 초기화한다. 개인 블로그 저장소에서는 force push, rebase, 이력
재작성 작업을 하지 않는다.

## 7. 다음 실행 단계

다음 작업은 **2단계: 사용자 설정 파일과 공통 로더 추가**다. 먼저 실제 값을
그대로 유지하는 `config/`를 추가하고 기존 코드와 병행해 검증한 뒤, 다음
커밋에서 소비자를 전환한다. 이 순서로 진행하면 설정 구조와 화면 변경을 한 번에
섞지 않고 회귀 원인을 좁힐 수 있다.
