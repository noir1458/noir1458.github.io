---
title: BOJ 11758 CCW
slug: BOJ11758
publishedAt: '2026-01-04'
categories: BOJ
math: true
---

## 문제
점 3개 주어질때 선분의 방향을 구하면 된다.  
주어지는 선분을 순서대로 이었을때 반시계라면 1, 시계라면 -1, 일직선이면 0


## 접근법
벡터 행렬식의 부호가 답이다.


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

    int x1,y1,x2,y2,x3,y3;
    cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3;

    int v1_x = (x2-x1);
    int v1_y = (y2-y1);
    int v2_x = (x3-x1);
    int v2_y = (y3-y1);

    int z = v1_x * v2_y - v1_y * v2_x;
    cout << (z>0)-(z<0);

    return 0;
}
```
1-2-3 점을 잇는 상황이다.  
12 벡터, 13 벡터를 외적하고 구하면 된다.

나는 왜 2번 점을 중심으로 한 두 벡터라고 생각하고 있었는지 잘 모르겠다. 날먹 문제집에 있던 문제인데 하나 배워간다.

1-2-3 으로 이어지는 상황에서, 1-2 로 가다가 2-3으로 꺾이는 방향을 궁금해하는 것이다.  
2번을 중심으로 잡으면 2-1 순서가 되어 가던 방향의 반대가 된다.

## 정수에서 부호 뽑아내기

```cpp
cout << (z>0)-(z<0);
```
이게 정수에서 부호만 뽑아내는 방법이다.
