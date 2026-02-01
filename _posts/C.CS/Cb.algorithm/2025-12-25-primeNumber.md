---
title: 25. 소수
tags: algorithm
categories: algorithm
---

## 개념

소수(Prime Number)는 1과 자기 자신만을 약수로 가지는 1보다 큰 자연수이다.

### 핵심 특징

- **소수 판별**: 주어진 수가 소수인지 확인
- **소수 생성**: 범위 내 모든 소수를 구함
- **소인수분해**: 합성수를 소수의 곱으로 분해

## 소수 판별

### O(√N) 판별

```cpp
bool isPrime(long long n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    // 6k ± 1 형태만 검사
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }

    return true;
}
```

## 에라토스테네스의 체

```cpp
const int MAX = 10000001;
bool isComposite[MAX];
std::vector<int> primes;

void sieve(int n) {
    isComposite[0] = isComposite[1] = true;

    for (int i = 2; i * i <= n; i++) {
        if (!isComposite[i]) {
            for (int j = i * i; j <= n; j += i) {
                isComposite[j] = true;
            }
        }
    }

    for (int i = 2; i <= n; i++) {
        if (!isComposite[i]) {
            primes.push_back(i);
        }
    }
}
```

### 구간 체 (세그먼트 체)

```cpp
#include <bits/stdc++.h>
using namespace std;

// [lo, hi] 구간의 소수를 구함 (hi가 매우 클 때)
vector<long long> segmentSieve(long long lo, long long hi) {
    int sqrtHi = (int)sqrt((double)hi) + 1;

    // 1단계: sqrt(hi)까지의 소수
    vector<bool> isComp(sqrtHi + 1, false);
    vector<int> smallPrimes;
    for (int i = 2; i <= sqrtHi; i++) {
        if (!isComp[i]) {
            smallPrimes.push_back(i);
            for (long long j = (long long)i * i; j <= sqrtHi; j += i) {
                isComp[j] = true;
            }
        }
    }

    // 2단계: [lo, hi] 구간 체
    int size = hi - lo + 1;
    vector<bool> seg(size, false);
    if (lo <= 1) seg[1 - lo] = true;  // 1은 소수가 아님

    for (int p : smallPrimes) {
        long long start = max((long long)p * p, ((lo + p - 1) / p) * p);
        for (long long j = start; j <= hi; j += p) {
            seg[j - lo] = true;
        }
    }

    vector<long long> result;
    for (int i = 0; i < size; i++) {
        if (!seg[i] && lo + i >= 2) {
            result.push_back(lo + i);
        }
    }

    return result;
}
```

## 밀러-라빈 소수 판별법

큰 수의 소수 판별 (확률적 / 결정론적).

```cpp
typedef long long ll;
typedef __int128 lll;

ll mulmod(ll a, ll b, ll m) {
    return (lll)a * b % m;
}

ll power(ll a, ll n, ll m) {
    ll result = 1;
    a %= m;
    while (n > 0) {
        if (n & 1) result = mulmod(result, a, m);
        a = mulmod(a, a, m);
        n >>= 1;
    }
    return result;
}

// 밀러-라빈 테스트 (base a)
bool millerTest(ll n, ll a) {
    if (n % a == 0) return n == a;

    ll d = n - 1;
    int r = 0;
    while (d % 2 == 0) { d /= 2; r++; }

    ll x = power(a, d, n);
    if (x == 1 || x == n - 1) return true;

    for (int i = 0; i < r - 1; i++) {
        x = mulmod(x, x, n);
        if (x == n - 1) return true;
    }

    return false;
}

// 결정론적 밀러-라빈 (2^64까지 정확)
bool isPrime(ll n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0) return false;

    // 이 base들로 2^64까지 정확히 판별 가능
    for (ll a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (!millerTest(n, a)) return false;
    }
    return true;
}
```

## 소인수분해

### 기본 (O(√N))

```cpp
#include <vector>

std::vector<std::pair<long long, int>> factorize(long long n) {
    std::vector<std::pair<long long, int>> factors;

    for (long long p = 2; p * p <= n; p++) {
        if (n % p == 0) {
            int cnt = 0;
            while (n % p == 0) {
                n /= p;
                cnt++;
            }
            factors.push_back({p, cnt});
        }
    }

    if (n > 1) {
        factors.push_back({n, 1});
    }

    return factors;
}
```

### 최소 소인수 전처리 (SPF)

```cpp
const int MAX = 10000001;
int spf[MAX];  // smallest prime factor

void buildSPF(int n) {
    for (int i = 2; i <= n; i++) spf[i] = i;

    for (int i = 2; i * i <= n; i++) {
        if (spf[i] == i) {  // i가 소수
            for (int j = i * i; j <= n; j += i) {
                if (spf[j] == j) {
                    spf[j] = i;
                }
            }
        }
    }
}

// O(log N) 소인수분해
std::vector<std::pair<int, int>> factorizeSPF(int n) {
    std::vector<std::pair<int, int>> factors;

    while (n > 1) {
        int p = spf[n], cnt = 0;
        while (n % p == 0) {
            n /= p;
            cnt++;
        }
        factors.push_back({p, cnt});
    }

    return factors;
}
```

## 사용 예시

### 소수 구하기

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int M, N;
    cin >> M >> N;

    vector<bool> isComp(N + 1, false);
    isComp[0] = isComp[1] = true;

    for (int i = 2; i * i <= N; i++) {
        if (!isComp[i]) {
            for (int j = i * i; j <= N; j += i) {
                isComp[j] = true;
            }
        }
    }

    for (int i = M; i <= N; i++) {
        if (!isComp[i]) cout << i << '\n';
    }

    return 0;
}
```

### 약수의 개수/합

```cpp
// 소인수분해 결과로 약수 관련 계산
// n = p1^a1 * p2^a2 * ... * pk^ak

// 약수의 개수: (a1+1) * (a2+1) * ... * (ak+1)
// 약수의 합: (p1^0 + ... + p1^a1) * (p2^0 + ... + p2^a2) * ...

long long divisorCount(long long n) {
    long long cnt = 1;
    for (long long p = 2; p * p <= n; p++) {
        int a = 0;
        while (n % p == 0) { n /= p; a++; }
        cnt *= (a + 1);
    }
    if (n > 1) cnt *= 2;
    return cnt;
}
```

### 오일러 피 함수

```cpp
// φ(n): 1~n 중 n과 서로소인 수의 개수
// φ(n) = n * ∏(1 - 1/p) (p는 n의 소인수)
long long eulerPhi(long long n) {
    long long result = n;

    for (long long p = 2; p * p <= n; p++) {
        if (n % p == 0) {
            while (n % p == 0) n /= p;
            result -= result / p;
        }
    }

    if (n > 1) result -= result / n;

    return result;
}
```

## 주의사항 / Edge Cases

### 1은 소수가 아님

```cpp
if (n < 2) return false;
```

### 체 메모리

```cpp
// 에라토스테네스의 체: bool 배열 10^7까지 가능 (10MB)
// 10^8이면 비트셋 사용
bitset<100000001> isComp;
```

### 큰 수의 소인수분해

```cpp
// n ≤ 10^18일 때 O(√N) = O(10^9) → 시간 초과 가능
// 밀러-라빈 + 폴라드 로 알고리즘 사용
```

### j = i * i 시작

```cpp
// 체에서 i의 배수를 제거할 때 i*i부터 시작
// i*2, i*3, ..., i*(i-1)은 이전 소수에서 이미 처리됨
for (int j = i * i; j <= n; j += i)  // i*i가 int 오버플로우 주의
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 에라토스테네스의 체의 원리와 시간복잡도는?**
> - 2부터 시작하여 각 소수의 배수를 제거
> - 시간복잡도: O(N log log N) ≈ 거의 O(N)
> - i*i부터 시작하는 최적화로 상수 절감

**Q2. 소수 판별을 √N까지만 확인하면 되는 이유는?**
> - n이 합성수면 n = a·b, 이때 min(a, b) ≤ √n
> - √n까지의 약수가 없으면 소수

**Q3. 밀러-라빈은 언제 사용하는가?**
> - n이 매우 클 때 (10^18 등) 에라토스테네스의 체를 쓸 수 없을 때
> - 확률적 방법이지만, 적절한 base를 선택하면 결정론적으로 사용 가능

**Q4. 오일러 피 함수란?**
> - φ(n): 1~n 중 n과 서로소인 정수의 개수
> - φ(p) = p-1 (p가 소수)
> - φ(n) = n · ∏(1 - 1/p)
> - RSA 암호의 핵심

**Q5. 소인수분해를 O(log N)에 하는 방법은?**
> - SPF (Smallest Prime Factor) 배열을 전처리
> - n을 spf[n]으로 계속 나누면 O(log N)에 분해 가능

### 코드 체크리스트

```cpp
// 에라토스테네스의 체
// 1. bool 배열 선언 (0, 1 = 합성수)
// 2. i = 2부터, i*i <= n까지
// 3. j = i*i부터 i씩 증가하며 제거

// 소수 판별
// 1. n < 2 → false
// 2. i = 2부터 i*i <= n까지 나누어봄
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 소수 구하기 | [BOJ 1929](https://www.acmicpc.net/problem/1929) | 에라토스테네스 |
| Silver | 소수 찾기 | [BOJ 1978](https://www.acmicpc.net/problem/1978) | 기본 판별 |
| Gold | 골드바흐의 추측 | [BOJ 6588](https://www.acmicpc.net/problem/6588) | 체 + 응용 |
| Gold | 소인수분해 | [BOJ 11653](https://www.acmicpc.net/problem/11653) | 기본 소인수분해 |
| Gold | 소수의 연속합 | [BOJ 1644](https://www.acmicpc.net/problem/1644) | 체 + 투 포인터 |
| Platinum | 큰 수 소인수분해 | [BOJ 4149](https://www.acmicpc.net/problem/4149) | 밀러-라빈 + 폴라드 로 |
