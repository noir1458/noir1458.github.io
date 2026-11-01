---
title: "01. Algebraic Foundations of Learning With Errors"
slug: ai-security-lwe-mathematical-foundations
description: "합동식, 동치류와 분할, 정수·다항식의 몫환을 정리하고 LWE 표본과 오차의 역할을 계산 예제로 살펴본다."
publishedAt: '2026-10-29'
categories: Modern Cryptography
tags:
  - LWE
  - Cryptography
  - Modular Arithmetic
math: true
draft: false
---

## 필기 원본

이 글에서 다룬 원본 PDF **1–5쪽**이다. 두 단과 여백 필기를 포함한 페이지 전체를 실었다. 이미지를 누르면 새 탭에서 원본 크기로 볼 수 있다.

[정리 글로 바로 가기](#들어가며)

<figure style="margin: 2rem 0;">
  <a href="/images/posts/cryptography-handwritten-notes/page-001.webp" target="_blank" rel="noopener">
    <img src="/images/posts/cryptography-handwritten-notes/page-001-preview.webp" alt="인공지능보안 필기 원본 PDF 1쪽 전체" width="1400" height="2002" loading="lazy" decoding="async" style="display: block; width: 100%; height: auto; margin: 0;">
  </a>
  <figcaption>원본 PDF 1쪽. <a href="/images/posts/cryptography-handwritten-notes/page-001.webp" target="_blank" rel="noopener">원본 크기로 보기</a></figcaption>
</figure>

<figure style="margin: 2rem 0;">
  <a href="/images/posts/cryptography-handwritten-notes/page-002.webp" target="_blank" rel="noopener">
    <img src="/images/posts/cryptography-handwritten-notes/page-002-preview.webp" alt="인공지능보안 필기 원본 PDF 2쪽 전체" width="1400" height="2094" loading="lazy" decoding="async" style="display: block; width: 100%; height: auto; margin: 0;">
  </a>
  <figcaption>원본 PDF 2쪽. <a href="/images/posts/cryptography-handwritten-notes/page-002.webp" target="_blank" rel="noopener">원본 크기로 보기</a></figcaption>
</figure>

<figure style="margin: 2rem 0;">
  <a href="/images/posts/cryptography-handwritten-notes/page-003.webp" target="_blank" rel="noopener">
    <img src="/images/posts/cryptography-handwritten-notes/page-003-preview.webp" alt="인공지능보안 필기 원본 PDF 3쪽 전체" width="1400" height="2094" loading="lazy" decoding="async" style="display: block; width: 100%; height: auto; margin: 0;">
  </a>
  <figcaption>원본 PDF 3쪽. <a href="/images/posts/cryptography-handwritten-notes/page-003.webp" target="_blank" rel="noopener">원본 크기로 보기</a></figcaption>
</figure>

<figure style="margin: 2rem 0;">
  <a href="/images/posts/cryptography-handwritten-notes/page-004.webp" target="_blank" rel="noopener">
    <img src="/images/posts/cryptography-handwritten-notes/page-004-preview.webp" alt="인공지능보안 필기 원본 PDF 4쪽 전체" width="1400" height="1869" loading="lazy" decoding="async" style="display: block; width: 100%; height: auto; margin: 0;">
  </a>
  <figcaption>원본 PDF 4쪽. <a href="/images/posts/cryptography-handwritten-notes/page-004.webp" target="_blank" rel="noopener">원본 크기로 보기</a></figcaption>
</figure>

<figure style="margin: 2rem 0;">
  <a href="/images/posts/cryptography-handwritten-notes/page-005.webp" target="_blank" rel="noopener">
    <img src="/images/posts/cryptography-handwritten-notes/page-005-preview.webp" alt="인공지능보안 필기 원본 PDF 5쪽 전체" width="1400" height="2094" loading="lazy" decoding="async" style="display: block; width: 100%; height: auto; margin: 0;">
  </a>
  <figcaption>원본 PDF 5쪽. <a href="/images/posts/cryptography-handwritten-notes/page-005.webp" target="_blank" rel="noopener">원본 크기로 보기</a></figcaption>
</figure>

## 들어가며

인공지능보안 수업의 중간 정리 필기를 글로 옮긴다. 수업은 private AI, FHE, MPC, ZKP처럼 암호 기술을 머신러닝에 적용하는 방법에서 출발한다. FHE는 완전동형암호, MPC는 다자간 계산, ZKP는 영지식 증명이다.

첫 글에서는 LWE를 읽기 위한 기초 수학부터 정리한다. 합동식으로 정수를 묶고, 그 묶음 위에 연산을 정의한 다음, 다항식에서도 같은 구성을 살펴본다. 이후 오차가 들어간 선형방정식으로 LWE를 정의한다.

**정리 범위는 원본 PDF의 1–5쪽이다.** 합동식, 동치관계, 동치류와 분할, 나머지계, 정수와 다항식의 몫환, LWE 표본, 행렬 표현, 가우스 소거법과 환원의 기초까지 다룬다. 6쪽부터 나오는 격자의 정의와 격자 문제, 공개키 암호, Ring-LWE의 구체적인 구성은 다음 글에서 이어간다.

필기의 정의·증명·예제는 유지하고, 설명을 위해 새로 넣은 계산은 **추가 예제**로 표시한다. 오차의 부호처럼 표기를 통일해야 하는 부분과 난해성에 관한 보충 설명은 따로 적는다.

## 1. Congruence: 합동식

정수 $a,b$와 양의 정수 $m$에 대해

$$
a\equiv b\pmod m
$$

은 $a$와 $b$를 $m$으로 나눈 나머지가 같다는 뜻이다. 차이가 $m$의 배수라는 조건으로 쓰면

$$
a\equiv b\pmod m
\iff m\mid(a-b)
\iff \exists k\in\mathbb Z,\quad a-b=km.
$$

여기서 $m\mid(a-b)$는 $m$이 $a-b$를 나눈다는 뜻이고, $m$은 modulus, 즉 법이다.

### 필기 예제: $2$와 $7$

$m=5$, $a=2$, $b=7$이면

$$
2-7=-5=(-1)\cdot5.
$$

따라서 $2\equiv7\pmod5$이다. 실제 나머지도

$$
2\bmod5=2,\qquad 7\bmod5=2
$$

로 같다. 정수로서 $2=7$이라는 뜻은 아니다. 법 $5$에서 같은 나머지를 갖는다는 뜻이다.

### 필기 예제: $39$, $25$, $4$

$$
39\equiv25\equiv4\pmod7.
$$

세 수의 나머지가 모두 $4$이기 때문이다. 차이를 확인해도 된다.

$$
39-25=14,\qquad25-4=21,\qquad39-4=35.
$$

모두 $7$의 배수다.

## 2. 합동관계가 동치관계인 이유

$m$을 하나 고정하고 정수 집합 $\mathbb Z$ 위의 관계를

$$
a\sim b\iff a\equiv b\pmod m
$$

으로 정의한다. 이 관계는 반사성, 대칭성, 추이성을 만족하므로 **동치관계**(equivalence relation)다.

### 2.1 반사성: Reflexivity

모든 정수 $a$에 대해

$$
a-a=0=0\cdot m
$$

이므로 $m\mid(a-a)$이다. 따라서

$$
a\equiv a\pmod m.
$$

$0$은 모든 양의 정수 $m$의 배수이므로 이 조건은 항상 성립한다.

### 2.2 대칭성: Symmetry

$a\equiv b\pmod m$이라고 하자. 어떤 $k\in\mathbb Z$에 대해

$$
a-b=km
$$

이다. 양변에 $-1$을 곱하면

$$
b-a=(-k)m.
$$

$-k$도 정수이므로 $b\equiv a\pmod m$이다.

### 2.3 추이성: Transitivity

$a\equiv b\pmod m$, $b\equiv c\pmod m$이라고 하자. 어떤 $k,\ell\in\mathbb Z$에 대해

$$
a-b=km,\qquad b-c=\ell m.
$$

두 식을 더하면

$$
a-c=(k+\ell)m.
$$

$k+\ell$도 정수이므로 $a\equiv c\pmod m$이다.

## 3. 동치류와 분할

### 3.1 동치류: Equivalence Class

집합 $S$에 동치관계 $\sim$가 주어졌을 때, $a\in S$의 동치류는

$$
[a]=\{x\in S\mid x\sim a\}
$$

이다. $a$와 동치인 원소를 모두 모은 집합이다.

두 원소가 같은 동치류에 속하는 조건은 그 두 원소가 동치라는 것이다.

$$
a\sim b\iff[a]=[b].
$$

**증명.** 먼저 $a\sim b$라고 하자. $x\in[a]$이면 $x\sim a$이고, 추이성으로 $x\sim b$이다. 따라서 $[a]\subseteq[b]$이다. 대칭성으로 $b\sim a$이므로 같은 논리로 $[b]\subseteq[a]$이고, 두 집합은 같다.

반대로 $[a]=[b]$이면 반사성에 의해 $a\in[a]=[b]$이다. 동치류의 정의로 $a\sim b$이다.

### 3.2 분할: Partition

집합 $S$의 분할은 $S$를 비어 있지 않은 부분집합들로 나누되, 모든 원소를 포함하고 서로 다른 부분집합끼리는 겹치지 않도록 하는 것이다.

부분집합들을 $\{S_i\}_{i\in I}$라고 쓰면

$$
S_i\ne\varnothing,\qquad
\bigcup_{i\in I}S_i=S,\qquad
i\ne j\implies S_i\cap S_j=\varnothing.
$$

원소가 빠지면 전체 집합을 나눈 것이 아니고, 같은 원소가 서로 다른 두 부분집합에 들어가면 서로 겹치는 분류가 된다.

### 3.3 동치류가 분할을 만드는 이유

**모든 원소가 어떤 동치류에 들어간다.** 임의의 $a\in S$에 대해 반사성으로 $a\sim a$이므로 $a\in[a]$이다. 따라서 동치류를 모두 합치면 $S$가 된다. 각 동치류도 비어 있지 않다.

**서로 다른 동치류는 겹치지 않는다.** 만약

$$
x\in[a]\cap[b]
$$

인 원소가 있다면 $x\sim a$, $x\sim b$이다. 대칭성으로 $a\sim x$이고 추이성으로 $a\sim b$이므로 $[a]=[b]$이다.

따라서

$$
[a]\cap[b]\ne\varnothing\implies[a]=[b].
$$

동치류 두 개는 완전히 같거나 아예 겹치지 않는다. 원소 하나만 겹치는 서로 다른 동치류는 없다. 이 성질 때문에 동치류들이 $S$의 분할을 이룬다.

## 4. 합동류, 나머지계, 몫집합

합동관계로 만든 동치류를 **합동류**(congruence class)라고 한다. 법을 표시하면

$$
[a]_m=\{x\in\mathbb Z\mid x\equiv a\pmod m\}.
$$

### 필기 예제: 법 $4$의 합동류

정수의 나눗셈 정리에 의해 임의의 정수 $a$는

$$
a=4k+r,\qquad k\in\mathbb Z,\quad0\le r<4
$$

로 유일하게 표현된다. 따라서 모든 정수는 다음 네 합동류 중 정확히 하나에 속한다.

$$
\begin{aligned}
[0]_4&=\{\ldots,-8,-4,0,4,8,\ldots\},\\
[1]_4&=\{\ldots,-7,-3,1,5,9,\ldots\},\\
[2]_4&=\{\ldots,-6,-2,2,6,10,\ldots\},\\
[3]_4&=\{\ldots,-5,-1,3,7,11,\ldots\}.
\end{aligned}
$$

정수는 무한히 많지만 법 $4$에서 서로 다른 합동류는 네 개다.

### 몫집합과 대표값은 구별한다

동치류 전체를 원소로 갖는 집합을 **몫집합**(quotient set)이라고 한다.

$$
S/{\sim}=\{[a]\mid a\in S\}.
$$

합동관계에 대해서는

$$
\mathbb Z/4\mathbb Z=\{[0]_4,[1]_4,[2]_4,[3]_4\}
$$

라고 쓴다. 여기서 각 원소는 정수 하나가 아니라 정수들의 집합인 합동류다.

각 합동류에서 대표 정수를 하나씩 고른 것이 **완전잉여계**(complete residue system)다. 법 $4$에서는 $\{0,1,2,3\}$이 표준적인 선택이다. 이 대표값을 사용해 보통

$$
\mathbb Z_4=\{0,1,2,3\},\qquad
\mathbb Z_m=\{0,1,\ldots,m-1\}
$$

처럼 간단히 적고, 계산 결과는 항상 법 $m$으로 해석한다. 엄밀한 합동류와 계산에 쓰는 대표값을 구별해 두면 이후 표기가 덜 헷갈린다.

## 5. 합동류 위의 연산과 정수의 몫환

합동류 위에 연산을 정의할 때는 어떤 대표값을 선택해도 결과가 같아야 한다. 이것을 연산이 **잘 정의되어 있다**(well-defined)고 한다.

$a_1\equiv b_1\pmod m$, $a_2\equiv b_2\pmod m$이라 하자. 어떤 $k,\ell\in\mathbb Z$에 대해

$$
a_1=b_1+km,\qquad a_2=b_2+\ell m
$$

이다.

### 5.1 덧셈

$$
(a_1+a_2)-(b_1+b_2)=(k+\ell)m.
$$

따라서

$$
a_1+a_2\equiv b_1+b_2\pmod m.
$$

### 5.2 곱셈

$$
\begin{aligned}
a_1a_2
&=(b_1+km)(b_2+\ell m)\\
&=b_1b_2+m(b_1\ell+b_2k+k\ell m).
\end{aligned}
$$

따라서

$$
a_1a_2\equiv b_1b_2\pmod m.
$$

이를 바탕으로 합동류 사이의 연산을

$$
[a]_m+[b]_m=[a+b]_m,\qquad
[a]_m[b]_m=[ab]_m
$$

으로 정의할 수 있다.

### 필기 예제: 같은 합동류에서 대표값을 바꾸기

법 $4$에서 $1\equiv9$, $3\equiv11$이다. 대표값을 바꾸어 계산해도

$$
1\cdot3=3,\qquad9\cdot11=99\equiv3\pmod4
$$

로 같은 합동류에 도착한다. 따라서 $[1]_4[3]_4=[3]_4$라는 계산은 대표값 선택에 영향을 받지 않는다.

### 5.3 Ring과 Field

이 덧셈과 곱셈을 갖춘

$$
\mathbb Z_m=\mathbb Z/m\mathbb Z
$$

를 법 $m$의 정수환이라고 한다. 이 환에서는 덧셈과 곱셈의 결합법칙, 교환법칙, 분배법칙이 성립한다. 덧셈의 항등원은 $[0]_m$, 덧셈의 역원은 $[-a]_m$, 곱셈의 항등원은 $[1]_m$이다.

그러나 모든 $0$이 아닌 원소에 곱셈의 역원이 있는 것은 아니다. 예를 들어 법 $4$에서 $2$는 곱셈의 역원이 없다. 어떤 정수 $x$에 대해서도 $2x\equiv1\pmod4$가 될 수 없기 때문이다.

$q$가 소수이면 $\mathbb Z_q$의 모든 $0$이 아닌 원소에 곱셈의 역원이 존재한다. 이 경우에는 **체**(field)가 된다. 이후 가우스 소거법에서 역원을 사용할 때 이 차이가 중요하다.

## 6. 다항식의 몫환

정수에서 $m$의 배수 차이를 무시했다면, 다항식에서는 특정 다항식의 배수 차이를 무시할 수 있다.

### 6.1 다항식 환과 합동

$q\ge2$일 때

$$
\mathbb Z_q[X]
$$

는 계수가 $\mathbb Z_q$에 속하는 모든 유한차수 다항식의 환이다. 예를 들어

$$
a(X)=a_0+a_1X+\cdots+a_dX^d,\qquad a_i\in\mathbb Z_q.
$$

이제 다항식 법을 $X^N+1$로 고정한다.

$$
\begin{aligned}
a(X)\equiv b(X)\pmod{X^N+1}
&\iff (X^N+1)\mid(a(X)-b(X))\\
&\iff a(X)-b(X)=k(X)(X^N+1)
\end{aligned}
$$

인 $k(X)\in\mathbb Z_q[X]$가 존재한다.

이때의 동치류는

$$
[a(X)]=
\{a(X)+k(X)(X^N+1)\mid k(X)\in\mathbb Z_q[X]\}.
$$

정수에서 $[a]_m=\{a+km\mid k\in\mathbb Z\}$로 묶었던 것과 같은 구조다.

### 6.2 $X^N\equiv-1$로 차수를 줄인다

$$
X^N\equiv-1\pmod{X^N+1}.
$$

$X^N-(-1)=X^N+1$이 법 다항식 자체이기 때문이다. 따라서 $N$차 이상의 항을 낮은 차수로 바꿀 수 있다.

**필기 예제.** $N=2$이면

$$
X^2\equiv-1,\qquad
X^3\equiv-X,\qquad
X^4\equiv1
\pmod{X^2+1}.
$$

이것은 다항식 환 안에서 그냥 $X^2=-1$이라고 선언하는 것이 아니다. 몫환 안에서 $X^2$와 $-1$을 같은 동치류로 취급하는 것이다.

### 6.3 나머지로 대표하기

임의의 $p(X)\in\mathbb Z_q[X]$는

$$
p(X)=h(X)(X^N+1)+r(X)
$$

로 쓸 수 있다. 여기서 $r(X)$는 $0$이거나 차수가 $N$보다 작다. 법 다항식 $X^N+1$의 최고차항 계수가 $1$이므로, $q$가 합성수여도 이 나머지를 유일하게 정할 수 있다.

따라서 몫환

$$
R_q=\mathbb Z_q[X]/(X^N+1)
$$

의 원소는

$$
a_0+a_1X+\cdots+a_{N-1}X^{N-1},
\qquad a_i\in\mathbb Z_q
$$

꼴의 나머지 다항식으로 대표할 수 있다. 분모의 $(X^N+1)$은 그 다항식의 배수들이 이루는 아이디얼을 뜻한다.

계산에는 두 종류의 법이 함께 등장한다.

- **계수**는 법 $q$로 계산한다.
- **다항식**은 법 $X^N+1$로 계산해 차수를 줄인다.

**추가 예제.** $\mathbb Z_{17}[X]/(X^2+1)$에서

$$
\begin{aligned}
(1+2X)(3+4X)
&=3+10X+8X^2\\
&\equiv-5+10X\\
&\equiv12+10X.
\end{aligned}
$$

첫 번째 합동에서는 $X^2\equiv-1$을 쓰고, 두 번째에서는 계수 $-5\equiv12\pmod{17}$을 썼다.

### 6.4 이 구조가 다시 나오는 곳

필기에서는 $N=2^k$일 때 $X^N+1$이 cyclotomic polynomial, 즉 원분다항식이 된다는 점을 적어 두었다. 정수 계수 다항식으로 쓰면

$$
X^N+1=\Phi_{2N}(X)\qquad(N=2^k,\ k\ge0)
$$

이다. 이 다항식 환 구조는 이후 Ring-LWE와 동형암호에서 다시 사용한다. 다항식 곱셈을 빠르게 구현하는 방법과도 연결되고, 적절한 법과 근의 조건 아래에서는 NTT를 사용할 수 있다.

다만 **$\mathbb Z_q$가 체라고 해서 $R_q$도 자동으로 체가 되는 것은 아니다.** 몫을 취하는 다항식이 어떻게 인수분해되는지도 따져야 한다.

정수와 다항식에서의 대응을 나란히 쓰면 다음과 같다.

$$
\begin{aligned}
\mathbb Z&\longrightarrow\mathbb Z/q\mathbb Z,\\
\mathbb Z_q[X]&\longrightarrow\mathbb Z_q[X]/(X^N+1).
\end{aligned}
$$

## 7. Learning With Errors: 오차가 있는 선형방정식

LWE의 목표는 **작은 오차가 섞인 무작위 선형방정식을 여러 개 보고, 공통된 비밀 벡터를 복원하는 것**이다.

비밀 벡터를

$$
\mathbf s=(s_1,\ldots,s_n)^{\mathsf T}\in\mathbb Z_q^n
$$

라고 하자. 공개된 벡터 $\mathbf a=(a_1,\ldots,a_n)^{\mathsf T}$와의 내적은

$$
\langle\mathbf a,\mathbf s\rangle
=\sum_{j=1}^n a_js_j.
$$

오차가 없다면 $b=\langle\mathbf a,\mathbf s\rangle\bmod q$라는 정확한 선형방정식이 된다. LWE에서는 여기에 공개되지 않은 오차 $e$를 더한다.

$$
\boxed{
b=\langle\mathbf a,\mathbf s\rangle+e\pmod q
}
$$

### 7.1 필기 예제: $q=17$, $n=4$

비밀 벡터가

$$
\mathbf s=(s_1,s_2,s_3,s_4)^{\mathsf T}\in\mathbb Z_{17}^4
$$

일 때, 다음과 같은 식이 여러 개 주어진다.

$$
\begin{aligned}
14s_1+15s_2+5s_3+2s_4&\approx8\pmod{17},\\
13s_1+14s_2+14s_3+6s_4&\approx16\pmod{17}.
\end{aligned}
$$

여기서 $\approx$는 실수의 근삿값을 말하는 것이 아니다. 법 $17$에서 작은 오차가 더해졌다는 직관적인 표기다. 첫 번째 식을 정확히 쓰면

$$
14s_1+15s_2+5s_3+2s_4+e_1
\equiv8\pmod{17}.
$$

설명을 위한 작은 오차의 예로 $e_i\in\{-1,0,1\}$을 생각할 수 있다. 실제 LWE 가정에서는 오차 분포와 매개변수를 별도로 정해야 한다.

필기에 적힌 비밀 벡터

$$
\mathbf s=(0,13,9,11)^{\mathsf T}
$$

를 첫 번째 식에 대입하면

$$
\begin{aligned}
14\cdot0+15\cdot13+5\cdot9+2\cdot11
&=262\\
&=15\cdot17+7\\
&\equiv7\pmod{17}.
\end{aligned}
$$

공개된 값은 $8$이므로 $7+1\equiv8\pmod{17}$이다. 따라서 이 글의 표기에서는

$$
e_1=1.
$$

**추가 계산: 두 번째 식도 확인하기.**

$$
\begin{aligned}
13\cdot0+14\cdot13+14\cdot9+6\cdot11
&=374\\
&=22\cdot17\\
&\equiv0\pmod{17}.
\end{aligned}
$$

$0+(-1)\equiv16\pmod{17}$이므로 두 번째 오차는

$$
e_2=-1\equiv16\pmod{17}.
$$

두 식은 같은 비밀 벡터를 사용하지만 오차는 서로 다르다.

### 7.2 필기의 오차 부호를 통일하기

필기에는 첫 번째 예제의 $7+1=8$이라는 계산과 $e=-1$이라는 메모가 함께 있다. 이는 오차를 어느 쪽에 두는지 구분해서 읽어야 한다.

$$
\begin{aligned}
\langle\mathbf a,\mathbf s\rangle+e=b
&\quad\Longrightarrow\quad e=1,\\
\langle\mathbf a,\mathbf s\rangle=b+\widetilde e
&\quad\Longrightarrow\quad\widetilde e=-1.
\end{aligned}
$$

두 오차의 관계는 $\widetilde e=-e$다. 이 글에서는 처음부터 끝까지 $b=\langle\mathbf a,\mathbf s\rangle+e$를 사용한다. 오차의 부호를 바꾸면 분포도 그 부호 반전에 맞춰 해석해야 하며, 대칭인 분포에서는 두 분포가 같다.

## 8. LWE 표본 분포와 작은 오차

### 8.1 매개변수와 표본 생성

기본 매개변수는 다음과 같다.

| 기호 | 의미 |
|---|---|
| $n\ge1$ | 비밀 벡터의 차원 |
| $q\ge2$ | 정수 계산의 법 |
| $\chi$ | $\mathbb Z_q$ 위의 오차 확률분포 |
| $\mathbf s\in\mathbb Z_q^n$ | 여러 표본에서 공통으로 사용하는 비밀 벡터 |

고정된 $\mathbf s$에 대한 LWE 표본 분포를 $A_{\mathbf s,\chi}$라고 한다. 이 표기는 아래에서 사용할 행렬 $A$와 구별한다.

표본 하나는 다음 순서로 만든다.

$$
\begin{aligned}
\mathbf a&\xleftarrow{\mathrm U}\mathbb Z_q^n,\\
e&\leftarrow\chi,\\
b&:=\langle\mathbf a,\mathbf s\rangle+e\pmod q.
\end{aligned}
$$

여기서 $\xleftarrow{\mathrm U}$는 균등분포로 뽑는다는 뜻이다. $\mathbf a$와 $e$는 독립적으로 뽑는다. 출력은

$$
(\mathbf a,b)\in\mathbb Z_q^n\times\mathbb Z_q
$$

이다. **공격자에게 주어지는 것은 $\mathbf a,b$이고, $\mathbf s$와 실제 오차 $e$는 주어지지 않는다.**

다음 표본에서도 $\mathbf s$는 그대로 사용한다. 대신 $\mathbf a_i$와 $e_i$는 매번 새로, 독립적으로 뽑는다.

$$
b_i=\langle\mathbf a_i,\mathbf s\rangle+e_i\pmod q.
$$

이렇게 얻은 여러 독립 표본으로 $\mathbf s$를 복원하는 문제가 여기서 다루는 **Search-LWE**다. 표본이 완전한 균등분포에서 나온 것인지 구별하는 Decision-LWE와는 질문이 다르다. 표본 정의와 이 구분은 Regev의 [The Learning with Errors Problem](https://cims.nyu.edu/~regev/papers/lwesurvey.pdf)에서도 확인할 수 있다.

### 8.2 오차를 전체에서 균등하게 뽑으면 어떻게 되는가

$\mathbf a$는 $\mathbb Z_q^n$ 전체에서 균등하게 뽑지만, 오차를 $\mathbb Z_q$ 전체의 균등분포로 뽑는 것은 다른 문제다.

고정된 $\mathbf a,\mathbf s$에 대해 $e$가 균등하면

$$
b=\langle\mathbf a,\mathbf s\rangle+e\pmod q
$$

도 균등하다. 상수를 더하는 연산은 $\mathbb Z_q$의 원소들을 일대일로 다시 배치하기 때문이다.

따라서 임의의 $c\in\mathbb Z_q$에 대해

$$
\Pr[b=c\mid\mathbf a,\mathbf s]=\frac1q.
$$

이 경우 공개된 표본의 분포는 $\mathbf s$에 의존하지 않아 비밀을 복원할 정보를 주지 않는다. 필기에서 “오차가 완전히 랜덤이면 안 된다”는 말은 **오차도 무작위로 뽑되, 모든 나머지에 균등하게 퍼뜨리지는 않는다**는 뜻으로 읽어야 한다.

### 8.3 법 $q$에서 작다는 것

법 $17$에서

$$
-1\equiv16\pmod{17}
$$

이다. 표준 대표값 $0,\ldots,16$으로 보면 $16$은 커 보이지만, 중심을 $0$으로 잡으면 $-1$이라는 작은 오차다.

그래서 오차를 해석할 때는 **중심 대표값**(centered representative)을 사용한다. 예를 들어 법 $17$에서는

$$
\{-8,-7,\ldots,-1,0,1,\ldots,7,8\}
$$

을 대표값으로 고를 수 있다. 일반적으로는 $[-q/2,q/2)$에 들어가는 정수 대표값을 택하는 식으로 끝점의 중복을 피한다.

작은 오차 분포는 이런 중심 대표값이 $0$ 근처에 모이도록 한다. 다만 “작은 오차를 넣었다”는 조건만으로 모든 매개변수의 LWE가 어렵다고 결론 내릴 수는 없다. 위의 $q=17$, $n=4$ 예제는 계산 원리를 보여 주기 위한 것이다.

## 9. 여러 표본을 행렬로 쓰기

표본의 개수를 $t$라고 하고, 각 $\mathbf a_i$를 열벡터로 쓰면

$$
A=
\begin{pmatrix}
\mathbf a_1^{\mathsf T}\\
\mathbf a_2^{\mathsf T}\\
\vdots\\
\mathbf a_t^{\mathsf T}
\end{pmatrix}
\in\mathbb Z_q^{t\times n}.
$$

$$
\mathbf b=
\begin{pmatrix}
b_1\\b_2\\\vdots\\b_t
\end{pmatrix},\qquad
\mathbf e=
\begin{pmatrix}
e_1\\e_2\\\vdots\\e_t
\end{pmatrix}
\in\mathbb Z_q^t.
$$

각 표본의 식을 한 번에 쓰면

$$
\boxed{\mathbf b=A\mathbf s+\mathbf e\pmod q}.
$$

공개된 것은 $A,\mathbf b$이고, 숨겨진 것은 $\mathbf s,\mathbf e$다. 모든 행이 같은 $\mathbf s$를 사용한다는 점이 중요하다.

## 10. 가우스 소거법으로 바로 풀리지 않는 이유

### 10.1 오차가 없는 경우

오차가 없다면

$$
\mathbf b=A\mathbf s\pmod q.
$$

$q$가 소수이고 충분히 많은 식에서 독립인 $n$개를 골랐다고 하자. 그 식들로 만든 정사각행렬이 가역이면

$$
\mathbf s=A^{-1}\mathbf b\pmod q
$$

로 복원할 수 있다. 일반적인 행렬 표현에서는 가우스 소거법으로 독립인 행과 피벗을 찾는다.

필기의 “오차가 없으면 쉽다”는 말은 이런 조건에서의 선형대수 계산을 가리킨다. 식이 부족하거나 독립이지 않으면 비밀이 하나로 정해지지 않을 수 있다. 또 $q$가 합성수이면 $0$이 아닌 피벗도 역원이 없을 수 있으므로 체에서의 소거법을 그대로 적용할 수 없다.

### 10.2 오차가 있는 경우

이제 정사각 가역행렬 $A$에 대해

$$
\mathbf b=A\mathbf s+\mathbf e\pmod q
$$

라고 하자. 행 연산은 왼쪽에서 가역행렬 $R$을 곱하는 것으로 나타낼 수 있다.

$$
R\mathbf b=RA\mathbf s+R\mathbf e\pmod q.
$$

$RA=I$가 되도록 소거해도 결과는

$$
R\mathbf b=\mathbf s+R\mathbf e\pmod q
$$

이다. 비밀 벡터만 남는 것이 아니다. **오차도 함께 변환된다.**

처음의 $\mathbf e$가 작은 오차들로 이루어져 있어도 $R\mathbf e$가 계속 작은 중심 대표값을 갖는다는 보장은 없다. 행을 결합하거나 피벗의 역원을 곱하는 과정이 오차에도 그대로 적용되기 때문이다.

**추가 예제.** 법 $17$에서 $5^{-1}=7$이다.

$$
5\cdot7=35\equiv1\pmod{17}.
$$

따라서 피벗 $5$를 $1$로 만들기 위해 행에 $7$을 곱하면, 그 행의 오차 $1$도 $7$로 바뀐다. 처음에는 작았던 오차가 같은 크기로 유지되지 않는다.

이것이 소거법을 그대로 사용하기 어려운 이유다. 그러나 **특정 풀이가 잘 동작하지 않는다는 관찰은 LWE의 난해성 증명과 다르다.** 다른 모든 효율적인 알고리즘까지 배제한 것은 아니기 때문이다.

## 11. Reduction: 난해성을 연결하는 환원

### 11.1 환원의 방향

계산 문제 $A$를 계산 문제 $B$로 환원한다는 것은 $A$의 입력을 변환하고 $B$의 풀이를 이용해 $A$의 답을 구하는 절차를 만드는 것이다. 이 절의 $A,B$는 문제의 이름이며, 앞 절의 행렬 $A$와는 다른 기호다.

다항시간 환원을

$$
A\le_{\mathrm p}B
$$

라고 쓰면, 기본적인 의미는 다음과 같다.

$$
B\text{를 효율적으로 풀 수 있다}
\implies
A\text{도 효율적으로 풀 수 있다}.
$$

이미 풀 줄 아는 $B$를 이용해 $A$를 해결할 수도 있고, $A$가 어렵다는 가정으로부터 $B$도 적어도 그만큼 어렵다는 근거를 얻을 수도 있다. 난해성 논의에서는 이 화살표 방향을 바꾸어 읽지 않아야 한다.

### 11.2 필기 예제: 최단 경로를 문자열로 바꾸기

가로로 세 칸, 세로로 두 칸인 격자에서 왼쪽 아래 $P$에서 오른쪽 위 $Q$로 가는 최단 경로를 센다고 하자.

최단 경로는 오른쪽 이동 $R$ 세 번과 위쪽 이동 $U$ 두 번으로 이루어진다. 예를 들어 $RRRUU$는 하나의 경로다. 모든 최단 경로를 길이 $5$의 문자열로 바꿀 수 있으므로, 다섯 자리 중 $U$가 들어갈 두 자리를 고르면 된다.

$$
\binom52=\frac{5!}{2!3!}=10.
$$

경로를 세는 질문을 문자열의 자리를 고르는 질문으로 바꾼 것이다. 필기에서는 문제를 다른 문제로 옮겨 푼다는 환원의 첫 직관으로 이 예제를 사용한다.

### 11.3 LWE와 격자 문제를 연결하기

LWE에 대해서도 단순히 “소거법이 실패한다”는 설명을 넘어서, 이미 연구된 격자 문제와의 관계를 살핀다.

필기의 난해성 설명을 정확히 읽으면 **적절한 매개변수와 오차 분포에서 LWE를 효율적으로 푸는 알고리즘이 있다면, 특정 최악 경우의 격자 문제도 효율적으로 풀 수 있도록 연결하는 환원**이 있다는 뜻이다.

Regev의 원래 결과에서는 이 환원이 양자 알고리즘을 사용한다. 특정 조건의 LWE 해결 알고리즘으로부터 GapSVP와 SIVP를 정해진 근사비율로 푸는 효율적인 양자 알고리즘을 얻는다. 따라서 해당 최악 경우 격자 문제가 양자 알고리즘으로도 어렵다는 가정 아래에서 LWE의 난해성을 뒷받침한다. 원 논문의 [Theorem 1.1과 설명](https://cims.nyu.edu/~regev/papers/qcrypto.pdf)에서 조건과 방향을 확인할 수 있다.

이는 모든 LWE 매개변수에서 효율적인 알고리즘이 없다는 무조건적인 증명은 아니다. 격자의 정의와 어떤 문제를 어떤 조건으로 연결하는지는 다음 글에서 정리한다.

## 12. 다시 확인할 내용

- $a\equiv b\pmod m$은 $a-b$가 $m$의 배수라는 뜻이다.
- 합동관계는 반사성·대칭성·추이성을 만족하는 동치관계다.
- 동치류는 전체 집합을 빠짐없이 덮고, 서로 다른 동치류끼리는 겹치지 않는다.
- 합동류의 대표값을 바꾸어도 덧셈과 곱셈의 결과가 같은 합동류에 속하므로 연산을 잘 정의할 수 있다.
- $\mathbb Z_q[X]/(X^N+1)$에서는 계수를 법 $q$로, 다항식을 법 $X^N+1$로 줄인다.
- LWE에서는 같은 비밀 $\mathbf s$를 사용하면서 $\mathbf a_i,e_i$를 매번 새로 뽑아 $(\mathbf a_i,b_i)$를 공개한다.
- 식은 $b_i=\langle\mathbf a_i,\mathbf s\rangle+e_i\pmod q$, 행렬로는 $\mathbf b=A\mathbf s+\mathbf e\pmod q$이다.
- 작은 오차는 중심 대표값으로 해석한다. 법 $17$의 $16$은 오차 $-1$을 나타낼 수 있다.
- 가우스 소거법은 오차까지 변환한다. 이것은 풀이가 어려워지는 직관이며, 난해성의 근거는 조건을 갖춘 환원과 그 기반 가정에서 따로 살펴야 한다.

## 참고 자료와 원문 범위

- 개인 필기 「인공지능보안 중간정리」 PDF 1–5쪽. 주차 소개, 기초 수학, LWE와 환원 소개를 원문 순서로 정리했다.
- Oded Regev, [The Learning with Errors Problem](https://cims.nyu.edu/~regev/papers/lwesurvey.pdf), Introduction. LWE의 표본 정의와 예제의 표기를 대조했다.
- Oded Regev, [On Lattices, Learning with Errors, Random Linear Codes, and Cryptography](https://cims.nyu.edu/~regev/papers/qcrypto.pdf), Theorem 1.1. 난해성 환원의 방향과 양자 환원이라는 조건을 확인했다.
