---
title: '3. 정렬 (고급) - 병합, 퀵, 힙'
slug: sortAdvanced
publishedAt: '2025-12-03'
categories: algorithm
math: false
---

## 개념

분할 정복(Divide and Conquer) 기반의 O(N log N) 정렬 알고리즘들이다.

### 분할 정복 패러다임

1. **분할 (Divide)**: 문제를 작은 부분 문제로 나눔
2. **정복 (Conquer)**: 부분 문제를 재귀적으로 해결
3. **결합 (Combine)**: 부분 문제의 해를 합쳐 전체 해 도출

### 비교 기반 정렬의 하한

- 비교 기반 정렬의 이론적 하한: **Ω(N log N)**
- 결정 트리(Decision Tree) 모델로 증명
- N개 원소의 순열 = N! 가지 → log₂(N!) = Ω(N log N)

## 병합 정렬 (Merge Sort)

배열을 반으로 나누고, 정렬된 두 부분을 병합하는 방식.

### 동작 원리

```
[5, 3, 8, 4, 2, 7, 1, 6]

1. 분할 (Divide)
[5, 3, 8, 4] | [2, 7, 1, 6]
[5, 3] | [8, 4] | [2, 7] | [1, 6]
[5] | [3] | [8] | [4] | [2] | [7] | [1] | [6]

2. 정복 & 병합 (Conquer & Merge)
[3, 5] | [4, 8] | [2, 7] | [1, 6]
[3, 4, 5, 8] | [1, 2, 6, 7]
[1, 2, 3, 4, 5, 6, 7, 8]
```

### 병합 과정 상세

```
병합: [3, 5] + [4, 8] → [3, 4, 5, 8]

i=0, j=0: 3 < 4 → [3], i++
i=1, j=0: 5 > 4 → [3, 4], j++
i=1, j=1: 5 < 8 → [3, 4, 5], i++
i=2, j=1: i 끝 → 나머지 복사 [3, 4, 5, 8]
```

### 시간복잡도 & 특성

| 항목 | 값 |
|------|-----|
| 최선 | O(N log N) |
| 평균 | O(N log N) |
| 최악 | O(N log N) |
| 공간 | **O(N)** - 임시 배열 필요 |
| 안정성 | **안정 (Stable)** |
| 제자리 | No |

### 구현

```cpp
int temp[100001];  // 임시 배열 (전역)

void merge(int arr[], int left, int mid, int right) {
    int i = left;      // 왼쪽 배열 포인터
    int j = mid + 1;   // 오른쪽 배열 포인터
    int k = left;      // 임시 배열 포인터

    // 두 배열 병합
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {  // <= 로 안정성 보장
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    // 왼쪽 배열 나머지
    while (i <= mid) {
        temp[k++] = arr[i++];
    }

    // 오른쪽 배열 나머지
    while (j <= right) {
        temp[k++] = arr[j++];
    }

    // 임시 배열을 원본에 복사
    for (int idx = left; idx <= right; idx++) {
        arr[idx] = temp[idx];
    }
}

void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;

    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);       // 왼쪽 정렬
    mergeSort(arr, mid + 1, right);  // 오른쪽 정렬
    merge(arr, left, mid, right);    // 병합
}

// 호출
// mergeSort(arr, 0, n - 1);
```

### 반복문 버전 (Bottom-Up)

```cpp
void mergeSortIterative(int arr[], int n) {
    for (int size = 1; size < n; size *= 2) {
        for (int left = 0; left < n - size; left += 2 * size) {
            int mid = left + size - 1;
            int right = std::min(left + 2 * size - 1, n - 1);
            merge(arr, left, mid, right);
        }
    }
}
```

## 퀵 정렬 (Quick Sort)

피벗(Pivot)을 기준으로 작은 원소와 큰 원소를 분리하는 방식.

### 동작 원리

```
[5, 3, 8, 4, 2, 7, 1, 6]  피벗 = 5 (첫 번째 원소)

1. 파티션: 5보다 작은 것 | 5 | 5보다 큰 것
[3, 4, 2, 1] | 5 | [8, 7, 6]

2. 재귀적으로 양쪽 정렬
[1, 2, 3, 4] | 5 | [6, 7, 8]

결과: [1, 2, 3, 4, 5, 6, 7, 8]
```

### 파티션 과정 (Lomuto)

```
[5, 3, 8, 4, 2, 7, 1, 6]  피벗 = 6 (마지막 원소)
 i                    p

i = 피벗보다 작은 원소들의 경계

j=0: 5 < 6 → swap(arr[0], arr[0]), i=1  [5, 3, 8, 4, 2, 7, 1, 6]
j=1: 3 < 6 → swap(arr[1], arr[1]), i=2  [5, 3, 8, 4, 2, 7, 1, 6]
j=2: 8 > 6 → skip                        [5, 3, 8, 4, 2, 7, 1, 6]
j=3: 4 < 6 → swap(arr[2], arr[3]), i=3  [5, 3, 4, 8, 2, 7, 1, 6]
j=4: 2 < 6 → swap(arr[3], arr[4]), i=4  [5, 3, 4, 2, 8, 7, 1, 6]
j=5: 7 > 6 → skip                        [5, 3, 4, 2, 8, 7, 1, 6]
j=6: 1 < 6 → swap(arr[4], arr[6]), i=5  [5, 3, 4, 2, 1, 7, 8, 6]
마지막: swap(arr[5], arr[7])             [5, 3, 4, 2, 1, 6, 8, 7]
                                                      ↑ 피벗 위치
```

### 시간복잡도 & 특성

| 항목 | 값 |
|------|-----|
| 최선 | O(N log N) |
| 평균 | O(N log N) |
| 최악 | **O(N²)** - 이미 정렬된 경우 |
| 공간 | O(log N) - 재귀 스택 |
| 안정성 | **불안정 (Unstable)** |
| 제자리 | Yes |

### 구현 (Lomuto Partition)

```cpp
int partition(int arr[], int left, int right) {
    int pivot = arr[right];  // 마지막 원소를 피벗으로
    int i = left - 1;        // 피벗보다 작은 원소들의 경계

    for (int j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    // 피벗을 올바른 위치로
    int temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;

    return i + 1;  // 피벗 위치 반환
}

void quickSort(int arr[], int left, int right) {
    if (left >= right) return;

    int pivot = partition(arr, left, right);
    quickSort(arr, left, pivot - 1);
    quickSort(arr, pivot + 1, right);
}
```

### 구현 (Hoare Partition) - 더 효율적

```cpp
int partitionHoare(int arr[], int left, int right) {
    int pivot = arr[(left + right) / 2];  // 중간 원소를 피벗으로
    int i = left - 1;
    int j = right + 1;

    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);

        if (i >= j) return j;

        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

void quickSortHoare(int arr[], int left, int right) {
    if (left >= right) return;

    int p = partitionHoare(arr, left, right);
    quickSortHoare(arr, left, p);      // 주의: p까지 포함
    quickSortHoare(arr, p + 1, right);
}
```

### 최악의 경우 방지

```cpp
#include <cstdlib>
#include <ctime>

// 1. 랜덤 피벗
int partitionRandom(int arr[], int left, int right) {
    int randomIdx = left + rand() % (right - left + 1);
    // 랜덤 원소를 맨 뒤로 이동
    int temp = arr[randomIdx];
    arr[randomIdx] = arr[right];
    arr[right] = temp;

    return partition(arr, left, right);  // 기존 파티션 사용
}

// 2. Median of Three
int medianOfThree(int arr[], int left, int right) {
    int mid = (left + right) / 2;

    // left, mid, right 중 중간값을 right로 이동
    if (arr[left] > arr[mid]) std::swap(arr[left], arr[mid]);
    if (arr[left] > arr[right]) std::swap(arr[left], arr[right]);
    if (arr[mid] > arr[right]) std::swap(arr[mid], arr[right]);

    std::swap(arr[mid], arr[right - 1]);  // 중간값을 right-1로
    return arr[right - 1];
}
```

### 3-Way 퀵 정렬 (중복 원소가 많을 때)

```cpp
void quickSort3Way(int arr[], int left, int right) {
    if (left >= right) return;

    int pivot = arr[left];
    int lt = left;      // arr[left..lt-1] < pivot
    int gt = right;     // arr[gt+1..right] > pivot
    int i = left + 1;   // arr[lt..i-1] == pivot

    while (i <= gt) {
        if (arr[i] < pivot) {
            std::swap(arr[lt++], arr[i++]);
        } else if (arr[i] > pivot) {
            std::swap(arr[i], arr[gt--]);
        } else {
            i++;
        }
    }

    // arr[left..lt-1] < pivot = arr[lt..gt] < arr[gt+1..right]
    quickSort3Way(arr, left, lt - 1);
    quickSort3Way(arr, gt + 1, right);
}
```

## 힙 정렬 (Heap Sort)

최대 힙을 이용하여 정렬하는 방식.

### 동작 원리

```
[5, 3, 8, 4, 2, 7, 1, 6]

1. 최대 힙 구성 (Heapify)
[8, 6, 7, 4, 2, 3, 1, 5]

        8
      /   \
     6     7
    / \   / \
   4   2 3   1
  /
 5

2. 하나씩 추출
[8, 6, 7, 4, 2, 3, 1, 5] → 8 추출 → [7, 6, 5, 4, 2, 3, 1] | [8]
[7, 6, 5, 4, 2, 3, 1] → 7 추출 → [6, 4, 5, 1, 2, 3] | [7, 8]
... 반복 ...
[1, 2, 3, 4, 5, 6, 7, 8]
```

### 시간복잡도 & 특성

| 항목 | 값 |
|------|-----|
| 최선 | O(N log N) |
| 평균 | O(N log N) |
| 최악 | O(N log N) |
| 공간 | **O(1)** - 제자리 정렬 |
| 안정성 | **불안정 (Unstable)** |
| 제자리 | Yes |

### 구현

```cpp
void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    // 1. 최대 힙 구성 - O(N)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 2. 하나씩 추출하여 정렬 - O(N log N)
    for (int i = n - 1; i > 0; i--) {
        // 루트(최댓값)를 맨 뒤로
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // 힙 크기 줄이고 재정렬
        heapify(arr, i, 0);
    }
}
```

### 반복문 버전 Heapify

```cpp
void heapifyIterative(int arr[], int n, int i) {
    while (true) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest == i) break;

        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        i = largest;
    }
}
```

## 비교 정리

### 시간/공간 복잡도

| 알고리즘 | 최선 | 평균 | 최악 | 공간 | 안정성 |
|----------|------|------|------|------|--------|
| 병합 | O(N log N) | O(N log N) | O(N log N) | **O(N)** | **안정** |
| 퀵 | O(N log N) | O(N log N) | **O(N²)** | O(log N) | 불안정 |
| 힙 | O(N log N) | O(N log N) | O(N log N) | **O(1)** | 불안정 |

### 특징 비교

| 알고리즘 | 장점 | 단점 | 적합한 상황 |
|----------|------|------|-------------|
| 병합 | 안정, 최악에도 O(N log N) | 추가 메모리 O(N) | 안정성 필요, 연결 리스트 |
| 퀵 | 평균적으로 가장 빠름, 캐시 효율 | 최악 O(N²), 불안정 | 일반적인 상황, 배열 |
| 힙 | 최악에도 O(N log N), O(1) 공간 | 캐시 비효율, 불안정 | 메모리 제한, 우선순위 큐 |

### 실제 성능 (상수 계수)

```
일반적인 속도: 퀵 정렬 > 병합 정렬 > 힙 정렬

이유:
- 퀵 정렬: 캐시 지역성 좋음, 분기 예측 유리
- 병합 정렬: 메모리 접근 패턴 좋음
- 힙 정렬: 메모리 접근이 불규칙 (캐시 미스)
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 퀵 정렬이 최악 O(N²)인 경우와 해결 방법은?**
> - 최악: 이미 정렬된 배열에서 첫/마지막 원소를 피벗으로 선택
> - 해결: 랜덤 피벗, Median of Three, 3-Way 파티션

**Q2. 병합 정렬과 퀵 정렬의 차이점은?**
> - 병합: 분할 후 병합 과정에서 정렬, 안정, O(N) 공간
> - 퀵: 파티션 과정에서 정렬, 불안정, O(log N) 공간
> - 병합은 분할이 간단하고 병합이 복잡, 퀵은 파티션이 복잡하고 결합이 없음

**Q3. 힙 정렬이 퀵 정렬보다 느린 이유는?**
> - 캐시 지역성: 힙은 부모-자식 접근이 메모리상 멀리 떨어짐
> - 분기 예측: 힙은 비교 결과가 불규칙
> - 하지만 최악 O(N log N) 보장, O(1) 공간이 장점

**Q4. 안정 정렬이 필요한 경우는?**
> - 다중 키 정렬 (1차: 나이, 2차: 이름)
> - 이전 정렬 결과 유지 필요
> - 예: 엑셀에서 여러 열로 정렬

**Q5. std::sort는 어떤 알고리즘인가?**
> - Introsort: 퀵 정렬 + 힙 정렬 + 삽입 정렬
> - 기본은 퀵 정렬, 재귀 깊이 초과 시 힙 정렬로 전환
> - 작은 구간(16개 이하)은 삽입 정렬
> - 평균 O(N log N), 최악 O(N log N) 보장

### 구현 시 주의사항

```cpp
// 1. 병합 정렬: 임시 배열 위치
// 전역 또는 함수 외부에 선언 (매번 할당하면 느림)
int temp[100001];

// 2. 퀵 정렬: 파티션 경계
// Lomuto: pivot 위치 반환
// Hoare: 경계 j 반환 (재귀 호출 방식 다름)

// 3. 힙 정렬: 0-indexed
// left = 2*i + 1, right = 2*i + 2
// parent = (i - 1) / 2
```

## STL 활용

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {5, 3, 8, 4, 2};

// 기본 정렬 (Introsort)
std::sort(v.begin(), v.end());

// 안정 정렬 (Merge Sort 기반)
std::stable_sort(v.begin(), v.end());

// 힙 연산
std::make_heap(v.begin(), v.end());    // 최대 힙 구성
std::push_heap(v.begin(), v.end());    // 힙에 원소 추가
std::pop_heap(v.begin(), v.end());     // 최댓값을 맨 뒤로
std::sort_heap(v.begin(), v.end());    // 힙 정렬

// 부분 정렬
std::partial_sort(v.begin(), v.begin() + k, v.end());  // 상위 k개
std::nth_element(v.begin(), v.begin() + k, v.end());   // k번째 원소

// 정렬 확인
bool sorted = std::is_sorted(v.begin(), v.end());
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 수 정렬하기 2 | [BOJ 2751](https://www.acmicpc.net/problem/2751) | O(N log N) |
| Silver | 좌표 압축 | [BOJ 18870](https://www.acmicpc.net/problem/18870) | 정렬 + 이진탐색 |
| Gold | K번째 수 | [BOJ 11004](https://www.acmicpc.net/problem/11004) | 퀵 셀렉트 |
| Gold | 버블 소트 | [BOJ 1377](https://www.acmicpc.net/problem/1377) | 정렬 원리 이해 |
| Gold | 수 정렬하기 3 | [BOJ 10989](https://www.acmicpc.net/problem/10989) | 계수 정렬 |
| Platinum | 버블 소트 2 | [BOJ 22862](https://www.acmicpc.net/problem/22862) | 역순 쌍 개수 |
