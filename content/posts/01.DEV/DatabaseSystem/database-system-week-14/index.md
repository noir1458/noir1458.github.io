---
title: 'Database System 14주차 정리'
slug: database-system-week-14
description: '14주차 수업 데이터베이스 복구와 체크포인트'
publishedAt: '2025-06-04'
categories: DatabaseSystem
math: false
---
## 학습 범위

- 로그 기반 복구와 undo·redo
- checkpoint를 이용한 복구 범위 결정
- 데이터베이스 장애 유형과 복구 알고리즘

## 14주차1st ch19

![Database System 14주차 수업 자료 1](./database-system-week-14-001.webp)

트랜잭션의 commit log가 stable storage에 기록되면 그 트랜잭션은 commit되었다고 본다. 트랜잭션이 변경한 데이터 블록은 아직 메모리 버퍼에 남아있다가 commit 이후에 디스크로 내려갈수도 있다.

![Database System 14주차 수업 자료 2](./database-system-week-14-002.webp)

![Database System 14주차 수업 자료 3](./database-system-week-14-003.webp)

![Database System 14주차 수업 자료 4](./database-system-week-14-004.webp)

immediate database modification에서는 트랜잭션이 commit하기 전에도 변경된 데이터 블록이 디스크에 기록될수 있다. 대신 실제 데이터보다 먼저 `<Ti, X, 이전값, 새값>` 형태의 log record를 stable storage에 남겨야 한다.

장애가 나면 이 로그의 이전값으로 미완료 트랜잭션을 undo하고, 새값으로 완료된 트랜잭션을 redo할수 있다. 데이터 페이지가 언제 디스크에 출력되었는지 알수 없어도 로그만으로 올바른 상태를 다시 만들기 위한 것이다.

![Database System 14주차 수업 자료 5](./database-system-week-14-005.webp)

![Database System 14주차 수업 자료 6](./database-system-week-14-006.webp)

로그에 `<Ti, start>`는 있지만 commit이나 abort가 없다면 장애시점에 끝나지 않은 트랜잭션이므로 undo 대상이다. start와 commit 또는 abort가 모두 있는 트랜잭션은 로그에 기록된 최종 결과가 데이터베이스에 반영되도록 redo한다.

![Database System 14주차 수업 자료 7](./database-system-week-14-007.webp)

![Database System 14주차 수업 자료 8](./database-system-week-14-008.webp)

![Database System 14주차 수업 자료 9](./database-system-week-14-009.webp)

![Database System 14주차 수업 자료 10](./database-system-week-14-010.webp)

![Database System 14주차 수업 자료 11](./database-system-week-14-011.webp)

![Database System 14주차 수업 자료 12](./database-system-week-14-012.webp)

![Database System 14주차 수업 자료 13](./database-system-week-14-013.webp)

![Database System 14주차 수업 자료 14](./database-system-week-14-014.webp)

![Database System 14주차 수업 자료 15](./database-system-week-14-015.webp)

### 연습문제

![Database System 14주차 수업 자료 16](./database-system-week-14-016.webp)

![Database System 14주차 수업 자료 17](./database-system-week-14-017.webp)

첫번째 장애시점에는 T0가 commit하지 않았으므로 T0를 undo해서 A=1000, B=2000으로 되돌린다. 두번째는 T0를 redo하고 미완료된 T1을 undo해서 A=950, B=2050, C=700이 된다. 세번째처럼 두 트랜잭션이 모두 commit했다면 T0와 T1을 redo해서 C까지 600으로 만든다.

## 14주차2nd ch19

### checkpoint

![Database System 14주차 수업 자료 18](./database-system-week-14-018.webp)

시스템이 오래 실행되면 장애복구할때 처음부터 로그 전체를 읽는 비용이 너무 커진다. 이미 디스크에 반영된 오래된 트랜잭션까지 불필요하게 redo할수도 있으므로, 주기적으로 복구의 시작점이 되는 checkpoint를 만든다.

![Database System 14주차 수업 자료 19](./database-system-week-14-019.webp)

![Database System 14주차 수업 자료 20](./database-system-week-14-020.webp)

![Database System 14주차 수업 자료 21](./database-system-week-14-021.webp)

![Database System 14주차 수업 자료 22](./database-system-week-14-022.webp)

checkpoint를 만들때는 메모리에 있는 로그 레코드를 stable storage에 내리고, 수정된 버퍼 블록을 디스크에 출력한다. 그다음 당시 실행중인 트랜잭션 목록 L과 함께 `<checkpoint L>`을 로그에 기록한다. 이 작업중에는 갱신을 잠시 멈춘다.

![Database System 14주차 수업 자료 23](./database-system-week-14-023.webp)

![Database System 14주차 수업 자료 24](./database-system-week-14-024.webp)

![Database System 14주차 수업 자료 25](./database-system-week-14-025.webp)

![Database System 14주차 수업 자료 26](./database-system-week-14-026.webp)

![Database System 14주차 수업 자료 27](./database-system-week-14-027.webp)

복구할때는 로그 끝에서 가장 최근 checkpoint를 찾는다. checkpoint 전에 끝나서 결과가 이미 디스크에 출력된 T1은 무시할수 있고, commit한 T2와 T3는 redo하며 장애시점까지 끝나지 않은 T4는 undo한다.

checkpoint 당시 실행중이었거나 그 이후 시작한 트랜잭션만 조사하면 되므로, 로그의 앞부분 전부를 다시 처리하지 않아도 된다.

### 연습문제

![Database System 14주차 수업 자료 28](./database-system-week-14-028.webp)

그림처럼 checkpoint의 실행중 목록과 그 이후의 start, commit 기록을 따라가면 redo-list와 undo-list를 구할수 있다. commit된 트랜잭션은 redo-list에, 시작했지만 끝나지 않은 트랜잭션은 undo-list에 들어간다.

### 복구 알고리즘

![Database System 14주차 수업 자료 29](./database-system-week-14-029.webp)

![Database System 14주차 수업 자료 30](./database-system-week-14-030.webp)

기본 복구 알고리즘은 먼저 최근 checkpoint부터 로그를 확인해서 redo-list와 undo-list를 만든다. redo 단계에서는 로그를 앞방향으로 읽으며 완료된 트랜잭션의 새값을 다시 쓰고, undo 단계에서는 로그를 끝에서부터 역방향으로 읽으며 미완료 트랜잭션의 이전값을 복원한다.

### Undo 단계

![Database System 14주차 수업 자료 31](./database-system-week-14-031.webp)

undo-list에 있는 트랜잭션의 갱신 로그를 뒤에서부터 만나면 이전값을 데이터 항목에 쓰고, 그 복구 작업도 로그에 남긴다. 해당 트랜잭션의 start 기록까지 도달하면 abort 기록을 쓰고 undo-list에서 제거한다. undo-list가 비면 복구가 끝나고 정상적인 트랜잭션 처리를 다시 시작할수 있다.
