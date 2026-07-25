---
title: 7. BFS (너비 우선 탐색)
slug: bfs
publishedAt: '2025-12-07'
categories: algorithm
math: false
---

## 개념

그래프에서 시작 정점으로부터 가까운 정점을 먼저 방문하는 탐색 알고리즘이다.

### 핵심 특징

- **레벨(거리) 순서로 탐색**: 시작점에서 거리 1인 정점 → 거리 2인 정점 → ...
- **큐(Queue) 사용**: FIFO 특성으로 레벨 순서 보장
- **최단 경로 보장**: 가중치가 없거나 모두 같은 그래프에서

### 동작 원리

```
그래프:
    1 --- 2 --- 5
    |     |
    3 --- 4

시작: 1

큐: [1]           방문: {1}
→ 1 방문, 인접 2,3 추가

큐: [2, 3]        방문: {1, 2, 3}
→ 2 방문, 인접 중 미방문 4,5 추가

큐: [3, 4, 5]     방문: {1, 2, 3, 4, 5}
→ 3 방문, 인접 중 미방문 없음

큐: [4, 5]
→ 4 방문, 인접 중 미방문 없음

큐: [5]
→ 5 방문

방문 순서: 1 → 2 → 3 → 4 → 5
```

### BFS vs DFS

| 특성 | BFS | DFS |
|------|-----|-----|
| 자료구조 | 큐 (Queue) | 스택 (Stack) / 재귀 |
| 탐색 순서 | 너비 우선 (레벨별) | 깊이 우선 |
| 최단 경로 | 보장 (무가중치) | 보장 안 됨 |
| 메모리 | 많음 (너비만큼) | 적음 (깊이만큼) |
| 활용 | 최단 거리, 레벨 탐색 | 경로 탐색, 사이클 |

## 핵심 연산 & 시간복잡도

| 연산 | 인접 리스트 | 인접 행렬 |
|------|-------------|-----------|
| 전체 탐색 | **O(V + E)** | O(V²) |
| 정점 방문 | O(1) | O(1) |
| 인접 정점 확인 | O(degree) | O(V) |

- V: 정점 수, E: 간선 수
- 공간복잡도: O(V) (방문 배열 + 큐)

## 구현 (No-STL)

### 큐 직접 구현

```cpp
const int MAX_V = 100001;
const int MAX_Q = 100001;

// 인접 리스트
int adj[MAX_V][100];  // adj[v][i] = v의 i번째 인접 정점
int adjSize[MAX_V];

// 큐
int queue[MAX_Q];
int front = 0, rear = 0;

void push(int x) { queue[rear++] = x; }
int pop() { return queue[front++]; }
bool isEmpty() { return front == rear; }

// BFS
bool visited[MAX_V];

void bfs(int start) {
    front = rear = 0;  // 큐 초기화

    push(start);
    visited[start] = true;

    while (!isEmpty()) {
        int cur = pop();

        // cur 처리
        // ...

        for (int i = 0; i < adjSize[cur]; i++) {
            int next = adj[cur][i];
            if (!visited[next]) {
                visited[next] = true;
                push(next);
            }
        }
    }
}
```

### 거리 계산

```cpp
int dist[MAX_V];

void bfsWithDist(int start) {
    front = rear = 0;

    for (int i = 0; i < MAX_V; i++) dist[i] = -1;

    push(start);
    dist[start] = 0;

    while (!isEmpty()) {
        int cur = pop();

        for (int i = 0; i < adjSize[cur]; i++) {
            int next = adj[cur][i];
            if (dist[next] == -1) {
                dist[next] = dist[cur] + 1;
                push(next);
            }
        }
    }
}
```

## STL

### 기본 BFS

```cpp
#include <queue>
#include <vector>

std::vector<int> adj[MAX_V];
bool visited[MAX_V];

void bfs(int start) {
    std::queue<int> q;

    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        for (int next : adj[cur]) {
            if (!visited[next]) {
                visited[next] = true;
                q.push(next);
            }
        }
    }
}
```

### 거리 + 경로 추적

```cpp
#include <queue>
#include <vector>

std::vector<int> adj[MAX_V];
int dist[MAX_V];
int parent[MAX_V];  // 경로 추적용

void bfsWithPath(int start) {
    std::queue<int> q;

    std::fill(dist, dist + MAX_V, -1);
    std::fill(parent, parent + MAX_V, -1);

    q.push(start);
    dist[start] = 0;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        for (int next : adj[cur]) {
            if (dist[next] == -1) {
                dist[next] = dist[cur] + 1;
                parent[next] = cur;
                q.push(next);
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

### 2차원 그리드 BFS

```cpp
#include <queue>

int N, M;
int grid[1001][1001];
int dist[1001][1001];

int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

void bfsGrid(int sx, int sy) {
    std::queue<std::pair<int, int>> q;

    for (int i = 0; i < N; i++)
        for (int j = 0; j < M; j++)
            dist[i][j] = -1;

    q.push({sx, sy});
    dist[sx][sy] = 0;

    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();

        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d];
            int ny = y + dy[d];

            // 범위 체크
            if (nx < 0 || nx >= N || ny < 0 || ny >= M) continue;
            // 벽 체크
            if (grid[nx][ny] == 0) continue;
            // 방문 체크
            if (dist[nx][ny] != -1) continue;

            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }
}
```

## 사용 예시

### 미로 최단 경로 (BOJ 2178)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;
char maze[101][101];
int dist[101][101];

int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

int bfs() {
    queue<pair<int, int>> q;

    memset(dist, -1, sizeof(dist));
    q.push({0, 0});
    dist[0][0] = 1;  // 시작 칸 포함

    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();

        if (x == N - 1 && y == M - 1) {
            return dist[x][y];
        }

        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d];
            int ny = y + dy[d];

            if (nx < 0 || nx >= N || ny < 0 || ny >= M) continue;
            if (maze[nx][ny] == '0') continue;
            if (dist[nx][ny] != -1) continue;

            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }

    return -1;  // 도달 불가
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;
    for (int i = 0; i < N; i++) {
        cin >> maze[i];
    }

    cout << bfs() << '\n';
    return 0;
}
```

### 토마토 (BOJ 7576) - 다중 시작점

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;
int box[1001][1001];
int dist[1001][1001];

int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> M >> N;

    queue<pair<int, int>> q;
    memset(dist, -1, sizeof(dist));

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < M; j++) {
            cin >> box[i][j];
            if (box[i][j] == 1) {  // 익은 토마토
                q.push({i, j});
                dist[i][j] = 0;
            } else if (box[i][j] == -1) {  // 벽
                dist[i][j] = -2;  // 구분용
            }
        }
    }

    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();

        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d];
            int ny = y + dy[d];

            if (nx < 0 || nx >= N || ny < 0 || ny >= M) continue;
            if (dist[nx][ny] != -1) continue;

            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }

    int answer = 0;
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < M; j++) {
            if (dist[i][j] == -1) {
                cout << -1 << '\n';
                return 0;
            }
            answer = max(answer, dist[i][j]);
        }
    }

    cout << answer << '\n';
    return 0;
}
```

### 숨바꼭질 (BOJ 1697) - 1차원 BFS

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, K;
int dist[100001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> K;

    memset(dist, -1, sizeof(dist));
    queue<int> q;

    q.push(N);
    dist[N] = 0;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        if (cur == K) {
            cout << dist[cur] << '\n';
            return 0;
        }

        // 세 가지 이동
        int next[] = {cur - 1, cur + 1, cur * 2};

        for (int nx : next) {
            if (nx < 0 || nx > 100000) continue;
            if (dist[nx] != -1) continue;

            dist[nx] = dist[cur] + 1;
            q.push(nx);
        }
    }

    return 0;
}
```

### 0-1 BFS (가중치 0, 1인 그래프)

```cpp
#include <bits/stdc++.h>
using namespace std;

// 가중치 0인 간선: deque 앞에 추가
// 가중치 1인 간선: deque 뒤에 추가

vector<pair<int, int>> adj[MAX_V];  // {다음 정점, 가중치}
int dist[MAX_V];

void bfs01(int start) {
    deque<int> dq;

    fill(dist, dist + MAX_V, INT_MAX);

    dq.push_back(start);
    dist[start] = 0;

    while (!dq.empty()) {
        int cur = dq.front();
        dq.pop_front();

        for (auto [next, weight] : adj[cur]) {
            if (dist[cur] + weight < dist[next]) {
                dist[next] = dist[cur] + weight;

                if (weight == 0) {
                    dq.push_front(next);  // 0이면 앞에
                } else {
                    dq.push_back(next);   // 1이면 뒤에
                }
            }
        }
    }
}
```

### 연결 요소 개수 세기

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<int> adj[1001];
bool visited[1001];

void bfs(int start) {
    queue<int> q;
    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        for (int next : adj[cur]) {
            if (!visited[next]) {
                visited[next] = true;
                q.push(next);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 0; i < M; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int count = 0;
    for (int i = 1; i <= N; i++) {
        if (!visited[i]) {
            bfs(i);
            count++;
        }
    }

    cout << count << '\n';
    return 0;
}
```

## 주의사항 / Edge Cases

### 방문 체크 타이밍

```cpp
// 올바른 방법: 큐에 넣을 때 방문 체크
if (!visited[next]) {
    visited[next] = true;  // 여기서 체크
    q.push(next);
}

// 잘못된 방법: 큐에서 뺄 때 방문 체크
// → 같은 정점이 여러 번 큐에 들어갈 수 있음 (메모리 초과, 시간 초과)
int cur = q.front();
q.pop();
if (visited[cur]) continue;  // 비효율적
visited[cur] = true;
```

### 시작점 초기화

```cpp
// 시작점도 방문 처리 필수
q.push(start);
visited[start] = true;  // 또는 dist[start] = 0;
```

### 2차원 그리드 범위 체크

```cpp
// 인덱스 순서 주의: (행, 열) vs (x, y)
if (nx < 0 || nx >= N || ny < 0 || ny >= M) continue;

// N x M 그리드일 때
// nx: 0 ~ N-1 (행)
// ny: 0 ~ M-1 (열)
```

### 다중 시작점

```cpp
// 모든 시작점을 미리 큐에 넣기
for (int i = 0; i < N; i++) {
    for (int j = 0; j < M; j++) {
        if (isStart[i][j]) {
            q.push({i, j});
            dist[i][j] = 0;
        }
    }
}
// 이후 일반 BFS
```

### 8방향 탐색

```cpp
int dx[] = {0, 0, 1, -1, 1, 1, -1, -1};
int dy[] = {1, -1, 0, 0, 1, -1, 1, -1};

for (int d = 0; d < 8; d++) {
    int nx = x + dx[d];
    int ny = y + dy[d];
    ...
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. BFS의 시간복잡도가 O(V + E)인 이유는?**
> - 모든 정점을 한 번씩 방문: O(V)
> - 각 정점에서 인접 간선 확인: 총 O(E) (간선 하나당 양 끝점에서 한 번씩)
> - 합: O(V + E)

**Q2. BFS로 최단 경로를 구할 수 있는 조건은?**
> - 가중치가 없거나 모두 같은 그래프
> - 가중치가 있으면 다익스트라 등 사용
> - 가중치가 0과 1만 있으면 0-1 BFS

**Q3. BFS와 DFS의 선택 기준은?**
> - BFS: 최단 경로, 레벨별 탐색, 가까운 것 우선
> - DFS: 경로 존재 여부, 사이클 탐지, 백트래킹
> - 단순 연결성 확인: 둘 다 가능

**Q4. 큐 대신 다른 자료구조를 쓰면?**
> - 스택: DFS가 됨
> - 우선순위 큐: 다익스트라가 됨
> - 덱(Deque): 0-1 BFS 가능

**Q5. 방문 체크를 큐에 넣을 때 vs 뺄 때 하는 차이는?**
> - 넣을 때: 정점이 큐에 한 번만 들어감 (효율적)
> - 뺄 때: 같은 정점이 여러 번 큐에 들어갈 수 있음 (비효율)
> - 항상 큐에 넣을 때 방문 체크 권장

### 코드 체크리스트

```cpp
// 1. 초기화
queue<T> q;
memset(visited, false, sizeof(visited));  // 또는 dist = -1

// 2. 시작점 처리
q.push(start);
visited[start] = true;  // 필수!

// 3. BFS 루프
while (!q.empty()) {
    auto cur = q.front();
    q.pop();

    for (auto next : adj[cur]) {
        // 4. 유효성 체크 (범위, 벽, 조건 등)
        if (!isValid(next)) continue;

        // 5. 방문 체크 (큐에 넣을 때!)
        if (visited[next]) continue;

        // 6. 방문 처리 + 큐 추가
        visited[next] = true;
        q.push(next);
    }
}
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | DFS와 BFS | [BOJ 1260](https://www.acmicpc.net/problem/1260) | 기본 |
| Silver | 미로 탐색 | [BOJ 2178](https://www.acmicpc.net/problem/2178) | 2D 최단거리 |
| Silver | 바이러스 | [BOJ 2606](https://www.acmicpc.net/problem/2606) | 연결 요소 |
| Silver | 연결 요소의 개수 | [BOJ 11724](https://www.acmicpc.net/problem/11724) | 연결 요소 |
| Gold | 토마토 | [BOJ 7576](https://www.acmicpc.net/problem/7576) | 다중 시작점 |
| Gold | 숨바꼭질 | [BOJ 1697](https://www.acmicpc.net/problem/1697) | 1D BFS |
| Gold | 벽 부수고 이동하기 | [BOJ 2206](https://www.acmicpc.net/problem/2206) | 3D BFS (상태) |
| Gold | 불! | [BOJ 4179](https://www.acmicpc.net/problem/4179) | 다중 BFS |
