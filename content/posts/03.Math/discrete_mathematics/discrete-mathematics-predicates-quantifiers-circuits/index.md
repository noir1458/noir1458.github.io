---
title: "02. 술어 논리, 한정 기호, 논리회로"
slug: discrete-mathematics-predicates-quantifiers-circuits
publishedAt: '2026-10-15'
categories: discrete_mathematics
math: true

---

## 핵심 개념과 수식

### 1.4 술어와 한정 기호
명제 논리는 개별 문장의 참/거짓만 다루므로 대상 사이의 속성과 관계를 표현하기 어렵다. 술어 P(x)는 **변수의 값을 정해야 진리값이 결정되는 명제함수**다. 정의역 U를 먼저 지정해야 한정 명제의 의미가 정해진다.

$$
\forall x\in U\;P(x)\quad\text{(모든 원소가 성질 P를 갖는다)}
$$

$$
\exists x\in U\;P(x)\quad\text{(적어도 하나가 성질 P를 갖는다)}
$$

전체 한정은 유한 정의역에서는 논리곱처럼, 존재 한정은 논리합처럼 동작한다. ∃!x P(x)는 조건을 만족하는 원소가 **정확히 하나** 있음을 뜻한다. 한정 기호의 **범위(scope)** 와 변수가 구속(bound)되었는지를 확인한다.

$$
\neg\forall x\,P(x)\equiv\exists x\,\neg P(x),\qquad
\neg\exists x\,P(x)\equiv\forall x\,\neg P(x)
$$

자연어를 번역할 때 '모든 학생이 자바를 들었다'는 전체 사람을 정의역으로 잡으면 ∀x(S(x) → J(x))이며, ∀x(S(x) ∧ J(x))와 다르다. 프로그램의 실행 전후 상태는 전조건과 후조건으로 표현할 수 있다. 시스템이 만족해야 하는 요구사항도 같은 방식으로 논리식으로 나타낼 수 있다.

### 1.5 중첩된 한정 기호
여러 변수에 한정 기호를 적용할 때 한정 기호의 **순서**가 의미를 결정한다. 같은 종류끼리는 순서를 바꿔도 되지만 서로 다른 종류는 일반적으로 바꿀 수 없다.

$$
\forall x\,\forall y\,P(x,y)\equiv\forall y\,\forall x\,P(x,y)
$$

$$
\forall x\,\exists y\,P(x,y)\not\equiv\exists y\,\forall x\,P(x,y)
$$

예를 들어 실수의 덧셈에서 ∀x∃y(x + y = 0)는 참이지만, 모든 실수 x에 대해 동일한 y를 고를 수 있다는 ∃y∀x(x+y=0)는 거짓이다. 부정은 한정 기호를 하나씩 뒤집으며 원자 명제까지 내린다.

$$
\neg\forall x\exists y\,P(x,y)\equiv\exists x\forall y\,\neg P(x,y)
$$

### 논리회로의 식 표현
NOT, AND, OR 게이트를 입력부터 차례로 읽어 식을 만든다. 아래 논리회로 연습의 네 회로는 다음과 같이 나타낼 수 있다.

$$
\begin{aligned}
\text{1쪽 (a)}\quad &\neg p\lor\neg q\\
\text{1쪽 (b)}\quad &\neg\bigl(p\lor(\neg p\land q)\bigr)\\
\text{2쪽 (a)}\quad &\neg\bigl(p\land(q\lor\neg r)\bigr)\\
\text{2쪽 (b)}\quad &(\neg p\land\neg q)\lor(p\land r)
\end{aligned}
$$

논리식과 논리회로는 같은 연산을 서로 다른 형태로 표현한다.

---

## 1.4 술어와 한정 기호

<details>
<summary>명제 논리의 표현 한계</summary>

“모든 사람은 죽는다”와 “소크라테스는 사람이다”로부터 “소크라테스는 죽는다”를 얻으려면 대상과 성질을 표현할 수 있어야 한다. 문장 전체를 하나의 명제로만 취급하면 이 내부 관계를 드러낼 수 없다.

“대학 통신망에 연결된 모든 컴퓨터는 정상 작동한다”와 “MATH3는 대학 통신망에 연결되어 있다”로부터 MATH3의 정상 작동 여부를 판단하는 경우도 마찬가지다. 술어 논리는 대상의 성질과 관계, 모든 원소 또는 어떤 원소에 대한 조건을 표현한다.

</details>

<details>
<summary>술어 논리의 구성 요소</summary>

술어 논리는 변수 $x,y,z$, 술어 $P(x)$, 그리고 전체·존재 한정 기호를 사용한다. 명제함수 $P(x)$는 변수에 따라 진리값이 달라지는 표현이다. 자유 변수의 값이 정해지면 참이나 거짓을 판단할 수 있는 명제가 된다.

</details>

<details>
<summary>명제함수</summary>

![명제함수](./figure-01.webp)

</details>

### 연습문제 Practice 1.4 - ①

![연습문제 Practice 1.4 - ①](./figure-24.webp)

<details>
<summary>합성 명제함수</summary>

명제 논리의 연산자는 명제함수에도 사용할 수 있다. $P(x)$를 “$x\ge0$”으로 정의하면 다음과 같다.

- $P(3)\lor P(-1)$: 참
- $P(3)\land P(-1)$: 거짓
- $P(3)\to P(-1)$: 거짓

$P(3)\land P(y)$나 $P(x)\to P(y)$처럼 자유 변수가 남아 있으면 그 값에 따라 진리값이 달라진다. 변수의 값을 지정하거나 한정 기호로 묶어 명제로 만들 수 있다.

</details>

### 연습문제 Practice 1.4 - ②

![연습문제 Practice 1.4 - ②](./figure-25.webp)

<details>
<summary>전조건과 후조건</summary>

![전조건과 후조건](./figure-02.webp)

</details>

<details>
<summary>한정 기호</summary>

![한정 기호](./figure-03.webp)

</details>

<details>
<summary>전체 한정 기호</summary>

![전체 한정 기호](./figure-04.webp)

</details>

### 연습문제 Practice 1.4 - ③

![연습문제 Practice 1.4 - ③](./figure-26.webp)

### 연습문제 Practice 1.4 - ④

![연습문제 Practice 1.4 - ④](./figure-27.webp)

<details>
<summary>존재 한정 기호</summary>

![존재 한정 기호](./figure-05.webp)

</details>

### 연습문제 Practice 1.4 - ⑤

![연습문제 Practice 1.4 - ⑤](./figure-28.webp)

<details>
<summary>유일성 한정 기호</summary>

![유일성 한정 기호](./figure-06.webp)

</details>

<details>
<summary>한정 기호를 반복문으로 이해하기</summary>

유한한 정의역의 원소가 $x_1,\ldots,x_n$이면 전체 한정은 모든 원소를 검사하는 과정이고, 존재 한정은 조건을 만족하는 원소를 하나 찾는 과정이다.

$$
\forall x\,P(x)\equiv P(x_1)\land\cdots\land P(x_n),\qquad
\exists x\,P(x)\equiv P(x_1)\lor\cdots\lor P(x_n).
$$

전체 한정은 반례 하나를 찾는 순간 거짓으로 판정할 수 있고, 존재 한정은 조건을 만족하는 원소 하나를 찾는 순간 참으로 판정할 수 있다. 무한한 정의역에서도 의미는 같지만 모든 원소를 훑는 반복문이 끝난다고 보장할 수는 없다.

</details>

### 연습문제 Practice 1.4 - ⑥

![연습문제 Practice 1.4 - ⑥](./figure-29.webp)

<details>
<summary>정의역에 따른 진리값</summary>

한정 명제의 진리값은 술어뿐 아니라 정의역에도 의존한다.

| 정의역 | 조건 $P(x)$ | $\exists x\,P(x)$ | $\forall x\,P(x)$ |
| --- | --- | --- | --- |
| 양의 정수 | $x<2$ | 참 | 거짓 |
| 음의 정수 | $x<2$ | 참 | 참 |
| $\{3,4,5\}$ | $x>2$ | 참 | 참 |
| $\{3,4,5\}$ | $x>5$ | 거짓 | 거짓 |

</details>

<details>
<summary>한정 기호의 우선순위</summary>

한정 기호를 논리 연산자보다 먼저 적용하는 표기 관례에서는 $\forall x\,P(x)\lor Q(x)$가 $(\forall x\,P(x))\lor Q(x)$를 뜻한다. 이때 $Q(x)$의 $x$는 자유 변수다.

두 술어를 모두 한정하려면 $\forall x\,(P(x)\lor Q(x))$처럼 괄호로 범위를 명확히 적어야 한다.

</details>

### 연습문제 Practice 1.4 - ⑥

![연습문제 Practice 1.4 - ⑥](./figure-30.webp)

<details>
<summary>구속 변수와 자유 변수</summary>

한정 기호에 묶인 변수는 구속 변수, 묶이지 않은 변수는 자유 변수다. 한정 기호가 적용되는 부분을 범위(scope)라고 한다.

$\exists x\,(x+y=1)$에서 $x$는 구속 변수이고 $y$는 자유 변수다. 반면 $(\exists x\,(P(x)\land Q(x)))\lor(\forall x\,R(x))$의 변수는 모두 구속되어 있다. 두 한정 기호의 범위가 겹치지 않으므로 뒤쪽 식을 $\forall y\,R(y)$로 바꾸어도 뜻은 같다.

</details>

<details>
<summary>전체 한정 문장과 조건문</summary>

“이 반의 모든 학생은 자바 수업을 들었다”를 표현해 보자. $J(x)$는 “$x$는 자바 수업을 들었다”, $S(x)$는 “$x$는 이 반의 학생이다”를 뜻한다.

- 정의역이 이 반의 학생들이면 $\forall x\,J(x)$
- 정의역이 모든 사람이면 $\forall x\,(S(x)\to J(x))$

$\forall x\,(S(x)\land J(x))$는 “모든 사람이 이 반의 학생이고 자바 수업도 들었다”라는 다른 뜻이 된다.

</details>

<details>
<summary>존재 한정 문장과 논리곱</summary>

“이 반의 어떤 학생은 자바 수업을 들었다”는 정의역에 따라 다음처럼 표현한다.

- 정의역이 이 반의 학생들이면 $\exists x\,J(x)$
- 정의역이 모든 사람이면 $\exists x\,(S(x)\land J(x))$

$\exists x\,(S(x)\to J(x))$로 쓰면 이 반의 학생이 아닌 사람만 있어도 조건문이 참이 된다. 원하는 대상의 존재와 그 대상의 성질을 함께 요구하려면 논리곱을 써야 한다.

</details>

### 연습문제 Practice 1.4 - ⑦

![연습문제 Practice 1.4 - ⑦](./figure-31.webp)

<details>
<summary>소크라테스 예제</summary>

![소크라테스 예제](./figure-07.webp)

</details>

<details>
<summary>술어 논리에서의 동치</summary>

![술어 논리에서의 동치](./figure-08.webp)

</details>

<details>
<summary>한정 기호를 논리곱과 논리합으로 표현하기</summary>

![한정 기호를 논리곱과 논리합으로 표현하기](./figure-09.webp)

</details>

<details>
<summary>한정된 식의 부정 (1)</summary>

정의역을 이 반의 학생들로 두고 $J(x)$를 “$x$는 자바 수업을 들었다”라고 하자. “모든 학생이 자바 수업을 들었다”의 부정은 “자바 수업을 듣지 않은 학생이 있다”이다.

$$
\neg\forall x\,J(x)\equiv\exists x\,\neg J(x).
$$

</details>

<details>
<summary>한정된 식의 부정 (2)</summary>

“자바 수업을 들은 학생이 있다”를 부정하면 “모든 학생이 자바 수업을 듣지 않았다”가 된다. 정의역은 이 반의 학생들이다.

$$
\neg\exists x\,J(x)\equiv\forall x\,\neg J(x).
$$

</details>

### 연습문제 Practice 1.4 - ⑧

![연습문제 Practice 1.4 - ⑧](./figure-32.webp)

<details>
<summary>한정 기호의 드모르간 법칙</summary>

![한정 기호의 드모르간 법칙](./figure-10.webp)

</details>

### 연습문제 Practice 1.4 - ⑨

![연습문제 Practice 1.4 - ⑨](./figure-33.webp)

<details>
<summary>방문 경험을 논리식으로 표현하기</summary>

정의역을 모든 사람으로 두자. $S(x)$는 “이 반의 학생이다”, $M(x)$는 “멕시코를 방문했다”, $C(x)$는 “캐나다를 방문했다”를 뜻한다.

“이 반의 어떤 학생은 멕시코를 방문했다”는 다음과 같다.

$$
\exists x\,(S(x)\land M(x)).
$$

“이 반의 모든 학생은 캐나다 또는 멕시코를 방문했다”는 다음과 같다.

$$
\forall x\,(S(x)\to(M(x)\lor C(x))).
$$

</details>

<details>
<summary>Fleegle과 Snurd 예제</summary>

![Fleegle과 Snurd 예제](./figure-11.webp)

</details>

### 연습문제 Practice 1.4 - ⑩

![연습문제 Practice 1.4 - ⑩](./figure-34.webp)

<details>
<summary>시스템 명세를 논리식으로 표현하기</summary>

$L(m,y)$를 “메일 $m$의 크기가 $y$메가바이트보다 크다”, $C(m)$을 “메일 $m$이 압축된다”로 정의하자. “1메가바이트보다 큰 모든 메일은 압축된다”는 다음과 같다.

$$
\forall m\,(L(m,1)\to C(m)).
$$

$A(u)$는 “사용자 $u$가 활성 상태이다”, $S(n,x)$는 “네트워크 링크 $n$의 상태가 $x$이다”를 뜻한다. “활성 사용자가 있으면 적어도 하나의 네트워크 링크가 사용 가능하다”는 다음과 같다.

$$
(\exists u\,A(u))\to(\exists n\,S(n,\mathrm{available})).
$$

각 변수의 정의역은 각각 메일, 사용자, 네트워크 링크로 둔다.

</details>

<details>
<summary>루이스 캐럴 예제</summary>

![루이스 캐럴 예제](./figure-12.webp)

</details>

### 연습문제 Practice 1.4 - ⑪

![연습문제 Practice 1.4 - ⑪](./figure-35.webp)

### 연습문제 Practice 1.4 - ⑫

![연습문제 Practice 1.4 - ⑫](./figure-36.webp)

<details>
<summary>술어 논리 용어 정리</summary>

![술어 논리 용어 정리](./figure-13.webp)

</details>

<details>
<summary>한정 기호의 범위</summary>

![한정 기호의 범위](./figure-14.webp)

</details>

### Section 1.4 Review Problems

![Section 1.4 Review Problems](./figure-37.webp)

## 1.5 중첩된 한정 기호

<details>
<summary>중첩된 한정 기호</summary>

![중첩된 한정 기호](./figure-15.webp)

</details>

<details>
<summary>중첩된 한정 기호의 정의</summary>

한정 기호의 범위 안에 다른 한정 기호가 들어 있으면 중첩된 한정이라고 한다. “모든 실수에는 덧셈에 대한 역원이 있다”는 다음처럼 표현한다.

$$
\forall x\,\exists y\,(x+y=0),\qquad x,y\in\mathbb R.
$$

$P(x,y)$를 $x+y=0$, $Q(x)$를 $\exists y\,P(x,y)$로 정의하면 전체 식은 $\forall x\,Q(x)$가 된다. 각 $x$에 따라 적절한 $y$를 선택할 수 있다는 뜻이다.

</details>

### 연습문제 Practice 1.5 - ①

![연습문제 Practice 1.5 - ①](./figure-38.webp)

<details>
<summary>중첩된 한정 기호와 반복문</summary>

유한한 정의역에서 $\forall x\forall y\,P(x,y)$는 모든 $(x,y)$ 쌍을 검사하는 이중 반복문과 같다. 반례를 하나라도 찾으면 거짓이고, 모든 쌍에서 참이면 전체 식도 참이다.

$\forall x\exists y\,P(x,y)$는 각 $x$마다 조건을 만족하는 $y$를 찾는 과정이다. 어느 $x$에서든 그런 $y$가 없으면 전체 식은 거짓이다. 무한한 정의역에서는 이 의미를 그대로 사용하되, 실제 반복문이 종료한다고 가정해서는 안 된다.

</details>

<details>
<summary>한정 기호의 순서</summary>

![한정 기호의 순서](./figure-16.webp)

</details>

### 연습문제 Practice 1.5 - ②

![연습문제 Practice 1.5 - ②](./figure-39.webp)

<details>
<summary>두 변수에 대한 한정</summary>

![두 변수에 대한 한정](./figure-17.webp)

</details>

<details>
<summary>중첩된 한정 기호를 문장으로 해석하기</summary>

정의역을 우리 학교의 모든 학생으로 두자. $C(x)$는 “$x$는 컴퓨터를 가지고 있다”, $F(x,y)$는 “$x$와 $y$는 친구이다”를 뜻한다.

$$
\forall x\,(C(x)\lor\exists y\,(C(y)\land F(x,y))).
$$

모든 학생이 컴퓨터를 가지고 있거나, 컴퓨터를 가진 친구가 있다는 뜻이다.

$$
\exists x\,\forall y\,\forall z\,((F(x,y)\land F(x,z)\land y\ne z)\to\neg F(y,z)).
$$

어떤 학생은 자신의 서로 다른 두 친구가 서로 친구인 경우가 없다는 뜻이다. 이 식 자체가 그 학생에게 친구가 두 명 이상 있다고 요구하지는 않는다. 친구가 없거나 한 명뿐이어도 조건문은 참일 수 있다.

</details>

### 연습문제 Practice 1.5 - ③

![연습문제 Practice 1.5 - ③](./figure-40.webp)

<details>
<summary>수학 문장을 술어 논리로 표현하기</summary>

![수학 문장을 술어 논리로 표현하기](./figure-18.webp)

</details>

### 연습문제 Practice 1.5 - ④

![연습문제 Practice 1.5 - ④](./figure-41.webp)

<details>
<summary>항공사 예제</summary>

![항공사 예제](./figure-19.webp)

</details>

<details>
<summary>형제자매 관계의 논리식</summary>

![형제자매 관계의 논리식](./figure-20.webp)

</details>

<details>
<summary>사랑하는 관계와 한정 기호의 순서</summary>

![사랑하는 관계와 한정 기호의 순서](./figure-21.webp)

</details>

### 연습문제 Practice 1.5 - ⑤

![연습문제 Practice 1.5 - ⑤](./figure-42.webp)

<details>
<summary>중첩된 한정 기호의 부정</summary>

![중첩된 한정 기호의 부정](./figure-22.webp)

</details>

### 연습문제 Practice 1.5 - ⑥

![연습문제 Practice 1.5 - ⑥](./figure-43.webp)

<details>
<summary>한정 기호 심화 문제</summary>

함수의 극한도 중첩된 한정 기호로 표현할 수 있다. $\lim_{x\to a}f(x)=L$의 정의는 다음과 같다. 여기서는 $f$가 $a$의 뚫린 근방에서 정의되어 있다고 가정한다.

$$
\forall\varepsilon>0\;\exists\delta>0\;\forall x\in\mathbb R\,
(0<|x-a|<\delta\to|f(x)-L|<\varepsilon).
$$

유한한 극한값이 존재하지 않는다는 것은 어떤 실수 $L$도 이 조건을 만족하지 못한다는 뜻이다. 한정 기호를 차례로 부정하면 다음과 같다.

$$
\forall L\in\mathbb R\;\exists\varepsilon>0\;\forall\delta>0\;\exists x\in\mathbb R\,
(0<|x-a|<\delta\land|f(x)-L|\ge\varepsilon).
$$

어떤 $L$을 후보로 잡아도 오차 기준 $\varepsilon$을 하나 정할 수 있고, $a$에 아무리 가까이 가도 그 기준을 벗어나는 $x$가 존재한다는 뜻이다.

</details>

<details>
<summary>한정 기호에 관한 질문</summary>

![한정 기호에 관한 질문](./figure-23.webp)

</details>

### Section 1.5 Review Problems

![Section 1.5 Review Problems](./figure-44.webp)

## 논리회로 연습

### 논리회로 A

![NOT, AND, OR 게이트를 이용한 논리회로 A](./figure-45.webp)

1. (a) 입력 p, q를 각각 부정한 후 OR 게이트로 결합한다. 출력은 아래와 같다.

$$
\neg p\lor\neg q
$$

1. (b) p와 (¬p ∧ q)를 OR 게이트에 넣고 최종 출력을 부정한다.

$$
\neg\bigl(p\lor(\neg p\land q)\bigr)
$$

### 논리회로 B

![NOT, AND, OR 게이트를 이용한 논리회로 B](./figure-46.webp)

1. (a) q ∨ ¬r을 만든 후 p와 AND를 취해 출력을 부정한다.

$$
\neg\bigl(p\land(q\lor\neg r)\bigr)
$$

1. (b) (¬p ∧ ¬q)와 (p ∧ r)의 OR이다.

$$
(\neg p\land\neg q)\lor(p\land r)
$$

## 추가 연습문제

### 문제 5\~6 (한정 기호)

**문제 5.** 정의역이 모든 실수일 때 다음 명제의 진리값을 판정하고, 참이면 증명하고 거짓이면 반례를 제시하라.

1. ∀x∃y(x + y = 1)

2. ∃x∀y(xy = 0)

3. ∀x∃y(x = y²)

**문제 6.** L(x,y)를 'x가 y를 사랑한다'라는 명제라고 하자. 정의역이 모든 사람일 때 다음 문장을 한정자를 사용하여 표현하라.

1. Everybody loves somebody.

2. There is somebody whom everybody loves.

3. Nobody loves everybody.

4. Everyone loves himself or herself.
