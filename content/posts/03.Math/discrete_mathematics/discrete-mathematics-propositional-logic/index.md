---
title: "01. 명제 논리, 응용, 명제의 동치"
slug: discrete-mathematics-propositional-logic
publishedAt: '2026-10-19'
categories: discrete_mathematics
math: true

---

## 핵심 개념과 수식

### 1.1 명제 논리: 출발점

**명제(proposition)** 는 참 또는 거짓 중 하나의 진리값을 가진 선언문이다. 명령문, 의문문, 변수에 값이 주어지지 않은 열린 문장은 보통 명제가 아니다. 단순 명제에서 출발해 논리 연결사를 이용하여 복합 명제를 만든다.

| 연결사 | 의미 | 참이 되는 조건 |
| --- | --- | --- |
| ¬p | 부정(NOT) | p가 거짓일 때 |
| p ∧ q | 논리곱(AND) | p와 q가 모두 참일 때 |
| p ∨ q | 포함적 논리합(OR) | 적어도 하나가 참일 때 |
| p ⊕ q | 배타적 논리합(XOR) | 정확히 하나만 참일 때 |
| p → q | 조건문 | p가 참이고 q가 거짓인 경우만 제외 |
| p ↔ q | 쌍조건문 | p와 q의 진리값이 같을 때 |

조건문은 일상 언어와 달리 **전제가 거짓일 때 참**으로 정의된다. 필요한 조건과 충분한 조건을 혼동하지 말자. p → q에서 p는 q의 충분조건이고 q는 p의 필요조건이다.

$$
p\to q\;\equiv\;\neg p\lor q\;\equiv\;\neg q\to\neg p
$$

여기서 역은 q → p, 이는 ¬p → ¬q, 대우는 ¬q → ¬p이다. 원래 명제와 **대우**는 동치지만 역이나 이는 일반적으로 원래 명제와 동치가 아니다.
복합 논리식의 진리표는 명제 변수가 n개이면 2ⁿ개의 진리값 조합으로 작성한다. 괄호와 연산 순서를 먼저 확인하고, 각 입력 조합에 대해 값을 계산한다.

### 1.2 명제 논리의 응용
자연어 문장에서 원자 명제를 정하고 연결사의 우선순위와 범위를 명확히 표현한다. 시스템 명세가 **일관적(consistent)** 이라는 것은 모든 명세를 동시에 참으로 만드는 진리값 배정이 존재한다는 뜻이다. 부울 검색, 기사와 거짓말쟁이 논리 퍼즐, NOT/AND/OR 게이트로 구성하는 논리회로도 응용 예이다.

$$
\text{NOT}(p)=\neg p,\qquad \text{AND}(p,q)=p\land q,\qquad \text{OR}(p,q)=p\lor q
$$

회로 문제는 입력부터 각 게이트의 출력을 순서대로 식으로 적어 분석한다. 각 중간 신호에 이름을 붙이면 복잡한 회로도 단계별로 진리표를 작성할 수 있다.

### 1.3 명제의 동치

**항진명제**는 모든 진리값 배정에서 참, **모순명제**는 모든 배정에서 거짓, **불확정 명제**는 참인 배정과 거짓인 배정이 모두 있는 식이다. 논리적 동치란 두 식이 모든 배정에서 진리값이 같다는 뜻이며 진리표나 동치 법칙 연쇄로 증명한다.

$$
\neg(p\land q)\equiv\neg p\lor\neg q,\qquad
\neg(p\lor q)\equiv\neg p\land\neg q
$$

$$
p\to q\equiv\neg p\lor q,\qquad
p\leftrightarrow q\equiv(p\to q)\land(q\to p)
$$

$$
p\land(q\lor r)\equiv(p\land q)\lor(p\land r)
$$

교환, 결합, 분배, 드모르간, 이중부정, 흡수, 항등, 지배, 멱등 법칙을 통해 식을 단계별로 변형한다. **충족가능성(satisfiability)** 은 식을 참으로 만드는 배정이 하나라도 있는가를 묻는다. n-여왕 문제나 스도쿠도 각 배치를 명제 변수로 나타내고 규칙을 논리식으로 연결하면 충족가능성 문제로 표현할 수 있다.

---

## 1.1 명제 논리

<details>
<summary>명제의 정의</summary>

![명제의 정의](./figure-01.webp)

</details>

### 연습문제 Practice 1.1 - ①

![연습문제 Practice 1.1 - ①](./figure-46.webp)

<details>
<summary>명제의 구성</summary>

![명제의 구성](./figure-02.webp)

</details>

<details>
<summary>부정</summary>

![부정](./figure-03.webp)

</details>

<details>
<summary>논리곱</summary>

![논리곱](./figure-04.webp)

</details>

<details>
<summary>논리합</summary>

![논리합](./figure-05.webp)

</details>

### 연습문제 Practice 1.1 - ②-1

![연습문제 Practice 1.1 - ②-1](./figure-47.webp)

<details>
<summary>포함적 논리합과 배타적 논리합</summary>

![포함적 논리합과 배타적 논리합](./figure-06.webp)

</details>

### 연습문제 Practice 1.1 - ②-2

![연습문제 Practice 1.1 - ②-2](./figure-48.webp)

<details>
<summary>조건문</summary>

![조건문](./figure-07.webp)

</details>

<details>
<summary>조건문을 표현하는 여러 방법</summary>

![조건문을 표현하는 여러 방법](./figure-08.webp)

</details>

<details>
<summary>필요조건과 충분조건</summary>

![필요조건과 충분조건](./figure-09.webp)

</details>

### 연습문제 Practice 1.1 - ③

![연습문제 Practice 1.1 - ③](./figure-49.webp)

<details>
<summary>역, 대우, 이</summary>

![역, 대우, 이](./figure-10.webp)

</details>

### 연습문제 Practice 1.1 - ④

![연습문제 Practice 1.1 - ④](./figure-50.webp)

<details>
<summary>상호조건문</summary>

![상호조건문](./figure-11.webp)

</details>

<details>
<summary>상호조건문을 표현하는 여러 방법</summary>

![상호조건문을 표현하는 여러 방법](./figure-12.webp)

</details>

### 연습문제 Practice 1.1 - ⑤

![연습문제 Practice 1.1 - ⑤](./figure-51.webp)

<details>
<summary>복합 명제의 진리표 작성법</summary>

![복합 명제의 진리표 작성법](./figure-13.webp)

</details>

<details>
<summary>진리표 작성 예제</summary>

![진리표 작성 예제](./figure-14.webp)

</details>

<details>
<summary>동치인 명제</summary>

![동치인 명제](./figure-15.webp)

</details>

<details>
<summary>조건문과 대우의 동치</summary>

![조건문과 대우의 동치](./figure-16.webp)

</details>

### 연습문제 Practice 1.1 - ⑥

![연습문제 Practice 1.1 - ⑥](./figure-52.webp)

<details>
<summary>명제 변수의 개수와 진리표 행의 수</summary>

![명제 변수의 개수와 진리표 행의 수](./figure-17.webp)

</details>

<details>
<summary>논리 연산자의 우선순위</summary>

![논리 연산자의 우선순위](./figure-18.webp)

</details>

### 연습문제 Practice 1.1 - ⑦

![연습문제 Practice 1.1 - ⑦](./figure-53.webp)

<details>
<summary>논리와 비트 연산</summary>

![논리와 비트 연산](./figure-19.webp)

</details>

### 연습문제 Practice 1.1 - ⑧

![연습문제 Practice 1.1 - ⑧](./figure-54.webp)

### Section 1.1 Review Problems

![Section 1.1 Review Problems](./figure-55.webp)

## 1.2 명제 논리의 응용

<details>
<summary>명제 논리의 응용</summary>

![명제 논리의 응용](./figure-20.webp)

</details>

<details>
<summary>문장을 명제 논리로 변환하기</summary>

![문장을 명제 논리로 변환하기](./figure-21.webp)

</details>

<details>
<summary>캠퍼스 인터넷 접속 조건</summary>

![캠퍼스 인터넷 접속 조건](./figure-22.webp)

</details>

### 연습문제 Practice 1.2 - ①

![연습문제 Practice 1.2 - ①](./figure-56.webp)

<details>
<summary>시스템 명세</summary>

![시스템 명세](./figure-23.webp)

</details>

<details>
<summary>일관된 시스템 명세</summary>

시스템 명세가 일관적이라는 것은 모든 요구사항을 동시에 참으로 만드는 진리값 배정이 존재한다는 뜻이다.

$p$를 “진단 메시지를 버퍼에 저장한다”, $q$를 “진단 메시지를 재전송한다”라고 하자. 다음 세 요구사항을 생각해 보자.

- 메시지를 버퍼에 저장하거나 재전송한다: $p\lor q$
- 메시지를 버퍼에 저장하지 않는다: $\neg p$
- 메시지를 버퍼에 저장하면 재전송한다: $p\to q$

$p=F$, $q=T$로 두면 세 식이 모두 참이므로 일관적이다. 여기에 “메시지를 재전송하지 않는다”라는 요구사항 $\neg q$를 추가하면 모든 식을 동시에 만족시킬 수 없으므로 일관성이 깨진다.

</details>

### 연습문제 Practice 1.2 - ②

![연습문제 Practice 1.2 - ②](./figure-57.webp)

<details>
<summary>부울 탐색</summary>

![부울 탐색](./figure-24.webp)

</details>

<details>
<summary>논리 퍼즐</summary>

![논리 퍼즐](./figure-25.webp)

</details>

<details>
<summary>기사와 거짓말쟁이</summary>

![기사와 거짓말쟁이](./figure-26.webp)

</details>

### 연습문제 Practice 1.2 - ③

![연습문제 Practice 1.2 - ③](./figure-58.webp)

<details>
<summary>논리 회로의 구성</summary>

![논리 회로의 구성](./figure-27.webp)

</details>

<details>
<summary>논리 회로의 입출력</summary>

![논리 회로의 입출력](./figure-28.webp)

</details>

### 연습문제 Practice 1.2 - ④

![연습문제 Practice 1.2 - ④](./figure-59.webp)

### 연습문제 Practice 1.2 - ⑤

![연습문제 Practice 1.2 - ⑤](./figure-60.webp)

### 1.2 단원 연습문제

![1.2 단원 연습문제](./figure-61.webp)

## 1.3 명제의 동치

<details>
<summary>명제의 동치</summary>

항진명제는 모든 진리값 배정에서 참이고, 모순명제는 항상 거짓이다. 둘 다 아닌 명제는 우연명제다. 두 명제가 모든 진리값 배정에서 같은 값을 가지면 논리적으로 동치라고 한다.

논리식을 표준형으로 나타내면 구조를 비교하기 쉽다. 선언표준형(DNF)은 리터럴의 논리곱들을 논리합으로 연결하고, 논언표준형(CNF)은 리터럴의 논리합들을 논리곱으로 연결한다. 적어도 하나의 진리값 배정에서 참이 되는 식은 충족 가능하다.

</details>

<details>
<summary>항진명제, 모순명제, 불확정 명제</summary>

![항진명제, 모순명제, 불확정 명제](./figure-29.webp)

</details>

### 연습문제 Practice 1.3 - ①

![연습문제 Practice 1.3 - ①](./figure-62.webp)

<details>
<summary>논리적 동치</summary>

![논리적 동치](./figure-30.webp)

</details>

<details>
<summary>드모르간 법칙</summary>

![드모르간 법칙](./figure-31.webp)

</details>

### 연습문제 Practice 1.3 - ②

![연습문제 Practice 1.3 - ②](./figure-63.webp)

<details>
<summary>핵심 논리 동치 법칙 (1)</summary>

![핵심 논리 동치 법칙 (1)](./figure-32.webp)

</details>

<details>
<summary>핵심 논리 동치 법칙 (2)</summary>

![핵심 논리 동치 법칙 (2)](./figure-33.webp)

</details>

<details>
<summary>일반화된 논리곱과 논리합</summary>

![일반화된 논리곱과 논리합](./figure-34.webp)

</details>

### 연습문제 Practice 1.3 - ③

![연습문제 Practice 1.3 - ③](./figure-64.webp)

<details>
<summary>조건문과 상호조건문의 동치</summary>

![조건문과 상호조건문의 동치](./figure-35.webp)

</details>

<details>
<summary>새로운 논리 동치 만들기</summary>

![새로운 논리 동치 만들기](./figure-36.webp)

</details>

<details>
<summary>동치 증명 예제 (1)</summary>

![동치 증명 예제 (1)](./figure-37.webp)

</details>

<details>
<summary>동치 증명 예제 (2)</summary>

![동치 증명 예제 (2)](./figure-38.webp)

</details>

### 연습문제 Practice 1.3 - ④

![연습문제 Practice 1.3 - ④](./figure-65.webp)

<details>
<summary>명제의 만족 가능성</summary>

![명제의 만족 가능성](./figure-39.webp)

</details>

<details>
<summary>만족 가능성 판정 예제</summary>

![만족 가능성 판정 예제](./figure-40.webp)

</details>

### 연습문제 Practice 1.3 - ⑥

![연습문제 Practice 1.3 - ⑥](./figure-66.webp)

<details>
<summary>n-여왕 문제 (1)</summary>

![n-여왕 문제 (1)](./figure-41.webp)

</details>

<details>
<summary>n-여왕 문제 (2)</summary>

![n-여왕 문제 (2)](./figure-42.webp)

</details>

<details>
<summary>수도쿠와 만족 가능성</summary>

![수도쿠와 만족 가능성](./figure-43.webp)

</details>

<details>
<summary>수도쿠의 논리명제</summary>

![수도쿠의 논리명제](./figure-44.webp)

</details>

<details>
<summary>만족 가능성 문제 풀기</summary>

![만족 가능성 문제 풀기](./figure-45.webp)

</details>

### Section 1.3 Review Problems

![Section 1.3 Review Problems](./figure-67.webp)

### Chapter 1 , Part I 종합 복습문제

![Chapter 1 , Part I 종합 복습문제](./figure-68.webp)

## 추가 연습문제

### 문제 1\~4 (명제 논리)

**문제 1.** 진리표를 사용하지 않고, 쌍조건문 p ↔ q은 p와 q가 동일한 진리값을 가질 때에만 참이 되는 이유를 설명하라.

**문제 2.** p: “사용자가 유효한 비밀번호를 입력한다”, q: “접근이 허용된다”, r: “사용자가 구독료를 지불하였다”라고 할 때 다음 문장을 논리식으로 표현하라.

1. 사용자는 구독료를 지불했지만 유효한 비밀번호를 입력하지 않았다.

2. 사용자가 구독료를 지불하고 유효한 비밀번호를 입력하면 접근이 허용된다.

3. 사용자가 구독료를 지불하지 않았으면 접근이 거부된다.

**문제 3.** 진리표를 작성하여 다음 명제가 항진명제임을 보여라.

1. (p ∧ q) → p

2. ¬p → (p → q)

**문제 4.** 논리적 동치 법칙의 연쇄를 이용하여 \[(p → q) ∧ (q → r)\] → (p → r)가 항진명제임을 보여라. 진리표 사용 금지.
