---
title: "06. 알고리즘, 함수의 증가, 알고리즘의 복잡도"
slug: discrete-mathematics-algorithms-and-complexity
publishedAt: '2026-10-19'
categories: discrete_mathematics
math: true

---

## 1. 알고리즘 (Algorithms)

### 1.1 정의와 일곱 가지 성질
알고리즘은 문제를 풀거나 계산을 수행하기 위해 정의된 **정확하고 유한한 명령들의 순서열**이다. 먼저 입력과 원하는 출력을 명시한 뒤, 구체적 단계를 의사코드(pseudocode) 또는 자연어로 표현한다.

1. 입력(Input): 지정된 집합에서 입력을 받는다.

2. 출력(Output): 각 입력에 대해 결과를 생성한다.

3. 명확성(Definiteness): 각 단계의 의미가 모호하지 않다.

4. 정확성(Correctness): 올바른 입력에 대해 요구하는 정답을 낸다.

5. 유한성(Finiteness): 유한한 횟수의 단계를 거쳐 종료한다.

6. 효과성(Effectiveness): 각 기본 연산은 유한한 시간 안에 정확하게 수행할 수 있다.

7. 일반성(Generality): 특정 사례뿐 아니라 지정된 문제 유형의 모든 유효한 입력에 적용된다.

**최댓값 찾기:** 처음 항을 임시 최댓값으로 지정하고 나머지 항을 순회하면서 현재 값보다 클 때만 갱신한다. 길이 $n$인 수열의 원소 비교는 $n-1$회로 충분하다. 예: $8,4,11,3,10$에 대해 임시 최댓값은 $8\to8\to11\to11\to11$.

### 1.2 탐색: 순차 검색과 이진 검색

- **순차 검색(Linear search):** 정렬되지 않은 리스트에도 적용되며 처음부터 순서대로 비교한다. 대상이 없으면 0을 반환한다. 최악의 경우 탐색량은 선형이다.

- **이진 검색(Binary search):** 반드시 오름차순으로 정렬된 리스트에서 사용한다. 왼쪽과 오른쪽 끝을 $i,j$라 하면 다음 중간 위치를 선택한다.

$$
m=\left\lfloor\frac{i+j}{2}\right\rfloor
$$

$x>a_m$이면 $i=m+1$, 그렇지 않으면 $j=m$으로 갱신한다. $i=j$가 되면 해당 원소와 $x$를 비교한다. 탐색 범위를 매번 약 절반으로 줄이므로 필요한 단계는 로그 크기이다.

**추적 예제:** 16개 원소에서 19를 찾으면 $(i,j,m)$은 $(1,16,8)\to(9,16,12)\to(13,16,14)\to(13,14,13)$으로 바뀌며 최종 위치는 14이다.

### 1.3 정렬: 버블 정렬과 삽입 정렬

**버블 정렬(Bubble sort)**은 인접 원소를 비교하고 역순이면 교환한다. 매 회전이 끝나면 아직 확정하지 않은 부분의 최댓값이 오른쪽으로 이동한다. 여기서 다루는 버블 정렬은 조기 종료를 하지 않는다.
**삽입 정렬(Insertion sort)**은 이미 정렬된 왼쪽 부분에 새 원소가 들어갈 자리를 찾아 오른쪽으로 항을 밀어 넣는다. 여기서는 삽입 위치를 앞쪽부터 순차 탐색한다.

**정렬 과정 추적**
입력 $[5,2,4,6,1]$.

- 버블 정렬: 시작 $[5,2,4,6,1]$ → 1회전 $[2,4,5,1,6]$ → 2회전 $[2,4,1,5,6]$ → 3회전 $[2,1,4,5,6]$ → 4회전 $[1,2,4,5,6]$.

- 삽입 정렬: 시작 $[5,2,4,6,1]$ → $j=2$에 $[2,5,4,6,1]$ → $j=3$에 $[2,4,5,6,1]$ → $j=4$에서 그대로 → $j=5$에 $[1,2,4,5,6]$.

### 1.4 문자열 매칭(String matching)
텍스트 $T=t_1t_2\cdots t_n$에서 패턴 $P=p_1p_2\cdots p_m$이 등장하는 위치를 찾는다. 이동(shift) $s$가 유효하려면 모든 $1\le j\le m$에 대해 $t_{s+j}=p_j$여야 한다. 단순 문자열 매칭은 $s=0,1,\ldots,n-m$을 검사하므로 가능한 시작 위치의 수는 $n-m+1$이다.

### 1.5 탐욕 알고리즘과 최적성
탐욕 알고리즘은 매 단계에서 국소적으로 가장 좋아 보이는 선택을 한다. **탐욕이라는 설계 방식 자체가 전역 최적해를 보장하지는 않는다.**

- **거스름돈:** 동전 $25,10,5,1$센트 체계에서는 남은 금액을 넘지 않는 가장 큰 동전을 반복해 선택하는 방법이 동전 개수를 최소화한다. 최적해에서 $10$센트는 최대 2개, $5$센트는 최대 1개, $1$센트는 최대 4개이며 $10$센트 2개와 $5$센트 1개를 함께 쓰지 않는다는 보조정리를 이용해 증명한다.

- **반례:** $25,10,1$센트만 있다면 $30$센트에서 탐욕은 $25+1+1+1+1+1$로 6개를 고르지만, $10+10+10$으로 3개면 된다.

- **강연 스케줄링:** 서로 겹치지 않는 강연 수를 최대화할 때는 **가장 일찍 끝나는 강연을 우선** 선택하고, 이후 종료 시각 순서로 겹치지 않는 강연을 고른다. 가장 먼저 시작하거나 가장 짧은 강연을 선택하는 기준에는 반례가 있다.

### 1.6 정지 문제(Halting problem)
임의의 프로그램 $P$와 입력 $I$에 대해 실행이 언젠가 끝나는지를 모든 경우에 정확히 판정하는 알고리즘은 존재하지 않는다. 있다고 가정한 판정기 $H(P,I)$를 이용해 $H(P,P)$의 결과와 반대로 행동하는 프로그램 $K(P)$를 구성하면, $K(K)$가 멈추는 경우와 멈추지 않는 경우 모두 모순이 된다. **귀류법과 자기 참조를 활용한 결정 불가능성 증명**이다.

---

## 2. 함수의 증가 (The Growth of Functions)

### 2.1 점근적 증가율과 빅-오
입력 크기 $n$에 따른 연산 횟수에서 충분히 큰 $n$의 증가율을 비교한다. 작은 차수의 항과 상수배를 무시하되, 점근적 우위를 해석하는 것이다.

**정의(Big-O):** 양의 상수 $C$와 상수 $k$가 존재하여 모든 $x>k$에 대해 아래 부등식이 성립하면 $f(x)$는 $O(g(x))$이다.

$$
|f(x)|\le C|g(x)|\qquad(x>k)
$$

$(C,k)$는 **증인(witness)**이다. 관행적으로 $f(x)=O(g(x))$라 쓰지만, 함수들의 집합으로 해석할 때는 $f\in O(g)$가 엄밀하다. 증인은 유일하지 않다.

**증명 예제:**

$$
x^2+2x+1\le 4x^2\quad(x>1)
$$

따라서 $C=4,k=1$이 증인이다. 반면 $n^2\notin O(n)$이다. $n^2\le Cn$이면 $n\le C$여야 하는데 $n$은 얼마든지 커질 수 있기 때문이다.

### 2.2 다항식, 합, 계승, 로그의 추정
다항식 $f(x)=a_nx^n+\cdots+a_0$에서 최고차항의 차수가 $n$이면 $f(x)\in O(x^n)$. $x>1$에서 다음 증인을 선택할 수 있다.

$$
C=\sum_{i=0}^{n}|a_i|,\qquad k=1
$$

대표적인 상한:

$$
\sum_{i=1}^{n}i\in O(n^2),\qquad
n!\in O(n^n),\qquad
\log(n!)\in O(n\log n),\qquad
\log n\in O(n)
$$

### 2.3 함수 증가의 위계
충분히 큰 $n$에 대한 대표적인 증가 순서는 다음과 같다.

$$
1\prec\log n\prec n\prec n\log n\prec n^2\prec 2^n\prec n!
$$

더 일반적으로 로그의 양의 거듭제곱은 모든 양의 다항 차수보다 느리고, 고정 밑 $b>1$인 지수함수는 모든 고정 다항식보다 빠르다. 계승은 모든 고정 밑 지수함수보다 빠르다. 비교할 때 $8\sqrt n$, $2n\log n$ 등의 상수 계수는 지배적인 차수를 바꾸지 않는다.

### 2.4 함수 결합의 빅-오
$f_1\in O(g_1)$, $f_2\in O(g_2)$라면

$$
f_1+f_2\in O\bigl(\max(|g_1|,|g_2|)\bigr),\qquad
f_1f_2\in O(g_1g_2)
$$

합은 삼각부등식과 증인 $C_1+C_2$, $k=\max(k_1,k_2)$로, 곱은 증인 $C_1C_2$, $k=\max(k_1,k_2)$로 증명한다. 특히 동일한 상한 $g$를 갖는 두 함수의 합은 여전히 $O(g)$이다.

### 2.5 빅-오메가와 빅-세타

- **빅-오메가** ($\Omega$): 충분히 큰 $x$에서 $|f(x)|\ge C|g(x)|$인 하한을 나타낸다.

- **빅-세타** ($\Theta$): 상한과 하한이 동시에 같은 차수로 성립한다.

$$
f\in\Theta(g)\iff f\in O(g)\text{ and }f\in\Omega(g)
$$

다항식의 최고차항 계수가 0이 아니라면 $a_nx^n+\cdots+a_0\in\Theta(x^n)$. 예를 들어 $3x^2+8x\log x\in\Theta(x^2)$이고 $1+2+\cdots+n\in\Theta(n^2)$이다. **빅-오만으로 같은 차수라고 단정해서는 안 된다.**

---

## 3. 알고리즘의 복잡도 (Complexity of Algorithms)

### 3.1 시간, 공간, 최악 및 평균 경우

- **시간 복잡도:** 입력 크기에 따른 연산 횟수.

- **공간 복잡도:** 필요한 메모리의 양.

- **최악의 경우:** 크기 $n$인 유효한 모든 입력 중 연산이 가장 많은 경우.

- **평균의 경우:** 입력에 확률분포를 부여하고 계산한 연산 횟수의 기댓값. 분포를 명시해야 한다.

아래 비교 횟수는 반복 조건의 평가까지 세는 별도의 관례를 따른다. 같은 알고리즘도 세부 연산의 계수법에 따라 정확한 횟수는 달라지지만 점근 차수는 같다.

| 알고리즘 | 조건 평가를 포함한 연산 횟수 | 점근 복잡도 |
| --- | --- | --- |
| 최댓값 찾기 | $2n-1$ (비교 계수 방식) | $\Theta(n)$ |
| 순차 검색, 최악 | $2n+2$ | $\Theta(n)$ |
| 순차 검색, 균등한 위치에 있을 때 평균 | $n+2$ | $\Theta(n)$ |
| 이진 검색, 최악 | 약 $2\lceil\log_2n\rceil+2$ | $\Theta(\log n)$ |
| 버블 정렬 | $\frac{n(n-1)}2$ (원소 간 비교) | $\Theta(n^2)$ |
| 삽입 정렬, 최악 | $\frac{n(n+1)}2-1$ | $\Theta(n^2)$ |

### 3.2 행렬 곱셈과 행렬 연쇄 곱셈
$m\times k$ 행렬과 $k\times n$ 행렬의 정의에 따른 곱셈에는 스칼라 곱셈 $mkn$회가 필요하다. 정사각 $n\times n$ 행렬의 기본 삼중 반복 알고리즘은 $\Theta(n^3)$이며, 같은 방식의 불 행렬 곱셈도 $\Theta(n^3)$이다. Strassen 알고리즘을 사용하면 $O(n^{\log_2 7})$로 곱셈할 수 있다.
행렬곱은 결합법칙을 만족하지만 괄호를 어떻게 배치하는지에 따라 계산량이 달라진다. $A_1(30\times20)$, $A_2(20\times40)$, $A_3(40\times10)$에 대해:

- $A_1(A_2A_3)$: $20\cdot40\cdot10+30\cdot20\cdot10=14{,}000$회.

- $(A_1A_2)A_3$: $30\cdot20\cdot40+30\cdot40\cdot10=36{,}000$회.

### 3.3 브루트포스와 알고리즘 패러다임
알고리즘 패러다임에는 탐욕, 브루트포스, 분할 정복, 동적 계획법, 백트래킹, 확률적 알고리즘 등이 있다. **브루트포스**는 가능한 해를 직관적으로 검사하는 방식이다.
최근접 점 쌍 문제에서 두 점 사이의 유클리드 거리 대신 거리의 제곱을 비교해도 최솟값 위치는 같다. $n$개의 점 중 확인할 점 쌍은

$$
\binom n2=\frac{n(n-1)}2\in\Theta(n^2)
$$

모든 점 쌍을 확인하는 완전 탐색은 구현이 단순하지만 비교할 쌍이 빠르게 늘어난다. 분할 정복은 문제를 나누어 이 계산량을 줄이는 접근이다.

### 3.4 복잡도 종류와 P, NP
성장 유형: 상수 $\Theta(1)$, 로그 $\Theta(\log n)$, 선형 $\Theta(n)$, 선형로그 $\Theta(n\log n)$, 다항 $\Theta(n^b)$, 지수 $\Theta(b^n)$, 계승 $\Theta(n!)$.

- **P:** 결정 문제 중 결정적 다항 시간 알고리즘으로 해결할 수 있는 문제의 집합.

- **NP:** '예'에 대한 증명서가 주어졌을 때 다항 시간에 검증할 수 있는 결정 문제의 집합. 동치로 비결정적 다항 시간에 해결할 수 있는 문제의 집합.

- **NP-완전:** NP에 속하면서 모든 NP 문제가 다항 시간에 환원되는 문제. 대표 예: SAT.

- **P 대 NP:** 모든 NP 문제가 P에도 속하는지는 아직 해결되지 않았다.

행렬곱 계산처럼 다항 시간 알고리즘이 존재하는 문제는 다루기 쉬운 문제로 분류한다. 정지 문제처럼 어떤 일반 알고리즘으로도 결정할 수 없는 문제는 계산 불가능한 문제다.

### 3.5 헷갈리기 쉬운 점

1. **P와 NP-완전:** NP-완전 문제가 P에 속하지 않는다는 것은 아직 증명되지 않았다. NP-완전의 정의에는 NP에 속한다는 조건과 NP-난해하다는 조건이 모두 필요하다.

2. **비교 횟수:** 반복 조건, 비교 연산, 최악의 경우 계산은 특정 의사코드와 계수 방식에 의존한다. 실제 구현의 비교 횟수와 구별해야 한다.

3. **다항 시간과 실용성:** 다항 시간이라는 사실만으로 작은 입력에서도 빠름을 보장하지 않는다. 반대로 지수 시간 알고리즘이 항상 실무에서 불가능하다는 뜻도 아니다.

---

## 정의, 예제와 연습문제

### 3.1 알고리즘

<details>
<summary>알고리즘이란?</summary>

![알고리즘이란?](./figure-01.webp)

</details>

<details>
<summary>최댓값 찾기 알고리즘</summary>

![최댓값 찾기 알고리즘](./figure-02.webp)

</details>

<details>
<summary>연습문제 Practice 3.1-①</summary>

![연습문제 Practice 3.1-①](./figure-03.webp)

</details>

<details>
<summary>탐색 문제와 순차 검색</summary>

![탐색 문제와 순차 검색](./figure-04.webp)

</details>

<details>
<summary>이진 탐색</summary>

![이진 탐색](./figure-05.webp)

</details>

<details>
<summary>이진 검색 예제: 19 찾기</summary>

![이진 검색 예제: 19 찾기](./figure-06.webp)

</details>

<details>
<summary>연습문제 Practice 3.1-②</summary>

![연습문제 Practice 3.1-②](./figure-07.webp)

</details>

<details>
<summary>정렬과 버블 정렬</summary>

![정렬과 버블 정렬](./figure-08.webp)

</details>

<details>
<summary>삽입 정렬</summary>

![삽입 정렬](./figure-09.webp)

</details>

<details>
<summary>연습문제 Practice 3.1-③</summary>

![연습문제 Practice 3.1-③](./figure-10.webp)

</details>

<details>
<summary>문자열 매칭</summary>

![문자열 매칭](./figure-11.webp)

</details>

<details>
<summary>연습문제 Practice 3.1-④</summary>

![연습문제 Practice 3.1-④](./figure-12.webp)

</details>

<details>
<summary>탐욕 알고리즘과 거스름돈 문제</summary>

![탐욕 알고리즘과 거스름돈 문제](./figure-13.webp)

</details>

<details>
<summary>미국 동전에 대한 최적성</summary>

![미국 동전에 대한 최적성](./figure-14.webp)

</details>

<details>
<summary>연습문제 Practice 3.1-⑤</summary>

![연습문제 Practice 3.1-⑤](./figure-15.webp)

</details>

<details>
<summary>탐욕 알고리즘: 강연 스케줄링</summary>

![탐욕 알고리즘: 강연 스케줄링](./figure-16.webp)

</details>

<details>
<summary>정지 문제</summary>

![정지 문제](./figure-17.webp)

</details>

<details>
<summary>3.1 한눈에 보기</summary>

![3.1 한눈에 보기](./figure-18.webp)

</details>

<details>
<summary>3.1 단원 연습문제</summary>

![3.1 단원 연습문제](./figure-19.webp)

</details>

### 3.2 함수의 증가

<details>
<summary>왜 함수의 증가를 공부할까?</summary>

![왜 함수의 증가를 공부할까?](./figure-20.webp)

</details>

<details>
<summary>빅-오 표기법</summary>

![빅-오 표기법](./figure-21.webp)

</details>

<details>
<summary>빅-오 표기법의 유의점</summary>

![빅-오 표기법의 유의점](./figure-22.webp)

</details>

<details>
<summary>정의를 이용한 증명: 예제 1 f(x)=x² + 2x + 1 이 O(x²) 임을 보여라.</summary>

![정의를 이용한 증명: 예제 1 f(x)=x² + 2x + 1 이 O(x²) 임을 보여라.](./figure-23.webp)

</details>

<details>
<summary>연습문제 Practice 3.2-①</summary>

![연습문제 Practice 3.2-①](./figure-24.webp)

</details>

<details>
<summary>빅-오 관계의 성립 / 불성립 보이기</summary>

![빅-오 관계의 성립 / 불성립 보이기](./figure-25.webp)

</details>

<details>
<summary>연습문제 Practice 3.2-②</summary>

![연습문제 Practice 3.2-②](./figure-26.webp)

</details>

<details>
<summary>다항식의 빅-오 추정</summary>

![다항식의 빅-오 추정](./figure-27.webp)

</details>

<details>
<summary>중요한 함수들의 빅-오 추정</summary>

![중요한 함수들의 빅-오 추정](./figure-28.webp)

</details>

<details>
<summary>연습문제 Practice 3.2-③</summary>

![연습문제 Practice 3.2-③](./figure-29.webp)

</details>

<details>
<summary>함수 증가의 위계</summary>

![함수 증가의 위계](./figure-30.webp)

</details>

<details>
<summary>함수를 증가 순서로 나열하기</summary>

![함수를 증가 순서로 나열하기](./figure-31.webp)

</details>

<details>
<summary>함수 결합의 빅-오</summary>

![함수 결합의 빅-오](./figure-32.webp)

</details>

<details>
<summary>함수 결합의 빅-오 추정 예제</summary>

![함수 결합의 빅-오 추정 예제](./figure-33.webp)

</details>

<details>
<summary>연습문제 Practice 3.2-④</summary>

![연습문제 Practice 3.2-④](./figure-34.webp)

</details>

<details>
<summary>빅-오메가와 빅-세타</summary>

![빅-오메가와 빅-세타](./figure-35.webp)

</details>

<details>
<summary>빅-오메가 / 빅-세타 예제</summary>

![빅-오메가 / 빅-세타 예제](./figure-36.webp)

</details>

<details>
<summary>다항식의 빅-세타 추정</summary>

![다항식의 빅-세타 추정](./figure-37.webp)

</details>

<details>
<summary>연습문제 Practice 3.2-⑤</summary>

![연습문제 Practice 3.2-⑤](./figure-38.webp)

</details>

<details>
<summary>3.2 한눈에 보기</summary>

![3.2 한눈에 보기](./figure-39.webp)

</details>

<details>
<summary>3.2 단원 연습문제</summary>

![3.2 단원 연습문제](./figure-40.webp)

</details>

### 3.3 알고리즘의 복잡도

<details>
<summary>알고리즘의 복잡도</summary>

![알고리즘의 복잡도](./figure-41.webp)

</details>

<details>
<summary>탐색 알고리즘의 복잡도</summary>

![탐색 알고리즘의 복잡도](./figure-42.webp)

</details>

<details>
<summary>순차 검색의 평균 경우 복잡도</summary>

![순차 검색의 평균 경우 복잡도](./figure-43.webp)

</details>

<details>
<summary>연습문제 Practice 3.3-①</summary>

![연습문제 Practice 3.3-①](./figure-44.webp)

</details>

<details>
<summary>정렬 알고리즘의 최악 복잡도</summary>

![정렬 알고리즘의 최악 복잡도](./figure-45.webp)

</details>

<details>
<summary>연습문제 Practice 3.3-②</summary>

![연습문제 Practice 3.3-②](./figure-46.webp)

</details>

<details>
<summary>행렬 곱셈과 불 곱의 복잡도</summary>

![행렬 곱셈과 불 곱의 복잡도](./figure-47.webp)

</details>

<details>
<summary>행렬 연쇄 곱셈 (행렬 체인 곱)</summary>

![행렬 연쇄 곱셈 (행렬 체인 곱)](./figure-48.webp)

</details>

<details>
<summary>연습문제 Practice 3.3-③</summary>

![연습문제 Practice 3.3-③](./figure-49.webp)

</details>

<details>
<summary>알고리즘 패러다임과 억지 알고리즘(브루트포스)</summary>

![알고리즘 패러다임과 억지 알고리즘(브루트포스)](./figure-50.webp)

</details>

<details>
<summary>가장 가까운 점의 쌍을 찾는 억지 알고리즘</summary>

![가장 가까운 점의 쌍을 찾는 억지 알고리즘](./figure-51.webp)

</details>

<details>
<summary>연습문제 Practice 3.3-④</summary>

![연습문제 Practice 3.3-④](./figure-52.webp)

</details>

<details>
<summary>복잡도 용어</summary>

![복잡도 용어](./figure-53.webp)

</details>

<details>
<summary>풀기 쉬운 문제와 풀 수 없는 문제</summary>

![풀기 쉬운 문제와 풀 수 없는 문제](./figure-54.webp)

</details>

<details>
<summary>P 대 NP 문제</summary>

![P 대 NP 문제](./figure-55.webp)

</details>

<details>
<summary>알고리즘이 사용하는 컴퓨터 시간</summary>

![알고리즘이 사용하는 컴퓨터 시간](./figure-56.webp)

</details>

<details>
<summary>3.3 한눈에 보기</summary>

![3.3 한눈에 보기](./figure-57.webp)

</details>

<details>
<summary>3.3 단원 연습문제</summary>

![3.3 단원 연습문제](./figure-58.webp)

</details>
