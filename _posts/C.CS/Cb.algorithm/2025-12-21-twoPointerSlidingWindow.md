---
title: 21. 투 포인터 & 슬라이딩 윈도우
tags: algorithm
categories: algorithm
---

## 개념

배열이나 리스트에서 두 개의 포인터를 사용하여 O(N)에 문제를 해결하는 기법이다.

### 핵심 특징

- **투 포인터**: 두 포인터가 같은/다른 방향으로 이동하며 조건 탐색
- **슬라이딩 윈도우**: 고정 또는 가변 크기의 구간을 이동하며 처리
- **O(N²) → O(N)**: 이중 for문을 단일 순회로 최적화

### 투 포인터 유형

```
1. 같은 방향 이동 (left, right 둘 다 오른쪽)
   - 연속 부분 배열의 합
   - 조건 만족하는 최소/최대 구간

2. 양쪽에서 이동 (left→, ←right)
   - 정렬된 배열에서 두 수의 합
   - 물 담기 (container with most water)
```

## 핵심 연산 & 시간복잡도

| 기법 | 시간복잡도 | 공간복잡도 |
|------|-----------|-----------|
| 투 포인터 | **O(N)** | O(1) |
| 슬라이딩 윈도우 | **O(N)** | O(1) or O(K) |

## 투 포인터

### 연속 부분 배열의 합 (같은 방향)

```cpp
#include <bits/stdc++.h>
using namespace std;

// 합이 S 이상인 최소 길이 연속 부분 배열
int minLenSubarraySum(int arr[], int N, int S) {
    int left = 0, sum = 0;
    int minLen = N + 1;

    for (int right = 0; right < N; right++) {
        sum += arr[right];

        while (sum >= S) {
            minLen = min(minLen, right - left + 1);
            sum -= arr[left++];
        }
    }

    return minLen == N + 1 ? 0 : minLen;
}
```

### 두 수의 합 (양방향)

```cpp
#include <bits/stdc++.h>
using namespace std;

// 정렬된 배열에서 합이 target인 두 수 찾기
pair<int, int> twoSum(int arr[], int N, int target) {
    int left = 0, right = N - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];

        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }

    return {-1, -1};  // 못 찾음
}
```

### 연속 부분 수열의 합 개수

```cpp
#include <bits/stdc++.h>
using namespace std;

// 합이 정확히 M인 연속 부분 수열의 개수
int main() {
    int N, M;
    cin >> N >> M;

    vector<int> arr(N);
    for (int i = 0; i < N; i++) cin >> arr[i];

    int left = 0, sum = 0;
    int count = 0;

    for (int right = 0; right < N; right++) {
        sum += arr[right];

        while (sum > M && left <= right) {
            sum -= arr[left++];
        }

        if (sum == M) count++;
    }

    cout << count << '\n';
    return 0;
}
```

## 슬라이딩 윈도우

### 고정 크기 윈도우

```cpp
#include <bits/stdc++.h>
using namespace std;

// 크기 K인 연속 구간의 최대 합
int maxSumWindow(int arr[], int N, int K) {
    int sum = 0;
    for (int i = 0; i < K; i++) sum += arr[i];

    int maxSum = sum;

    for (int i = K; i < N; i++) {
        sum += arr[i] - arr[i - K];  // 오른쪽 추가, 왼쪽 제거
        maxSum = max(maxSum, sum);
    }

    return maxSum;
}
```

### 가변 크기 윈도우

```cpp
#include <bits/stdc++.h>
using namespace std;

// 서로 다른 문자가 최대 K개인 최장 부분 문자열
int longestWithKDistinct(string& s, int K) {
    int cnt[128] = {};
    int distinct = 0;
    int left = 0, maxLen = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        if (cnt[s[right]]++ == 0) distinct++;

        while (distinct > K) {
            if (--cnt[s[left]] == 0) distinct--;
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

### 슬라이딩 윈도우 최대/최소 (Deque)

```cpp
#include <bits/stdc++.h>
using namespace std;

// 크기 K인 윈도우의 최댓값 (O(N))
vector<int> windowMax(int arr[], int N, int K) {
    deque<int> dq;  // 인덱스 저장, 단조 감소
    vector<int> result;

    for (int i = 0; i < N; i++) {
        // 뒤에서 현재보다 작은 원소 제거
        while (!dq.empty() && arr[dq.back()] <= arr[i]) {
            dq.pop_back();
        }
        dq.push_back(i);

        // 앞에서 윈도우 벗어난 원소 제거
        if (dq.front() <= i - K) {
            dq.pop_front();
        }

        if (i >= K - 1) {
            result.push_back(arr[dq.front()]);
        }
    }

    return result;
}
```

## 사용 예시

### 겹치지 않는 두 구간의 최대 합

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, K;
    cin >> N >> K;

    vector<int> arr(N);
    for (int i = 0; i < N; i++) cin >> arr[i];

    // prefix[i]: 0~i 구간에서 크기 K인 최대 합
    // suffix[i]: i~N-1 구간에서 크기 K인 최대 합

    vector<int> prefix(N, 0), suffix(N, 0);

    int sum = 0;
    for (int i = 0; i < K; i++) sum += arr[i];
    prefix[K - 1] = sum;

    for (int i = K; i < N; i++) {
        sum += arr[i] - arr[i - K];
        prefix[i] = max(prefix[i - 1], sum);
    }

    sum = 0;
    for (int i = N - 1; i >= N - K; i--) sum += arr[i];
    suffix[N - K] = sum;

    for (int i = N - K - 1; i >= 0; i--) {
        sum += arr[i] - arr[i + K];
        suffix[i] = max(suffix[i + 1], sum);
    }

    int ans = 0;
    for (int i = K - 1; i < N - K; i++) {
        ans = max(ans, prefix[i] + suffix[i + 1]);
    }

    cout << ans << '\n';
    return 0;
}
```

## 주의사항 / Edge Cases

### 포인터 범위

```cpp
// left가 right를 넘지 않도록
while (sum > target && left <= right) {
    sum -= arr[left++];
}
```

### 음수 원소

```cpp
// 투 포인터 (같은 방향)는 원소가 양수일 때만 동작
// 음수가 있으면 sum이 감소할 수 있어 포인터 이동 조건이 깨짐
// 음수가 있는 경우: prefix sum + 이분 탐색 또는 다른 접근
```

### 빈 구간

```cpp
// 윈도우 크기 K > N인 경우 처리
if (K > N) { /* 불가능 */ }
```

### 초기 윈도우 설정

```cpp
// 첫 번째 윈도우를 별도로 설정해야 함
int sum = 0;
for (int i = 0; i < K; i++) sum += arr[i];
// 그 후 슬라이딩
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 투 포인터란?**
> - 두 개의 포인터를 사용하여 배열을 O(N)에 탐색하는 기법
> - 같은 방향 이동 또는 양쪽에서 이동

**Q2. 투 포인터가 O(N)인 이유는?**
> - 각 포인터가 최대 N번 이동
> - left와 right 각각 한 방향으로만 이동
> - 총 이동 횟수: O(N) + O(N) = O(N)

**Q3. 슬라이딩 윈도우에서 Deque를 사용하는 이유는?**
> - 윈도우 내 최대/최소를 O(1)에 구하기 위해
> - 단조 큐(Monotone Queue)를 유지하여 양쪽에서 삽입/삭제

**Q4. 투 포인터를 적용할 수 없는 경우는?**
> - 원소에 음수가 있을 때 (합 기반 같은 방향 투 포인터)
> - 연속이 아닌 부분 수열에서 (연속 구간에서만 동작)
> - 이런 경우 prefix sum + 이분 탐색 또는 DP 사용

### 코드 체크리스트

```cpp
// 투 포인터
// 1. left, right 초기화
// 2. right 이동하며 값 추가
// 3. 조건에 따라 left 이동
// 4. 범위 체크 (left <= right)

// 슬라이딩 윈도우
// 1. 첫 윈도우 계산
// 2. 오른쪽 추가, 왼쪽 제거
// 3. 매 단계 결과 갱신
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 수들의 합 2 | [BOJ 2003](https://www.acmicpc.net/problem/2003) | 기본 투 포인터 |
| Silver | 두 수의 합 | [BOJ 3273](https://www.acmicpc.net/problem/3273) | 양방향 투 포인터 |
| Gold | 수 고르기 | [BOJ 2230](https://www.acmicpc.net/problem/2230) | 정렬 + 투 포인터 |
| Gold | 회전 초밥 | [BOJ 15961](https://www.acmicpc.net/problem/15961) | 슬라이딩 윈도우 |
| Gold | 부분합 | [BOJ 1806](https://www.acmicpc.net/problem/1806) | 최소 길이 부분 합 |
| Platinum | 최솟값 찾기 | [BOJ 11003](https://www.acmicpc.net/problem/11003) | 슬라이딩 윈도우 + Deque |
| Gold | 소수의 연속합 | [BOJ 1644](https://www.acmicpc.net/problem/1644) | 소수 + 투 포인터 |
