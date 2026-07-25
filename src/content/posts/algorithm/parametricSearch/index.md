---
title: 6. 파라메트릭 서치
slug: parametricSearch
publishedAt: '2025-12-06'
categories: algorithm
math: false
---

## 개념

최적화 문제를 결정 문제(Yes/No)로 바꾸어 이진 탐색으로 해결하는 기법이다.

### 핵심 아이디어

```
최적화 문제: "조건을 만족하는 최댓값/최솟값을 구하라"
            ↓ 변환
결정 문제:   "값이 X일 때 조건을 만족하는가?" (Yes/No)
            ↓
이진 탐색으로 X의 범위를 좁혀감
```

### 적용 가능 조건

1. **결정 문제로 변환 가능**: "X로 가능한가?"를 O(N) 또는 O(N log N)에 판별
2. **단조성(Monotonicity)**: 가능/불가능의 경계가 명확
   - X가 가능하면 X보다 작은(또는 큰) 값도 가능
   - X가 불가능하면 X보다 큰(또는 작은) 값도 불가능

### 예시: 나무 자르기 (BOJ 2805)

```
문제: 톱날 높이 H로 잘라서 최소 M미터 얻으려면 H의 최댓값은?

최적화: "M미터 이상 얻을 수 있는 최대 H"
        ↓
결정:   "높이 H로 잘랐을 때 M미터 이상 얻을 수 있는가?"

H가 작을수록 많이 얻음 (쉬움)
H가 클수록 적게 얻음 (어려움)

H=10: 가능 ✓
H=15: 가능 ✓
H=20: 불가능 ✗
H=17: 가능 ✓
H=18: 불가능 ✗
→ 최대 H = 17
```

## 핵심 연산 & 시간복잡도

| 연산 | 시간복잡도 | 설명 |
|------|-----------|------|
| 전체 | O(log(범위) × 판별) | 이진 탐색 × 결정 함수 |
| 예: 나무 자르기 | O(log(10⁹) × N) | ≈ 30N |

### 일반적인 복잡도

- 범위가 10⁹ → log₂(10⁹) ≈ 30회 이진 탐색
- 판별이 O(N) → 전체 O(30N) = O(N)
- 판별이 O(N log N) → 전체 O(N log N × log(범위))

## 구현

### 기본 템플릿: 최댓값 찾기

```cpp
// 조건을 만족하는 최댓값 찾기
// possible(x) = true이면 x 이하도 모두 true
long long parametricSearchMax(long long lo, long long hi) {
    long long answer = lo;  // 또는 -1 (불가능한 경우)

    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            answer = mid;     // 가능하면 저장
            lo = mid + 1;     // 더 큰 값 시도
        } else {
            hi = mid - 1;     // 더 작은 값 시도
        }
    }

    return answer;
}
```

### 기본 템플릿: 최솟값 찾기

```cpp
// 조건을 만족하는 최솟값 찾기
// possible(x) = true이면 x 이상도 모두 true
long long parametricSearchMin(long long lo, long long hi) {
    long long answer = hi;  // 또는 -1

    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            answer = mid;     // 가능하면 저장
            hi = mid - 1;     // 더 작은 값 시도
        } else {
            lo = mid + 1;     // 더 큰 값 시도
        }
    }

    return answer;
}
```

### lower_bound 스타일

```cpp
// 조건을 만족하는 첫 번째 값 (최솟값)
long long parametricLowerBound(long long lo, long long hi) {
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }

    return lo;  // 또는 isPossible(lo) 체크 후 반환
}
```

## 사용 예시

### 나무 자르기 (BOJ 2805)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N;
long long M;
vector<int> trees;

// 높이 H로 잘랐을 때 M 이상 얻을 수 있는가?
bool isPossible(long long H) {
    long long total = 0;
    for (int tree : trees) {
        if (tree > H) {
            total += tree - H;
        }
    }
    return total >= M;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> M;
    trees.resize(N);

    int maxTree = 0;
    for (int i = 0; i < N; i++) {
        cin >> trees[i];
        maxTree = max(maxTree, trees[i]);
    }

    // 파라메트릭 서치: 최댓값 찾기
    long long lo = 0, hi = maxTree;
    long long answer = 0;

    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            answer = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    cout << answer << '\n';
    return 0;
}
```

### 랜선 자르기 (BOJ 1654)

```cpp
#include <bits/stdc++.h>
using namespace std;

int K, N;
vector<long long> cables;

// 길이 L로 잘랐을 때 N개 이상 만들 수 있는가?
bool isPossible(long long L) {
    long long count = 0;
    for (long long cable : cables) {
        count += cable / L;
    }
    return count >= N;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> K >> N;
    cables.resize(K);

    long long maxCable = 0;
    for (int i = 0; i < K; i++) {
        cin >> cables[i];
        maxCable = max(maxCable, cables[i]);
    }

    // 파라메트릭 서치: 최댓값 찾기
    long long lo = 1, hi = maxCable;  // 최소 길이 1
    long long answer = 0;

    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            answer = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    cout << answer << '\n';
    return 0;
}
```

### 공유기 설치 (BOJ 2110)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, C;
vector<int> houses;

// 최소 거리가 D 이상일 때 C개 이상 설치 가능한가?
bool isPossible(int D) {
    int count = 1;            // 첫 집에 설치
    int lastPos = houses[0];

    for (int i = 1; i < N; i++) {
        if (houses[i] - lastPos >= D) {
            count++;
            lastPos = houses[i];
        }
    }

    return count >= C;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N >> C;
    houses.resize(N);

    for (int i = 0; i < N; i++) {
        cin >> houses[i];
    }

    sort(houses.begin(), houses.end());

    // 파라메트릭 서치: 최솟값의 최댓값 찾기
    int lo = 1;
    int hi = houses[N - 1] - houses[0];
    int answer = 0;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            answer = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    cout << answer << '\n';
    return 0;
}
```

### 예산 (BOJ 2512)

```cpp
#include <bits/stdc++.h>
using namespace std;

int N;
long long M;
vector<int> budgets;

// 상한액이 limit일 때 총 예산이 M 이하인가?
bool isPossible(int limit) {
    long long total = 0;
    for (int budget : budgets) {
        total += min(budget, limit);
    }
    return total <= M;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> N;
    budgets.resize(N);

    int maxBudget = 0;
    for (int i = 0; i < N; i++) {
        cin >> budgets[i];
        maxBudget = max(maxBudget, budgets[i]);
    }
    cin >> M;

    // 파라메트릭 서치: 최댓값 찾기
    int lo = 0, hi = maxBudget;
    int answer = 0;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;

        if (isPossible(mid)) {
            answer = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    cout << answer << '\n';
    return 0;
}
```

### 실수 범위 파라메트릭 (용액 농도 등)

```cpp
// 실수 범위에서 조건을 만족하는 값 찾기
double parametricSearchReal(double lo, double hi) {
    // 방법 1: 충분한 반복 횟수
    for (int iter = 0; iter < 100; iter++) {
        double mid = (lo + hi) / 2;

        if (isPossible(mid)) {
            lo = mid;  // 더 큰 값 시도 (최댓값 찾기)
        } else {
            hi = mid;
        }
    }
    return lo;

    // 방법 2: 오차 기반
    // while (hi - lo > 1e-9) { ... }
}
```

## 주의사항 / Edge Cases

### 탐색 범위 설정

```cpp
// 최소 가능한 값과 최대 가능한 값 정확히 설정
long long lo = 1;                    // 보통 1 또는 0
long long hi = 2e9;                  // 문제 조건 확인
// 또는
long long hi = *max_element(arr.begin(), arr.end());
```

### 오버플로우 주의

```cpp
// mid 계산
long long mid = lo + (hi - lo) / 2;  // 안전

// 판별 함수 내부
long long total = 0;
for (int x : arr) {
    total += x;  // long long 사용
    if (total >= target) return true;  // 조기 종료로 오버플로우 방지
}
```

### lo = 0일 때 나눗셈 주의

```cpp
// 길이로 나눌 때 0으로 나누기 방지
long long lo = 1;  // 0이 아닌 1부터

// 또는 isPossible에서 체크
bool isPossible(long long L) {
    if (L == 0) return true;  // 또는 false, 문제에 따라
    ...
}
```

### 정답이 없는 경우

```cpp
long long answer = -1;  // 불가능한 경우의 초기값

while (lo <= hi) {
    ...
    if (isPossible(mid)) {
        answer = mid;
        ...
    }
}

if (answer == -1) {
    // 조건을 만족하는 값이 없음
}
```

### 경계값 테스트

```cpp
// 최소/최대 경계에서 정답이 나오는지 확인
// lo = 1, hi = 1 인 경우
// lo = hi = 최댓값인 경우
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 파라메트릭 서치란 무엇인가?**
> 최적화 문제를 결정 문제로 변환하여 이진 탐색으로 해결하는 기법
> - 최적화: "조건을 만족하는 최댓값/최솟값"
> - 결정: "X일 때 가능한가?" (Yes/No)

**Q2. 언제 파라메트릭 서치를 사용하나?**
> - "최대/최소를 구하라" 유형
> - 판별 함수가 단조성을 가질 때
> - 직접 구하기 어렵지만, 특정 값이 가능한지는 쉽게 판별 가능할 때

**Q3. 시간복잡도는?**
> O(log(범위) × 판별)
> - 범위가 10⁹이면 약 30회 이진 탐색
> - 판별이 O(N)이면 전체 O(N log(범위)) ≈ O(30N)

**Q4. "최솟값의 최댓값", "최댓값의 최솟값" 문제 접근법은?**
> - 최솟값의 최댓값: "최소 X 이상 가능?" → 가능한 최대 X
>   - 예: 공유기 설치 (인접 거리의 최솟값을 최대화)
> - 최댓값의 최솟값: "최대 X 이하로 가능?" → 가능한 최소 X
>   - 예: 배열 나누기 (구간 합의 최댓값을 최소화)

**Q5. 파라메트릭 서치의 핵심 구현 포인트는?**
> 1. 탐색 범위 (lo, hi) 정확히 설정
> 2. 판별 함수의 정확한 구현
> 3. lo, hi 갱신 방향 (최댓값/최솟값에 따라)
> 4. 오버플로우 주의

### 문제 유형 판별

```
문제에서 다음 키워드가 보이면 파라메트릭 서치 고려:
- "최대 길이", "최소 개수", "최대 거리"
- "~를 만족하는 최댓값/최솟값"
- "가능한 한 크게/작게"
- 범위가 크고 (10⁹ 등), 직접 탐색 불가능
```

### 코드 체크리스트

```cpp
// 1. 탐색 범위
long long lo = ???;  // 최소 가능한 값
long long hi = ???;  // 최대 가능한 값

// 2. 이진 탐색
while (lo <= hi) {
    long long mid = lo + (hi - lo) / 2;

    // 3. 판별 함수
    if (isPossible(mid)) {
        answer = mid;
        // 4. 방향 결정
        lo = mid + 1;   // 최댓값 찾기
        // hi = mid - 1; // 최솟값 찾기
    } else {
        hi = mid - 1;   // 최댓값 찾기
        // lo = mid + 1; // 최솟값 찾기
    }
}
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | 랜선 자르기 | [BOJ 1654](https://www.acmicpc.net/problem/1654) | 기본 |
| Silver | 나무 자르기 | [BOJ 2805](https://www.acmicpc.net/problem/2805) | 기본 |
| Silver | 예산 | [BOJ 2512](https://www.acmicpc.net/problem/2512) | 상한액 |
| Gold | 공유기 설치 | [BOJ 2110](https://www.acmicpc.net/problem/2110) | 최솟값의 최댓값 |
| Gold | 기타 레슨 | [BOJ 2343](https://www.acmicpc.net/problem/2343) | 최댓값의 최솟값 |
| Gold | 입국심사 | [BOJ 3079](https://www.acmicpc.net/problem/3079) | 시간 최솟값 |
| Gold | 휴게소 세우기 | [BOJ 1477](https://www.acmicpc.net/problem/1477) | 최댓값의 최솟값 |
| Platinum | K번째 수 | [BOJ 1300](https://www.acmicpc.net/problem/1300) | 이진 탐색 응용 |
