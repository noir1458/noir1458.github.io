---
title: 'Database System 7주차 과제 Q3 정리'
slug: database-system-week-07-q3
description: 'Database System 7주차 과제 Q3 풀이 과정을 정리한 기록.'
publishedAt: '2025-04-23'
categories: DatabaseSystem
math: false
---
## 과제 풀이

Database System 과제 Q3의 풀이 과정이다.

![Database System 7주차 과제 Q3 풀이 1](./database-system-week-07-q3-001.webp)
![Database System 7주차 과제 Q3 풀이 2](./database-system-week-07-q3-002.webp)
그림보면 2번

![Database System 7주차 과제 Q3 풀이 3](./database-system-week-07-q3-003.webp)

![Database System 7주차 과제 Q3 풀이 4](./database-system-week-07-q3-004.webp)
![Database System 7주차 과제 Q3 풀이 5](./database-system-week-07-q3-005.webp)
M=3이었다

![Database System 7주차 과제 Q3 풀이 6](./database-system-week-07-q3-006.webp)
![Database System 7주차 과제 Q3 풀이 7](./database-system-week-07-q3-007.webp)
![Database System 7주차 과제 Q3 풀이 8](./database-system-week-07-q3-008.webp)  
12/3 = 4

![Database System 7주차 과제 Q3 풀이 9](./database-system-week-07-q3-009.webp)  
500만/40 = 125000

![Database System 7주차 과제 Q3 풀이 10](./database-system-week-07-q3-010.webp)
![Database System 7주차 과제 Q3 풀이 11](./database-system-week-07-q3-011.webp)

## 외부정렬의 비용계산

![Database System 7주차 과제 Q3 풀이 12](./database-system-week-07-q3-012.webp)

- br: 정렬할 전체 블록 수 (block of records)

- M: 사용 가능한 메모리 블록 수 (즉, 한 번에 메모리에 올릴 수 있는 block 수)
- M-1: 한 번의 merge pass에서 병합 가능한 run 수
  (M개의 블록 중 1개는 output 용도로 쓰고 M-1개로 merge 진행)
- log(M-1)(br/M): merge pass 수
  (M-1 way merge를 반복해서 전체를 하나로 만들기 위해 필요한 횟수)

- ceil(br/M) : 초기 run 수
