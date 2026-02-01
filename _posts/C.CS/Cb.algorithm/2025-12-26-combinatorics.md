---
title: 26. 조합론
tags: algorithm
categories: algorithm
---

## 개념

경우의 수를 세는 수학적 기법이다. 코딩 테스트에서 순열, 조합, 이항 계수 등의 형태로 자주 출제된다.

### 기본 공식

```
순열: nPr = n! / (n-r)!
조합: nCr = n! / (r! · (n-r)!)
중복 순열: n^r
중복 조합: n+r-1Cr = (n+r-1)! / (r! · (n-1)!)
```

## 이항 계수

### 파스칼의 삼각형

```
C(n, r) = C(n-1, r-1) + C(n-1, r)

    1
   1 1
  1 2 1
 1 3 3 1
1 4 6 4 1
```

```cpp
// O(N²) DP
const int MOD = 1e9 + 7;
long long C[1001][1001];

void precompute(int n) {
    for (int i = 0; i <= n; i++) {
        C[i][0] = 1;
        for (int j = 1; j <= i; j++) {
            C[i][j] = (C[i-1][j-1] + C[i-1][j]) % MOD;
        }
    }
}
```

### 모듈러 이항계수

```cpp
// 페르마 소정리 이용 (MOD가 소수일 때)
// C(n, r) = n! / (r! · (n-r)!) mod p
// = n! · (r!)^(-1) · ((n-r)!)^(-1) mod p

const int MOD = 1e9 + 7;
const int MAX = 1000001;

long long fac[MAX];     // 팩토리얼
long long inv_fac[MAX]; // 팩토리얼 역원

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

void precompute() {
    fac[0] = 1;
    for (int i = 1; i < MAX; i++) {
        fac[i] = fac[i-1] * i % MOD;
    }

    inv_fac[MAX-1] = power(fac[MAX-1], MOD - 2, MOD);
    for (int i = MAX-2; i >= 0; i--) {
        inv_fac[i] = inv_fac[i+1] * (i+1) % MOD;
    }
}

long long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fac[n] % MOD * inv_fac[r] % MOD * inv_fac[n-r] % MOD;
}
```

### 뤼카 정리

```cpp
// MOD가 작은 소수일 때 (p ≤ 10^6 정도)
// C(n, r) mod p = ∏ C(n_i, r_i) mod p
// n_i, r_i는 n, r을 p진법으로 표현한 각 자리 수

long long C_small[1001][1001];  // p 이하의 이항계수

void precomputeSmall(int p) {
    for (int i = 0; i < p; i++) {
        C_small[i][0] = 1;
        for (int j = 1; j <= i; j++) {
            C_small[i][j] = (C_small[i-1][j-1] + C_small[i-1][j]) % p;
        }
    }
}

long long lucas(long long n, long long r, int p) {
    if (r == 0) return 1;
    return C_small[n % p][r % p] * lucas(n / p, r / p, p) % p;
}
```

## 카탈란 수

```
C_n = C(2n, n) / (n+1)

C_0 = 1
C_1 = 1
C_2 = 2
C_3 = 5
C_4 = 14
C_5 = 42

점화식: C_n = ΣC_i · C_{n-1-i} (i=0..n-1)
```

### 카탈란 수의 활용

```
- 올바른 괄호 쌍의 수
- n+1개 리프 노드를 가진 이진 트리의 수
- 대각선을 넘지 않는 경로의 수
- 볼록 다각형의 삼각 분할의 수
```

```cpp
long long catalan(int n) {
    return nCr(2 * n, n) % MOD * power(n + 1, MOD - 2, MOD) % MOD;
}

// DP로 구하기
long long cat[1001];
void computeCatalan(int n) {
    cat[0] = cat[1] = 1;
    for (int i = 2; i <= n; i++) {
        cat[i] = 0;
        for (int j = 0; j < i; j++) {
            cat[i] = (cat[i] + cat[j] * cat[i-1-j]) % MOD;
        }
    }
}
```

## 포함-배제 원리

```
|A₁ ∪ A₂ ∪ ... ∪ Aₙ|
= Σ|Aᵢ| - Σ|Aᵢ ∩ Aⱼ| + Σ|Aᵢ ∩ Aⱼ ∩ Aₖ| - ...

교란 (Derangement): 모든 원소가 원래 위치에 있지 않은 순열
D(n) = n! · Σ(-1)^k / k!  (k=0..n)
D(n) = (n-1) · (D(n-1) + D(n-2))
```

```cpp
// 교란 수
long long derangement(int n) {
    if (n == 0) return 1;
    if (n == 1) return 0;

    long long dp[n + 1];
    dp[0] = 1;
    dp[1] = 0;

    for (int i = 2; i <= n; i++) {
        dp[i] = (i - 1) * (dp[i-1] + dp[i-2]) % MOD;
    }

    return dp[n];
}

// 포함-배제로 특정 조건을 만족하지 않는 경우의 수
// 예: 1~N에서 2,3,5의 배수가 아닌 수의 개수
long long countCoprime(long long N) {
    long long total = N;
    total -= N/2 + N/3 + N/5;
    total += N/6 + N/10 + N/15;
    total -= N/30;
    return total;
}
```

## 사용 예시

### 이항 계수 구하기

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MOD = 1e9 + 7;

long long fac[4000001], inv_fac[4000001];

long long power(long long a, long long n, long long m) {
    long long r = 1; a %= m;
    while (n > 0) {
        if (n & 1) r = r * a % m;
        a = a * a % m;
        n >>= 1;
    }
    return r;
}

void init(int n) {
    fac[0] = 1;
    for (int i = 1; i <= n; i++) fac[i] = fac[i-1] * i % MOD;
    inv_fac[n] = power(fac[n], MOD - 2, MOD);
    for (int i = n - 1; i >= 0; i--) inv_fac[i] = inv_fac[i+1] * (i+1) % MOD;
}

long long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fac[n] % MOD * inv_fac[r] % MOD * inv_fac[n-r] % MOD;
}

int main() {
    int N, K;
    cin >> N >> K;

    init(N);
    cout << nCr(N, K) << '\n';
    return 0;
}
```

### 격자 경로 문제

```cpp
// (0,0)에서 (n,m)까지 오른쪽/위로만 이동하는 경로의 수
// = C(n+m, n)

long long gridPaths(int n, int m) {
    return nCr(n + m, n);
}

// 장애물이 있는 경우: 포함-배제 또는 DP
```

### 중복 조합

```cpp
// 서로 다른 n종류에서 r개를 중복 허용하여 선택
// = C(n+r-1, r)

// 예: 사과, 배, 귤 중 5개 선택 (중복 가능)
// C(3+5-1, 5) = C(7, 5) = 21
```

## 주의사항 / Edge Cases

### 오버플로우

```cpp
// 팩토리얼은 매우 빠르게 커짐
// 반드시 모듈러 연산 적용
fac[i] = fac[i-1] * i % MOD;

// 중간 곱셈도 long long 필요
long long result = fac[n] % MOD * inv_fac[r] % MOD;
```

### nCr에서 r > n 또는 r < 0

```cpp
// 유효하지 않은 입력 처리
if (r < 0 || r > n) return 0;
```

### MOD가 소수가 아닌 경우

```cpp
// 페르마 소정리 사용 불가
// 뤼카 정리도 소수에서만 동작
// 이 경우 파스칼의 삼각형이나 다른 방법 사용
```

### 역원 전처리 방향

```cpp
// inv_fac을 뒤에서부터 계산 (O(N)으로 최적화)
inv_fac[MAX-1] = power(fac[MAX-1], MOD - 2, MOD);  // 하나만 역원 계산
for (int i = MAX-2; i >= 0; i--) {
    inv_fac[i] = inv_fac[i+1] * (i+1) % MOD;  // 나머지는 곱셈으로
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 순열과 조합의 차이는?**
> - 순열: 순서가 중요 (nPr = n!/(n-r)!)
> - 조합: 순서 무관 (nCr = n!/(r!(n-r)!))

**Q2. 이항 계수를 효율적으로 구하는 방법은?**
> - 파스칼: O(N²) DP, 작은 N에 적합
> - 팩토리얼 전처리 + 모듈러 역원: O(N) 전처리, O(1) 쿼리
> - 뤼카: MOD가 작은 소수일 때

**Q3. 카탈란 수란?**
> - C_n = C(2n, n) / (n+1)
> - 올바른 괄호 쌍, 이진 트리 개수 등 다양한 조합 문제에 등장
> - 점화식: C_n = Σ C_i · C_{n-1-i}

**Q4. 포함-배제 원리란?**
> - 합집합의 크기를 구할 때 중복을 보정하는 방법
> - |A∪B| = |A| + |B| - |A∩B|
> - 교란, 오일러 피 함수 등에 활용

**Q5. 모듈러 역원이란?**
> - a·x ≡ 1 (mod m)인 x
> - 나눗셈을 모듈러 연산으로 처리하기 위해 사용
> - 페르마 소정리: a^(m-2) mod m (m이 소수)

### 코드 체크리스트

```cpp
// 1. 팩토리얼 & 역원 전처리
// 2. nCr 함수 (r 범위 체크)
// 3. MOD 연산 매 곱셈마다
// 4. long long 사용
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 이항 계수 1 | [BOJ 11050](https://www.acmicpc.net/problem/11050) | 기본 이항 계수 |
| Silver | 이항 계수 2 | [BOJ 11051](https://www.acmicpc.net/problem/11051) | 파스칼 DP |
| Gold | 조합 | [BOJ 2407](https://www.acmicpc.net/problem/2407) | 큰 이항 계수 |
| Gold | 이항 계수 3 | [BOJ 11401](https://www.acmicpc.net/problem/11401) | 모듈러 역원 |
| Gold | 카탈란 수 | [BOJ 16862](https://www.acmicpc.net/problem/16862) | 카탈란 수 |
| Gold | 완전 이진 트리 | [BOJ 9934](https://www.acmicpc.net/problem/9934) | 조합 응용 |
| Platinum | 이항 계수 4 | [BOJ 11402](https://www.acmicpc.net/problem/11402) | 뤼카 정리 |
| Platinum | 교란 | [BOJ 1947](https://www.acmicpc.net/problem/1947) | 교란 수 |
