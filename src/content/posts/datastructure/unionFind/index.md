---
title: 9. 유니온 파인드 (Disjoint Set)
slug: unionFind
publishedAt: '2025-12-09'
categories: datastructure
math: false
---

## 개념

유니온 파인드(Union-Find)는 서로소 집합(Disjoint Set)을 표현하고 관리하는 자료구조이다.

### 핵심 연산

| 연산 | 설명 |
|------|------|
| Find | 원소가 속한 집합의 대표(루트) 찾기 |
| Union | 두 집합을 하나로 합치기 |

### 특징

- 트리 구조로 집합 표현 (루트 = 대표 원소)
- 경로 압축, rank 최적화로 거의 O(1)에 수렴
- 그래프의 연결 요소, 사이클 판별 등에 활용

### 최적화 기법

| 기법 | 설명 | 효과 |
|------|------|------|
| 경로 압축 (Path Compression) | Find 시 모든 노드를 루트에 직접 연결 | 트리 높이 감소 |
| Union by Rank | 작은 트리를 큰 트리에 붙임 | 트리 높이 제한 |
| Union by Size | 원소 수가 적은 집합을 큰 집합에 붙임 | 트리 높이 제한 |

## 핵심 연산 & 시간복잡도

| 연산 | 최적화 없음 | 경로 압축만 | 경로 압축 + Rank |
|------|-------------|-------------|------------------|
| Find | O(N) | O(log N) 평균 | O(α(N)) ≈ O(1) |
| Union | O(N) | O(log N) 평균 | O(α(N)) ≈ O(1) |

※ α(N)은 아커만 함수의 역함수로, 실질적으로 상수

## 구현 (No-STL)

### 기본 구현 (경로 압축만)

```cpp
const int MAX_N = 100001;

int parent[MAX_N];

void init(int n) {
    for (int i = 0; i <= n; i++) {
        parent[i] = i;  // 자기 자신이 부모 (루트)
    }
}

// Find with Path Compression
int find(int x) {
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]);  // 경로 압축
}

// Union
void unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a != b) {
        parent[b] = a;
    }
}

// 같은 집합인지 확인
bool isSameSet(int a, int b) {
    return find(a) == find(b);
}
```

### Union by Rank

```cpp
const int MAX_N = 100001;

int parent[MAX_N];
int rank_[MAX_N];  // 트리의 높이 (대략)

void init(int n) {
    for (int i = 0; i <= n; i++) {
        parent[i] = i;
        rank_[i] = 0;
    }
}

int find(int x) {
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]);
}

void unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return;

    // rank가 낮은 트리를 높은 트리에 붙임
    if (rank_[a] < rank_[b]) {
        int temp = a; a = b; b = temp;
    }
    parent[b] = a;
    if (rank_[a] == rank_[b]) {
        rank_[a]++;
    }
}
```

### Union by Size (집합 크기 관리)

```cpp
const int MAX_N = 100001;

int parent[MAX_N];
int size_[MAX_N];  // 집합의 원소 개수

void init(int n) {
    for (int i = 0; i <= n; i++) {
        parent[i] = i;
        size_[i] = 1;
    }
}

int find(int x) {
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]);
}

void unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return;

    // 작은 집합을 큰 집합에 붙임
    if (size_[a] < size_[b]) {
        int temp = a; a = b; b = temp;
    }
    parent[b] = a;
    size_[a] += size_[b];
}

int getSize(int x) {
    return size_[find(x)];
}
```

### 구조체로 캡슐화

```cpp
const int MAX_N = 100001;

struct UnionFind {
    int parent[MAX_N];
    int rank_[MAX_N];

    void init(int n) {
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
            rank_[i] = 0;
        }
    }

    int find(int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;  // 이미 같은 집합

        if (rank_[a] < rank_[b]) {
            int temp = a; a = b; b = temp;
        }
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;  // 합침
    }

    bool isSame(int a, int b) {
        return find(a) == find(b);
    }
};

UnionFind uf;
```

### 반복적 Find (재귀 없이)

```cpp
int find(int x) {
    int root = x;
    while (parent[root] != root) {
        root = parent[root];
    }
    // 경로 압축
    while (parent[x] != root) {
        int next = parent[x];
        parent[x] = root;
        x = next;
    }
    return root;
}
```

## STL

C++ STL에는 Union-Find가 없으므로 직접 구현해야 한다. 대안으로 `std::set`이나 `std::map`을 활용할 수 있지만, 성능이 떨어진다.

### map 기반 동적 Union-Find

```cpp
#include <map>

std::map<int, int> parent;

int find(int x) {
    if (parent.find(x) == parent.end()) {
        parent[x] = x;  // 처음 보는 원소
    }
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]);
}

void unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a != b) parent[b] = a;
}
```

## 사용 예시

### 그래프 연결 요소 개수

```cpp
int countComponents(int n, std::vector<std::pair<int, int>>& edges) {
    init(n);

    for (auto& [a, b] : edges) {
        unite(a, b);
    }

    int count = 0;
    for (int i = 1; i <= n; i++) {
        if (find(i) == i) count++;  // 루트인 노드 = 집합 개수
    }
    return count;
}
```

### 사이클 판별 (무방향 그래프)

```cpp
bool hasCycle(int n, std::vector<std::pair<int, int>>& edges) {
    init(n);

    for (auto& [a, b] : edges) {
        if (find(a) == find(b)) {
            return true;  // 이미 같은 집합 = 사이클
        }
        unite(a, b);
    }
    return false;
}
```

### 크루스칼 알고리즘 (최소 신장 트리)

```cpp
#include <algorithm>
#include <vector>

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

int kruskal(int n, std::vector<Edge>& edges) {
    init(n);
    std::sort(edges.begin(), edges.end());

    int mstWeight = 0;
    int edgeCount = 0;

    for (Edge& e : edges) {
        if (find(e.u) != find(e.v)) {
            unite(e.u, e.v);
            mstWeight += e.weight;
            edgeCount++;
            if (edgeCount == n - 1) break;
        }
    }

    return mstWeight;
}
```

### 친구 네트워크 (최대 집합 크기)

```cpp
int maxGroupSize(int n, std::vector<std::pair<int, int>>& friendships) {
    init(n);

    for (auto& [a, b] : friendships) {
        unite(a, b);
    }

    int maxSize = 0;
    for (int i = 1; i <= n; i++) {
        if (find(i) == i) {
            maxSize = (maxSize > size_[i]) ? maxSize : size_[i];
        }
    }
    return maxSize;
}
```

### 온라인 쿼리 처리

```cpp
// 쿼리 타입:
// 1. unite(a, b): 두 원소를 같은 집합으로
// 2. isSame(a, b): 같은 집합인지 확인

void processQueries(int n, std::vector<std::tuple<int, int, int>>& queries) {
    init(n);

    for (auto& [type, a, b] : queries) {
        if (type == 1) {
            unite(a, b);
        } else {
            if (isSameSet(a, b)) {
                // "YES"
            } else {
                // "NO"
            }
        }
    }
}
```

### 2D 격자에서 연결 요소

```cpp
const int MAX = 1001;
int parent[MAX * MAX];
int dx[] = {-1, 1, 0, 0};
int dy[] = {0, 0, -1, 1};

int getIndex(int r, int c, int cols) {
    return r * cols + c;
}

int countIslands(std::vector<std::vector<int>>& grid) {
    int rows = grid.size();
    int cols = grid[0].size();

    // 초기화
    for (int i = 0; i < rows * cols; i++) {
        parent[i] = i;
    }

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                for (int d = 0; d < 4; d++) {
                    int nr = r + dx[d];
                    int nc = c + dy[d];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        unite(getIndex(r, c, cols), getIndex(nr, nc, cols));
                    }
                }
            }
        }
    }

    int count = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            int idx = getIndex(r, c, cols);
            if (grid[r][c] == 1 && find(idx) == idx) {
                count++;
            }
        }
    }
    return count;
}
```

## 주의사항 / Edge Cases

### 경로 압축 필수

```cpp
// 경로 압축 없으면 최악 O(N)
int findBad(int x) {
    if (parent[x] == x) return x;
    return findBad(parent[x]);  // 압축 없음
}

// 경로 압축 있으면 거의 O(1)
int findGood(int x) {
    if (parent[x] == x) return x;
    return parent[x] = findGood(parent[x]);  // 압축
}
```

### 초기화 범위

```cpp
// 1-indexed vs 0-indexed 주의
void init(int n) {
    // 1-indexed
    for (int i = 1; i <= n; i++) {
        parent[i] = i;
    }
    // 0-indexed
    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }
}
```

### union 반환값 활용

```cpp
// union이 실제로 합쳐졌는지 확인
bool unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return false;  // 이미 같은 집합
    parent[b] = a;
    return true;  // 합침
}

// MST에서 간선 추가 여부 판단
if (unite(u, v)) {
    mstWeight += weight;
    edgeCount++;
}
```

### 재귀 깊이 초과

```cpp
// N이 매우 크면 (> 10만) 재귀 깊이 초과 가능
// 반복적 구현 사용

int find(int x) {
    int root = x;
    while (parent[root] != root) {
        root = parent[root];
    }
    while (parent[x] != root) {
        int next = parent[x];
        parent[x] = root;
        x = next;
    }
    return root;
}
```

### 자기 자신과 union

```cpp
// a와 a를 union해도 문제없음
unite(5, 5);  // 아무 일도 안 일어남

// 구현에서 처리
void unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return;  // 같으면 skip
    parent[b] = a;
}
```

### rank vs size

```cpp
// rank: 트리 높이 근사값
// - 경로 압축과 함께 쓰면 정확한 높이 아님
// - 그래도 성능 보장됨

// size: 집합의 원소 개수
// - 집합 크기가 필요한 문제에 유용
// - 친구 네트워크, 가장 큰 집합 등
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Gold | 집합의 표현 | [BOJ 1717](https://www.acmicpc.net/problem/1717) |
| Gold | 여행 가자 | [BOJ 1976](https://www.acmicpc.net/problem/1976) |
| Gold | 최소 스패닝 트리 | [BOJ 1197](https://www.acmicpc.net/problem/1197) |
| Gold | 친구 네트워크 | [BOJ 4195](https://www.acmicpc.net/problem/4195) |
| Gold | 사이클 게임 | [BOJ 20040](https://www.acmicpc.net/problem/20040) |
