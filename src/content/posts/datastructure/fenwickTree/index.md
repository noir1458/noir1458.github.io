---
title: 11. 펜윅 트리 (Fenwick Tree / BIT)
slug: fenwickTree
publishedAt: '2025-12-11'
categories: datastructure
math: false
---

## 개념

펜윅 트리(Fenwick Tree), 또는 이진 인덱스 트리(Binary Indexed Tree, BIT)는 구간 합을 효율적으로 계산하는 자료구조이다.

### 세그먼트 트리와 비교

| 항목 | 펜윅 트리 | 세그먼트 트리 |
|------|-----------|---------------|
| 메모리 | O(N) | O(4N) |
| 구현 난이도 | 쉬움 | 보통 |
| 점 업데이트 | O(log N) | O(log N) |
| 구간 합 | O(log N) | O(log N) |
| 구간 최솟값/최댓값 | 불가능 | 가능 |
| 구간 업데이트 | 제한적 | Lazy로 가능 |

### 핵심 아이디어

- 인덱스의 최하위 비트(LSB)를 이용해 구간 관리
- `i & -i`로 LSB 계산
- tree[i]는 특정 구간의 합을 저장

### 인덱스와 구간 관계 (1-indexed)

```
index  binary  LSB   구간
1      0001    1     [1, 1]
2      0010    2     [1, 2]
3      0011    1     [3, 3]
4      0100    4     [1, 4]
5      0101    1     [5, 5]
6      0110    2     [5, 6]
7      0111    1     [7, 7]
8      1000    8     [1, 8]
```

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 점 업데이트 | O(log N) | 특정 인덱스에 값 더하기 |
| 누적 합 (prefix sum) | O(log N) | [1, i] 구간의 합 |
| 구간 합 | O(log N) | sum(1, R) - sum(1, L-1) |
| 구축 | O(N log N) 또는 O(N) | 초기 배열로부터 생성 |

## 구현 (No-STL)

### 기본 구현 (1-indexed)

```cpp
const int MAX_N = 100001;

long long tree[MAX_N];
int n;

// 점 업데이트: arr[idx]에 delta를 더함
void update(int idx, long long delta) {
    while (idx <= n) {
        tree[idx] += delta;
        idx += (idx & -idx);  // 다음 노드로 이동
    }
}

// 누적 합: arr[1] + arr[2] + ... + arr[idx]
long long sum(int idx) {
    long long result = 0;
    while (idx > 0) {
        result += tree[idx];
        idx -= (idx & -idx);  // 이전 구간으로 이동
    }
    return result;
}

// 구간 합: arr[left] + ... + arr[right]
long long rangeSum(int left, int right) {
    return sum(right) - sum(left - 1);
}
```

### 초기화 방법

```cpp
// 방법 1: 개별 update (O(N log N))
void buildSlow(int arr[], int size) {
    n = size;
    for (int i = 0; i <= n; i++) tree[i] = 0;
    for (int i = 1; i <= n; i++) {
        update(i, arr[i]);
    }
}

// 방법 2: O(N) 구축
void buildFast(int arr[], int size) {
    n = size;
    for (int i = 0; i <= n; i++) tree[i] = 0;
    for (int i = 1; i <= n; i++) {
        tree[i] += arr[i];
        int parent = i + (i & -i);
        if (parent <= n) {
            tree[parent] += tree[i];
        }
    }
}
```

### 값 변경 (기존 값을 새 값으로)

```cpp
int arr[MAX_N];  // 원본 배열 유지

void setValue(int idx, int newVal) {
    int delta = newVal - arr[idx];
    arr[idx] = newVal;
    update(idx, delta);
}
```

### 0-indexed 버전

```cpp
const int MAX_N = 100001;

long long tree[MAX_N];
int n;

void update(int idx, long long delta) {
    for (; idx < n; idx |= (idx + 1)) {
        tree[idx] += delta;
    }
}

long long sum(int idx) {
    long long result = 0;
    for (; idx >= 0; idx = (idx & (idx + 1)) - 1) {
        result += tree[idx];
    }
    return result;
}

long long rangeSum(int left, int right) {
    long long result = sum(right);
    if (left > 0) result -= sum(left - 1);
    return result;
}
```

### 구간 업데이트 + 점 질의

```cpp
// diff[i] = arr[i] - arr[i-1] (차분 배열)
// 구간 [L, R]에 val을 더하려면:
// diff[L] += val, diff[R+1] -= val
// arr[i] = diff[1] + diff[2] + ... + diff[i] = sum(i)

long long tree[MAX_N];
int n;

void rangeAdd(int left, int right, long long val) {
    update(left, val);
    if (right + 1 <= n) {
        update(right + 1, -val);
    }
}

long long pointQuery(int idx) {
    return sum(idx);
}
```

### 구간 업데이트 + 구간 질의 (두 개의 BIT)

```cpp
long long tree1[MAX_N];  // 차분 배열의 BIT
long long tree2[MAX_N];  // i * diff[i]의 BIT
int n;

void update1(int idx, long long delta) {
    for (int i = idx; i <= n; i += (i & -i)) tree1[i] += delta;
}

void update2(int idx, long long delta) {
    for (int i = idx; i <= n; i += (i & -i)) tree2[i] += delta;
}

long long sum1(int idx) {
    long long result = 0;
    for (int i = idx; i > 0; i -= (i & -i)) result += tree1[i];
    return result;
}

long long sum2(int idx) {
    long long result = 0;
    for (int i = idx; i > 0; i -= (i & -i)) result += tree2[i];
    return result;
}

void rangeAdd(int left, int right, long long val) {
    update1(left, val);
    update1(right + 1, -val);
    update2(left, val * (left - 1));
    update2(right + 1, -val * right);
}

long long prefixSum(int idx) {
    return sum1(idx) * idx - sum2(idx);
}

long long rangeSum(int left, int right) {
    return prefixSum(right) - prefixSum(left - 1);
}
```

## STL

C++ STL에는 펜윅 트리가 없으므로 직접 구현해야 한다.

### 템플릿 클래스

```cpp
#include <vector>

template<typename T>
class FenwickTree {
    std::vector<T> tree;
    int n;

public:
    FenwickTree(int size) : n(size), tree(size + 1, 0) {}

    void update(int idx, T delta) {
        for (; idx <= n; idx += idx & -idx)
            tree[idx] += delta;
    }

    T sum(int idx) {
        T result = 0;
        for (; idx > 0; idx -= idx & -idx)
            result += tree[idx];
        return result;
    }

    T rangeSum(int left, int right) {
        return sum(right) - sum(left - 1);
    }
};

// 사용
// FenwickTree<long long> bit(n);
// bit.update(idx, delta);
// bit.rangeSum(L, R);
```

## 사용 예시

### 역순 쌍 개수 (Inversion Count)

```cpp
// arr[i] > arr[j]이고 i < j인 쌍의 개수
// 좌표 압축 후 뒤에서부터 삽입하며 카운트

long long countInversions(int arr[], int n) {
    // 좌표 압축
    int sorted[MAX_N];
    for (int i = 0; i < n; i++) sorted[i] = arr[i];
    // ... 정렬 후 압축

    for (int i = 0; i <= n; i++) tree[i] = 0;

    long long inversions = 0;
    for (int i = n - 1; i >= 0; i--) {
        inversions += sum(arr[i] - 1);  // arr[i]보다 작은 것의 개수
        update(arr[i], 1);
    }

    return inversions;
}
```

### K번째 원소 찾기 (이진 탐색)

```cpp
// tree에 원소 존재 여부 저장 (있으면 1, 없으면 0)
// K번째로 작은 원소 찾기

int kth(int k) {
    int idx = 0;
    int bitMask = 1 << 20;  // log2(MAX_N)보다 큰 2의 거듭제곱

    while (bitMask > 0) {
        int next = idx + bitMask;
        if (next <= n && tree[next] < k) {
            idx = next;
            k -= tree[next];
        }
        bitMask >>= 1;
    }

    return idx + 1;  // 1-indexed
}

void addElement(int x) {
    update(x, 1);
}

void removeElement(int x) {
    update(x, -1);
}
```

### 2D 펜윅 트리

```cpp
const int MAX = 1025;

long long tree[MAX][MAX];
int n, m;

void update(int x, int y, long long delta) {
    for (int i = x; i <= n; i += i & -i) {
        for (int j = y; j <= m; j += j & -j) {
            tree[i][j] += delta;
        }
    }
}

long long sum(int x, int y) {
    long long result = 0;
    for (int i = x; i > 0; i -= i & -i) {
        for (int j = y; j > 0; j -= j & -j) {
            result += tree[i][j];
        }
    }
    return result;
}

// 2D 구간 합: (x1, y1) ~ (x2, y2)
long long rangeSum(int x1, int y1, int x2, int y2) {
    return sum(x2, y2)
         - sum(x1 - 1, y2)
         - sum(x2, y1 - 1)
         + sum(x1 - 1, y1 - 1);
}
```

### 좌표 압축 + 펜윅 트리

```cpp
#include <algorithm>
#include <vector>

std::vector<int> coords;
int compress[MAX_N];

void compressCoords(int arr[], int n) {
    coords.clear();
    for (int i = 0; i < n; i++) {
        coords.push_back(arr[i]);
    }
    std::sort(coords.begin(), coords.end());
    coords.erase(std::unique(coords.begin(), coords.end()), coords.end());

    for (int i = 0; i < n; i++) {
        compress[i] = std::lower_bound(coords.begin(), coords.end(), arr[i])
                    - coords.begin() + 1;  // 1-indexed
    }
}
```

## 주의사항 / Edge Cases

### 1-indexed 사용

```cpp
// 펜윅 트리는 1-indexed가 표준
// 0-indexed로 변환 시 비트 연산이 달라짐

// 1-indexed
update(1, val);  // 첫 번째 원소
sum(n);          // 전체 합

// 배열 입력 시
for (int i = 1; i <= n; i++) {
    scanf("%d", &arr[i]);
    update(i, arr[i]);
}
```

### idx가 0이 되지 않도록

```cpp
// sum에서 idx가 0이 되면 무한 루프
long long sum(int idx) {
    long long result = 0;
    while (idx > 0) {  // idx > 0 체크 필수
        result += tree[idx];
        idx -= (idx & -idx);
    }
    return result;
}

// rangeSum에서 left가 1일 때
long long rangeSum(int left, int right) {
    if (left == 1) return sum(right);
    return sum(right) - sum(left - 1);
}
```

### 오버플로우

```cpp
// int 범위 초과 가능
// 합이 커질 수 있으면 long long 사용

long long tree[MAX_N];  // int 대신 long long
```

### 초기화

```cpp
// 전역 배열은 0으로 초기화되지만, 여러 테스트케이스에서 주의

void init() {
    for (int i = 0; i <= n; i++) {
        tree[i] = 0;
    }
}

// 또는 memset
#include <cstring>
memset(tree, 0, sizeof(tree));
```

### 구간 [0, R] 질의

```cpp
// 0-indexed에서 0부터 시작하는 구간 질의

// 잘못된 코드 (1-indexed 방식)
rangeSum(0, R);  // sum(-1) 호출됨

// 올바른 코드 (0-indexed 버전 사용하거나 1-indexed로 변환)
rangeSum(1, R + 1);  // 1-indexed로 변환
```

### 최솟값/최댓값 불가

```cpp
// 펜윅 트리로는 구간 최솟값/최댓값 불가능
// 이유: 구간을 분할하는 방식이 합에만 적용됨

// 최솟값/최댓값이 필요하면 세그먼트 트리 사용
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Gold | 구간 합 구하기 | [BOJ 2042](https://www.acmicpc.net/problem/2042) |
| Gold | 수열과 쿼리 21 | [BOJ 16975](https://www.acmicpc.net/problem/16975) |
| Platinum | 버블 소트 | [BOJ 1517](https://www.acmicpc.net/problem/1517) |
| Platinum | K번째 수 | [BOJ 7469](https://www.acmicpc.net/problem/7469) |
| Platinum | 수열과 쿼리 22 | [BOJ 16978](https://www.acmicpc.net/problem/16978) |
