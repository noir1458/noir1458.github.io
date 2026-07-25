---
title: 16. 네트워크 플로우
slug: networkFlow
publishedAt: '2025-12-16'
categories: algorithm
math: false
---

## 개념

네트워크 플로우는 소스(S)에서 싱크(T)로 흘려보낼 수 있는 최대 유량을 구하는 문제이다.

### 핵심 특징

- **용량 제한**: 각 간선에 흘릴 수 있는 최대 유량이 정해져 있음
- **유량 보존**: 중간 정점에서 들어오는 유량 = 나가는 유량
- **최대 유량 = 최소 컷**: max-flow min-cut 정리

### 동작 원리

```
그래프 (용량):
  S --10-- A --5-- T
  S --8--- B --7-- T
  A --3--- B

[Step 1] 증가 경로: S→A→T, 유량 5
  잔여 용량: S→A:5, A→T:0, S→B:8, B→T:7, A→B:3

[Step 2] 증가 경로: S→B→T, 유량 7
  잔여 용량: S→A:5, S→B:1, B→T:0, A→B:3

[Step 3] 증가 경로: S→A→B→T ← 역방향 이용
  흠, B→T 용량 0이므로 불가

실제로는 역방향 간선을 활용:
[Step 3] S→B→A(역방향)→T? 불가
         S→A→B→T? A→B:3, B→T:0 → 불가

최대 유량: 5 + 7 = 12
```

### 역방향 간선의 역할

```
역방향 간선: 이미 흘린 유량을 취소하는 효과
u→v로 f만큼 흘리면:
  - u→v 잔여 용량: capacity - f
  - v→u 잔여 용량: f (역방향)

이를 통해 잘못된 경로 선택을 수정할 수 있음
```

## 핵심 연산 & 시간복잡도

| 알고리즘 | 시간복잡도 | 특징 |
|---------|-----------|------|
| 포드-풀커슨 (DFS) | O(V · E · f) | f: 최대 유량 |
| **에드몬드-카프 (BFS)** | **O(V · E²)** | 최단 증가 경로 |
| 디닉 (Dinic) | O(V² · E) | 레벨 그래프 + 블로킹 플로우 |

- 이분 매칭: O(V · E)

## 포드-풀커슨 (Ford-Fulkerson)

DFS로 증가 경로를 찾아 유량을 흘리는 방법.

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAX_V = 1001;
const int INF = 0x3f3f3f3f;

int capacity[MAX_V][MAX_V];  // 용량
int flow[MAX_V][MAX_V];      // 현재 유량
vector<int> adj[MAX_V];
bool visited[MAX_V];

// DFS로 증가 경로 탐색, 흘릴 수 있는 유량 반환
int dfs(int cur, int sink, int minFlow) {
    if (cur == sink) return minFlow;
    visited[cur] = true;

    for (int next : adj[cur]) {
        int residual = capacity[cur][next] - flow[cur][next];
        if (!visited[next] && residual > 0) {
            int f = dfs(next, sink, min(minFlow, residual));
            if (f > 0) {
                flow[cur][next] += f;
                flow[next][cur] -= f;  // 역방향
                return f;
            }
        }
    }

    return 0;
}

int maxFlow(int source, int sink) {
    int totalFlow = 0;

    while (true) {
        memset(visited, false, sizeof(visited));
        int f = dfs(source, sink, INF);
        if (f == 0) break;
        totalFlow += f;
    }

    return totalFlow;
}
```

## 에드몬드-카프 (Edmonds-Karp)

BFS로 최단 증가 경로를 찾는 포드-풀커슨의 개선 버전.

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAX_V = 1001;
const int INF = 0x3f3f3f3f;

int capacity[MAX_V][MAX_V];
int flow[MAX_V][MAX_V];
vector<int> adj[MAX_V];

int edmondsKarp(int source, int sink, int V) {
    int totalFlow = 0;

    while (true) {
        // BFS로 증가 경로 탐색
        int parent[MAX_V];
        memset(parent, -1, sizeof(parent));
        parent[source] = source;

        queue<int> q;
        q.push(source);

        while (!q.empty() && parent[sink] == -1) {
            int cur = q.front();
            q.pop();

            for (int next : adj[cur]) {
                if (parent[next] == -1 &&
                    capacity[cur][next] - flow[cur][next] > 0) {
                    parent[next] = cur;
                    q.push(next);
                }
            }
        }

        // 증가 경로가 없으면 종료
        if (parent[sink] == -1) break;

        // 경로의 최소 잔여 용량 계산
        int minFlow = INF;
        for (int v = sink; v != source; v = parent[v]) {
            int u = parent[v];
            minFlow = min(minFlow, capacity[u][v] - flow[u][v]);
        }

        // 유량 갱신
        for (int v = sink; v != source; v = parent[v]) {
            int u = parent[v];
            flow[u][v] += minFlow;
            flow[v][u] -= minFlow;
        }

        totalFlow += minFlow;
    }

    return totalFlow;
}
```

## 이분 매칭

이분 그래프에서 최대 매칭을 구하는 문제. 네트워크 플로우의 특수한 경우이지만 더 간단하게 구현 가능.

### 헝가리안 알고리즘 (DFS 기반)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAX_N = 1001;

vector<int> adj[MAX_N];  // 왼쪽 → 오른쪽
int match_r[MAX_N];      // 오른쪽 정점의 매칭 상대 (-1: 미매칭)
bool visited[MAX_N];

bool dfs(int cur) {
    for (int next : adj[cur]) {
        if (visited[next]) continue;
        visited[next] = true;

        // next가 미매칭이거나, next의 현재 매칭을 다른 곳으로 보낼 수 있으면
        if (match_r[next] == -1 || dfs(match_r[next])) {
            match_r[next] = cur;
            return true;
        }
    }

    return false;
}

int bipartiteMatching(int N) {
    memset(match_r, -1, sizeof(match_r));
    int matched = 0;

    for (int i = 1; i <= N; i++) {
        memset(visited, false, sizeof(visited));
        if (dfs(i)) {
            matched++;
        }
    }

    return matched;
}
```

## 사용 예시

### 최대 유량 기본

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAX_V = 52;  // A-Z: 0-25, a-z: 26-51
const int INF = 0x3f3f3f3f;

int capacity[MAX_V][MAX_V];
int flow[MAX_V][MAX_V];
vector<int> adj[MAX_V];

int charToIdx(char c) {
    if ('A' <= c && c <= 'Z') return c - 'A';
    return c - 'a' + 26;
}

int edmondsKarp(int source, int sink) {
    int totalFlow = 0;

    while (true) {
        int parent[MAX_V];
        memset(parent, -1, sizeof(parent));
        parent[source] = source;

        queue<int> q;
        q.push(source);

        while (!q.empty() && parent[sink] == -1) {
            int cur = q.front(); q.pop();
            for (int next : adj[cur]) {
                if (parent[next] == -1 &&
                    capacity[cur][next] - flow[cur][next] > 0) {
                    parent[next] = cur;
                    q.push(next);
                }
            }
        }

        if (parent[sink] == -1) break;

        int f = INF;
        for (int v = sink; v != source; v = parent[v])
            f = min(f, capacity[parent[v]][v] - flow[parent[v]][v]);

        for (int v = sink; v != source; v = parent[v]) {
            flow[parent[v]][v] += f;
            flow[v][parent[v]] -= f;
        }

        totalFlow += f;
    }

    return totalFlow;
}

int main() {
    int N;
    cin >> N;

    for (int i = 0; i < N; i++) {
        char a, b;
        int c;
        cin >> a >> b >> c;

        int u = charToIdx(a), v = charToIdx(b);
        capacity[u][v] += c;
        capacity[v][u] += c;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    cout << edmondsKarp(charToIdx('A'), charToIdx('Z')) << '\n';
    return 0;
}
```

### 이분 매칭 기본

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;  // 왼쪽 N명, 오른쪽 M개 작업
vector<int> adj[1001];
int match_r[1001];
bool visited[1001];

bool dfs(int cur) {
    for (int next : adj[cur]) {
        if (visited[next]) continue;
        visited[next] = true;
        if (match_r[next] == -1 || dfs(match_r[next])) {
            match_r[next] = cur;
            return true;
        }
    }
    return false;
}

int main() {
    cin >> N >> M;

    for (int i = 1; i <= N; i++) {
        int cnt;
        cin >> cnt;
        for (int j = 0; j < cnt; j++) {
            int w;
            cin >> w;
            adj[i].push_back(w);
        }
    }

    memset(match_r, -1, sizeof(match_r));
    int ans = 0;

    for (int i = 1; i <= N; i++) {
        memset(visited, false, sizeof(visited));
        if (dfs(i)) ans++;
    }

    cout << ans << '\n';
    return 0;
}
```

## 주의사항 / Edge Cases

### 역방향 간선 구성

```cpp
// 인접 리스트 사용 시, u→v 간선 추가할 때 v→u (역방향) 도 반드시 추가
adj[u].push_back(v);
adj[v].push_back(u);

// capacity[v][u]는 0이어도 역방향 간선으로 존재해야 함
```

### 양방향 간선

```cpp
// 양방향 간선의 경우 양쪽 모두 용량 설정
capacity[u][v] += c;
capacity[v][u] += c;
```

### 인접 행렬 vs 인접 리스트

```cpp
// 정점이 적을 때 (V ≤ 500): 인접 행렬이 편리
int capacity[501][501], flow[501][501];

// 정점이 많을 때: 인접 리스트 + Edge 구조체
// capacity와 flow를 Edge에 저장
```

### 이분 매칭에서 visited 초기화

```cpp
// 각 왼쪽 정점마다 visited를 초기화해야 함
for (int i = 1; i <= N; i++) {
    memset(visited, false, sizeof(visited));  // 매 정점마다!
    if (dfs(i)) matched++;
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 최대 유량 최소 컷 정리란?**
> - 최대 유량 = 최소 컷
> - 컷: 소스와 싱크를 분리하는 간선 집합의 용량 합
> - 최소 컷을 구하면 네트워크의 병목을 알 수 있음

**Q2. 역방향 간선이 필요한 이유는?**
> - 이전에 흘린 유량을 취소하는 효과
> - DFS/BFS에서 잘못된 경로를 선택해도 역방향으로 수정 가능
> - 없으면 최적 해를 찾지 못할 수 있음

**Q3. 에드몬드-카프가 포드-풀커슨보다 나은 이유는?**
> - 포드-풀커슨: DFS, O(VEf) - 유량 값에 의존하여 무한 루프 가능
> - 에드몬드-카프: BFS, O(VE²) - 유량과 무관한 다항 시간

**Q4. 이분 매칭을 네트워크 플로우로 모델링하는 방법은?**
> - 소스 → 왼쪽 정점 (용량 1)
> - 왼쪽 → 오른쪽 (용량 1)
> - 오른쪽 → 싱크 (용량 1)
> - 최대 유량 = 최대 매칭

**Q5. 최소 정점 커버와의 관계는?**
> - 쾨닉의 정리: 이분 그래프에서 최대 매칭 = 최소 정점 커버
> - 최소 정점 커버: 모든 간선을 덮는 최소 정점 집합

### 코드 체크리스트

```cpp
// 에드몬드-카프
// 1. 인접 리스트 + capacity 배열 구성 (역방향 포함)
// 2. BFS로 증가 경로 탐색 (parent 배열)
// 3. 경로의 최소 잔여 용량 계산
// 4. flow 갱신 (정방향 +, 역방향 -)
// 5. 증가 경로 없을 때까지 반복

// 이분 매칭
// 1. 왼쪽 → 오른쪽 인접 리스트
// 2. 각 왼쪽 정점에서 DFS
// 3. visited 매번 초기화
// 4. match_r로 매칭 추적
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Platinum | 최대 유량 | [BOJ 6086](https://www.acmicpc.net/problem/6086) | 기본 에드몬드-카프 |
| Platinum | 도시 왕복하기 1 | [BOJ 17412](https://www.acmicpc.net/problem/17412) | 최대 유량 |
| Gold | 열혈강호 | [BOJ 11375](https://www.acmicpc.net/problem/11375) | 이분 매칭 기본 |
| Gold | 축사 배정 | [BOJ 2188](https://www.acmicpc.net/problem/2188) | 이분 매칭 기본 |
| Platinum | 열혈강호 2 | [BOJ 11376](https://www.acmicpc.net/problem/11376) | 이분 매칭 응용 |
| Platinum | 컨닝 | [BOJ 1014](https://www.acmicpc.net/problem/1014) | 최대 독립 집합 |
| Platinum | 소수 쌍 | [BOJ 1017](https://www.acmicpc.net/problem/1017) | 이분 매칭 응용 |
