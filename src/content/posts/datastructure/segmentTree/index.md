---
title: 10. 세그먼트 트리 (Segment Tree)
slug: segmentTree
publishedAt: '2025-12-10'
categories: datastructure
math: false
---

## 개념

세그먼트 트리(Segment Tree)는 구간에 대한 질의와 업데이트를 효율적으로 처리하는 이진 트리 자료구조이다.

### 특징

| 특징 | 설명 |
|------|------|
| 구간 질의 | 구간 합, 최솟값, 최댓값 등을 O(log N)에 계산 |
| 점 업데이트 | 특정 인덱스 값 변경 후 O(log N)에 갱신 |
| 구간 업데이트 | Lazy Propagation으로 구간 업데이트도 O(log N) |

### 구조

```
              [0,7]
           /        \
       [0,3]         [4,7]
       /   \         /   \
    [0,1]  [2,3]  [4,5]  [6,7]
    / \    / \    / \    / \
  [0] [1] [2] [3] [4] [5] [6] [7]
```

### 트리 크기

- 배열 크기 N일 때, 트리 크기는 **4N** 할당하면 안전
- 정확히는 2^(ceil(log₂N) + 1)

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 구축 (Build) | O(N) | 배열로부터 트리 생성 |
| 점 업데이트 (Update) | O(log N) | 한 원소 값 변경 |
| 구간 질의 (Query) | O(log N) | 구간 합/최솟값/최댓값 등 |
| 구간 업데이트 (Lazy) | O(log N) | 구간 전체에 연산 적용 |

## 구현 (No-STL)

### 구간 합 세그먼트 트리

```cpp
const int MAX_N = 100001;

int arr[MAX_N];
long long tree[MAX_N * 4];
int n;

// 트리 구축
long long build(int node, int start, int end) {
    if (start == end) {
        return tree[node] = arr[start];
    }
    int mid = (start + end) / 2;
    long long left = build(node * 2, start, mid);
    long long right = build(node * 2 + 1, mid + 1, end);
    return tree[node] = left + right;
}

// 점 업데이트: arr[idx]를 val로 변경
void update(int node, int start, int end, int idx, int val) {
    if (idx < start || idx > end) return;

    if (start == end) {
        arr[idx] = val;
        tree[node] = val;
        return;
    }

    int mid = (start + end) / 2;
    update(node * 2, start, mid, idx, val);
    update(node * 2 + 1, mid + 1, end, idx, val);
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

// 구간 합 질의: [left, right]
long long query(int node, int start, int end, int left, int right) {
    if (right < start || end < left) return 0;  // 구간 밖

    if (left <= start && end <= right) {
        return tree[node];  // 구간 완전히 포함
    }

    int mid = (start + end) / 2;
    long long l = query(node * 2, start, mid, left, right);
    long long r = query(node * 2 + 1, mid + 1, end, left, right);
    return l + r;
}

// 사용
// build(1, 0, n - 1);
// query(1, 0, n - 1, L, R);
// update(1, 0, n - 1, idx, val);
```

### 구간 최솟값 세그먼트 트리

```cpp
const int MAX_N = 100001;
const int INF = 1e9;

int arr[MAX_N];
int tree[MAX_N * 4];
int n;

int build(int node, int start, int end) {
    if (start == end) {
        return tree[node] = arr[start];
    }
    int mid = (start + end) / 2;
    int left = build(node * 2, start, mid);
    int right = build(node * 2 + 1, mid + 1, end);
    return tree[node] = (left < right) ? left : right;
}

void update(int node, int start, int end, int idx, int val) {
    if (idx < start || idx > end) return;

    if (start == end) {
        arr[idx] = val;
        tree[node] = val;
        return;
    }

    int mid = (start + end) / 2;
    update(node * 2, start, mid, idx, val);
    update(node * 2 + 1, mid + 1, end, idx, val);
    tree[node] = (tree[node * 2] < tree[node * 2 + 1]) ? tree[node * 2] : tree[node * 2 + 1];
}

int query(int node, int start, int end, int left, int right) {
    if (right < start || end < left) return INF;

    if (left <= start && end <= right) {
        return tree[node];
    }

    int mid = (start + end) / 2;
    int l = query(node * 2, start, mid, left, right);
    int r = query(node * 2 + 1, mid + 1, end, left, right);
    return (l < r) ? l : r;
}
```

### 구간 최댓값 세그먼트 트리

```cpp
const int NEG_INF = -1e9;

int build(int node, int start, int end) {
    if (start == end) {
        return tree[node] = arr[start];
    }
    int mid = (start + end) / 2;
    int left = build(node * 2, start, mid);
    int right = build(node * 2 + 1, mid + 1, end);
    return tree[node] = (left > right) ? left : right;
}

int query(int node, int start, int end, int left, int right) {
    if (right < start || end < left) return NEG_INF;

    if (left <= start && end <= right) {
        return tree[node];
    }

    int mid = (start + end) / 2;
    int l = query(node * 2, start, mid, left, right);
    int r = query(node * 2 + 1, mid + 1, end, left, right);
    return (l > r) ? l : r;
}
```

### Lazy Propagation (구간 업데이트)

```cpp
const int MAX_N = 100001;

long long tree[MAX_N * 4];
long long lazy[MAX_N * 4];

void propagate(int node, int start, int end) {
    if (lazy[node] != 0) {
        tree[node] += lazy[node] * (end - start + 1);
        if (start != end) {
            lazy[node * 2] += lazy[node];
            lazy[node * 2 + 1] += lazy[node];
        }
        lazy[node] = 0;
    }
}

// 구간 [left, right]에 val을 더함
void updateRange(int node, int start, int end, int left, int right, long long val) {
    propagate(node, start, end);

    if (right < start || end < left) return;

    if (left <= start && end <= right) {
        lazy[node] += val;
        propagate(node, start, end);
        return;
    }

    int mid = (start + end) / 2;
    updateRange(node * 2, start, mid, left, right, val);
    updateRange(node * 2 + 1, mid + 1, end, left, right, val);
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

long long queryRange(int node, int start, int end, int left, int right) {
    propagate(node, start, end);

    if (right < start || end < left) return 0;

    if (left <= start && end <= right) {
        return tree[node];
    }

    int mid = (start + end) / 2;
    long long l = queryRange(node * 2, start, mid, left, right);
    long long r = queryRange(node * 2 + 1, mid + 1, end, left, right);
    return l + r;
}
```

### 비재귀 세그먼트 트리 (Bottom-Up)

```cpp
const int MAX_N = 100001;

long long tree[MAX_N * 2];
int n;

void build(int arr[], int size) {
    n = size;
    // 리프 노드에 값 저장
    for (int i = 0; i < n; i++) {
        tree[n + i] = arr[i];
    }
    // 내부 노드 계산
    for (int i = n - 1; i > 0; i--) {
        tree[i] = tree[i * 2] + tree[i * 2 + 1];
    }
}

void update(int idx, int val) {
    idx += n;
    tree[idx] = val;
    while (idx > 1) {
        idx /= 2;
        tree[idx] = tree[idx * 2] + tree[idx * 2 + 1];
    }
}

// [left, right) 반개구간
long long query(int left, int right) {
    long long result = 0;
    left += n;
    right += n;
    while (left < right) {
        if (left & 1) result += tree[left++];
        if (right & 1) result += tree[--right];
        left /= 2;
        right /= 2;
    }
    return result;
}
```

## STL

C++ STL에는 세그먼트 트리가 없으므로 직접 구현해야 한다.

### 템플릿 활용

```cpp
#include <vector>
#include <functional>

template<typename T>
class SegmentTree {
    std::vector<T> tree;
    int n;
    T identity;
    std::function<T(T, T)> merge;

public:
    SegmentTree(std::vector<T>& arr, T id, std::function<T(T, T)> f)
        : identity(id), merge(f) {
        n = arr.size();
        tree.resize(4 * n);
        build(arr, 1, 0, n - 1);
    }

    void build(std::vector<T>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(arr, node * 2, start, mid);
        build(arr, node * 2 + 1, mid + 1, end);
        tree[node] = merge(tree[node * 2], tree[node * 2 + 1]);
    }

    void update(int idx, T val) {
        update(1, 0, n - 1, idx, val);
    }

    void update(int node, int start, int end, int idx, T val) {
        if (idx < start || idx > end) return;
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = (start + end) / 2;
        update(node * 2, start, mid, idx, val);
        update(node * 2 + 1, mid + 1, end, idx, val);
        tree[node] = merge(tree[node * 2], tree[node * 2 + 1]);
    }

    T query(int left, int right) {
        return query(1, 0, n - 1, left, right);
    }

    T query(int node, int start, int end, int left, int right) {
        if (right < start || end < left) return identity;
        if (left <= start && end <= right) return tree[node];
        int mid = (start + end) / 2;
        T l = query(node * 2, start, mid, left, right);
        T r = query(node * 2 + 1, mid + 1, end, left, right);
        return merge(l, r);
    }
};

// 사용 예시
// std::vector<int> arr = {1, 2, 3, 4, 5};
// SegmentTree<int> sumTree(arr, 0, [](int a, int b) { return a + b; });
// SegmentTree<int> minTree(arr, INT_MAX, [](int a, int b) { return std::min(a, b); });
```

## 사용 예시

### K번째 원소 찾기 (이진 탐색)

```cpp
// tree[node]에 구간 내 원소 개수 저장
// 1이 존재하면 1, 아니면 0

int kth(int node, int start, int end, int k) {
    if (start == end) return start;

    int mid = (start + end) / 2;
    if (tree[node * 2] >= k) {
        return kth(node * 2, start, mid, k);
    } else {
        return kth(node * 2 + 1, mid + 1, end, k - tree[node * 2]);
    }
}
```

### 좌표 압축 + 구간 합

```cpp
#include <vector>
#include <algorithm>
#include <map>

std::vector<long long> rangeSum(std::vector<int>& arr, std::vector<std::pair<int, int>>& queries) {
    // 좌표 압축
    std::vector<int> sorted = arr;
    std::sort(sorted.begin(), sorted.end());
    sorted.erase(std::unique(sorted.begin(), sorted.end()), sorted.end());

    std::map<int, int> compress;
    for (int i = 0; i < sorted.size(); i++) {
        compress[sorted[i]] = i;
    }

    // 압축된 인덱스로 세그먼트 트리 구축
    int n = sorted.size();
    std::vector<long long> tree(4 * n, 0);
    // ... 쿼리 처리
}
```

### 2D 세그먼트 트리

```cpp
const int MAX_N = 1001;

int tree[MAX_N * 4][MAX_N * 4];
int n, m;

void updateY(int nodeX, int startX, int endX, int nodeY, int startY, int endY, int y, int val) {
    if (y < startY || y > endY) return;
    if (startY == endY) {
        if (startX == endX) tree[nodeX][nodeY] = val;
        else tree[nodeX][nodeY] = tree[nodeX * 2][nodeY] + tree[nodeX * 2 + 1][nodeY];
        return;
    }
    int mid = (startY + endY) / 2;
    updateY(nodeX, startX, endX, nodeY * 2, startY, mid, y, val);
    updateY(nodeX, startX, endX, nodeY * 2 + 1, mid + 1, endY, y, val);
    tree[nodeX][nodeY] = tree[nodeX][nodeY * 2] + tree[nodeX][nodeY * 2 + 1];
}

void updateX(int nodeX, int startX, int endX, int x, int y, int val) {
    if (x < startX || x > endX) return;
    if (startX == endX) {
        updateY(nodeX, startX, endX, 1, 0, m - 1, y, val);
        return;
    }
    int mid = (startX + endX) / 2;
    updateX(nodeX * 2, startX, mid, x, y, val);
    updateX(nodeX * 2 + 1, mid + 1, endX, x, y, val);
    updateY(nodeX, startX, endX, 1, 0, m - 1, y, val);
}
```

### 구간 곱 (MOD 연산)

```cpp
const long long MOD = 1e9 + 7;

long long tree[MAX_N * 4];

long long build(int node, int start, int end) {
    if (start == end) return tree[node] = arr[start] % MOD;
    int mid = (start + end) / 2;
    long long left = build(node * 2, start, mid);
    long long right = build(node * 2 + 1, mid + 1, end);
    return tree[node] = (left * right) % MOD;
}

long long query(int node, int start, int end, int left, int right) {
    if (right < start || end < left) return 1;  // 곱셈 항등원
    if (left <= start && end <= right) return tree[node];
    int mid = (start + end) / 2;
    long long l = query(node * 2, start, mid, left, right);
    long long r = query(node * 2 + 1, mid + 1, end, left, right);
    return (l * r) % MOD;
}
```

## 주의사항 / Edge Cases

### 트리 크기 할당

```cpp
// N이 2의 거듭제곱이 아니면 트리 크기 부족할 수 있음
// 안전하게 4N 할당

int tree[MAX_N * 4];  // 올바름
int tree[MAX_N * 2];  // 부족할 수 있음
```

### 인덱스 범위

```cpp
// 0-indexed vs 1-indexed 일관성 유지

// 0-indexed 배열
build(1, 0, n - 1);
query(1, 0, n - 1, L, R);  // L, R도 0-indexed

// 1-indexed 배열
build(1, 1, n);
query(1, 1, n, L, R);      // L, R도 1-indexed
```

### 구간 밖 반환값 (항등원)

```cpp
// 연산에 따라 적절한 항등원 사용
// 합: 0
// 곱: 1
// 최솟값: INF
// 최댓값: -INF
// XOR: 0
// GCD: 0 (주의: gcd(0, x) = x)

int query(int node, int start, int end, int left, int right) {
    if (right < start || end < left) return 0;  // 합의 경우
    // ...
}
```

### Lazy Propagation 초기화

```cpp
// lazy 배열 초기화 필수
for (int i = 0; i < MAX_N * 4; i++) {
    lazy[i] = 0;
}

// 또는 memset
#include <cstring>
memset(lazy, 0, sizeof(lazy));
```

### 비재귀 세그먼트 트리 주의

```cpp
// 비재귀 버전은 반개구간 [left, right) 사용
query(L, R + 1);  // [L, R] 구간 질의

// N이 2의 거듭제곱이 아니면 처리 복잡
// 단순히 4N 할당하는 것과 다름
```

### 오버플로우

```cpp
// 구간 합에서 long long 필요한지 확인
// N개의 원소가 10^9까지면 합은 10^14까지

long long tree[MAX_N * 4];  // int 대신 long long
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Gold | 구간 합 구하기 | [BOJ 2042](https://www.acmicpc.net/problem/2042) |
| Gold | 최솟값과 최댓값 | [BOJ 2357](https://www.acmicpc.net/problem/2357) |
| Gold | 구간 곱 구하기 | [BOJ 11505](https://www.acmicpc.net/problem/11505) |
| Platinum | 수열과 쿼리 16 | [BOJ 14428](https://www.acmicpc.net/problem/14428) |
| Platinum | 구간 합 구하기 2 | [BOJ 10999](https://www.acmicpc.net/problem/10999) |
