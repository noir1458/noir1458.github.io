---
title: 22. 문자열 알고리즘
tags: algorithm
categories: algorithm
---

## 개념

텍스트 내에서 패턴을 효율적으로 찾는 알고리즘들이다.

### 핵심 특징

- **브루트포스**: O(NM) - 모든 위치에서 비교
- **KMP**: O(N+M) - 실패 함수로 불필요한 비교 생략
- **라빈-카프**: O(N+M) 평균 - 해싱으로 빠른 비교
- **Z 알고리즘**: O(N+M) - Z 배열로 매칭

## KMP 알고리즘

패턴의 접두사/접미사 정보를 활용하여 불필요한 비교를 건너뛴다.

### 실패 함수

```
실패 함수 (pi 배열):
  pi[i] = pattern[0..i]의 접두사이면서 접미사인 최대 길이

예: pattern = "ABAABAB"
  i:    0 1 2 3 4 5 6
  char: A B A A B A B
  pi:   0 0 1 1 2 3 2

pi[5]=3: "ABAABA"의 접두사이자 접미사 = "ABA" (길이 3)
```

### 구현

```cpp
#include <bits/stdc++.h>
using namespace std;

// 실패 함수 계산
vector<int> getFailure(const string& pattern) {
    int m = pattern.size();
    vector<int> pi(m, 0);
    int j = 0;

    for (int i = 1; i < m; i++) {
        while (j > 0 && pattern[i] != pattern[j]) {
            j = pi[j - 1];
        }
        if (pattern[i] == pattern[j]) {
            pi[i] = ++j;
        }
    }

    return pi;
}

// KMP 매칭
vector<int> kmpSearch(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    vector<int> pi = getFailure(pattern);
    vector<int> result;
    int j = 0;

    for (int i = 0; i < n; i++) {
        while (j > 0 && text[i] != pattern[j]) {
            j = pi[j - 1];
        }
        if (text[i] == pattern[j]) {
            j++;
            if (j == m) {
                result.push_back(i - m + 1);  // 매칭 시작 위치
                j = pi[j - 1];
            }
        }
    }

    return result;
}
```

## 라빈-카프 알고리즘

문자열을 해시값으로 변환하여 비교한다.

### 해싱

```
롤링 해시:
  hash("ABC") = A·31² + B·31¹ + C·31⁰

윈도우 이동 시:
  hash("BCD") = (hash("ABC") - A·31²) · 31 + D

한 번에 O(1)로 다음 해시 계산
```

### 구현

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> rabinKarp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    if (n < m) return {};

    const long long MOD = 1e9 + 7;
    const long long BASE = 31;

    vector<int> result;

    // 패턴 해시 & 첫 윈도우 해시
    long long patHash = 0, txtHash = 0, power = 1;

    for (int i = 0; i < m; i++) {
        patHash = (patHash * BASE + pattern[i]) % MOD;
        txtHash = (txtHash * BASE + text[i]) % MOD;
        if (i > 0) power = power * BASE % MOD;
    }

    for (int i = 0; i <= n - m; i++) {
        if (txtHash == patHash) {
            // 해시 충돌 방지: 실제 비교
            if (text.substr(i, m) == pattern) {
                result.push_back(i);
            }
        }

        if (i < n - m) {
            // 롤링 해시
            txtHash = ((txtHash - text[i] * power % MOD + MOD) * BASE
                       + text[i + m]) % MOD;
        }
    }

    return result;
}
```

## Z 알고리즘

Z[i] = 문자열 S[i..]와 S의 최장 공통 접두사 길이

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> zFunction(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;

    for (int i = 1; i < n; i++) {
        if (i < r) {
            z[i] = min(r - i, z[i - l]);
        }

        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }

        if (i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }

    return z;
}

// Z 알고리즘으로 패턴 매칭
vector<int> zSearch(const string& text, const string& pattern) {
    string combined = pattern + "$" + text;  // 구분자 $
    vector<int> z = zFunction(combined);
    vector<int> result;
    int m = pattern.size();

    for (int i = m + 1; i < (int)combined.size(); i++) {
        if (z[i] == m) {
            result.push_back(i - m - 1);
        }
    }

    return result;
}
```

## 비교 정리

| 알고리즘 | 시간복잡도 | 공간복잡도 | 특징 |
|---------|-----------|-----------|------|
| 브루트포스 | O(NM) | O(1) | 구현 간단 |
| **KMP** | **O(N+M)** | O(M) | 실패 함수 기반, 가장 범용적 |
| 라빈-카프 | O(N+M) 평균 | O(1) | 해싱, 다중 패턴에 유리 |
| Z | O(N+M) | O(N+M) | Z 배열 기반 |

## 사용 예시

### 부분 문자열 찾기 (KMP)

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    string T, P;
    getline(cin, T);
    getline(cin, P);

    int n = T.size(), m = P.size();

    // 실패 함수
    vector<int> pi(m, 0);
    for (int i = 1, j = 0; i < m; i++) {
        while (j > 0 && P[i] != P[j]) j = pi[j - 1];
        if (P[i] == P[j]) pi[i] = ++j;
    }

    // 매칭
    vector<int> matches;
    for (int i = 0, j = 0; i < n; i++) {
        while (j > 0 && T[i] != P[j]) j = pi[j - 1];
        if (T[i] == P[j]) {
            if (++j == m) {
                matches.push_back(i - m + 2);  // 1-indexed
                j = pi[j - 1];
            }
        }
    }

    cout << matches.size() << '\n';
    for (int pos : matches) cout << pos << '\n';

    return 0;
}
```

### 문자열 주기 찾기

```cpp
// KMP 실패 함수로 문자열의 최소 주기 구하기
// 최소 주기 = n - pi[n-1]

string s;
cin >> s;
int n = s.size();

vector<int> pi = getFailure(s);

int period = n - pi[n - 1];

// n이 period로 나누어 떨어지면 완전한 반복
if (n % period == 0) {
    cout << "주기: " << period << ", 반복 횟수: " << n / period << '\n';
}
```

## 주의사항 / Edge Cases

### 해시 충돌 (라빈-카프)

```cpp
// 해시가 같아도 실제 문자열이 다를 수 있음
// 반드시 해시 일치 후 실제 비교 필요
if (txtHash == patHash && text.substr(i, m) == pattern) {
    // 진짜 매치
}

// 이중 해싱으로 충돌 확률 줄이기
// MOD1과 MOD2를 다르게 사용
```

### 빈 패턴

```cpp
// 패턴이 빈 문자열이면 모든 위치에서 매칭
if (pattern.empty()) { /* 특수 처리 */ }
```

### 음수 해시값 (라빈-카프)

```cpp
// 모듈러 연산에서 음수 방지
txtHash = ((txtHash - text[i] * power % MOD + MOD) * BASE + text[i + m]) % MOD;
//                                          ^^^^ MOD 더해서 음수 방지
```

## 면접 포인트

### 자주 나오는 질문

**Q1. KMP의 원리는?**
> - 실패 함수(pi 배열)로 매칭 실패 시 어디까지 건너뛸 수 있는지 미리 계산
> - 접두사 == 접미사인 최대 길이를 활용
> - 텍스트 포인터는 절대 뒤로 가지 않음 → O(N+M)

**Q2. 실패 함수의 의미는?**
> - pi[i]: pattern[0..i]에서 접두사이면서 접미사인 최대 길이
> - 매칭 실패 시 j = pi[j-1]로 점프하여 불필요한 비교 생략

**Q3. 라빈-카프의 장점은?**
> - 다중 패턴 매칭에 유리 (여러 패턴의 해시를 동시에 비교)
> - 구현이 비교적 간단
> - 단점: 해시 충돌 시 O(NM)으로 퇴화 가능

**Q4. 문자열의 최소 주기를 구하는 방법은?**
> - KMP 실패 함수 사용
> - 최소 주기 = n - pi[n-1]
> - n이 주기로 나누어 떨어지면 완전한 반복

### 코드 체크리스트

```cpp
// KMP
// 1. 실패 함수 계산 (pi 배열)
// 2. 텍스트 순회하며 매칭
// 3. j == m이면 매칭 발견, j = pi[j-1]로 이동
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Gold | 찾기 | [BOJ 1786](https://www.acmicpc.net/problem/1786) | KMP 기본 |
| Gold | 부분 문자열 | [BOJ 16916](https://www.acmicpc.net/problem/16916) | KMP 기본 |
| Platinum | 문자열 제곱 | [BOJ 4354](https://www.acmicpc.net/problem/4354) | KMP + 주기 |
| Platinum | Cubeditor | [BOJ 1701](https://www.acmicpc.net/problem/1701) | KMP 응용 |
| Gold | 라빈-카프 | [BOJ 1786](https://www.acmicpc.net/problem/1786) | 해싱 매칭 |
| Platinum | 접미사 배열 | [BOJ 9248](https://www.acmicpc.net/problem/9248) | 문자열 심화 |
