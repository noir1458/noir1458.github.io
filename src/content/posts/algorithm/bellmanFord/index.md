---
title: 11. 벨만-포드
slug: bellmanFord
publishedAt: '2025-12-11'
categories: algorithm
math: false
---

## 개념

하나의 시작 정점에서 다른 모든 정점까지의 최단 거리를 구하는 알고리즘이다. 다익스트라와 달리 **음수 가중치 간선**이 있어도 동작하며, **음수 사이클**을 탐지할 수 있다.

### 핵심 특징

- **음수 가중치 허용**: 다익스트라가 못 하는 것을 할 수 있음
- **음수 사이클 탐지**: 무한히 짧아지는 경로가 있는지 판별
- **모든 간선을 V-1번 반복**: 매 반복마다 최단 경로 확정 정점이 1개 이상 추가

### 동작 원리

```
그래프:
    1 --3-- 2 --(-4)-- 3
    |                   |
    5                   2
    |                   |
    4 -------1--------- +

간선 목록: (1,2,3), (1,4,5), (2,3,-4), (3,4,2)
시작: 1

[초기] dist: [0, INF, INF, INF]

[반복 1] 모든 간선 검사
  (1→2): dist[2] = min(INF, 0+3) = 3
  (1→4): dist[4] = min(INF, 0+5) = 5
  (2→3): dist[3] = min(INF, 3+(-4)) = -1
  (3→4): dist[4] = min(5, -1+2) = 1
dist: [0, 3, -1, 1]

[반복 2] 모든 간선 검사
  변화 없음 → 조기 종료 가능

[반복 3] 모든 간선 검사
  변화 없음

최종: 1→1:0, 1→2:3, 1→3:-1, 1→4:1
```

### 음수 사이클 탐지 원리

```
V-1번 반복이면 사이클 없는 최단 경로는 모두 확정됨
(최단 경로는 최대 V-1개의 간선을 사용)

V번째 반복에서도 갱신이 일어나면?
→ 더 짧아지는 경로가 무한히 존재
→ 음수 사이클이 존재
```

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 |
|------|-----------|
| 최단 경로 계산 | **O(VE)** |
| 음수 사이클 탐지 | O(VE) |
| 조기 종료 시 | 최선 O(E) |

- V: 정점 수, E: 간선 수
- 공간복잡도: O(V + E)

## 구현 (No-STL)

```cpp
const int MAX_V = 501;
const int MAX_E = 10001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int from, to, weight;
};

Edge edges[MAX_E];
int dist[MAX_V];
int V, E;

// return: true이면 음수 사이클 존재
bool bellmanFord(int start) {
    for (int i = 1; i <= V; i++) dist[i] = INF;
    dist[start] = 0;

    // V-1번 반복
    for (int iter = 0; iter < V - 1; iter++) {
        bool updated = false;

        for (int i = 0; i < E; i++) {
            int u = edges[i].from;
            int v = edges[i].to;
            int w = edges[i].weight;

            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }

        if (!updated) break;  // 조기 종료
    }

    // V번째 반복: 음수 사이클 확인
    for (int i = 0; i < E; i++) {
        int u = edges[i].from;
        int v = edges[i].to;
        int w = edges[i].weight;

        if (dist[u] != INF && dist[u] + w < dist[v]) {
            return true;  // 음수 사이클 존재
        }
    }

    return false;
}
```

## STL

### 기본 구현

```cpp
#include <vector>

const int INF = 0x3f3f3f3f;

struct Edge {
    int from, to, weight;
};

std::vector<Edge> edges;
int dist[MAX_V];

bool bellmanFord(int start, int V) {
    std::fill(dist + 1, dist + V + 1, INF);
    dist[start] = 0;

    for (int iter = 0; iter < V - 1; iter++) {
        bool updated = false;

        for (auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }

        if (!updated) break;
    }

    for (auto& [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            return true;  // 음수 사이클
        }
    }

    return false;
}
```

### 인접 리스트 기반

```cpp
#include <vector>

const long long INF = 1e18;

std::vector<std::pair<int, int>> adj[MAX_V];  // {다음 정점, 가중치}
long long dist[MAX_V];

bool bellmanFord(int start, int V) {
    std::fill(dist + 1, dist + V + 1, INF);
    dist[start] = 0;

    for (int iter = 0; iter < V - 1; iter++) {
        bool updated = false;

        for (int u = 1; u <= V; u++) {
            if (dist[u] == INF) continue;

            for (auto [v, w] : adj[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
        }

        if (!updated) break;
    }

    // 음수 사이클 확인
    for (int u = 1; u <= V; u++) {
        if (dist[u] == INF) continue;

        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                return true;
            }
        }
    }

    return false;
}
```

### SPFA (Shortest Path Faster Algorithm)

```cpp
#include <vector>
#include <queue>

const long long INF = 1e18;

std::vector<std::pair<int, int>> adj[MAX_V];
long long dist[MAX_V];
bool inQueue[MAX_V];
int cnt[MAX_V];  // 큐에 들어간 횟수

// 벨만-포드의 큐 최적화 버전
// 평균 O(E), 최악 O(VE)
bool spfa(int start, int V) {
    std::fill(dist + 1, dist + V + 1, INF);
    dist[start] = 0;

    std::queue<int> q;
    q.push(start);
    inQueue[start] = true;
    cnt[start] = 1;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();
        inQueue[cur] = false;

        for (auto [next, w] : adj[cur]) {
            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;

                if (!inQueue[next]) {
                    q.push(next);
                    inQueue[next] = true;
                    cnt[next]++;

                    if (cnt[next] >= V) {
                        return true;  // 음수 사이클
                    }
                }
            }
        }
    }

    return false;
}
```

## 사용 예시

### 타임머신 (음수 간선 최단 경로)

```cpp
#include <bits/stdc++.h>
using namespace std;

const long long INF = 1e18;

struct Edge {
    int from, to;
    long long weight;
};

int N, M;
vector<Edge> edges;
long long dist[501];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 0; i < M; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        edges.push_back({u, v, w});
    }

    fill(dist + 1, dist + N + 1, INF);
    dist[1] = 0;

    bool negativeCycle = false;

    for (int iter = 0; iter < N - 1; iter++) {
        for (auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // 음수 사이클 확인
    for (auto& [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            negativeCycle = true;
            break;
        }
    }

    if (negativeCycle) {
        cout << -1 << '\n';
    } else {
        for (int i = 2; i <= N; i++) {
            cout << (dist[i] == INF ? -1 : dist[i]) << '\n';
        }
    }

    return 0;
}
```

### 웜홀 (음수 사이클 판별)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;

struct Edge {
    int from, to, weight;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int TC;
    cin >> TC;

    while (TC--) {
        int N, M, W;
        cin >> N >> M >> W;

        vector<Edge> edges;

        // 도로 (양방향)
        for (int i = 0; i < M; i++) {
            int u, v, w;
            cin >> u >> v >> w;
            edges.push_back({u, v, w});
            edges.push_back({v, u, w});
        }

        // 웜홀 (단방향, 음수 가중치)
        for (int i = 0; i < W; i++) {
            int u, v, w;
            cin >> u >> v >> w;
            edges.push_back({u, v, -w});
        }

        // 모든 정점에서 시작하는 음수 사이클 탐지
        // dist를 0으로 초기화하면 모든 정점에서 시작하는 효과
        vector<int> dist(N + 1, 0);

        bool negativeCycle = false;

        for (int iter = 0; iter < N - 1; iter++) {
            for (auto& [u, v, w] : edges) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }

        for (auto& [u, v, w] : edges) {
            if (dist[u] + w < dist[v]) {
                negativeCycle = true;
                break;
            }
        }

        cout << (negativeCycle ? "YES" : "NO") << '\n';
    }

    return 0;
}
```

## 주의사항 / Edge Cases

### INF 값과 갱신 조건

```cpp
// dist[u]가 INF인데 갱신하면 오버플로우 발생
// 반드시 dist[u] != INF 체크
if (dist[u] != INF && dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
}
```

### long long 사용

```cpp
// 가중치가 음수이고 여러 번 더해지면 int 범위를 벗어날 수 있음
long long dist[MAX_V];
const long long INF = 1e18;
```

### 음수 사이클이 시작점에서 도달 가능한지 확인

```cpp
// 시작점에서 도달 불가능한 음수 사이클은 무시해야 할 수도 있음
// 문제에 따라 처리 방법이 다름

// 모든 음수 사이클을 탐지하고 싶으면
// dist를 모두 0으로 초기화
fill(dist, dist + V + 1, 0);
```

### 조기 종료 최적화

```cpp
// 한 번의 반복에서 갱신이 하나도 없으면 이후 반복도 갱신 없음
for (int iter = 0; iter < V - 1; iter++) {
    bool updated = false;
    for (auto& [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            updated = true;
        }
    }
    if (!updated) break;  // 이 최적화로 실행 시간 크게 단축
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 벨만-포드의 원리는?**
> - 모든 간선에 대해 relaxation을 V-1번 반복
> - i번째 반복 후 i개 이하의 간선을 사용하는 최단 경로가 확정
> - 사이클 없는 최단 경로는 최대 V-1개 간선 → V-1번이면 충분

**Q2. 왜 V-1번 반복하는가?**
> - V개의 정점이 있을 때, 최단 경로는 최대 V-1개의 간선을 지남
> - 매 반복마다 최소 1개의 간선이 더 확정
> - V-1번이면 모든 정점의 최단 경로 확정

**Q3. 음수 사이클 탐지 원리는?**
> - V-1번 반복 후 모든 최단 경로가 확정된 상태
> - V번째 반복에서 갱신 발생 → 더 짧아지는 경로가 존재
> - 이는 음수 사이클을 돌면 무한히 짧아질 수 있다는 의미

**Q4. 다익스트라 대비 벨만-포드의 장단점은?**
> - 장점: 음수 가중치 허용, 음수 사이클 탐지 가능
> - 단점: O(VE)로 다익스트라 O(E log V)보다 느림
> - 음수 가중치가 없으면 다익스트라가 더 좋은 선택

**Q5. SPFA란?**
> - 벨만-포드의 큐 최적화 버전
> - 갱신된 정점만 다음 반복에서 검사
> - 평균 O(E)이지만 최악 O(VE)
> - 의도적으로 느리게 만드는 반례가 존재하여 대회에서 주의 필요

### 코드 체크리스트

```cpp
// 1. 간선 리스트 구성
struct Edge { int from, to, weight; };
vector<Edge> edges;

// 2. dist 초기화 (long long 권장)
fill(dist + 1, dist + V + 1, INF);
dist[start] = 0;

// 3. V-1번 반복
for (int iter = 0; iter < V - 1; iter++) {
    for (auto& [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
        }
    }
}

// 4. 음수 사이클 확인 (V번째 반복)
for (auto& [u, v, w] : edges) {
    if (dist[u] != INF && dist[u] + w < dist[v]) {
        // 음수 사이클 존재
    }
}
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Gold | 타임머신 | [BOJ 11657](https://www.acmicpc.net/problem/11657) | 기본 벨만-포드 |
| Gold | 웜홀 | [BOJ 1865](https://www.acmicpc.net/problem/1865) | 음수 사이클 판별 |
| Gold | 오민식의 고민 | [BOJ 1219](https://www.acmicpc.net/problem/1219) | 음수 사이클 + 최장 경로 |
| Gold | 미확인 도착지 | [BOJ 9370](https://www.acmicpc.net/problem/9370) | 최단 경로 응용 |
| Gold | 세일즈맨의 고민 | [BOJ 1219](https://www.acmicpc.net/problem/1219) | 음수 사이클 응용 |
| Platinum | 타임머신 | [BOJ 1738](https://www.acmicpc.net/problem/1738) | 경로 역추적 + 음수 사이클 |
