---
title: 'Database System 12주차 정리'
slug: database-system-week-12
description: '12주차 수업 트랜잭션 상태와 동시성 제어, 직렬 가능성'
publishedAt: '2025-05-21'
categories: DatabaseSystem
math: false
---
## 학습 범위

- 트랜잭션의 상태 변화와 동시성 제어
- 직렬 스케줄과 충돌 직렬 가능성
- recoverable schedule과 cascading rollback

## 12주차1st ch17

### 트랜젝션 상태

![Database System 12주차 수업 자료 1](./database-system-week-12-001.webp)

![Database System 12주차 수업 자료 2](./database-system-week-12-002.webp)

![Database System 12주차 수업 자료 3](./database-system-week-12-003.webp)

![Database System 12주차 수업 자료 4](./database-system-week-12-004.webp)

![Database System 12주차 수업 자료 5](./database-system-week-12-005.webp)

트랜잭션은 실행중에는 active 상태에 있고, 마지막 명령을 실행하면 partially committed 상태가 된다. 이 시점에는 아직 장애 가능성이 남아있고, commit이 확정되어야 committed 상태가 된다.

정상적으로 진행할수 없는 문제가 생기면 failed를 거쳐 aborted 상태가 된다. aborted 트랜잭션은 지금까지의 변경을 rollback한 다음 다시 시작할수도 있고, 논리 오류가 원인이라면 완전히 종료할수도 있다.

### 트랜젝션 동시성 제어

![Database System 12주차 수업 자료 6](./database-system-week-12-006.webp)

여러 트랜잭션을 동시에 실행하면 한 트랜잭션이 입출력을 기다리는 동안 다른 트랜잭션이 CPU를 사용할수 있어서 처리량이 높아지고, 짧은 트랜잭션의 응답시간도 줄어든다. 대신 서로의 중간결과를 건드리지 않도록 동시성 제어가 필요하다.

![Database System 12주차 수업 자료 7](./database-system-week-12-007.webp)

스케줄 schedule은 여러 트랜잭션의 명령들이 실제로 실행되는 시간순서를 말한다. 각 트랜잭션 내부의 명령순서는 그대로 유지해야 하지만, 서로 다른 트랜잭션의 명령은 중간중간 섞여서 실행될수 있다.

![Database System 12주차 수업 자료 8](./database-system-week-12-008.webp)

![Database System 12주차 수업 자료 9](./database-system-week-12-009.webp)

![Database System 12주차 수업 자료 10](./database-system-week-12-010.webp)

![Database System 12주차 수업 자료 11](./database-system-week-12-011.webp)

![Database System 12주차 수업 자료 12](./database-system-week-12-012.webp)

![Database System 12주차 수업 자료 13](./database-system-week-12-013.webp)

![Database System 12주차 수업 자료 14](./database-system-week-12-014.webp)

![Database System 12주차 수업 자료 15](./database-system-week-12-015.webp)

![Database System 12주차 수업 자료 16](./database-system-week-12-016.webp)

![Database System 12주차 수업 자료 17](./database-system-week-12-017.webp)

![Database System 12주차 수업 자료 18](./database-system-week-12-018.webp)

![Database System 12주차 수업 자료 19](./database-system-week-12-019.webp)

schedule 1과 2는 한 트랜잭션을 끝낸 다음 다른 트랜잭션을 실행하는 직렬 스케줄이다. schedule 3은 두 트랜잭션이 섞여있지만 직렬 실행과 같은 결과가 나오고 A+B도 보존된다. 반면 schedule 4에서는 한쪽 변경을 다른 트랜잭션이 덮어써서 합계가 달라진다.

### 연습문제

![Database System 12주차 수업 자료 20](./database-system-week-12-020.webp)

![Database System 12주차 수업 자료 21](./database-system-week-12-021.webp)

초깃값이 A=1000, B=2000일때 T1을 먼저 실행하면 최종값은 A=855, B=2145가 된다. T2를 먼저 실행하면 A=850, B=2150이 된다. 결과값은 달라도 두 직렬 스케줄 모두 A+B=3000이라는 일관성 조건은 지킨다.

## 12주차2nd ch17

![Database System 12주차 수업 자료 22](./database-system-week-12-022.webp)

![Database System 12주차 수업 자료 23](./database-system-week-12-023.webp)

![Database System 12주차 수업 자료 24](./database-system-week-12-024.webp)

![Database System 12주차 수업 자료 25](./database-system-week-12-025.webp)

![Database System 12주차 수업 자료 26](./database-system-week-12-026.webp)

![Database System 12주차 수업 자료 27](./database-system-week-12-027.webp)

![Database System 12주차 수업 자료 28](./database-system-week-12-028.webp)

![Database System 12주차 수업 자료 29](./database-system-week-12-029.webp)

![Database System 12주차 수업 자료 30](./database-system-week-12-030.webp)

![Database System 12주차 수업 자료 31](./database-system-week-12-031.webp)

![Database System 12주차 수업 자료 32](./database-system-week-12-032.webp)

각 트랜잭션 하나만 놓고 보면 데이터베이스의 일관성을 지킨다고 가정한다. 그렇다면 동시에 실행한 스케줄도 어떤 직렬 스케줄과 같은 결과를 낼때 serializable하다고 말할수 있다.

schedule 3은 명령이 섞여있어도 T1 다음 T2로 실행한 결과와 같기 때문에 직렬가능하다. schedule 4는 A와 B에서 서로 다른 트랜잭션의 변경이 덮어써져 어느 직렬 순서와도 같은 결과가 나오지 않는다.

### 연습문제

![Database System 12주차 수업 자료 33](./database-system-week-12-033.webp)

### 직렬가능성

![Database System 12주차 수업 자료 34](./database-system-week-12-034.webp)

![Database System 12주차 수업 자료 35](./database-system-week-12-035.webp)

![Database System 12주차 수업 자료 36](./database-system-week-12-036.webp)

![Database System 12주차 수업 자료 37](./database-system-week-12-037.webp)

![Database System 12주차 수업 자료 38](./database-system-week-12-038.webp)

![Database System 12주차 수업 자료 39](./database-system-week-12-039.webp)

![Database System 12주차 수업 자료 40](./database-system-week-12-040.webp)

![Database System 12주차 수업 자료 41](./database-system-week-12-041.webp)

![Database System 12주차 수업 자료 42](./database-system-week-12-042.webp)

충돌하지 않는 명령들의 순서를 서로 바꾸어 직렬 스케줄로 만들수 있다면 conflict serializable한 스케줄이다. schedule 3에서는 결과에 영향을 주지 않는 명령들을 교환해서 T2 다음 T1의 직렬 스케줄로 바꿀수 있다.

### 연습문제

![Database System 12주차 수업 자료 43](./database-system-week-12-043.webp)

![Database System 12주차 수업 자료 44](./database-system-week-12-044.webp)

이 판정에서는 최종값만 우연히 같게 나오는지를 보는것이 아니라, 서로 충돌하는 read와 write의 상대적인 순서가 직렬 스케줄과 같은지를 본다.

## 12주차3rd ch17

### 충돌하는 명령

![Database System 12주차 수업 자료 45](./database-system-week-12-045.webp)

![Database System 12주차 수업 자료 46](./database-system-week-12-046.webp)

서로 다른 트랜잭션의 두 명령이 같은 데이터 항목에 접근하고, 그중 적어도 하나가 write라면 두 명령은 충돌한다. read-read는 순서를 바꿔도 결과가 같지만 read-write, write-read, write-write는 순서에 따라 읽거나 남는 값이 달라질수 있다.

![Database System 12주차 수업 자료 47](./database-system-week-12-047.webp)

![Database System 12주차 수업 자료 48](./database-system-week-12-048.webp)

![Database System 12주차 수업 자료 49](./database-system-week-12-049.webp)

![Database System 12주차 수업 자료 50](./database-system-week-12-050.webp)

schedule 3에서 충돌하지 않는 명령을 차례로 교환하면 T2의 명령이 모두 앞에 오는 schedule 6을 만들수 있다. schedule 6은 직렬 스케줄이므로 원래 schedule 3도 conflict serializable하다고 판단한다.

![Database System 12주차 수업 자료 51](./database-system-week-12-051.webp)

![Database System 12주차 수업 자료 52](./database-system-week-12-052.webp)

![Database System 12주차 수업 자료 53](./database-system-week-12-053.webp)

![Database System 12주차 수업 자료 54](./database-system-week-12-054.webp)

![Database System 12주차 수업 자료 55](./database-system-week-12-055.webp)

![Database System 12주차 수업 자료 56](./database-system-week-12-056.webp)

![Database System 12주차 수업 자료 57](./database-system-week-12-057.webp)

반대로 schedule 4에는 A에서는 T1이 T2보다 먼저여야 하고 B에서는 T2가 T1보다 먼저여야 하는 충돌이 함께 있다. 두 순서조건을 동시에 만족하는 직렬 순서가 없으므로 conflict serializable하지 않다.

### 동시성 제어가 보장할 조건

![Database System 12주차 수업 자료 58](./database-system-week-12-058.webp)

![Database System 12주차 수업 자료 59](./database-system-week-12-059.webp)

실제 DBMS는 가능한 모든 스케줄을 실행한 뒤 직렬가능성을 검사하는것이 아니라, 처음부터 안전한 스케줄만 만들어지도록 동시성 제어 프로토콜을 사용한다. 직렬가능성뿐 아니라 장애가 났을때 복구할수 있는지도 같이 보장해야 한다.

### 복구가능한 스케줄

![Database System 12주차 수업 자료 60](./database-system-week-12-060.webp)

![Database System 12주차 수업 자료 61](./database-system-week-12-061.webp)

![Database System 12주차 수업 자료 62](./database-system-week-12-062.webp)

![Database System 12주차 수업 자료 63](./database-system-week-12-063.webp)

Tj가 Ti가 쓴 값을 읽었다면 Ti가 commit한 뒤에 Tj가 commit해야 한다. 이 순서를 지키는것이 recoverable schedule이다. Ti가 나중에 abort될수 있는데 Tj가 먼저 commit해버리면, 이미 확정된 Tj의 결과를 안전하게 되돌릴 방법이 없기 때문이다.

![Database System 12주차 수업 자료 64](./database-system-week-12-064.webp)

![Database System 12주차 수업 자료 65](./database-system-week-12-065.webp)

![Database System 12주차 수업 자료 66](./database-system-week-12-066.webp)

![Database System 12주차 수업 자료 67](./database-system-week-12-067.webp)

![Database System 12주차 수업 자료 68](./database-system-week-12-068.webp)

commit하지 않은 값을 다른 트랜잭션들이 연달아 읽으면, 첫 트랜잭션의 abort가 뒤의 트랜잭션들까지 차례로 rollback시키는 cascading rollback이 생긴다.

cascadeless schedule은 Ti가 쓴 값을 Ti가 commit한 뒤에만 다른 트랜잭션이 읽게 한다. 연쇄 rollback을 막을수 있고, 이 조건을 만족하면 자연히 recoverable schedule도 된다.

### 연습문제

17장 practice ex 17.7

### 정리

![Database System 12주차 수업 자료 69](./database-system-week-12-069.webp)

정리하면 동시성 제어는 가능한 스케줄을 직렬가능하게 만들고, 동시에 recoverable하고 가능하면 cascadeless하게 만드는것이 목표이다.
