---
title: BOJ 11727 2×n 타일링 2
slug: BOJ11727
publishedAt: '2026-01-03'
categories: BOJ
math: true
---

## 문제
N열 3행으로 숫자가 주어진다. 첫 줄에서 시작해서 마지막 줄까지 이동한다.  
선택할때는 바로 아래, 그리고 아래와 붙어있는 숫자로만 이동이 가능하다.  
이때 얻을 수 있는 최대, 최소 점수를 구하자.


## 접근법

가장 마지막에 뭘 놓았는지 기준으로 잡고 푼다.  

- 세로 타일 하나로 끝난다면, 앞부분은 2*(n-1) 크기  
- 가로 타일 2개라면, 앞부분은 2*(n-2) 크기
- 정사각형 타일 1개라면 2*(n-2) 크기


## 풀이
```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using pii = pair<int, int>;
using pll = pair<ll, ll>;

const int INF = 1e9;
const ll LINF = 1e18;
const int MOD = 10007; // or 1e9 + 7

#define rep(i, a, b) for (int i = (a); i < (b); ++i)
#define all(x) (x).begin(), (x).end()


int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    ll n; cin>>n;

    vector<ll> dp;
    dp.push_back(0); // 0 pass
    dp.push_back(1); // 1
    dp.push_back(3); // 2
    
    // 끝에 오는 타일을 생각
    // 새로 하나 1개 - 1
    // 가로 2개, 2*2 1개 - 2

    rep(i,3,n+1){
        ll t = dp[i-1] + 2*dp[i-2];
        dp.push_back(t%MOD);
    }
    cout << dp[n];
    return 0;
}
```
연산시 매번 나눠줘야 함.  
아주 오래 전에 틀리고 방치해둔 문제다.

## 공간복잡도 O(1) 최적화
```cpp
ll a = 1;
ll b = 3;
ll cur = 0;

rep(i,3,n+1){
    cur = (b + 2*a)%MOD;
    a=b;
    b=cur;
}

cout << b;
```
이런 느낌으로 하면 된다. i-1, i-2 만 쓰고 있으니까.  
mod로 하면 헷갈리니까 이게 맞는듯
