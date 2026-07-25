---
title: BOJ 6593 상범 빌딩
slug: BOJ6593
publishedAt: '2026-01-13'
categories: BOJ
math: true
---

## 문제
3차원 빌딩 격자($L \times R \times C$)에서 시작점('S')부터 탈출구('E')까지의 최단 시간을 계산.

$L, R, C \le 30$ (전체 공간의 크기는 최대 $30^3 = 27,000$으로 매우 작음)

시간 제한: 1초 (약 $10^8$번 연산 가능)

공간 제한: 128MB

## 복잡도 분석

시간복잡도 : $O(V + E) = O(L \cdot R \cdot C)$

공간복잡도 : $O(V) = O(L \cdot R \cdot C)$


## 접근법
그냥 bfs하고, visited에 -1로 초기화하고 거리 기록하면 된다.


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

int dx[6] = {1,0,-1,0,0,0};
int dy[6] = {0,1,0,-1,0,0};
int dz[6] = {0,0,0,0,1,-1};

int L,R,C;

struct Pos {
    int l,r,c;
};

int bfs(vector<vector<vector<char>>> &v, vector<vector<vector<int>>> &visited, Pos& start){
    visited[start.l][start.r][start.c] = 0;
    deque<Pos> q;
    q.push_back(start);
    while (!q.empty()){
        Pos Now = q.front(); q.pop_front();
        rep(i,0,6){
            int nl=Now.l+dz[i];
            int nr=Now.r+dy[i];
            int nc=Now.c+dx[i];
            if(0<=nl && nl < L && 0<=nr && nr < R && 0<=nc && nc <C){
                if(v[nl][nr][nc] != '#'){
                    if (v[nl][nr][nc] == 'E'){
                        return visited[Now.l][Now.r][Now.c] + 1;
                    }
                    if(visited[nl][nr][nc]==-1){ // if not visited
                        visited[nl][nr][nc]=visited[Now.l][Now.r][Now.c] + 1;
                        q.push_back({nl,nr,nc});
                    }
                }
            }
        }
    }
    return -1;
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    while (true)
    {
        cin>>L>>R>>C;
        if (!L && !R && !C) break;

        vector<vector<vector<char>>> v (L, vector<vector<char>>(R,vector<char>(C,-1)));
        vector<vector<vector<int>>> visited (L, vector<vector<int>>(R,vector<int>(C,-1)));

        Pos start;
        rep(i,0,L){
            rep(j,0,R){
                rep(k,0,C){
                    char t;cin>> t;
                    v[i][j][k]=t;
                    if(t=='S'){
                        start.l=i;start.r=j;start.c=k;
                    }
                }
            }
        }

        int res = bfs(v,visited,start);
        if (res==-1){
            cout<<"Trapped!\n";
        } else {
            cout << "Escaped in " << res << " minute(s).\n";
        }
    }
    return 0;
}
```

### 3차원 벡터 초기화
```cpp
vector<vector<vector<char>>> v (L, vector<vector<char>>(R,vector<char>(C,-1)));
```
갯수, 내용 순서대로

### Aggregate Initialization
```cpp
deque<Pos> q;
q.push_back({nl,nr,nc});
```
C++에서 구조체 생성자 없이 {l, r, c}만으로 객체를 생성해 큐에 삽입

모든 구조체가 {} 만으로 초기화가 되는것은 아니다.

- 사용자 정의 생성자가 없어야 함(중요)
- private, protected 멤버 변수가 없을 것
- 가상함수가 없을 것
- 부모 클래스가 없을 것 (cpp 17 이전 기준)

정의한것이 그냥 순수 데이터 묶음이기에 aggregate initialization 가능. 컴파일러가 추론해준다고 한다.


