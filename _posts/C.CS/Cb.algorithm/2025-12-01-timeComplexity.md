---
title: 1. 시간복잡도와 공간복잡도
tags: algorithm
categories: algorithm
---

## 개념

알고리즘의 효율성을 분석하는 방법이다. 입력 크기 N에 따라 연산 횟수(시간)와 메모리 사용량(공간)이 어떻게 증가하는지 표현한다.

- **시간복잡도**: 알고리즘이 수행하는 연산 횟수의 증가율
- **공간복잡도**: 알고리즘이 사용하는 메모리의 증가율
- 실제 실행 시간이 아닌 **증가 추세(Growth Rate)**에 집중
- 하드웨어, 언어에 독립적인 분석 가능

### 점근적 표기법 (Asymptotic Notation)

| 표기법 | 의미 | 설명 |
|--------|------|------|
| O (Big-O) | 상한 | 최악의 경우 (가장 많이 사용) |
| Ω (Big-Omega) | 하한 | 최선의 경우 |
| Θ (Big-Theta) | 상한 = 하한 | 평균적 경우 (정확한 차수) |

```
예: f(N) = 3N² + 2N + 1

O(N²)  - 최악의 경우 N²에 비례
Ω(N²)  - 최선의 경우도 N²에 비례
Θ(N²)  - 정확히 N² 차수
```

### Big-O 계산 규칙

1. **상수 제거**: O(2N) → O(N)
2. **낮은 차수 제거**: O(N² + N) → O(N²)
3. **상수는 O(1)**: O(1000) → O(1)

## 시간복잡도

### 주요 복잡도 종류

| 복잡도 | 명칭 | N=10 | N=100 | N=1000 | 예시 |
|--------|------|------|-------|--------|------|
| O(1) | 상수 | 1 | 1 | 1 | 배열 인덱스 접근 |
| O(log N) | 로그 | 3 | 7 | 10 | 이진 탐색 |
| O(N) | 선형 | 10 | 100 | 1000 | 선형 탐색 |
| O(N log N) | 선형로그 | 33 | 664 | 9966 | 병합/퀵 정렬 |
| O(N²) | 이차 | 100 | 10000 | 10⁶ | 버블 정렬 |
| O(N³) | 삼차 | 1000 | 10⁶ | 10⁹ | 플로이드-워셜 |
| O(2^N) | 지수 | 1024 | 10³⁰ | - | 부분집합 |
| O(N!) | 팩토리얼 | 10⁶ | - | - | 순열 |

### 코테 시간 제한 기준 (1초 기준)

| 복잡도 | 허용 N 범위 |
|--------|-------------|
| O(N!) | N ≤ 10 |
| O(2^N) | N ≤ 20~25 |
| O(N³) | N ≤ 500 |
| O(N²) | N ≤ 5,000~10,000 |
| O(N log N) | N ≤ 1,000,000 |
| O(N) | N ≤ 10,000,000 |
| O(log N) | N ≤ 10¹⁸ |

### 분석 예시

```cpp
// O(1) - 상수 시간
int getFirst(int arr[], int n) {
    return arr[0];
}

// O(N) - 선형 시간
int sum(int arr[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {  // N번
        total += arr[i];            // O(1)
    }
    return total;
}

// O(N²) - 이차 시간
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {       // N번
        for (int j = 0; j < n-1; j++) { // N번
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}

// O(log N) - 로그 시간
int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {             // log₂N번
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// O(N log N) - 선형로그 시간
void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);      // T(N/2)
    mergeSort(arr, mid + 1, right); // T(N/2)
    merge(arr, left, mid, right);   // O(N)
}
// T(N) = 2T(N/2) + O(N) = O(N log N)

// O(2^N) - 지수 시간
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

// O(N!) - 팩토리얼 시간
void permutation(int arr[], int depth, int n) {
    if (depth == n) {
        // 순열 하나 완성
        return;
    }
    for (int i = depth; i < n; i++) {
        swap(arr[depth], arr[i]);
        permutation(arr, depth + 1, n);
        swap(arr[depth], arr[i]);
    }
}
```

### 복잡한 코드 분석

```cpp
// 중첩 루프라고 무조건 O(N²)이 아님
void example1(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j += i + 1) {  // i에 따라 반복 횟수 다름
            // ...
        }
    }
}
// 실제: O(N log N) - 조화급수

// 여러 변수가 있는 경우
void example2(int n, int m) {
    for (int i = 0; i < n; i++) {      // O(N)
        for (int j = 0; j < m; j++) {  // O(M)
            // ...
        }
    }
}
// O(N * M) - N과 M 관계 모르면 분리 표기

// 조기 종료가 있는 경우
bool find(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return true;  // 조기 종료
    }
    return false;
}
// 최선: O(1), 최악: O(N), 평균: O(N)
```

### 재귀 시간복잡도 (마스터 정리)

T(N) = aT(N/b) + O(N^d) 형태일 때:

| 조건 | 복잡도 |
|------|--------|
| d < log_b(a) | O(N^(log_b(a))) |
| d = log_b(a) | O(N^d log N) |
| d > log_b(a) | O(N^d) |

```
예: 병합 정렬 T(N) = 2T(N/2) + O(N)
a=2, b=2, d=1
log₂2 = 1 = d
→ O(N log N)
```

## 공간복잡도

알고리즘이 사용하는 메모리 공간의 증가율

### 구성 요소

1. **고정 공간**: 코드, 상수, 변수 (입력 크기와 무관)
2. **가변 공간**: 동적 할당, 재귀 스택 (입력 크기에 비례)

### 분석 예시

```cpp
// O(1) - 상수 공간
int sum(int arr[], int n) {
    int total = 0;  // 변수 1개
    for (int i = 0; i < n; i++) {
        total += arr[i];
    }
    return total;
}

// O(N) - 선형 공간
int* copyArray(int arr[], int n) {
    int* copy = new int[n];  // N개 공간
    for (int i = 0; i < n; i++) {
        copy[i] = arr[i];
    }
    return copy;
}

// O(N) - 재귀 스택
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);  // 콜스택 N개
}

// O(log N) - 재귀 스택 (이진 탐색)
int binarySearchRecur(int arr[], int left, int right, int target) {
    if (left > right) return -1;
    int mid = (left + right) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target)
        return binarySearchRecur(arr, mid + 1, right, target);
    else
        return binarySearchRecur(arr, left, mid - 1, target);
}
// 콜스택 깊이: log₂N

// O(N²) - 2차원 배열
int** create2DArray(int n) {
    int** arr = new int*[n];
    for (int i = 0; i < n; i++) {
        arr[i] = new int[n];  // 총 N*N 공간
    }
    return arr;
}
```

### 시간-공간 트레이드오프

| 상황 | 시간 | 공간 | 예시 |
|------|------|------|------|
| 메모이제이션 | 개선 | 증가 | DP |
| In-place 정렬 | 유지 | 개선 | 퀵소트 |
| 해시 테이블 | 개선 | 증가 | O(1) 탐색 |

```cpp
// 피보나치 - 시간 vs 공간 트레이드오프

// 1. 순수 재귀: O(2^N) 시간, O(N) 공간
int fib1(int n) {
    if (n <= 1) return n;
    return fib1(n-1) + fib1(n-2);
}

// 2. 메모이제이션: O(N) 시간, O(N) 공간
int memo[100] = {0};
int fib2(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fib2(n-1) + fib2(n-2);
}

// 3. 타뷸레이션: O(N) 시간, O(N) 공간
int fib3(int n) {
    int dp[n+1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}

// 4. 공간 최적화: O(N) 시간, O(1) 공간
int fib4(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

## 주요 복잡도 비교

### 증가율 그래프 (N = 1 ~ 100)

```
연산 수
    ^
    |                                    O(2^N)
    |                               /
    |                           /
    |                       /
    |                   ___/   O(N²)
    |               ___/
    |           ___/
    |       __--    O(N log N)
    |   __--___----
    |__--___----     O(N)
    |___----_____    O(log N)
    |____________    O(1)
    +-------------------> N
```

### 실제 연산 횟수 비교

| N | O(1) | O(log N) | O(N) | O(N log N) | O(N²) | O(2^N) |
|---|------|----------|------|------------|-------|--------|
| 10 | 1 | 3 | 10 | 33 | 100 | 1,024 |
| 100 | 1 | 7 | 100 | 664 | 10,000 | 10³⁰ |
| 1,000 | 1 | 10 | 1,000 | 9,966 | 10⁶ | - |
| 10,000 | 1 | 13 | 10,000 | 132,877 | 10⁸ | - |

### 알고리즘별 복잡도 정리

| 알고리즘 | 시간 (평균) | 시간 (최악) | 공간 |
|----------|-------------|-------------|------|
| 이진 탐색 | O(log N) | O(log N) | O(1) |
| 버블 정렬 | O(N²) | O(N²) | O(1) |
| 병합 정렬 | O(N log N) | O(N log N) | O(N) |
| 퀵 정렬 | O(N log N) | O(N²) | O(log N) |
| 힙 정렬 | O(N log N) | O(N log N) | O(1) |
| 해시 탐색 | O(1) | O(N) | O(N) |
| DFS/BFS | O(V + E) | O(V + E) | O(V) |
| 다익스트라 | O(E log V) | O(E log V) | O(V) |

## 면접 포인트

### 자주 나오는 질문

**Q1. O(N)과 O(2N)의 차이는?**
> 차이 없음. Big-O는 상수를 무시하므로 둘 다 O(N)

**Q2. 최선/평균/최악 복잡도가 다른 알고리즘 예시?**
> 퀵 정렬: 최선 O(N log N), 평균 O(N log N), 최악 O(N²)
> 선형 탐색: 최선 O(1), 평균 O(N), 최악 O(N)

**Q3. 시간복잡도가 같으면 성능도 같은가?**
> 아니오. O(N)이어도 실제 상수 계수가 다르면 성능 차이 있음
> 예: 10N vs 1000N 둘 다 O(N)이지만 100배 차이

**Q4. 공간복잡도를 줄이는 방법은?**
> - In-place 알고리즘 사용 (추가 배열 대신 swap)
> - 재귀 → 반복문 변환 (콜스택 제거)
> - 슬라이딩 윈도우, 투 포인터 활용
> - DP 공간 최적화 (이전 상태만 저장)

**Q5. Amortized(분할 상환) 복잡도란?**
> 여러 연산의 평균 시간. 개별 연산은 O(N)일 수 있지만 전체로 보면 O(1)
> 예: vector push_back - 가끔 O(N) 재할당, 평균 O(1)

### 코테에서의 활용

```cpp
// 문제: N이 10만이면 어떤 알고리즘?
// 1초에 약 10⁸ 연산 가정

// N = 100,000
// O(N²) = 10¹⁰ → 시간 초과
// O(N log N) = 1.6 × 10⁶ → 통과
// O(N) = 10⁵ → 통과

// 따라서 O(N log N) 이하 알고리즘 필요
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Bronze | 알고리즘 수업 - 알고리즘의 수행 시간 1 | [BOJ 24262](https://www.acmicpc.net/problem/24262) | O(1) |
| Bronze | 알고리즘 수업 - 알고리즘의 수행 시간 2 | [BOJ 24263](https://www.acmicpc.net/problem/24263) | O(N) |
| Bronze | 알고리즘 수업 - 알고리즘의 수행 시간 3 | [BOJ 24264](https://www.acmicpc.net/problem/24264) | O(N²) |
| Bronze | 알고리즘 수업 - 알고리즘의 수행 시간 4 | [BOJ 24265](https://www.acmicpc.net/problem/24265) | 중첩 루프 |
| Bronze | 알고리즘 수업 - 알고리즘의 수행 시간 5 | [BOJ 24266](https://www.acmicpc.net/problem/24266) | O(N³) |
| Bronze | 알고리즘 수업 - 알고리즘의 수행 시간 6 | [BOJ 24267](https://www.acmicpc.net/problem/24267) | 조합 |
