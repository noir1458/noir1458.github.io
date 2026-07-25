---
title: 16. 그래프 표현 (인접 행렬 / 인접 리스트)
slug: graphRepresentation
publishedAt: '2025-12-16'
categories: datastructure
math: false
---

## 개념

그래프는 정점(Vertex)과 간선(Edge)으로 이루어진 자료구조이다. 표현 방식에 따라 시간/공간 복잡도가 달라진다.

### 그래프 종류

| 종류 | 설명 |
|------|------|
| 무방향 그래프 | 간선에 방향이 없음 |
| 방향 그래프 | 간선에 방향이 있음 |
| 가중치 그래프 | 간선에 가중치가 있음 |
| 연결 그래프 | 모든 정점이 연결됨 |
| 완전 그래프 | 모든 정점 쌍이 연결됨 |

### 인접 행렬 vs 인접 리스트

| 항목 | 인접 행렬 | 인접 리스트 |
|------|----------|-------------|
| 공간 | O(V²) | O(V + E) |
| 간선 존재 확인 | O(1) | O(degree) |
| 모든 간선 순회 | O(V²) | O(V + E) |
| 간선 추가 | O(1) | O(1) |
| 적합한 경우 | 밀집 그래프 | 희소 그래프 |

## 핵심 연산 & 시간복잡도

### 인접 행렬

| 연산 | 시간복잡도 |
|------|-----------|
| 간선 추가/삭제 | O(1) |
| 간선 존재 확인 | O(1) |
| 정점의 모든 인접 정점 | O(V) |
| 전체 간선 순회 | O(V²) |

### 인접 리스트

| 연산 | 시간복잡도 |
|------|-----------|
| 간선 추가 | O(1) |
| 간선 삭제 | O(E) |
| 간선 존재 확인 | O(degree) |
| 정점의 모든 인접 정점 | O(degree) |
| 전체 간선 순회 | O(V + E) |

## 구현 (No-STL)

### 인접 행렬

```cpp
const int MAX_V = 1001;

int adj[MAX_V][MAX_V];  // adj[u][v] = 가중치 (0이면 없음)
int V, E;

void init(int v) {
    V = v;
    for (int i = 0; i <= V; i++) {
        for (int j = 0; j <= V; j++) {
            adj[i][j] = 0;
        }
    }
}

// 무방향 그래프 간선 추가
void addEdge(int u, int v, int weight = 1) {
    adj[u][v] = weight;
    adj[v][u] = weight;
}

// 방향 그래프 간선 추가
void addDirectedEdge(int u, int v, int weight = 1) {
    adj[u][v] = weight;
}

// 간선 존재 확인
bool hasEdge(int u, int v) {
    return adj[u][v] != 0;
}

// 정점 u의 인접 정점 순회
void iterateNeighbors(int u) {
    for (int v = 1; v <= V; v++) {
        if (adj[u][v] != 0) {
            // v는 u의 인접 정점, 가중치 = adj[u][v]
        }
    }
}
```

### 인접 리스트 (정적 배열)

```cpp
const int MAX_V = 100001;
const int MAX_E = 200001;

// 간선 정보를 배열로 저장
struct Edge {
    int to;
    int weight;
    int next;  // 같은 시작점의 다음 간선
} edge[MAX_E];

int head[MAX_V];  // head[u] = u에서 시작하는 첫 간선 인덱스
int edgeCnt;
int V, E;

void init(int v) {
    V = v;
    edgeCnt = 0;
    for (int i = 0; i <= V; i++) {
        head[i] = -1;
    }
}

void addEdge(int from, int to, int weight = 1) {
    edge[edgeCnt].to = to;
    edge[edgeCnt].weight = weight;
    edge[edgeCnt].next = head[from];
    head[from] = edgeCnt++;
}

// 무방향 그래프: 양방향 추가
void addUndirectedEdge(int u, int v, int weight = 1) {
    addEdge(u, v, weight);
    addEdge(v, u, weight);
}

// 정점 u의 인접 정점 순회
void iterateNeighbors(int u) {
    for (int i = head[u]; i != -1; i = edge[i].next) {
        int v = edge[i].to;
        int w = edge[i].weight;
        // v는 u의 인접 정점, 가중치 = w
    }
}
```

### 인접 리스트 (2D 배열, 간단)

```cpp
const int MAX_V = 10001;
const int MAX_DEGREE = 1001;  // 최대 차수

int adj[MAX_V][MAX_DEGREE];
int adjCnt[MAX_V];
int V;

void init(int v) {
    V = v;
    for (int i = 0; i <= V; i++) {
        adjCnt[i] = 0;
    }
}

void addEdge(int from, int to) {
    adj[from][adjCnt[from]++] = to;
}

void addUndirectedEdge(int u, int v) {
    adj[u][adjCnt[u]++] = v;
    adj[v][adjCnt[v]++] = u;
}

void iterateNeighbors(int u) {
    for (int i = 0; i < adjCnt[u]; i++) {
        int v = adj[u][i];
        // v는 u의 인접 정점
    }
}
```

### 가중치 있는 인접 리스트 (2D 배열)

```cpp
const int MAX_V = 10001;
const int MAX_DEGREE = 1001;

struct Edge {
    int to;
    int weight;
} adj[MAX_V][MAX_DEGREE];

int adjCnt[MAX_V];

void addEdge(int from, int to, int weight) {
    adj[from][adjCnt[from]].to = to;
    adj[from][adjCnt[from]].weight = weight;
    adjCnt[from]++;
}
```

### 간선 리스트 (Edge List)

```cpp
const int MAX_E = 200001;

struct Edge {
    int from;
    int to;
    int weight;
} edges[MAX_E];

int edgeCnt;

void addEdge(int from, int to, int weight = 1) {
    edges[edgeCnt].from = from;
    edges[edgeCnt].to = to;
    edges[edgeCnt].weight = weight;
    edgeCnt++;
}

// 크루스칼에서 정렬 후 사용
void sortEdges() {
    // 가중치 기준 정렬
    for (int i = 0; i < edgeCnt - 1; i++) {
        for (int j = i + 1; j < edgeCnt; j++) {
            if (edges[i].weight > edges[j].weight) {
                Edge temp = edges[i];
                edges[i] = edges[j];
                edges[j] = temp;
            }
        }
    }
}
```

## STL

### vector 인접 리스트

```cpp
#include <vector>

const int MAX_V = 100001;

std::vector<int> adj[MAX_V];
int V;

void init(int v) {
    V = v;
    for (int i = 0; i <= V; i++) {
        adj[i].clear();
    }
}

void addEdge(int u, int v) {
    adj[u].push_back(v);
}

void addUndirectedEdge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);
}

void iterateNeighbors(int u) {
    for (int v : adj[u]) {
        // v는 u의 인접 정점
    }
}
```

### 가중치 있는 인접 리스트

```cpp
#include <vector>

std::vector<std::pair<int, int>> adj[MAX_V];  // {to, weight}

void addEdge(int u, int v, int w) {
    adj[u].push_back({v, w});
}

void iterateNeighbors(int u) {
    for (auto& [v, w] : adj[u]) {
        // v: 인접 정점, w: 가중치
    }
}
```

### 간선 리스트

```cpp
#include <vector>
#include <algorithm>

struct Edge {
    int from, to, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

std::vector<Edge> edges;

void addEdge(int u, int v, int w) {
    edges.push_back({u, v, w});
}

void sortEdges() {
    std::sort(edges.begin(), edges.end());
}
```

## 사용 예시

### DFS (깊이 우선 탐색)

```cpp
bool visited[MAX_V];

void dfs(int cur) {
    visited[cur] = true;
    // cur 방문 처리

    for (int i = head[cur]; i != -1; i = edge[i].next) {
        int next = edge[i].to;
        if (!visited[next]) {
            dfs(next);
        }
    }
}
```

### BFS (너비 우선 탐색)

```cpp
int queue[MAX_V];
bool visited[MAX_V];

void bfs(int start) {
    int front = 0, rear = 0;
    queue[rear++] = start;
    visited[start] = true;

    while (front < rear) {
        int cur = queue[front++];
        // cur 방문 처리

        for (int i = head[cur]; i != -1; i = edge[i].next) {
            int next = edge[i].to;
            if (!visited[next]) {
                visited[next] = true;
                queue[rear++] = next;
            }
        }
    }
}
```

### 위상 정렬 (Topological Sort)

```cpp
int inDegree[MAX_V];
int result[MAX_V];
int resultCnt;

void topologicalSort() {
    int queue[MAX_V];
    int front = 0, rear = 0;

    for (int i = 1; i <= V; i++) {
        if (inDegree[i] == 0) {
            queue[rear++] = i;
        }
    }

    resultCnt = 0;
    while (front < rear) {
        int cur = queue[front++];
        result[resultCnt++] = cur;

        for (int i = head[cur]; i != -1; i = edge[i].next) {
            int next = edge[i].to;
            inDegree[next]--;
            if (inDegree[next] == 0) {
                queue[rear++] = next;
            }
        }
    }
}
```

### 이분 그래프 판별

```cpp
int color[MAX_V];  // 0: 미방문, 1: 흰색, 2: 검정

bool isBipartite(int start) {
    int queue[MAX_V];
    int front = 0, rear = 0;

    queue[rear++] = start;
    color[start] = 1;

    while (front < rear) {
        int cur = queue[front++];

        for (int i = head[cur]; i != -1; i = edge[i].next) {
            int next = edge[i].to;

            if (color[next] == 0) {
                color[next] = 3 - color[cur];  // 반대 색
                queue[rear++] = next;
            } else if (color[next] == color[cur]) {
                return false;  // 같은 색이면 이분 그래프 아님
            }
        }
    }

    return true;
}
```

## 주의사항 / Edge Cases

### 자기 루프 (Self-loop)

```cpp
// 자기 자신으로 가는 간선
addEdge(1, 1);  // 허용 여부 확인

// 인접 행렬에서 대각선
adj[i][i] = 1;
```

### 다중 간선 (Multi-edge)

```cpp
// 같은 정점 쌍 사이에 여러 간선
// 인접 행렬: 마지막 값만 저장됨
// 인접 리스트: 모두 저장됨

// 인접 행렬로 다중 간선 카운트
int adj[MAX_V][MAX_V];  // 간선 개수 저장
```

### 0-indexed vs 1-indexed

```cpp
// 문제에 따라 정점 번호 확인
// 1-indexed (일반적)
for (int i = 1; i <= V; i++)

// 0-indexed
for (int i = 0; i < V; i++)
```

### 무방향 그래프 간선 추가

```cpp
// 양방향 모두 추가 필수
void addUndirectedEdge(int u, int v) {
    addEdge(u, v);
    addEdge(v, u);  // 빼먹기 쉬움!
}
```

### 방문 배열 초기화

```cpp
// 여러 테스트케이스에서 초기화 필수
void init() {
    for (int i = 0; i <= V; i++) {
        visited[i] = false;
    }
}
```

### 간선 수 계산

```cpp
// 무방향 그래프: 양방향 추가 시 간선 배열 크기 2배
const int MAX_E = 200001;  // E = 100000이면 2 * E

// 방향 그래프: E개면 충분
const int MAX_E = 100001;
```

## 추천 문제

| 난이도 | 문제 | 링크 |
|--------|------|------|
| Silver | DFS와 BFS | [BOJ 1260](https://www.acmicpc.net/problem/1260) |
| Silver | 바이러스 | [BOJ 2606](https://www.acmicpc.net/problem/2606) |
| Gold | 줄 세우기 | [BOJ 2252](https://www.acmicpc.net/problem/2252) |
| Gold | 이분 그래프 | [BOJ 1707](https://www.acmicpc.net/problem/1707) |
| Gold | 최단경로 | [BOJ 1753](https://www.acmicpc.net/problem/1753) |
