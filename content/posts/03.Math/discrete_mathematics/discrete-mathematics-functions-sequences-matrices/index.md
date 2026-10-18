---
title: "05. 함수, 수열과 합, 행렬"
slug: discrete-mathematics-functions-sequences-matrices
publishedAt: '2026-10-18'
categories: discrete_mathematics
math: true

---

수열은 정수 인덱스를 입력으로 받는 함수이고, 행렬은 수를 행과 열에 맞춰 배열한 구조다. 바닥·천장 함수로 정수 단위의 자원을 계산하고, 점화식으로 반복되는 변화를 표현하고, 행렬로 여러 관계와 방정식을 한꺼번에 다룰 수 있다. 정의를 실제 계산에 적용하면서 각 구조의 성질을 살펴보자.

[연습문제로 바로 가기](#practice) · 먼저 풀어 본 뒤 각 문제의 **해설 보기**를 눌러 확인할 수 있다.

## 1. 함수의 성질을 판단하는 연습

단사는 같은 출력에서 같은 입력이 따라오는지, 전사는 공역의 모든 값에 원상이 있는지 확인한다. 정의역과 공역을 함께 보아야 한다.

| 함수 | 단사 | 전사 | 이유 |
|---|---|---|---|
| $f:\mathbb Z\to\mathbb Z$, $f(n)=n-1$ | O | O | $f(a)=f(b)$이면 $a=b$이고 $y$의 원상은 $y+1$ |
| $f:\mathbb Z\to\mathbb Z$, $f(n)=n^2+1$ | X | X | $f(1)=f(-1)=2$, 0의 원상이 없음 |
| $f:\mathbb Z\to\mathbb Z$, $f(n)=\lceil n/2\rceil$ | X | O | $f(1)=f(2)=1$, 각 정수 $y$에 $n=2y$를 선택 |
| $f:\mathbb R\to\mathbb R$, $f(x)=-3x+4$ | O | O | $y$의 원상 $(4-y)/3$이 유일 |
| $f:\mathbb R\to\mathbb R$, $f(x)=-3x^2+7$ | X | X | $f(1)=f(-1)=4$, 7보다 큰 값은 출력되지 않음 |

실수에서 $f(x)=ax+b$, $a\ne0$이면 $f^{-1}(y)=(y-b)/a$다. 정수에서 $f(n)=n+5$의 역함수는 $f^{-1}(n)=n-5$다. 역함수는 출력을 다시 입력으로 되돌리는 함수이며 $1/f(x)$와는 다르다.

## 2. 바닥함수와 천장함수

바닥함수 $\lfloor x\rfloor$는 $x$ 이하의 최대 정수, 천장함수 $\lceil x\rceil$은 $x$ 이상의 최소 정수다.

| $x$ | $\lfloor x\rfloor$ | $\lceil x\rceil$ |
|---|---|---|
| $3.5$ | 3 | 4 |
| $-1.5$ | -2 | -1 |
| $-0.5$ | -1 | 0 |
| $-2.5$ | -3 | -2 |
| $7$ | 7 | 7 |

음수에서는 소수 부분을 지우는 것과 바닥함수가 다르다. 정의를 부등식으로 쓰면 정수 $n$에 대해

$$
\lfloor x\rfloor=n\iff n\le x<n+1,\qquad
\lceil x\rceil=n\iff n-1<x\le n.
$$

따라서

$$
x-1<\lfloor x\rfloor\le x\le\lceil x\rceil<x+1,
$$

$$
\lfloor-x\rfloor=-\lceil x\rceil,\qquad
\lceil-x\rceil=-\lfloor x\rfloor,
$$

$$
\lfloor x+n\rfloor=\lfloor x\rfloor+n,\qquad
\lceil x+n\rceil=\lceil x\rceil+n\quad(n\in\mathbb Z).
$$

마지막 식은 이동량이 정수일 때의 성질이다. 임의의 실수끼리 더할 때는 성립하지 않는다. $x=y=1/2$이면 $\lceil x+y\rceil=1$이지만 $\lceil x\rceil+\lceil y\rceil=2$다.

### 필요한 자원은 올림, 담을 수 있는 개수는 내림

$n$비트를 8비트 단위로 저장하려면 $\lceil n/8\rceil$바이트가 필요하다.

| 비트 수 | 필요한 바이트 |
|---|---|
| 4 | 1 |
| 10 | 2 |
| 100 | 13 |
| 500 | 63 |
| 3000 | 375 |

500바이트를 셀당 48바이트의 데이터 영역에 넣는다면 $\lceil500/48\rceil=11$셀이 필요하다. 반대로 셀 전체 길이가 53바이트이고 초당 500,000비트를 전송한다면, 1분에 완전히 전송 가능한 셀 수는

$$
\left\lfloor\frac{500000\cdot60}{53\cdot8}\right\rfloor=70754
$$

개다. 앞의 문제는 필요한 공간을 확보하고, 뒤의 문제는 제한된 공간 안의 완전한 단위를 세므로 반올림 방향이 다르다.

### 바닥함수 항등식의 증명

모든 실수 $x$에 대해

$$
\lfloor2x\rfloor=\lfloor x\rfloor+\left\lfloor x+\frac12\right\rfloor.
$$

$x=n+\varepsilon$로 쓰되 $n=\lfloor x\rfloor$, $0\le\varepsilon<1$로 둔다. $0\le\varepsilon<1/2$이면 왼쪽은 $2n$이고 오른쪽은 $n+n$이다. $1/2\le\varepsilon<1$이면 왼쪽은 $2n+1$이고 오른쪽은 $n+(n+1)$이다. 모든 실수가 두 경우 중 하나에 속하므로 증명이 끝난다.

## 3. 계승, 부분함수, 무한집합

계승은 $n!=1\cdot2\cdots n$, $0!=1$로 정의한다. $5!=120$, $10!=3,628,800$이다. 점화식으로는 $n!=n(n-1)!$이다. 큰 $n$에서 스털링 근사

$$
n!\sim\sqrt{2\pi n}\left(\frac ne\right)^n
$$

를 사용할 수 있다. $f(n)\sim g(n)$은 두 값의 차가 0이 된다는 뜻이 아니라 비율 $f(n)/g(n)$이 1에 수렴한다는 뜻이다.

부분함수는 지정한 입력 집합의 일부에서만 값이 정의된다. 정수에서 실수로 값을 생각할 때 $\sqrt n$은 $n\ge0$에서만 정의되고, $1/n$은 $n\ne0$에서만 정의된다. 입력 집합 전체에서 정의되면 전함수다. 정의역을 처음부터 $\mathbb Z\setminus\{0\}$로 잡은 $1/n$은 그 정의역에서는 전함수다.

무한집합의 크기도 대응으로 비교한다. $A$에서 $B$로 전단사가 있으면 $|A|=|B|$, 단사가 있으면 $|A|\le|B|$로 정의한다. 유한집합이거나 양의 정수와 전단사인 집합을 가산집합이라고 한다.

양의 홀수는 $n\mapsto2n-1$로 양의 정수와 전단사이고, 정수는 $0,1,-1,2,-2,\ldots$로 나열된다. 양의 유리수도 분자와 분모의 합이 작은 순서로 훑으면서 이미 나온 값을 건너뛰면 나열할 수 있다. 반면 실수는 비가산이다. 소수 전개를 목록으로 만들었다고 가정하고 $n$번째 수의 $n$번째 자릿수와 다른 숫자를 골라 새 실수를 만들면, 그 수는 목록의 모든 수와 적어도 한 자리에서 다르다. 자릿수를 1과 2 중에서 고르면 유한소수와 9가 반복되는 표현의 중복도 피할 수 있다.

## 4. 수열과 점화식

수열 $a_n$은 정수의 부분집합에서 어떤 집합으로 가는 함수다. 순서와 중복을 유지하므로 일반 집합과 다르다. $a_n=1/n$은 $n=1$부터 시작하고, $a_n=2^n$은 $n=0$부터 시작할 수도 있다. 시작 인덱스를 먼저 확인해야 한다.

$n=0,1,2,\ldots$일 때 등차수열은 $a_n=a+nd$, 등비수열은 $a_n=ar^n$이다.

| 일반항 | 처음 다섯 항 |
|---|---|
| $3\cdot2^n$ | $3,6,12,24,48$ |
| $1+4n$ | $1,5,9,13,17$ |
| $(-1)^n$ | $1,-1,1,-1,1$ |
| $2\cdot5^n$ | $2,10,50,250,1250$ |
| $6(1/3)^n$ | $6,2,2/3,2/9,2/27$ |
| $7-3n$ | $7,4,1,-2,-5$ |

문자열은 유한한 알파벳에서 고른 문자들의 유한 수열이다. `abcde`는 길이 5이고, 빈 문자열 $\lambda$는 길이 0이다.

점화식은 앞선 항들로 다음 항을 정한다. $a_n=a_{n-1}+3$, $a_0=2$이면 $2,5,8,11,\ldots$이고, $a_n=a_{n-1}-a_{n-2}$, $a_0=3,a_1=5$이면 $a_2=2,a_3=-3$이다. 이전 두 항을 사용하는 점화식에는 보통 그에 맞는 두 초기조건이 필요하다.

피보나치 수열은

$$
f_0=0,\quad f_1=1,\quad f_n=f_{n-1}+f_{n-2}\quad(n\ge2)
$$

로 정한다. 처음 항들은 $0,1,1,2,3,5,8,13,21$이다.

### 제안된 식이 해인지 확인하기

$a_n=2a_{n-1}-a_{n-2}$에서 $a_n=3n$을 대입하면 $2\cdot3(n-1)-3(n-2)=3n$이므로 해다. 상수수열 $a_n=5$도 $2\cdot5-5=5$여서 해다. 하지만 $a_n=2^n$은 $n=2$에서 $4\ne2\cdot2-1=3$이므로 해가 아니다. 점화식만 만족하는 것과 특정 초기조건까지 만족하는 것은 따로 확인한다.

### 반복 대입으로 일반항 구하기

$a_1=2$, $a_n=a_{n-1}+3$이면 뒤로 대입할 때마다 3이 하나씩 더해져

$$
a_n=a_{n-2}+2\cdot3=\cdots=a_1+3(n-1)=2+3(n-1).
$$

초기항이 $a_0=2$인 문제라면 $2+3n$이다. 인덱스 하나 차이로 상수항이 달라진다. 같은 방식으로 $a_0=2$, $a_n=a_{n-1}+5$의 해는 $2+5n$이고, $a_0=2$, $a_n=3a_{n-1}$의 해는 $2\cdot3^n$이다.

$a_0=1$, $a_n=a_{n-1}+n$이면

$$
a_n=1+1+2+\cdots+n=1+\frac{n(n+1)}2.
$$

$a_0=1$, $a_n=3a_{n-1}+1$이면

$$
\begin{aligned}
a_n&=3^na_0+\sum_{j=0}^{n-1}3^j\\
&=3^n+\frac{3^n-1}{2}=\frac{3^{n+1}-1}{2}.
\end{aligned}
$$

각 식을 다시 점화식과 초기조건에 대입하면 결과를 확인할 수 있다.

고정 비율의 증가도 등비수열이다. 초기값이 10,000이고 매 단계 11%씩 늘어난다는 수학적 모형이면 $P_n=1.11P_{n-1}$, $P_0=10000$이므로 $P_{30}=10000(1.11)^{30}\approx228922.97$이다. 초기값 5,000, 증가율 8%라면 $P_n=5000(1.08)^n$이다.

### 처음 몇 항으로 규칙 추측하기

$1,1/2,1/4,\ldots$에서는 $2^{-n}$, $1,3,5,\ldots$에서는 $2n+1$을 추측할 수 있다($n=0$부터). $5,11,17,23,\ldots$는 $6n-1$($n=1$부터), $1,7,25,79,241,727,\ldots$는 $3^n-2$($n=1$부터)에 맞는다. $1,3,4,7,11,18,\ldots$는 앞의 두 항의 합이라는 규칙에 맞는다. $1,2,2,3,3,3,\ldots$는 양의 정수 $k$를 $k$번씩 반복한 수열이다.

알려진 정수 수열을 찾는 데 OEIS 같은 수열 데이터베이스를 사용할 수도 있다. 다만 유한하게 주어진 항들은 여러 규칙과 동시에 맞을 수 있다. 패턴을 발견하는 것은 추측이고, 일반항을 확정하려면 정의나 추가 조건, 증명이 필요하다.

## 5. 합과 곱의 표기

$$
\sum_{j=m}^{n}a_j=a_m+a_{m+1}+\cdots+a_n,\qquad
\prod_{j=m}^{n}a_j=a_ma_{m+1}\cdots a_n.
$$

아래와 위의 숫자는 합의 범위를 정하고, $j$는 합 안에서만 쓰는 인덱스다. $\sum_{j=1}^{5}j^2=55$이며, 인덱스를 $k=j-1$로 옮기면 $\sum_{k=0}^{4}(k+1)^2$가 된다. $\sum_{k=4}^{8}(-1)^k=1$이고 $n!=\prod_{j=1}^{n}j$다.

### 등비급수와 망원합

$S=a+ar+\cdots+ar^n$이라고 하자. $rS$에서 $S$를 빼면 중간 항들이 사라져

$$
(r-1)S=ar^{n+1}-a.
$$

따라서

$$
\sum_{j=0}^{n}ar^j=
\begin{cases}
\dfrac{a(r^{n+1}-1)}{r-1},&r\ne1,\\
(n+1)a,&r=1.
\end{cases}
$$

$r=1$인 경우에는 0으로 나누지 말고 항의 개수로 계산한다. 망원합도 같은 소거 원리다.

$$
\sum_{j=1}^{n}(a_j-a_{j-1})=a_n-a_0.
$$

$k^2-(k-1)^2=2k-1$을 합하면 $\sum_{k=1}^{n}(2k-1)=n^2$이다. 따라서 $2\sum k-n=n^2$이고

$$
\sum_{k=1}^{n}k=\frac{n(n+1)}2.
$$

또 $k^3-(k-1)^3=3k^2-3k+1$을 합하면

$$
n^3=3\sum_{k=1}^{n}k^2-3\frac{n(n+1)}2+n,
$$

즉 $\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}6$이다.

| 합 | 공식 |
|---|---|
| $\sum_{k=1}^{n}k$ | $n(n+1)/2$ |
| $\sum_{k=1}^{n}k^2$ | $n(n+1)(2n+1)/6$ |
| $\sum_{k=1}^{n}k^3$ | $n^2(n+1)^2/4$ |
| $\sum_{k=0}^{\infty}x^k$, $\lvert x\rvert<1$ | $1/(1-x)$ |
| $\sum_{k=1}^{\infty}kx^{k-1}$, $\lvert x\rvert<1$ | $1/(1-x)^2$ |

무한등비급수는 유한합 공식에서 $x^{n+1}\to0$인 조건 $\lvert x\rvert<1$을 사용한다. 마지막 공식은 수렴 구간 안에서 등비급수를 항별 미분해 얻는다.

### 구간 합과 이중합의 계산

시작점이 1이 아니면 앞부분을 빼면 된다.

$$
\sum_{k=50}^{100}k^2
=\frac{100\cdot101\cdot201}{6}-\frac{49\cdot50\cdot99}{6}
=297925.
$$

같은 방식으로 $\sum_{k=11}^{20}k=210-55=155$이고,

$$
\sum_{k=100}^{200}k
=\frac{200\cdot201}{2}-\frac{99\cdot100}{2}=15150.
$$

지수의 합은

$$
\sum_{j=1}^{8}2^j=2^9-2=510,\qquad
\sum_{j=0}^{8}2(-3)^j=\frac{2((-3)^9-1)}{-4}=9842.
$$

이중합은 안쪽부터 계산한다.

$$
\sum_{i=1}^{4}\sum_{j=1}^{3}ij
=\sum_{i=1}^{4}(i+2i+3i)=6(1+2+3+4)=60.
$$

$$
\sum_{i=1}^{2}\sum_{j=1}^{3}(i+j)
=\sum_{i=1}^{2}(3i+6)=9+12=21.
$$

범위가 $i=1,2,3$, $j=1,2$인 경우에도 $\sum_i(2i+3)=5+7+9=21$이지만, 합치는 항들은 다르다. 집합 위의 합 $\sum_{s\in\{0,2,4\}}s$는 그 원소를 한 번씩 더해 6이다.

## 6. 행렬의 크기와 연산

$m$개의 행과 $n$개의 열을 가진 배열을 $m\times n$ 행렬이라고 한다. $A=[a_{ij}]$에서 첫 인덱스는 행, 둘째는 열이다. 같은 행렬이려면 크기와 모든 성분이 같아야 한다. 3×2 행렬과 2×3 행렬은 성분의 수가 같아도 다른 크기다.

### 덧셈

같은 크기끼리 대응 성분을 더한다.

$$
\begin{bmatrix}1&0&-1\\2&2&-3\\3&4&0\end{bmatrix}
+
\begin{bmatrix}3&4&-1\\1&-3&0\\-1&1&2\end{bmatrix}
=
\begin{bmatrix}4&4&-2\\3&-1&-3\\2&5&2\end{bmatrix}.
$$

### 곱셈

$A$가 $m\times k$, $B$가 $k\times n$이면 $AB$는 $m\times n$이고

$$
(AB)_{ij}=\sum_{\ell=1}^{k}a_{i\ell}b_{\ell j}.
$$

왼쪽 행렬의 한 행과 오른쪽 행렬의 한 열을 곱해 더한다. 안쪽 크기가 맞지 않으면 곱을 정의할 수 없다. 2×3 행렬 $A$와 4×2 행렬 $B$에서는 $AB$는 정의되지 않지만 $BA$는 4×3이다.

$$
A=\begin{bmatrix}1&0&4\\2&1&1\\3&1&0\\0&2&2\end{bmatrix},\qquad
B=\begin{bmatrix}2&4\\1&1\\3&0\end{bmatrix}
$$

이면

$$
AB=\begin{bmatrix}14&4\\8&9\\7&13\\8&2\end{bmatrix}.
$$

첫 성분은 $1\cdot2+0\cdot1+4\cdot3=14$이고, 둘째 행·둘째 열 성분은 $2\cdot4+1\cdot1+1\cdot0=9$다.

연습으로

$$
C=\begin{bmatrix}1&-3&0\\1&2&2\\2&1&-1\end{bmatrix},\qquad
D=\begin{bmatrix}1&-1&2&3\\-1&0&3&-1\\-3&-2&0&2\end{bmatrix}
$$

를 곱하면

$$
CD=\begin{bmatrix}4&-1&-7&6\\-7&-5&8&5\\4&0&7&3\end{bmatrix}.
$$

예를 들어 $(CD)_{23}=1\cdot2+2\cdot3+2\cdot0=8$이다.

### 순서를 바꾸면 달라진다

$$
A=\begin{bmatrix}1&1\\2&1\end{bmatrix},\quad
B=\begin{bmatrix}2&1\\1&1\end{bmatrix}
$$

이면

$$
AB=\begin{bmatrix}3&2\\5&3\end{bmatrix},\qquad
BA=\begin{bmatrix}4&3\\3&2\end{bmatrix}.
$$

따라서 행렬곱은 교환되지 않는다. $A=\begin{bmatrix}1&0\\1&1\end{bmatrix}$, $B=\begin{bmatrix}1&1\\0&1\end{bmatrix}$에서도 $AB=\begin{bmatrix}1&1\\1&2\end{bmatrix}$, $BA=\begin{bmatrix}2&1\\1&1\end{bmatrix}$로 다르다.

## 7. 항등행렬, 전치, 역행렬

항등행렬 $I_n$은 주대각선 성분이 1이고 나머지가 0이다. $A$가 $m\times n$이면

$$
I_mA=AI_n=A.
$$

정사각행렬의 거듭제곱은 $A^0=I_n$, $A^r=A\cdots A$로 정의한다. 전치행렬 $A^{\mathsf T}$는 행과 열을 바꾼 것으로 $(A^{\mathsf T})_{ij}=a_{ji}$다.

$$
\begin{bmatrix}1&2&3\\4&5&6\end{bmatrix}^{\mathsf T}
=\begin{bmatrix}1&4\\2&5\\3&6\end{bmatrix}.
$$

$A=A^{\mathsf T}$인 정사각행렬을 대칭행렬이라고 한다. $\begin{bmatrix}1&2\\2&1\end{bmatrix}$와 모든 항등행렬은 대칭이다.

### 2×2 역행렬

$AB=BA=I_n$이면 $B$를 $A$의 역행렬 $A^{-1}$이라고 한다. 행렬 $A=\begin{bmatrix}a&b\\c&d\end{bmatrix}$에서 $ad-bc\ne0$이면

$$
A^{-1}=\frac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}.
$$

실제로

$$
\begin{bmatrix}a&b\\c&d\end{bmatrix}
\begin{bmatrix}d&-b\\-c&a\end{bmatrix}
=\begin{bmatrix}ad-bc&0\\0&ad-bc\end{bmatrix}
$$

이고, 반대 순서의 곱도 같은 행렬이다. $ad-bc$로 나누면 양쪽 모두 $I_2$가 된다.

### 연립방정식 풀기

각 방정식이 $a_{i1}x_1+\cdots+a_{in}x_n=b_i$이면 계수행렬 $A$, 미지수 열벡터 $X$, 상수 열벡터 $B$를 사용해 $AX=B$로 쓴다. $A$가 가역이면 왼쪽에 $A^{-1}$을 곱해 $X=A^{-1}B$를 얻는다.

$$
M=\begin{bmatrix}7&-8&5\\-4&5&-3\\1&-1&1\end{bmatrix},\qquad
M^{-1}=\begin{bmatrix}2&3&-1\\1&2&1\\-1&-1&3\end{bmatrix}
$$

일 때

$$
\begin{cases}
7x_1-8x_2+5x_3=5,\\
-4x_1+5x_2-3x_3=-3,\\
x_1-x_2+x_3=0
\end{cases}
$$

의 해는

$$
X=M^{-1}\begin{bmatrix}5\\-3\\0\end{bmatrix}
=\begin{bmatrix}10-9\\5-6\\-5+3\end{bmatrix}
=\begin{bmatrix}1\\-1\\-2\end{bmatrix}.
$$

이를 대입하면 좌변은 차례로 $7+8-10=5$, $-4-5+6=-3$, $1+1-2=0$으로 확인된다.

## 8. 0–1 행렬과 불 연산

성분이 0 또는 1인 행렬은 관계나 연결 여부를 나타내는 데 쓰인다. 같은 크기의 두 행렬에 대해 조인(join)은 성분별 OR, 미트(meet)는 성분별 AND다.

$$
A=\begin{bmatrix}1&0&1\\0&1&0\end{bmatrix},\quad
B=\begin{bmatrix}0&1&0\\1&1&0\end{bmatrix}
$$

이면

$$
A\lor B=\begin{bmatrix}1&1&1\\1&1&0\end{bmatrix},\qquad
A\land B=\begin{bmatrix}0&0&0\\0&1&0\end{bmatrix}.
$$

불 곱 $A\odot B$는 일반 행렬곱의 곱셈을 AND로, 덧셈을 OR로 바꾼다.

$$
(A\odot B)_{ij}=\bigvee_{\ell=1}^{k}(a_{i\ell}\land b_{\ell j}).
$$

즉 중간 인덱스 $\ell$ 중 하나라도 두 성분이 모두 1이면 출력이 1이다.

$$
\begin{bmatrix}1&0\\0&1\\1&0\end{bmatrix}
\odot
\begin{bmatrix}1&1&0\\0&1&1\end{bmatrix}
=\begin{bmatrix}1&1&0\\0&1&1\\1&1&0\end{bmatrix}.
$$

예를 들어 $(2,3)$ 성분은 $(0\land0)\lor(1\land1)=1$이다. 일반 행렬곱은 해당 연결 방법의 수를 셀 수 있지만, 불 곱은 그런 방법이 존재하는지만 남긴다.

### 불 거듭제곱

$A^{[0]}=I_n$, $A^{[r]}=A\odot\cdots\odot A$로 정의한다. 일반 곱의 거듭제곱과 구별하기 위해 지수에 대괄호를 붙인다.

$$
A=\begin{bmatrix}0&0&1\\1&0&0\\1&1&0\end{bmatrix}
$$

이면 반복 계산하여

$$
A^{[2]}=\begin{bmatrix}1&1&0\\0&0&1\\1&0&1\end{bmatrix},\qquad
A^{[3]}=\begin{bmatrix}1&0&1\\1&1&0\\1&1&1\end{bmatrix},
$$

$$
A^{[4]}=\begin{bmatrix}1&1&1\\1&0&1\\1&1&1\end{bmatrix},\qquad
A^{[5]}=\begin{bmatrix}1&1&1\\1&1&1\\1&1&1\end{bmatrix}.
$$

이 $A$의 각 열에는 적어도 하나의 1이 있으므로, 모든 성분이 1인 행렬 $J$에 대해 $J\odot A=J$다. 따라서 $n\ge5$에서 $A^{[n]}=J$가 유지된다. 단순히 어떤 단계에서 전부 1이 되었다는 사실뿐 아니라, 다음 곱에서도 유지되는 이유까지 확인해야 한다.

<a id="practice"></a>

## 9. 연습문제

문제를 읽고 풀이를 적어 본 뒤 해설을 펼쳐 비교해 보자. 계산 결과뿐 아니라 사용한 정의와 추론 근거까지 설명하는 연습을 한다.

### 01. 단사와 전사 판정

다음 세 함수는 $\mathbb Z\to\mathbb Z$다. 단사·전사를 각각 판정하고 증명하거나 반례를 들자.

1. $f(n)=n-1$.
2. $f(n)=n^2+1$.
3. $f(n)=\lceil n/2\rceil$.

다음 두 $\mathbb R\to\mathbb R$ 함수가 전단사인지도 판정하자.

4. $f(x)=-3x+4$.
5. $f(x)=-3x^2+7$.

<details>
<summary>해설 보기</summary>

1. 단사·전사다. $a-1=b-1$이면 $a=b$. 임의의 정수 $y$의 원상은 $y+1$이다.
2. 둘 다 아니다. $f(1)=f(-1)=2$이고 0은 출력되지 않는다.
3. 단사는 아니다. $f(1)=f(2)=1$이다. 전사는 맞다. 각 정수 $y$에 $n=2y$를 넣으면 $\lceil2y/2\rceil=y$다.
4. 전단사다. $-3a+4=-3b+4$이면 $a=b$. 모든 실수 $y$의 원상 $(4-y)/3$이 존재한다.
5. 전단사가 아니다. $f(1)=f(-1)=4$라 단사가 아니고, 치역이 $(-\infty,7]$이어서 8 등의 원상이 없다.

</details>

### 02. 바닥·천장함수와 필요한 바이트

1. 바닥·천장함수를 정의하고 $\lfloor-2.5\rfloor,\lceil-2.5\rceil$를 계산하자.
2. 모든 실수에서 $\lceil x+y\rceil=\lceil x\rceil+\lceil y\rceil$인가?
3. $n$비트를 저장할 최소 바이트 수를 쓰고 $n=4,10,500,3000$에서 계산하자. 1바이트는 8비트다.

<details>
<summary>해설 보기</summary>

1. $\lfloor x\rfloor$는 $x$ 이하의 최대 정수, $\lceil x\rceil$은 $x$ 이상의 최소 정수다. 따라서 -3, -2다.
2. 거짓이다. $x=y=1/2$이면 왼쪽은 $\lceil1\rceil=1$, 오른쪽은 $1+1=2$다.
3. 바이트 수 $b$는 정수이고 $8b\ge n$이어야 한다. 따라서 최소값은 $b=\lceil n/8\rceil$이다.

| $n$ | $n/8$ | 최소 바이트 |
|---|---|---|
| 4 | 0.5 | 1 |
| 10 | 1.25 | 2 |
| 500 | 62.5 | 63 |
| 3000 | 375 | 375 |

나머지 비트가 하나라도 있으면 바이트를 하나 더 확보해야 한다.

</details>

### 03. 계승과 부분함수

1. $5!$를 계산하자.
2. 정수 입력에 $f(n)=1/n$을 대응시키면 전함수인가? 실제 정의되는 입력 집합을 쓰자.

<details>
<summary>해설 보기</summary>

1. $5!=5\cdot4\cdot3\cdot2\cdot1=120$이다.
2. $n=0$에서 정의되지 않으므로 정수 전체에 대한 전함수가 아니다. 정수에서 실수로의 부분함수로 볼 수 있고 실제 정의되는 입력은 $\mathbb Z\setminus\{0\}$다. 처음부터 이 집합을 정의역으로 정하면 그 정의역에 대해서는 전함수다.

</details>

### 04. 반복 대입으로 점화식 풀기

$n\ge1$에서 다음 점화식의 닫힌 공식을 반복 대입으로 구하자.

1. $a_n=a_{n-1}+5,\ a_0=2$.
2. $a_n=3a_{n-1},\ a_0=2$.
3. $a_n=a_{n-1}+n,\ a_0=1$.
4. $a_n=3a_{n-1}+1,\ a_0=1$.
5. 초기금액 5,000달러가 매년 8%씩 복리로 증가한다고 할 때 잔액 $P_n$의 점화식과 초기조건을 세우자.

<details>
<summary>해설 보기</summary>

1. $a_1=2+5,a_2=2+2\cdot5$이므로 반복 대입하면 $a_n=a_0+5n=2+5n$이다.
2. $a_n=3^2a_{n-2}=\cdots=3^na_0=2\cdot3^n$이다.
3. $a_n=a_0+1+2+\cdots+n=1+n(n+1)/2$다.
4. 상수항이 추가될 때마다 앞 단계에 3이 곱해진다.

$$
\begin{aligned}
a_n&=3(3a_{n-2}+1)+1\\
&=3^2a_{n-2}+3+1\\
&=3^na_0+\sum_{j=0}^{n-1}3^j\\
&=3^n+\frac{3^n-1}{2}=\frac{3^{n+1}-1}{2}.
\end{aligned}
$$

$n=0$이면 1이고, 이를 점화식에 대입해도 같은 일반항이 나온다.
5. $P_0=5000$, $P_n=P_{n-1}+0.08P_{n-1}=1.08P_{n-1}$이다. 따라서 $P_n=5000(1.08)^n$이다. 고정 증가율을 가정한 수열 모형이다.

</details>

### 05. 구간 합·등비합·이중합

다음을 계산하자.

1. $\sum_{i=1}^{3}\sum_{j=1}^{2}(i+j)$.
2. $\sum_{k=11}^{20}k$.
3. $\sum_{j=1}^{8}2^j$.
4. $\sum_{j=0}^{8}2(-3)^j$.
5. $\sum_{i=1}^{2}\sum_{j=1}^{3}(i+j)$.
6. $\sum_{k=100}^{200}k$.

<details>
<summary>해설 보기</summary>

1. 안쪽 합이 $(i+1)+(i+2)=2i+3$이므로 $5+7+9=21$.
2. 1부터 20까지에서 1부터 10까지를 빼면 $20\cdot21/2-10\cdot11/2=155$.
3. 첫 항 2, 공비 2, 8항인 등비합이므로 $2(2^8-1)/(2-1)=510$.
4. 첫 항 2, 공비 -3, 9항이므로

$$
\frac{2((-3)^9-1)}{-3-1}=\frac{2(-19683-1)}{-4}=9842.
$$

5. 안쪽 합은 $(i+1)+(i+2)+(i+3)=3i+6$이므로 $9+12=21$. 1번과 값은 같아도 합치는 순서와 범위가 다르다.
6. 100도 포함되므로 1부터 99까지를 뺀다.

$$
\frac{200\cdot201}{2}-\frac{99\cdot100}{2}=20100-4950=15150.
$$

항이 101개이고 양 끝의 평균이 150이어서 $101\cdot150$으로도 확인된다.

</details>

### 06. 망원합으로 합 공식 유도하기

1. $\sum_{j=1}^n(a_j-a_{j-1})=a_n-a_0$를 보이자.
2. $k^2-(k-1)^2=2k-1$을 이용해 $\sum_{k=1}^nk$를 구하자.
3. $k^3-(k-1)^3=3k^2-3k+1$을 이용해 $\sum_{k=1}^nk^2$를 구하자.

<details>
<summary>해설 보기</summary>

1. $(a_1-a_0)+(a_2-a_1)+\cdots+(a_n-a_{n-1})$에서 중간 항이 모두 상쇄되어 $a_n-a_0$만 남는다.
2. 양변을 $k=1$부터 $n$까지 더하면 $n^2=2\sum k-n$. 따라서 $\sum k=n(n+1)/2$다.
3. 같은 방식으로 $n^3=3\sum k^2-3\sum k+n$이다. 2번을 대입하면

$$
\sum_{k=1}^nk^2=\frac{n^3+3n(n+1)/2-n}{3}
=\frac{n(n+1)(2n+1)}6.
$$

각 합에 상수항 1이 $n$번 들어가는 점을 빠뜨리지 않는다.

</details>

### 07. 행렬의 크기와 곱의 순서

1. $m\times k$ 행렬 $A$와 $k\times n$ 행렬 $B$의 곱 크기는?
2. $A$가 $2\times3$, $B$가 $4\times2$이면 $AB,BA$는 각각 정의되는가?
3. $A$가 $m\times n$일 때 $AB,BA$가 모두 정의될 $B$의 크기는? 두 곱은 항상 같은가?

<details>
<summary>해설 보기</summary>

1. $m\times n$이다. 왼쪽의 행과 오른쪽의 열마다 하나의 성분을 만든다.
2. $AB$는 안쪽 크기 3과 4가 달라 정의되지 않는다. $BA$는 2가 맞아 $4\times3$이다.
3. $B$가 $n\times m$이어야 한다. $AB$는 $m\times m$, $BA$는 $n\times n$으로 크기부터 다를 수 있다. 크기가 같더라도 계산에 쓰는 행과 열이 달라 일반적으로 같지 않다.

</details>

### 08. 행렬 덧셈과 2×2 곱셈

다음 $A,B$에 대해 $A+B$와 $AB$를 계산하자.

$$
A=\begin{bmatrix}1&2\\3&4\end{bmatrix},\qquad
B=\begin{bmatrix}0&1\\1&0\end{bmatrix}.
$$

<details>
<summary>해설 보기</summary>

덧셈은 같은 위치끼리 더한다.

$$
A+B=\begin{bmatrix}1+0&2+1\\3+1&4+0\end{bmatrix}
=\begin{bmatrix}1&3\\4&4\end{bmatrix}.
$$

곱셈은 행과 열을 곱해 더한다.

$$
AB=\begin{bmatrix}1\cdot0+2\cdot1&1\cdot1+2\cdot0\\3\cdot0+4\cdot1&3\cdot1+4\cdot0\end{bmatrix}
=\begin{bmatrix}2&1\\4&3\end{bmatrix}.
$$

이 $B$를 오른쪽에서 곱하면 $A$의 두 열을 서로 바꾸는 효과가 있다.

</details>

### 09. 교환법칙의 반례

$A=\begin{bmatrix}1&0\\1&1\end{bmatrix}$, $B=\begin{bmatrix}1&1\\0&1\end{bmatrix}$일 때 $AB,BA$를 계산하자.

<details>
<summary>해설 보기</summary>

각 행과 열의 내적을 계산하면

$$
AB=\begin{bmatrix}1\cdot1+0\cdot0&1\cdot1+0\cdot1\\1\cdot1+1\cdot0&1\cdot1+1\cdot1\end{bmatrix}
=\begin{bmatrix}1&1\\1&2\end{bmatrix},
$$

$$
BA=\begin{bmatrix}1\cdot1+1\cdot1&1\cdot0+1\cdot1\\0\cdot1+1\cdot1&0\cdot0+1\cdot1\end{bmatrix}
=\begin{bmatrix}2&1\\1&1\end{bmatrix}.
$$

$(1,1)$ 성분부터 다르므로 $AB\ne BA$다. 정사각행렬끼리라도 교환법칙이 항상 성립하지 않는다.

</details>

### 10. 3×3 행렬과 3×4 행렬의 곱

다음 $AB$를 구하자.

$$
A=\begin{bmatrix}1&-3&0\\1&2&2\\2&1&-1\end{bmatrix},\qquad
B=\begin{bmatrix}1&-1&2&3\\-1&0&3&-1\\-3&-2&0&2\end{bmatrix}.
$$

<details>
<summary>해설 보기</summary>

결과는 $3\times4$다. 각 행을 $B$의 네 열과 차례로 곱한다.

$$
\begin{aligned}
\text{첫 행}&=(1+3+0,\ -1+0+0,\ 2-9+0,\ 3+3+0)\\
&=(4,-1,-7,6),\\
\text{둘째 행}&=(1-2-6,\ -1+0-4,\ 2+6+0,\ 3-2+4)\\
&=(-7,-5,8,5),\\
\text{셋째 행}&=(2-1+3,\ -2+0+2,\ 4+3+0,\ 6-1-2)\\
&=(4,0,7,3).
\end{aligned}
$$

따라서

$$
AB=\begin{bmatrix}4&-1&-7&6\\-7&-5&8&5\\4&0&7&3\end{bmatrix}.
$$

</details>

### 11. 항등행렬과 대칭행렬

1. $3\times3$ 정사각행렬 $A$의 $A^0$는?
2. $\begin{bmatrix}1&2\\2&1\end{bmatrix}$는 대칭행렬인가?
3. 대칭행렬의 정의를 쓰고 모든 $I_n$이 대칭임을 보이자.

<details>
<summary>해설 보기</summary>

1. 정의상 $A^0=I_3=\begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix}$다.
2. 행과 열을 바꾸어도 같으므로 대칭이다. 특히 두 비대각 성분이 모두 2다.
3. $A=A^{\mathsf T}$인 정사각행렬, 즉 모든 $i,j$에서 $a_{ij}=a_{ji}$인 행렬이다. $I_n$은 대각 성분이 모두 1이고 비대각 성분이 모두 0이므로 언제나 이 조건을 만족한다.

</details>

### 12. 조인·미트와 불 곱

1. $A=[1\ 0],B=[0\ 1]$일 때 $A\lor B,A\land B$를 구하자.
2. $C=[1\ 0\ 1],D=[0\ 1\ 1]$에 대해서도 계산하자.
3. 조인과 미트의 성분 정의를 쓰자.
4. 일반 행렬곱과 불 곱의 $(i,j)$ 성분을 비교하자.

<details>
<summary>해설 보기</summary>

1. 성분마다 OR하면 $[1\ 1]$, AND하면 $[0\ 0]$이다.
2. $C\lor D=[1\ 1\ 1]$, $C\land D=[0\ 0\ 1]$이다. 마지막 위치만 두 입력이 모두 1이다.
3. $(A\lor B)_{ij}=a_{ij}\lor b_{ij}$, $(A\land B)_{ij}=a_{ij}\land b_{ij}$이며 같은 크기끼리 정의한다.
4. 안쪽 차원이 $k$일 때

$$
(AB)_{ij}=\sum_{\ell=1}^ka_{i\ell}b_{\ell j},\qquad
(A\odot B)_{ij}=\bigvee_{\ell=1}^k(a_{i\ell}\land b_{\ell j}).
$$

일반 곱은 곱해서 더하지만, 불 곱은 AND한 결과들을 OR한다. 조건을 만족하는 중간 인덱스가 하나라도 있으면 불 곱의 성분은 1이다.

</details>

### 13. 2×2 역행렬 공식 검증

$A=\begin{bmatrix}a&b\\c&d\end{bmatrix}$, $ad-bc\ne0$이다. $B=\dfrac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$에 대해 $AB=BA=I_2$임을 직접 계산하자.

<details>
<summary>해설 보기</summary>

양쪽 곱을 각각 계산한다.

$$
AB=\frac1{ad-bc}\begin{bmatrix}ad-bc&-ab+ba\\cd-dc&-cb+da\end{bmatrix}
=\frac1{ad-bc}\begin{bmatrix}ad-bc&0\\0&ad-bc\end{bmatrix}=I_2.
$$

$$
BA=\frac1{ad-bc}\begin{bmatrix}da-bc&db-bd\\-ca+ac&-cb+ad\end{bmatrix}
=I_2.
$$

행렬곱의 교환법칙을 가정하지 않고 두 방향을 각각 보였다. $ad-bc\ne0$이므로 나눗셈도 정의된다. 따라서 $B=A^{-1}$이다.

</details>

### 14. 연립방정식의 행렬 표현

1. $a_{i1}x_1+\cdots+a_{in}x_n=b_i$ ($i=1,\ldots,n$)를 $AX=B$로 쓸 수 있음을 보이자.
2. $A$가 가역이면 해가 $X=A^{-1}B$임을 보이자.

<details>
<summary>해설 보기</summary>

1. $A=[a_{ij}]$, $X=[x_1,\ldots,x_n]^{\mathsf T}$, $B=[b_1,\ldots,b_n]^{\mathsf T}$로 둔다. 곱의 $i$번째 성분은 $(AX)_i=\sum_{j=1}^na_{ij}x_j$여서 $i$번째 방정식의 좌변과 같다. 그러므로 성분별 방정식 전체가 $AX=B$와 동치다.
2. $AX=B$ 양변 왼쪽에 $A^{-1}$을 곱하면

$$
A^{-1}(AX)=(A^{-1}A)X=I_nX=X=A^{-1}B.
$$

반대로 이 $X$를 대입하면 $AX=AA^{-1}B=B$이므로 실제 해다. 모든 해가 이 식을 만족하므로 유일하다. 행렬곱의 순서를 바꿔 오른쪽에 곱하면 안 된다.

</details>

### 15. 주어진 역행렬로 방정식 풀기

다음 $M,M^{-1}$은 서로 역행렬이다.

$$
M=\begin{bmatrix}7&-8&5\\-4&5&-3\\1&-1&1\end{bmatrix},\quad
M^{-1}=\begin{bmatrix}2&3&-1\\1&2&1\\-1&-1&3\end{bmatrix}.
$$

$7x_1-8x_2+5x_3=5$, $-4x_1+5x_2-3x_3=-3$, $x_1-x_2+x_3=0$을 풀자.

<details>
<summary>해설 보기</summary>

상수 열벡터는 $B=[5,-3,0]^{\mathsf T}$다. 따라서

$$
X=M^{-1}B
=\begin{bmatrix}2\cdot5+3(-3)-0\\1\cdot5+2(-3)+0\\-1\cdot5-1(-3)+3\cdot0\end{bmatrix}
=\begin{bmatrix}1\\-1\\-2\end{bmatrix}.
$$

검산하면 세 좌변이 $7+8-10=5$, $-4-5+6=-3$, $1+1-2=0$이다. 그러므로 $(x_1,x_2,x_3)=(1,-1,-2)$다.

</details>
