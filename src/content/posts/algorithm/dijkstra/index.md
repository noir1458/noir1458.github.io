---
title: 10. 다익스트라
slug: dijkstra
publishedAt: '2025-12-10'
categories: algorithm
math: false
---

## 개념

하나의 시작 정점에서 다른 모든 정점까지의 최단 거리를 구하는 알고리즘이다. **음수 가중치가 없는** 그래프에서 동작한다.

### 핵심 특징

- **단일 출발점 최단 경로**: 하나의 시작점에서 모든 정점까지의 최단 거리
- **탐욕적 접근**: 현재까지 가장 가까운 정점을 선택하여 확장
- **음수 간선 불가**: 음수 가중치가 있으면 올바른 결과를 보장하지 않음

### 동작 원리

```
그래프:
    1 --2-- 2 --3-- 4
    |       |       |
    5       1       1
    |       |       |
    3 --2-- 5 ------+

시작: 1

dist: [INF, 0, INF, INF, INF, INF]

[Step 1] 최소: 정점 1 (dist=0)
  → 2 갱신: min(INF, 0+2) = 2
  → 3 갱신: min(INF, 0+5) = 5
dist: [_, 0, 2, 5, INF, INF]

[Step 2] 최소: 정점 2 (dist=2)
  → 4 갱신: min(INF, 2+3) = 5
  → 5 갱신: min(INF, 2+1) = 3
dist: [_, 0, 2, 5, 5, 3]

[Step 3] 최소: 정점 5 (dist=3)
  → 3 갱신: min(5, 3+2) = 5 (변화 없음)
  → 4 갱신: min(5, 3+1) = 4
dist: [_, 0, 2, 5, 4, 3]

[Step 4] 최소: 정점 4 (dist=4)
  → 갱신 없음

[Step 5] 최소: 정점 3 (dist=5)
  → 갱신 없음

최종: 1→1:0, 1→2:2, 1→3:5, 1→4:4, 1→5:3
```

### 왜 음수 가중치에서 실패하는가?

```
    1 --1-- 2
    |       |
    3      -5
    |       |
    +------ 3

시작: 1
다익스트라: 1→2 = 1 (확정)
실제 최단: 1→3→2 = 3 + (-5) = -2

이미 확정된 정점의 거리가 나중에 줄어들 수 있어
탐욕적 선택이 깨짐
```

## 핵심 연산 & 시간복잡도

| 구현 방식 | 시간복잡도 |
|-----------|-----------|
| 배열 순회 (단순) | O(V²) |
| **우선순위 큐 (이진 힙)** | **O((V + E) log V)** |
| 피보나치 힙 | O(V log V + E) |

- V: 정점 수, E: 간선 수
- 공간복잡도: O(V + E)
- **코딩 테스트에서는 우선순위 큐 구현이 표준**

## 구현 (No-STL)

### 배열 기반 (V² 방식)

```cpp
const int MAX_V = 10001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int to, weight;
};

Edge adj[MAX_V][100];
int adjSize[MAX_V];
int dist[MAX_V];
bool visited[MAX_V];

void dijkstra(int start, int V) {
    for (int i = 1; i <= V; i++) {
        dist[i] = INF;
        visited[i] = false;
    }
    dist[start] = 0;

    for (int iter = 0; iter < V; iter++) {
        // 미방문 정점 중 dist 최소인 것 선택
        int cur = -1, minDist = INF;
        for (int i = 1; i <= V; i++) {
            if (!visited[i] && dist[i] < minDist) {
                minDist = dist[i];
                cur = i;
            }
        }

        if (cur == -1) break;
        visited[cur] = true;

        for (int i = 0; i < adjSize[cur]; i++) {
            int next = adj[cur][i].to;
            int w = adj[cur][i].weight;

            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;
            }
        }
    }
}
```

### 힙 기반 (직접 구현)

```cpp
const int MAX_V = 100001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int to, weight;
};

Edge adj[MAX_V][20];
int adjSize[MAX_V];
int dist[MAX_V];

// 최소 힙
struct Node {
    int dist, vertex;
};

Node heap[MAX_V * 20];
int heapSize;

void heapPush(Node x) {
    heap[++heapSize] = x;
    int i = heapSize;
    while (i > 1 && heap[i].dist < heap[i / 2].dist) {
        Node tmp = heap[i];
        heap[i] = heap[i / 2];
        heap[i / 2] = tmp;
        i /= 2;
    }
}

Node heapPop() {
    Node ret = heap[1];
    heap[1] = heap[heapSize--];
    int i = 1;
    while (i * 2 <= heapSize) {
        int child = i * 2;
        if (child + 1 <= heapSize && heap[child + 1].dist < heap[child].dist) {
            child++;
        }
        if (heap[i].dist <= heap[child].dist) break;
        Node tmp = heap[i];
        heap[i] = heap[child];
        heap[child] = tmp;
        i = child;
    }
    return ret;
}

void dijkstra(int start, int V) {
    for (int i = 1; i <= V; i++) dist[i] = INF;
    dist[start] = 0;
    heapSize = 0;
    heapPush({0, start});

    while (heapSize > 0) {
        Node cur = heapPop();

        if (cur.dist > dist[cur.vertex]) continue;

        for (int i = 0; i < adjSize[cur.vertex]; i++) {
            int next = adj[cur.vertex][i].to;
            int w = adj[cur.vertex][i].weight;
            int newDist = dist[cur.vertex] + w;

            if (newDist < dist[next]) {
                dist[next] = newDist;
                heapPush({newDist, next});
            }
        }
    }
}
```

## STL

### 우선순위 큐 (표준)

```cpp
#include <vector>
#include <queue>

const int INF = 0x3f3f3f3f;

std::vector<std::pair<int, int>> adj[MAX_V];  // {다음 정점, 가중치}
int dist[MAX_V];

void dijkstra(int start, int V) {
    for (int i = 1; i <= V; i++) dist[i] = INF;
    dist[start] = 0;

    // {거리, 정점} - 거리가 작은 순으로 pop
    std::priority_queue<
        std::pair<int, int>,
        std::vector<std::pair<int, int>>,
        std::greater<std::pair<int, int>>
    > pq;

    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, cur] = pq.top();
        pq.pop();

        if (d > dist[cur]) continue;  // 이미 더 짧은 경로 발견됨

        for (auto [next, w] : adj[cur]) {
            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;
                pq.push({dist[next], next});
            }
        }
    }
}
```

### 경로 역추적

```cpp
#include <vector>
#include <queue>

const int INF = 0x3f3f3f3f;

std::vector<std::pair<int, int>> adj[MAX_V];
int dist[MAX_V];
int parent[MAX_V];  // 최단 경로 트리에서 이전 정점

void dijkstra(int start, int V) {
    for (int i = 1; i <= V; i++) {
        dist[i] = INF;
        parent[i] = -1;
    }
    dist[start] = 0;

    std::priority_queue<
        std::pair<int, int>,
        std::vector<std::pair<int, int>>,
        std::greater<>
    > pq;

    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, cur] = pq.top();
        pq.pop();

        if (d > dist[cur]) continue;

        for (auto [next, w] : adj[cur]) {
            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;
                parent[next] = cur;
                pq.push({dist[next], next});
            }
        }
    }
}

// 경로 복원
std::vector<int> getPath(int end) {
    std::vector<int> path;
    for (int v = end; v != -1; v = parent[v]) {
        path.push_back(v);
    }
    std::reverse(path.begin(), path.end());
    return path;
}
```

## 사용 예시

### 기본 최단 경로

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;

int V, E, start;
vector<pair<int, int>> adj[20001];
int dist[20001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> V >> E >> start;

    for (int i = 0; i < E; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    for (int i = 1; i <= V; i++) dist[i] = INF;
    dist[start] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, cur] = pq.top();
        pq.pop();

        if (d > dist[cur]) continue;

        for (auto [next, w] : adj[cur]) {
            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;
                pq.push({dist[next], next});
            }
        }
    }

    for (int i = 1; i <= V; i++) {
        if (dist[i] == INF) cout << "INF\n";
        else cout << dist[i] << '\n';
    }

    return 0;
}
```

### 최단 경로 + 경로 출력

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;

int N, M;
vector<pair<int, int>> adj[1001];
int dist[1001];
int parent[1001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    int src, dst;
    cin >> src >> dst;

    fill(dist + 1, dist + N + 1, INF);
    memset(parent, -1, sizeof(parent));
    dist[src] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, cur] = pq.top();
        pq.pop();

        if (d > dist[cur]) continue;

        for (auto [next, w] : adj[cur]) {
            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;
                parent[next] = cur;
                pq.push({dist[next], next});
            }
        }
    }

    cout << dist[dst] << '\n';

    // 경로 역추적
    vector<int> path;
    for (int v = dst; v != -1; v = parent[v]) {
        path.push_back(v);
    }
    reverse(path.begin(), path.end());

    cout << path.size() << '\n';
    for (int v : path) cout << v << ' ';

    return 0;
}
```

### 특정 정점을 경유하는 최단 경로

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;

int N, E;
vector<pair<int, int>> adj[801];

vector<int> dijkstra(int start) {
    vector<int> dist(N + 1, INF);
    dist[start] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, cur] = pq.top();
        pq.pop();

        if (d > dist[cur]) continue;

        for (auto [next, w] : adj[cur]) {
            if (dist[cur] + w < dist[next]) {
                dist[next] = dist[cur] + w;
                pq.push({dist[next], next});
            }
        }
    }

    return dist;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> E;

    for (int i = 0; i < E; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    int v1, v2;
    cin >> v1 >> v2;

    // 1, v1, v2에서 각각 다익스트라
    auto d1 = dijkstra(1);
    auto dv1 = dijkstra(v1);
    auto dv2 = dijkstra(v2);

    // 경로 1: 1 → v1 → v2 → N
    long long path1 = (long long)d1[v1] + dv1[v2] + dv2[N];
    // 경로 2: 1 → v2 → v1 → N
    long long path2 = (long long)d1[v2] + dv2[v1] + dv1[N];

    long long ans = min(path1, path2);

    cout << (ans >= INF ? -1 : ans) << '\n';

    return 0;
}
```

## 주의사항 / Edge Cases

### 음수 가중치

```cpp
// 다익스트라는 음수 가중치가 있으면 잘못된 결과 출력
// → 벨만-포드 또는 SPFA 사용

// 음수 가중치 체크
for (int i = 0; i < E; i++) {
    if (w < 0) {
        // 다익스트라 사용 불가, 벨만-포드로 전환
    }
}
```

### 이미 처리된 정점 건너뛰기

```cpp
// 반드시 필요! 이 줄이 없으면 O(VE log V)로 느려질 수 있음
if (d > dist[cur]) continue;
```

### 오버플로우 주의

```cpp
// 가중치 합이 int 범위를 넘을 수 있음
// dist 배열을 long long으로 선언
long long dist[MAX_V];
const long long INF = 1e18;

// 또는 INF 값을 적절히 설정
// 0x3f3f3f3f + 0x3f3f3f3f는 오버플로우 가능
```

### 중복 간선

```cpp
// 같은 (u, v) 간에 여러 간선이 있을 수 있음
// 다익스트라는 자동으로 최소를 선택하므로 별도 처리 불필요
// 그냥 모든 간선을 인접 리스트에 추가하면 됨
```

### 도달 불가능한 정점

```cpp
// dist[v] == INF이면 시작점에서 v로 갈 수 없음
if (dist[v] >= INF) {
    cout << -1;  // 또는 문제에 맞는 출력
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 다익스트라 알고리즘의 원리는?**
> - 시작 정점에서 가장 가까운 정점을 하나씩 확정해 나가는 탐욕적 방법
> - 확정된 정점을 경유하여 인접 정점의 거리를 갱신 (relaxation)
> - 모든 정점이 확정되면 종료

**Q2. 시간복잡도가 O((V+E) log V)인 이유는?**
> - 우선순위 큐에서 pop: O(V log V) (각 정점 최대 1번)
> - 간선마다 push: O(E log V)
> - 합: O((V + E) log V)
> - 실제로는 E ≥ V이므로 O(E log V)로 쓰기도 함

**Q3. 왜 음수 가중치에서 실패하는가?**
> - 이미 확정한 정점의 최단 거리가 음수 간선으로 인해 나중에 줄어들 수 있음
> - 탐욕적 선택의 전제 "확정된 거리는 변하지 않음"이 깨짐
> - 음수 가중치 → 벨만-포드 사용

**Q4. 다익스트라 vs BFS?**
> - BFS: 가중치 없는 그래프 (또는 모든 가중치 동일), O(V + E)
> - 다익스트라: 가중치 있는 그래프, O((V + E) log V)
> - 가중치가 0 또는 1이면 0-1 BFS로 O(V + E) 가능

**Q5. 다익스트라 vs 벨만-포드 vs 플로이드-워셜?**
> - 다익스트라: 단일 출발, 음수 불가, O(E log V)
> - 벨만-포드: 단일 출발, 음수 가능, 음수 사이클 탐지, O(VE)
> - 플로이드-워셜: 모든 쌍, O(V³)

### 코드 체크리스트

```cpp
// 1. 거리 배열 INF 초기화
for (int i = 1; i <= V; i++) dist[i] = INF;
dist[start] = 0;

// 2. 최소 힙 (greater) 사용
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
pq.push({0, start});

// 3. 이미 처리된 정점 건너뛰기
auto [d, cur] = pq.top(); pq.pop();
if (d > dist[cur]) continue;

// 4. relaxation
if (dist[cur] + w < dist[next]) {
    dist[next] = dist[cur] + w;
    pq.push({dist[next], next});
}
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Gold | 최단경로 | [BOJ 1753](https://www.acmicpc.net/problem/1753) | 기본 다익스트라 |
| Gold | 최소비용 구하기 | [BOJ 1916](https://www.acmicpc.net/problem/1916) | 기본 |
| Gold | 특정한 최단 경로 | [BOJ 1504](https://www.acmicpc.net/problem/1504) | 경유점 |
| Gold | 최소비용 구하기 2 | [BOJ 11779](https://www.acmicpc.net/problem/11779) | 경로 역추적 |
| Gold | 파티 | [BOJ 1238](https://www.acmicpc.net/problem/1238) | 역방향 그래프 |
| Gold | 녹색 옷 입은 애가 젤다지? | [BOJ 4485](https://www.acmicpc.net/problem/4485) | 2D 그리드 |
| Gold | 알고스팟 | [BOJ 1261](https://www.acmicpc.net/problem/1261) | 0-1 BFS |
| Platinum | K번째 최단경로 찾기 | [BOJ 1854](https://www.acmicpc.net/problem/1854) | K번째 최단 |
