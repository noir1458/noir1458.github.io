---
title: BOJ 1131 숫자
slug: BOJ1131
publishedAt: '2026-02-15'
categories: BOJ
math: true
---

## 문제

[BOJ 1131 숫자](https://www.acmicpc.net/problem/1131)  
각 숫자 $N$에 대해 $S_K(N)$ = (각 자리 숫자의 $K$제곱 합)으로 정의하고,  
수열 $N, S_K(N), S_K(S_K(N)), \dots$ 에서 등장하는 값들의 **최솟값**을 $m(N)$이라 하자.  
주어진 구간 $[A, B]$에 대해 $\sum_{N=A}^{B} m(N)$ 을 구한다.

(입력: $A, B, K$, 제약: $1 \le A \le B \le 1,000,000$, $1 \le K \le 6$)


## 복잡도 분석

- **Time Complexity**: (제출 코드 기준) 대략 $\sum_{N=A}^{B} O(L_N \log L_N)$  
  - $L_N$ = 수열이 사이클을 만나기까지 방문한 서로 다른 값의 개수  
  - 각 단계마다 `set` 삽입/탐색이 $O(\log L_N)$
- **Space Complexity**: (제출 코드 기준)  
  - `best`, `nxt`: $O(LIM)$  
  - 각 `solve`의 `set`: $O(L_N)$


## 접근법

각 수는 다음 수로 유일하게 이동한다:  
$$x \to S_K(x)$$
따라서 어떤 시작점에서도 수열은 유한한 값들만 방문하다가 반드시 이전에 방문한 값으로 돌아가며(사이클) 종료 조건을 얻는다.

제출 코드는 각 시작점 $N$에 대해:
1. `set`으로 방문한 수를 기록하며 수열을 전개
2. 이미 방문한 값이 다시 등장하면(사이클) 종료
3. 방문했던 값 집합의 최소를 답으로 사용

또한:
- `nxt[x]`에 $S_K(x)$ 값을 캐시하여 같은 값에 대한 다음 계산을 줄임
- `best[x]`는 특정 시작점에 대한 답을 부분적으로 캐시(단, 현재 코드는 `best[N]`만 채움)


## 풀이

```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;


int A,B,K;

vector<int> best; // 한번 도달했던 숫자는 최소 결과를 저장한다.
vector<int> nxt; // 이전에 계산한 다음숫체
vector<int> min_n_res; // 여기에 저장했다가 합

int func_S_K(int N){
    int c=0;
    int x = N;
    while (x>0){
        int tmp = 1;
        for(int i=0;i<K;i++){
            tmp *= (x%10);
        }
        c += tmp;
        x /= 10;
    }
    return c;
}
// 99 같은 숫자여도 한번 커졌다가 무조건 작아지는듯?

void solve(int N){
    // N을 이용하여 수열 만들고 가장 작은숫자를 저장
    // 수열이 사이클이 나오게 되나..?
    set<int> s;
    s.insert(N);
    int t = N;

    while (1)
    {   
        // 이전에 best 저장했음
        if (best[t]!=0){
            s.insert(best[t]);
            break;
        }

        int nt;
        if (nxt[t]!=0){
            nt = nxt[t];
        } else {
            nt = func_S_K(t);
            nxt[t] = nt;
        }
        t = nt;
        
        // 사이클 발견
        if(s.find(t)!=s.end()){
            break;
        }
        s.insert(t);
    }

    int min_res = *s.begin();
    best[N] = min_res;

    min_n_res.push_back(min_res);
}

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    cin>>A>>B>>K;

    int pow9 = 1;
    for(int i=0;i<K;i++) pow9 *= 9;
    ll LIM = max(B,7*pow9);

    best.assign(LIM+1,0);
    nxt.assign(LIM+1,0);
    for(int i=A;i<B+1;i++){
        solve(i);
    }
    cout << accumulate(min_n_res.begin(),min_n_res.end(),0LL);

    return 0;
}
```

## Code Review

아래는 “정답을 유지하면서” 더 안전/빠르게 만들 수 있는 개선점들이다.

### 1) `func_S_K` 상수 최적화: digitPow[10] 미리 계산
현재는 자리마다 $K$번 곱셈을 수행한다.
$K \le 6$, 자리수도 최대 7이라 큰 부담은 아니지만 호출 횟수가 많아지면 상수가 꽤 커진다.

**개선:** 0~9의 $K$제곱을 미리 계산해두면 `func_S_K`가 “자릿수만큼 덧셈”이 된다.
- 전처리: `digitPow[d] = d^K`
- 계산: `sum += digitPow[x % 10]`

### 2) `set` → `unordered_set`(또는 배열 방문 체크)로 membership 비용 줄이기
제출 코드는 사이클 판별과 최소값 관리를 위해 `set`을 사용한다. 하지만 `set`은 균형 트리 기반이라 각 연산이 $O(\log L)$.

- `unordered_set`으로 바꾸면 평균 $O(1)$로 membership 체크가 빨라질 수 있다.
- 단, `unordered_set`은 정렬이 없으므로 `*begin()`이 최솟값이 아니다. 따로 `mn = min(mn, t)`로 최솟값을 추적해야 한다.

### 3) 합계 누적 방식
현재는 `min_n_res` 벡터에 전부 넣고 마지막에 `accumulate`를 수행한다.
- 바로 `ans += min_res;`로 누적하면 메모리(최대 10^6 ints ≈ 4MB)와 `push_back` 비용을 아낄 수 있다.

### 4) `best` 캐시의 활용도 극대화
현재 코드는 `best[N]`만 채운다. 하지만 같은 수열 “꼬리”를 공유하는 시작점이 많을 수 있어, 중간 값들에 대한 `best`가 비어있으면 그 구간을 다시 따라가게 된다.

**정석 최적화:**
- 한 번 $N$에서 만든 경로(`path`)에 등장한 모든 노드에 대해 뒤에서부터 `best[노드]`를 전파하여 채우면, 다음 시작점이 중간에 이미 계산된 노드를 만났을 때 즉시 종료할 수 있다. (Functional Graph의 전형적인 처리 방식)

### 5) LIM 설정
$N \le 1,000,000$은 최대 7자리이므로 $S_K(N) \le 7 \cdot 9^K$이다.
따라서 수열 전개 중 등장 가능한 값들은 $0 \dots \max(B, 7 \cdot 9^K)$ 범위 내에 존재하며, 배열 크기도 이에 맞춰 설정하는 것이 안전하다.

---

## 유사 문제 추천

- **Happy Number** 계열 (LeetCode 202)
- **반복수열** (BOJ 2331)
- **싸이클** (BOJ 2526)
- **텀 프로젝트** (BOJ 9466) - Functional Graph의 사이클 판별
- **트리 / 오프라인 쿼리류** (BOJ 13306) - 캐시/전파 사고 연습용
