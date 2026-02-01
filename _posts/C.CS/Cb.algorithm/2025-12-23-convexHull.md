---
title: 23. CCW & 볼록 껍질
tags: algorithm
categories: algorithm
---

## 개념

**CCW(Counter-Clockwise)**: 세 점의 방향 관계를 판별하는 기초 연산.
**볼록 껍질(Convex Hull)**: 주어진 점들을 모두 포함하는 가장 작은 볼록 다각형.

### 핵심 특징

- **CCW**: 외적의 부호로 반시계/시계/일직선 판별
- **볼록 껍질**: 2D 점 집합의 외곽선 계산
- **기하 알고리즘의 기초**: 선분 교차, 다각형 면적 등에 활용

## CCW (Counter-Clockwise)

### 원리

```
세 점 A, B, C에 대해
벡터 AB = (B.x - A.x, B.y - A.y)
벡터 AC = (C.x - A.x, C.y - A.y)

외적 = AB × AC = (B.x-A.x)*(C.y-A.y) - (B.y-A.y)*(C.x-A.x)

외적 > 0: 반시계 방향 (CCW)
외적 = 0: 일직선 (Collinear)
외적 < 0: 시계 방향 (CW)
```

### 구현

```cpp
struct Point {
    long long x, y;
};

// 양수: 반시계, 0: 일직선, 음수: 시계
long long ccw(Point A, Point B, Point C) {
    return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}
```

## 볼록 껍질 (Convex Hull)

### 그라함 스캔

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x, y;
};

Point pivot;

long long ccw(Point A, Point B, Point C) {
    return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}

long long dist2(Point A, Point B) {
    return (A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y);
}

bool cmp(Point& a, Point& b) {
    long long v = ccw(pivot, a, b);
    if (v != 0) return v > 0;  // 반시계 방향 우선
    return dist2(pivot, a) < dist2(pivot, b);  // 가까운 점 우선
}

vector<Point> grahamScan(vector<Point>& pts) {
    int n = pts.size();

    // 가장 아래, 왼쪽 점 찾기
    int minIdx = 0;
    for (int i = 1; i < n; i++) {
        if (pts[i].y < pts[minIdx].y ||
            (pts[i].y == pts[minIdx].y && pts[i].x < pts[minIdx].x)) {
            minIdx = i;
        }
    }
    swap(pts[0], pts[minIdx]);
    pivot = pts[0];

    // 각도 기준 정렬
    sort(pts.begin() + 1, pts.end(), cmp);

    // 스택으로 볼록 껍질 구성
    vector<Point> hull;
    for (auto& p : pts) {
        while (hull.size() >= 2 &&
               ccw(hull[hull.size()-2], hull[hull.size()-1], p) <= 0) {
            hull.pop_back();
        }
        hull.push_back(p);
    }

    return hull;
}
```

### 모노톤 체인

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x, y;
    bool operator<(const Point& o) const {
        return x < o.x || (x == o.x && y < o.y);
    }
};

long long ccw(Point A, Point B, Point C) {
    return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}

vector<Point> monotoneChain(vector<Point>& pts) {
    int n = pts.size();
    if (n < 3) return pts;

    sort(pts.begin(), pts.end());

    vector<Point> hull;

    // 아래 껍질 (Lower Hull)
    for (auto& p : pts) {
        while (hull.size() >= 2 &&
               ccw(hull[hull.size()-2], hull[hull.size()-1], p) <= 0) {
            hull.pop_back();
        }
        hull.push_back(p);
    }

    // 위 껍질 (Upper Hull)
    int lower_size = hull.size();
    for (int i = n - 2; i >= 0; i--) {
        while ((int)hull.size() > lower_size &&
               ccw(hull[hull.size()-2], hull[hull.size()-1], pts[i]) <= 0) {
            hull.pop_back();
        }
        hull.push_back(pts[i]);
    }

    hull.pop_back();  // 마지막 점 (시작점과 중복) 제거
    return hull;
}
```

## 선분 교차 판정

```cpp
struct Point {
    long long x, y;
};

long long ccw(Point A, Point B, Point C) {
    return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}

bool onSegment(Point p, Point a, Point b) {
    return min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

// 선분 AB와 선분 CD의 교차 판정
bool intersects(Point A, Point B, Point C, Point D) {
    long long d1 = ccw(A, B, C);
    long long d2 = ccw(A, B, D);
    long long d3 = ccw(C, D, A);
    long long d4 = ccw(C, D, B);

    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
        return true;
    }

    // 일직선 위의 경우
    if (d1 == 0 && onSegment(C, A, B)) return true;
    if (d2 == 0 && onSegment(D, A, B)) return true;
    if (d3 == 0 && onSegment(A, C, D)) return true;
    if (d4 == 0 && onSegment(B, C, D)) return true;

    return false;
}
```

## 사용 예시

### 다각형의 면적 (Shoelace Formula)

```cpp
// 볼록/오목 다각형 모두 가능
double polygonArea(vector<Point>& pts) {
    long long area2 = 0;
    int n = pts.size();

    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        area2 += pts[i].x * pts[j].y;
        area2 -= pts[j].x * pts[i].y;
    }

    return abs(area2) / 2.0;
}
```

### 볼록 껍질 넓이

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int N;
    cin >> N;

    vector<Point> pts(N);
    for (int i = 0; i < N; i++) cin >> pts[i].x >> pts[i].y;

    vector<Point> hull = monotoneChain(pts);

    // Shoelace로 넓이 계산
    long long area2 = 0;
    int n = hull.size();
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        area2 += hull[i].x * hull[j].y;
        area2 -= hull[j].x * hull[i].y;
    }

    cout << fixed << setprecision(1) << abs(area2) / 2.0 << '\n';
    return 0;
}
```

## 주의사항 / Edge Cases

### 정수 오버플로우

```cpp
// 좌표가 10^6이면 외적 값이 10^12 → long long 필수
long long ccw = (long long)(B.x - A.x) * (C.y - A.y)
              - (long long)(B.y - A.y) * (C.x - A.x);
```

### 일직선 위의 점

```cpp
// ccw = 0인 경우 별도 처리 필요
// 볼록 껍질: <= 0 (일직선 점 제외) vs < 0 (일직선 점 포함)
```

### 점이 2개 이하

```cpp
// 볼록 껍질은 최소 3개의 점이 필요
// 모든 점이 일직선이면 볼록 껍질이 선분
```

### 부동소수점 오차

```cpp
// 가능하면 정수 연산으로 처리
// double을 써야 하면 EPS = 1e-9 정도로 비교
```

## 면접 포인트

### 자주 나오는 질문

**Q1. CCW란?**
> - 세 점의 방향 관계를 판별하는 연산
> - 외적의 부호로 반시계(+), 시계(-), 일직선(0) 판별
> - 기하 알고리즘의 가장 기본 연산

**Q2. 볼록 껍질의 시간복잡도는?**
> - 정렬: O(N log N), 스캔: O(N)
> - 전체: O(N log N)

**Q3. 그라함 스캔 vs 모노톤 체인?**
> - 그라함 스캔: 각도 정렬, 하나의 스캔
> - 모노톤 체인: x좌표 정렬, 상/하 두 번 스캔
> - 모노톤 체인이 구현이 더 간단하고 안정적

**Q4. 선분 교차 판정에서 CCW를 사용하는 이유는?**
> - 두 선분이 교차하려면 한 선분의 양 끝점이 다른 선분 기준으로 반대편에 있어야 함
> - CCW 부호가 다르면 반대편 → 교차

### 코드 체크리스트

```cpp
// 1. Point 구조체 (long long 사용)
// 2. CCW 함수 구현
// 3. 정렬 (각도 or x좌표)
// 4. 스택으로 볼록 껍질 구성
// 5. 오버플로우 주의
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Gold | CCW | [BOJ 11758](https://www.acmicpc.net/problem/11758) | CCW 기본 |
| Gold | 선분 교차 1 | [BOJ 17386](https://www.acmicpc.net/problem/17386) | 선분 교차 |
| Gold | 선분 교차 2 | [BOJ 17387](https://www.acmicpc.net/problem/17387) | 경계 포함 교차 |
| Platinum | 볼록 껍질 | [BOJ 1708](https://www.acmicpc.net/problem/1708) | 기본 볼록 껍질 |
| Platinum | 로버트 후드 | [BOJ 9240](https://www.acmicpc.net/problem/9240) | 볼록 껍질 + 회전 캘리퍼스 |
| Gold | 다각형의 면적 | [BOJ 2166](https://www.acmicpc.net/problem/2166) | Shoelace |
