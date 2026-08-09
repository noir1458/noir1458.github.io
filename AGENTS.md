# 기존 Astro 블로그 정리 및 재사용 가능한 템플릿 저장소 제작

## 프로젝트 배경

현재 저장소는 내 개인 GitHub Pages 블로그인 `noir1458.github.io`이다.

이 블로그는 과거 Jekyll 기반 블로그에서 Astro 기반 블로그로 마이그레이션되었다. 기존 게시물 약 134개와 기존 URL을 최대한 유지하면서 Astro로 옮겼고, 현재 실제 개인 블로그로 운영 중이다.

현재 사이트 자체의 디자인과 주요 기능은 대체로 만족스럽다. 이번 작업의 목적은 사이트를 새로 디자인하거나 다시 만드는 것이 아니다.

이번 작업의 핵심 목표는 다음 두 가지다.

1. 현재 개인 블로그를 정리하여, 개인 정보와 사용자 설정이 코드 내부에 하드코딩되지 않은 구조로 개선한다.
2. 정리된 현재 블로그를 기반으로 별도의 재사용 가능한 Astro 블로그 템플릿 저장소를 만든다.

현재 개인 블로그는 계속 실제 운영용으로 유지한다. 템플릿 저장소는 현재 블로그의 최신 코드 상태를 기반으로 하되, 내 개인정보와 실제 게시물을 제거하고 예제 데이터로 교체한 별도 저장소로 만든다.

---

# 최종 목표

최종적으로 저장소는 다음 두 개가 존재해야 한다.

## 1. `noir1458.github.io`

내 실제 개인 블로그이다.

* 실제 이름과 프로필 정보 사용
* 실제 게시물 약 134개 유지
* 기존 게시물 URL 유지
* 현재 운영 중인 GitHub Pages 배포 유지
* 실제 프로젝트와 링크 유지
* 템플릿 기능을 실제 환경에서 검증하는 운영 사례 역할

## 2. 별도의 템플릿 저장소

가칭:

```text
<TEMPLATE_REPOSITORY_NAME>
```

템플릿 저장소의 이름은 작업 중 임의로 확정하지 말고, 이름이 정해지지 않았다면 로컬 디렉터리에서는 임시 이름을 사용한다.

템플릿 저장소는 다음 특성을 가져야 한다.

* 현재 블로그와 같은 디자인 및 핵심 기능
* 개인정보 제거
* 실제 게시물 제거
* 예제 게시물 2~3개 제공
* 예제 프로젝트 1~2개 제공
* 사용자가 설정 파일과 Markdown만 수정하여 사용할 수 있음
* GitHub Template Repository로 배포할 수 있는 상태
* 기존 개인 블로그의 Git 이력을 포함하지 않는 깨끗한 저장소
* GitHub Pages 배포 설정 포함
* 초보자가 Astro 내부 코드를 수정하지 않아도 사용할 수 있음

---

# 가장 중요한 사용자 경험

이 템플릿의 핵심 사용성은 다음 문장으로 설명할 수 있어야 한다.

> 사용자는 `config/`, `content/`, `public/images/`만 수정하면 개인 블로그를 만들 수 있다.

사용자가 아래 파일을 직접 수정하도록 요구하지 마라.

```text
astro.config.mjs
package.json
src/**/*.ts
src/**/*.astro
src/content.config.ts
.github/workflows/*.yml
```

이 파일들은 내부 구현에 필요하므로 존재해도 된다. 다만 일반 사용자는 해당 파일을 수정하지 않아도 사이트 설정, 콘텐츠 작성, 이미지 교체, GitHub Pages 배포를 완료할 수 있어야 한다.

즉, 내부 설정 파일을 없애는 것이 목표가 아니다. 사용자가 내부 설정 파일을 수정할 필요가 없도록 추상화하는 것이 목표다.

---

# 작업 원칙

## 기존 개인 블로그를 먼저 일반화한다

처음부터 별도 템플릿 저장소에서 다시 구현하지 마라.

우선 현재 `noir1458.github.io` 저장소를 다음 상태로 리팩터링한다.

* 개인 정보가 컴포넌트에 하드코딩되어 있지 않음
* 사이트 설정이 루트의 `config/`에 모여 있음
* 게시물과 프로젝트가 `content/`에 모여 있음
* 사용자가 교체하는 이미지는 `public/images/`에 모여 있음
* Astro 내부 코드는 설정값을 읽어 화면을 생성함
* 현재 개인 블로그는 기존과 동일하게 정상 작동함

현재 개인 블로그에서는 내 실제 개인정보와 게시물을 지우지 않는다. 실제 값이 하드코딩되어 있던 위치를 `config/`로 이동하는 것이다.

예를 들어 현재 블로그에서는 다음처럼 실제 값을 유지할 수 있다.

```yaml
site:
  title: noir1458
  author: 서정민
```

중요한 것은 이 값이 Astro 컴포넌트 내부에 직접 적혀 있지 않고 사용자 설정 파일에 존재하는 것이다.

---

# 1단계: 현재 저장소 감사

코드를 바로 대규모로 수정하기 전에 현재 저장소를 먼저 조사하라.

다음 항목을 확인하고 작업 계획을 세워라.

## 하드코딩된 개인 정보

저장소 전체에서 다음과 같은 값을 찾는다.

* 이름
* GitHub 사용자명
* GitHub 저장소 URL
* 이메일
* 프로필 사진
* 자기소개
* 이력서 링크
* SNS 링크
* 개인 도메인
* 사이트 제목
* 사이트 설명
* 프로젝트 목록
* 푸터 문구
* 저작권 문구
* 기본 OG 이미지
* JSON-LD 작성자 정보
* Analytics 식별자
* 댓글 서비스 식별자
* 사이트 URL과 canonical URL
* RSS 작성자 정보
* sitemap 관련 URL

단순 문자열 검색뿐 아니라 해당 값이 어떤 컴포넌트, 레이아웃, 빌드 설정, SEO 설정에서 사용되는지 추적한다.

## 마이그레이션 흔적

Jekyll에서 Astro로 옮길 때 만들어졌지만 현재는 필요 없을 가능성이 있는 파일을 조사한다.

예:

* 일회성 변환 스크립트
* Jekyll 전용 설정
* 사용하지 않는 Liquid 템플릿
* 이전 빌드 파일
* 중복된 스타일 파일
* 변환 과정에서 생성된 임시 파일
* 마이그레이션 로그
* 사용하지 않는 검증 스크립트
* 임시 데이터 파일
* 이전 이미지 경로 호환용 복사본
* 작업 당시만 필요했던 문서
* 사용하지 않는 GitHub Actions 워크플로
* 중복된 package script
* 더 이상 참조되지 않는 dependency

다만 이름에 `legacy`, `migration`, `redirect` 등이 포함되어 있다는 이유만으로 삭제하지 마라.

다음과 같이 현재 운영에 필요한 요소는 유지해야 한다.

* 기존 게시물 URL 보존
* 기존 slug 호환
* 기존 카테고리 URL 호환
* redirect 처리
* Jekyll 시절 permalink 호환
* 기존 이미지 URL 호환
* 검색 인덱스 호환
* RSS 주소 호환
* 외부에서 이미 링크된 페이지의 경로 보존

각 마이그레이션 관련 파일이나 코드에 대해 다음 중 하나로 분류한다.

1. 현재도 필수이므로 유지
2. 일반 기능으로 이름과 구조를 정리하여 유지
3. 일회성 도구이므로 별도 보관
4. 완전히 불필요하므로 제거

삭제 전에는 반드시 현재 코드에서 참조되는지 확인한다.

---

# 2단계: 사용자 편집 영역 설계

최상위 디렉터리에서 사용자가 수정해야 하는 영역이 바로 보여야 한다.

권장 구조는 다음과 같다.

```text
/
├─ config/
│  ├─ README.md
│  ├─ site.yaml
│  ├─ navigation.yaml
│  ├─ social.yaml
│  ├─ features.yaml
│  └─ profile.md
│
├─ content/
│  ├─ posts/
│  └─ projects/
│
├─ public/
│  └─ images/
│     ├─ profile/
│     ├─ projects/
│     └─ site/
│
├─ src/
│  ├─ components/
│  ├─ layouts/
│  ├─ pages/
│  ├─ styles/
│  ├─ lib/
│  └─ content.config.ts
│
├─ astro.config.mjs
├─ package.json
└─ .github/
   └─ workflows/
```

현재 저장소 구조가 이미 합리적이라면 무조건 이 구조로 전면 재배치할 필요는 없다. 하지만 사용자가 수정하는 영역과 내부 구현 영역은 명확히 분리되어야 한다.

---

# 3단계: 설정 파일 구성

## 원칙

* 구조화된 짧은 값은 YAML을 사용한다.
* 긴 소개 글과 사람이 작성하는 본문은 Markdown을 사용한다.
* 설정 용도로 MDX를 사용하지 않는다.
* 사용자 설정 파일에서 JavaScript 또는 TypeScript 코드 실행을 요구하지 않는다.
* 비밀값을 설정 파일에 넣지 않는다.
* 설정값은 스키마로 검증한다.
* 설정 오류가 발생하면 가능한 한 이해하기 쉬운 오류 메시지를 제공한다.

## `config/site.yaml`

다음과 같은 사이트 전역 정보를 관리한다.

```yaml
site:
  title: My Blog
  description: A personal blog built with Astro
  url: https://username.github.io
  language: ko
  timezone: Asia/Seoul

author:
  name: Your Name
  displayName: Your Name
  profileImage: /images/profile/profile.webp

branding:
  favicon: /images/site/favicon.svg
  defaultOgImage: /images/site/og-default.webp
```

실제 필드 이름은 현재 코드 구조와 요구사항을 분석해 결정하라. 사용되지 않는 필드를 억지로 추가하지 마라.

## `config/navigation.yaml`

상단 메뉴, 하단 메뉴, 외부 링크와 순서를 관리한다.

예:

```yaml
header:
  - label: Home
    href: /
  - label: Blog
    href: /blog
  - label: Projects
    href: /projects
  - label: About
    href: /about

footer:
  - label: GitHub
    href: https://github.com/username
    external: true
```

컴포넌트에 메뉴 항목을 직접 하드코딩하지 않는다.

## `config/social.yaml`

예:

```yaml
github: https://github.com/username
linkedin:
email:
resume:
```

빈 값은 화면에서 자동으로 숨겨져야 한다.

## `config/features.yaml`

사용자가 기능을 켜거나 끌 수 있도록 한다.

예:

```yaml
search: true
rss: true
sitemap: true
darkMode: true
tableOfContents: true
projects: true
comments: false
```

다만 현재 구현상 안전하게 on/off할 수 없는 기능을 설정 항목으로 노출하지 마라. 설정값이 실제 동작과 일치해야 한다.

## `config/profile.md`

자기소개와 About 페이지처럼 긴 텍스트를 관리한다.

예:

```md
---
title: About Me
subtitle: Developer and writer
---

Write your introduction here.
```

필요하다면 경력, 관심 분야, 현재 활동 등을 frontmatter 또는 본문으로 분리한다.

---

# 4단계: 콘텐츠 구조

설정과 게시물을 혼합하지 않는다.

## 게시물

```text
content/posts/
```

게시물은 Markdown을 기본으로 한다.

현재 약 134개의 실제 게시물은 개인 블로그 저장소에서 그대로 보존한다.

현재 URL과 날짜, slug, 카테고리, 태그가 변경되지 않도록 주의한다.

필요하다면 frontmatter 스키마를 정리하되, 대규모 자동 수정 전에는 반드시 호환성을 확인한다.

예상 필드:

```yaml
---
title:
description:
publishedAt:
updatedAt:
slug:
categories:
tags:
draft:
image:
---
```

기존 게시물의 필드가 이와 다르다면 현재 데이터를 무리하게 전부 바꾸지 말고 호환 계층을 고려한다.

## 프로젝트

```text
content/projects/
```

프로젝트 정보를 컴포넌트 내부 배열로 하드코딩하지 않는다.

예:

```md
---
title: Example Project
description: Short project description
repository: https://github.com/username/project
demo:
image: /images/projects/example.webp
tags:
  - Astro
  - TypeScript
featured: true
order: 1
---

Write a longer project description here.
```

---

# 5단계: 내부 코드와 설정 연결

사용자 설정 파일을 읽는 코드는 내부에 유지한다.

다음 파일들은 사용자가 수정하지 않아도 된다.

```text
astro.config.mjs
src/content.config.ts
src/lib/config/*
package.json
.github/workflows/deploy.yml
```

## 내부 설정 로더

가능하면 설정 파일을 읽고 검증하는 코드를 한곳에 모은다.

예:

```text
src/lib/config/
  loadSiteConfig.ts
  schema.ts
  types.ts
```

여러 컴포넌트가 YAML을 각각 직접 읽게 하지 말고, 검증된 설정 객체를 공통으로 사용한다.

## 스키마 검증

다음 오류를 빌드 단계에서 감지할 수 있어야 한다.

* 필수 사이트 제목 누락
* 잘못된 URL
* 존재하지 않는 이미지 경로
* 지원하지 않는 언어 코드
* 잘못된 navigation 구조
* 잘못된 날짜
* 프로젝트 repository URL 오류
* 중복된 slug
* 필수 frontmatter 누락

모든 이미지 파일 존재 여부까지 검증하는 것이 지나치게 복잡하다면 필수 작업으로 만들지는 말되, 최소한 문자열 형식과 URL 형식은 검증한다.

---

# 6단계: Astro 설정 추상화

`astro.config.mjs`는 내부 파일로 유지한다.

단, 사용자가 사이트 URL이나 기본 설정을 바꾸기 위해 `astro.config.mjs`를 수정할 필요가 없어야 한다.

예를 들어 `config/site.yaml`의 URL을 내부에서 읽어 Astro의 `site` 값에 사용한다.

사용자는 다음만 수정한다.

```yaml
site:
  url: https://username.github.io
```

그리고 내부 코드가 이를 자동으로 적용한다.

다음 값도 가능한 범위에서 사용자 설정과 연결한다.

* site URL
* locale
* trailing slash 정책
* sitemap 기준 URL
* RSS 기준 URL
* canonical URL
* JSON-LD 사이트 URL
* Open Graph 기본값

Astro 내부 설정과 콘텐츠의 URL 생성 로직이 서로 다른 값을 사용하지 않도록 단일 출처를 만든다.

---

# 7단계: 배포 자동화

템플릿 사용자는 `.github/workflows/deploy.yml`을 직접 수정하지 않아야 한다.

다음 사용 흐름을 목표로 한다.

1. GitHub에서 `Use this template` 클릭
2. 새 저장소 생성
3. `config/` 수정
4. `content/` 수정
5. `public/images/` 이미지 교체
6. GitHub Pages 활성화
7. push
8. 자동 빌드 및 배포

GitHub Pages가 저장소 설정에서 한 번의 수동 활성화를 요구한다면 README에 정확한 UI 절차를 설명한다.

배포 워크플로는 다음을 만족해야 한다.

* npm 의존성 설치
* Astro check 또는 이에 준하는 검증
* production build
* GitHub Pages artifact 생성
* Pages 배포
* 기본 브랜치 push 시 실행
* pull request에서 최소 빌드 검증
* 권한은 최소한으로 설정
* 가능한 경우 GitHub Actions 버전을 고정된 commit SHA로 사용
* 불필요한 write permission을 부여하지 않음

기존 배포가 정상 작동 중이라면 무조건 새 워크플로로 교체하지 말고, 현재 방식에서 사용자 수정이 필요한 부분이 있는지 먼저 확인한다.

---

# 8단계: 마이그레이션 흔적 정리

현재 블로그의 Jekyll→Astro 마이그레이션 흔적을 정리한다.

## 제거 후보

* 더 이상 실행하지 않는 일회성 변환 스크립트
* Jekyll 전용 설정
* 사용하지 않는 Gem 관련 파일
* 중복된 빌드 설정
* 임시 마이그레이션 문서
* 사용하지 않는 이전 테마 파일
* 참조되지 않는 이전 asset
* 오래된 테스트 출력
* 임시 검사 로그
* 사용하지 않는 변환 데이터

## 유지 후보

* legacy URL redirect
* 이전 permalink 호환 코드
* 기존 slug 처리
* 과거 이미지 경로 호환
* 기존 RSS URL 호환
* 카테고리 URL 호환
* 외부 링크가 존재하는 페이지
* 현재 빌드 또는 배포에서 사용되는 검증 스크립트

기능적으로 필요한 마이그레이션 코드는 이름과 위치를 정리할 수 있다.

예를 들어 `migrationHack.ts`처럼 임시 이름이라면 실제 역할에 맞게 다음과 같이 바꿀 수 있다.

```text
legacyRoutes.ts
legacySlug.ts
redirects.ts
```

마이그레이션 흔적을 무조건 숨기거나 삭제하는 것이 목표가 아니다. 현재 제품 코드로서 의미가 있는 것과 일회성 찌꺼기를 구분하는 것이 목표다.

---

# 9단계: 기존 기능 보존

리팩터링 과정에서 현재 블로그의 기능을 손상시키지 마라.

현재 저장소에 존재하는 기능을 먼저 조사하고, 최소한 다음 항목을 확인한다.

* 기존 게시물 렌더링
* 기존 URL
* 카테고리 페이지
* 아카이브 페이지
* 태그 페이지
* 검색
* Pagefind
* RSS
* sitemap
* robots.txt
* JSON-LD
* Open Graph
* canonical URL
* 다크 모드
* 코드 하이라이팅
* 목차
* 모바일 레이아웃
* 404 페이지
* GitHub Pages 배포
* 기존 정적 asset 경로

현재 구현되어 있지 않은 기능을 이번 작업에서 억지로 추가하지 마라.

이번 작업의 우선순위는 기능 추가가 아니라 다음이다.

1. 구조 정리
2. 하드코딩 제거
3. 사용자 설정 추상화
4. 기존 기능 보존
5. 템플릿 추출
6. 문서화

---

# 10단계: 개인 블로그 검증

템플릿 저장소를 만들기 전에 현재 개인 블로그에서 다음을 확인한다.

필수 명령은 현재 package script에 맞게 조정한다.

예:

```bash
npm ci
npm run check
npm run test
npm run build
```

테스트 명령이 없다면 억지로 복잡한 테스트 프레임워크를 추가할 필요는 없다. 대신 다음 검증을 수행한다.

* production build 성공
* 주요 페이지 렌더링
* 게시물 수가 예상과 크게 달라지지 않음
* 주요 기존 URL 생성
* RSS 생성
* sitemap 생성
* 검색 인덱스 생성
* broken internal link 검사
* 설정 파일 누락 시 명확한 오류
* 개인 정보가 설정 파일을 통해 출력됨
* 컴포넌트에 개인 정보가 남아 있지 않음

가능하면 리팩터링 전후에 생성되는 주요 URL 목록을 비교한다.

특히 기존 게시물의 permalink가 바뀌지 않았는지 확인한다.

---

# 11단계: 템플릿 저장소 추출

현재 개인 블로그의 리팩터링과 검증이 끝난 후 별도의 템플릿 저장소를 만든다.

## 중요한 Git 원칙

현재 개인 블로그 저장소를 일반 `git clone`한 뒤 게시물과 개인정보만 삭제하여 템플릿 저장소로 만들지 마라.

그렇게 하면 과거 Git 이력에 내 실제 개인정보, 게시물, 이미지와 설정이 남는다.

템플릿 저장소는 현재 개인 블로그의 최신 작업 트리만 복사하고, 기존 `.git` 이력은 포함하지 않아야 한다.

예시 방식:

```bash
rsync -av \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.astro' \
  noir1458.github.io/ \
  <TEMPLATE_REPOSITORY_NAME>/
```

그 후:

```bash
cd <TEMPLATE_REPOSITORY_NAME>
git init
```

다른 안전한 방법을 사용해도 되지만, 결과적으로 기존 Git 이력이 템플릿 저장소에 포함되지 않아야 한다.

현재 개인 블로그 저장소의 Git 이력을 재작성하거나 force push하지 마라.

---

# 12단계: 템플릿 개인정보 제거

새 템플릿 디렉터리에서 다음을 모두 일반 예시값으로 교체한다.

* 실제 이름
* GitHub 사용자명
* 개인 이메일
* 개인 프로필 이미지
* 개인 SNS 링크
* 개인 도메인
* 실제 이력서
* 실제 프로젝트
* 실제 Analytics ID
* 실제 댓글 서비스 설정
* 실제 사이트 검증 코드
* 실제 canonical URL
* 실제 OG 이미지
* 실제 favicon
* 개인 저작권 문구
* 개인 JSON-LD 정보
* 실제 게시물
* 게시물 안에 포함된 개인정보
* 개인 이미지
* 개인 첨부 파일

전체 저장소에서 다음 문자열을 검색하여 개인정보 잔존 여부를 확인한다.

* 실제 이름
* `noir1458`
* 기존 GitHub Pages URL
* 실제 이메일
* 실제 도메인
* 개인 프로젝트 고유명
* 개인 이미지 파일명

단, 템플릿 제작자나 원본 프로젝트 저작권 표기가 필요한 경우 LICENSE와 README의 크레딧은 별도로 판단한다. 설정 예제나 사이트 화면에서 개인 정보가 노출되어서는 안 된다.

---

# 13단계: 예제 콘텐츠 제공

템플릿을 완전히 빈 사이트로 만들지 마라.

초보자가 구조를 이해할 수 있도록 최소한의 예제 콘텐츠를 제공한다.

예:

```text
content/
├─ posts/
│  ├─ welcome.md
│  └─ markdown-guide.md
└─ projects/
   └─ example-project.md
```

예제 콘텐츠에는 다음을 보여준다.

* 제목
* 설명
* 날짜
* 태그
* 카테고리
* 대표 이미지
* 코드 블록
* 내부 링크
* 외부 링크
* 프로젝트 repository 링크
* draft 사용법

예제 내용은 짧고 일반적이어야 한다. 내 실제 글을 부분적으로 남겨두지 마라.

프로필 이미지와 OG 이미지는 저작권 문제가 없는 단순 placeholder 또는 직접 생성한 기본 asset을 사용한다.

---

# 14단계: 템플릿 문서화

## 루트 `README.md`

템플릿 저장소의 README는 사용자 관점에서 작성한다.

README 상단에는 다음을 명확하게 표시한다.

> You only need to edit `config/`, `content/`, and `public/images/`.

README에 포함할 내용:

1. 템플릿 소개
2. 주요 화면 스크린샷
3. 주요 기능
4. 요구 환경
5. `Use this template` 사용법
6. 로컬 실행 방법
7. 사이트 기본 설정 방법
8. 프로필 수정 방법
9. 메뉴 수정 방법
10. 게시물 추가 방법
11. 프로젝트 추가 방법
12. 이미지 교체 방법
13. GitHub Pages 배포 방법
14. 커스텀 도메인 사용 방법
15. 설정 오류 해결 방법
16. 비밀값 관리 주의사항
17. 라이선스
18. 원본 프로젝트 또는 제작자 정보

사용자에게 `package.json`, `astro.config.mjs`, `deploy.yml`을 수정하라고 안내하지 마라.

단, 고급 사용자가 내부 구조를 수정할 수 있다는 사실은 별도의 Advanced customization 섹션에서 짧게 언급할 수 있다.

## `config/README.md`

루트 README보다 더 짧고 직접적으로 작성한다.

예:

```md
# Customize your site

Most users only need to edit this folder.

1. Edit `site.yaml`.
2. Edit `navigation.yaml`.
3. Add your links to `social.yaml`.
4. Enable or disable features in `features.yaml`.
5. Write your introduction in `profile.md`.

Do not put API keys or secrets in this folder.
```

## 예제 파일 주석

YAML에 과도한 주석을 넣어 가독성을 해치지 말되, 초보자가 이해하기 어려운 필드에는 간단한 주석이나 문서를 제공한다.

---

# 15단계: 템플릿 초기 사용 흐름 검증

새 템플릿 저장소가 완성되면 완전히 새로운 사용자 관점에서 검증한다.

가능하면 별도의 임시 디렉터리에서 템플릿을 새로 복사한 것처럼 테스트한다.

검증 절차:

1. 깨끗한 디렉터리에 템플릿 복사
2. 의존성 설치
3. 아무것도 수정하지 않은 상태에서 개발 서버 실행
4. production build
5. 예제 사이트 확인
6. `config/site.yaml`에서 사이트 이름 변경
7. `config/profile.md`에서 소개 변경
8. `config/navigation.yaml`에서 메뉴 변경
9. 새 게시물 Markdown 하나 추가
10. 새 프로젝트 Markdown 하나 추가
11. 프로필 이미지 교체
12. 다시 build
13. 출력 결과 확인

이 과정에서 사용자가 다음 파일을 수정할 필요가 없어야 한다.

```text
astro.config.mjs
package.json
src/content.config.ts
.github/workflows/deploy.yml
```

---

# 16단계: 설정 오류 경험 개선

초보자용 템플릿이므로 설정을 잘못 입력했을 때 원인을 찾기 쉬워야 한다.

예:

* `site.url`이 URL 형식이 아닐 때
* 메뉴의 `href`가 누락되었을 때
* 프로젝트 제목이 없을 때
* 게시물 날짜가 잘못되었을 때
* YAML 들여쓰기가 깨졌을 때
* 같은 slug가 두 번 사용되었을 때

가능한 경우 일반적인 파서 오류를 그대로 노출하는 대신 어떤 파일과 필드가 잘못되었는지 알 수 있도록 한다.

다만 오류 처리 시스템을 과도하게 복잡하게 만들지는 마라.

---

# 17단계: 보안 요구사항

Markdown 또는 YAML을 설정에 사용하는 것 자체는 문제가 아니다. 다음 원칙을 지킨다.

* API token을 `config/`에 저장하지 않음
* 비밀값을 공개 저장소에 커밋하지 않음
* 필요한 비밀값은 GitHub Actions Secrets 또는 환경변수 사용
* `.env.example`에는 예제 키 이름만 제공
* 사용자 설정용으로 MDX 사용하지 않음
* 임의 JavaScript 실행을 설정 기능으로 제공하지 않음
* 외부 사용자 입력 Markdown을 그대로 렌더링하는 기능 추가 금지
* `set:html` 또는 유사 기능을 불필요하게 사용하지 않음
* 외부 URL은 가능한 범위에서 검증
* GitHub Actions permission 최소화
* 사용하지 않는 dependency 제거
* 기존 dependency를 임의로 대규모 업그레이드하지 않음
* dependency 변경 시 build 결과를 검증

---

# 18단계: SEO와 메타데이터

하드코딩된 개인 정보가 SEO 관련 코드에 남지 않도록 한다.

다음 값은 설정에서 생성되어야 한다.

* page title
* site title
* description
* canonical URL
* Open Graph title
* Open Graph description
* Open Graph image
* Twitter card
* JSON-LD author
* JSON-LD site URL
* RSS title
* RSS description
* sitemap site URL
* footer copyright

페이지별 메타데이터가 존재하는 경우 사이트 기본값보다 우선하도록 한다.

현재 SEO 구현이 이미 안정적이라면 구조만 일반화하고 동작은 변경하지 않는다.

---

# 19단계: 다국어 확장 가능성

이번 작업에서 완전한 다국어 블로그를 새로 구현하는 것은 필수 목표가 아니다.

다만 최소한 다음 값은 하드코딩하지 않는다.

* 기본 locale
* HTML `lang`
* 날짜 형식
* 시간대
* 메뉴 라벨
* 사이트 설명

한국어, 영어, 일본어 등 다른 언어로 확장할 때 전체 컴포넌트를 다시 수정하지 않아도 되는 구조를 선호한다.

다국어 라우팅이나 번역 시스템까지 도입하면 작업 규모가 지나치게 커지는 경우, 이번 범위에서는 설정 구조만 준비한다.

---

# 20단계: 불필요한 과설계 금지

다음 구조는 현재 단계에서 도입하지 않는다.

* 템플릿 코어를 별도 npm 패키지로 배포
* 개인 블로그와 템플릿을 monorepo로 통합
* Git submodule 사용
* 복잡한 upstream 자동 동기화
* 자체 CMS 구현
* 관리자 페이지 구현
* 데이터베이스 도입
* 서버 백엔드 도입
* 사용자 계정 시스템
* 템플릿 전용 CLI를 새로 제작
* 블로그 테마 마켓 시스템
* 불필요한 상태 관리 라이브러리
* 디자인 시스템 전면 재구축

현재 개인 블로그와 템플릿 저장소는 별도 저장소로 유지한다.

향후 개인 블로그에서 중요한 기능을 개선하면 필요한 변경을 템플릿 저장소에 수동으로 반영하는 것으로 충분하다.

---

# 21단계: 디자인 관련 제한

현재 디자인은 대체로 만족스럽기 때문에 디자인을 전면 변경하지 마라.

허용되는 변경:

* 설정 분리를 위해 필요한 컴포넌트 수정
* 재사용성을 높이기 위한 소규모 구조 변경
* 하드코딩 제거
* 접근성 개선
* 명백한 반응형 오류 수정
* 템플릿 예제 데이터에 맞춘 placeholder 적용
* 코드 중복 제거
* 사용하지 않는 스타일 제거

피해야 할 변경:

* 전체 색상 체계 변경
* 레이아웃 전면 교체
* 새로운 UI 프레임워크 도입
* 기존 디자인 정체성 제거
* 불필요한 애니메이션 추가
* 사용자가 요청하지 않은 대규모 리브랜딩

---

# 22단계: 커밋 전략

가능하면 작업을 하나의 거대한 커밋으로 만들지 않는다.

권장 커밋 구분:

1. 현재 저장소 감사 및 불필요 파일 정리
2. 사용자 설정 파일 및 설정 로더 추가
3. 하드코딩된 사이트 정보 설정으로 이동
4. navigation, social, profile 설정 분리
5. 프로젝트 콘텐츠 분리
6. 기존 URL 및 SEO 호환 검증
7. 사용자 문서 작성
8. 템플릿용 깨끗한 작업 트리 생성
9. 개인정보 제거 및 예제 콘텐츠 추가
10. 템플릿 README와 배포 설정 완성
11. 최종 build 및 링크 검증

각 커밋은 build 가능한 상태를 유지하는 것을 우선한다.

기존 저장소에서 force push, rebase를 통한 공개 이력 재작성, 대규모 파일 삭제를 임의로 수행하지 않는다.

---

# 23단계: 작업 보고

작업이 끝나면 다음 내용을 보고한다.

## 현재 개인 블로그

* 새로 추가된 설정 파일
* 코드에서 제거한 하드코딩 값
* 이동한 콘텐츠
* 삭제한 마이그레이션 파일
* 유지한 legacy 호환 코드와 이유
* 변경된 폴더 구조
* 실행한 검증 명령
* build 결과
* 기존 URL 보존 확인 결과
* 남아 있는 기술 부채

## 템플릿 저장소

* 템플릿 디렉터리 또는 저장소 경로
* 개인정보 제거 확인 결과
* 포함된 예제 콘텐츠
* 사용자가 수정해야 하는 파일
* GitHub Pages 배포 방법
* 검증 결과
* 아직 수동으로 해야 하는 작업
* GitHub Template Repository 활성화 여부

## 개인정보 검사

다음이 남아 있지 않은지 명시한다.

* 실제 이름
* 실제 이메일
* 개인 GitHub 사용자명
* 개인 URL
* 실제 게시물
* 실제 프로필 이미지
* 실제 Analytics 설정
* 개인 프로젝트 정보

---

# 완료 조건

다음 조건을 모두 만족해야 작업 완료로 판단한다.

## 개인 블로그

* 기존 개인 블로그가 정상적으로 build된다.
* 기존 게시물이 유지된다.
* 기존 주요 URL이 유지된다.
* 현재 디자인과 기능이 유지된다.
* 개인정보가 컴포넌트에 하드코딩되어 있지 않다.
* 사용자 설정이 루트 `config/`에 모여 있다.
* 게시물과 프로젝트가 명확한 콘텐츠 디렉터리에 있다.
* 불필요한 마이그레이션 파일이 제거되었다.
* 필요한 legacy 호환 기능은 유지되었다.
* GitHub Pages 배포가 정상 작동한다.

## 템플릿

* 기존 개인 블로그의 Git 이력이 포함되지 않는다.
* 개인정보가 포함되지 않는다.
* 예제 게시물과 프로젝트가 포함된다.
* 기본 상태에서 build된다.
* 사용자가 `config/`, `content/`, `public/images/`만 수정하여 사용할 수 있다.
* 사용자가 `mjs`, `ts`, `package.json`, `deploy.yml`을 수정할 필요가 없다.
* GitHub Pages 배포가 준비되어 있다.
* README만 보고 초보자도 설정할 수 있다.
* 비밀값을 저장소에 넣지 않도록 안내한다.
* 저장소를 GitHub Template Repository로 사용할 수 있다.

---

# 작업 진행 방식

먼저 현재 저장소를 충분히 조사한 뒤 수정 계획을 작성하라.

초기 조사 없이 전체 구조를 추측하여 다시 작성하지 마라.

현재 구현에서 잘 작동하는 부분은 최대한 재사용한다.

각 단계에서 다음을 반복한다.

1. 현재 구조 확인
2. 최소 범위 수정
3. lint 또는 type check
4. production build
5. 주요 페이지 확인
6. 다음 단계 진행

작업 도중 예상과 다른 구조를 발견하면 임의로 기능을 삭제하지 말고, 현재 동작을 보존하는 방향으로 설계를 조정한다.

최종 목표는 단순히 개인 블로그에서 개인정보를 지운 복제본을 만드는 것이 아니다.

다음 상태를 만드는 것이 목표다.

> 실제로 운영 중인 개인 블로그를 설정 기반 구조로 일반화하고, 그 검증된 최신 코드에서 개인정보와 콘텐츠를 안전하게 제거하여 초보자도 사용할 수 있는 독립적인 Astro 블로그 템플릿으로 배포한다.
