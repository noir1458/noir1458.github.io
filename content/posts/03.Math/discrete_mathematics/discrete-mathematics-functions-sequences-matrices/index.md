---
title: "05. 함수, 수열과 합, 행렬"
slug: discrete-mathematics-functions-sequences-matrices
publishedAt: '2026-10-19'
categories: discrete_mathematics
math: true
description: "함수, 수열과 합, 행렬의 개념, 수식과 예제를 정리한다."
---

## 핵심 개념과 수식

### 2.3 함수의 성질 복습
함수 f: A → B는 **정의역의 각 원소마다 정확히 하나의 공역 원소가 대응**되어야 한다. 상(image), 원상(preimage), 치역(range)을 구별하고 단사, 전사, 전단사를 각각 별도로 판단한다. 특히 역함수가 정의되려면 모든 공역 원소가 정확히 하나의 원상을 가져야 한다.

$$
f^{-1}:B\to A\ \text{존재}\iff f\text{가 전단사},\qquad
(f\circ g)(x)=f(g(x))
$$

합성의 순서와 정의역 및 공역 조건, 항등함수, 함수 그래프, 단조성, 바닥함수 및 천장함수 성질을 확인한다. 계승함수와 부분함수, 무한집합의 기수(cardinality)는 뒤의 문제와 연결된다.

### 2.4 수열과 합
수열은 순서가 있는 원소들의 나열로 함수 a: ℕ → S로도 볼 수 있다. 등차수열은 연속하는 항의 차가 일정하고, 등비수열은 비가 일정하다. 문자열 역시 원소에 순서가 있는 유한 수열이다.

$$
a_n=a_1+(n-1)d,\qquad a_n=a_1r^{n-1}
$$

점화식(recurrence relation)은 앞선 항으로 다음 항을 정의한다. 단순 점화식은 반복 대입으로 닫힌 형식을 유도한다. 피보나치 수열, 복리, 특수 정수 수열 추측, 온라인 정수열 백과사전(OEIS)도 소개된다.

$$
\sum_{k=0}^{n}ar^k=\begin{cases}
a\dfrac{1-r^{n+1}}{1-r},&r\ne1,\\
a(n+1),&r=1.
\end{cases}
$$

$$
\sum_{k=1}^n k=\frac{n(n+1)}2,\qquad
\sum_{k=1}^n k^2=\frac{n(n+1)(2n+1)}6
$$

합과 곱의 기호, 지수와 첨자, 이중합, 집합의 원소에 대한 합을 다루며 표기된 범위와 시작 인덱스를 유의한다.

### 2.6 행렬
m × n 행렬은 행과 열로 배열된 값들의 구조다. 덧셈은 같은 크기에서 정의되고, 행렬곱 AB는 A의 열 개수와 B의 행 개수가 같아야 한다.

$$
(AB)_{ij}=\sum_k a_{ik}b_{kj}
$$

행렬곱은 **일반적으로 교환법칙이 성립하지 않는다**. 항등행렬, 전치행렬, 대칭행렬을 구별하고 0-1 행렬에서는 OR/AND를 사용하는 결합(join), 만남(meet), 불 곱(Boolean product), 불 거듭제곱을 다룬다.

$$
(A\odot B)_{ij}=\bigvee_k(a_{ik}\land b_{kj})
$$

---

## 2.3 함수: 정의, 역함수, 합성


<details>
<summary>함수의 정의</summary>

![함수의 정의](./figure-02.webp)

</details>

<details>
<summary>정의역, 공역, 상, 원상, 치역</summary>

![정의역, 공역, 상, 원상, 치역](./figure-03.webp)

</details>

<details>
<summary>예제: 정의역, 공역, 상, 원상 확인하기</summary>

![예제: 정의역, 공역, 상, 원상 확인하기](./figure-04.webp)

</details>

<details>
<summary>함수의 합, 곱과 부분집합의 상</summary>

![함수의 합, 곱과 부분집합의 상](./figure-05.webp)

</details>

### 연습문제 Practice 2.3-①

![연습문제 Practice 2.3-①](./figure-45.webp)

<details>
<summary>단사, 전사, 전단사</summary>

![단사, 전사, 전단사](./figure-06.webp)

</details>

<details>
<summary>단사, 전사임을 보이는 방법</summary>

![단사, 전사임을 보이는 방법](./figure-07.webp)

</details>

<details>
<summary>증가·감소 함수와 항등함수</summary>

![증가·감소 함수와 항등함수](./figure-08.webp)

</details>

<details>
<summary>예제: 단사, 전사 판별</summary>

![예제: 단사, 전사 판별](./figure-09.webp)

</details>

### 연습문제 Practice 2.3-②

![연습문제 Practice 2.3-②](./figure-46.webp)

<details>
<summary>역함수</summary>

![역함수](./figure-10.webp)

</details>

### 연습문제 Practice 2.3-③

![연습문제 Practice 2.3-③](./figure-47.webp)

<details>
<summary>함수의 합성</summary>

![함수의 합성](./figure-11.webp)

</details>

<details>
<summary>합성의 예제와 역함수와의 관계</summary>

![합성의 예제와 역함수와의 관계](./figure-12.webp)

</details>

<details>
<summary>함수의 그래프</summary>

![함수의 그래프](./figure-13.webp)

</details>

<details>
<summary>바닥함수와 천장함수</summary>

![바닥함수와 천장함수](./figure-14.webp)

</details>

<details>
<summary>바닥·천장 함수의 유용한 성질</summary>

![바닥·천장 함수의 유용한 성질](./figure-15.webp)

</details>

<details>
<summary>함수의 성질 증명하기</summary>

![함수의 성질 증명하기](./figure-16.webp)

</details>

<details>
<summary>계승 함수와 부분함수</summary>

![계승 함수와 부분함수](./figure-17.webp)

</details>

### 연습문제 Practice 2.3-④

![연습문제 Practice 2.3-④](./figure-48.webp)

<details>
<summary>무한집합의 크기</summary>

![무한집합의 크기](./figure-18.webp)

</details>

### 2.3 단원 연습문제

![2.3 단원 연습문제](./figure-49.webp)

## 2.4 수열과 합

<details>
<summary>수열</summary>

![수열](./figure-19.webp)

</details>

<details>
<summary>등비수열과 등차수열</summary>

![등비수열과 등차수열](./figure-20.webp)

</details>

<details>
<summary>문자열: 수열의 한 예</summary>

![문자열: 수열의 한 예](./figure-21.webp)

</details>

<details>
<summary>점화식</summary>

![점화식](./figure-22.webp)

</details>

<details>
<summary>피보나치 수열</summary>

![피보나치 수열](./figure-23.webp)

</details>

<details>
<summary>점화식의 해인지 확인하기</summary>

![점화식의 해인지 확인하기](./figure-24.webp)

</details>

<details>
<summary>점화식 풀이: 반복법</summary>

![점화식 풀이: 반복법](./figure-25.webp)

</details>

<details>
<summary>응용: 복리 계산</summary>

![응용: 복리 계산](./figure-26.webp)

</details>

### 연습문제 Practice 2.4-①

![연습문제 Practice 2.4-①](./figure-50.webp)

<details>
<summary>특수 정수 수열 찾기</summary>

![특수 정수 수열 찾기](./figure-27.webp)

</details>

<details>
<summary>유용한 수열과 수열 추측 예제</summary>

![유용한 수열과 수열 추측 예제](./figure-28.webp)

</details>

<details>
<summary>온라인 정수열 백과사전</summary>

![온라인 정수열 백과사전](./figure-29.webp)

</details>

<details>
<summary>합과 곱의 표기법</summary>

![합과 곱의 표기법](./figure-30.webp)

</details>

<details>
<summary>등비급수의 합</summary>

![등비급수의 합](./figure-31.webp)

</details>

<details>
<summary>유용한 합 공식</summary>

![유용한 합 공식](./figure-32.webp)

</details>

<details>
<summary>합의 공식의 계산</summary>

![합의 공식의 계산](./figure-33.webp)

</details>

<details>
<summary>합의 공식 연습</summary>

![합의 공식 연습](./figure-34.webp)

</details>

<details>
<summary>이중합과 집합 위의 합</summary>

![이중합과 집합 위의 합](./figure-35.webp)

</details>

### 연습문제 Practice 2.4-②

![연습문제 Practice 2.4-②](./figure-51.webp)

## 2.6 행렬

<details>
<summary>행렬의 정의와 표기법</summary>

![행렬의 정의와 표기법](./figure-36.webp)

</details>

<details>
<summary>행렬의 덧셈</summary>

![행렬의 덧셈](./figure-37.webp)

</details>

<details>
<summary>행렬의 곱셈</summary>

![행렬의 곱셈](./figure-38.webp)

</details>

### 연습문제 Practice 2.6-①

![연습문제 Practice 2.6-①](./figure-52.webp)

<details>
<summary>곱셈의 비교환성과 항등행렬</summary>

![곱셈의 비교환성과 항등행렬](./figure-39.webp)

</details>

<details>
<summary>전치행렬과 대칭행렬</summary>

![전치행렬과 대칭행렬](./figure-40.webp)

</details>

### 연습문제 Practice 2.6-②

![연습문제 Practice 2.6-②](./figure-53.webp)

<details>
<summary>0-1 행렬의 결합과 만남</summary>

![0-1 행렬의 결합과 만남](./figure-41.webp)

</details>

<details>
<summary>0-1 행렬의 불 곱</summary>

![0-1 행렬의 불 곱](./figure-42.webp)

</details>

### 연습문제 Practice 2.6-③

![연습문제 Practice 2.6-③](./figure-54.webp)

<details>
<summary>영-일 행렬의 불 거듭제곱</summary>

![영-일 행렬의 불 거듭제곱](./figure-43.webp)

</details>

<details>
<summary>행렬의 핵심 개념</summary>

![행렬의 핵심 개념](./figure-44.webp)

</details>

### 2.6 단원 연습문제

![2.6 단원 연습문제](./figure-55.webp)

### Chapter 2 종합 복습문제

![Chapter 2 종합 복습문제](./figure-56.webp)

## 추가 연습문제

### 9. 단사와 전사
다음 $f:\mathbb Z\to\mathbb Z$가 단사인지, 전사인지 판정하라. 성립하지 않으면 반례를 제시하라.

1. $f(n)=n-1$
2. $f(n)=n^2+1$
3. $f(n)=\lceil n/2\rceil$

### 10. 전단사
다음 $f:\mathbb R\to\mathbb R$가 전단사인지 판정하라.

1. $f(x)=-3x+4$
2. $f(x)=-3x^2+7$

### 11. 일차함수의 역함수
$a\ne0$일 때 $f(x)=ax+b$가 $\mathbb R$에서 $\mathbb R$로 가는 가역함수임을 보이고 $f^{-1}$를 구하라.

### 12. 천장함수와 저장 용량
1바이트는 8비트다. n비트를 저장하는 데 필요한 바이트 수를 바닥함수 또는 천장함수로 표현하고, $n=4,10,500,3000$일 때의 값을 구하라.

### 13. 점화식의 닫힌 형태
반복 대입으로 각 수열의 일반항을 구하라.

1. $a_n=3a_{n-1},\quad a_0=2$
2. $a_n=a_{n-1}+n,\quad a_0=1$
3. $a_n=3a_{n-1}+1,\quad a_0=1$

### 14. 합 계산
다음 값을 구하라.

$$
\sum_{j=1}^{8}2^j,\qquad
\sum_{j=0}^{8}2(-3)^j,\qquad
\sum_{i=1}^{2}\sum_{j=1}^{3}(i+j),\qquad
\sum_{k=100}^{200}k.
$$

### 15. 행렬곱
다음 행렬의 곱 AB를 구하라.

$$
A=\begin{pmatrix}1&-3&0\\1&2&2\\2&1&-1\end{pmatrix},\qquad
B=\begin{pmatrix}1&-1&2&3\\-1&0&3&-1\\-3&-2&0&2\end{pmatrix}.
$$

### 16. 2×2 역행렬
$ad-bc\ne0$일 때 다음 행렬을 양쪽 순서로 곱해 항등행렬이 되는지 확인하라.

$$
A=\begin{pmatrix}a&b\\c&d\end{pmatrix},\qquad
A^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}.
$$

### 17. 연립방정식의 행렬 표현
다음 연립방정식을 $AX=B$로 나타낼 수 있음을 보여라.

$$
a_{i1}x_1+a_{i2}x_2+\cdots+a_{in}x_n=b_i\quad(i=1,\ldots,n).
$$

여기서 $A=[a_{ij}]$, $X=(x_1,\ldots,x_n)^T$, $B=(b_1,\ldots,b_n)^T$다. A가 가역이면 해가 $X=A^{-1}B$임을 보여라.

### 18. 역행렬로 연립방정식 풀기
다음 연립방정식을 풀어라.

$$
\begin{aligned}
7x_1-8x_2+5x_3&=5,\\
-4x_1+5x_2-3x_3&=-3,\\
x_1-x_2+x_3&=0.
\end{aligned}
$$

계수행렬과 그 역행렬은 다음과 같다. 먼저 곱이 항등행렬이 되는지 확인한 뒤 우변 벡터에 역행렬을 곱한다.

$$
M=\begin{pmatrix}7&-8&5\\-4&5&-3\\1&-1&1\end{pmatrix},\qquad
M^{-1}=\begin{pmatrix}2&3&-1\\1&2&1\\-1&-1&3\end{pmatrix}.
$$

## 합의 공식 계산
망원합을 이용하면 자연수의 합과 제곱합을 유도할 수 있다.

### 문제 1. 망원합의 성질
다음을 보여라.

$$
\sum_{j=1}^{n}(a_j-a_{j-1})=a_n-a_0
$$

중간 항이 소거되는 망원합(telescoping sum)을 확인한다.

### 문제 2. 홀수의 합과 자연수의 합
다음 등식을 이용해 두 합을 구하라.

$$
k^2-(k-1)^2=2k-1
$$

$$
\sum_{k=1}^{n}(2k-1),\qquad \sum_{k=1}^{n}k
$$

### 문제 3. 제곱합
앞의 결과를 이용하여 다음의 공식이 성립함을 보여라.

$$
\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}6
$$

### 문제 4. 무한 등비급수
절댓값이 1보다 작은 실수 x에 대해 다음 급수의 합을 구하라.

$$
\sum_{k=0}^{\infty}x^k=\frac{1}{1-x}
$$

## 이어서 읽기

- 이전 글: [04. 집합과 집합의 연산, 함수의 기초](/posts/discrete-mathematics-sets-and-functions/)
- 다음 글: [06. 알고리즘, 함수의 증가, 알고리즘의 복잡도](/posts/discrete-mathematics-algorithms-and-complexity/)
