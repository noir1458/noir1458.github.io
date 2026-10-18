---
title: "01. 명제 논리, 응용, 명제의 동치"
slug: discrete-mathematics-propositional-logic
publishedAt: '2026-10-14'
categories: discrete_mathematics
math: true

---

명제 논리는 문장이 참인지 거짓인지, 그리고 여러 문장을 연결했을 때 어떤 결론이 나오는지를 다룬다. 조건문의 방향을 정확히 읽는 것에서 시작해 진리표, 동치 변형, 시스템 명세와 충족가능성까지 연결해 보자.

## 1. 명제와 논리 연결사

**명제**는 참 또는 거짓 중 하나의 진리값을 갖는 선언문이다. “1 + 0 = 1”은 참인 명제이고, “5는 짝수다”는 거짓인 명제다. 거짓이라고 해서 명제가 아닌 것은 아니다.

명령문인 “앉아라”, 의문문인 “지금 몇 시인가”, 변수의 값이 정해지지 않은 “x + 1 = 2”는 그 자체로 명제가 아니다. “이 문장은 거짓이다”처럼 참과 거짓을 일관되게 부여할 수 없는 자기 언급 문장도 고전적인 이값 논리의 명제로 취급하지 않는다.

명제 변수는 보통 $p,q,r$로 쓰고, 참과 거짓은 각각 T와 F로 표시한다. 더 나누지 않은 명제를 원자 명제, 논리 연결사로 결합한 명제를 복합 명제라고 한다.

| 연결사 | 표기 | 참이 되는 경우 |
| --- | --- | --- |
| 부정 | $\neg p$ | $p$가 거짓일 때 |
| 논리곱 | $p\land q$ | 둘 다 참일 때 |
| 논리합 | $p\lor q$ | 적어도 하나가 참일 때 |
| 배타적 논리합 | $p\oplus q$ | 정확히 하나만 참일 때 |
| 조건문 | $p\to q$ | $p$가 참이고 $q$가 거짓인 경우를 제외한 모든 경우 |
| 쌍조건문 | $p\leftrightarrow q$ | 두 진리값이 같을 때 |

### 포함적 ‘또는’과 배타적 ‘또는’

“미적분 또는 컴퓨터과학을 이수하면 신청할 수 있다”는 보통 두 과목을 모두 이수한 경우도 허용한다. 이때는 $\lor$다. 반면 한 가지 음료를 고르는 상황에서 “커피 또는 차”라고 하면 둘 중 하나만 선택하는 $\oplus$로 해석한다. 자연어의 ‘또는’은 문맥에 따라 달라지므로 무엇을 허용하는지 먼저 확인해야 한다.

“집에 있지만 비가 온다”의 ‘하지만’도 논리적으로는 논리곱이다. 감정이나 대비의 뉘앙스가 달라도 두 문장이 모두 참이라는 조건은 같다.

| $p$ | $q$ | $\neg p$ | $p\land q$ | $p\lor q$ | $p\oplus q$ | $p\to q$ | $p\leftrightarrow q$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T | T | F | T | T | F | T | T |
| T | F | F | F | T | T | F | F |
| F | T | T | F | T | T | T | F |
| F | F | T | F | F | F | T | T |

예를 들어 $p=T,q=F$라면 $\neg p=F$, $p\land q=F$, $p\lor q=T$다. $p\land\neg q$를 참으로 만드는 조합은 $(T,F)$ 하나뿐이다. “메모리가 적어도 32GB다”의 부정은 “메모리가 32GB보다 작다”이다. 경계값 32GB를 어느 쪽에 포함하는지 주의하자.

## 2. 조건문, 필요조건과 충분조건

$p\to q$는 **p가 성립하는데 q가 성립하지 않는 경우를 허용하지 않는다**는 뜻이다. 따라서 $p$가 거짓이면 조건문은 참이다. 두 문장 사이에 현실적인 인과관계가 있어야 한다는 뜻은 아니다.

“스마트폰이 있으면 2 + 3 = 5다”는 결론이 항상 참이므로 참이다. “스마트폰이 있으면 2 + 3 = 6이다”는 스마트폰이 없을 때만 참이다.

같은 조건문을 여러 방식으로 표현할 수 있다.

| 표현 | 뜻 |
| --- | --- |
| if p, then q / q if p / q when p | $p\to q$ |
| p only if q | p가 성립하려면 q가 필요하다 |
| p is sufficient for q | p는 q의 충분조건이다 |
| q is necessary for p | q는 p의 필요조건이다 |
| q unless not p | $\neg p$가 아니라면 q, 즉 $p\to q$ |

“90점 이상인 경우에만 A를 받을 수 있다”에서 $p$를 A를 받음, $q$를 90점 이상이라고 하면 $p\to q$다. **90점 이상이라는 사실만으로 A를 받는다고 결론 낼 수는 없다.**

### 역, 이, 대우

| 이름 | 식 |
| --- | --- |
| 원래 조건문 | $p\to q$ |
| 역 | $q\to p$ |
| 이 | $\neg p\to\neg q$ |
| 대우 | $\neg q\to\neg p$ |

원래 조건문과 대우는 동치이고, 역과 이는 서로 동치다.

$$
p\to q\equiv\neg p\lor q\equiv\neg q\to\neg p.
$$

“정삼각형이면 이등변삼각형이다”의 대우는 “이등변삼각형이 아니면 정삼각형이 아니다”다. 역인 “이등변삼각형이면 정삼각형이다”는 거짓이므로 원래 조건문과 역을 혼동하면 안 된다.

### 쌍조건문

$$
p\leftrightarrow q\equiv(p\to q)\land(q\to p).
$$

두 진리값이 다르면 참인 쪽에서 거짓인 쪽으로 향하는 조건문이 거짓이다. 둘 다 참이면 두 조건문이 모두 참이고, 둘 다 거짓이면 두 조건문의 전제가 모두 거짓이므로 역시 참이다. 따라서 쌍조건문은 두 값이 같을 때만 참이다.

일상에서는 “밥을 다 먹으면 디저트를 먹어도 된다”를 필요충분조건처럼 받아들이기도 한다. 수학에서는 그런 암묵적인 해석을 덧붙이지 않고, 한 방향인지 양방향인지 명시해야 한다.

## 3. 진리표를 만드는 방법

명제 변수가 $n$개이면 가능한 입력은 $2^n$개다. 각 입력에 대해 안쪽 부분식부터 계산하고 마지막 열에 전체 식의 값을 적는다. 보통 우선순위는 $\neg$, $\land$, $\lor$, $\to$, $\leftrightarrow$ 순서다. 헷갈리는 식은 괄호를 쓰는 편이 낫다.

$$
\neg p\lor q\land r=(\neg p)\lor(q\land r).
$$

예를 들어 $(p\lor\neg q)\to(p\land q)$의 진리표는 다음과 같다.

| $p$ | $q$ | $\neg q$ | $p\lor\neg q$ | $p\land q$ | 전체 식 |
| --- | --- | --- | --- | --- | --- |
| T | T | F | T | T | T |
| T | F | T | T | F | F |
| F | T | F | F | F | T |
| F | F | T | T | F | F |

세 변수 식 $(p\lor q)\to\neg r$는 다음과 같다.

| $p$ | $q$ | $r$ | $p\lor q$ | $\neg r$ | 전체 식 |
| --- | --- | --- | --- | --- | --- |
| T | T | T | T | F | F |
| T | T | F | T | T | T |
| T | F | T | T | F | F |
| T | F | F | T | T | T |
| F | T | T | T | F | F |
| F | T | F | T | T | T |
| F | F | T | F | F | T |
| F | F | F | F | T | T |

**진리표의 행 수와 서로 다른 논리함수의 수는 다르다.** 입력이 $2^n$개이고 각 입력의 출력은 T 또는 F이므로, 서로 동치가 아닌 논리함수는 $2^{2^n}$개다. 변수 4개라면 행은 16개, 논리함수는 $2^{16}=65\,536$개다.

### 비트 연산

T를 1, F를 0으로 보면 같은 연산을 비트 문자열의 각 자리에 적용할 수 있다.

```text
A       01 1011 0110
B       11 0001 1101
A OR B  11 1011 1111
A AND B 01 0001 0100
A XOR B 10 1010 1011
```

비트 문자열의 길이는 비트의 개수이며 빈 문자열의 길이는 0이다.

## 4. 자연어와 시스템 요구사항을 논리식으로 바꾸기

먼저 원자 명제를 정하고, 그다음 연결사의 범위와 방향을 정한다.

| 문장 | 변수 | 논리식 |
| --- | --- | --- |
| 해리네 집이나 시골에 가면 쇼핑하지 않는다 | p: 해리네 집, q: 시골, r: 쇼핑 | $(p\lor q)\to\neg r$ |
| 컴퓨터공학과이거나 신입생이 아닌 경우에만 인터넷에 접속한다 | a: 접속, c: 전공자, f: 신입생 | $a\to(c\lor\neg f)$ |
| 맑고 시간이 있으면 등산한다 | p: 맑음, q: 여유, r: 등산 | $(p\land q)\to r$ |
| 배터리가 20% 미만이면 저전력 모드로 바뀌거나 경고음이 난다 | p: 배터리 부족, q: 모드 전환, r: 경고음 | $p\to(q\lor r)$ |
| 16세 초과가 아니라면 키 4피트 미만인 사람은 놀이기구를 탈 수 없다 | p: 탑승 가능, q: 키 미달, r: 16세 초과 | $(q\land\neg r)\to\neg p$ |
| 파일 시스템이 가득 차면 자동 응답을 보낼 수 없다 | p: 응답 가능, q: 가득 참 | $q\to\neg p$ |

### 일관된 명세

요구사항을 모두 동시에 참으로 만들 수 있으면 명세가 일관적이다. $p$를 “진단 메시지를 저장한다”, $q$를 “재전송한다”라고 하자.

$$
p\lor q,\qquad\neg p,\qquad p\to q.
$$

$p=F,q=T$이면 모두 참이다. 여기에 $\neg q$를 추가하면 $p$와 $q$가 둘 다 거짓이어야 하므로 첫 요구사항과 모순된다.

다른 예로 $p\lor q$, $p\to\neg q$, $\neg p\lor\neg q$는 $(p,q)=(T,F)$에서 모두 참이므로 일관적이다. 반면 $p\to q$, $q\to r$, $p$, $\neg r$는 일관적이지 않다. 앞의 세 조건으로 $r$을 얻는데 마지막 조건이 이를 부정한다.

### 부울 검색

AND는 두 조건을 모두 만족하는 결과, OR는 하나 이상 만족하는 결과, NOT은 특정 조건을 제외하는 결과를 찾는다. 예를 들어 뉴멕시코 또는 애리조나의 대학을 찾는 조건은 `((NEW AND MEXICO) OR ARIZONA) AND UNIVERSITIES`처럼 범위를 명시할 수 있다. 검색 서비스마다 지원하는 문법은 다르므로 논리 조건과 입력 문법은 구분해야 한다.

## 5. 논리 퍼즐과 회로

### 보물 상자

상자 1과 2에는 각각 “이 상자는 비어 있다”, 상자 3에는 “보물은 상자 2에 있다”라고 적혀 있다. 세 문장 중 정확히 하나만 참이라면 보물은 어디에 있을까?

$p_i$를 보물이 상자 $i$에 있다는 명제로 두면 비문은 $\neg p_1$, $\neg p_2$, $p_2$다. 뒤의 두 문장은 서로 부정이므로 항상 정확히 하나만 참이다. 따라서 첫 문장은 거짓이어야 하고, 보물은 **상자 1**에 있다.

### 기사와 거짓말쟁이

기사는 항상 참을, 거짓말쟁이는 항상 거짓을 말한다고 하자. A가 “B는 기사다”, B가 “우리는 서로 다른 부류다”라고 말했다.

A가 기사라면 B도 기사여야 한다. 그런데 두 사람은 같은 부류가 되어 B의 말이 거짓이므로 모순이다. 따라서 A는 거짓말쟁이고, A의 말이 거짓이므로 B도 거짓말쟁이다. 두 사람이 같은 부류라는 사실은 B의 거짓말과도 일치한다.

A가 “나는 기사이거나 B는 기사다”라고만 말했다면 두 사람의 유형을 유일하게 결정할 수 없다. A가 기사라면 B는 어느 유형이어도 문장이 참이다. A가 거짓말쟁이라면 문장이 거짓이어야 하므로 B도 거짓말쟁이다. 가능한 조합은 (기사, 기사), (기사, 거짓말쟁이), (거짓말쟁이, 거짓말쟁이)다.

### 이마에 진흙이 묻은 두 아이

두 아이 모두 이마에 진흙이 묻었고 서로의 이마만 볼 수 있다고 하자. 아버지가 “적어도 한 명에게 진흙이 묻었다”고 말한 뒤, 자기 이마에 진흙이 있는지 아는지를 동시에 묻는다.

첫 번째에는 둘 다 모른다. 두 번째에는 둘 다 안다고 답한다. 자신에게 진흙이 없었다면 상대는 첫 번째 질문에 이미 알았다고 답했을 것이기 때문이다. 상대도 몰랐다는 대답이 새로운 정보가 된다.

### 회로를 식으로 읽기

회로의 중간 출력에 이름을 붙이면 게이트를 통과할 때마다 값을 계산할 수 있다. 예를 들어 다음 연결은 $y=(p\land\neg q)\lor\neg r$를 만든다.

```text
nq = NOT(q)
nr = NOT(r)
a  = AND(p, nq)
y  = OR(a, nr)
```

입력 $(p,q,r)$를 TTT, TTF, TFT, TFF, FTT, FTF, FFT, FFF 순으로 넣으면 출력은 **F, T, T, T, F, T, F, T**다.

$(p\lor\neg r)\land(\neg p\lor(q\lor\neg r))$를 구현하려면 `nr = NOT(r)`, `np = NOT(p)`, `a = OR(p,nr)`, `b = OR(q,nr)`, `c = OR(np,b)`, `y = AND(a,c)`로 연결하면 된다.

## 6. 논리적 동치와 변형 법칙

모든 입력에서 두 식의 진리값이 같으면 논리적으로 동치이며 $A\equiv B$로 쓴다. 이는 $A\leftrightarrow B$가 항진명제라는 뜻이다. 항상 참인 식은 항진명제, 항상 거짓인 식은 모순명제, 참인 경우와 거짓인 경우가 모두 있는 식은 불확정 명제다.

| 법칙 | 논리곱과 논리합의 형태 |
| --- | --- |
| 항등 | $p\land T\equiv p$, $p\lor F\equiv p$ |
| 지배 | $p\land F\equiv F$, $p\lor T\equiv T$ |
| 멱등 | $p\land p\equiv p$, $p\lor p\equiv p$ |
| 부정 | $p\land\neg p\equiv F$, $p\lor\neg p\equiv T$ |
| 이중부정 | $\neg\neg p\equiv p$ |
| 교환 | $p\land q\equiv q\land p$, $p\lor q\equiv q\lor p$ |
| 결합 | $(p\land q)\land r\equiv p\land(q\land r)$, $(p\lor q)\lor r\equiv p\lor(q\lor r)$ |
| 분배 | $p\land(q\lor r)\equiv(p\land q)\lor(p\land r)$, $p\lor(q\land r)\equiv(p\lor q)\land(p\lor r)$ |
| 흡수 | $p\land(p\lor q)\equiv p$, $p\lor(p\land q)\equiv p$ |
| 드모르간 | $\neg(p\land q)\equiv\neg p\lor\neg q$, $\neg(p\lor q)\equiv\neg p\land\neg q$ |

조건문과 쌍조건문도 다른 연결사로 바꿀 수 있다.

$$
\begin{aligned}
p\to q&\equiv\neg p\lor q, &\neg(p\to q)&\equiv p\land\neg q,\\
p\lor q&\equiv\neg p\to q, &p\land q&\equiv\neg(p\to\neg q),\\
p\leftrightarrow q&\equiv(p\land q)\lor(\neg p\land\neg q),\\
\neg(p\leftrightarrow q)&\equiv p\leftrightarrow\neg q\equiv p\oplus q.
\end{aligned}
$$

또한 $(p\to q)\land(p\to r)\equiv p\to(q\land r)$, $(p\to r)\land(q\to r)\equiv(p\lor q)\to r$이다. 논리곱을 논리합으로 바꾸면 각각 $p\to(q\lor r)$와 $(p\land q)\to r$를 얻는다.

여러 식을 묶을 때는 $\bigwedge_{j=1}^n p_j$와 $\bigvee_{j=1}^n p_j$를 쓴다. 드모르간 법칙도 이 표기로 일반화할 수 있다.

$$
\neg\bigwedge_{j=1}^{n}p_j\equiv\bigvee_{j=1}^{n}\neg p_j,\qquad
\neg\bigvee_{j=1}^{n}p_j\equiv\bigwedge_{j=1}^{n}\neg p_j.
$$

### 동치 변형의 실제 계산

$$
\begin{aligned}
\neg(p\lor(\neg p\land q))
&\equiv\neg p\land\neg(\neg p\land q)\\
&\equiv\neg p\land(p\lor\neg q)\\
&\equiv(\neg p\land p)\lor(\neg p\land\neg q)\\
&\equiv\neg p\land\neg q.
\end{aligned}
$$

각 줄에는 드모르간, 이중부정, 분배, 부정·항등 법칙을 차례로 적용했다. 같은 방식으로 $(p\land q)\to(p\lor q)$를 바꾸면 $\neg p\lor\neg q\lor p\lor q\equiv T$가 되어 항진명제임을 알 수 있다.

## 7. 충족가능성, DNF와 CNF

어떤 입력에서라도 참이 되면 **충족 가능**, 모든 입력에서 거짓이면 **충족 불가능**이다. 항진명제는 충족 가능하지만, 충족 가능한 식이 반드시 항진명제인 것은 아니다.

리터럴은 명제 변수 또는 그 부정이다. DNF는 리터럴의 논리곱들을 논리합으로 연결한 형태이고, CNF는 리터럴의 논리합들을 논리곱으로 연결한 형태다. 예를 들어 $(p\land\neg q)\lor r$는 DNF이고, $(p\lor q)\land(\neg p\lor r)$는 CNF다.

다음 식을 보자.

$$
A=(p\lor\neg q)\land(q\lor\neg r)\land(r\lor\neg p).
$$

이는 $q\to p$, $r\to q$, $p\to r$를 모두 요구하므로 세 진리값이 모두 같아야 한다. TTT와 FFF가 해다.

$$
B=(p\lor q\lor r)\land(\neg p\lor\neg q\lor\neg r)
$$

는 참인 변수와 거짓인 변수가 각각 하나 이상 있어야 한다. $A$와 $B$는 각각 충족 가능하지만, **$A\land B$는 충족 불가능**하다.

### n-여왕 문제

$p_{ij}$를 체스판의 $i$행 $j$열에 여왕이 있다는 명제로 두자. 각 행에 정확히 하나, 각 열과 각 대각선에 최대 하나를 두면 된다.

$$
Q_1=\bigwedge_{i=1}^n\bigvee_{j=1}^n p_{ij}
$$

$$
Q_2=\bigwedge_{i=1}^n\bigwedge_{1\le j<k\le n}(\neg p_{ij}\lor\neg p_{ik})
$$

$$
Q_3=\bigwedge_{j=1}^n\bigwedge_{1\le i<k\le n}(\neg p_{ij}\lor\neg p_{kj})
$$

대각선은 서로 다른 두 칸에 대해 $|i-k|=|j-\ell|$인지를 이용한다.

$$
Q_4=\bigwedge_{\substack{1\le i<k\le n\\1\le j,\ell\le n\\|i-k|=|j-\ell|}}
(\neg p_{ij}\lor\neg p_{k\ell}).
$$

$Q_1\land Q_2\land Q_3\land Q_4$를 참으로 만드는 배정이 해다. 각 행에 하나씩 있으므로 여왕은 정확히 $n$개이며, 열마다 최대 하나라는 조건까지 적용하면 각 열에도 하나씩 놓인다.

### 스도쿠

$p_{ijn}$을 $i$행 $j$열의 숫자가 $n$이라는 명제로 두면 변수는 $9^3=729$개다. 규칙을 다음 식으로 옮긴다.

$$
\begin{aligned}
C_1&=\bigwedge_{i=1}^9\bigwedge_{j=1}^9\bigvee_{n=1}^9p_{ijn},\\
C_2&=\bigwedge_{i=1}^9\bigwedge_{j=1}^9\bigwedge_{1\le n<m\le9}(\neg p_{ijn}\lor\neg p_{ijm}),\\
C_3&=\bigwedge_{i=1}^9\bigwedge_{n=1}^9\bigvee_{j=1}^9p_{ijn},\\
C_4&=\bigwedge_{j=1}^9\bigwedge_{n=1}^9\bigvee_{i=1}^9p_{ijn},\\
C_5&=\bigwedge_{r=0}^2\bigwedge_{s=0}^2\bigwedge_{n=1}^9
\bigvee_{i=1}^3\bigvee_{j=1}^3p_{3r+i,3s+j,n}.
\end{aligned}
$$

$C_1,C_2$는 각 칸에 정확히 한 숫자, $C_3,C_4,C_5$는 각 행·열·블록에 모든 숫자가 나타난다는 조건이다. 여기에 이미 채워진 숫자에 해당하는 명제를 참으로 고정한다. 진리표를 직접 만들면 $2^{729}$행이 필요하므로 실제로는 제약을 이용하는 탐색 방법이 필요하다.

## 8. 연습문제와 풀이

### 조건문의 방향과 부정

| 문제 | 풀이 |
| --- | --- |
| 도서관에는 가지만 커피는 마시지 않는다 | $p\land\neg q$ |
| “비가 오지 않으면 등산한다”의 대우 | 등산하지 않으면 비가 온다 |
| 골드 회원이거나 구매액이 50만원 이상이면 무료 배송이다 | $(g\lor a)\to f$ |
| $\neg(p\land\neg q)$ | $\neg p\lor q$ |
| $\neg(\neg p\lor\neg q)$ | $p\land q$ |
| $p\land(q\lor p)$ | 분배하면 $(p\land q)\lor p\equiv p$ |
| $(p\lor q)\lor(\neg p\lor r)$ | $p\lor\neg p\lor q\lor r\equiv T$ |
| 휴대폰과 노트북을 모두 가진다는 말의 부정 | 휴대폰이 없거나 노트북이 없다 |
| Heather 또는 Steve가 공연에 간다는 말의 부정 | 두 사람 모두 공연에 가지 않는다 |

### 진리표와 동치

$p\lor\neg q$와 $q\to p$는 입력 TT, TF, FT, FF에서 모두 **T, T, F, T**를 갖는다. 따라서 동치다.

$p\to(p\lor q)$는 항상 참이고, $(p\land q)\land\neg(p\lor q)$는 항상 거짓이다. $(p\to q)\land(\neg p\to q)$는 $(\neg p\lor q)\land(p\lor q)\equiv q$로 줄어든다.

“공부하지 않으면서 합격하는 경우는 없다”는 $\neg(\neg p\land q)\equiv q\to p$이다. 이는 $p\to q$의 **역**에 해당한다. 두 문장을 같은 뜻으로 읽지 않도록 주의하자.

$$
\neg((p\lor q)\land r)\equiv(\neg p\land\neg q)\lor\neg r.
$$

### 충족가능성

$(p\lor q)\land(\neg p\lor\neg q)\land(p\lor\neg q)\land(\neg p\lor q)$는 앞의 두 절이 서로 다른 값을, 뒤의 두 절이 같은 값을 요구하므로 충족 불가능하다.

반면 $(p\lor q)\land(\neg p\lor r)\land(\neg q\lor\neg r)$는 $(p,q,r)=(T,F,T)$에서 참이다.

### 접근 권한 요구사항

$p$는 유효한 비밀번호 입력, $q$는 접근 허용, $r$은 구독료 지불이라고 하자.

1. 구독료는 냈지만 유효한 비밀번호를 입력하지 않았다: $r\land\neg p$.
2. 구독료를 내고 유효한 비밀번호를 입력하면 접근이 허용된다: $(r\land p)\to q$.
3. 구독료를 내지 않으면 접근이 거부된다: $\neg r\to\neg q$.

두 식의 진리표를 직접 계산하면 다음과 같다.

| $p$ | $q$ | $(p\land q)\to p$ | $\neg p\to(p\to q)$ |
|---|---|---|---|
| T | T | T | T |
| T | F | T | T |
| F | T | T | T |
| F | F | T | T |

두 식의 마지막 열은 모두 T다. 첫 식은 논리곱이 참이면 그 구성 명제도 참이기 때문이고, 둘째 식은 $\neg p$가 참일 때 안쪽 조건문의 전제 $p$가 거짓이기 때문이다.

마지막으로 조건문의 연쇄를 동치 법칙으로 확인해 보자.

$$
\begin{aligned}
&[(p\to q)\land(q\to r)]\to(p\to r)\\
&\equiv\neg[(\neg p\lor q)\land(\neg q\lor r)]\lor\neg p\lor r\\
&\equiv(p\land\neg q)\lor(q\land\neg r)\lor\neg p\lor r\\
&\equiv(\neg p\lor\neg q)\lor(q\lor r)\\
&\equiv T.
\end{aligned}
$$

세 번째 줄에서 흡수·분배 법칙으로 $(p\land\neg q)\lor\neg p\equiv\neg p\lor\neg q$, $(q\land\neg r)\lor r\equiv q\lor r$를 적용했다.
