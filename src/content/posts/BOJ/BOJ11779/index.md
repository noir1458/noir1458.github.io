---
title: BOJ 11779 최소비용 구하기 2 (dijkstra)
slug: BOJ11779
publishedAt: '2026-01-21'
categories: BOJ
math: true
---

## 문제

시작점에서 도착점까지 가는 최소 비용을 출력하고, 최단 경로에 포함된 도시의 개수와 그 경로를 순서대로 출력해야 함.

dijkstra 문제임


## 복잡도 분석

- 시간복잡도 : $O(M \log M)$ 또는 $O(M \log N)$.

- 공간 복잡도: $O(N + M)$
    - 인접 리스트 $O(M)$, 최단 거리 및 부모 배열 $O(N)$.

## 접근법

dijkstra 알고리즘으로 구하고, 역추적까지 해서 출력하기

## 풀이
```cpp
#include <bits/stdc++.h>
using namespace std;

int n,m;
struct Edge{
    int vertex,cost;
    bool operator<(const Edge& other) const{
        return cost > other.cost;
    }
};
vector<vector<Edge>> g;
vector<int> parent;
vector<int> dist;

void dijkstra(int start, int end){
    priority_queue<Edge, vector<Edge>> pq;
    pq.push({start,0});

    while (!pq.empty()){
        // pop
        Edge curr = pq.top(); pq.pop();
        // check
        if (dist[curr.vertex] < curr.cost) continue;
        // relaxation
        for(const auto &next:g[curr.vertex]){
            if (dist[next.vertex] > curr.cost + next.cost){
                dist[next.vertex] = curr.cost + next.cost;
                parent[next.vertex] = curr.vertex;
                pq.push({next.vertex,dist[next.vertex]});
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    cin >> n >> m;
    g.resize(n+1,vector<Edge> (0));
    parent.resize(n+1,-1);
    dist.resize(n+1,1e9);
    
    for(int i=0;i<m;i++){
        int a,b,c; cin>>a>>b>>c;
        g[a].push_back({b,c});
    }

    int start,end; cin>>start>>end;
    dist[start] = 0;
    dijkstra(start,end);
    
    cout << dist[end] << "\n";
    vector<int> res;
    for(int i=end;i!=-1;i=parent[i]){
        res.push_back(i);
    }
    reverse(res.begin(),res.end());
    cout << size(res) << "\n";
    for(const auto &e:res){
        cout << e << " ";
    }

    return 0;
}
```

```cpp
bool operator<(const Edge&other) const{ 
        // pq안에서 < 사용해 정렬, max heap이 기본
        return C>other.C; // 내 cost 가 크면 참이 되도록
    }
```
이렇게 안할거면 pair로 저장하고 cost,vertex 가 앞에 오도록 해야 한다. 기본이 max_heap 이므로 -붙여서 저장해도 되고.

```cpp
// std::greater<T> 명시적 선언
// priority_queue<타입, 내부 컨테이너, 비교 함수 객체>
priority_queue<Edge, vector<Edge>, greater<Edge>> pq;
```
또는 기본이 max_heap 라서 내부적으로 std::less 비교연산자를 사용하고 있는데, 이건 a<b 이면 b 우선순위가 높다는것임.

priority_queue 선언시 3번째 인자로 greater<Edge> 하면 된다. 내부 로직이 less에서 greater로 바뀌어서 min-heap로 작동함.

이 방식을 쓰려면 operator> 또는 < 가 기본적으로 정의되어 있어야 한다.

