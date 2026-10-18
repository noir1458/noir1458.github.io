---
title: "02. 술어 논리, 한정 기호, 논리회로"
slug: discrete-mathematics-predicates-quantifiers-circuits
publishedAt: '2026-10-19'
categories: discrete_mathematics
math: true
description: "술어 논리, 한정 기호, 논리회로의 개념, 수식과 예제를 정리한다."
---

## 핵심 개념과 수식

### 1.4 술어와 한정 기호
명제 논리는 개별 문장의 참/거짓만 다루므로 대상 사이의 속성과 관계를 표현하기 어렵다. 술어 P(x)는 **변수의 값을 정해야 진리값이 결정되는 명제함수**다. 정의역 U를 먼저 지정해야 정량화된 문장의 의미가 정해진다.

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

자연어를 번역할 때 '모든 학생이 자바를 들었다'는 전체 사람을 정의역으로 잡으면 ∀x(S(x) → J(x))이며, ∀x(S(x) ∧ J(x))와 다르다. 전조건과 후조건으로 프로그램의 상태를 기술하거나 시스템 요구사항을 명세하는 방법도 다룬다.

### 1.5 중첩된 한정 기호
여러 변수를 동시에 정량화할 때 한정 기호의 **순서**가 의미를 결정한다. 같은 종류끼리는 순서를 바꿔도 되지만 서로 다른 종류는 일반적으로 바꿀 수 없다.

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

- 다음 두 문장이 있다고 하자.

– “모든 사람은 죽는다.” “Socrates는 사람이다.”

- 그렇다면 “Socrates는 죽는다”가 따라 나오는가?

– 이 추론은 명제 논리만으로는 표현할 수 없다 — 대상(objects)과 그 성질, 관계를 다루는 새로운

언어가 필요하다.

- “Every computer connected to the university network is functioning properly.” 이고

MATH3 가 대학 통신망에 연결된 컴퓨터 중 하나일 때 “MATH3 is functioning

properly”라는 문장의 진리값을 판정할 수 있도록 하는 명제 논리규칙은 없다.

– 술어 논리는 수학과 컴퓨터과학 분야에서 광범위한 문장들의 의미를 표현하는 데 사물들 간의

관계를 추론하고 탐색하는 데 사용된다.

– 술어논리는 모든 원소에 대해 어떤 성질이 성립한다거나 어떤 성질을 만족하는 원소가 존재한다

등의 문장을 사용하여 추론할 수 있게 하는 한정 기호의 개념을 포함한다.

</details>

<details>
<summary>술어 논리의 구성 요소</summary>

- 술어 논리는 다음과 같은 새로운 요소를 사용한다.

– 변수 (Variables): x, y, z

– 술어 (Predicates): P(x), M(x)

– 한정 기호 (Quantifiers)

- 명제함수(propositional function)는 명제의 일반화이다.

– 변수와 술어를 포함한다. 예) P(x)

– 이 문장들은 변수의 값이 정해지지 않으면 참인지 거짓인지 판정할 수가 없다. 즉, 변수 자리에

정의역(domain)의 원소를 대입하면 참/거짓이 정해지는 명제가 된다.

</details>

<details>
<summary>명제함수</summary>

![명제함수](./figure-01.webp)

</details>

### 연습문제 Practice 1.4 - ①

![연습문제 Practice 1.4 - ①](./figure-24.webp)

<details>
<summary>합성 명제함수</summary>

- 명제 논리의 논리 연산자는 술어 논리에서도 그대로 사용할 수 있다.

– P(x): “x ≥ 0” 일 때: P(3) ∨ P(-1) = 참, P(3) ∧ P(-1) = 거짓, P(3) → P(-1) = 거짓

- 변수가 그대로 남아 있는 식(예: P(3) ∧ P(y), P(x) → P(y))은 명제가 아니며

진리값을 갖지 않는다.

– 한정 기호와 함께 쓰이면 이러한 명제함수들도 비로소 명제가 된다.

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

- 정의역이 유한하면, 한정 기호를 정의역 원소를 훑는 반복문(loop)처럼 생각할 수

있다.

– ∀x P(x): x를 차례로 대입하며 확인 — 어느 한 단계에서 P(x)가 거짓이면 즉시 거짓으로 끝난다.

– 모든 단계를 통과하면 ∀x P(x)는 참이다.

∀x P(x)는 P(x1) ⋀ P(x2) ⋀ … ⋀ P(xn) 와 같이 논리곱으로 나타낼 수 있다.

– ∃x P(x): x를 차례로 대입하며 확인 — 어느 한 단계에서 P(x)가 참이면 즉시 참으로 끝난다.

– 끝까지 참인 x를 찾지 못하면 ∃x P(x)는 거짓이다.

∃ x P(x)는 P(x1) ∨ P(x2) ∨ … ∨ P(xn) 와 같이 논리합으로 나타낼 수 있다.

- 정의역이 무한해도 같은 방식으로 생각할 수 있지만, 반복문이 끝나지 않을 수도

있다.

</details>

### 연습문제 Practice 1.4 - ⑥

![연습문제 Practice 1.4 - ⑥](./figure-29.webp)

<details>
<summary>정의역에 따른 진리값</summary>

- ∀x P(x)와 ∃x P(x)의 진리값은 명제함수 P(x)뿐 아니라 정의역 U에도 의존한다.

– U = 양의 정수, P(x): “x \< 2” → ∃x P(x)는 참, ∀x P(x)는 거짓.

– U = 음의 정수, P(x): “x \< 2” → ∃x P(x)와 ∀x P(x) 모두 참.

– U = \{3, 4, 5\}, P(x): “x \> 2” → ∃x P(x)와 ∀x P(x) 둘 다 참.

P(x): “x \> 5” → ∃x P(x)와 ∀x P(x) 둘 다 거짓.

</details>

<details>
<summary>한정 기호의 우선순위</summary>

- 한정 기호 ∀, ∃는 모든 논리 연산자보다 우선순위가 높다.

– 예를 들어 ∀x P(x) ∨ Q(x) 는 (∀x P(x)) ∨ Q(x)를 뜻한다.

– ∀x (P(x) ∨ Q(x))는 전혀 다른 의미이다 — Q(x)까지 한정 기호에 묶인다.

- 의도한 뜻이 ∀x (P(x) ∨ Q(x))라면, 사람들이 종종 괄호 없이 ∀x P(x) ∨ Q(x)라고

잘못 쓰는 경우가 많으니 주의한다.

</details>

### 연습문제 Practice 1.4 - ⑥

![연습문제 Practice 1.4 - ⑥](./figure-30.webp)

<details>
<summary>구속 변수와 자유 변수</summary>

- 구속 변수 : 한정 기호 가 적용된 변수

- 자유 변수 : 한정기호가 적용되지 않은 변수

- 논리 표현에서 한정 기호가 적용되는 부분을 한정기호의 범위 (scope)라고 한다.

– 예를 들어 논리 표현 ∃ x (x+y=1) 에서 변수 x는 존재 한정에 구속되어 있으나 변수 y는 구속되어

있지 않았으므로 자유변수.

– ∃ x (P(x) ⋀ Q(x)) ∨ ∀x R(x) 에서 모든 변수는 구속 변수이다.

이것은

∃ x (P(x) ⋀ Q(x)) ∨ ∀y R(y) 와 동일한 논리표현이다. 두 한정 기호의 범위가 중첩되지 않았기

때문.

</details>

<details>
<summary>전체 한정 문장과 조건문</summary>

영어 → 논리식 번역 (1) 1.4 Translating English to Logic 1
문제 Problem

“이 반의 모든 학생은 자바(Java) 수업을 들었다.”를 술어 논리로 번역하시오.
● 풀이 Solution

먼저 정의역 U를 정한다.

방법 1: U = 이 반의 모든 학생. J(x): “x는 자바를 들었다”라 하면 → ∀x J(x)

방법 2: U = 모든 사람. S(x): “x는 이 반의 학생이다”를 추가하면 → ∀x (S(x) → J(x))

주의: ∀x (S(x) ∧ J(x))는 틀린 번역이다 — “모든 사람이 이 반 학생이며 자바도 들었다”로 잘못 읽힌다.

</details>

<details>
<summary>존재 한정 문장과 논리곱</summary>

영어 → 논리식 번역 (2) 1.4 Translating English to Logic 2
문제 Problem

“이 반의 어떤 학생은 자바(Java) 수업을 들었다.”를 술어 논리로 번역하시오.
● 풀이 Solution

먼저 정의역 U를 정한다.

방법 1: U = 이 반의 모든 학생 → ∃x J(x)

방법 2: U = 모든 사람 → ∃x (S(x) ∧ J(x))

주의: ∃x (S(x) → J(x))는 틀린 번역이다 — 이 반 학생이 아닌 사람만 있어도 조건문이 참이 되어버린다.

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

- ∀x J(x) — “이 반의 모든 학생이 자바 수업을 들었다.” 를 생각해보자.

– (J(x): “x는 자바를 들었다”, 정의역은 이 반의 학생들)

- 이를 부정하면 “이 반의 모든 학생이 자바를 들은 것은 아니다”가 되고, 이는

“자바를 듣지 않은 학생이 있다”를 뜻한다.

– 기호로 쓰면: ¬∀x J(x) 와 ∃x ¬J(x) 는 동치이다.

</details>

<details>
<summary>한정된 식의 부정 (2)</summary>

- 이번엔 ∃x J(x) — “이 반의 어떤 학생은 자바 수업을 들었다.” 를 생각해보자.

- 이를 부정하면 “이 반에 자바를 들은 학생이 있는 것은 아니다”가 되고, 이는 “모든

학생이 자바를 듣지 않았다”를 뜻한다.

– 기호로 쓰면: ¬∃x J(x) 와 ∀x ¬J(x) 는 동치이다.

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

영어 → 논리식 번역 1.4 Translation from English to Logic
문제 Problem

“이 반의 어떤 학생은 멕시코를 방문한 적이 있다.”와 “이 반의 모든 학생은 캐나다 또는 멕시코를 방문한 적

이 있다.”를 변환하시오.
● 풀이 Solution

M(x): “x는 멕시코를 방문했다”, S(x): “x는 이 반의 학생이다”, U = 모든 사람

① “어떤 학생은 멕시코를 방문했다” → ∃x (S(x) ∧ M(x))

C(x): “x는 캐나다를 방문했다”를 추가하면

② “모든 학생은 캐나다 또는 멕시코를 방문했다” → ∀x (S(x) → (M(x) ∨ C(x)))

</details>

<details>
<summary>Fleegle과 Snurd 예제</summary>

![Fleegle과 Snurd 예제](./figure-11.webp)

</details>

### 연습문제 Practice 1.4 - ⑩

![연습문제 Practice 1.4 - ⑩](./figure-34.webp)

<details>
<summary>시스템 명세를 논리식으로 표현하기</summary>

시스템 명세 예제 1.4 System Specification Example
문제 Problem

다음을 술어 논리로 번역하시오: “1메가바이트보다 큰 모든 메일 메시지는 압축된다.”, “사용자가 활성 상태이

면 적어도 하나의 네트워크 링크가 사용 가능하다.”
● 풀이 Solution

L(m,y): “메일 메시지 m이 y메가바이트보다 크다”, C(m): “m이 압축된다”

A(u): “사용자 u가 활성 상태이다”, S(n,x): “네트워크 링크 n이 상태 x이다”

① ∀m (L(m,1) → C(m))

② ∃u A(u) → ∃n S(n, available)

술어 논리는 이처럼 시스템이 만족해야 하는 명세(specification)를 표현하는 데에도 쓰인다.

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

중첩된 한정 기호 1.5 Nested Quantifiers
◆ 정의 Definition

한정 기호 안에 또 다른 한정 기호가 들어 있는 것을 중첩된 한정 기호(nested quantifiers)라

고 한다. 영어 문장의 의미나 컴퓨터과학,수학의 중요한 개념을 나타내는 데 자주 필요하다.

A quantifier within the scope of another quantifier.
예) “모든 실수는 역원을 갖는다”는 ∀x ∃y (x + y = 0) 로 나타낸다 (x, y의 정의역은 실수).
● 예제 Example

중첩된 명제함수로도 볼 수 있다: ∀x ∃y (x+y=0) = ∀x Q(x), Q(x) 는 ∃y P(x,y), P(x,y) 는 (x+y=0)

</details>

### 연습문제 Practice 1.5 - ①

![연습문제 Practice 1.5 - ①](./figure-38.webp)

<details>
<summary>중첩된 한정 기호와 반복문</summary>

- ∀x∀y P(x,y): x에 대해 반복하며, 각 단계마다 y에 대해서도 다시 반복한다(이중

반복문).

– 어느 (x,y) 쌍에서 P(x,y)가 거짓이면 즉시 거짓 — 안쪽,바깥쪽 반복문 모두 종료.

– 모든 x에 대해 안쪽 반복문을 끝까지 통과하면 참이다.

- ∀x∃y P(x,y): x에 대해 반복하며, 각 단계마다 P(x,y)가 참인 y를 찾을 때까지 안쪽

반복문을 돈다.

– 그런 y를 찾지 못하는 x가 하나라도 있으면 전체는 거짓 — 바깥 반복문 종료.

- 정의역이 무한하면 이 반복문들은 실제로 끝나지 않을 수 있지만, 개념적으로는

여전히 유효하다.

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

중첩된 한정 기호 영어로 번역하기 1.5 Translating Nested Quantifiers
문제 Problem

C(x): “x는 컴퓨터를 가지고 있다”, F(x,y): “x와 y는 친구이다” (정의역: 우리 학교의

모든 학생). 다음 두 식을 번역하시오.
● 풀이 Solution

① ∀x (C(x) ∨ ∃y (C(y) ∧ F(x,y)))

→ “이 학교의 모든 학생은 컴퓨터를 가지고 있거나, 컴퓨터를 가진 친구가 있다.”

② ∃x ∀y ∀z ((F(x,y) ∧ F(x,z) ∧ (y≠z)) → ¬F(y,z))

→ “서로 다른 두 친구가 있어도 그 친구들끼리는 서로 친구가 아닌, 그런 학생이 적어도 한 명 있다.”

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

미적분학에서의 활용 1.5 Quantifiers in Calculus (optional)
함수 f(x)가 점 a에서 극한값 L을 가진다(lim_\{x→a\} f(x) = L)는 정의를 한정 기호로 표현하면:
∀ε ∃δ ∀x (0 \< \|x−a\| \< δ → \|f(x)−L\| \< ε)

(ε, δ의 정의역은 양의 실수 전체, x의 정의역은 실수 전체)
● 극한이 존재하지 않는다는 것은?

위 정의를 부정하고 드모르간 법칙을 반복 적용하면:

∀L ∃ε ∀δ ∃x (0 \< \|x−a\| \< δ ∧ \|f(x)−L\| ≥ ε)

번역: “모든 L에 대해, 어떤 ε\>0이 있어서, 모든 δ\>0에 대해 0\<\|x−a\|\<δ 이면서 \|f(x)−L\|≥ε 인 x가 존재

한다.”

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

## 이어서 읽기

- 이전 글: [01. 명제 논리, 응용, 명제의 동치](/posts/discrete-mathematics-propositional-logic/)
- 다음 글: [03. 추론 규칙과 증명 방법](/posts/discrete-mathematics-inference-and-proofs/)
