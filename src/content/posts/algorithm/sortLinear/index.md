---
title: '4. 정렬 (선형) - 계수, 기수, 버킷'
slug: sortLinear
publishedAt: '2025-12-04'
categories: algorithm
math: false
---

## 개념

비교 기반이 아닌 O(N) 시간의 정렬 알고리즘들이다.

### 비교 기반 vs 비비교 기반

| 분류 | 하한 | 원리 | 제약 |
|------|------|------|------|
| 비교 기반 | Ω(N log N) | 원소 간 대소 비교 | 없음 |
| 비비교 기반 | O(N) 가능 | 원소의 값/자릿수 활용 | 값의 범위, 자료형 제한 |

### 언제 사용하나?

- **계수 정렬**: 값의 범위가 작을 때 (0 ~ K, K ≤ 10⁷)
- **기수 정렬**: 자릿수가 적을 때 (정수, 문자열)
- **버킷 정렬**: 균등 분포 데이터

## 계수 정렬 (Counting Sort)

각 값의 등장 횟수를 세어 정렬하는 방식.

### 동작 원리

```
입력: [4, 2, 2, 8, 3, 3, 1]
범위: 0 ~ 8

1. 카운트 배열 생성
count[0]=0, count[1]=1, count[2]=2, count[3]=2, count[4]=1, ..., count[8]=1

인덱스: 0  1  2  3  4  5  6  7  8
count:  0  1  2  2  1  0  0  0  1

2. 누적합 (안정 정렬용)
인덱스: 0  1  2  3  4  5  6  7  8
누적:   0  1  3  5  6  6  6  6  7

3. 뒤에서부터 배치 (안정성 보장)
원본 뒤에서: 1 → output[count[1]-1] = output[0], count[1]--
           3 → output[count[3]-1] = output[4], count[3]--
           3 → output[count[3]-1] = output[3], count[3]--
           ...

결과: [1, 2, 2, 3, 3, 4, 8]
```

### 시간복잡도 & 특성

| 항목 | 값 |
|------|-----|
| 시간 | **O(N + K)** (K = 최댓값) |
| 공간 | O(N + K) |
| 안정성 | **안정 (Stable)** - 누적합 방식 |
| 제약 | 정수, 범위 제한 |

### 구현

```cpp
// 기본 버전 (값 범위: 0 ~ maxVal)
void countingSort(int arr[], int n, int maxVal) {
    int* count = new int[maxVal + 1]();  // 0으로 초기화
    int* output = new int[n];

    // 1. 카운트
    for (int i = 0; i < n; i++) {
        count[arr[i]]++;
    }

    // 2. 누적합
    for (int i = 1; i <= maxVal; i++) {
        count[i] += count[i - 1];
    }

    // 3. 뒤에서부터 배치 (안정성 보장)
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    // 4. 결과 복사
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    delete[] count;
    delete[] output;
}
```

### 간단 버전 (순서 무관, 공간 절약)

```cpp
// 안정성 불필요할 때
void countingSortSimple(int arr[], int n, int maxVal) {
    int* count = new int[maxVal + 1]();

    // 카운트
    for (int i = 0; i < n; i++) {
        count[arr[i]]++;
    }

    // 순서대로 출력
    int idx = 0;
    for (int i = 0; i <= maxVal; i++) {
        while (count[i]-- > 0) {
            arr[idx++] = i;
        }
    }

    delete[] count;
}
```

### 음수 포함 버전

```cpp
void countingSortWithNegative(int arr[], int n) {
    int minVal = *std::min_element(arr, arr + n);
    int maxVal = *std::max_element(arr, arr + n);
    int range = maxVal - minVal + 1;

    int* count = new int[range]();
    int* output = new int[n];

    // 오프셋 적용
    for (int i = 0; i < n; i++) {
        count[arr[i] - minVal]++;
    }

    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - minVal] - 1] = arr[i];
        count[arr[i] - minVal]--;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    delete[] count;
    delete[] output;
}
```

## 기수 정렬 (Radix Sort)

자릿수별로 정렬을 반복하는 방식.

### 동작 원리

```
입력: [170, 45, 75, 90, 802, 24, 2, 66]

1의 자리 기준 정렬:
[170, 90, 802, 2, 24, 45, 75, 66]

10의 자리 기준 정렬:
[802, 2, 24, 45, 66, 170, 75, 90]

100의 자리 기준 정렬:
[2, 24, 45, 66, 75, 90, 170, 802]

결과: [2, 24, 45, 66, 75, 90, 170, 802]
```

### LSD vs MSD

| 방식 | 설명 | 특징 |
|------|------|------|
| LSD (Least Significant Digit) | 낮은 자리부터 | 안정 정렬 필요, 구현 쉬움 |
| MSD (Most Significant Digit) | 높은 자리부터 | 조기 종료 가능, 구현 복잡 |

### 시간복잡도 & 특성

| 항목 | 값 |
|------|-----|
| 시간 | **O(D × (N + K))** (D = 자릿수, K = 기수) |
| 공간 | O(N + K) |
| 안정성 | **안정 (Stable)** |
| 제약 | 정수, 문자열 |

### 구현 (LSD, 10진수)

```cpp
// 특정 자릿수 기준 계수 정렬
void countingSortByDigit(int arr[], int n, int exp) {
    int* output = new int[n];
    int count[10] = {0};

    // 해당 자릿수 카운트
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }

    // 누적합
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 뒤에서부터 배치
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    delete[] output;
}

void radixSort(int arr[], int n) {
    // 최댓값 찾기
    int maxVal = *std::max_element(arr, arr + n);

    // 1의 자리부터 최고 자리까지
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        countingSortByDigit(arr, n, exp);
    }
}
```

### 음수 포함 버전

```cpp
void radixSortWithNegative(int arr[], int n) {
    std::vector<int> negative, positive;

    for (int i = 0; i < n; i++) {
        if (arr[i] < 0) negative.push_back(-arr[i]);
        else positive.push_back(arr[i]);
    }

    // 양수 기수 정렬
    if (!positive.empty()) {
        radixSort(positive.data(), positive.size());
    }

    // 음수 기수 정렬 (절댓값 기준)
    if (!negative.empty()) {
        radixSort(negative.data(), negative.size());
    }

    // 음수는 역순으로, 양수는 순서대로
    int idx = 0;
    for (int i = negative.size() - 1; i >= 0; i--) {
        arr[idx++] = -negative[i];
    }
    for (int i = 0; i < positive.size(); i++) {
        arr[idx++] = positive[i];
    }
}
```

### 문자열 기수 정렬

```cpp
void radixSortStrings(std::vector<std::string>& arr, int maxLen) {
    const int ALPHABET = 256;

    for (int pos = maxLen - 1; pos >= 0; pos--) {
        std::vector<int> count(ALPHABET + 1, 0);
        std::vector<std::string> output(arr.size());

        // 카운트 (문자열이 짧으면 0으로 처리)
        for (const auto& s : arr) {
            int c = (pos < s.length()) ? (unsigned char)s[pos] : 0;
            count[c + 1]++;
        }

        // 누적합
        for (int i = 0; i < ALPHABET; i++) {
            count[i + 1] += count[i];
        }

        // 배치
        for (const auto& s : arr) {
            int c = (pos < s.length()) ? (unsigned char)s[pos] : 0;
            output[count[c]++] = s;
        }

        arr = output;
    }
}
```

## 버킷 정렬 (Bucket Sort)

데이터를 여러 버킷에 분배한 후 각 버킷을 정렬하는 방식.

### 동작 원리

```
입력: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]
범위: 0.0 ~ 1.0, 버킷 10개

1. 버킷에 분배
bucket[0]: []
bucket[1]: [0.17, 0.12]
bucket[2]: [0.26, 0.21, 0.23]
bucket[3]: [0.39]
...
bucket[7]: [0.78, 0.72, 0.68]
bucket[9]: [0.94]

2. 각 버킷 정렬
bucket[1]: [0.12, 0.17]
bucket[2]: [0.21, 0.23, 0.26]
bucket[7]: [0.68, 0.72, 0.78]
...

3. 버킷 순서대로 합치기
[0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]
```

### 시간복잡도 & 특성

| 항목 | 값 |
|------|-----|
| 시간 (평균) | **O(N + K)** (K = 버킷 수, 균등 분포) |
| 시간 (최악) | O(N²) (모든 원소가 한 버킷에) |
| 공간 | O(N + K) |
| 안정성 | 버킷 내 정렬에 따름 |
| 제약 | 균등 분포 데이터에 효과적 |

### 구현 (실수 0~1)

```cpp
void bucketSort(float arr[], int n) {
    std::vector<std::vector<float>> buckets(n);

    // 1. 버킷에 분배
    for (int i = 0; i < n; i++) {
        int bucketIdx = n * arr[i];  // 0 <= arr[i] < 1
        if (bucketIdx >= n) bucketIdx = n - 1;  // 1.0 처리
        buckets[bucketIdx].push_back(arr[i]);
    }

    // 2. 각 버킷 정렬
    for (int i = 0; i < n; i++) {
        std::sort(buckets[i].begin(), buckets[i].end());
    }

    // 3. 합치기
    int idx = 0;
    for (int i = 0; i < n; i++) {
        for (float val : buckets[i]) {
            arr[idx++] = val;
        }
    }
}
```

### 정수 버전

```cpp
void bucketSortInt(int arr[], int n) {
    int minVal = *std::min_element(arr, arr + n);
    int maxVal = *std::max_element(arr, arr + n);

    int bucketCount = n;
    int range = maxVal - minVal + 1;
    int bucketSize = (range + bucketCount - 1) / bucketCount;  // 올림

    std::vector<std::vector<int>> buckets(bucketCount);

    // 분배
    for (int i = 0; i < n; i++) {
        int bucketIdx = (arr[i] - minVal) / bucketSize;
        if (bucketIdx >= bucketCount) bucketIdx = bucketCount - 1;
        buckets[bucketIdx].push_back(arr[i]);
    }

    // 각 버킷 정렬 (삽입 정렬 - 작은 버킷에 효율적)
    for (auto& bucket : buckets) {
        for (int i = 1; i < bucket.size(); i++) {
            int key = bucket[i];
            int j = i - 1;
            while (j >= 0 && bucket[j] > key) {
                bucket[j + 1] = bucket[j];
                j--;
            }
            bucket[j + 1] = key;
        }
    }

    // 합치기
    int idx = 0;
    for (const auto& bucket : buckets) {
        for (int val : bucket) {
            arr[idx++] = val;
        }
    }
}
```

## 비교 정리

### 시간/공간 복잡도

| 알고리즘 | 시간 (평균) | 시간 (최악) | 공간 | 안정성 |
|----------|-------------|-------------|------|--------|
| 계수 | O(N + K) | O(N + K) | O(N + K) | 안정 |
| 기수 | O(D(N + K)) | O(D(N + K)) | O(N + K) | 안정 |
| 버킷 | O(N + K) | O(N²) | O(N + K) | 조건부 |

### 사용 조건

| 알고리즘 | 적합한 경우 | 부적합한 경우 |
|----------|-------------|---------------|
| 계수 | 정수, 범위 작음 (K ≤ 10⁷) | 범위 큼, 실수 |
| 기수 | 자릿수 적음, 정수/문자열 | 실수, 자릿수 많음 |
| 버킷 | 균등 분포, 실수 | 편향 분포 |

### 비교 기반 vs 선형 정렬

```
N = 1,000,000, K = 1,000

비교 기반 O(N log N):
≈ 1,000,000 × 20 = 20,000,000 연산

계수 정렬 O(N + K):
≈ 1,000,000 + 1,000 = 1,001,000 연산

→ 약 20배 빠름 (조건 맞을 때)
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 선형 정렬이 항상 비교 정렬보다 빠른가?**
> 아니오. 조건이 맞아야 함
> - 계수 정렬: K가 N보다 훨씬 크면 비효율 (K > N²이면 O(N²)보다 느림)
> - 기수 정렬: 자릿수 D가 크면 O(DN) > O(N log N)
> - 버킷 정렬: 편향 분포면 O(N²)

**Q2. 계수 정렬이 안정 정렬인 이유는?**
> 누적합 방식 + 뒤에서부터 배치
> - 같은 값 중 나중에 나온 것이 먼저 배치됨
> - 결과적으로 원래 순서 유지

**Q3. 기수 정렬에서 LSD를 쓰는 이유는?**
> - 낮은 자리부터 정렬하면 안정 정렬만으로 충분
> - MSD는 각 버킷을 따로 재귀 정렬해야 함
> - LSD가 구현 간단, 일반적으로 효율적

**Q4. 실수를 계수 정렬할 수 있는가?**
> 직접은 불가. 대안:
> - 버킷 정렬 사용
> - 스케일링: 실수 × 10^k → 정수로 변환
> - 값 매핑: 정렬 후 원래 값 복원

**Q5. BOJ 10989(수 정렬하기 3)를 계수 정렬로 푸는 이유는?**
> - N = 10,000,000, 값 범위 1 ~ 10,000
> - O(N log N) = 2.3억 연산 → 시간 초과 위험
> - O(N + K) = 1000만 + 1만 = 약 1000만 연산
> - 메모리도 int[10001]만 필요

### 코드 구현 시 주의사항

```cpp
// 1. 계수 정렬: 배열 크기
int count[maxVal + 1];  // maxVal이 10^7 이하인지 확인

// 2. 기수 정렬: 자릿수 추출
int digit = (arr[i] / exp) % 10;  // exp = 1, 10, 100, ...

// 3. 버킷 정렬: 버킷 인덱스 범위
int bucketIdx = n * arr[i];
if (bucketIdx >= n) bucketIdx = n - 1;  // 경계 처리

// 4. 음수 처리
// 계수: 오프셋 적용 (minVal 빼기)
// 기수: 양수/음수 분리 후 처리
```

## STL 활용

```cpp
#include <algorithm>
#include <vector>

// 특정 범위 정수에 최적화된 정렬은 STL에 없음
// 직접 구현하거나 조건에 따라 선택

// 부분적으로 활용 가능한 것들
std::vector<int> v = {4, 2, 2, 8, 3, 3, 1};

// 범위 확인
auto [minIt, maxIt] = std::minmax_element(v.begin(), v.end());
int range = *maxIt - *minIt + 1;

// range가 작으면 계수 정렬, 아니면 std::sort
if (range <= 1000000) {
    // 계수 정렬 구현
} else {
    std::sort(v.begin(), v.end());
}
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 수 정렬하기 3 | [BOJ 10989](https://www.acmicpc.net/problem/10989) | 계수 정렬 필수 |
| Silver | 카드 | [BOJ 11652](https://www.acmicpc.net/problem/11652) | 정렬 + 카운트 |
| Gold | 수 정렬하기 4 | [BOJ 11931](https://www.acmicpc.net/problem/11931) | 내림차순 정렬 |
| Gold | 좌표 압축 | [BOJ 18870](https://www.acmicpc.net/problem/18870) | 정렬 활용 |
| Platinum | 접미사 배열 | [BOJ 9248](https://www.acmicpc.net/problem/9248) | 기수 정렬 응용 |
