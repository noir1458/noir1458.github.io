---
title: BOJ 14565 역원 구하기
slug: BOJ14565
publishedAt: '2026-04-01'
categories: BOJ
math: true
---

## 문제

[BOJ 14565 역원 구하기](https://www.acmicpc.net/problem/14565)  
정수 $N, A$가 주어졌을 때, 집합 $Z_N = \{0, 1, \dots, N-1\}$에서 다음을 구하는 문제다.

- **덧셈에 대한 역원** $b$: $(A+b) \bmod N = 0$
- **곱셈에 대한 역원** $c$: $(A \cdot c) \bmod N = 1$

단, 곱셈 역원은 항상 존재하지 않을 수 있으므로, 존재하지 않으면 $-1$을 출력해야 한다. 제약이 커서 $N \le 10^{12}$이므로 단순 탐색은 불가능하다.

## 복잡도 분석

- **Time Complexity**: $O(\log N)$  
  확장 유클리드 알고리즘 1회로 최대공약수와 계수를 함께 구한다.
- **Space Complexity**: $O(\log N)$  
  재귀 구현 기준 호출 스택을 포함한 공간 복잡도. 반복문으로 구현하면 $O(1)$까지 줄일 수 있다.

## 접근법

### 1. 덧셈 역원
$A < N$ 이므로 가장 자연스럽게 다음이 성립하도록 잡는다.
$$A + b = N$$
따라서 덧셈 역원 $b$는 다음과 같다.
$$b = N - A$$

---

### 2. 곱셈 역원의 존재 조건
우리가 원하는 것은 $Ax \equiv 1 \pmod N$이다. 이를 정수식으로 바꾸면 다음과 같은 부정 방정식의 정수해 $x, y$가 존재해야 한다.
$$Ax + Ny = 1$$
베주 항등식에 의해 $Ax + Ny = \gcd(A, N)$ 꼴의 해는 항상 존재하므로, 우변이 $1$이 되려면 반드시 **$\gcd(A, N) = 1$**이어야 한다. 즉, $A$와 $N$이 서로소일 때만 곱셈 역원이 존재한다.

---

### 3. 확장 유클리드 알고리즘
확장 유클리드 알고리즘은 $ax + by = \gcd(a, b)$를 만족하는 $x, y$를 함께 구해준다. 재귀적으로 $\text{egcd}(a, b) \to \text{egcd}(b, a \bmod b)$를 호출한다. 만약 아래 단계에서 $bx_1 + (a \bmod b)y_1 = g$를 알고 있다면, $a \bmod b = a - \lfloor a/b \rfloor b$를 대입하여 다음을 얻는다.
$$ay_1 + b(x_1 - \lfloor a/b \rfloor y_1) = g$$
따라서 현재 단계의 계수는 다음과 같다.
$$x = y_1, \qquad y = x_1 - \lfloor a/b \rfloor y_1$$

---

### 4. 결과의 정규화
확장 유클리드로 얻은 $x$는 음수일 수 있다. 문제에서 원하는 역원은 $Z_N = \{0, \dots, N-1\}$ 안의 원소이므로, 최종 답은 $x \bmod N$으로 정규화하여 출력해야 한다.

---

### 흐름 정리

```mermaid
flowchart TD
    A[입력 N, A] --> B[덧셈 역원 계산: N-A]
    B --> C[egcd(A, N) 실행]
    C --> D{gcd(A,N) == 1?}
    D -->|No| E[곱셈 역원 = -1]
    D -->|Yes| F[x를 구함]
    F --> G[x % N 으로 정규화]
    E --> H[출력]
    G --> H[출력]
```

### 핵심 아이디어 요약
- 덧셈 역원은 $N - A$
- 곱셈 역원은 $\gcd(A, N) = 1$일 때만 존재
- 확장 유클리드로 $Ax + Ny = 1$의 해를 구하고 $x \bmod N$을 출력

## 풀이

```python
N, A = map(int, input().split())

rev_sum = N - A

def egcd(a, b):
    if b == 0:
        return (a, 1, 0)

    g, x1, y1 = egcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return (g, x, y)

g, x, y = egcd(A, N)

rev_mul = -1
if g == 1:
    rev_mul = x % N

print(rev_sum, rev_mul)
```

## Code Review
- 함수 내부에서 외부 변수 의존성을 줄여 깔끔하게 구현되었다.
- `rev_sum`, `rev_mul`과 같이 변수명을 통해 의미를 명확히 전달했다.
- $N$의 범위가 크지만 $\log N$ 알고리즘이므로 파이썬으로도 충분히 통과 가능하다.
- C++로 구현할 경우 $10^{12}$ 범위를 수용하기 위해 반드시 `long long`을 사용해야 한다.

## 유사 문제 추천
- **최대공약수와 최소공배수** (BOJ 2609)
- **GCD(n, k) = 1** (BOJ 11689)
- **서로소** (BOJ 4355)
- **조합** (BOJ 13977) - 모듈러 역원을 활용한 조합 계산
