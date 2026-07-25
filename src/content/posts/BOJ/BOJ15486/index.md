---
title: BOJ 15486 퇴사 2
slug: BOJ15486
publishedAt: '2026-01-16'
categories: BOJ
math: true
---

## 문제

오늘부터 $N$일 동안 가질 수 있는 최대 상담 수익을 구하기. 각 날짜 $i$마다 상담에 걸리는 시간 $T_i$와 받을 수 있는 금액 $P_i$가 주어집니다.

상담을 시작하면 $T_i$일 동안은 다른 상담을 할 수 없습니다.

상담은 반드시 $N+1$일이 되기 전(즉, $N$일 이내)에 마쳐야 수익을 받을 수 있습니다.

- $N$의 범위: $1 \le N \le 1,500,000$
- $T_i$의 범위: $1 \le T_i \le 50$
- $P_i$의 범위: $1 \le P_i \le 1,000$


## 복잡도 분석

Time Complexity: $O(N)$. 전체 날짜 $N$을 단 한 번 순회하므로 $1.5 \times 10^6$ 연산 내에 해결 가능합니다.

Space Complexity: $O(N)$. dp, T, P 배열을 위해 약 $18\text{MB}$의 메모리를 사용하며, 이는 제한 사항(512MB)을 충분히 만족합니다.


## 접근법
가중치가 있는 구간 스케줄링 문제.

dp[i]를 "$i$번째 날에 상담이 완료되어 얻을 수 있는 최대 수익"으로 정의.

모든 날에 상담이 딱 맞춰 끝나지 않으므로, 루프를 돌며 max_p = max(max_p, dp[i])를 통해 **"오늘 상담을 시작하기 전까지 벌 수 있는 최대 수익"**을 계속 갱신하며 들고 갑니다.

$$dp[i + T_i] = \max(dp[i + T_i], max\_p + P_i)$$



## 풀이
```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using pii = pair<int, int>;
using pll = pair<ll, ll>;

const int INF = 1e9;
const ll LINF = 1e18;
const int MOD = 998244353; // or 1e9 + 7

#define rep(i, a, b) for (int i = (a); i < (b); ++i)
#define all(x) (x).begin(), (x).end()

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    vector<int> T;
    vector<int> P;
    int N; cin>>N;
    rep(i,0,N){
        int a,b; cin>>a>>b;
        T.push_back(a); P.push_back(b);
    }
    
    vector<int> dp(N+1);
    int max_p = 0;
    rep(i,0,N){
        max_p = max(max_p, dp[i]);
        if (i+T[i] < N+1){
            dp[i+T[i]] = max(dp[i+T[i]], max_p + P[i]);
        }
    }
    max_p = max(max_p, dp[N]);

    cout << max_p;

    return 0;
}
```
