---
title: 15. 단절점 & 단절선
slug: articulationPointBridge
publishedAt: '2025-12-15'
categories: algorithm
math: false
---

## 개념

**단절점(Articulation Point)**: 이 정점을 제거하면 그래프가 2개 이상의 연결 요소로 분리되는 정점.
**단절선(Bridge)**: 이 간선을 제거하면 그래프가 2개 이상의 연결 요소로 분리되는 간선.

### 핵심 특징

- **무향 그래프**에서 정의 (방향 그래프는 별도 처리)
- **DFS 트리 기반**: DFS 방문 순서와 역방향 간선(back edge)을 활용
- **네트워크 취약점 분석**: 단절점/단절선이 고장나면 네트워크 분리

### 판별 원리

```
DFS 트리에서:
  dfsn[v]: 정점 v의 DFS 방문 순서
  low[v]: v에서 DFS 트리의 역방향 간선으로 도달 가능한 최소 dfsn

단절점 조건 (정점 u):
  1. u가 루트: 자식이 2개 이상
  2. u가 루트 아님: 자식 v에 대해 low[v] >= dfsn[u]
     → v의 서브트리에서 u 위로 올라갈 수 없음
     → u를 제거하면 v의 서브트리가 분리

단절선 조건 (간선 u-v, u가 부모):
  low[v] > dfsn[u]
  → v의 서브트리에서 u에도 도달 불가
  → 이 간선이 유일한 연결
```

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 |
|------|-----------|
| 단절점 찾기 | **O(V + E)** |
| 단절선 찾기 | **O(V + E)** |

- DFS 한 번으로 모두 구할 수 있음
- 공간복잡도: O(V + E)

## 단절점 (Articulation Point)

### STL 구현

```cpp
#include <vector>
#include <algorithm>

const int MAX_V = 100001;

std::vector<int> adj[MAX_V];
int dfsn[MAX_V];
int low[MAX_V];
bool isAP[MAX_V];   // 단절점 여부
int timer = 0;

void dfs(int cur, bool isRoot) {
    dfsn[cur] = low[cur] = ++timer;
    int childCount = 0;

    for (int next : adj[cur]) {
        if (dfsn[next] == 0) {
            // 트리 간선
            childCount++;
            dfs(next, false);
            low[cur] = std::min(low[cur], low[next]);

            // 루트가 아닌 경우: low[next] >= dfsn[cur]이면 단절점
            if (!isRoot && low[next] >= dfsn[cur]) {
                isAP[cur] = true;
            }
        } else {
            // 역방향 간선
            low[cur] = std::min(low[cur], dfsn[next]);
        }
    }

    // 루트인 경우: 자식이 2개 이상이면 단절점
    if (isRoot && childCount >= 2) {
        isAP[cur] = true;
    }
}

void findAP(int V) {
    for (int i = 1; i <= V; i++) {
        if (dfsn[i] == 0) {
            dfs(i, true);
        }
    }
}
```

## 단절선 (Bridge)

### STL 구현

```cpp
#include <vector>
#include <algorithm>

const int MAX_V = 100001;

std::vector<int> adj[MAX_V];
int dfsn[MAX_V];
int low[MAX_V];
int timer = 0;
std::vector<std::pair<int, int>> bridges;

void dfs(int cur, int parent) {
    dfsn[cur] = low[cur] = ++timer;

    for (int next : adj[cur]) {
        if (next == parent) continue;  // 부모로 돌아가는 간선 무시

        if (dfsn[next] == 0) {
            dfs(next, cur);
            low[cur] = std::min(low[cur], low[next]);

            // low[next] > dfsn[cur]이면 단절선
            if (low[next] > dfsn[cur]) {
                bridges.push_back({
                    std::min(cur, next),
                    std::max(cur, next)
                });
            }
        } else {
            low[cur] = std::min(low[cur], dfsn[next]);
        }
    }
}

void findBridges(int V) {
    for (int i = 1; i <= V; i++) {
        if (dfsn[i] == 0) {
            dfs(i, -1);
        }
    }
}
```

### 중복 간선이 있는 경우

```cpp
// 같은 (u, v) 간에 간선이 여러 개일 때
// parent 정점이 아닌, parent 간선을 기준으로 판별해야 함

std::vector<std::pair<int, int>> adj[MAX_V];  // {정점, 간선 번호}

void dfs(int cur, int parentEdge) {
    dfsn[cur] = low[cur] = ++timer;

    for (auto [next, edgeId] : adj[cur]) {
        if (edgeId == parentEdge) continue;  // 같은 간선으로 돌아가는 것 방지

        if (dfsn[next] == 0) {
            dfs(next, edgeId);
            low[cur] = std::min(low[cur], low[next]);

            if (low[next] > dfsn[cur]) {
                bridges.push_back({std::min(cur, next), std::max(cur, next)});
            }
        } else {
            low[cur] = std::min(low[cur], dfsn[next]);
        }
    }
}
```

## 사용 예시

### 단절점 구하기 (전체 코드)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAX_V = 100001;

vector<int> adj[MAX_V];
int dfsn[MAX_V];
int low[MAX_V];
bool isAP[MAX_V];
int timer = 0;

void dfs(int cur, bool isRoot) {
    dfsn[cur] = low[cur] = ++timer;
    int childCount = 0;

    for (int next : adj[cur]) {
        if (dfsn[next] == 0) {
            childCount++;
            dfs(next, false);
            low[cur] = min(low[cur], low[next]);

            if (!isRoot && low[next] >= dfsn[cur]) {
                isAP[cur] = true;
            }
        } else {
            low[cur] = min(low[cur], dfsn[next]);
        }
    }

    if (isRoot && childCount >= 2) {
        isAP[cur] = true;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int V, E;
    cin >> V >> E;

    for (int i = 0; i < E; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    for (int i = 1; i <= V; i++) {
        if (dfsn[i] == 0) {
            dfs(i, true);
        }
    }

    vector<int> result;
    for (int i = 1; i <= V; i++) {
        if (isAP[i]) result.push_back(i);
    }

    cout << result.size() << '\n';
    for (int v : result) cout << v << ' ';

    return 0;
}
```

### 단절선 구하기 (전체 코드)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAX_V = 100001;

vector<int> adj[MAX_V];
int dfsn[MAX_V];
int low[MAX_V];
int timer = 0;
vector<pair<int, int>> bridges;

void dfs(int cur, int parent) {
    dfsn[cur] = low[cur] = ++timer;

    for (int next : adj[cur]) {
        if (next == parent) {
            parent = -1;  // 중복 간선이 없는 경우 첫 번째만 skip
            continue;
        }

        if (dfsn[next] == 0) {
            dfs(next, cur);
            low[cur] = min(low[cur], low[next]);

            if (low[next] > dfsn[cur]) {
                bridges.push_back({min(cur, next), max(cur, next)});
            }
        } else {
            low[cur] = min(low[cur], dfsn[next]);
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int V, E;
    cin >> V >> E;

    for (int i = 0; i < E; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    for (int i = 1; i <= V; i++) {
        if (dfsn[i] == 0) {
            dfs(i, -1);
        }
    }

    sort(bridges.begin(), bridges.end());

    cout << bridges.size() << '\n';
    for (auto [u, v] : bridges) {
        cout << u << ' ' << v << '\n';
    }

    return 0;
}
```

## 주의사항 / Edge Cases

### 단절점 vs 단절선 조건 차이

```cpp
// 단절점: low[next] >= dfsn[cur]  (같아도 단절점)
// 단절선: low[next] >  dfsn[cur]  (같으면 단절선 아님)

// >=인 경우: next 서브트리가 cur까지만 올라올 수 있음
// → cur 제거하면 분리됨 (단절점)
// → 하지만 cur-next 외에 다른 경로로 cur에 도달 가능 (단절선 아님)
```

### 루트 노드 특별 처리 (단절점)

```cpp
// 루트: 자식이 2개 이상이면 단절점
// 루트가 아닌 노드: low[next] >= dfsn[cur]

// 루트에서 low 조건으로만 판별하면 잘못됨
// 루트의 자식이 1개면 제거해도 그래프가 분리되지 않을 수 있음
```

### 부모 간선 처리 (단절선)

```cpp
// 무향 그래프에서 u-v 간선은 양방향으로 존재
// DFS에서 부모로 돌아가는 간선을 역방향 간선으로 취급하면 안 됨

// 방법 1: parent 정점으로 판별 (중복 간선 없을 때)
if (next == parent) continue;

// 방법 2: 간선 번호로 판별 (중복 간선 있을 때)
if (edgeId == parentEdge) continue;
```

### 비연결 그래프

```cpp
// 모든 정점에서 DFS 시작해야 함
for (int i = 1; i <= V; i++) {
    if (dfsn[i] == 0) {
        dfs(i, true);  // 또는 dfs(i, -1)
    }
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 단절점과 단절선의 차이는?**
> - 단절점: 정점 제거 시 그래프 분리
> - 단절선: 간선 제거 시 그래프 분리
> - 판별 조건: 단절점은 >=, 단절선은 >

**Q2. low 배열의 의미는?**
> - low[v]: v에서 DFS 트리의 역방향 간선(back edge)으로 도달 가능한 최소 dfsn
> - low[v]가 작을수록 높은 조상까지 올라갈 수 있음
> - 우회 경로의 존재 여부를 판별하는 핵심

**Q3. 루트 노드를 별도 처리하는 이유는?**
> - 루트는 부모가 없으므로 low 조건이 항상 성립
> - 대신 DFS 자식 수로 판별: 자식 2개 이상이면 단절점
> - 자식이 1개면 루트를 제거해도 나머지가 연결됨

**Q4. 단절점/단절선의 활용은?**
> - 네트워크 안정성 분석 (SPOF: Single Point of Failure)
> - 도로 네트워크에서 핵심 교차로/도로 찾기
> - 이중 연결 요소(Biconnected Component) 분해

**Q5. 시간복잡도가 O(V+E)인 이유는?**
> - DFS 한 번으로 모든 단절점/단절선을 찾음
> - 각 정점과 간선을 정확히 한 번씩 방문

### 코드 체크리스트

```cpp
// 단절점
// 1. DFS에서 dfsn, low 갱신
// 2. 루트: childCount >= 2
// 3. 비루트: low[next] >= dfsn[cur]

// 단절선
// 1. DFS에서 dfsn, low 갱신
// 2. parent 간선 skip
// 3. low[next] > dfsn[cur]
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Platinum | 단절점 | [BOJ 11266](https://www.acmicpc.net/problem/11266) | 기본 단절점 |
| Platinum | 단절선 | [BOJ 11400](https://www.acmicpc.net/problem/11400) | 기본 단절선 |
| Platinum | 도시 분할 계획 2 | [BOJ 17090](https://www.acmicpc.net/problem/17090) | 단절점 응용 |
| Gold | 단지번호붙이기 | [BOJ 2667](https://www.acmicpc.net/problem/2667) | 연결 요소 기초 |
| Platinum | BCC | [BOJ 11266](https://www.acmicpc.net/problem/11266) | 이중 연결 요소 |
