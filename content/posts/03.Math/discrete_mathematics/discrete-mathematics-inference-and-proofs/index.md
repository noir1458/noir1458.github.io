---
title: "03. 추론 규칙과 증명 방법"
slug: discrete-mathematics-inference-and-proofs
publishedAt: '2026-10-19'
categories: discrete_mathematics
math: true
description: "추론 규칙과 증명 방법의 개념, 수식과 예제를 정리한다."
---

## 핵심 개념과 수식

## 1.6 추론 규칙
논증(argument)은 전제(premise)들로부터 결론(conclusion)을 도출하는 논리적 과정이다. 모든 전제가 참인 경우 결론도 항상 참이라면 **타당한 논증**이다. 다음 함의가 항진명제인지로 검증할 수 있다.

$$
(p_1\land\cdots\land p_n)\to q
$$

자주 사용하는 명제 논리 추론 규칙은 다음과 같다.

| 규칙 | 전제 | 결론 |
| --- | --- | --- |
| 긍정 논법(MP) | p → q, p | q |
| 부정 논법(MT) | p → q, ¬q | ¬p |
| 가설적 삼단논법 | p → q, q → r | p → r |
| 선언적 삼단논법 | p ∨ q, ¬p | q |
| 가산논법 | p | p ∨ q |
| 단순화 | p ∧ q | p |
| 논리곱 논법 | p, q | p ∧ q |
| 용해법 | p ∨ q, ¬p ∨ r | q ∨ r |

전체 한정/존재 한정이 포함된 논증에서는 전칭 예시화(UI), 전칭 일반화(UG), 존재 예시화(EI), 존재 일반화(EG)를 사용한다. 임의의 원소를 선택하는 단계와 '어떤 원소가 존재한다'는 사실로부터 예시를 선택하는 단계를 혼동하지 말아야 한다.

## 1.7 증명의 기초
**증명(proof)** 은 수학적 명제가 참이라는 것을 확립하는 타당한 논증이다. 정리(theorem), 보조정리(lemma), 따름정리(corollary), 추측(conjecture)의 차이와 전제 조건을 먼저 확인한다.
직접증명은 p를 가정하고 q를 유도한다. 대우증명은 동치인 ¬q → ¬p를 증명한다. 귀류법은 부정을 가정해 모순에 도달한다.

$$
\text{짝수 }n=2k\;(k\in\mathbb Z)\implies n^2=4k^2=2(2k^2)
$$

위 등식은 '짝수의 제곱은 짝수'를 보이는 직접증명의 예다. 반면 'n²가 짝수이면 n도 짝수'는 대우를 이용하면 편리하다. √2의 무리수성을 보이는 귀류법, 쌍조건문의 양방향 증명, 0으로 나누는 오류를 포함한 잘못된 증명도 다룬다.

## 1.8 증명 방법과 전략
복잡한 명제는 경우를 빠짐없이 나누어 증명하거나, 정당할 때에만 **일반성을 잃지 않고(WLOG)** 한 경우를 택한다. 존재증명은 실제 사례를 구성하는 구성적 증명과 직접 대상을 제시하지 않는 비구성적 증명으로 나뉜다. **유일성**은 존재성과 단 하나임을 모두 입증해야 한다.
전향추론과 후향추론은 각각 전제로부터 나아가거나 목표 결론으로부터 필요한 조건을 되짚는 접근법이다. 전체 한정 명제의 반증에는 반례 하나면 충분하다. 특히 타일링 예제는 보드의 색칠과 불변량을 이용해 불가능성을 설명한다.
---

## 1.6 추론 규칙

<details>
<summary>추론 규칙</summary>

1.6

추론 규칙

RULES OF INFERENCE

- 타당한 논증(valid argument)과 명제 논리의 추론 규칙

- 추론 규칙을 이용해 논증 구성하기

- 한정 명제에 대한 추론 규칙

- 한정 명제에 대한 논증 구성하기

</details>

<details>
<summary>소크라테스 예제</summary>

![소크라테스 예제](./figure-01.webp)

</details>

<details>
<summary>타당한 논증</summary>

![타당한 논증](./figure-02.webp)

</details>

### 연습문제 Practice 1.6 - ①

![연습문제 Practice 1.6 - ①](./figure-53.webp)

<details>
<summary>긍정 논법</summary>

![긍정 논법](./figure-03.webp)

</details>

<details>
<summary>긍정 논법의 잘못된 전개</summary>

![긍정 논법의 잘못된 전개](./figure-04.webp)

</details>

<details>
<summary>부정 논법</summary>

![부정 논법](./figure-05.webp)

</details>

### 연습문제 Practice 1.6 - ②

![연습문제 Practice 1.6 - ②](./figure-54.webp)

<details>
<summary>가설적 삼단논법</summary>

![가설적 삼단논법](./figure-06.webp)

</details>

<details>
<summary>선언적 삼단논법</summary>

![선언적 삼단논법](./figure-07.webp)

</details>

<details>
<summary>가산 논법</summary>

![가산 논법](./figure-08.webp)

</details>

<details>
<summary>단순화 논법</summary>

![단순화 논법](./figure-09.webp)

</details>

<details>
<summary>논리곱 논법</summary>

![논리곱 논법](./figure-10.webp)

</details>

<details>
<summary>용해법</summary>

![용해법](./figure-11.webp)

</details>

<details>
<summary>명제 논리의 주요 추론 규칙</summary>

![명제 논리의 주요 추론 규칙](./figure-12.webp)

</details>

### 연습문제 Practice 1.6 - ③ 다음 각 논증은 어떠한 추론규칙에 근거하고 있는가?

![연습문제 Practice 1.6 - ③ 다음 각 논증은 어떠한 추론규칙에 근거하고 있는가?](./figure-55.webp)

### 연습문제 Practice 1.6 - ③ 다음 각 논증은 어떠한 추론규칙에 근거하고 있는가?

![연습문제 Practice 1.6 - ③ 다음 각 논증은 어떠한 추론규칙에 근거하고 있는가?](./figure-56.webp)

<details>
<summary>타당한 논증 예제 (1)</summary>

![타당한 논증 예제 (1)](./figure-13.webp)

</details>

<details>
<summary>타당한 논증 예제 (2): 전제</summary>

![타당한 논증 예제 (2): 전제](./figure-14.webp)

</details>

<details>
<summary>타당한 논증 예제 (2): 풀이</summary>

![타당한 논증 예제 (2): 풀이](./figure-15.webp)

</details>

### 연습문제 Practice 1.6 - ④

![연습문제 Practice 1.6 - ④](./figure-57.webp)

### 연습문제 Practice 1.6 - ④

![연습문제 Practice 1.6 - ④](./figure-58.webp)

<details>
<summary>한정 명제의 추론 규칙</summary>

![한정 명제의 추론 규칙](./figure-16.webp)

</details>

<details>
<summary>전칭 예시화</summary>

![전칭 예시화](./figure-17.webp)

</details>

<details>
<summary>전칭 일반화</summary>

![전칭 일반화](./figure-18.webp)

</details>

<details>
<summary>존재 예시화</summary>

![존재 예시화](./figure-19.webp)

</details>

<details>
<summary>존재 일반화</summary>

![존재 일반화](./figure-20.webp)

</details>

<details>
<summary>추론 규칙 활용 예제 (1)</summary>

![추론 규칙 활용 예제 (1)](./figure-21.webp)

</details>

<details>
<summary>추론 규칙 활용 예제 (2)</summary>

![추론 규칙 활용 예제 (2)](./figure-22.webp)

</details>

<details>
<summary>전칭 긍정 논법</summary>

![전칭 긍정 논법](./figure-23.webp)

</details>

### 연습문제 Practice 1.6 - ⑤

![연습문제 Practice 1.6 - ⑤](./figure-59.webp)

<details>
<summary>전칭 부정 논법</summary>

![전칭 부정 논법](./figure-24.webp)

</details>

### 1.6 단원 연습문제

![1.6 단원 연습문제](./figure-60.webp)

## 1.7 증명의 기초

<details>
<summary>증명이란?</summary>

1.7

증명의 소개

INTRODUCTION TO PROOFS

- 수학적 증명이란 무엇인가

- 정리의 형태 (전체 한정 기호의 생략 관례)

- 직접증명 (Direct Proof)

- 간접증명 — 대우증명과 귀류법

</details>

<details>
<summary>수학적 명제의 증명</summary>

- 증명(proof)이란 어떤 명제가 참임을 확립하는 타당한 논증이다.

- 수학,컴퓨터과학 등에서는 대개 더 짧은 비형식적 증명(informal proof)을 사용한다:

- 한 단계에서 둘 이상의 추론 규칙이 함께 쓰이기도 한다.

- 일부 단계는 생략될 수 있다.

- 사용된 추론 규칙이 명시적으로 언급되지 않는다.

- 이해하기 쉽고 다른 사람에게 설명하기도 쉽지만, 오류가 들어가기도 더 쉽다.

- 증명은 다양한 실용적 응용을 가진다:

- 컴퓨터 프로그램이 올바름을 검증

- 운영체제가 안전함을 입증

- 인공지능 프로그램이 추론할 수 있게 함

- 시스템 명세가 일관됨(모순이 없음)을 보임

</details>

<details>
<summary>정리, 보조정리, 따름정리, 추측</summary>

![정리, 보조정리, 따름정리, 추측](./figure-25.webp)

</details>

<details>
<summary>정리를 기술하는 형식</summary>

![정리를 기술하는 형식](./figure-26.webp)

</details>

<details>
<summary>정리 증명하기</summary>

![정리 증명하기](./figure-27.webp)

</details>

<details>
<summary>자명한 증명과 공허한 증명</summary>

![자명한 증명과 공허한 증명](./figure-28.webp)

</details>

<details>
<summary>짝수와 홀수</summary>

![짝수와 홀수](./figure-29.webp)

</details>

### 연습문제 Practice 1.7 - ①

![연습문제 Practice 1.7 - ①](./figure-61.webp)

<details>
<summary>직접증명</summary>

![직접증명](./figure-30.webp)

</details>

<details>
<summary>직접증명 예제</summary>

![직접증명 예제](./figure-31.webp)

</details>

### 연습문제 Practice 1.7 - ②

![연습문제 Practice 1.7 - ②](./figure-62.webp)

<details>
<summary>대우증명</summary>

![대우증명](./figure-32.webp)

</details>

<details>
<summary>대우증명 예제</summary>

![대우증명 예제](./figure-33.webp)

</details>

### 연습문제 Practice 1.7 - ③

![연습문제 Practice 1.7 - ③](./figure-63.webp)

<details>
<summary>귀류법</summary>

![귀류법](./figure-34.webp)

</details>

### 귀류법 — √2는 무리수이다 Proof by Contradiction, Example 1 (Preview of Chapter 4)

![귀류법 — √2는 무리수이다 Proof by Contradiction, Example 1 (Preview of Chapter 4)](./figure-64.webp)

<details>
<summary>동치 증명</summary>

![동치 증명](./figure-35.webp)

</details>

### 연습문제 Practice 1.7 - ④

![연습문제 Practice 1.7 - ④](./figure-65.webp)

<details>
<summary>잘못된 증명: 1 = 2</summary>

![잘못된 증명: 1 = 2](./figure-36.webp)

</details>

<details>
<summary>증명 방법의 선택</summary>

![증명 방법의 선택](./figure-37.webp)

</details>

### 1.7 단원 연습문제

![1.7 단원 연습문제](./figure-66.webp)

## 1.8 증명 방법과 전략

<details>
<summary>증명의 방법과 전략</summary>

![증명의 방법과 전략](./figure-38.webp)

</details>

<details>
<summary>경우에 의한 증명</summary>

![경우에 의한 증명](./figure-39.webp)

</details>

<details>
<summary>경우에 의한 증명 예제</summary>

![경우에 의한 증명 예제](./figure-40.webp)

</details>

### 연습문제 Practice 1.8 - ①

![연습문제 Practice 1.8 - ①](./figure-67.webp)

<details>
<summary>경우를 효율적으로 나누기</summary>

![경우를 효율적으로 나누기](./figure-41.webp)

</details>

<details>
<summary>일반성을 잃지 않고</summary>

![일반성을 잃지 않고](./figure-42.webp)

</details>

<details>
<summary>구성적 존재증명</summary>

![구성적 존재증명](./figure-43.webp)

</details>

<details>
<summary>비구성적 존재증명</summary>

![비구성적 존재증명](./figure-44.webp)

</details>

### 연습문제 Practice 1.8 - ②

![연습문제 Practice 1.8 - ②](./figure-68.webp)

<details>
<summary>유일성 증명</summary>

![유일성 증명](./figure-45.webp)

</details>

<details>
<summary>조건문을 증명하는 전략</summary>

① 방법을 고른다:

- 먼저 직접증명 방법을 시도한다.

- 통하지 않으면 간접적인 방법을 시도한다 (예: 대우를 증명해본다).

② 어떤 방법을 쓰든, 전략(strategy)을 선택한다:

- 먼저 전향 추론(forward reasoning)을 시도한다 — 공리와 이미 알려진 정리에서 시작해 결론에 이르

는 중간 단계들을 이용하여 증명을 생성할 수 있다.

- 통하지 않으면 후향 추론(backward reasoning)을 시도한다 — 문장 q를 증명하기 위해 p→q 성질을

증명할 수 있는 p를 먼저 찾아 그것을 증명한다.

</details>

<details>
<summary>전향 추론과 후향 추론</summary>

![전향 추론과 후향 추론](./figure-46.webp)

</details>

<details>
<summary>후향 추론 예제</summary>

![후향 추론 예제](./figure-47.webp)

</details>

<details>
<summary>반례 찾기</summary>

![반례 찾기](./figure-48.webp)

</details>

<details>
<summary>전칭 한정 명제 증명하기</summary>

![전칭 한정 명제 증명하기](./figure-49.webp)

</details>

<details>
<summary>타일링 예제 (1)</summary>

![타일링 예제 (1)](./figure-50.webp)

</details>

<details>
<summary>타일링 예제 (2): 모서리 하나 제거</summary>

![타일링 예제 (2): 모서리 하나 제거](./figure-51.webp)

</details>

<details>
<summary>타일링 예제 (3): 대각 모서리 두 칸 제거</summary>

![타일링 예제 (3): 대각 모서리 두 칸 제거](./figure-52.webp)

</details>

<details>
<summary>미해결 문제의 역할</summary>

- 미해결 문제는 수학 연구의 많은 부분을 이끌어 왔다.

- 페르마의 마지막 정리(Fermat's Last Theorem)는 300년도 더 전에 추측되었고, 최근에야 완전

히 해결되었다.

- 방정식 xⁿ + yⁿ = zⁿ 은 n\>2인 정수 n에 대해, xyz≠0인 정수 해 x,y,z를 갖지 않는다.

- 1990년대에 앤드루 와일스(Andrew Wiles)가 증명을 완성하였다.

- 3x+1 추측 (아직 미해결):

- 변환 T: 짝수 x는 x/2로, 홀수 x는 3x+1로 보낸다. 모든 양의 정수 x에서 시작해 T를 반복 적용하면 결

국 1에 도달한다는 추측이다.
예) x=13: 13→40→20→10→5→16→8→4→2→1

- 컴퓨터로 5.6×10¹³ 까지 검증되었지만, 일반적인 증명은 아직 없다.

</details>

<details>
<summary>그 밖의 증명 방법</summary>

- 이후 여러 다른 증명 방법을 배우게 된다:

- 수학적 귀납법 (Mathematical Induction) — 정의역이 모든 양의 정수인 ∀n P(n) 형태의 명제를 증명하

는 데 유용하다.

- 구조적 귀납법 (Structural Induction) — 재귀적으로 정의된 집합에 대한 결과를 증명하는 데 사용된다

- 칸토어 대각선법 (Cantor Diagonalization) — 무한집합의 크기에 관한 결과를 증명하는 데 사용된다.

- 조합론적 증명 (Combinatorial Proofs) — 개수를 세는 논증을 이용한다.

</details>

### Section 1.8 Review Questions

![Section 1.8 Review Questions](./figure-69.webp)

### Chapter 1 , Part III 종합 복습문제

![Chapter 1 , Part III 종합 복습문제](./figure-70.webp)

## 추가 연습문제

### 문제 7\~10 (추론 및 증명)

**문제 7.** 전제 ∀x(P(x) → Q(x))와 ∀x(Q(x) → R(x))가 참일 때 ∀x(P(x) → R(x))가 참임을 보여라.
**문제 8.** 추론 규칙을 사용하여 다음 전체들이 모두 참이면 ∃x¬R(x)가 참임을 보여라.

$$
\begin{aligned}
&\forall x\bigl(P(x)\lor Q(x)\bigr),\\
&\forall x\bigl(\neg Q(x)\lor S(x)\bigr),\\
&\forall x\bigl(R(x)\to\neg S(x)\bigr),\\
&\exists x\neg P(x).
\end{aligned}
$$

**문제 9.** 직접 증명을 사용하여 두 홀수의 합은 짝수임을 증명하라.
**문제 10.** 귀류법을 사용하여 무리수와 유리수의 합은 무리수임을 증명하라.

## 이어서 읽기

- 이전 글: [02. 술어 논리, 한정 기호, 논리회로](/posts/discrete-mathematics-predicates-quantifiers-circuits/)
- 다음 글: [04. 집합과 집합의 연산, 함수의 기초](/posts/discrete-mathematics-sets-and-functions/)
