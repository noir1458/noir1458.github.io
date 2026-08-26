---
title: Astro Personal Blog Template
description: 설정과 Markdown만으로 운영할 수 있도록 만든 Astro 기반 개인 블로그 템플릿입니다.
repository: https://github.com/noir1458/astro_blog_template
demo: https://noir1458.github.io
image: ./cover.png
tags:
  - Astro
  - TypeScript
  - Markdown
  - GitHub Pages
featured: true
order: 1
draft: false
---

## 프로젝트 소개

여러 블로그 템플릿을 사용해봤지만 개인 기록이나 공부 기록 등 사용 목적에 부적합한 템플릿이 많았습니다. 티스토리나 블로거 등 다른 플랫폼을 사용하지 않고 컴퓨터공학 전공 관련 기록은 깃허브 페이지에서 진행하고 싶다는 생각에 꽤 긴 시간동안 깃허브 페이지 이용을 시도하다가 제작하게 된 블로그 템플릿 입니다.

Astro Personal Blog Template은 블로그 운영에 필요한 설정과 콘텐츠를 구현 코드에서 분리한 개인 블로그 템플릿입니다. 사이트 정보와 메뉴는 `config/`, 글과 프로젝트는 `content/`, 교체 가능한 이미지는 `public/images/`에서 관리할 수 있습니다.

Astro나 TypeScript 파일을 직접 수정하지 않아도 사이트의 기본 정보부터 글 작성, 프로젝트 소개, 배포까지 이어갈 수 있도록 구성했습니다. 현재 이 블로그도 템플릿의 구조와 기능을 실제로 사용하고 있습니다.

## 주요 기능

- 반응형 레이아웃과 라이트·다크 모드
- Markdown 기반 글, 카테고리, 태그, 초안 및 페이지네이션
- 수식, Mermaid 다이어그램과 코드 하이라이팅
- Pagefind를 이용한 정적 검색
- RSS, sitemap, robots.txt와 SEO 메타데이터
- 한국어·영어·일본어 번역 경로
- 선택적으로 활성화할 수 있는 프로젝트와 Giscus 댓글
- GitHub Actions 검증 및 GitHub Pages 자동 배포

## 설계 방향

블로그를 운영하는 사람이 자주 다루는 영역을 세 곳으로 제한했습니다.

| 경로 | 용도 |
| --- | --- |
| `config/` | 사이트 정보, 탐색 메뉴, 카테고리, 소셜 링크와 기능 설정 |
| `content/` | Markdown 게시물과 프로젝트 콘텐츠 |
| `public/images/` | 프로필과 사이트 공용 이미지 |

설정과 콘텐츠는 빌드 과정에서 검증합니다. 잘못된 URL이나 날짜, 중복된 글 주소, 존재하지 않는 이미지처럼 배포 후 발견하기 쉬운 문제를 미리 확인할 수 있습니다. 공개된 글의 URL을 안정적으로 유지하면서 검색, 아카이브, RSS와 sitemap 같은 파생 페이지도 함께 생성합니다.


## 링크

- [GitHub 저장소](https://github.com/noir1458/astro_blog_template)
- [실제 적용 블로그](https://noir1458.github.io)
