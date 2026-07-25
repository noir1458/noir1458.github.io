---
title: 5. 트랜잭션과 동시성 제어
slug: transaction
publishedAt: '2025-12-05'
categories: database
math: false
---

## 트랜잭션 (Transaction)

**트랜잭션**은 데이터베이스의 상태를 변환시키는 하나의 논리적 작업 단위이다. 하나 이상의 SQL 문으로 구성되며, 전부 수행되거나 전부 수행되지 않아야 한다 (All or Nothing).

### ACID 속성

```
1. 원자성 (Atomicity)
   - 트랜잭션의 연산은 전부 반영되거나 전부 취소
   - 중간 상태는 없음
   - 보장 방법: 회복 시스템 (Undo/Redo)

2. 일관성 (Consistency)
   - 트랜잭션 수행 전후로 DB의 일관성 유지
   - 무결성 제약 조건을 항상 만족
   - 예: 계좌 이체 → 두 계좌 합계는 불변

3. 격리성 (Isolation)
   - 동시에 실행되는 트랜잭션은 서로 영향을 주지 않음
   - 각 트랜잭션은 혼자 실행되는 것처럼 동작
   - 보장 방법: 동시성 제어 (Locking, MVCC)

4. 지속성 (Durability)
   - 성공적으로 완료된 트랜잭션의 결과는 영구 반영
   - 시스템 장애 이후에도 결과가 보존
   - 보장 방법: 로그 기반 회복
```

### 트랜잭션 상태

```
          ┌──────────────────────────────┐
          ↓                              │
[활동] → [부분 완료] → [완료]             │
(Active)  (Partially    (Committed)      │
          Committed)                     │
  │                                      │
  ↓                                      │
[실패] ──────────────→ [철회]             │
(Failed)               (Aborted) ───────┘
                         (Rollback 후 재시작 또는 종료)

활동(Active): 트랜잭션이 실행 중
부분 완료(Partially Committed): 마지막 연산 실행 후 커밋 대기
완료(Committed): COMMIT 후 결과 영구 반영
실패(Failed): 오류 발생으로 정상 수행 불가
철회(Aborted): ROLLBACK 후 트랜잭션 시작 전 상태로 복원
```

### 트랜잭션 SQL

```sql
-- 트랜잭션 시작
BEGIN TRANSACTION;  -- 또는 START TRANSACTION

-- 계좌 이체 예시
UPDATE Account SET balance = balance - 10000 WHERE id = 'A';
UPDATE Account SET balance = balance + 10000 WHERE id = 'B';

-- 성공 시
COMMIT;

-- 실패 시
ROLLBACK;

-- SAVEPOINT
BEGIN TRANSACTION;
UPDATE Account SET balance = balance - 5000 WHERE id = 'A';
SAVEPOINT sp1;
UPDATE Account SET balance = balance + 5000 WHERE id = 'B';
-- B 계좌 업데이트에 문제 발생
ROLLBACK TO sp1;  -- sp1까지만 롤백
-- 다른 처리...
COMMIT;
```

## 동시성 문제

여러 트랜잭션이 동시에 실행될 때 발생할 수 있는 문제.

### 문제 유형

```
1. 갱신 분실 (Lost Update)
   T1: Read(X) → X = X + 1 → Write(X)
   T2: Read(X) → X = X + 2 → Write(X)

   T1이 X를 읽고 수정하기 전에 T2도 X를 읽으면
   T1의 갱신이 T2에 의해 덮어씌워져 소실

2. 비완료 읽기 / 오손 읽기 (Dirty Read)
   T1: Write(X) → (아직 COMMIT 안 함)
   T2: Read(X)  → T1이 ROLLBACK

   T2가 읽은 값은 존재하지 않는 값
   커밋되지 않은 데이터를 읽음

3. 비반복 읽기 (Non-Repeatable Read)
   T1: Read(X) → ... → Read(X)  (값이 다름)
   T2:          Write(X), COMMIT

   같은 트랜잭션 내에서 같은 데이터를 두 번 읽었는데 값이 다름

4. 팬텀 읽기 (Phantom Read)
   T1: SELECT COUNT(*) WHERE dept='CS' → 10
   T2: INSERT INTO Student ... WHERE dept='CS', COMMIT
   T1: SELECT COUNT(*) WHERE dept='CS' → 11

   같은 조건으로 조회했는데 행의 수가 달라짐 (새 행 삽입/삭제)
```

## 격리 수준 (Isolation Level)

### 4단계 격리 수준

```
          Dirty Read  Non-Repeatable  Phantom Read
                         Read
Level 0: READ UNCOMMITTED   O           O              O
Level 1: READ COMMITTED     X           O              O
Level 2: REPEATABLE READ    X           X              O
Level 3: SERIALIZABLE       X           X              X

O = 발생 가능, X = 방지

높은 격리 수준:
  ✅ 데이터 일관성 높음
  ❌ 동시성(성능) 낮음

낮은 격리 수준:
  ✅ 동시성(성능) 높음
  ❌ 데이터 이상 현상 발생 가능
```

```sql
-- 격리 수준 설정
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

### 각 격리 수준 설명

```
READ UNCOMMITTED (Level 0)
  - 커밋되지 않은 데이터도 읽을 수 있음
  - 가장 빠르지만 가장 위험
  - 거의 사용하지 않음

READ COMMITTED (Level 1)
  - 커밋된 데이터만 읽음
  - Oracle, PostgreSQL 기본값
  - Non-Repeatable Read 가능

REPEATABLE READ (Level 2)
  - 트랜잭션 시작 시점의 스냅샷 읽음
  - MySQL InnoDB 기본값
  - Phantom Read 가능 (MySQL은 Gap Lock으로 방지)

SERIALIZABLE (Level 3)
  - 완전한 직렬 실행과 동일한 결과 보장
  - 성능이 가장 낮음
  - 데이터 정합성이 절대적으로 중요한 경우
```

## Locking (잠금)

### Lock의 종류

```
1. 공유 락 (Shared Lock, S-Lock)
   - 읽기 연산에 사용
   - 여러 트랜잭션이 동시에 S-Lock 획득 가능
   - S-Lock이 걸린 데이터에 X-Lock 불가

2. 배타 락 (Exclusive Lock, X-Lock)
   - 쓰기 연산에 사용
   - 하나의 트랜잭션만 획득 가능
   - X-Lock이 걸린 데이터에 S-Lock, X-Lock 모두 불가
```

### Lock 호환성 행렬

```
         기존 Lock
         S-Lock   X-Lock
요청 S    ✅ 허용   ❌ 대기
     X    ❌ 대기   ❌ 대기

S-S: 호환 (동시 읽기 가능)
S-X: 비호환 (읽기 중 쓰기 불가)
X-S: 비호환 (쓰기 중 읽기 불가)
X-X: 비호환 (동시 쓰기 불가)
```

### 2단계 잠금 규약 (2PL: Two-Phase Locking)

```
트랜잭션의 잠금을 2단계로 나눔:

1. 확장 단계 (Growing Phase)
   - Lock만 획득, 해제 안 함

2. 축소 단계 (Shrinking Phase)
   - Lock만 해제, 획득 안 함
   - Lock을 하나라도 해제하면 더 이상 획득 불가

Lock 수
  │     ╱╲
  │    ╱  ╲
  │   ╱    ╲
  │  ╱      ╲
  │ ╱        ╲
  └────────────── 시간
    확장   축소
    (Growing) (Shrinking)
         ↑
      Lock Point (최대 Lock 수 시점)

2PL 보장: 직렬 가능성 (Serializability)
2PL 한계: 교착 상태 (Deadlock) 가능
```

### 2PL 변형

```
1. 기본 2PL (Basic 2PL)
   - 위 설명 그대로
   - 연쇄 복귀 (Cascading Rollback) 가능

2. 엄격한 2PL (Strict 2PL)
   - X-Lock은 트랜잭션 종료(COMMIT/ROLLBACK)까지 유지
   - 연쇄 복귀 방지
   - 가장 널리 사용

3. 강한 2PL (Rigorous 2PL)
   - 모든 Lock을 트랜잭션 종료까지 유지
   - 구현이 간단하지만 동시성 감소
```

## 교착 상태 (Deadlock)

### 발생 조건

```
두 트랜잭션이 서로가 보유한 Lock을 기다리는 상태

T1: Lock(A) → Lock(B) 요청 (대기)
T2: Lock(B) → Lock(A) 요청 (대기)

→ 무한 대기

교착 상태 필요 조건 (4가지 모두 충족):
1. 상호 배제 (Mutual Exclusion): Lock은 공유 불가 (X-Lock)
2. 점유와 대기 (Hold and Wait): Lock 보유한 채 다른 Lock 대기
3. 비선점 (No Preemption): 다른 트랜잭션의 Lock 강제 해제 불가
4. 순환 대기 (Circular Wait): 대기 관계가 순환
```

### 해결 방법

```
1. 예방 (Prevention)
   ├── Wait-Die: 오래된 T가 대기, 젊은 T가 대기하면 Rollback
   ├── Wound-Wait: 오래된 T가 강제 선점, 젊은 T가 대기
   └── 타임스탬프 기반: 트랜잭션 시작 시간으로 우선순위

2. 회피 (Avoidance)
   - 자원 할당 그래프로 순환 감지 전에 회피

3. 탐지와 회복 (Detection & Recovery)
   - 대기 그래프(Wait-for Graph) 유지
   - 주기적으로 순환 탐지
   - 순환 발견 시 하나의 트랜잭션을 Rollback (희생자 선택)
   - 가장 일반적인 방법

4. 타임아웃 (Timeout)
   - 일정 시간 Lock 획득 못하면 Rollback
   - 구현 간단하지만 정확하지 않음
```

## MVCC (Multi-Version Concurrency Control)

```
Lock 기반의 대안으로, 데이터의 여러 버전을 유지하여 동시성을 높이는 기법.

원리:
- 데이터 수정 시 이전 버전을 보존
- 읽기 연산은 Lock 없이 적절한 버전을 읽음
- 쓰기 연산만 Lock 사용

장점:
- 읽기와 쓰기가 서로 블로킹하지 않음
- 읽기 성능 크게 향상
- 대부분의 실무 DBMS가 채택

동작 방식 (PostgreSQL 예):
  T1(시작: t=10): SELECT → 시점 t=10의 스냅샷 읽기
  T2(시작: t=15): UPDATE → 새 버전 생성 (t=15)
  T1: SELECT → 여전히 t=10의 스냅샷 (T2 변경 안 보임)

사용하는 DBMS:
  - PostgreSQL: MVCC (Tuple Versioning)
  - MySQL InnoDB: MVCC (Undo Log 기반)
  - Oracle: MVCC (Undo Tablespace 기반)
```

## 직렬 가능성 (Serializability)

```
여러 트랜잭션의 동시 실행 결과가
어떤 직렬 실행(Serial Schedule)의 결과와 동일한 경우
"직렬 가능(Serializable)"하다고 함

직렬 스케줄: T1 → T2 → T3 (순차 실행)
  → 항상 정확하지만 성능 나쁨

직렬 가능 스케줄: 동시 실행하되 직렬 실행과 동일한 결과
  → 동시성 + 정확성

충돌 직렬 가능성 (Conflict Serializability):
- 충돌하는 연산의 순서가 어떤 직렬 스케줄과 동일
- 충돌: 같은 데이터에 대해, 하나 이상이 Write인 연산 쌍
  - Read-Write 충돌
  - Write-Read 충돌
  - Write-Write 충돌
- 선행 그래프(Precedence Graph)에 순환이 없으면 충돌 직렬 가능
```

## 핵심 정리

```
1. ACID: 원자성, 일관성, 격리성, 지속성
2. 동시성 문제: Dirty Read, Non-Repeatable Read, Phantom Read
3. 격리 수준: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE
4. Lock: S-Lock(읽기), X-Lock(쓰기)
5. 2PL: 확장 → 축소 단계 → 직렬 가능성 보장
6. Deadlock: 예방(Wait-Die) / 탐지(Wait-for Graph) / 타임아웃
7. MVCC: 다중 버전으로 읽기-쓰기 비블로킹
```

## 면접 포인트

### 자주 나오는 질문

**Q1. ACID 속성을 설명하라.**
> - Atomicity: 전부 수행 또는 전부 취소 (All or Nothing)
> - Consistency: 트랜잭션 전후 무결성 제약 유지
> - Isolation: 동시 실행 트랜잭션 간 간섭 없음
> - Durability: 커밋된 결과는 영구 보존

**Q2. 격리 수준의 종류와 차이는?**
> - READ UNCOMMITTED: 모든 이상 허용 (Dirty Read 포함)
> - READ COMMITTED: Dirty Read 방지 (Oracle 기본)
> - REPEATABLE READ: Non-Repeatable Read 방지 (MySQL 기본)
> - SERIALIZABLE: 모든 이상 방지 (성능 최저)
> - 격리 수준 높을수록 안전하지만 동시성 감소

**Q3. Deadlock이란? 어떻게 해결하는가?**
> - 두 트랜잭션이 서로의 Lock을 기다리는 무한 대기 상태
> - 예방: Wait-Die, Wound-Wait (타임스탬프 기반)
> - 탐지: Wait-for Graph에서 순환 탐지 → 희생자 Rollback
> - 타임아웃: 일정 시간 후 자동 Rollback

**Q4. 2PL이란?**
> - 확장 단계: Lock만 획득
> - 축소 단계: Lock만 해제
> - 직렬 가능성을 보장하지만 Deadlock은 발생 가능
> - Strict 2PL: X-Lock을 COMMIT까지 유지 → 연쇄 복귀 방지

**Q5. MVCC란?**
> - 데이터의 여러 버전을 유지하여 읽기-쓰기 충돌을 방지
> - 읽기 시 Lock이 필요 없어 동시성이 높음
> - PostgreSQL, MySQL InnoDB, Oracle 등에서 사용
> - 트랜잭션 시작 시점의 스냅샷을 읽음

**Q6. Dirty Read, Non-Repeatable Read, Phantom Read의 차이는?**
> - Dirty Read: 커밋되지 않은 데이터를 읽음
> - Non-Repeatable Read: 같은 행을 두 번 읽었는데 값이 다름
> - Phantom Read: 같은 조건으로 조회했는데 행의 수가 다름 (삽입/삭제)
