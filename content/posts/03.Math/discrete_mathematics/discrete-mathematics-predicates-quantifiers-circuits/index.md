---
title: "02. 술어 논리, 한정 기호, 논리회로"
slug: discrete-mathematics-predicates-quantifiers-circuits
publishedAt: '2026-10-15'
categories: discrete_mathematics
math: true

---

명제 논리만으로는 “모든 사람은 죽는다”와 “소크라테스는 사람이다” 사이의 관계를 표현하기 어렵다. 문장 전체에 참과 거짓을 붙이는 데서 더 나아가, 대상의 성질과 대상 사이의 관계를 나타내는 술어가 필요하다. 여기에 “모든”과 “적어도 하나”를 나타내는 한정 기호를 붙이면 수학적 주장과 시스템의 조건을 정확하게 쓸 수 있다.

## 1. 술어와 명제함수

$P(x)$를 “$x>3$”이라고 하자. 변수 $x$의 값이 정해지지 않은 상태에서는 참과 거짓을 결정할 수 없다. 정의역을 정수로 정하고 값을 대입하면 $P(-3)$과 $P(0)$은 거짓, $P(5)$는 참인 명제가 된다. 이렇게 변수를 포함한 문장을 **명제함수**라고 한다.

변수가 여러 개일 수도 있다. $R(x,y,z)$가 $x+y=z$라면

$$
R(2,-1,5)=\mathrm F,\qquad R(3,4,7)=\mathrm T.
$$

컴퓨터가 공격받고 있는지 나타내는 $A(c)$는 한 대상의 성질이고, 컴퓨터가 통신망에 연결되어 있는지 나타내는 $N(c,n)$은 두 대상의 관계다. CS2와 MATH1만 공격받고 있다면 $A(\mathrm{CS1}),A(\mathrm{CS2}),A(\mathrm{MATH1})$은 차례로 F, T, T다. MATH1이 CAMPUS2에만 연결되어 있다면 $N(\mathrm{MATH1},\mathrm{CAMPUS1})$은 F, $N(\mathrm{MATH1},\mathrm{CAMPUS2})$는 T다.

명제 논리의 연결사는 그대로 사용할 수 있다. $P(x)$가 $x\ge0$이면 $P(3)$은 참이고 $P(-1)$은 거짓이므로

$$
P(3)\lor P(-1)=\mathrm T,\quad
P(3)\land P(-1)=\mathrm F,\quad
P(3)\to P(-1)=\mathrm F.
$$

다만 $P(3)\land P(y)$처럼 자유변수가 남은 식은 변수의 값이나 한정 범위가 정해져야 진리값을 판단할 수 있다.

### 프로그램의 전조건과 후조건

술어는 프로그램이 올바르게 실행되는지도 표현한다. 전조건은 실행 전에 만족해야 하는 조건, 후조건은 실행 후에 보장해야 하는 조건이다.

```text
temp := x
x := y
y := temp
```

위 교환 프로그램의 전조건을 $x=a\land y=b$, 후조건을 $x=b\land y=a$로 잡으면 각 단계의 상태는 다음과 같다.

| 시점 | $x$ | $y$ | $\mathrm{temp}$ |
|---|---|---|---|
| 실행 전 | $a$ | $b$ | 미정 |
| 첫 대입 후 | $a$ | $b$ | $a$ |
| 둘째 대입 후 | $b$ | $b$ | $a$ |
| 셋째 대입 후 | $b$ | $a$ | $a$ |

임의의 입력 $a,b$에 대해 후조건이 성립하므로 교환이 올바르게 이루어진다. `if x > 0 then x := x + 1`에서도 $x>0$이라는 술어의 진리값이 대입문의 실행 여부를 결정한다.

## 2. 전칭 한정과 존재 한정

$$
\forall x\,P(x):\text{ 모든 }x\text{에 대해 }P(x),
\qquad
\exists x\,P(x):\text{ 적어도 하나의 }x\text{에 대해 }P(x).
$$

전칭 명제를 거짓으로 만들려면 **반례 하나**면 충분하다. 존재 명제를 참으로 만들려면 조건을 만족하는 **증인 하나**면 충분하다. 반대로 전칭 명제를 증명하거나 존재 명제를 반박하려면 정의역 전체를 다루어야 한다.

| 정의역과 술어 | 전칭 명제 | 존재 명제 |
|---|---|---|
| $\mathbb Z$, $x\ge0$ | F: $x=-1$ | T: $x=0$ |
| 양의 정수, $x\ge0$ | T | T: $x=1$ |
| 음의 정수, $x\ge0$ | F | F |
| $\mathbb Z$, $x$는 짝수 | F: $x=1$ | T: $x=2$ |
| $\mathbb R$, $x+1>x$ | T | T |
| $\mathbb Z$, $x^2>0$ | F: $x=0$ | T: $x=1$ |
| $\mathbb R$, $x=x+1$ | F | F |

같은 식도 정의역에 따라 달라진다. $\forall x(x^2\ge x)$는 실수에서는 $x=1/2$ 때문에 거짓이지만, 정수에서는 참이다. $x(x-1)<0$이 되는 구간 $(0,1)$ 안에 정수가 없기 때문이다. $x<2$도 양의 정수 전체에서는 전칭 명제가 거짓이고 존재 명제가 참이지만, 음의 정수 전체에서는 둘 다 참이다.

정의역이 $U=\{1,2,3,4\}$라면 $\forall x(x^2<10)$은 $x=4$ 때문에 거짓이고, $\exists x(x^2>10)$은 같은 값 때문에 참이다. $U=\{3,4,5\}$에서는 $x>2$의 전칭·존재 명제가 모두 참이고, $x>5$의 전칭·존재 명제는 모두 거짓이다.

### 유한 정의역과 공집합

$U=\{a_1,\ldots,a_n\}$일 때

$$
\forall x\in U\,P(x)\equiv\bigwedge_{i=1}^{n}P(a_i),\qquad
\exists x\in U\,P(x)\equiv\bigvee_{i=1}^{n}P(a_i).
$$

전칭 한정은 하나라도 거짓이면 중단하는 반복문, 존재 한정은 하나라도 참이면 중단하는 반복문처럼 이해할 수 있다. 무한 정의역에서는 이 생각이 의미를 이해하는 데는 도움이 되지만, 실제로 모든 원소를 순회하는 판정 알고리즘이 되지는 않는다.

공집합에서는 반례가 없으므로 전칭 명제가 참이고, 증인이 없으므로 존재 명제가 거짓이다. 일반적인 술어 논리에서는 정의역이 비어 있지 않다고 가정하지만, 집합에 제한된 한정을 다룰 때는 이 경우를 구별해야 한다.

### 유일하게 존재한다는 말

$\exists!x\,P(x)$는 조건을 만족하는 원소가 정확히 하나라는 뜻이다.

$$
\exists!x\,P(x)
\equiv
\exists x\bigl(P(x)\land\forall y(P(y)\to y=x)\bigr).
$$

정수에서 $x+1=0$의 해는 $-1$ 하나이므로 유일하게 존재한다. $x\ge0$을 만족하는 정수는 여러 개이므로 존재하지만 유일하지는 않다.

## 3. 변수의 범위와 문장 번역

한정 기호가 묶는 변수를 **구속변수**, 묶이지 않은 변수를 **자유변수**라고 한다. $\exists x(x+y=1)$에서 $x$는 구속변수이고 $y$는 자유변수다. 한정 기호가 적용되는 식의 부분이 범위(scope)다.

괄호를 생략하면 범위를 오해하기 쉽다. 여기서는 $\forall xP(x)\lor Q(x)$를 $(\forall xP(x))\lor Q(x)$로 읽는다. $Q$까지 한정하려면 $\forall x(P(x)\lor Q(x))$라고 써야 한다. 구속변수의 이름은 자유변수를 새로 묶지 않는 범위에서 바꿀 수 있다. 예를 들어

$$
\exists x(P(x)\land Q(x))\lor\forall xR(x)
\equiv
\exists x(P(x)\land Q(x))\lor\forall yR(y).
$$

### “모든 A는 B”와 “어떤 A는 B”

정의역을 모든 사람으로 놓고 $S(x)$를 “이 반의 학생”, $J(x)$를 “자바를 배웠다”라고 하자.

$$
\begin{aligned}
\text{모든 학생이 자바를 배웠다}&:\ \forall x(S(x)\to J(x)),\\
\text{어떤 학생이 자바를 배웠다}&:\ \exists x(S(x)\land J(x)).
\end{aligned}
$$

전칭 문장에 $\land$를 쓰면 모든 사람이 이 반 학생이라고 주장하게 된다. 존재 문장에 $\to$를 쓰면 학생이 아닌 사람 하나만 있어도 참이 되어, 자바를 배운 학생의 존재를 보장하지 못한다. 정의역 자체가 이 반 학생들로 제한되어 있다면 각각 $\forall xJ(x)$와 $\exists xJ(x)$로 충분하다.

같은 방식으로 여러 문장을 옮길 수 있다.

| 문장 | 식 |
|---|---|
| 어떤 학생이 멕시코를 방문했다 | $\exists x(S(x)\land M(x))$ |
| 모든 학생이 캐나다 또는 멕시코를 방문했다 | $\forall x(S(x)\to(C(x)\lor M(x)))$ |
| 어떤 학생은 캐나다를 방문하지 않았다 | $\exists x(S(x)\land\neg C(x))$ |
| 어떤 $S$도 $T$가 아니다 | $\neg\exists x(S(x)\land T(x))$ |
| $F$이면서 $S$인 것은 모두 $T$이다 | $\forall x((F(x)\land S(x))\to T(x))$ |

메일의 크기를 $\operatorname{size}(m)$, 압축 여부를 $C(m)$으로 쓰면 “1MB보다 큰 모든 메일은 압축된다”는

$$
\forall m\bigl(\operatorname{size}(m)>1\to C(m)\bigr)
$$

이다. 활성 사용자가 하나라도 있으면 사용 가능한 링크가 있어야 한다는 명세는

$$
\bigl(\exists u\,A(u)\bigr)\to\bigl(\exists n\,\operatorname{Available}(n)\bigr)
$$

으로 쓴다. “각 사용자에게 자기 링크가 있다”는 문장이라면 사용자와 링크의 관계까지 별도로 표현해야 한다.

## 4. 한정 기호의 부정과 동치

핵심은 **부정이 한정 기호를 통과하면 종류가 바뀐다**는 것이다.

$$
\neg\forall xP(x)\equiv\exists x\neg P(x),\qquad
\neg\exists xP(x)\equiv\forall x\neg P(x).
$$

“모두 자바를 배웠다”의 부정은 “아무도 배우지 않았다”가 아니라 “배우지 않은 사람이 있다”다. “정직한 정치인이 있다”의 부정은 정치인을 정의역으로 삼을 때 $\forall x\neg H(x)$다. 정의역이 모든 사람이라면 $\neg\exists x(\operatorname{Politician}(x)\land H(x))$처럼 대상 조건도 함께 남겨야 한다.

복합식은 한정 기호의 드모르간 법칙과 명제 논리의 드모르간 법칙을 연달아 적용한다.

$$
\begin{aligned}
\neg\exists x(P(x)\land Q(x))
&\equiv\forall x\neg(P(x)\land Q(x))\\
&\equiv\forall x(\neg P(x)\lor\neg Q(x)),\\[4pt]
\neg\forall x(P(x)\to Q(x))
&\equiv\exists x\neg(\neg P(x)\lor Q(x))\\
&\equiv\exists x(P(x)\land\neg Q(x)).
\end{aligned}
$$

두 번째 식은 “모든 $P$가 $Q$인 것은 아니다”를 반박하려면 $P$이면서 $Q$가 아닌 원소를 찾으면 된다는 뜻이다.

### 분배되는 경우와 그렇지 않은 경우

다음 동치들은 항상 성립한다.

$$
\begin{aligned}
\forall x(P(x)\land Q(x))&\equiv(\forall xP(x))\land(\forall xQ(x)),\\
\exists x(P(x)\lor Q(x))&\equiv(\exists xP(x))\lor(\exists xQ(x)).
\end{aligned}
$$

첫 식은 모든 원소에서 두 성질이 동시에 참이라는 말이므로 각 성질을 따로 전칭 한정해도 같다. 둘째 식은 어느 원소에서 둘 중 하나가 참이라는 말이므로 두 존재 주장 중 하나가 참인 것과 같다.

하지만 $\forall$를 $\lor$에, $\exists$를 $\land$에 마음대로 분배할 수는 없다. $U=\{1,2\}$, $P(x):x=1$, $Q(x):x=2$라고 하면 모든 원소가 $P$ 또는 $Q$이지만 모두가 $P$인 것도 모두가 $Q$인 것도 아니다. 또한 $P$의 증인과 $Q$의 증인은 각각 존재하지만 두 성질을 동시에 만족하는 증인은 없다.

조건문에서도

$$
\forall x(P(x)\to Q(x))
\not\equiv
(\forall xP(x))\to(\forall xQ(x)).
$$

$U=\{1,2\}$에서 $P(1)=\mathrm T$, $P(2)=\mathrm F$, $Q(1)=Q(2)=\mathrm F$로 두면 왼쪽은 $x=1$ 때문에 거짓이다. 오른쪽은 전건 $\forall xP(x)$가 거짓이라 참이다.

모든 해석에서 참인 식을 타당하다고 하고, 적어도 하나의 해석에서 참이면 만족가능하다고 한다. 비어 있지 않은 정의역에서 $\forall x(P(x)\land\neg P(x))$는 만족불가능하다. 특정 해석에서 참이라는 것과 논리적으로 타당하다는 것은 구별해야 한다.

## 5. 중첩된 한정 기호와 순서

$\forall x\exists y(x+y=0)$는 실수 $x$를 먼저 고른 뒤 그 값에 맞춰 $y=-x$를 고를 수 있다는 뜻이다. 반대로 $\exists y\forall x(x+y=0)$는 하나의 $y$를 먼저 고르고 모든 $x$에 공통으로 사용해야 하므로 거짓이다.

| 식 | 뜻 | 거짓임을 보이는 방법 |
|---|---|---|
| $\forall x\forall yP(x,y)$ | 모든 쌍에서 성립 | 실패하는 쌍 하나 |
| $\forall x\exists yP(x,y)$ | 각 $x$마다 적절한 $y$가 있음 | 어떤 $x$에서는 모든 $y$가 실패 |
| $\exists x\forall yP(x,y)$ | 모든 $y$에 통하는 $x$가 있음 | 각 $x$마다 실패하는 $y$가 있음 |
| $\exists x\exists yP(x,y)$ | 성립하는 쌍이 있음 | 모든 쌍에서 실패 |

같은 종류끼리는 순서를 바꿔도 된다.

$$
\forall x\forall yP(x,y)\equiv\forall y\forall xP(x,y),\qquad
\exists x\exists yP(x,y)\equiv\exists y\exists xP(x,y).
$$

서로 다른 종류라고 해서 반드시 진리값이 달라지는 것은 아니다. 실수에서 $xy=0$은 $\forall x\exists y(xy=0)$도 참이고 $\exists x\forall y(xy=0)$도 참이다. 각각 $y=0$과 $x=0$을 선택하면 된다. 중요한 것은 순서를 바꾼 식이 **일반적으로 동치가 아니라는 점**이다.

### 계산으로 확인하는 예제

| 실수에서의 명제 | 판단과 이유 |
|---|---|
| $\forall x\exists y(y>x)$ | T: $y=x+1$ |
| $\forall x\exists y(x+y=1)$ | T: $y=1-x$ |
| $\exists x\forall y(xy=0)$ | T: $x=0$ |
| $\forall x\exists y(x=y^2)$ | F: $x=-1$은 실수의 제곱이 될 수 없음 |
| $\forall x\exists y\ne0(x/y=1)$ | F: $x=0$이면 모든 허용된 $y$에서 몫이 0 |

마지막처럼 나눗셈이 있으면 분모가 0이 아닌 조건도 명시해야 한다.

정수에 관한 주장도 변수마다 한정한다.

$$
\forall x\forall y\bigl((x>0\land y>0)\to x+y>0\bigr),
$$

$$
\forall x\forall y\bigl(\operatorname{Odd}(xy)\to
(\operatorname{Odd}(x)\land\operatorname{Odd}(y))\bigr).
$$

### 사람 사이의 관계를 표현하기

$L(x,y)$를 “$x$가 $y$를 사랑한다”로 놓으면 다음 문장들은 서로 다르다.

| 문장 | 논리식 |
|---|---|
| 누구나 사랑하는 사람이 있다 | $\forall x\exists yL(x,y)$ |
| 모두에게 사랑받는 사람이 있다 | $\exists y\forall xL(x,y)$ |
| 누군가는 누군가를 사랑한다 | $\exists x\exists yL(x,y)$ |
| 누구나 자신을 사랑한다 | $\forall xL(x,x)$ |
| 아무도 모두를 사랑하지는 않는다 | $\neg\exists x\forall yL(x,y)\equiv\forall x\exists y\neg L(x,y)$ |
| 모두가 자신을 사랑하는 것은 아니다 | $\exists x\neg L(x,x)$ |

$C(x)$를 “컴퓨터가 있다”, $F(x,y)$를 “친구다”라고 하면

$$
\forall x\bigl(C(x)\lor\exists y(C(y)\land F(x,y))\bigr)
$$

는 모든 학생이 컴퓨터를 갖고 있거나 컴퓨터를 가진 친구가 있다는 뜻이다. 또

$$
\exists x\forall y\forall z
\bigl((F(x,y)\land F(x,z)\land y\ne z)\to\neg F(y,z)\bigr)
$$

는 친구들 사이에 서로 친구인 쌍이 없는 학생이 있다는 뜻이다. 이 식 자체는 그 학생에게 친구가 두 명 이상 있다는 조건까지 보장하지 않는다. 친구가 없거나 한 명이어도 조건문이 참일 수 있다.

형제자매 관계 $S$의 대칭성은 $\forall x\forall y(S(x,y)\to S(y,x))$다. 관계의 방향과 한정 기호의 순서를 따로 확인해야 번역을 잘못하지 않는다.

## 6. 중첩된 한정 기호의 부정

한정 기호를 바깥에서부터 하나씩 뒤집는다.

$$
\neg\forall x\exists yP(x,y)
\equiv\exists x\forall y\neg P(x,y),
$$

$$
\neg\exists x\forall yP(x,y)
\equiv\forall x\exists y\neg P(x,y).
$$

“모든 항공사의 항공편을 적어도 한 번씩 탄 여성이 있다”를 써 보자. $P(w,f)$는 여성 $w$가 항공편 $f$를 탔다는 뜻이고, $Q(f,a)$는 항공편 $f$가 항공사 $a$ 소속이라는 뜻이다.

$$
\exists w\forall a\exists f\bigl(P(w,f)\land Q(f,a)\bigr).
$$

그 부정은

$$
\begin{aligned}
&\neg\exists w\forall a\exists f(P(w,f)\land Q(f,a))\\
&\equiv\forall w\exists a\forall f\neg(P(w,f)\land Q(f,a))\\
&\equiv\forall w\exists a\forall f(\neg P(w,f)\lor\neg Q(f,a)).
\end{aligned}
$$

즉 여성마다 한 번도 이용하지 않은 항공사가 적어도 하나 있다는 뜻이다. $a$는 $w$에 따라 달라질 수 있다.

### 극한 정의에서 순서가 중요한 이유

실수 함수의 극한 $\lim_{x\to a}f(x)=L$은

$$
\begin{gathered}
\forall\varepsilon>0\ \exists\delta>0\ \forall x\in\operatorname{dom}(f),\\
0<|x-a|<\delta\ \to\ |f(x)-L|<\varepsilon
\end{gathered}
$$

로 표현한다. 허용 오차 $\varepsilon$이 주어지면 그에 맞는 $\delta$를 선택한다. 그 뒤에는 조건을 만족하는 모든 $x$에 대해 오차가 작아야 한다. $\delta$가 $\varepsilon$에 의존할 수 있다는 사실이 순서에 들어 있다.

정해진 $L$이 극한값이 아니라는 것은

$$
\begin{gathered}
\exists\varepsilon>0\ \forall\delta>0\ \exists x\in\operatorname{dom}(f),\\
0<|x-a|<\delta\ \land\ |f(x)-L|\ge\varepsilon
\end{gathered}
$$

이다. 유한한 실수 극한값이 아예 없다는 주장은 이 식 앞에 $\forall L\in\mathbb R$을 붙인다. 여기서는 $a$가 함수 정의역의 집적점이라고 가정한다.

## 7. 술어로 추론하기

$P(x)$가 사자, $Q(x)$가 사납다, $R(x)$가 커피를 마신다는 뜻이라고 하자.

$$
\forall x(P(x)\to Q(x)),\qquad
\exists x(P(x)\land\neg R(x)).
$$

두 번째 전제의 사자 하나를 $a$라고 하면 $P(a)$와 $\neg R(a)$가 참이다. 첫 전제를 $a$에 적용하면 $Q(a)$도 참이다. 따라서

$$
\exists x(Q(x)\land\neg R(x))
$$

를 얻는다. 서로 다른 전제에서 같은 대상을 일관되게 추적하는 것이 중요하다.

새를 정의역으로 놓고 $H$: 벌새, $B$: 크다, $N$: 꿀을 먹고 산다, $C$: 색이 선명하다고 하자.

$$
\forall x(H(x)\to C(x)),\quad
\neg\exists x(B(x)\land N(x)),\quad
\forall x(\neg N(x)\to\neg C(x)).
$$

벌새 $a$를 잡으면 첫 전제로 $C(a)$이고, 셋째 전제의 대우로 $N(a)$다. 둘째 전제에 따라 $\neg B(a)$이므로 $\forall x(H(x)\to\neg B(x))$가 따라온다. “크지 않다”를 “작다”로 바꾸려면 두 표현이 서로 반대라는 분류 가정도 필요하다.

## 8. 논리회로를 식으로 읽기

논리회로에서는 AND가 $\land$, OR가 $\lor$, NOT이 $\neg$에 대응한다. 입력에서 출력 방향으로 각 게이트의 결과에 이름을 붙이고 다음 게이트의 입력으로 연결하면 전체 회로를 논리식으로 기술할 수 있다.

### 두 입력을 각각 부정한 뒤 OR

연결 순서는 `p → NOT → u`, `q → NOT → v`, `(u, v) → OR → 출력`이다.

$$
u=\neg p,\quad v=\neg q,\quad
Y=u\lor v=\neg p\lor\neg q=\neg(p\land q).
$$

따라서 NAND 하나와 같은 출력이다.

### 분기된 입력과 마지막 NOT

$p$를 그대로 OR에 보내는 가지와, $p$를 부정한 뒤 $q$와 AND하는 가지를 만든다. 두 가지의 OR 결과를 마지막에 부정한다.

$$
\begin{aligned}
u&=\neg p,\quad v=u\land q,\quad w=p\lor v,\\
Y&=\neg w=\neg\bigl(p\lor(\neg p\land q)\bigr)\\
&=\neg\bigl((p\lor\neg p)\land(p\lor q)\bigr)
=\neg(p\lor q).
\end{aligned}
$$

이 회로는 NOR 하나로 줄일 수 있다.

### 세 입력 회로 두 가지

첫 회로는 $r$을 부정해 $q$와 OR하고, 그 결과를 $p$와 AND한 뒤 전체를 부정한다.

$$
u=\neg r,\quad v=q\lor u,\quad w=p\land v,\quad
Y=\neg w=\neg p\lor(\neg q\land r).
$$

둘째 회로는 $p,q$를 각각 부정한 뒤 AND하는 가지와, $p,r$를 AND하는 가지를 마지막 OR로 합친다.

$$
u=\neg p\land\neg q,\quad v=p\land r,\quad Y=u\lor v.
$$

따라서 $Y=(\neg p\land\neg q)\lor(p\land r)$다. 이 식은 $p=0$일 때 $\neg q$, $p=1$일 때 $r$을 출력한다. 게이트의 모양을 외우기보다 각 선이 전달하는 식을 차례로 적으면 복잡한 회로도 같은 방법으로 해석할 수 있다.
