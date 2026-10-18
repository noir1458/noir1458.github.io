---
title: "04. 집합과 집합의 연산, 함수의 기초"
slug: discrete-mathematics-sets-and-functions
publishedAt: '2026-10-19'
categories: discrete_mathematics
math: true
description: "집합과 집합의 연산, 함수의 기초의 개념, 수식과 예제를 정리한다."
---

## 핵심 개념과 수식

### 2.1 집합
집합(set)은 순서가 없는 원소들의 모임이다. 원소나열법과 조건제시법으로 기술할 수 있으며, 같은 원소가 중복되더라도 집합은 변하지 않는다. 원소 소속 관계와 부분집합 관계는 서로 다르다.

$$
a\in A,\quad a\notin A,\qquad A\subseteq B\iff\forall x\,(x\in A\to x\in B)
$$

$$
A=B\iff A\subseteq B\land B\subseteq A,\qquad |\mathcal P(A)|=2^{|A|}\quad(A\text{가 유한집합})
$$

전체집합과 공집합, 진부분집합, 집합의 크기(cardinality), 멱집합(power set), 순서쌍과 튜플, 데카르트 곱, 관계와 진리집합을 다룬다. **공집합 ∅과 공집합을 원소로 갖는 집합 \{∅\}을 구별**해야 한다. 러셀의 역설은 아무 조건이나 사용해 집합을 정의하면 모순이 생길 수 있음을 보여준다.

### 2.2 집합의 연산
합집합, 교집합, 여집합, 차집합, 대칭차집합을 정의하고, 그림과 집합 항등식의 관계를 이해한다. 포함배제 공식은 교집합이 중복 계산되는 것을 보정한다.

$$
|A\cup B|=|A|+|B|-|A\cap B|
$$

$$
(A\cup B)^c=A^c\cap B^c,\qquad
(A\cap B)^c=A^c\cup B^c
$$

$$
A\triangle B=(A\cup B)\setminus(A\cap B)
$$

집합 항등식은 서로의 부분집합임을 증명하거나 원소의 소속을 이용하거나, 소속표/기존 법칙으로 증명한다. 일반화된 합집합 및 교집합, **비트 문자열로 집합을 표현하는 방법**, 다중집합(multiset)까지 포함한다.

### 2.3 함수의 기초와 성질
함수 f: A → B는 A의 각 원소에 B의 원소를 정확히 하나씩 대응시키는 규칙이다. **정의역 A**, **공역 B**, **치역 f(A)** 를 구별한다. 상과 원상은 한 원소 또는 원소들의 집합에 대해 기술할 수 있다.

$$
f(A)\subseteq B,\qquad (f\circ g)(x)=f(g(x))
$$

단사(injective)는 서로 다른 입력이 서로 다른 출력으로, 전사(surjective)는 공역의 모든 원소가 상으로, 전단사(bijective)는 둘 다 성립하는 함수다. 정의역과 공역에 대한 역함수가 존재하려면 전단사여야 한다. 함수의 합과 곱, 증가와 감소, 역함수와 합성, 그래프, 바닥과 천장, 계승, 부분함수, 무한집합의 크기(참고)가 이어진다.

$$
\lfloor x\rfloor=\max\{n\in\mathbb Z:n\le x\},\quad
\lceil x\rceil=\min\{n\in\mathbb Z:n\ge x\}
$$

---

## 2.1 집합


<details>
<summary>집합과 원소</summary>

![집합과 원소](./figure-02.webp)

</details>

<details>
<summary>원소나열법</summary>

![원소나열법](./figure-03.webp)

</details>

<details>
<summary>수학의 주요 집합과 구간 표기법</summary>

![수학의 주요 집합과 구간 표기법](./figure-04.webp)

</details>

<details>
<summary>조건제시법</summary>

![조건제시법](./figure-05.webp)

</details>

### 연습문제 Practice 2.1-①

![연습문제 Practice 2.1-①](./figure-44.webp)

<details>
<summary>전체집합과 공집합</summary>

![전체집합과 공집합](./figure-06.webp)

</details>

<details>
<summary>러셀의 역설 (참고)</summary>

![러셀의 역설 (참고)](./figure-07.webp)

</details>

<details>
<summary>집합의 상등과 부분집합</summary>

![집합의 상등과 부분집합](./figure-08.webp)

</details>

<details>
<summary>부분집합 보이기 / 진부분집합</summary>

![부분집합 보이기 / 진부분집합](./figure-09.webp)

</details>

### 연습문제 Practice 2.1-②

![연습문제 Practice 2.1-②](./figure-45.webp)

<details>
<summary>집합의 크기와 멱집합</summary>

![집합의 크기와 멱집합](./figure-10.webp)

</details>

### 연습문제 Practice 2.1-③

![연습문제 Practice 2.1-③](./figure-46.webp)

<details>
<summary>튜플과 데카르트 곱</summary>

![튜플과 데카르트 곱](./figure-11.webp)

</details>

<details>
<summary>n개 집합의 데카르트 곱과 관계</summary>

![n개 집합의 데카르트 곱과 관계](./figure-12.webp)

</details>

<details>
<summary>집합 표기를 이용한 한정기호와 진리집합</summary>

![집합 표기를 이용한 한정기호와 진리집합](./figure-13.webp)

</details>

### 연습문제 Practice 2.1-④

![연습문제 Practice 2.1-④](./figure-47.webp)

### 2.1 단원 연습문제

![2.1 단원 연습문제](./figure-48.webp)

## 2.2 집합의 연산

<details>
<summary>합집합과 교집합</summary>

![합집합과 교집합](./figure-14.webp)

</details>

<details>
<summary>여집합과 차집합</summary>

![여집합과 차집합](./figure-15.webp)

</details>

### 연습문제 Practice 2.2-①

![연습문제 Practice 2.2-①](./figure-49.webp)

<details>
<summary>복습 문제와 대칭차집합</summary>

![복습 문제와 대칭차집합](./figure-16.webp)

</details>

<details>
<summary>합집합의 크기: 포함-배제</summary>

![합집합의 크기: 포함-배제](./figure-17.webp)

</details>

<details>
<summary>집합 항등식 (1)</summary>

![집합 항등식 (1)](./figure-18.webp)

</details>

<details>
<summary>집합 항등식 (2)</summary>

![집합 항등식 (2)](./figure-19.webp)

</details>

<details>
<summary>집합 항등식을 증명하는 방법</summary>

![집합 항등식을 증명하는 방법](./figure-20.webp)

</details>

<details>
<summary>제2 드모르간 법칙의 증명</summary>

![제2 드모르간 법칙의 증명](./figure-21.webp)

</details>

<details>
<summary>조건제시법과 구성원 표로 증명하기</summary>

![조건제시법과 구성원 표로 증명하기](./figure-22.webp)

</details>

### 연습문제 Practice 2.2-②

![연습문제 Practice 2.2-②](./figure-50.webp)

<details>
<summary>기존 항등식을 이용한 증명</summary>

![기존 항등식을 이용한 증명](./figure-23.webp)

</details>

<details>
<summary>일반화된 합집합과 교집합</summary>

![일반화된 합집합과 교집합](./figure-24.webp)

</details>

<details>
<summary>컴퓨터에서의 집합 표현: 비트 문자열</summary>

![컴퓨터에서의 집합 표현: 비트 문자열](./figure-25.webp)

</details>

### 연습문제 Practice 2.2-③

![연습문제 Practice 2.2-③](./figure-51.webp)

<details>
<summary>다중집합</summary>

![다중집합](./figure-26.webp)

</details>

### 2.2 단원 연습문제

![2.2 단원 연습문제](./figure-52.webp)

## 2.3 함수: 정의와 성질

<details>
<summary>함수의 정의</summary>

![함수의 정의](./figure-27.webp)

</details>

<details>
<summary>정의역, 공역, 상, 원상, 치역</summary>

![정의역, 공역, 상, 원상, 치역](./figure-28.webp)

</details>

<details>
<summary>예제: 정의역, 공역, 상, 원상 확인하기</summary>

![예제: 정의역, 공역, 상, 원상 확인하기](./figure-29.webp)

</details>

<details>
<summary>함수의 합, 곱과 부분집합의 상</summary>

![함수의 합, 곱과 부분집합의 상](./figure-30.webp)

</details>

### 연습문제 Practice 2.3-①

![연습문제 Practice 2.3-①](./figure-53.webp)

<details>
<summary>단사, 전사, 전단사</summary>

![단사, 전사, 전단사](./figure-31.webp)

</details>

<details>
<summary>단사, 전사임을 보이는 방법</summary>

![단사, 전사임을 보이는 방법](./figure-32.webp)

</details>

<details>
<summary>증가, 감소 함수와 항등함수</summary>

![증가, 감소 함수와 항등함수](./figure-33.webp)

</details>

<details>
<summary>예제: 단사, 전사 판별</summary>

![예제: 단사, 전사 판별](./figure-34.webp)

</details>

### 연습문제 Practice 2.3-②

![연습문제 Practice 2.3-②](./figure-54.webp)

<details>
<summary>역함수</summary>

![역함수](./figure-35.webp)

</details>

### 연습문제 Practice 2.3-③

![연습문제 Practice 2.3-③](./figure-55.webp)

<details>
<summary>함수의 합성</summary>

![함수의 합성](./figure-36.webp)

</details>

<details>
<summary>합성의 예제와 역함수와의 관계</summary>

![합성의 예제와 역함수와의 관계](./figure-37.webp)

</details>

<details>
<summary>함수의 그래프</summary>

![함수의 그래프](./figure-38.webp)

</details>

<details>
<summary>바닥함수와 천장함수</summary>

![바닥함수와 천장함수](./figure-39.webp)

</details>

<details>
<summary>바닥·천장 함수의 유용한 성질</summary>

![바닥·천장 함수의 유용한 성질](./figure-40.webp)

</details>

<details>
<summary>함수의 성질 증명하기</summary>

![함수의 성질 증명하기](./figure-41.webp)

</details>

<details>
<summary>계승 함수와 부분함수</summary>

![계승 함수와 부분함수](./figure-42.webp)

</details>

### 연습문제 Practice 2.3-④

![연습문제 Practice 2.3-④](./figure-56.webp)

<details>
<summary>참고: 무한집합의 크기 (2.5절 핵심 요약)</summary>

![참고: 무한집합의 크기 (2.5절 핵심 요약)](./figure-43.webp)

</details>

### 2.3 단원 연습문제

![2.3 단원 연습문제](./figure-57.webp)

## 추가 연습문제

### 1. 원소와 부분집합
다음 명제의 참·거짓을 판정하고 이유를 설명하라. $x$는 임의의 대상이다.

1. $\varnothing\in\{0\}$
2. $\varnothing\subset\{0\}$
3. $\{\varnothing\}\in\{\varnothing\}$
4. $\{\{\varnothing\}\}\subset\{\varnothing,\{\varnothing\}\}$
5. $\{x\}\in\{\{x\}\}$

### 2. 데카르트 곱의 크기
$|A|=m$, $|B|=n$일 때 $A\times B$의 서로 다른 원소는 몇 개인가? 이유를 설명하라.

### 3. 데카르트 곱과 집합의 같음
공집합이 아닌 집합 $A,B,C$에 대해 $A\times B=A\times C$이면 $B=C$인지 증명하거나 반례를 제시하라.

### 4. 한정 명제의 해석
다음 명제를 자연어로 옮기고 참·거짓을 판정하라. 거짓인 경우 반례를 제시하라.

1. $\forall x\in\mathbb R\;(x^2\ne-1)$
2. $\exists x\in\mathbb Z\;(x^2=2)$
3. $\forall x\in\mathbb Z\;(x^2>0)$
4. $\exists x\in\mathbb R\;(x^3=-1)$

### 5. 진리집합
정의역이 $\mathbb Z$일 때 다음 술어의 진리집합을 구하라.

1. $P(x):x^3\ge1$
2. $Q(x):x^2=2$
3. $R(x):x<x^2$

### 6. 집합의 드모르간 법칙
다음을 서로 부분집합임을 보이는 방법과 소속표를 이용하는 방법으로 각각 증명하라.

$$
(A\cup B)^c=A^c\cap B^c.
$$

### 7. 대칭차집합
$A\oplus B$는 A 또는 B 중 정확히 한 집합에 속하는 원소들의 집합이다. 다음을 증명하라.

$$
A\oplus B=(A\cup B)\setminus(A\cap B).
$$

### 8. 집합의 비트 표현
전체집합은 $U=\{1,2,\ldots,10\}$이다. i번째 비트는 i가 집합에 속하면 1, 아니면 0이다.

1. $\{3,4,5\}$와 $\{1,3,6,10\}$을 비트 문자열로 나타내라.
2. `11 1100 1111`이 나타내는 집합을 구하라.
3. 두 집합의 합집합과 교집합을 비트 OR, AND로 구하고 집합으로도 표현하라.

## 이어서 읽기

- 이전 글: [03. 추론 규칙과 증명 방법](/posts/discrete-mathematics-inference-and-proofs/)
- 다음 글: [05. 함수, 수열과 합, 행렬](/posts/discrete-mathematics-functions-sequences-matrices/)
