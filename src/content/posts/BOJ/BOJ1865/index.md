---
title: 'BOJ 1865 웜홀 (음수 사이클 판별 - 플로이드 워셜, 벨만 포드 2개 풀이)'
slug: BOJ1865
publishedAt: '2026-01-27'
categories: BOJ
math: true
---

## 문제
그래프 내에 음수 사이클이 존재하는지 판별하는 문제. 시간이 뒤로 가기 위해서는 경로의 가중치 합이 음수가 되어야 하며, 출발지로 돌아왔을 때 음수라면 그 경로 상에 음수 사이클이 있음을 의미함.

보통의 길은 양방향이고, 웜홀은 단방향이다.

## 복잡도 분석
### 풀이 1

플로이드 워셜 사용해서 풀이

- 시간 복잡도: $O(N^3)$
    - $N=500$일 때 $N^3 = 125,000,000$ (약 1.25억) 연산.
    - 제한 시간 2초 내에 통과 가능하나, 테스트 케이스(TC)가 많을 경우 위험할 수 있음.
- 공간 복잡도: $O(N^2)$
    - 2차원 인접행렬 사용함

### 풀이 2
벨만 포드


## 접근법
### 풀이 1
- 양방향 길과 단방향 웜홀(가중치 음수)를 인접행렬에 저장
- 대각선을 0으로 초기화시키지 않고 inf로 전체 초기화 하고 플로이드 워셜을 돌린다
- 이후 대각선 성분에 음수값이 존재한다면 해당 정점 포함 경로에 음수 사이클이 존재한다는것

### 풀이 2


## 풀이
### 풀이 1
```cpp
#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> g;
int n,m,w;

bool floyd_warshal(){
    for(int k=0;k<=n;k++){
        for(int a=0;a<=n;a++){
            for(int b=0;b<=n;b++){
                g[a][b] = min(g[a][b], g[a][k]+g[k][b]);
            }
        }
    }
    for(int i=0;i<=n;i++){
        if (g[i][i]<0) return true;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    int TC;cin>>TC;
    while (TC--)
    {
        cin>>n>>m>>w;
        g.clear();
        g.assign(n+1,vector<int> (n+1,1e9));
        int s,e,t;
        for(int i=0;i<m;i++){
            cin>>s>>e>>t;
            g[s][e] = min(g[s][e],t);
            g[e][s] = min(g[e][s],t);
        }
        for(int i=0;i<w;i++){
            cin>>s>>e>>t;
            g[s][e] = min(g[s][e],-t);
        }
        if(floyd_warshal()) cout << "YES\n";
        else cout << "NO\n";
    }
    return 0;
}
```
시간제한이 2초라서 통과한듯. 주어지는 길 모두 단방향으로 잘못읽어서 한번 틀림

### 풀이 2
```cpp

```
피곤해서 내일함..
