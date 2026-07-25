---
title: 17. 동적 프로그래밍 (DP)
slug: dp
publishedAt: '2025-12-17'
categories: algorithm
math: false
---

## 개념

큰 문제를 작은 부분 문제로 나누어 풀고, 결과를 저장하여 재사용하는 알고리즘 설계 기법이다.

### 핵심 특징

- **최적 부분 구조**: 큰 문제의 최적해가 부분 문제의 최적해로 구성됨
- **중복 부분 문제**: 같은 부분 문제가 여러 번 반복 등장
- **메모이제이션/타뷸레이션**: 한 번 계산한 결과를 저장하여 재계산 방지

### DP vs 분할 정복 vs 그리디

| 기법 | 부분 문제 중복 | 최적해 보장 | 접근 |
|------|--------------|------------|------|
| DP | O | O | 점화식 |
| 분할 정복 | X | O | 재귀적 분할 |
| 그리디 | - | 조건부 | 매 단계 최적 선택 |

## 핵심 연산 & 시간복잡도

| 유형 | 시간복잡도 |
|------|-----------|
| 1차원 DP | O(N) |
| 2차원 DP (LCS 등) | O(N · M) |
| LIS (이분 탐색) | O(N log N) |
| 냅색 | O(N · W) |
| 구간 DP | O(N³) |
| 비트마스크 DP | O(2ⁿ · N) |
| 트리 DP | O(V) |

## DP 기초

### 메모이제이션 vs 타뷸레이션

```cpp
// 메모이제이션 (Top-Down): 재귀 + 캐싱
int memo[101];
bool computed[101];

int fib(int n) {
    if (n <= 1) return n;
    if (computed[n]) return memo[n];
    computed[n] = true;
    return memo[n] = fib(n - 1) + fib(n - 2);
}

// 타뷸레이션 (Bottom-Up): 반복문
int dp[101];

int fib(int n) {
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

### 점화식 세우기

```
DP 설계 단계:
1. 상태 정의: dp[i]가 무엇을 의미하는지 명확히
2. 점화식 도출: dp[i]를 이전 상태들로 표현
3. 기저 조건: 가장 작은 부분 문제의 답
4. 계산 순서: 의존하는 상태가 먼저 계산되도록

예: 계단 오르기 (1칸 또는 2칸)
  상태: dp[i] = i번째 계단까지 오르는 방법의 수
  점화식: dp[i] = dp[i-1] + dp[i-2]
  기저: dp[1] = 1, dp[2] = 2
```

## DP 유형별 정리

### LIS (최장 증가 부분 수열)

```cpp
// O(N²) 방법
int lis_n2(int arr[], int n) {
    int dp[n];
    fill(dp, dp + n, 1);

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] < arr[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }

    return *max_element(dp, dp + n);
}

// O(N log N) 방법 - 이분 탐색
#include <algorithm>

int lis_nlogn(int arr[], int n) {
    vector<int> tail;  // tail[i]: 길이 i+1인 LIS의 마지막 원소 최솟값

    for (int i = 0; i < n; i++) {
        auto it = lower_bound(tail.begin(), tail.end(), arr[i]);
        if (it == tail.end()) {
            tail.push_back(arr[i]);
        } else {
            *it = arr[i];
        }
    }

    return tail.size();
}
```

### LCS (최장 공통 부분 수열)

```cpp
// O(N·M)
int lcs(string& a, string& b) {
    int n = a.size(), m = b.size();
    int dp[n + 1][m + 1];
    memset(dp, 0, sizeof(dp));

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[n][m];
}

// LCS 역추적
string traceLCS(string& a, string& b, int dp[][5001]) {
    string result;
    int i = a.size(), j = b.size();

    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) {
            result += a[i - 1];
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    reverse(result.begin(), result.end());
    return result;
}
```

### Edit Distance

```cpp
// 두 문자열 간 최소 편집 거리 (삽입, 삭제, 교체)
int editDistance(string& a, string& b) {
    int n = a.size(), m = b.size();
    int dp[n + 1][m + 1];

    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({
                    dp[i - 1][j],      // 삭제
                    dp[i][j - 1],      // 삽입
                    dp[i - 1][j - 1]   // 교체
                });
            }
        }
    }

    return dp[n][m];
}
```

### 냅색 (Knapsack)

```cpp
// 0-1 냅색
int knapsack01(int W, int wt[], int val[], int n) {
    int dp[n + 1][W + 1];
    memset(dp, 0, sizeof(dp));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];  // 안 넣는 경우
            if (w >= wt[i] && dp[i - 1][w - wt[i]] + val[i] > dp[i][w]) {
                dp[i][w] = dp[i - 1][w - wt[i]] + val[i];  // 넣는 경우
            }
        }
    }

    return dp[n][W];
}

// 0-1 냅색 (공간 최적화, 1차원)
int knapsack01_opt(int W, int wt[], int val[], int n) {
    int dp[W + 1];
    memset(dp, 0, sizeof(dp));

    for (int i = 1; i <= n; i++) {
        for (int w = W; w >= wt[i]; w--) {  // 역순!
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);
        }
    }

    return dp[W];
}

// 무한 냅색 (Unbounded Knapsack)
int knapsackUnbounded(int W, int wt[], int val[], int n) {
    int dp[W + 1];
    memset(dp, 0, sizeof(dp));

    for (int i = 1; i <= n; i++) {
        for (int w = wt[i]; w <= W; w++) {  // 정순!
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);
        }
    }

    return dp[W];
}
```

### 동전 교환

```cpp
// 최소 동전 개수
int coinChange(int coins[], int n, int target) {
    int dp[target + 1];
    fill(dp, dp + target + 1, 0x3f3f3f3f);
    dp[0] = 0;

    for (int i = 0; i < n; i++) {
        for (int w = coins[i]; w <= target; w++) {
            dp[w] = min(dp[w], dp[w - coins[i]] + 1);
        }
    }

    return dp[target] >= 0x3f3f3f3f ? -1 : dp[target];
}

// 동전 조합의 수 (순서 무관)
int coinCombinations(int coins[], int n, int target) {
    int dp[target + 1];
    memset(dp, 0, sizeof(dp));
    dp[0] = 1;

    for (int i = 0; i < n; i++) {         // 동전 종류 먼저
        for (int w = coins[i]; w <= target; w++) {
            dp[w] += dp[w - coins[i]];
        }
    }

    return dp[target];
}

// 동전 순열의 수 (순서 중요)
int coinPermutations(int coins[], int n, int target) {
    int dp[target + 1];
    memset(dp, 0, sizeof(dp));
    dp[0] = 1;

    for (int w = 1; w <= target; w++) {    // 금액 먼저
        for (int i = 0; i < n; i++) {
            if (w >= coins[i]) {
                dp[w] += dp[w - coins[i]];
            }
        }
    }

    return dp[target];
}
```

## 구간 DP

```cpp
// 행렬 곱셈 최적 순서 (Matrix Chain Multiplication)
// dp[i][j] = i~j번째 행렬을 곱하는 최소 비용
int matrixChain(int dims[], int n) {
    // dims: 행렬 크기 (dims[i-1] x dims[i])
    int dp[n][n];
    memset(dp, 0, sizeof(dp));

    // len: 구간 길이
    for (int len = 2; len < n; len++) {
        for (int i = 1; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = 0x3f3f3f3f;

            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j]
                         + dims[i - 1] * dims[k] * dims[j];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }

    return dp[1][n - 1];
}

// 팰린드롬 만들기 (최소 삽입)
int minInsertionsPalindrome(string& s) {
    int n = s.size();
    int dp[n][n];
    memset(dp, 0, sizeof(dp));

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                dp[i][j] = dp[i + 1][j - 1];
            } else {
                dp[i][j] = 1 + min(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[0][n - 1];
}
```

## 비트마스크 DP

```cpp
// 외판원 문제 (TSP)
// dp[mask][i] = mask 집합의 도시를 방문하고 현재 i에 있을 때 최소 비용
#include <bits/stdc++.h>
using namespace std;

const int INF = 0x3f3f3f3f;
int N;
int dist[16][16];
int dp[1 << 16][16];

int tsp(int mask, int cur) {
    if (mask == (1 << N) - 1) {
        return dist[cur][0] ? dist[cur][0] : INF;
    }

    if (dp[mask][cur] != -1) return dp[mask][cur];

    dp[mask][cur] = INF;

    for (int next = 0; next < N; next++) {
        if (mask & (1 << next)) continue;
        if (dist[cur][next] == 0) continue;

        dp[mask][cur] = min(dp[mask][cur],
            tsp(mask | (1 << next), next) + dist[cur][next]);
    }

    return dp[mask][cur];
}

int main() {
    cin >> N;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            cin >> dist[i][j];

    memset(dp, -1, sizeof(dp));
    cout << tsp(1, 0) << '\n';
    return 0;
}
```

## 트리 DP

```cpp
// 트리에서 각 노드의 서브트리 크기
#include <bits/stdc++.h>
using namespace std;

vector<int> adj[100001];
int subtreeSize[100001];

void dfs(int cur, int parent) {
    subtreeSize[cur] = 1;

    for (int next : adj[cur]) {
        if (next == parent) continue;
        dfs(next, cur);
        subtreeSize[cur] += subtreeSize[next];
    }
}

// 트리 독립 집합 (최대 가중치)
int dp[100001][2];  // dp[v][0]: v 미선택, dp[v][1]: v 선택
int weight[100001];

void treeDFS(int cur, int parent) {
    dp[cur][0] = 0;
    dp[cur][1] = weight[cur];

    for (int next : adj[cur]) {
        if (next == parent) continue;
        treeDFS(next, cur);

        dp[cur][0] += max(dp[next][0], dp[next][1]);  // 자식 선택/미선택 모두 가능
        dp[cur][1] += dp[next][0];                      // 자식은 미선택만 가능
    }
}
```

## 주의사항 / Edge Cases

### 0-1 냅색 vs 무한 냅색 루프 방향

```cpp
// 0-1 냅색: w를 역순으로 (각 물건 1번만 사용)
for (int w = W; w >= wt[i]; w--)

// 무한 냅색: w를 정순으로 (각 물건 여러 번 사용)
for (int w = wt[i]; w <= W; w++)
```

### 오버플로우

```cpp
// DP 값이 커질 수 있으므로 long long 사용
// 나머지 연산이 필요한 경우 매 연산마다 적용
dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
```

### 초기값 설정

```cpp
// 최솟값 구하기: INF로 초기화
// 최댓값 구하기: 0 또는 -INF로 초기화
// 경우의 수: 0으로 초기화, 기저 조건 1

// dp[0] = 0인지, dp[0] = 1인지 문제에 따라 다름
```

### 2차원 DP 공간 최적화

```cpp
// dp[i]가 dp[i-1]에만 의존하면 1차원으로 줄일 수 있음
// 또는 두 행만 번갈아 사용
int dp[2][M];
int cur = 0;

for (int i = 1; i <= N; i++) {
    cur = 1 - cur;
    // dp[cur][j] = ... dp[1-cur][...] ...
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. DP를 적용할 수 있는 조건은?**
> - 최적 부분 구조: 부분 문제의 최적해로 전체 최적해 구성 가능
> - 중복 부분 문제: 같은 부분 문제가 반복 계산됨
> - 이 두 조건이 만족하면 DP 적용 가능

**Q2. 메모이제이션 vs 타뷸레이션?**
> - 메모이제이션 (Top-Down): 재귀, 필요한 부분만 계산, 스택 오버플로우 위험
> - 타뷸레이션 (Bottom-Up): 반복문, 모든 상태 계산, 공간 최적화 용이

**Q3. DP의 시간복잡도 계산 방법은?**
> - 상태의 수 × 각 상태의 전이 비용
> - 예: dp[N][M], 각 상태 O(1) → O(NM)

**Q4. LIS를 O(N log N)으로 구하는 원리는?**
> - tail 배열: tail[i] = 길이 i+1인 LIS의 마지막 원소 최솟값
> - 새 원소마다 lower_bound로 위치 찾기
> - tail 배열은 항상 정렬 상태 유지

**Q5. 냅색 문제에서 루프 방향이 중요한 이유는?**
> - 0-1 냅색: 역순으로 갱신 → 각 물건을 1번만 사용
> - 무한 냅색: 정순으로 갱신 → 같은 물건 여러 번 사용 가능
> - 정순이면 이번 반복에서 갱신한 값을 다시 참조 (= 중복 사용)

### 코드 체크리스트

```cpp
// 1. 상태 정의 & 점화식 확인
// 2. 기저 조건 설정
// 3. 계산 순서 (의존성 확인)
// 4. 오버플로우 / MOD 처리
// 5. 공간 최적화 가능 여부
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 1로 만들기 | [BOJ 1463](https://www.acmicpc.net/problem/1463) | 기본 DP |
| Silver | 계단 오르기 | [BOJ 2579](https://www.acmicpc.net/problem/2579) | 조건부 점화식 |
| Silver | 연속합 | [BOJ 1912](https://www.acmicpc.net/problem/1912) | 카데인 알고리즘 |
| Gold | 가장 긴 증가하는 부분 수열 | [BOJ 11053](https://www.acmicpc.net/problem/11053) | LIS (N²) |
| Gold | 가장 긴 증가하는 부분 수열 2 | [BOJ 12015](https://www.acmicpc.net/problem/12015) | LIS (N log N) |
| Gold | LCS | [BOJ 9251](https://www.acmicpc.net/problem/9251) | LCS |
| Gold | 평범한 배낭 | [BOJ 12865](https://www.acmicpc.net/problem/12865) | 0-1 냅색 |
| Gold | 동전 | [BOJ 9084](https://www.acmicpc.net/problem/9084) | 동전 조합 |
| Gold | 행렬 곱셈 순서 | [BOJ 11049](https://www.acmicpc.net/problem/11049) | 구간 DP |
| Gold | 외판원 순회 | [BOJ 2098](https://www.acmicpc.net/problem/2098) | 비트마스크 DP |
| Gold | 우수 마을 | [BOJ 1949](https://www.acmicpc.net/problem/1949) | 트리 DP |
