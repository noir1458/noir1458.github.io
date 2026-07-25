---
title: BOJ 3955 캔디 분배
slug: BOJ3955
publishedAt: '2026-04-02'
categories: BOJ
math: true
---
## 문제
캔디 분배 https://www.acmicpc.net/problem/3955

각 봉지에 $K$개의 사탕이 들어있을 때, $y$봉지를 사서 $X$명에게 $x$개씩 나누어주고 1개가 남도록 하는 최소의 양의 정수 $y$를 구하는 문제. (단, $y \le 10^9$이며 $x > 0, y > 0$)

## 복잡도 분석
- time complexity : $O(\log(\min(K, C)))$ - 확장 유클리드 호제법의 시간 복잡도를 따르며, 최대 100개의 테스트 케이스를 제한 시간(1초) 내에 매우 여유롭게 통과함.
- space complexity : $O(\log(\min(K, C)))$ - 재귀 호출에 의한 Call Stack 메모리만 사용하며, 추가적인 자료구조 불필요.

## 접근법
1. $C \cdot y - K \cdot x = 1$ 형태의 베주 항등식(Bézout's Identity)으로 문제를 재구성.
2. 확장 유클리드 알고리즘(Extended Euclidean Algorithm)을 사용하여 특수해와 $\gcd(K, C)$를 도출.
3. $\gcd \neq 1$인 경우 해가 존재하지 않으므로 예외 처리.
4. $y$를 양수로 보정하기 위해 $y = (y \pmod K + K) \pmod K$ 적용.
5. "친구들에게 사탕을 나누어 준다($x > 0$)"는 물리적 제약 조건을 만족하기 위해 $C \cdot y \le 1$인 경우 $y$에 $K$를 가산.
6. 최종 $y$가 상한선($10^9$)을 초과하는지 검증.

## 풀이
```python
import sys
input = sys.stdin.read

inp = input().replace('\x1a', '').splitlines()

def egcd(a,b):
    if b==0:
        return (a,1,0)
    g,x1,y1= egcd(b,a % b)
    x = y1
    y = x1 - (a//b) * y1
    return (g,x,y)

def solv(k,c):
    # c*y = k*x + 1
    # c*y - k*x = 1
    # (-k) * x + c * y = 1
    g,x,y = egcd(k,c)
    y = (y%k + k) %k

    # c*y가 1 이하라면 x가 0이하가 되어버린다.. 1 1 때문에 while
    while c*y <= 1:
        y+=k

    if g != 1 or (y>1e9): 
        print("IMPOSSIBLE")
        return
    print(y)

for i,x in enumerate(inp):
    if i>0:
        a,b = map(int, x.split())
        solv(a,b)
```

## Code Review
- **수학적 모델링의 현실화:** 수식적인 정답을 구하는 것에 그치지 않고, `while c*y <= 1` 루프를 도입해 실제 세계의 분배 조건($x>0$)을 우아하게 해결한 점이 매우 훌륭함.
- **부동소수점 오차 방지:** 경계값 검사 시 실수형 `1e9` 대신 완벽한 정수 비교를 위해 `10**9`를 사용하는 것이 안전함.

## 유사 문제 추천
- 잉여역수 구하기 (BOJ)
- 확장 유클리드 알고리즘 (BOJ)
- 계산기 프로그램 (BOJ)
- 선형 연립 합동식 (BOJ)
- 사과나무 (BOJ)
