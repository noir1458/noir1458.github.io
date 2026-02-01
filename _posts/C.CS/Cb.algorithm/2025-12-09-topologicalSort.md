---
title: 9. 위상 정렬
tags: algorithm
categories: algorithm
---

## 개념

방향 그래프(DAG: Directed Acyclic Graph)에서 정점들을 간선의 방향을 거스르지 않도록 나열하는 알고리즘이다.

### 핵심 특징

- **선행 조건 처리**: A → B이면 A가 반드시 B보다 먼저 나옴
- **DAG에서만 가능**: 사이클이 있으면 위상 정렬 불가능
- **결과가 유일하지 않음**: 여러 유효한 순서가 존재할 수 있음

### 동작 원리 (BFS - Kahn's Algorithm)

```
그래프:
    1 → 2 → 4
    1 → 3 → 4
    3 → 5

진입차수: 1:0  2:1  3:1  4:2  5:1

[Step 1] 진입차수 0인 정점: {1} → 큐에 삽입
큐: [1]

[Step 2] 1 꺼냄, 인접 2,3의 진입차수 감소
진입차수: 2:0  3:0  4:2  5:1
큐: [2, 3]   결과: [1]

[Step 3] 2 꺼냄, 인접 4의 진입차수 감소
진입차수: 3:0  4:1  5:1
큐: [3]      결과: [1, 2]

[Step 4] 3 꺼냄, 인접 4,5의 진입차수 감소
진입차수: 4:0  5:0
큐: [4, 5]   결과: [1, 2, 3]

[Step 5] 4,5 순서대로 꺼냄
결과: [1, 2, 3, 4, 5]
```

### 동작 원리 (DFS)

```
DFS 후위 순서의 역순 = 위상 정렬 결과

그래프: 1→2→4, 1→3→4, 3→5

DFS(1):
  DFS(2):
    DFS(4): 완료 → 스택에 push(4)
  완료 → push(2)
  DFS(3):
    4는 이미 방문
    DFS(5): 완료 → push(5)
  완료 → push(3)
완료 → push(1)

스택 (top→bottom): [1, 3, 5, 2, 4]
결과: 1 → 3 → 5 → 2 → 4
```

### BFS vs DFS 위상 정렬 비교

| 특성 | BFS (Kahn) | DFS |
|------|------------|-----|
| 사이클 감지 | 결과 크기 < V이면 사이클 | 별도 체크 필요 |
| 사전순 정렬 | priority_queue로 가능 | 어려움 |
| 구현 난이도 | 쉬움 | 보통 |
| 활용 | 가장 많이 사용 | SCC 등에 활용 |

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 |
|------|-----------|
| 위상 정렬 (BFS/DFS) | **O(V + E)** |
| 진입차수 계산 | O(E) |
| 사이클 판별 | O(V + E) |

- V: 정점 수, E: 간선 수
- 공간복잡도: O(V + E)

## 구현 (No-STL)

### BFS (Kahn's Algorithm)

```cpp
const int MAX_V = 100001;

int adj[MAX_V][100];
int adjSize[MAX_V];
int inDegree[MAX_V];
int result[MAX_V];
int resultSize;

int queue[MAX_V];
int front, rear;

void push(int x) { queue[rear++] = x; }
int pop() { return queue[front++]; }
bool isEmpty() { return front == rear; }

// V: 정점 수
// return: 위상 정렬 성공 여부 (false면 사이클 존재)
bool topologicalSort(int V) {
    front = rear = 0;
    resultSize = 0;

    // 진입차수 0인 정점 큐에 삽입
    for (int i = 1; i <= V; i++) {
        if (inDegree[i] == 0) {
            push(i);
        }
    }

    while (!isEmpty()) {
        int cur = pop();
        result[resultSize++] = cur;

        for (int i = 0; i < adjSize[cur]; i++) {
            int next = adj[cur][i];
            inDegree[next]--;

            if (inDegree[next] == 0) {
                push(next);
            }
        }
    }

    return resultSize == V;  // false면 사이클 존재
}
```

### DFS 기반

```cpp
const int MAX_V = 100001;

int adj[MAX_V][100];
int adjSize[MAX_V];
bool visited[MAX_V];
int result[MAX_V];
int resultIdx;

void dfs(int cur) {
    visited[cur] = true;

    for (int i = 0; i < adjSize[cur]; i++) {
        int next = adj[cur][i];
        if (!visited[next]) {
            dfs(next);
        }
    }

    result[resultIdx--] = cur;  // 후위 순서의 역순
}

void topologicalSort(int V) {
    resultIdx = V - 1;

    for (int i = 1; i <= V; i++) {
        if (!visited[i]) {
            dfs(i);
        }
    }
}
```

## STL

### BFS (Kahn's Algorithm)

```cpp
#include <vector>
#include <queue>

std::vector<int> adj[MAX_V];
int inDegree[MAX_V];

std::vector<int> topologicalSort(int V) {
    std::queue<int> q;
    std::vector<int> result;

    for (int i = 1; i <= V; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
        }
    }

    while (!q.empty()) {
        int cur = q.front();
        q.pop();
        result.push_back(cur);

        for (int next : adj[cur]) {
            inDegree[next]--;
            if (inDegree[next] == 0) {
                q.push(next);
            }
        }
    }

    // result.size() != V 이면 사이클 존재
    return result;
}
```

### 사전순 위상 정렬

```cpp
#include <vector>
#include <queue>

std::vector<int> adj[MAX_V];
int inDegree[MAX_V];

// 진입차수 0인 정점 중 번호가 작은 것부터 선택
std::vector<int> lexTopologicalSort(int V) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> pq;
    std::vector<int> result;

    for (int i = 1; i <= V; i++) {
        if (inDegree[i] == 0) {
            pq.push(i);
        }
    }

    while (!pq.empty()) {
        int cur = pq.top();
        pq.pop();
        result.push_back(cur);

        for (int next : adj[cur]) {
            inDegree[next]--;
            if (inDegree[next] == 0) {
                pq.push(next);
            }
        }
    }

    return result;
}
```

### DFS 기반

```cpp
#include <vector>
#include <algorithm>

std::vector<int> adj[MAX_V];
bool visited[MAX_V];
std::vector<int> order;

void dfs(int cur) {
    visited[cur] = true;

    for (int next : adj[cur]) {
        if (!visited[next]) {
            dfs(next);
        }
    }

    order.push_back(cur);  // 후위 순서
}

std::vector<int> topologicalSort(int V) {
    order.clear();

    for (int i = 1; i <= V; i++) {
        if (!visited[i]) {
            dfs(i);
        }
    }

    std::reverse(order.begin(), order.end());
    return order;
}
```

## 사용 예시

### 과목 수강 순서 (기본)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<int> adj[1001];
int inDegree[1001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 0; i < M; i++) {
        int a, b;
        cin >> a >> b;  // a를 먼저 수강해야 b 수강 가능
        adj[a].push_back(b);
        inDegree[b]++;
    }

    queue<int> q;
    for (int i = 1; i <= N; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
        }
    }

    vector<int> result;
    while (!q.empty()) {
        int cur = q.front();
        q.pop();
        result.push_back(cur);

        for (int next : adj[cur]) {
            inDegree[next]--;
            if (inDegree[next] == 0) {
                q.push(next);
            }
        }
    }

    for (int x : result) {
        cout << x << ' ';
    }

    return 0;
}
```

### 최장 경로 (DAG에서 DP)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<pair<int, int>> adj[1001];  // {다음 정점, 가중치}
int inDegree[1001];
int dist[1001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        inDegree[v]++;
    }

    // 위상 정렬
    queue<int> q;
    for (int i = 1; i <= N; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
        }
    }

    vector<int> order;
    while (!q.empty()) {
        int cur = q.front();
        q.pop();
        order.push_back(cur);

        for (auto [next, w] : adj[cur]) {
            inDegree[next]--;
            if (inDegree[next] == 0) {
                q.push(next);
            }
        }
    }

    // 위상 순서대로 DP
    memset(dist, 0, sizeof(dist));
    for (int cur : order) {
        for (auto [next, w] : adj[cur]) {
            dist[next] = max(dist[next], dist[cur] + w);
        }
    }

    cout << *max_element(dist + 1, dist + N + 1) << '\n';
    return 0;
}
```

### 작업 최소 시간 (각 작업에 시간이 있을 때)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N;
vector<int> adj[10001];
int inDegree[10001];
int cost[10001];    // 각 작업의 소요 시간
int dp[10001];      // 각 작업의 최소 시작 시간

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N;

    for (int i = 1; i <= N; i++) {
        cin >> cost[i];

        int cnt;
        cin >> cnt;
        for (int j = 0; j < cnt; j++) {
            int pre;
            cin >> pre;
            adj[pre].push_back(i);
            inDegree[i]++;
        }
    }

    queue<int> q;
    for (int i = 1; i <= N; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
            dp[i] = cost[i];
        }
    }

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        for (int next : adj[cur]) {
            dp[next] = max(dp[next], dp[cur] + cost[next]);
            inDegree[next]--;
            if (inDegree[next] == 0) {
                q.push(next);
            }
        }
    }

    cout << *max_element(dp + 1, dp + N + 1) << '\n';
    return 0;
}
```

## 주의사항 / Edge Cases

### 사이클 존재 확인

```cpp
// BFS 기반: 결과 크기로 판별
vector<int> result = topologicalSort(V);
if ((int)result.size() != V) {
    // 사이클 존재 → 위상 정렬 불가능
}
```

### 진입차수 계산 누락

```cpp
// 간선 추가 시 진입차수 반드시 함께 증가
adj[u].push_back(v);
inDegree[v]++;  // 이걸 빠뜨리면 결과가 틀림
```

### 1-indexed vs 0-indexed

```cpp
// 정점 번호가 1부터 시작하는 경우
for (int i = 1; i <= V; i++) {
    if (inDegree[i] == 0) q.push(i);
}

// 0부터 시작하는 경우
for (int i = 0; i < V; i++) {
    if (inDegree[i] == 0) q.push(i);
}
```

### 결과가 유일하지 않음

```cpp
// 동시에 진입차수가 0인 정점이 여러 개이면
// 어떤 것을 먼저 선택하느냐에 따라 결과가 달라짐

// 유일한 결과가 필요하면:
// - 사전순: priority_queue (min-heap) 사용
// - 큐에 동시에 2개 이상 → 유일하지 않음
```

### DAG가 아닌 경우

```cpp
// 위상 정렬은 DAG (Directed Acyclic Graph) 에서만 가능
// 무향 그래프에 적용 불가 → 방향 그래프로 변환 필요
// 사이클이 있는 유향 그래프 → 위상 정렬 불가능
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 위상 정렬이란?**
> - DAG에서 간선의 방향을 거스르지 않으면서 모든 정점을 순서대로 나열하는 것
> - 선후 관계가 있는 작업의 순서를 결정할 때 사용

**Q2. 위상 정렬의 시간복잡도는?**
> - O(V + E): 모든 정점을 한 번씩 처리하고, 각 간선을 한 번씩 확인
> - BFS, DFS 모두 동일

**Q3. 사이클이 있으면 왜 위상 정렬이 불가능한가?**
> - A → B → C → A 사이클이 있으면 A가 B보다 앞이면서 동시에 뒤에 있어야 함
> - 모순이므로 유효한 순서를 만들 수 없음
> - BFS에서는 진입차수가 0이 되는 정점이 부족해서 결과 크기 < V

**Q4. BFS vs DFS 위상 정렬의 차이점?**
> - BFS (Kahn): 진입차수 기반, 사이클 감지 쉬움, 사전순 정렬 가능
> - DFS: 후위 순서의 역순, SCC 알고리즘의 기반
> - 일반적으로 BFS가 직관적이고 많이 사용됨

**Q5. 위상 정렬의 결과가 유일한 조건은?**
> - 매 단계마다 진입차수가 0인 정점이 정확히 1개일 때
> - 즉, 해밀턴 경로가 존재할 때

**Q6. 위상 정렬의 대표적인 활용 예시는?**
> - 과목 수강 순서, 빌드 시스템 의존성 해결
> - DAG에서의 최장/최단 경로 (DP)
> - 작업 스케줄링 (임계 경로 분석)

### 코드 체크리스트

```cpp
// 1. 인접 리스트 + 진입차수 구성
for (int i = 0; i < M; i++) {
    int u, v;
    cin >> u >> v;
    adj[u].push_back(v);
    inDegree[v]++;
}

// 2. 진입차수 0인 정점 큐에 삽입
queue<int> q;
for (int i = 1; i <= N; i++) {
    if (inDegree[i] == 0) q.push(i);
}

// 3. BFS 루프
while (!q.empty()) {
    int cur = q.front();
    q.pop();
    result.push_back(cur);

    for (int next : adj[cur]) {
        if (--inDegree[next] == 0) {
            q.push(next);
        }
    }
}

// 4. 사이클 확인
if (result.size() != N) { /* 사이클 존재 */ }
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 줄 세우기 | [BOJ 2252](https://www.acmicpc.net/problem/2252) | 기본 위상 정렬 |
| Gold | 음악프로그램 | [BOJ 2623](https://www.acmicpc.net/problem/2623) | 사이클 판별 |
| Gold | 장난감 조립 | [BOJ 2637](https://www.acmicpc.net/problem/2637) | 위상 정렬 + DP |
| Gold | ACM Craft | [BOJ 1005](https://www.acmicpc.net/problem/1005) | 작업 최소 시간 |
| Gold | 게임 개발 | [BOJ 1516](https://www.acmicpc.net/problem/1516) | 작업 스케줄링 |
| Gold | 문제집 | [BOJ 1766](https://www.acmicpc.net/problem/1766) | 사전순 위상 정렬 |
| Gold | 작업 | [BOJ 2056](https://www.acmicpc.net/problem/2056) | 임계 경로 |
| Platinum | 임계경로 | [BOJ 1948](https://www.acmicpc.net/problem/1948) | 역추적 |
