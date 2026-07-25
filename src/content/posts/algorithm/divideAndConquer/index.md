---
title: 19. 분할 정복
slug: divideAndConquer
publishedAt: '2025-12-19'
categories: algorithm
math: false
---

## 개념

문제를 더 작은 부분 문제로 나누어 해결한 후, 결과를 합쳐서 원래 문제의 답을 구하는 알고리즘 설계 기법이다.

### 핵심 특징

- **Divide**: 문제를 같은 유형의 작은 문제로 분할
- **Conquer**: 부분 문제를 재귀적으로 해결
- **Combine**: 부분 문제의 해를 합쳐서 원래 문제의 해 도출
- **부분 문제가 겹치지 않음**: DP와의 핵심 차이

### 분할 정복 vs DP

| 특성 | 분할 정복 | DP |
|------|----------|-----|
| 부분 문제 중복 | X | O |
| 접근 | Top-Down | Top-Down or Bottom-Up |
| 예시 | 병합 정렬, 퀵 정렬 | 피보나치, LCS |

## 핵심 연산 & 시간복잡도

### 마스터 정리

```
T(n) = aT(n/b) + O(n^d)

a: 부분 문제 수
b: 분할 비율
d: 합치기 비용의 차수

경우 1: d < log_b(a)  →  O(n^(log_b(a)))
경우 2: d = log_b(a)  →  O(n^d · log n)
경우 3: d > log_b(a)  →  O(n^d)
```

| 알고리즘 | 점화식 | 시간복잡도 |
|---------|--------|-----------|
| 병합 정렬 | T(n) = 2T(n/2) + O(n) | **O(N log N)** |
| 빠른 거듭제곱 | T(n) = T(n/2) + O(1) | **O(log N)** |
| 카라츠바 곱셈 | T(n) = 3T(n/2) + O(n) | O(N^1.585) |

## 대표 유형

### 병합 정렬

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[100001];
int tmp[100001];

void merge(int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) tmp[k++] = arr[i++];
        else tmp[k++] = arr[j++];
    }

    while (i <= mid) tmp[k++] = arr[i++];
    while (j <= right) tmp[k++] = arr[j++];

    for (int i = left; i <= right; i++) {
        arr[i] = tmp[i];
    }
}

void mergeSort(int left, int right) {
    if (left >= right) return;

    int mid = (left + right) / 2;
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
}
```

### 거듭제곱 (빠른 거듭제곱)

```cpp
// a^n mod m을 O(log n)에 계산
long long power(long long a, long long n, long long m) {
    long long result = 1;
    a %= m;

    while (n > 0) {
        if (n & 1) {
            result = result * a % m;
        }
        a = a * a % m;
        n >>= 1;
    }

    return result;
}

// 재귀 버전
long long powerRec(long long a, long long n, long long m) {
    if (n == 0) return 1;
    if (n == 1) return a % m;

    long long half = powerRec(a, n / 2, m);
    long long result = half * half % m;

    if (n % 2 == 1) {
        result = result * a % m;
    }

    return result;
}
```

### 행렬 거듭제곱

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef vector<vector<long long>> Matrix;
const long long MOD = 1e9 + 7;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n, 0));

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            for (int k = 0; k < n; k++)
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;

    return C;
}

Matrix matPow(Matrix A, long long n) {
    int sz = A.size();
    Matrix result(sz, vector<long long>(sz, 0));
    for (int i = 0; i < sz; i++) result[i][i] = 1;  // 단위 행렬

    while (n > 0) {
        if (n & 1) result = multiply(result, A);
        A = multiply(A, A);
        n >>= 1;
    }

    return result;
}

// 피보나치 O(log N) 계산
// [F(n+1)] = [1 1]^n * [1]
// [F(n)  ]   [1 0]     [0]
long long fibonacci(long long n) {
    if (n <= 1) return n;

    Matrix M = {
        {1, 1}, {1, 0}
        };
    Matrix result = matPow(M, n - 1);

    return result[0][0];
}
```

### 히스토그램에서 가장 큰 직사각형

```cpp
#include <bits/stdc++.h>
using namespace std;

long long height[100001];

long long solve(int left, int right) {
    if (left == right) return height[left];

    int mid = (left + right) / 2;

    // 왼쪽, 오른쪽 각각 분할
    long long ans = max(solve(left, mid), solve(mid + 1, right));

    // 중앙을 포함하는 경우
    int lo = mid, hi = mid + 1;
    long long h = min(height[lo], height[hi]);
    ans = max(ans, h * 2);

    while (lo > left || hi < right) {
        // 높이가 더 높은 쪽으로 확장
        if (hi < right && (lo == left || height[hi + 1] >= height[lo - 1])) {
            hi++;
            h = min(h, height[hi]);
        } else {
            lo--;
            h = min(h, height[lo]);
        }
        ans = max(ans, h * (long long)(hi - lo + 1));
    }

    return ans;
}

int main() {
    int N;
    while (cin >> N && N) {
        for (int i = 0; i < N; i++) cin >> height[i];
        cout << solve(0, N - 1) << '\n';
    }
    return 0;
}
```

### 카운팅 인버전 (Counting Inversions)

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[500001];
int tmp[500001];
long long cnt;

void merge(int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            tmp[k++] = arr[i++];
        } else {
            tmp[k++] = arr[j++];
            cnt += (mid - i + 1);  // 역전 개수 누적
        }
    }

    while (i <= mid) tmp[k++] = arr[i++];
    while (j <= right) tmp[k++] = arr[j++];

    for (int i = left; i <= right; i++) arr[i] = tmp[i];
}

void mergeSort(int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
}

int main() {
    int N;
    cin >> N;
    for (int i = 0; i < N; i++) cin >> arr[i];

    cnt = 0;
    mergeSort(0, N - 1);
    cout << cnt << '\n';
    return 0;
}
```

## 사용 예시

### 가장 가까운 두 점

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x, y;
};

long long dist2(Point& a, Point& b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

long long closestPair(vector<Point>& pts, int left, int right) {
    if (right - left < 3) {
        long long mn = LLONG_MAX;
        for (int i = left; i < right; i++)
            for (int j = i + 1; j <= right; j++)
                mn = min(mn, dist2(pts[i], pts[j]));
        sort(pts.begin() + left, pts.begin() + right + 1,
             [](auto& a, auto& b) { return a.y < b.y; });
        return mn;
    }

    int mid = (left + right) / 2;
    long long midX = pts[mid].x;

    long long d = min(closestPair(pts, left, mid),
                      closestPair(pts, mid + 1, right));

    // 병합 (y 기준 정렬)
    vector<Point> merged;
    merge(pts.begin() + left, pts.begin() + mid + 1,
          pts.begin() + mid + 1, pts.begin() + right + 1,
          back_inserter(merged),
          [](auto& a, auto& b) { return a.y < b.y; });
    copy(merged.begin(), merged.end(), pts.begin() + left);

    // 중앙 영역 확인
    vector<Point> strip;
    for (int i = left; i <= right; i++) {
        if ((pts[i].x - midX) * (pts[i].x - midX) < d) {
            strip.push_back(pts[i]);
        }
    }

    for (int i = 0; i < (int)strip.size(); i++) {
        for (int j = i + 1; j < (int)strip.size() &&
             (strip[j].y - strip[i].y) * (strip[j].y - strip[i].y) < d; j++) {
            d = min(d, dist2(strip[i], strip[j]));
        }
    }

    return d;
}
```

## 주의사항 / Edge Cases

### 기저 조건 처리

```cpp
// 분할이 더 이상 불가능한 경우 처리
if (left >= right) return;  // 원소 1개 이하
if (left + 1 == right) { /* 원소 2개 직접 처리 */ }
```

### 오버플로우

```cpp
// 빠른 거듭제곱에서 a * a가 오버플로우 가능
// long long 범위 확인, __int128 사용 검토
result = (__int128)a * a % m;  // a가 10^18 근처일 때
```

### mid 계산

```cpp
// 오버플로우 방지
int mid = left + (right - left) / 2;  // left + right가 오버플로우 가능
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 분할 정복의 조건은?**
> - 문제를 같은 유형의 더 작은 문제로 분할 가능
> - 부분 문제의 해를 합쳐서 원래 문제의 해를 구할 수 있음
> - 부분 문제가 서로 독립적 (겹치면 DP)

**Q2. 마스터 정리란?**
> - T(n) = aT(n/b) + O(n^d) 형태의 점화식의 해를 구하는 정리
> - a, b, d의 관계로 시간복잡도를 바로 알 수 있음

**Q3. 병합 정렬이 O(N log N)인 이유는?**
> - T(n) = 2T(n/2) + O(n)
> - a=2, b=2, d=1 → d = log_b(a) → O(N log N)
> - 매 레벨 O(N), 레벨 수 log N

**Q4. 분할 정복으로 풀 수 있는 대표 문제는?**
> - 정렬 (병합, 퀵), 빠른 거듭제곱
> - 가장 가까운 두 점, 히스토그램
> - 인버전 카운팅, 행렬 거듭제곱

### 코드 체크리스트

```cpp
// 1. 기저 조건 확인 (원소 1~2개)
// 2. 분할 (mid 계산)
// 3. 재귀 호출
// 4. 합치기 (merge/combine)
// 5. 오버플로우 주의
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 쿼드트리 | [BOJ 1992](https://www.acmicpc.net/problem/1992) | 기본 분할 정복 |
| Silver | 종이의 개수 | [BOJ 1780](https://www.acmicpc.net/problem/1780) | 3분할 |
| Gold | 히스토그램에서 가장 큰 직사각형 | [BOJ 6549](https://www.acmicpc.net/problem/6549) | 분할 정복 응용 |
| Gold | 가장 가까운 두 점 | [BOJ 2261](https://www.acmicpc.net/problem/2261) | 기하 + 분할 |
| Gold | 행렬 거듭제곱 | [BOJ 10830](https://www.acmicpc.net/problem/10830) | 행렬 + 거듭제곱 |
| Gold | 피보나치 수 6 | [BOJ 11444](https://www.acmicpc.net/problem/11444) | 행렬 거듭제곱 |
| Platinum | 버블 소트 | [BOJ 1517](https://www.acmicpc.net/problem/1517) | 인버전 카운팅 |
