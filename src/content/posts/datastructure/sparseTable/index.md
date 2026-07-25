---
title: 18. Sparse Table
slug: sparseTable
publishedAt: '2025-12-18'
categories: datastructure
math: false
---

## 개념

희소 테이블(Sparse Table)은 정적 배열에서 구간 질의를 O(1)에 처리하기 위한 자료구조이다. 특히 **멱등 연산**(min, max, gcd 등)에 적합하다.

### 멱등 연산 (Idempotent)

```
f(a, a) = a 인 연산
- min(a, a) = a
- max(a, a) = a
- gcd(a, a) = a
- OR(a, a) = a
- AND(a, a) = a
```

### 세그먼트 트리와 비교

| 항목 | 희소 테이블 | 세그먼트 트리 |
|------|-------------|---------------|
| 전처리 | O(N log N) | O(N) |
| 쿼리 (멱등 연산) | O(1) | O(log N) |
| 쿼리 (합) | O(log N) | O(log N) |
| 업데이트 | 불가능 (정적) | O(log N) |
| 공간 | O(N log N) | O(N) |

### 핵심 아이디어

- `sparse[i][k]` = i부터 2^k개 원소에 대한 연산 결과
- 구간 [L, R]을 2개의 겹치는 2^k 크기 구간으로 덮음
- 멱등 연산이므로 겹쳐도 결과 동일

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 전처리 | O(N log N) | 희소 테이블 구축 |
| 쿼리 (멱등) | O(1) | min, max, gcd |
| 쿼리 (비멱등) | O(log N) | sum (세그먼트 트리 권장) |

## 구현 (No-STL)

### 구간 최솟값 (RMQ)

```cpp
const int MAX_N = 100001;
const int LOG = 17;

int arr[MAX_N];
int sparse[MAX_N][LOG];  // sparse[i][k] = [i, i + 2^k - 1] 최솟값
int logTable[MAX_N];     // log2 미리 계산
int n;

void buildLog() {
    logTable[1] = 0;
    for (int i = 2; i <= n; i++) {
        logTable[i] = logTable[i / 2] + 1;
    }
}

void buildSparse() {
    // k = 0: 길이 1
    for (int i = 0; i < n; i++) {
        sparse[i][0] = arr[i];
    }

    // k >= 1: 두 구간 합치기
    for (int k = 1; k < LOG; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            int left = sparse[i][k - 1];
            int right = sparse[i + (1 << (k - 1))][k - 1];
            sparse[i][k] = (left < right) ? left : right;
        }
    }
}

int query(int L, int R) {
    int k = logTable[R - L + 1];
    int left = sparse[L][k];
    int right = sparse[R - (1 << k) + 1][k];
    return (left < right) ? left : right;
}
```

### 구간 최댓값

```cpp
const int MAX_N = 100001;
const int LOG = 17;

int sparse[MAX_N][LOG];
int logTable[MAX_N];
int n;

void build(int arr[]) {
    logTable[1] = 0;
    for (int i = 2; i <= n; i++) {
        logTable[i] = logTable[i / 2] + 1;
    }

    for (int i = 0; i < n; i++) {
        sparse[i][0] = arr[i];
    }

    for (int k = 1; k < LOG; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            int left = sparse[i][k - 1];
            int right = sparse[i + (1 << (k - 1))][k - 1];
            sparse[i][k] = (left > right) ? left : right;
        }
    }
}

int queryMax(int L, int R) {
    int k = logTable[R - L + 1];
    int left = sparse[L][k];
    int right = sparse[R - (1 << k) + 1][k];
    return (left > right) ? left : right;
}
```

### 구간 GCD

```cpp
const int MAX_N = 100001;
const int LOG = 17;

int sparse[MAX_N][LOG];
int logTable[MAX_N];
int n;

int gcd(int a, int b) {
    while (b) {
        int temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}

void build(int arr[]) {
    logTable[1] = 0;
    for (int i = 2; i <= n; i++) {
        logTable[i] = logTable[i / 2] + 1;
    }

    for (int i = 0; i < n; i++) {
        sparse[i][0] = arr[i];
    }

    for (int k = 1; k < LOG; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            sparse[i][k] = gcd(sparse[i][k - 1], sparse[i + (1 << (k - 1))][k - 1]);
        }
    }
}

int queryGcd(int L, int R) {
    int k = logTable[R - L + 1];
    return gcd(sparse[L][k], sparse[R - (1 << k) + 1][k]);
}
```

### 인덱스 반환 (최솟값의 위치)

```cpp
const int MAX_N = 100001;
const int LOG = 17;

int arr[MAX_N];
int sparse[MAX_N][LOG];  // 최솟값의 인덱스 저장
int logTable[MAX_N];
int n;

void build() {
    logTable[1] = 0;
    for (int i = 2; i <= n; i++) {
        logTable[i] = logTable[i / 2] + 1;
    }

    for (int i = 0; i < n; i++) {
        sparse[i][0] = i;
    }

    for (int k = 1; k < LOG; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            int leftIdx = sparse[i][k - 1];
            int rightIdx = sparse[i + (1 << (k - 1))][k - 1];
            sparse[i][k] = (arr[leftIdx] <= arr[rightIdx]) ? leftIdx : rightIdx;
        }
    }
}

int queryMinIndex(int L, int R) {
    int k = logTable[R - L + 1];
    int leftIdx = sparse[L][k];
    int rightIdx = sparse[R - (1 << k) + 1][k];
    return (arr[leftIdx] <= arr[rightIdx]) ? leftIdx : rightIdx;
}
```

### 구조체로 캡슐화

```cpp
const int MAX_N = 100001;
const int LOG = 17;

struct SparseTable {
    int sparse[MAX_N][LOG];
    int logTable[MAX_N];
    int n;

    void build(int arr[], int size) {
        n = size;

        logTable[1] = 0;
        for (int i = 2; i <= n; i++) {
            logTable[i] = logTable[i / 2] + 1;
        }

        for (int i = 0; i < n; i++) {
            sparse[i][0] = arr[i];
        }

        for (int k = 1; k < LOG; k++) {
            for (int i = 0; i + (1 << k) <= n; i++) {
                sparse[i][k] = min(sparse[i][k - 1],
                                   sparse[i + (1 << (k - 1))][k - 1]);
            }
        }
    }

    int min(int a, int b) { return (a < b) ? a : b; }

    int query(int L, int R) {
        int k = logTable[R - L + 1];
        return min(sparse[L][k], sparse[R - (1 << k) + 1][k]);
    }
};
```

## STL

### 표준 라이브러리 활용

```cpp
#include <vector>
#include <algorithm>
#include <cmath>

class SparseTable {
    std::vector<std::vector<int>> sparse;
    std::vector<int> logTable;
    int n;

public:
    void build(std::vector<int>& arr) {
        n = arr.size();
        int LOG = std::log2(n) + 1;

        logTable.resize(n + 1);
        logTable[1] = 0;
        for (int i = 2; i <= n; i++) {
            logTable[i] = logTable[i / 2] + 1;
        }

        sparse.assign(n, std::vector<int>(LOG));

        for (int i = 0; i < n; i++) {
            sparse[i][0] = arr[i];
        }

        for (int k = 1; k < LOG; k++) {
            for (int i = 0; i + (1 << k) <= n; i++) {
                sparse[i][k] = std::min(sparse[i][k - 1],
                                        sparse[i + (1 << (k - 1))][k - 1]);
            }
        }
    }

    int query(int L, int R) {
        int k = logTable[R - L + 1];
        return std::min(sparse[L][k], sparse[R - (1 << k) + 1][k]);
    }
};
```

## 사용 예시

### LCA (오일러 투어 + RMQ)

```cpp
const int MAX_N = 100001;
const int LOG = 18;

int euler[MAX_N * 2];     // 오일러 투어 순서
int first[MAX_N];         // 각 노드의 첫 등장 위치
int depth[MAX_N * 2];     // 오일러 투어 시 깊이
int eulerIdx;

int sparse[MAX_N * 2][LOG];  // depth 기준 최솟값의 인덱스
int logTable[MAX_N * 2];

void dfs(int cur, int par, int d) {
    first[cur] = eulerIdx;
    euler[eulerIdx] = cur;
    depth[eulerIdx] = d;
    eulerIdx++;

    for (int next : adj[cur]) {
        if (next != par) {
            dfs(next, cur, d + 1);
            euler[eulerIdx] = cur;
            depth[eulerIdx] = d;
            eulerIdx++;
        }
    }
}

void buildRMQ() {
    int n = eulerIdx;
    logTable[1] = 0;
    for (int i = 2; i <= n; i++) {
        logTable[i] = logTable[i / 2] + 1;
    }

    for (int i = 0; i < n; i++) {
        sparse[i][0] = i;
    }

    for (int k = 1; k < LOG; k++) {
        for (int i = 0; i + (1 << k) <= n; i++) {
            int l = sparse[i][k - 1];
            int r = sparse[i + (1 << (k - 1))][k - 1];
            sparse[i][k] = (depth[l] < depth[r]) ? l : r;
        }
    }
}

int lca(int u, int v) {
    int L = first[u];
    int R = first[v];
    if (L > R) { int t = L; L = R; R = t; }

    int k = logTable[R - L + 1];
    int l = sparse[L][k];
    int r = sparse[R - (1 << k) + 1][k];
    int minIdx = (depth[l] < depth[r]) ? l : r;

    return euler[minIdx];
}
```

### 2D Sparse Table

```cpp
const int MAX_N = 501;
const int LOG = 9;

int sparse[MAX_N][MAX_N][LOG][LOG];

void build(int grid[][MAX_N], int n, int m) {
    // k1 = 0, k2 = 0
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            sparse[i][j][0][0] = grid[i][j];
        }
    }

    // 열 방향 확장
    for (int k2 = 1; k2 < LOG; k2++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j + (1 << k2) <= m; j++) {
                sparse[i][j][0][k2] = min(
                    sparse[i][j][0][k2 - 1],
                    sparse[i][j + (1 << (k2 - 1))][0][k2 - 1]
                );
            }
        }
    }

    // 행 방향 확장
    for (int k1 = 1; k1 < LOG; k1++) {
        for (int k2 = 0; k2 < LOG; k2++) {
            for (int i = 0; i + (1 << k1) <= n; i++) {
                for (int j = 0; j + (1 << k2) <= m; j++) {
                    sparse[i][j][k1][k2] = min(
                        sparse[i][j][k1 - 1][k2],
                        sparse[i + (1 << (k1 - 1))][j][k1 - 1][k2]
                    );
                }
            }
        }
    }
}

int query2D(int r1, int c1, int r2, int c2) {
    int k1 = logTable[r2 - r1 + 1];
    int k2 = logTable[c2 - c1 + 1];

    int a = sparse[r1][c1][k1][k2];
    int b = sparse[r1][c2 - (1 << k2) + 1][k1][k2];
    int c = sparse[r2 - (1 << k1) + 1][c1][k1][k2];
    int d = sparse[r2 - (1 << k1) + 1][c2 - (1 << k2) + 1][k1][k2];

    return min(min(a, b), min(c, d));
}
```

## 주의사항 / Edge Cases

### LOG 값 설정

```cpp
// LOG = ceil(log2(N)) + 1
// N = 100,000 → LOG = 17
// N = 1,000,000 → LOG = 20

const int LOG = 17;  // 안전하게 넉넉히
```

### 0-indexed vs 1-indexed

```cpp
// 0-indexed (일반적)
for (int i = 0; i < n; i++) {
    sparse[i][0] = arr[i];
}
query(0, n - 1);

// 1-indexed
for (int i = 1; i <= n; i++) {
    sparse[i][0] = arr[i];
}
query(1, n);
```

### 구간 길이와 k 계산

```cpp
// 구간 [L, R]의 길이 = R - L + 1
int k = logTable[R - L + 1];

// 두 구간: [L, L + 2^k - 1] 와 [R - 2^k + 1, R]
int left = sparse[L][k];
int right = sparse[R - (1 << k) + 1][k];
```

### 비멱등 연산

```cpp
// 합은 O(1)에 처리 불가능 (겹치면 중복 계산)
// O(log N)에는 가능하지만 세그먼트 트리 권장

int querySumSlow(int L, int R) {
    int result = 0;
    for (int k = LOG - 1; k >= 0; k--) {
        if (L + (1 << k) - 1 <= R) {
            result += sparse[L][k];
            L += (1 << k);
        }
    }
    return result;
}
```

### 업데이트 불가

```cpp
// 희소 테이블은 정적 자료구조
// 업데이트가 필요하면 세그먼트 트리 사용

// 가능: 쿼리만 있는 경우
// 불가능: 값 변경 + 쿼리
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Gold | 최솟값과 최댓값 | [BOJ 2357](https://www.acmicpc.net/problem/2357) |
| Platinum | LCA 2 | [BOJ 11438](https://www.acmicpc.net/problem/11438) |
| Platinum | 합성함수와 쿼리 | [BOJ 17435](https://www.acmicpc.net/problem/17435) |
| Platinum | 구간 합 구하기 | [BOJ 2042](https://www.acmicpc.net/problem/2042) |
| Platinum | 수열과 쿼리 3 | [BOJ 13544](https://www.acmicpc.net/problem/13544) |
