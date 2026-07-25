---
title: 13. 크루스칼 & 프림 (MST)
slug: mst
publishedAt: '2025-12-13'
categories: algorithm
math: false
---

## 개념

최소 신장 트리(Minimum Spanning Tree)는 그래프의 모든 정점을 연결하면서 간선의 가중치 합이 최소인 트리이다.

### 핵심 특징

- **신장 트리**: V개 정점, V-1개 간선, 사이클 없음, 모든 정점 연결
- **최소 가중치**: 가능한 신장 트리 중 가중치 합이 최소
- **두 가지 대표 알고리즘**: 크루스칼 (간선 중심), 프림 (정점 중심)

### 크루스칼 동작 원리

```
간선을 가중치 순으로 정렬 후, 사이클이 생기지 않는 간선만 선택

간선 목록 (정렬 후):
  (2,3,1)  (1,2,2)  (3,4,3)  (1,3,4)  (2,4,5)

[Step 1] (2,3,1) → 선택 (사이클 X)    비용: 1
[Step 2] (1,2,2) → 선택 (사이클 X)    비용: 3
[Step 3] (3,4,3) → 선택 (사이클 X)    비용: 6
[Step 4] V-1=3개 간선 선택 완료!

MST 비용: 6
```

### 프림 동작 원리

```
임의의 시작 정점에서 출발, 현재 트리와 연결된 간선 중 최소 가중치 선택

시작: 정점 1

[Step 1] 정점 1 추가, 인접 간선: (1,2,2), (1,3,4)
  → 최소: (1,2,2) 선택    비용: 2

[Step 2] 정점 2 추가, 인접 간선: (1,3,4), (2,3,1), (2,4,5)
  → 최소: (2,3,1) 선택    비용: 3

[Step 3] 정점 3 추가, 인접 간선: (1,3,4), (2,4,5), (3,4,3)
  → 최소: (3,4,3) 선택    비용: 6

MST 비용: 6
```

## 핵심 연산 & 시간복잡도

| 알고리즘 | 시간복잡도 | 적합한 경우 |
|---------|-----------|------------|
| **크루스칼** | **O(E log E)** | 희소 그래프 (E가 작을 때) |
| **프림 (힙)** | **O(E log V)** | 밀집 그래프 |
| 프림 (배열) | O(V²) | 밀집 그래프, V 작을 때 |

- 크루스칼: 정렬 O(E log E) + Union-Find O(α(V))
- 프림: 다익스트라와 비슷한 구조

## 크루스칼 알고리즘

### No-STL

```cpp
const int MAX_V = 100001;
const int MAX_E = 200001;

struct Edge {
    int u, v, weight;
};

Edge edges[MAX_E];
int parent[MAX_V];
int rnk[MAX_V];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return false;

    if (rnk[a] < rnk[b]) { int t = a; a = b; b = t; }
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
    return true;
}

// 간선 정렬용 (병합 정렬 등 직접 구현 필요)
void sortEdges(int E) {
    // 가중치 기준 오름차순 정렬
    for (int i = 0; i < E - 1; i++) {
        for (int j = i + 1; j < E; j++) {
            if (edges[j].weight < edges[i].weight) {
                Edge tmp = edges[i];
                edges[i] = edges[j];
                edges[j] = tmp;
            }
        }
    }
}

long long kruskal(int V, int E) {
    for (int i = 1; i <= V; i++) {
        parent[i] = i;
        rnk[i] = 0;
    }

    sortEdges(E);

    long long totalCost = 0;
    int edgeCount = 0;

    for (int i = 0; i < E && edgeCount < V - 1; i++) {
        if (unite(edges[i].u, edges[i].v)) {
            totalCost += edges[i].weight;
            edgeCount++;
        }
    }

    return totalCost;
}
```

### STL

```cpp
#include <vector>
#include <algorithm>

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& o) const {
        return weight < o.weight;
    }
};

int parent[MAX_V];
int rnk[MAX_V];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return false;

    if (rnk[a] < rnk[b]) std::swap(a, b);
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
    return true;
}

long long kruskal(int V, std::vector<Edge>& edges) {
    for (int i = 1; i <= V; i++) {
        parent[i] = i;
        rnk[i] = 0;
    }

    std::sort(edges.begin(), edges.end());

    long long totalCost = 0;
    int edgeCount = 0;

    for (auto& [u, v, w] : edges) {
        if (unite(u, v)) {
            totalCost += w;
            if (++edgeCount == V - 1) break;
        }
    }

    return totalCost;
}
```

## 프림 알고리즘

### No-STL (배열 기반, O(V²))

```cpp
const int MAX_V = 1001;
const int INF = 0x3f3f3f3f;

int adj[MAX_V][MAX_V];  // 인접 행렬
int key[MAX_V];          // 트리와 연결하는 최소 비용
bool inMST[MAX_V];

long long prim(int V) {
    for (int i = 1; i <= V; i++) {
        key[i] = INF;
        inMST[i] = false;
    }
    key[1] = 0;

    long long totalCost = 0;

    for (int iter = 0; iter < V; iter++) {
        // key 최소인 정점 선택
        int cur = -1, minKey = INF;
        for (int i = 1; i <= V; i++) {
            if (!inMST[i] && key[i] < minKey) {
                minKey = key[i];
                cur = i;
            }
        }

        if (cur == -1) break;
        inMST[cur] = true;
        totalCost += key[cur];

        // 인접 정점의 key 갱신
        for (int next = 1; next <= V; next++) {
            if (!inMST[next] && adj[cur][next] < key[next]) {
                key[next] = adj[cur][next];
            }
        }
    }

    return totalCost;
}
```

### STL (힙 기반)

```cpp
#include <vector>
#include <queue>

const int INF = 0x3f3f3f3f;

std::vector<std::pair<int, int>> adj[MAX_V];  // {다음 정점, 가중치}
int key[MAX_V];
bool inMST[MAX_V];

long long prim(int V) {
    std::fill(key + 1, key + V + 1, INF);
    std::fill(inMST + 1, inMST + V + 1, false);
    key[1] = 0;

    // {비용, 정점}
    std::priority_queue<
        std::pair<int, int>,
        std::vector<std::pair<int, int>>,
        std::greater<>
    > pq;

    pq.push({0, 1});
    long long totalCost = 0;

    while (!pq.empty()) {
        auto [cost, cur] = pq.top();
        pq.pop();

        if (inMST[cur]) continue;
        inMST[cur] = true;
        totalCost += cost;

        for (auto [next, w] : adj[cur]) {
            if (!inMST[next] && w < key[next]) {
                key[next] = w;
                pq.push({w, next});
            }
        }
    }

    return totalCost;
}
```

## 비교 정리

| 특성 | 크루스칼 | 프림 |
|------|---------|------|
| 접근 | 간선 중심 (전체 간선 정렬) | 정점 중심 (BFS처럼 확장) |
| 자료구조 | Union-Find | 우선순위 큐 (또는 배열) |
| 시간복잡도 | O(E log E) | O(E log V) / O(V²) |
| 적합한 경우 | 희소 그래프 (E ≈ V) | 밀집 그래프 (E ≈ V²) |
| 구현 난이도 | Union-Find 필요 | 다익스트라와 비슷 |

## 사용 예시

### 기본 MST (크루스칼)

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, w;
    bool operator<(const Edge& o) const { return w < o.w; }
};

int parent[10001];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    parent[b] = a;
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int V, E;
    cin >> V >> E;

    vector<Edge> edges(E);
    for (int i = 0; i < E; i++) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
    }

    sort(edges.begin(), edges.end());

    for (int i = 1; i <= V; i++) parent[i] = i;

    long long ans = 0;
    int cnt = 0;

    for (auto& [u, v, w] : edges) {
        if (unite(u, v)) {
            ans += w;
            if (++cnt == V - 1) break;
        }
    }

    cout << ans << '\n';
    return 0;
}
```

### MST에서 특정 간선 제외/포함

```cpp
#include <bits/stdc++.h>
using namespace std;

// 두 번째로 작은 MST 구하기 (간선 하나 교체)
// 1. MST를 구하고 MST에 포함된 간선 기록
// 2. MST 간선을 하나씩 제외하고 나머지로 MST 구하기
// 3. 그 중 최솟값이 두 번째 MST

struct Edge {
    int u, v, w;
    bool operator<(const Edge& o) const { return w < o.w; }
};

int parent[1001];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    parent[b] = a;
    return true;
}

int main() {
    int V, E;
    cin >> V >> E;

    vector<Edge> edges(E);
    for (int i = 0; i < E; i++) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
    }
    sort(edges.begin(), edges.end());

    // 첫 번째 MST
    for (int i = 1; i <= V; i++) parent[i] = i;
    vector<int> mstEdges;
    long long mstCost = 0;

    for (int i = 0; i < E; i++) {
        if (unite(edges[i].u, edges[i].v)) {
            mstCost += edges[i].w;
            mstEdges.push_back(i);
        }
    }

    // 두 번째 MST: MST 간선을 하나씩 제외
    long long secondMst = LLONG_MAX;

    for (int skip : mstEdges) {
        for (int i = 1; i <= V; i++) parent[i] = i;
        long long cost = 0;
        int cnt = 0;

        for (int i = 0; i < E; i++) {
            if (i == skip) continue;
            if (unite(edges[i].u, edges[i].v)) {
                cost += edges[i].w;
                cnt++;
            }
        }

        if (cnt == V - 1) {
            secondMst = min(secondMst, cost);
        }
    }

    cout << secondMst << '\n';
    return 0;
}
```

## 주의사항 / Edge Cases

### 그래프가 비연결인 경우

```cpp
// MST는 연결 그래프에서만 존재
// 선택된 간선이 V-1개 미만이면 비연결
if (edgeCount < V - 1) {
    // MST 불가능, 신장 숲(Forest) 형성
}
```

### 동일 가중치 간선

```cpp
// 가중치가 같은 간선이 여러 개면 MST가 유일하지 않을 수 있음
// 어떤 것을 선택해도 총 비용은 동일
```

### Union-Find 경로 압축

```cpp
// 경로 압축 없으면 최악 O(V)
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);  // 경로 압축
    return parent[x];
}

// 랭크/크기 기반 합치기도 적용하면 거의 O(1)
```

### 자기 루프 / 중복 간선

```cpp
// 자기 루프: u == v인 간선은 MST에 포함될 수 없음 (사이클)
// Union-Find로 자연스럽게 걸러짐

// 중복 간선: 동일 (u, v) 사이 여러 간선
// 정렬 후 최소 가중치 것이 먼저 선택됨
```

## 면접 포인트

### 자주 나오는 질문

**Q1. MST란?**
> - 그래프의 모든 정점을 포함하는 트리 (V-1개 간선, 사이클 없음)
> - 가중치 합이 최소인 신장 트리

**Q2. 크루스칼과 프림의 차이는?**
> - 크루스칼: 간선을 가중치 순 정렬 → 사이클 안 생기면 선택 (Union-Find)
> - 프림: 정점 하나에서 시작, 인접 간선 중 최소 선택 (우선순위 큐)
> - 결과(비용)는 동일, 선택 순서가 다를 수 있음

**Q3. 크루스칼에서 Union-Find를 사용하는 이유는?**
> - 간선 추가 시 사이클 생성 여부를 빠르게 판별
> - find(u) == find(v)이면 이미 같은 컴포넌트 → 사이클 발생
> - 경로 압축 + 랭크 합치기로 거의 O(1)

**Q4. MST의 간선 수는?**
> - 항상 V-1개
> - V개 정점을 연결하는 트리의 간선 수 = V-1

**Q5. MST가 유일하지 않은 경우는?**
> - 동일 가중치 간선이 여러 개일 때
> - 어떤 것을 선택해도 총 비용은 동일하지만 트리 모양이 다를 수 있음

### 코드 체크리스트

```cpp
// 크루스칼
// 1. Union-Find 초기화
for (int i = 1; i <= V; i++) parent[i] = i;

// 2. 간선 정렬
sort(edges.begin(), edges.end());

// 3. 간선 선택 (V-1개)
for (auto& [u, v, w] : edges) {
    if (unite(u, v)) {
        ans += w;
        if (++cnt == V - 1) break;
    }
}

// 프림
// 1. key 배열 INF 초기화, 시작 정점 key = 0
// 2. 최소 힙에서 pop, inMST 체크
// 3. 인접 정점의 key 갱신
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Gold | 최소 스패닝 트리 | [BOJ 1197](https://www.acmicpc.net/problem/1197) | 기본 MST |
| Gold | 네트워크 연결 | [BOJ 1922](https://www.acmicpc.net/problem/1922) | 기본 MST |
| Gold | 도시 분할 계획 | [BOJ 1647](https://www.acmicpc.net/problem/1647) | MST에서 간선 1개 제거 |
| Gold | 별자리 만들기 | [BOJ 4386](https://www.acmicpc.net/problem/4386) | 좌표 → 완전 그래프 MST |
| Gold | 전력난 | [BOJ 6497](https://www.acmicpc.net/problem/6497) | MST 비용 = 절약 비용 |
| Platinum | 도로 네트워크 | [BOJ 3176](https://www.acmicpc.net/problem/3176) | MST + LCA |
| Platinum | 행성 터널 | [BOJ 2887](https://www.acmicpc.net/problem/2887) | 좌표 정렬 후 MST |
