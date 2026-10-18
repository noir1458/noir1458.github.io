---
title: "04. 집합과 집합의 연산, 함수의 기초"
slug: discrete-mathematics-sets-and-functions
publishedAt: '2026-10-17'
categories: discrete_mathematics
math: true

---

집합은 어떤 대상이 포함되는지를, 함수는 한 대상이 다른 대상으로 어떻게 대응되는지를 표현한다. 원소와 부분집합, 공역과 치역처럼 비슷해 보이는 말을 구별해야 이후의 계산과 증명도 정확해진다. 집합 연산을 논리식으로 풀어 보고, 함수의 성질을 정의역과 공역까지 포함해 판단해 보자.

[연습문제로 바로 가기](#practice) · 먼저 풀어 본 뒤 각 문제의 **해설 보기**를 눌러 확인할 수 있다.

## 1. 집합을 표현하는 방법

집합은 서로 구별되는 대상들의 순서 없는 모임이다. $a\in A$는 $a$가 $A$의 원소라는 뜻이고, $a\notin A$는 원소가 아니라는 뜻이다. 순서와 중복은 집합을 바꾸지 않으므로

$$
\{a,b,c,b,a\}=\{c,b,a\}=\{a,b,c\}.
$$

원소나열법은 $\{2,4,6,8\}$처럼 원소를 직접 쓰는 방식이다. 조건제시법은 $\{x\in\mathbb Z^+\mid x<10\text{이고 }x\text{는 짝수}\}$처럼 조건으로 정한다. 말줄임표를 사용할 때도 원소를 결정하는 규칙이 분명해야 한다.

이 글에서는 $\mathbb N=\{0,1,2,\ldots\}$, $\mathbb Z^+=\{1,2,3,\ldots\}$로 쓴다. $\mathbb Z$는 정수, $\mathbb Q=\{p/q\mid p,q\in\mathbb Z,q\ne0\}$는 유리수, $\mathbb R$는 실수, $\mathbb C$는 복소수 집합이다.

실수 구간의 표기는 끝점을 포함하는지에 따라 달라진다.

| 구간 | 조건 |
|---|---|
| $[a,b]$ | $a\le x\le b$ |
| $(a,b)$ | $a<x<b$ |
| $[a,b)$ | $a\le x<b$ |
| $(a,b]$ | $a<x\le b$ |

현재 논의하는 모든 대상을 담은 집합은 전체집합 $U$다. 원소가 하나도 없는 집합은 공집합 $\varnothing$이다. 집합 자체도 다른 집합의 원소가 될 수 있으므로

$$
\varnothing\ne\{\varnothing\},\qquad
|\varnothing|=0,\quad|\{\varnothing\}|=1.
$$

벤 다이어그램은 전체집합 안에서 각 집합의 영역과 겹침을 보여 주는 방법이다. 그림을 읽을 때도 결국 판정하는 것은 “이 원소가 어느 집합에 속하는가”다.

### 아무 조건이나 집합을 만드는 것은 아니다

“자기 자신을 원소로 갖지 않는 모든 집합의 집합” $S$를 허용한다고 하자. $S\in S$이면 정의에 의해 $S\notin S$이고, $S\notin S$이면 다시 정의에 의해 $S\in S$여야 한다. 이것이 러셀의 역설이다. 따라서 임의의 성질을 적었다고 항상 집합이 존재한다고 생각해서는 안 된다. 보통의 조건제시법은 이미 주어진 집합에서 조건을 만족하는 원소를 고르는 방식으로 사용한다.

## 2. 원소, 부분집합, 멱집합

집합의 상등과 포함 관계는 논리식으로 정의한다.

$$
\begin{aligned}
A=B&\iff\forall x(x\in A\leftrightarrow x\in B),\\
A\subseteq B&\iff\forall x(x\in A\to x\in B).
\end{aligned}
$$

$A\subseteq B$이면서 $A\ne B$이면 진부분집합이다. 여기서는 $A\subsetneq B$로 표기한다. 예를 들어 $\{1,2\}\subsetneq\{1,2,3\}$이다.

모든 집합 $A$에 대해 $A\subseteq A$와 $\varnothing\subseteq A$가 성립한다. 후자는 $x\in\varnothing$이 항상 거짓이라 조건문이 공허하게 참이기 때문이다. $A\subseteq B$가 아님을 보이려면 $A$에는 있지만 $B$에는 없는 원소 하나를 찾는다. 예를 들어 $-1$은 제곱이 100보다 작지만 음이 아닌 정수는 아니다.

$\in$과 $\subseteq$는 다른 질문이다. 다음을 하나씩 풀어 보면 차이가 분명하다.

| 주장 | 진리값 | 이유 |
|---|---|---|
| $\varnothing\in\{0\}$ | F | 유일한 원소는 수 0 |
| $\varnothing\subsetneq\{0\}$ | T | 공집합은 부분집합이고 두 집합은 다름 |
| $\{\varnothing\}\in\{\varnothing\}$ | F | 오른쪽의 원소는 $\varnothing$ |
| $\{\{\varnothing\}\}\subsetneq\{\varnothing,\{\varnothing\}\}$ | T | 왼쪽의 원소 $\{\varnothing\}$가 오른쪽에 있음 |
| $\{x\}\in\{\{x\}\}$ | T | 오른쪽의 유일한 원소가 $\{x\}$ |

### 크기와 멱집합

유한집합의 크기 $|A|$는 서로 다른 원소의 수다. $A$의 모든 부분집합을 모은 집합을 멱집합 $\mathcal P(A)$라고 한다.

$$
\mathcal P(\{x,y,z\})=
\{\varnothing,\{x\},\{y\},\{z\},\{x,y\},\{x,z\},\{y,z\},\{x,y,z\}\}.
$$

원소마다 넣거나 넣지 않는 두 선택이 있으므로 $|A|=n$이면 $|\mathcal P(A)|=2^n$이다. 예를 들어 원소가 다섯 개이면 부분집합은 32개다. 공집합도 자기 자신의 부분집합이므로

$$
\mathcal P(\varnothing)=\{\varnothing\},\qquad
\mathcal P(\{\varnothing\})=\{\varnothing,\{\varnothing\}\}.
$$

$B=\{\varnothing,\{\varnothing\}\}$는 원소가 두 개여서 멱집합의 원소가 네 개다.

## 3. 순서쌍, 데카르트 곱, 관계

집합과 달리 튜플은 순서가 있다. $(a,b)=(c,d)$인 것은 $a=c$이면서 $b=d$일 때다.

$$
A\times B=\{(a,b)\mid a\in A,\ b\in B\}.
$$

$A=\{a,b\}$, $B=\{1,2,3\}$이면

$$
A\times B=\{(a,1),(a,2),(a,3),(b,1),(b,2),(b,3)\}.
$$

일반적으로 $A\times B\ne B\times A$다. 첫 좌표와 둘째 좌표의 역할이 다르기 때문이다. 유한집합에서 $|A|=m,|B|=n$이면 각 첫 좌표에 둘째 좌표를 $n$가지로 붙이므로 $|A\times B|=mn$이다. 여러 집합도 같은 방식으로

$$
A_1\times\cdots\times A_k
=\{(a_1,\ldots,a_k)\mid a_i\in A_i\},\qquad
|A_1\times\cdots\times A_k|=\prod_{i=1}^{k}|A_i|
$$

로 정의한다. $\{0,1\}\times\{1,2\}\times\{0,1,2\}$에는 12개의 삼중쌍이 있다.

**관계**는 데카르트 곱의 부분집합이다. $A=\{0,1,2,3\}$에서 $a\le b$인 쌍을 모으면

$$
\begin{aligned}
R=\{&(0,0),(0,1),(0,2),(0,3),\\
&(1,1),(1,2),(1,3),(2,2),(2,3),(3,3)\}.
\end{aligned}
$$

### 곱집합의 상등에서 얻는 결론

$A\ne\varnothing$이고 $A\times B=A\times C$이면 $B=C$다. $a\in A$ 하나를 고정한다. 임의의 $b\in B$에 대해 $(a,b)\in A\times B=A\times C$이므로 $b\in C$다. 따라서 $B\subseteq C$이고, 반대 방향도 같아서 상등이 성립한다. $A=\varnothing$이면 두 곱집합이 항상 공집합이라 $B,C$가 달라도 같아진다. 비어 있지 않다는 조건을 실제로 사용하는 지점은 $a$를 고르는 단계다.

## 4. 한정 기호와 진리집합

집합을 사용해 한정 기호의 정의역을 제한할 수 있다.

$$
\forall x\in S\,P(x)\equiv\forall x(x\in S\to P(x)),\qquad
\exists x\in S\,P(x)\equiv\exists x(x\in S\land P(x)).
$$

술어 $P$의 진리집합은 $\{x\in D\mid P(x)\}$다. 전칭 명제는 진리집합이 정의역 전체일 때 참이고, 존재 명제는 진리집합이 비어 있지 않을 때 참이다.

| 정수 정의역의 조건 | 진리집합 |
|---|---|
| $\lvert x\rvert=1$ 또는 $x^2=1$ | $\{-1,1\}$ |
| $x^2<3$ | $\{-1,0,1\}$ |
| $x^2=2$ | $\varnothing$ |
| $\lvert x\rvert=x$ | $\mathbb N$ |
| $x^3\ge1$ | $\{1,2,3,\ldots\}$ |
| $x<x^2$ | $\mathbb Z\setminus\{0,1\}$ |

마지막은 $x(x-1)>0$을 풀면 $x<0$ 또는 $x>1$이기 때문이다. 실수에서는 $\forall x(x^2\ne-1)$이 참이고, 정수에서는 $\exists x(x^2=2)$가 거짓이다. $\forall x\in\mathbb Z(x^2>0)$은 0이 반례이고, $\exists x\in\mathbb R(x^3=-1)$은 $x=-1$이 증인이다.

## 5. 집합 연산과 포함·배제

| 연산 | 정의 |
|---|---|
| 합집합 | $A\cup B=\{x\mid x\in A\lor x\in B\}$ |
| 교집합 | $A\cap B=\{x\mid x\in A\land x\in B\}$ |
| 여집합 | $\overline A=U\setminus A$ |
| 차집합 | $A\setminus B=\{x\mid x\in A\land x\notin B\}=A\cap\overline B$ |
| 대칭차집합 | $A\mathbin\triangle B=(A\setminus B)\cup(B\setminus A)$ |

교집합이 공집합인 두 집합을 서로소라고 한다. 대칭차는 두 집합 중 정확히 하나에만 속하는 원소를 모으므로 배타적 논리합에 대응한다.

$U=\{0,1,\ldots,10\}$, $A=\{1,2,3,4,5\}$, $B=\{4,5,6,7,8\}$이면

| 연산 | 결과 |
|---|---|
| $A\cup B$ | $\{1,2,3,4,5,6,7,8\}$ |
| $A\cap B$ | $\{4,5\}$ |
| $\overline A$ | $\{0,6,7,8,9,10\}$ |
| $\overline B$ | $\{0,1,2,3,9,10\}$ |
| $A\setminus B$ | $\{1,2,3\}$ |
| $B\setminus A$ | $\{6,7,8\}$ |
| $A\mathbin\triangle B$ | $\{1,2,3,6,7,8\}$ |

유한집합의 합집합 크기는

$$
|A\cup B|=|A|+|B|-|A\cap B|
$$

다. 교집합의 원소를 두 번 세었으므로 한 번 빼는 것이다. 수학 전공 40명, 컴퓨터공학 전공 35명, 두 전공 모두인 학생 10명이면 적어도 하나에 속한 학생은 $40+35-10=65$명이다.

## 6. 집합 항등식과 증명

| 법칙 | 항등식 |
|---|---|
| 항등 | $A\cup\varnothing=A$, $A\cap U=A$ |
| 지배 | $A\cup U=U$, $A\cap\varnothing=\varnothing$ |
| 멱등 | $A\cup A=A$, $A\cap A=A$ |
| 이중여집합 | $\overline{\overline A}=A$ |
| 교환 | $A\cup B=B\cup A$, $A\cap B=B\cap A$ |
| 결합 | $A\cup(B\cup C)=(A\cup B)\cup C$, $A\cap(B\cap C)=(A\cap B)\cap C$ |
| 분배 | $A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$, $A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$ |
| 드모르간 | $\overline{A\cup B}=\overline A\cap\overline B$, $\overline{A\cap B}=\overline A\cup\overline B$ |
| 흡수 | $A\cup(A\cap B)=A$, $A\cap(A\cup B)=A$ |
| 여집합 | $A\cup\overline A=U$, $A\cap\overline A=\varnothing$ |

이들은 명제 논리의 동치와 대응한다. 원소 $x$를 고정하면 합집합은 OR, 교집합은 AND, 여집합은 NOT이다.

### 서로 부분집합임을 보이기

$\overline{A\cap B}=\overline A\cup\overline B$를 보이자. 왼쪽의 원소 $x$는 $A,B$에 동시에 속하지 않으므로 둘 중 적어도 하나에 속하지 않는다. 따라서 오른쪽에 속한다. 반대로 오른쪽의 원소 $x$는 $A$ 또는 $B$ 중 하나에 속하지 않으므로 교집합에 속하지 않는다. 따라서 왼쪽에도 속한다.

이를 동치의 연쇄로 쓰면 더 짧다.

$$
\begin{aligned}
x\in\overline{A\cap B}
&\iff\neg(x\in A\land x\in B)\\
&\iff(x\notin A\lor x\notin B)\\
&\iff x\in\overline A\cup\overline B.
\end{aligned}
$$

다른 드모르간 법칙도 $\neg(x\in A\lor x\in B)\iff(x\notin A\land x\notin B)$로 증명한다.

### 구성원 표로 확인하기

| $x\in A$ | $x\in B$ | $x\in A\cap B$ | $x\in\overline{A\cap B}$ | $x\in\overline A\cup\overline B$ |
|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 1 | 1 |

마지막 두 열이 같으므로 항등식이 성립한다. 집합이 세 개면 소속 여부의 조합은 $2^3=8$개다. $A\cap(B\cup\overline B)$에서는 괄호 안이 항상 1이므로 결과가 $A$와 같다.

### 알려진 항등식을 적용하기

$$
\begin{aligned}
\overline{A\cup(B\cap C)}
&=\overline A\cap\overline{B\cap C}\\
&=\overline A\cap(\overline B\cup\overline C)\\
&=(\overline C\cup\overline B)\cap\overline A.
\end{aligned}
$$

또 $A\cap(B\setminus A)=(A\cap\overline A)\cap B=\varnothing$이다. 흡수법칙 $A\cup(A\cap B)=A$는 $A\cap B\subseteq A$라는 사실에서 바로 나온다.

대칭차의 다른 표현도 유용하다.

$$
A\mathbin\triangle B=(A\cup B)\setminus(A\cap B).
$$

오른쪽에 속하려면 적어도 하나에 속하면서 동시에 둘 모두에 속하지 않아야 한다. 이는 정확히 하나에 속한다는 대칭차의 정의다.

## 7. 여러 집합과 컴퓨터에서의 표현

색인이 붙은 집합족 $A_i$에 대해

$$
\bigcup_{i\in I}A_i=\{x\mid\exists i\in I, x\in A_i\},\qquad
\bigcap_{i\in I}A_i=\{x\mid\forall i\in I, x\in A_i\}.
$$

$A_i=\{i,i+1,i+2,\ldots\}$라면 유한한 $n$에 대해 합집합은 $\mathbb Z^+$, 교집합은 $A_n$이다. 무한히 모두 교집합하면 공집합이 된다. 어떤 양의 정수 $k$도 $A_{k+1}$에는 들어 있지 않기 때문이다.

### 비트 문자열

$U=\{1,\ldots,10\}$의 순서를 고정하고 왼쪽부터 $i$번째 비트가 1이면 $i$를 원소로 넣는다. 여집합은 비트별 NOT, 합집합은 OR, 교집합은 AND, 대칭차는 XOR로 계산된다.

| 집합 | 비트 문자열 |
|---|---|
| 홀수 $\{1,3,5,7,9\}$ | `1010101010` |
| 짝수 $\{2,4,6,8,10\}$ | `0101010101` |
| $\{1,2,3,4,5\}$ | `1111100000` |
| $\{2,3,5,7\}$ | `0110101000` |
| $\{2,3,5,7\}$의 여집합 | `1001010111` |

$A=\{3,4,5\}$와 $B=\{1,3,6,10\}$을 계산하면

```text
A       0011100000
B       1010010001
A OR B  1011110001
A AND B 0010000000
```

따라서 합집합은 $\{1,3,4,5,6,10\}$, 교집합은 $\{3\}$이다. `1111001111`은 $\{1,2,3,4,7,8,9,10\}$을 나타낸다. `1100001111`과 `0101010101`의 OR는 `1101011111`, AND는 `0100000101`이다.

### 다중집합

다중집합은 원소별 중복도를 기록한다. $\{3\cdot a,2\cdot b\}$의 크기는 5다. 원소 $x$의 중복도를 $m_P(x)$라고 하면 연산은 다음과 같다.

$$
\begin{aligned}
m_{P\cup Q}(x)&=\max(m_P(x),m_Q(x)),\\
m_{P\cap Q}(x)&=\min(m_P(x),m_Q(x)),\\
m_{P\setminus Q}(x)&=\max(m_P(x)-m_Q(x),0),\\
m_{P+Q}(x)&=m_P(x)+m_Q(x).
\end{aligned}
$$

$P=\{4a,1b,3c\}$, $Q=\{3a,4b,2d\}$처럼 중복도를 줄여 쓰면

| 연산 | 결과 |
|---|---|
| $P\cup Q$ | $\{4a,4b,3c,2d\}$ |
| $P\cap Q$ | $\{3a,1b\}$ |
| $P\setminus Q$ | $\{1a,3c\}$ |
| $P+Q$ | $\{7a,5b,3c,2d\}$ |

합집합과 합의 중복도 계산이 다르다는 점에 주의한다.

## 8. 함수와 상

함수 $f:A\to B$는 $A$의 각 원소에 $B$의 원소를 **정확히 하나씩** 대응시킨다. 관계로 보면 모든 $a\in A$에 대해 $(a,b)$ 꼴의 쌍이 정확히 하나 존재하는 $A\times B$의 부분집합이다.

$A$는 정의역, $B$는 공역이다. 실제 출력의 집합 $f(A)$는 치역이며 공역의 부분집합이다. $f(a)=b$이면 $b$는 $a$의 상이고 $a$는 $b$의 원상이다. 원상은 없거나 여러 개일 수 있지만 입력 하나의 출력이 여러 개일 수는 없다.

$$
f:\{a,b,c,d\}\to\{x,y,z\},\quad
f(a)=z, f(b)=y, f(c)=f(d)=z
$$

이면 치역은 $\{y,z\}$이고, $z$의 원상들은 $\{a,c,d\}$다. 공역의 원소 $x$에는 원상이 없다. 부분집합 $S\subseteq A$의 상은

$$
f(S)=\{f(s)\mid s\in S\}
$$

이다. $f(b)=1,f(c)=4,f(d)=1$이면 $f(\{b,c,d\})=\{1,4\}$로 중복 출력을 한 번만 센다.

두 함수가 같으려면 정의역·공역이 같고 모든 입력에서 출력이 같아야 한다. 함수의 그래프도 순서쌍 집합 $\{(a,f(a))\mid a\in A\}$다.

같은 정의역에서 실숫값을 갖는 함수의 합과 곱은 입력별로 계산한다. $f_1(x)=x^2,f_2(x)=x-x^2$이면

$$
(f_1+f_2)(x)=x,\qquad(f_1f_2)(x)=x^3-x^4.
$$

## 9. 단사, 전사, 전단사

단사는 서로 다른 입력이 서로 다른 출력을 갖는다는 뜻이고, 전사는 공역의 모든 원소가 출력으로 나온다는 뜻이다.

$$
\begin{aligned}
f\text{가 단사}&\iff\forall a,b\in A\ (f(a)=f(b)\to a=b),\\
f\text{가 전사}&\iff\forall y\in B\ \exists x\in A\ (f(x)=y).
\end{aligned}
$$

둘 다 만족하면 전단사다. 단사가 아님을 보일 때는 출력이 같은 서로 다른 입력 둘을 찾는다. 전사가 아님을 보일 때는 원상이 없는 공역 원소 하나를 찾는다.

| 함수 | 단사 | 전사 | 근거 |
|---|---|---|---|
| $n\mapsto n+1$, $\mathbb Z\to\mathbb Z$ | O | O | $y$의 원상은 $y-1$ |
| $n\mapsto n+1$, $\mathbb Z^+\to\mathbb Z^+$ | O | X | 1의 원상이 없음 |
| $n\mapsto n^2$, $\mathbb Z\to\mathbb Z$ | X | X | $1,-1$의 출력이 같고 $-1$이 출력되지 않음 |
| $n\mapsto n^2$, $\mathbb Z^+\to\mathbb Z^+$ | O | X | 양수에서 순증가하지만 2의 원상이 없음 |
| $x\mapsto x^2$, $[0,\infty)\to[0,\infty)$ | O | O | 각 $y$의 원상은 $\sqrt y$ |

함수 $f:\{a,b,c,d\}\to\{1,2,3\}$가 $a,d$를 3, $b$를 2, $c$를 1로 보내면 전사이지만 단사는 아니다. 공역에 4를 추가하면 전사도 아니게 된다. 공식을 보고만 판단할 수 없는 이유다.

실수의 부분집합에서 $x<y$일 때 $f(x)\le f(y)$이면 비감소, $f(x)<f(y)$이면 순증가다. 부등호를 반대로 하면 비증가와 순감소다. 순증가·순감소 함수는 단사다. 서로 다른 두 입력은 대소관계가 있고, 순단조성에 의해 출력이 같을 수 없기 때문이다. $x^2$은 양의 실수에서는 순증가지만 실수 전체에서는 그렇지 않다.

항등함수 $\operatorname{id}_A(x)=x$는 전단사다. 유한집합 $A$에서 $f:A\to A$는 단사와 전사가 동치지만, 무한집합에서는 위의 $n\mapsto n+1$ 예처럼 다를 수 있다.

## 10. 역함수와 합성

전단사 $f:A\to B$의 역함수 $f^{-1}:B\to A$는

$$
f^{-1}(y)=x\iff f(x)=y
$$

로 정의한다. 단사가 아니면 원상이 여러 개라 출력이 하나로 정해지지 않고, 전사가 아니면 공역 전체에서 역함수를 정의할 수 없다. 치역으로 공역을 제한한 뒤 역함수를 생각하는 것과 처음 지정한 공역 전체에서 역함수를 갖는 것은 구별한다.

$g:A\to B$, $f:B\to C$일 때 $(f\circ g)(x)=f(g(x))$다. 오른쪽 함수부터 적용한다. $g(x)=2x+3$, $f(x)=3x+2$이면

$$
(f\circ g)(x)=6x+11,\qquad(g\circ f)(x)=6x+7.
$$

따라서 합성은 일반적으로 교환되지 않는다. $g$가 $a\mapsto b,b\mapsto c,c\mapsto a$이고 $f$가 $a\mapsto3,b\mapsto2,c\mapsto1$이면 $f\circ g$는 $a\mapsto2,b\mapsto1,c\mapsto3$이다. 반대 합성은 $f$의 출력이 $g$의 정의역에 없어서 정의되지 않는다.

역함수와 합성하면

$$
f^{-1}\circ f=\operatorname{id}_A,\qquad
f\circ f^{-1}=\operatorname{id}_B.
$$

예를 들어 $f(x)=ax+b$를 실수에서 실수로 가는 함수로 잡고 $a\ne0$이라고 하면 $y=ax+b$를 풀어

$$
f^{-1}(y)=\frac{y-b}{a}
$$

를 얻는다. 두 방향으로 합성하면 각각 원래 입력이 나온다.

<a id="practice"></a>

## 11. 연습문제

문제를 읽고 풀이를 적어 본 뒤 해설을 펼쳐 비교해 보자. 계산 결과뿐 아니라 사용한 정의와 추론 근거까지 설명하는 연습을 한다.

### 01. 집합의 표현과 공집합

1. 10보다 작은 양의 짝수 집합을 원소나열법으로, 양의 홀수 집합을 조건제시법으로 쓰자.
2. $\{a,b,c,b,a\}$와 $\{c,b,a\}$는 같은가?
3. $\varnothing$와 $\{\varnothing\}$는 같은가?
4. $A=\{1,2\},B=\{1,2,3\}$이면 $A\subseteq B$와 $A\subsetneq B$는 성립하는가?
5. 모든 집합 $S$에 대해 $\varnothing\subseteq S$인 이유는?

<details>
<summary>해설 보기</summary>

1. $\{2,4,6,8\}$, $\{x\in\mathbb Z^+\mid x<10\text{이고 }x\text{는 홀수}\}$다. 후자는 $\{1,3,5,7,9\}$와 같다.
2. 같다. 집합은 순서와 중복을 구별하지 않는다.
3. 다르다. 앞은 원소 0개, 뒤는 공집합을 원소로 갖는 원소 1개의 집합이다.
4. 모두 성립한다. 1과 2는 $B$에도 있고, 3은 $B$에만 있으므로 두 집합은 같지 않다.
5. $\forall x(x\in\varnothing\to x\in S)$의 전건이 항상 거짓이므로 참이다.

</details>

### 02. 원소와 부분집합 판별

여기서 $\subsetneq$는 진부분집합이다. 다음의 참·거짓과 이유를 쓰자.

1. $\varnothing\in\{0\}$.
2. $\varnothing\subsetneq\{0\}$.
3. $\{\varnothing\}\in\{\varnothing\}$.
4. $\{\{\varnothing\}\}\subsetneq\{\varnothing,\{\varnothing\}\}$.
5. $\{x\}\in\{\{x\}\}$.

<details>
<summary>해설 보기</summary>

1. F. 오른쪽의 원소는 수 0 하나다. 여기서는 수 0과 공집합을 구별하는 기초 집합 표기를 사용한다.
2. T. 공집합은 모든 집합의 부분집합이며 $\{0\}$와 다르다.
3. F. 오른쪽의 원소는 $\varnothing$이지 $\{\varnothing\}$가 아니다.
4. T. 왼쪽의 유일한 원소 $\{\varnothing\}$가 오른쪽에 있다. 오른쪽에는 $\varnothing$도 있으므로 두 집합은 다르다.
5. T. 오른쪽의 유일한 원소가 바로 $\{x\}$다. 중괄호 한 겹마다 집합의 층위가 바뀐다.

</details>

### 03. 멱집합과 집합의 크기

1. $A=\{x,y,z\}$의 멱집합을 나열하자.
2. $B=\{\varnothing,\{\varnothing\}\}$의 크기와 멱집합의 크기는?
3. $A=\{1,2,3,4,5\}$의 크기와 멱집합의 크기는?
4. $A\subseteq B,B\subseteq A$이면 $A=B$임을 설명하자.

<details>
<summary>해설 보기</summary>

1. 크기별로 나누면 공집합 $\varnothing$, 한 원소 집합 $\{x\},\{y\},\{z\}$, 두 원소 집합 $\{x,y\},\{x,z\},\{y,z\}$, 세 원소 집합 $\{x,y,z\}$다. 이 8개 집합을 원소로 모은 것이 $\mathcal P(A)$다.
2. $|B|=2$, $|\mathcal P(B)|=2^2=4$다. 두 원소는 $\varnothing$와 $\{\varnothing\}$로 서로 다르다.
3. $|A|=5$, $|\mathcal P(A)|=2^5=32$다. 각 원소마다 포함/제외 두 선택이 있다.
4. 임의의 $x$에 대해 $x\in A\to x\in B$와 $x\in B\to x\in A$가 모두 참이다. 따라서 두 집합은 정확히 같은 원소를 가지며 같다.

</details>

### 04. 곱집합과 곱의 법칙

1. $\{0,1\}\times\{a,b\}$를 나열하자.
2. $A=\{1,2\},B=\{a,b,c\}$이면 $|A\times B|$는?
3. 일반적으로 $|A|=m,|B|=n$인 유한집합에서 $|A\times B|$를 구하고 이유를 설명하자.

<details>
<summary>해설 보기</summary>

1. $\{(0,a),(0,b),(1,a),(1,b)\}$다. 첫 좌표는 앞 집합, 둘째는 뒤 집합에서 고른다.
2. $2\cdot3=6$이다.
3. $mn$이다. 첫 좌표 선택 $m$가지마다 둘째 좌표 선택이 $n$가지씩 있다. 순서쌍의 상등은 두 좌표가 모두 같은 경우이므로 서로 다른 선택은 서로 다른 원소를 준다.

</details>

### 05. 곱집합의 상등

$A,B,C$가 공집합이 아니고 $A\times B=A\times C$일 때 $B=C$임을 증명하자. $A\ne\varnothing$ 조건을 빼도 되는가?

<details>
<summary>해설 보기</summary>

$A\ne\varnothing$이므로 $a\in A$를 하나 고정한다.

임의의 $b\in B$에 대해 $(a,b)\in A\times B=A\times C$이므로 $b\in C$다. 따라서 $B\subseteq C$.

반대로 임의의 $c\in C$에 대해 $(a,c)\in A\times C=A\times B$이므로 $c\in B$다. 따라서 $C\subseteq B$. 두 포함 관계를 합하면 $B=C$다.

$A=\varnothing$이면 예를 들어 $B=\{1\},C=\{2\}$에서도 두 곱집합은 모두 공집합이다. 그러므로 $A$가 비어 있지 않다는 조건은 필요하다. 실제 증명에는 $B,C$가 비어 있지 않다는 조건까지는 필요하지 않다.

</details>

### 06. 진리집합 계산

정의역은 정수다. 다음 술어의 진리집합을 구하자.

1. $x^2<3$.
2. $x^2=1$.
3. $x^3\ge1$.
4. $x^2=2$.
5. $x<x^2$.

이를 이용해 $\exists x\in\mathbb Z(x^2=2)$도 판정하자.

<details>
<summary>해설 보기</summary>

1. $\{-1,0,1\}$. $-\sqrt3<x<\sqrt3$인 정수다.
2. $\{-1,1\}$.
3. $\{1,2,3,\ldots\}$. 세제곱은 증가하므로 $x\ge1$과 같다.
4. $\varnothing$. 실수해 $\pm\sqrt2$는 정수가 아니다.
5. $x(x-1)>0$이므로 $x<0$ 또는 $x>1$. 정수에서는 $\mathbb Z\setminus\{0,1\}$다.

마지막 존재 명제는 진리집합이 비어 있으므로 거짓이다.

</details>

### 07. 한정 명제를 문장으로 읽기

다음을 자연어로 옮기고 참·거짓을 근거와 함께 판정하자.

1. $\forall x\in\mathbb R(x^2\ne-1)$.
2. $\exists x\in\mathbb Z(x^2=2)$.
3. $\forall x\in\mathbb Z(x^2>0)$.
4. $\exists x\in\mathbb R(x^3=-1)$.

<details>
<summary>해설 보기</summary>

1. “모든 실수의 제곱은 -1과 다르다.” 참이다. 제곱은 0 이상이다.
2. “제곱이 2인 정수가 존재한다.” 거짓이다. $|x|\le1$이면 제곱이 1 이하, $|x|\ge2$이면 4 이상이라 2가 될 수 없다.
3. “모든 정수의 제곱은 양수다.” 거짓이며 0이 반례다.
4. “세제곱이 -1인 실수가 존재한다.” 참이며 $x=-1$이 증인이다.

</details>

### 08. 합집합·교집합·여집합

1. $\{1,2,3\}$과 $\{3,4,5\}$의 합집합과 교집합을 구하자.
2. $\{1,2,3\}$과 $\{4,5,6\}$의 관계를 무엇이라고 하는가?
3. $U=\{1,\ldots,10\}$에서 $A=\{2,4,6,8,10\}$의 여집합은?
4. $A=\{1,2,3\},B=\{2,3,4\}$일 때 $A\cup B,A\cap B,A\setminus B,|\mathcal P(A)|$를 구하자.

<details>
<summary>해설 보기</summary>

1. 합집합은 $\{1,2,3,4,5\}$, 교집합은 $\{3\}$이다. 합집합에서도 중복 원소 3을 한 번만 쓴다.
2. 교집합이 공집합이므로 서로소다.
3. 전체집합에서 짝수를 제외한 $\{1,3,5,7,9\}$다.
4. 차례로 $\{1,2,3,4\}$, $\{2,3\}$, $\{1\}$, $2^3=8$이다.

</details>

### 09. 차집합과 대칭차

1. $U=\{0,\ldots,10\}$, $A=\{1,2,3,4,5\}$, $B=\{4,5,6,7,8\}$의 합집합·교집합·각 여집합·양방향 차집합·대칭차를 구하자.
2. 일반적인 집합에서 $A\mathbin\triangle B=(A\cup B)\setminus(A\cap B)$임을 증명하자.

<details>
<summary>해설 보기</summary>

1. 정의에 따라 양쪽/한쪽 소속 여부를 나누어 센다.

| 연산 | 결과 |
|---|---|
| $A\cup B$ | $\{1,2,3,4,5,6,7,8\}$ |
| $A\cap B$ | $\{4,5\}$ |
| $A^c$ | $\{0,6,7,8,9,10\}$ |
| $B^c$ | $\{0,1,2,3,9,10\}$ |
| $A\setminus B$ | $\{1,2,3\}$ |
| $B\setminus A$ | $\{6,7,8\}$ |
| $A\mathbin\triangle B$ | $\{1,2,3,6,7,8\}$ |

2. $x$가 오른쪽에 속한다는 것은 $x\in A\lor x\in B$이면서 $x\notin A\cap B$라는 뜻이다. 즉 적어도 한쪽에 속하지만 양쪽 모두에는 속하지 않는다. 이는 정확히 한쪽에만 속한다는 대칭차의 정의다. 역방향도 같은 조건이므로 모든 원소의 소속 여부가 일치한다.

</details>

### 10. 합집합의 여집합: 세 가지 증명

전체집합 $U$의 부분집합 $A,B$에 대해 $(A\cup B)^c=A^c\cap B^c$를 다음 방법으로 보이자.

1. 양쪽이 서로의 부분집합임을 보이기.
2. 소속표로 확인하기.
3. 조건제시법과 논리적 동치로 쓰기.

<details>
<summary>해설 보기</summary>

**1. 서로 포함됨을 보인다.**

$x\in(A\cup B)^c$라고 하자. $x\in U$이며 $A\cup B$에는 속하지 않는다. 따라서 $x\notin A$이고 $x\notin B$이므로 $x\in A^c\cap B^c$다. 이로써 $(A\cup B)^c\subseteq A^c\cap B^c$다.

반대로 $x\in A^c\cap B^c$라면 $x\in U$이면서 $x\notin A,x\notin B$다. 따라서 $A\cup B$에 속하지 않아 $x\in(A\cup B)^c$다. 이로써 $A^c\cap B^c\subseteq(A\cup B)^c$다. 두 포함 관계에서 상등이 나온다.

**2. 1은 소속, 0은 비소속으로 놓는다.**

| $A$ | $B$ | $A\cup B$ | $(A\cup B)^c$ | $A^c$ | $B^c$ | $A^c\cap B^c$ |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 0 | 0 | 0 | 1 | 1 | 1 | 1 |

왼쪽과 오른쪽을 나타내는 두 열이 네 경우 모두 같다.

**3. 조건제시법으로 쓴다.**

$$
\begin{aligned}
(A\cup B)^c
&=\{x\in U\mid\neg(x\in A\lor x\in B)\}\\
&=\{x\in U\mid x\notin A\land x\notin B\}\\
&=A^c\cap B^c.
\end{aligned}
$$

여집합을 취하는 전체집합은 모든 줄에서 같은 $U$다.

</details>

### 11. 교집합의 여집합과 분배법칙

1. $(A\cap B)^c=A^c\cup B^c$를 원소 논증으로 보이자.
2. $A\cap(B\cup B^c)=A$를 소속표로 보이자.
3. 세 집합의 소속표에는 몇 행이 필요한가?
4. $U=\{1,2,3,4\},A=\{1,2\},B=\{2,3\},C=\{1,4\}$에서 $A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$를 계산으로 확인하자.

<details>
<summary>해설 보기</summary>

1. 모든 $x\in U$에 대해

$$
x\in(A\cap B)^c\iff\neg(x\in A\land x\in B)
\iff x\notin A\lor x\notin B\iff x\in A^c\cup B^c.
$$

따라서 같은 원소를 갖는다.

2. 표는 다음과 같다.

| $A$ | $B$ | $B^c$ | $B\cup B^c$ | $A\cap(B\cup B^c)$ |
|---|---|---|---|---|
| 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 0 | 1 | 1 | 0 |

마지막 열이 첫 열과 같다.

3. 각 집합에 소속/비소속 2가지씩이므로 $2^3=8$행이다.
4. $B\cup C=\{1,2,3,4\}$이므로 왼쪽은 $\{1,2\}$. 오른쪽은 $\{2\}\cup\{1\}=\{1,2\}$다. 이 계산은 주어진 집합에 대한 확인이며, 일반 항등식의 증명은 원소 논증이나 8행 소속표로 할 수 있다.

</details>

### 12. 집합을 비트로 표현하기

$U=\{1,\ldots,10\}$이며 왼쪽부터 $i$번째 비트가 원소 $i$의 소속을 나타낸다.

1. $\{2,3,5,7\}$과 그 여집합을 비트로 쓰자.
2. `11 0000 1111`과 `01 0101 0101`의 합집합·교집합을 비트로 쓰자.
3. $A=\{3,4,5\},B=\{1,3,6,10\}$를 비트로 쓰고 합집합·교집합을 비트 연산 및 집합으로 구하자.
4. `11 1100 1111`은 어떤 집합인가?

<details>
<summary>해설 보기</summary>

1. $A$는 `01 1010 1000`, 여집합은 비트를 뒤집은 `10 0101 0111`이다.
2. 합집합은 OR하여 `11 0101 1111`, 교집합은 AND하여 `01 0000 0101`이다.
3. 각 원소 위치를 1로 표시한 뒤 자리별로 계산한다.

```text
A       0011100000
B       1010010001
A OR B  1011110001
A AND B 0010000000
```

합집합은 $\{1,3,4,5,6,10\}$, 교집합은 $\{3\}$이다.
4. 1인 위치를 읽으면 $\{1,2,3,4,7,8,9,10\}$이다. 문자열을 이진수의 자리값으로 해석하는 문제가 아니다.

</details>

### 13. 공역·치역·원상

1. 함수의 공역과 치역은 어떻게 다른가?
2. $f:\{a,b,c,d\}\to\{y,z\}$가 $f(a)=y,f(b)=f(c)=f(d)=z$로 주어졌다. $z$의 원상을 모두 구하자.
3. $f:\{a,b,c,d\}\to\{1,2,3\}$가 $f(a)=3,f(b)=2,f(c)=1,f(d)=3$으로 주어졌다. 단사·전사를 판정하자.

<details>
<summary>해설 보기</summary>

1. 공역은 출력이 속하도록 정한 집합, 치역은 실제 출력들의 집합이다. 치역은 공역의 부분집합이지만 항상 같지는 않다.
2. $\{b,c,d\}$다. 출력이 $z$가 되는 입력을 전부 고른다.
3. $a\ne d$인데 $f(a)=f(d)=3$이므로 단사가 아니다. 공역의 1, 2, 3은 각각 $c,b,a$의 상이므로 전사다.

</details>

### 14. 정의역을 바꾸면 함수의 성질도 바뀐다

1. $f(x)=x+1$을 $\mathbb Z\to\mathbb Z$와 $\mathbb Z^+\to\mathbb Z^+$에서 각각 단사·전사 판정하자.
2. $f(x)=x^2:\mathbb Z\to\mathbb Z$가 전사가 아님을 보이자.
3. $f(x)=x+1:\mathbb Z\to\mathbb Z$의 역함수를 구하자.
4. $f(x)=x^2:\mathbb R\to\mathbb R$가 역함수를 갖지 않는 이유는?

<details>
<summary>해설 보기</summary>

1. 두 정의역에서 모두 $f(a)=f(b)$이면 $a+1=b+1$, 따라서 $a=b$이므로 단사다. 정수 전체에서는 각 $y$에 $x=y-1\in\mathbb Z$가 있어 전사다. 양의 정수에서는 공역의 1을 만드는 입력 0이 정의역에 없으므로 전사가 아니다.
2. $-1$은 정수의 제곱이 아니므로 공역의 모든 값을 만들지 못한다.
3. $f^{-1}(y)=y-1$이다. $f(f^{-1}(y))=y$와 $f^{-1}(f(x))=x$를 모두 만족한다.
4. $f(1)=f(-1)$이라 단사가 아니며 음수는 출력되지 않아 전사도 아니다. 역함수를 얻으려면 정의역·공역을 알맞게 제한해야 한다.

</details>

### 15. 합성과 역함수의 조건

1. $f\circ g$를 정의할 수 있으려면 어떤 조건이 필요한가?
2. 전단사와 역함수의 존재가 동치인 이유를 설명하자.
3. $f(x)=x+5:\mathbb Z\to\mathbb Z$가 전단사임을 보이고 역함수를 구하자.
4. $a\ne0$인 실수 $a,b$에 대해 $f(x)=ax+b:\mathbb R\to\mathbb R$가 가역임을 보이고 역함수를 구하자.

<details>
<summary>해설 보기</summary>

1. $g$의 모든 출력이 $f$의 정의역에 들어가야 한다. $g:A\to B,f:B\to C$라면 자동으로 만족한다. 더 일반적으로 $g(A)\subseteq\operatorname{dom}(f)$면 충분하다.
2. 단사이면 각 출력의 원상이 많아야 하나, 전사이면 공역의 각 값의 원상이 적어도 하나다. 둘을 합하면 정확히 하나여서 역함수가 정의된다. 역함수가 존재한다면 두 입력이 같은 출력으로 갈 수 없고 공역에 원상 없는 값도 있을 수 없다.
3. $x+5=y+5$이면 $x=y$여서 단사다. 임의의 정수 $y$의 원상 $y-5$가 있으므로 전사다. 따라서 $f^{-1}(y)=y-5$다.
4. $f(x_1)=f(x_2)$이면 $a(x_1-x_2)=0$이고 $a\ne0$이므로 $x_1=x_2$. 모든 실수 $y$에는 $x=(y-b)/a$가 있으므로 전사다. 따라서

$$
f^{-1}(y)=\frac{y-b}{a}.
$$

$f(f^{-1}(y))=a(y-b)/a+b=y$, $f^{-1}(f(x))=(ax+b-b)/a=x$로 확인된다.

</details>
