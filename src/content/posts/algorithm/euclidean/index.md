---
title: 24. 유클리드 & 확장 유클리드
slug: euclidean
publishedAt: '2025-12-24'
categories: algorithm
math: false
---

## 개념

유클리드 알고리즘은 두 정수의 최대공약수(GCD)를 효율적으로 구하는 알고리즘이다. 확장 유클리드는 GCD와 함께 ax + by = gcd(a, b)의 해를 구한다.

### 핵심 특징

- **유클리드**: gcd(a, b) = gcd(b, a % b)
- **확장 유클리드**: ax + by = gcd(a, b)의 정수해 (x, y)를 구함
- **모듈러 역원**: a·x ≡ 1 (mod m) 의 x를 구하는 데 활용

## 유클리드 알고리즘 (GCD)

### 원리

```
gcd(a, b) = gcd(b, a % b)

예: gcd(48, 18)
  = gcd(18, 48 % 18) = gcd(18, 12)
  = gcd(12, 18 % 12) = gcd(12, 6)
  = gcd(6, 12 % 6) = gcd(6, 0)
  = 6
```

### 구현

```cpp
// 재귀
long long gcd(long long a, long long b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

// 반복
long long gcd(long long a, long long b) {
    while (b) {
        a %= b;
        long long t = a;
        a = b;
        b = t;
    }
    return a;
}

// LCM (최소공배수)
long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;  // 오버플로우 방지: 나누기 먼저
}
```

### 시간복잡도

```
O(log(min(a, b)))

유클리드 알고리즘은 매 2단계마다 수가 절반 이하로 줄어듦
→ 최대 2·log₂(min(a, b)) 번의 나머지 연산
```

## 확장 유클리드 알고리즘

ax + by = gcd(a, b)를 만족하는 정수 x, y를 구한다.

### 원리

```
gcd(a, b) = gcd(b, a%b)

bx₁ + (a%b)y₁ = gcd(b, a%b)
bx₁ + (a - ⌊a/b⌋·b)y₁ = gcd(a, b)
ay₁ + b(x₁ - ⌊a/b⌋·y₁) = gcd(a, b)

따라서: x = y₁, y = x₁ - ⌊a/b⌋·y₁
```

### 구현

```cpp
// ax + by = gcd(a, b)의 해 (x, y)와 gcd를 반환
long long extGcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }

    long long x1, y1;
    long long g = extGcd(b, a % b, x1, y1);

    x = y1;
    y = x1 - (a / b) * y1;

    return g;
}
```

## 모듈러 역원

a·x ≡ 1 (mod m)인 x를 구하는 방법.

### 방법 1: 확장 유클리드

```cpp
// gcd(a, m) = 1일 때만 역원이 존재
long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = extGcd(a, m, x, y);

    if (g != 1) return -1;  // 역원 없음

    return (x % m + m) % m;  // 양수로
}
```

### 방법 2: 페르마 소정리

```cpp
// m이 소수일 때: a^(-1) ≡ a^(m-2) (mod m)
long long power(long long a, long long n, long long m) {
    long long result = 1;
    a %= m;
    while (n > 0) {
        if (n & 1) result = result * a % m;
        a = a * a % m;
        n >>= 1;
    }
    return result;
}

long long modInverseFermat(long long a, long long m) {
    return power(a, m - 2, m);
}
```

### 방법 3: 역원 전처리

```cpp
// 1~N까지의 모듈러 역원을 O(N)에 전처리
const int MOD = 1e9 + 7;
long long inv[100001];

void precomputeInverse(int n) {
    inv[1] = 1;
    for (int i = 2; i <= n; i++) {
        inv[i] = -(MOD / i) * inv[MOD % i] % MOD + MOD;
        inv[i] %= MOD;
    }
}
```

## 사용 예시

### 분수의 기약 분수

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;

    long long g = __gcd(a, b);
    cout << a / g << '/' << b / g << '\n';
    return 0;
}
```

### 일차 부정 방정식

```cpp
#include <bits/stdc++.h>
using namespace std;

// ax + by = c의 정수해 존재 여부 및 특수해
// gcd(a,b) | c 이면 해 존재
int main() {
    long long a, b, c;
    cin >> a >> b >> c;

    long long x, y;
    long long g = extGcd(a, b, x, y);  // ax + by = g

    if (c % g != 0) {
        cout << "해 없음\n";
        return 0;
    }

    // 특수해: x₀ = x·(c/g), y₀ = y·(c/g)
    x *= c / g;
    y *= c / g;

    // 일반해: x = x₀ + (b/g)·t, y = y₀ - (a/g)·t
    cout << "x = " << x << ", y = " << y << '\n';
    return 0;
}
```

### 중국인의 나머지 정리 (CRT)

```cpp
#include <bits/stdc++.h>
using namespace std;

// x ≡ r₁ (mod m₁), x ≡ r₂ (mod m₂) 의 해
// gcd(m₁, m₂) = 1일 때
pair<long long, long long> crt(long long r1, long long m1,
                                long long r2, long long m2) {
    long long x, y;
    long long g = extGcd(m1, m2, x, y);

    if ((r2 - r1) % g != 0) return {-1, -1};  // 해 없음

    long long lcm = m1 / g * m2;
    long long ans = (r1 + m1 * ((r2 - r1) / g % (m2 / g) * x % (m2 / g))) % lcm;
    if (ans < 0) ans += lcm;

    return {ans, lcm};
}
```

## 주의사항 / Edge Cases

### 0 처리

```cpp
// gcd(0, 0) = 0 (정의에 따라)
// gcd(a, 0) = a
// gcd(0, b) = b
// LCM 계산 시 0 주의
if (a == 0 || b == 0) lcm = 0;
```

### 음수 처리

```cpp
// GCD는 항상 양수로
long long g = gcd(abs(a), abs(b));

// 모듈러 역원도 양수로
x = (x % m + m) % m;
```

### 오버플로우

```cpp
// a * b가 오버플로우 가능
// LCM: 나누기 먼저
long long l = a / gcd(a, b) * b;

// 모듈러 곱셈: __int128 또는 분할
long long mulmod(long long a, long long b, long long m) {
    return (__int128)a * b % m;
}
```

### 역원이 존재하지 않는 경우

```cpp
// gcd(a, m) != 1이면 모듈러 역원 없음
// 예: a=4, m=6 → gcd(4,6)=2 → 역원 없음
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 유클리드 알고리즘의 원리는?**
> - gcd(a, b) = gcd(b, a % b)
> - a를 b로 나눈 나머지와 b의 GCD는 원래 GCD와 같음
> - b가 0이 되면 a가 GCD

**Q2. 시간복잡도가 O(log N)인 이유는?**
> - a % b < a/2가 항상 성립
> - 매 2단계마다 수가 절반 이하로 줄어듦
> - 피보나치 수가 최악의 경우 (가장 느린 입력)

**Q3. 확장 유클리드의 활용은?**
> - ax + by = gcd(a, b)의 정수해
> - 모듈러 역원 계산
> - 일차 부정 방정식 풀기
> - 중국인의 나머지 정리 (CRT)

**Q4. 모듈러 역원을 구하는 방법은?**
> - 확장 유클리드: gcd(a, m) = 1일 때
> - 페르마 소정리: m이 소수일 때 a^(m-2) mod m
> - 전처리: 1~N 역원을 O(N)에 계산

### 코드 체크리스트

```cpp
// 1. GCD
long long g = gcd(a, b);

// 2. LCM (오버플로우 주의)
long long l = a / g * b;

// 3. 모듈러 역원 (m이 소수)
long long inv = power(a, m - 2, m);

// 4. 확장 유클리드
long long x, y;
long long g = extGcd(a, b, x, y);
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 최대공약수와 최소공배수 | [BOJ 2609](https://www.acmicpc.net/problem/2609) | 기본 GCD/LCM |
| Silver | 분수 합 | [BOJ 1735](https://www.acmicpc.net/problem/1735) | GCD 활용 |
| Gold | DSLR | [BOJ 9019](https://www.acmicpc.net/problem/9019) | 수학 + BFS |
| Gold | 곱셈 | [BOJ 1629](https://www.acmicpc.net/problem/1629) | 빠른 거듭제곱 |
| Platinum | 나머지 합 | [BOJ 10986](https://www.acmicpc.net/problem/10986) | 모듈러 연산 |
| Platinum | 중국인의 나머지 정리 | [BOJ 6064](https://www.acmicpc.net/problem/6064) | CRT |
