---
title: 5. 이진 탐색
slug: binarySearch
publishedAt: '2025-12-05'
categories: algorithm
math: false
---

## 개념

정렬된 배열에서 탐색 범위를 절반씩 줄여가며 원하는 값을 찾는 알고리즘이다.

### 핵심 아이디어

```
정렬된 배열: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
찾는 값: 11

1단계: mid = (0+9)/2 = 4, arr[4] = 9 < 11 → 오른쪽 탐색
       [_, _, _, _, _, 11, 13, 15, 17, 19]
                       ↑ left

2단계: mid = (5+9)/2 = 7, arr[7] = 15 > 11 → 왼쪽 탐색
       [_, _, _, _, _, 11, 13, _, _, _]
                              ↑ right

3단계: mid = (5+6)/2 = 5, arr[5] = 11 = 11 → 찾음!
```

### 전제 조건

- **배열이 정렬되어 있어야 함**
- 정렬 기준과 탐색 기준이 동일해야 함

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 탐색 | **O(log N)** | 매번 탐색 범위가 절반으로 |
| 전처리 (정렬) | O(N log N) | 정렬되어 있지 않다면 |

### 왜 O(log N)인가?

```
N개의 원소에서 시작
→ N/2 → N/4 → N/8 → ... → 1

반복 횟수 k: N / 2^k = 1
            k = log₂N
```

## 구현 (No-STL)

### 기본형: 값 존재 여부

```cpp
// 반복문 버전 (권장)
int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // 오버플로우 방지

        if (arr[mid] == target) {
            return mid;  // 찾음
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;  // 못 찾음
}

// 재귀 버전
int binarySearchRecur(int arr[], int left, int right, int target) {
    if (left > right) return -1;

    int mid = left + (right - left) / 2;

    if (arr[mid] == target) return mid;
    else if (arr[mid] < target)
        return binarySearchRecur(arr, mid + 1, right, target);
    else
        return binarySearchRecur(arr, left, mid - 1, target);
}
```

### Lower Bound: target 이상인 첫 위치

```cpp
// target 이상인 값이 처음 나오는 위치
// 없으면 n 반환 (삽입 위치)
int lowerBound(int arr[], int n, int target) {
    int left = 0, right = n;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}
```

### Upper Bound: target 초과인 첫 위치

```cpp
// target 초과인 값이 처음 나오는 위치
// 없으면 n 반환
int upperBound(int arr[], int n, int target) {
    int left = 0, right = n;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}
```

### Lower/Upper Bound 활용

```cpp
int arr[] = {1, 2, 2, 2, 3, 4, 5};
int n = 7;

// target = 2의 개수
int count = upperBound(arr, n, 2) - lowerBound(arr, n, 2);  // 3

// target = 2가 존재하는지
bool exists = (lowerBound(arr, n, 2) < n) && (arr[lowerBound(arr, n, 2)] == 2);

// target = 2.5 삽입 위치 (정렬 유지)
int insertPos = upperBound(arr, n, 2);  // 인덱스 4

// target 미만의 개수
int lessCount = lowerBound(arr, n, target);

// target 이하의 개수
int lessEqCount = upperBound(arr, n, target);
```

### 첫 번째 / 마지막 위치 찾기

```cpp
// target이 처음 나오는 위치 (-1 if not found)
int findFirst(int arr[], int n, int target) {
    int pos = lowerBound(arr, n, target);
    if (pos < n && arr[pos] == target) return pos;
    return -1;
}

// target이 마지막으로 나오는 위치 (-1 if not found)
int findLast(int arr[], int n, int target) {
    int pos = upperBound(arr, n, target) - 1;
    if (pos >= 0 && arr[pos] == target) return pos;
    return -1;
}
```

## STL

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {1, 2, 2, 2, 3, 4, 5};

// 존재 여부 (bool)
bool found = std::binary_search(v.begin(), v.end(), 2);  // true

// lower_bound: target 이상인 첫 iterator
auto lb = std::lower_bound(v.begin(), v.end(), 2);
int lbIdx = lb - v.begin();  // 인덱스 1

// upper_bound: target 초과인 첫 iterator
auto ub = std::upper_bound(v.begin(), v.end(), 2);
int ubIdx = ub - v.begin();  // 인덱스 4

// target 개수
int count = ub - lb;  // 3

// equal_range: {lower_bound, upper_bound} 쌍
auto [lo, hi] = std::equal_range(v.begin(), v.end(), 2);
int cnt = hi - lo;  // 3

// 내림차순 배열에서의 탐색
std::vector<int> desc = {5, 4, 3, 2, 2, 2, 1};
auto it = std::lower_bound(desc.begin(), desc.end(), 2, std::greater<int>());
// 2 이상(내림차순 기준)인 첫 위치 = 인덱스 3
```

### 커스텀 비교 함수

```cpp
struct Item {
    int id;
    int value;
};

std::vector<Item> items = {
    {1, 10}, {2, 20}, {3, 30}
    };

// value 기준 정렬
std::sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
    return a.value < b.value;
});

// value 기준 이진 탐색
auto it = std::lower_bound(items.begin(), items.end(), 25,
    [](const Item& item, int val) {
        return item.value < val;
    });
// value >= 25인 첫 위치 (인덱스 2, value=30)
```

## 사용 예시

### 특정 값의 개수 세기

```cpp
int countOccurrences(int arr[], int n, int target) {
    return upperBound(arr, n, target) - lowerBound(arr, n, target);
}
```

### 정렬된 배열에서 중복 제거된 개수

```cpp
int countUnique(int arr[], int n) {
    int count = 0;
    for (int i = 0; i < n; ) {
        count++;
        i = upperBound(arr, n, arr[i]) - arr;  // 다음 다른 값으로
    }
    return count;
}
```

### 두 배열의 교집합

```cpp
std::vector<int> intersection(std::vector<int>& a, std::vector<int>& b) {
    std::sort(a.begin(), a.end());
    std::sort(b.begin(), b.end());

    std::vector<int> result;
    for (int x : a) {
        if (std::binary_search(b.begin(), b.end(), x)) {
            if (result.empty() || result.back() != x) {
                result.push_back(x);
            }
        }
    }
    return result;
}
```

### 좌표 압축

```cpp
std::vector<int> compress(std::vector<int>& arr) {
    std::vector<int> sorted = arr;
    std::sort(sorted.begin(), sorted.end());
    sorted.erase(std::unique(sorted.begin(), sorted.end()), sorted.end());

    std::vector<int> result(arr.size());
    for (int i = 0; i < arr.size(); i++) {
        result[i] = std::lower_bound(sorted.begin(), sorted.end(), arr[i])
                    - sorted.begin();
    }
    return result;
}

// 예: [5, 100, 3, 100, 5] → [1, 2, 0, 2, 1]
```

### 회전 정렬 배열에서 탐색

```cpp
// [4, 5, 6, 7, 0, 1, 2]에서 target 찾기
int searchRotated(int arr[], int n, int target) {
    int left = 0, right = n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;

        // 왼쪽이 정렬된 상태
        if (arr[left] <= arr[mid]) {
            if (arr[left] <= target && target < arr[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // 오른쪽이 정렬된 상태
        else {
            if (arr[mid] < target && target <= arr[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}
```

### 회전 정렬 배열에서 최솟값 찾기

```cpp
int findMin(int arr[], int n) {
    int left = 0, right = n - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] > arr[right]) {
            left = mid + 1;  // 최솟값은 오른쪽에
        } else {
            right = mid;     // 최솟값은 mid 포함 왼쪽에
        }
    }

    return arr[left];
}
```

## 주의사항 / Edge Cases

### 오버플로우 방지

```cpp
// 위험: left + right가 int 범위 초과 가능
int mid = (left + right) / 2;

// 안전
int mid = left + (right - left) / 2;
```

### left < right vs left <= right

```cpp
// left <= right: 기본 탐색 (찾으면 즉시 반환)
while (left <= right) {
    if (arr[mid] == target) return mid;
    ...
}

// left < right: lower/upper bound (범위 좁히기)
while (left < right) {
    if (arr[mid] >= target) right = mid;
    else left = mid + 1;
}
```

### right 초기값

```cpp
// 기본 탐색: right = n - 1
int right = n - 1;

// lower/upper bound: right = n (n은 유효하지 않은 인덱스지만 반환값으로 가능)
int right = n;
```

### 빈 배열 처리

```cpp
int binarySearch(int arr[], int n, int target) {
    if (n == 0) return -1;  // 빈 배열 체크
    ...
}
```

### 중복 원소

```cpp
// 단순 이진 탐색: 여러 위치 중 어느 것이든 반환
// 첫 번째 위치: lower_bound
// 마지막 위치: upper_bound - 1
```

### 부동소수점 이진 탐색

```cpp
// 실수 범위 탐색
double binarySearchReal(double left, double right) {
    for (int i = 0; i < 100; i++) {  // 충분한 반복
        double mid = (left + right) / 2;
        if (condition(mid)) {
            right = mid;
        } else {
            left = mid;
        }
    }
    return left;
}

// 또는 오차 기반
while (right - left > 1e-9) {
    ...
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 이진 탐색의 시간복잡도가 O(log N)인 이유는?**
> 매 단계마다 탐색 범위가 절반으로 줄어듦
> N → N/2 → N/4 → ... → 1
> 단계 수 = log₂N

**Q2. lower_bound와 upper_bound의 차이는?**
> - lower_bound: target **이상**인 첫 위치
> - upper_bound: target **초과**인 첫 위치
> - 차이(upper - lower) = target의 개수

**Q3. 이진 탐색이 안 되는 경우는?**
> - 배열이 정렬되어 있지 않을 때
> - 탐색 기준과 정렬 기준이 다를 때
> - 연결 리스트 (O(N) 인덱스 접근)

**Q4. mid 계산 시 오버플로우를 방지하는 방법은?**
> `(left + right) / 2` 대신 `left + (right - left) / 2` 사용
> 또는 `(left + right) >> 1` (비트 연산)

**Q5. 반복문 vs 재귀 중 어떤 것이 좋은가?**
> 반복문 권장
> - 스택 오버플로우 없음
> - 약간 더 빠름 (함수 호출 오버헤드 없음)
> - 테일 콜 최적화가 보장되지 않음

### 구현 체크리스트

```cpp
// 1. 정렬 확인
std::is_sorted(arr, arr + n);

// 2. 범위 설정
int left = 0;
int right = n - 1;  // 또는 n (lower/upper bound)

// 3. 종료 조건
while (left <= right)  // 또는 left < right

// 4. mid 계산 (오버플로우 방지)
int mid = left + (right - left) / 2;

// 5. 범위 갱신
left = mid + 1;   // mid 제외
right = mid - 1;  // mid 제외
// 또는
right = mid;      // mid 포함 (lower/upper bound)
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 수 찾기 | [BOJ 1920](https://www.acmicpc.net/problem/1920) | 기본 이진 탐색 |
| Silver | 숫자 카드 2 | [BOJ 10816](https://www.acmicpc.net/problem/10816) | upper - lower |
| Silver | 좌표 압축 | [BOJ 18870](https://www.acmicpc.net/problem/18870) | lower_bound 활용 |
| Gold | 랜선 자르기 | [BOJ 1654](https://www.acmicpc.net/problem/1654) | 파라메트릭 서치 |
| Gold | 나무 자르기 | [BOJ 2805](https://www.acmicpc.net/problem/2805) | 파라메트릭 서치 |
| Gold | K번째 수 | [BOJ 1300](https://www.acmicpc.net/problem/1300) | 이진 탐색 응용 |
| Gold | 공유기 설치 | [BOJ 2110](https://www.acmicpc.net/problem/2110) | 파라메트릭 서치 |
