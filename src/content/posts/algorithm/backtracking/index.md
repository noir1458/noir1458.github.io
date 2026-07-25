---
title: 20. 백트래킹
slug: backtracking
publishedAt: '2025-12-20'
categories: algorithm
math: false
---

## 개념

해를 찾는 과정에서 유망하지 않은 경로를 조기에 포기(가지치기)하고 다른 경로를 탐색하는 기법이다.

### 핵심 특징

- **DFS 기반 완전 탐색**: 가능한 모든 경우를 탐색
- **가지치기(Pruning)**: 유망하지 않으면 더 진행하지 않고 되돌아감
- **상태 공간 트리**: 가능한 선택들을 트리로 표현

### 완전 탐색 vs 백트래킹

| 특성 | 완전 탐색 | 백트래킹 |
|------|----------|---------|
| 탐색 범위 | 모든 경우 | 유망한 경우만 |
| 가지치기 | X | O |
| 효율성 | 낮음 | 높음 (가지치기에 따라) |

## 핵심 연산 & 시간복잡도

| 문제 | 완전 탐색 | 백트래킹 (가지치기) |
|------|----------|------------------|
| N-Queen | O(N!) | 실질적으로 훨씬 적음 |
| 순열 | O(N!) | O(N!) (최악) |
| 부분집합 | O(2ⁿ) | O(2ⁿ) (최악) |
| 스도쿠 | O(9⁸¹) | 실질적으로 훨씬 적음 |

## 가지치기 (Pruning)

```
가지치기 전략:
1. 유효성 검사: 현재 선택이 조건을 만족하는지
2. 한계 검사: 남은 선택으로 최적해에 도달 가능한지
3. 대칭 제거: 대칭적인 해를 중복 탐색하지 않음

핵심: 탐색을 계속해도 해가 될 수 없으면 즉시 중단
```

```cpp
void backtrack(int depth) {
    // 가지치기: 유망하지 않으면 중단
    if (!isPromising(depth)) return;

    // 해를 찾음
    if (depth == target) {
        processSolution();
        return;
    }

    // 다음 선택지 탐색
    for (각 선택지) {
        makeChoice();
        backtrack(depth + 1);
        undoChoice();  // 상태 복원
    }
}
```

## 대표 유형

### N-Queen

```cpp
#include <bits/stdc++.h>
using namespace std;

int N;
int col[15];      // col[i] = i번째 행의 퀸이 놓인 열
bool usedCol[15]; // 열 사용 여부
bool usedDiag1[30]; // / 대각선 (row + col)
bool usedDiag2[30]; // \ 대각선 (row - col + N - 1)
int count_ans = 0;

void solve(int row) {
    if (row == N) {
        count_ans++;
        return;
    }

    for (int c = 0; c < N; c++) {
        if (usedCol[c]) continue;
        if (usedDiag1[row + c]) continue;
        if (usedDiag2[row - c + N - 1]) continue;

        col[row] = c;
        usedCol[c] = usedDiag1[row + c] = usedDiag2[row - c + N - 1] = true;

        solve(row + 1);

        usedCol[c] = usedDiag1[row + c] = usedDiag2[row - c + N - 1] = false;
    }
}

int main() {
    cin >> N;
    solve(0);
    cout << count_ans << '\n';
    return 0;
}
```

### 순열/조합 생성

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, M;
int arr[9];
bool used[9];

// 순열: N개에서 M개 선택 (순서 O)
void permutation(int depth) {
    if (depth == M) {
        for (int i = 0; i < M; i++) cout << arr[i] << ' ';
        cout << '\n';
        return;
    }

    for (int i = 1; i <= N; i++) {
        if (used[i]) continue;
        arr[depth] = i;
        used[i] = true;
        permutation(depth + 1);
        used[i] = false;
    }
}

// 조합: N개에서 M개 선택 (순서 X)
void combination(int depth, int start) {
    if (depth == M) {
        for (int i = 0; i < M; i++) cout << arr[i] << ' ';
        cout << '\n';
        return;
    }

    for (int i = start; i <= N; i++) {
        arr[depth] = i;
        combination(depth + 1, i + 1);
    }
}

// 중복 순열
void permutationWithRepeat(int depth) {
    if (depth == M) {
        for (int i = 0; i < M; i++) cout << arr[i] << ' ';
        cout << '\n';
        return;
    }

    for (int i = 1; i <= N; i++) {
        arr[depth] = i;
        permutationWithRepeat(depth + 1);
    }
}

// 중복 조합
void combinationWithRepeat(int depth, int start) {
    if (depth == M) {
        for (int i = 0; i < M; i++) cout << arr[i] << ' ';
        cout << '\n';
        return;
    }

    for (int i = start; i <= N; i++) {
        arr[depth] = i;
        combinationWithRepeat(depth + 1, i);  // i+1이 아닌 i
    }
}
```

### 스도쿠

```cpp
#include <bits/stdc++.h>
using namespace std;

int board[9][9];
vector<pair<int, int>> blanks;

bool isValid(int row, int col, int num) {
    // 행 체크
    for (int j = 0; j < 9; j++)
        if (board[row][j] == num) return false;

    // 열 체크
    for (int i = 0; i < 9; i++)
        if (board[i][col] == num) return false;

    // 3x3 박스 체크
    int sr = (row / 3) * 3, sc = (col / 3) * 3;
    for (int i = sr; i < sr + 3; i++)
        for (int j = sc; j < sc + 3; j++)
            if (board[i][j] == num) return false;

    return true;
}

bool solve(int idx) {
    if (idx == (int)blanks.size()) return true;

    auto [r, c] = blanks[idx];

    for (int num = 1; num <= 9; num++) {
        if (!isValid(r, c, num)) continue;

        board[r][c] = num;
        if (solve(idx + 1)) return true;
        board[r][c] = 0;  // 복원
    }

    return false;
}

int main() {
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++) {
            cin >> board[i][j];
            if (board[i][j] == 0) blanks.push_back({i, j});
        }

    solve(0);

    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) cout << board[i][j] << ' ';
        cout << '\n';
    }

    return 0;
}
```

## 사용 예시

### 부분집합의 합

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, S;
int arr[21];
int count_ans = 0;

void solve(int idx, int sum) {
    if (idx == N) {
        if (sum == S) count_ans++;
        return;
    }

    solve(idx + 1, sum + arr[idx]);  // 포함
    solve(idx + 1, sum);              // 미포함
}

int main() {
    cin >> N >> S;
    for (int i = 0; i < N; i++) cin >> arr[i];

    solve(0, 0);

    if (S == 0) count_ans--;  // 공집합 제외
    cout << count_ans << '\n';
    return 0;
}
```

### 가지치기 적용 예시

```cpp
// 부분집합의 합에 가지치기 추가
int suffix[21];  // suffix[i] = arr[i] + arr[i+1] + ... + arr[N-1]

void solve(int idx, int sum) {
    if (sum == S) { count_ans++; }

    if (idx == N) return;

    // 가지치기: 남은 원소를 다 더해도 S에 못 미치면 중단
    if (sum + suffix[idx] < S) return;

    // 가지치기: 이미 S를 초과했고, 남은 원소가 다 양수면 중단
    if (sum > S && /* 남은 원소가 모두 양수 */) return;

    solve(idx + 1, sum + arr[idx]);
    solve(idx + 1, sum);
}
```

## 주의사항 / Edge Cases

### 상태 복원 (Undo)

```cpp
// 백트래킹의 핵심: 선택 후 반드시 복원
used[i] = true;
backtrack(depth + 1);
used[i] = false;  // 복원 필수!
```

### 가지치기 조건 순서

```cpp
// 가지치기는 가능한 한 빨리 (비용이 적은 검사부터)
if (usedCol[c]) continue;           // O(1) 검사
if (usedDiag1[row + c]) continue;   // O(1) 검사
// 복잡한 유효성 검사는 뒤에
```

### 중복 제거

```cpp
// 같은 원소가 있을 때 중복 순열 방지
sort(arr, arr + N);

void solve(int depth) {
    for (int i = 0; i < N; i++) {
        if (used[i]) continue;
        if (i > 0 && arr[i] == arr[i-1] && !used[i-1]) continue;  // 중복 방지
        // ...
    }
}
```

## 면접 포인트

### 자주 나오는 질문

**Q1. 백트래킹이란?**
> - DFS 기반 탐색에서 유망하지 않은 경로를 가지치기하여 탐색 공간을 줄이는 기법
> - 조기 포기로 불필요한 계산을 방지

**Q2. 가지치기의 효과는?**
> - 최악의 경우 전체 탐색과 동일하지만, 실제로는 탐색 공간을 크게 줄임
> - N-Queen: N!에서 실제 탐색 노드 수가 매우 적음
> - 좋은 가지치기 조건이 성능의 핵심

**Q3. 백트래킹 vs 브루트포스?**
> - 브루트포스: 모든 경우를 다 시도
> - 백트래킹: 유망하지 않으면 중단, 가지치기로 최적화
> - 브루트포스의 최적화된 버전

**Q4. 대표적인 백트래킹 문제는?**
> - N-Queen, 스도쿠, 미로 탐색
> - 순열/조합 생성
> - 부분집합의 합, 그래프 색칠

### 코드 체크리스트

```cpp
// 1. 기저 조건 (해를 찾았거나 더 이상 탐색 불가)
// 2. 가지치기 (유망하지 않으면 return)
// 3. 선택 → 재귀 → 복원 (undo)
// 4. 중복 방지 (필요 시)
```

## 추천 문제

| 난이도 | 문제 | 링크 | 핵심 |
|--------|------|------|------|
| Silver | N과 M (1~4) | [BOJ 15649](https://www.acmicpc.net/problem/15649) | 순열/조합 기본 |
| Silver | N-Queen | [BOJ 9663](https://www.acmicpc.net/problem/9663) | N-Queen |
| Silver | 부분수열의 합 | [BOJ 1182](https://www.acmicpc.net/problem/1182) | 부분집합 |
| Gold | 스도쿠 | [BOJ 2580](https://www.acmicpc.net/problem/2580) | 스도쿠 |
| Gold | 로또 | [BOJ 6603](https://www.acmicpc.net/problem/6603) | 조합 |
| Gold | 스타트와 링크 | [BOJ 14889](https://www.acmicpc.net/problem/14889) | 팀 분할 |
| Gold | 연산자 끼워넣기 | [BOJ 14888](https://www.acmicpc.net/problem/14888) | 순열 탐색 |
