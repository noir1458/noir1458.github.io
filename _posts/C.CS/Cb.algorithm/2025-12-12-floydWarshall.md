---
title: 12. 플로이드-워셜
tags: algorithm
categories: algorithm
---

## 개념

모든 정점 쌍 사이의 최단 거리를 구하는 알고리즘이다. 음수 가중치도 허용하며, 3중 for문으로 구현이 간단하다.

### 핵심 특징

- **모든 쌍 최단 경로**: 모든 (i, j) 쌍의 최단 거리를 한 번에 구함
- **DP 기반**: 경유 정점을 하나씩 추가하며 갱신
- **음수 가중치 허용**: 음수 사이클 탐지도 가능

### 동작 원리

```
핵심 아이디어:
  dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
  "i에서 j로 갈 때, k를 경유하는 것이 더 짧은가?"

그래프:
    1 --3-- 2
    |       |
    7       1
    |       |
    3 --2-- +

초기 dist:
     1    2    3
1  [ 0    3    7 ]
2  [ 3    0    1 ]
3  [ 7    1    0 ]

[k=1] 1을 경유
  dist[2][3] = min(1, 3+7) = 1
  dist[3][2] = min(1, 7+3) = 1
  변화 없음

[k=2] 2를 경유
  dist[1][3] = min(7, 3+1) = 4  ← 갱신!
  dist[3][1] = min(7, 1+3) = 4  ← 갱신!

[k=3] 3을 경유
  변화 없음

최종:
     1    2    3
1  [ 0    3    4 ]
2  [ 3    0    1 ]
3  [ 4    1    0 ]
```

### 3중 for문의 순서가 중요한 이유

```
반드시 k(경유 정점)가 가장 바깥 루프

for (k) → for (i) → for (j)  ✅ 올바름
for (i) → for (j) → for (k)  ❌ 잘못됨

이유: k번째 반복에서 "1~k번 정점만 경유하는" 최단 경로를 구해야 하므로
k가 고정된 상태에서 모든 (i, j) 쌍을 갱신해야 함
```

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 |
|------|-----------|
| 모든 쌍 최단 경로 | **O(V³)** |
| 공간복잡도 | O(V²) |

- V가 작을 때 유리 (보통 V ≤ 500)
- V가 크면 다익스트라를 V번 돌리는 게 나을 수 있음

## 구현 (No-STL)

```cpp
const int MAX_V = 501;
const int INF = 0x3f3f3f3f;

int dist[MAX_V][MAX_V];
int V, E;

void init() {
    for (int i = 1; i <= V; i++) {
        for (int j = 1; j <= V; j++) {
            dist[i][j] = (i == j) ? 0 : INF;
        }
    }
}

void floydWarshall() {
    for (int k = 1; k <= V; k++) {
        for (int i = 1; i <= V; i++) {
            for (int j = 1; j <= V; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }
}
```

## STL

### 기본 구현

```cpp
#include <vector>
#include <algorithm>

const int INF = 0x3f3f3f3f;

int dist[MAX_V][MAX_V];

void floydWarshall(int V) {
    for (int k = 1; k <= V; k++) {
        for (int i = 1; i <= V; i++) {
            if (dist[i][k] == INF) continue;  // 최적화

            for (int j = 1; j <= V; j++) {
                if (dist[k][j] == INF) continue;

                dist[i][j] = std::min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
}
```

### 경로 역추적

```cpp
#include <vector>

const int INF = 0x3f3f3f3f;

int dist[MAX_V][MAX_V];
int nxt[MAX_V][MAX_V];  // i에서 j로 갈 때 다음에 방문할 정점

void init(int V) {
    for (int i = 1; i <= V; i++) {
        for (int j = 1; j <= V; j++) {
            dist[i][j] = (i == j) ? 0 : INF;
            nxt[i][j] = (i == j) ? i : 0;
        }
    }
}

void addEdge(int u, int v, int w) {
    if (w < dist[u][v]) {
        dist[u][v] = w;
        nxt[u][v] = v;
    }
}

void floydWarshall(int V) {
    for (int k = 1; k <= V; k++) {
        for (int i = 1; i <= V; i++) {
            if (dist[i][k] == INF) continue;

            for (int j = 1; j <= V; j++) {
                if (dist[k][j] == INF) continue;

                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    nxt[i][j] = nxt[i][k];
                }
            }
        }
    }
}

// 경로 복원
std::vector<int> getPath(int from, int to) {
    if (dist[from][to] == INF) return {};

    std::vector<int> path;
    int cur = from;
    while (cur != to) {
        path.push_back(cur);
        cur = nxt[cur][to];
    }
    path.push_back(to);
    return path;
}
```

## 사용 예시

### 기본 모든 쌍 최단 경로

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;

int N, M;
int dist[101][101];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 1; i <= N; i++)
        for (int j = 1; j <= N; j++)
            dist[i][j] = (i == j) ? 0 : INF;

    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        dist[u][v] = min(dist[u][v], w);  // 중복 간선 처리
    }

    for (int k = 1; k <= N; k++)
        for (int i = 1; i <= N; i++)
            for (int j = 1; j <= N; j++)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            cout << (dist[i][j] == INF ? 0 : dist[i][j]) << ' ';
        }
        cout << '\n';
    }

    return 0;
}
```

### 경유 경로 출력

```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;

int N, M;
int dist[101][101];
int nxt[101][101];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;

    for (int i = 1; i <= N; i++)
        for (int j = 1; j <= N; j++) {
            dist[i][j] = (i == j) ? 0 : INF;
            nxt[i][j] = 0;
        }

    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        if (w < dist[u][v]) {
            dist[u][v] = w;
            nxt[u][v] = v;
        }
    }

    for (int k = 1; k <= N; k++)
        for (int i = 1; i <= N; i++) {
            if (dist[i][k] == INF) continue;
            for (int j = 1; j <= N; j++) {
                if (dist[k][j] == INF) continue;
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    nxt[i][j] = nxt[i][k];
                }
            }
        }

    // 경로 출력
    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            if (dist[i][j] == 0 || dist[i][j] == INF) {
                cout << "0\n";
                continue;
            }

            vector<int> path;
            int cur = i;
            while (cur != j) {
                path.push_back(cur);
                cur = nxt[cur][j];
            }
            path.push_back(j);

            cout << path.size();
            for (int v : path) cout << ' ' << v;
            cout << '\n';
        }
    }

    return 0;
}
```

### 음수 사이클 탐지

```cpp
// 플로이드-워셜 수행 후
// dist[i][i] < 0 인 정점이 있으면 음수 사이클 존재

for (int i = 1; i <= N; i++) {
    if (dist[i][i] < 0) {
        // i를 포함하는 음수 사이클 존재
    }
}
```

## 주의사항 / Edge Cases

### k가 반드시 최외곽 루프

```cpp
// 올바른 순서
for (int k = 1; k <= V; k++)      // 경유 정점
    for (int i = 1; i <= V; i++)   // 출발
        for (int j = 1; j <= V; j++)  // 도착

// 잘못된 순서 (결과가 틀림)
for (int i = 1; i <= V; i++)
    for (int j = 1; j <= V; j++)
        for (int k = 1; k <= V; k++)
```

### 오버플로우 방지

```cpp
// INF + INF는 오버플로우
// 반드시 INF 체크 후 덧셈
if (dist[i][k] != INF && dist[k][j] != INF) {
    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
}

// 또는 long long 사용
long long dist[501][501];
```

### 자기 자신으로의 거리

```cpp
// 초기화 시 dist[i][i] = 0
// 단, 자기 자신으로 돌아오는 사이클의 최소 비용을 구하려면
// dist[i][i] = INF로 초기화하고 플로이드 수행
```

### 중복 간선

```cpp
// 같은 (u, v)에 여러 간선이 있을 수 있음
// 최솟값만 저장
dist[u][v] = min(dist[u][v], w);
```

### 정점 수 제한

```cpp
// O(V³)이므로 V ≤ 500 정도가 한계
// V가 크면 다익스트라를 V번 실행하는 것이 나을 수 있음
// 다익스트라 V번: O(V · E log V) vs 플로이드: O(V³)
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 플로이드-워셜의 원리는?**
> - DP: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
> - 경유 정점 k를 1부터 V까지 확장하며 갱신
> - k번째 반복 후 "1~k번 정점만 경유 가능한" 모든 쌍 최단 경로가 확정

**Q2. k가 최외곽 루프여야 하는 이유는?**
> - DP의 단계: k번째 단계에서 "k를 경유할지 말지" 결정
> - k가 고정된 상태에서 모든 (i, j) 쌍을 갱신해야 올바른 점화식
> - k가 안쪽이면 아직 확정되지 않은 값을 참조하게 됨

**Q3. 다익스트라 V번 vs 플로이드-워셜?**
> - 플로이드: O(V³), 구현 간단, 음수 가중치 허용
> - 다익스트라 V번: O(V · E log V), 희소 그래프에서 유리
> - V가 작으면 (≤ 500) 플로이드, V가 크면 다익스트라 V번

**Q4. 플로이드-워셜에서 음수 사이클 탐지는?**
> - 수행 후 dist[i][i] < 0인 i가 있으면 음수 사이클 존재
> - 자기 자신으로 돌아오는 비용이 음수 → 무한히 돌면 무한히 짧아짐

**Q5. 플로이드-워셜의 활용 예시는?**
> - 모든 쌍 최단 경로 (비용 행렬)
> - 도달 가능성 판별 (Transitive Closure)
> - 그래프의 지름 (가장 먼 두 정점 사이의 거리)

### 코드 체크리스트

```cpp
// 1. 초기화 (자기 자신 0, 나머지 INF)
for (int i = 1; i <= N; i++)
    for (int j = 1; j <= N; j++)
        dist[i][j] = (i == j) ? 0 : INF;

// 2. 간선 입력 (중복 간선은 min)
dist[u][v] = min(dist[u][v], w);

// 3. 3중 for (k 최외곽)
for (int k = 1; k <= N; k++)
    for (int i = 1; i <= N; i++)
        for (int j = 1; j <= N; j++)
            if (dist[i][k] != INF && dist[k][j] != INF)
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Gold | 플로이드 | [BOJ 11404](https://www.acmicpc.net/problem/11404) | 기본 플로이드 |
| Gold | 경로 찾기 | [BOJ 11403](https://www.acmicpc.net/problem/11403) | 도달 가능성 |
| Gold | 플로이드 2 | [BOJ 11780](https://www.acmicpc.net/problem/11780) | 경로 역추적 |
| Gold | 키 순서 | [BOJ 2458](https://www.acmicpc.net/problem/2458) | 순서 관계 |
| Gold | 운동 | [BOJ 1956](https://www.acmicpc.net/problem/1956) | 최소 사이클 |
| Gold | 역사 | [BOJ 1613](https://www.acmicpc.net/problem/1613) | 선후 관계 판별 |
| Gold | 회장뽑기 | [BOJ 2660](https://www.acmicpc.net/problem/2660) | 최대 거리 최소화 |
