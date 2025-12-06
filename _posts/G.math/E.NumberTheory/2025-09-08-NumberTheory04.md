---
title: 2.3.2.The Greatest Common Divisor
tags: NumberTheory
categories:
- NumberTheory
---

## Definition
- Let $a,b\in \mathbb{Z} $. The greatest common divisor of a and b is the positive integer d satisfying  

1. $ d \mid a \text{ and } d\mid b$ (common divisor)  
2. $ \text{if } c \mid a \text{ and } c \mid b \text{ ,then } c \le d $ (greatest)  

In this case we write $d=gcd(a,b)$  

## How can we find the value of gcd(a,b)?
1. Find all positive divisors of a and b
2. Find all common divisors
3. Choose the greatest one

## some value of -12x + 30y for $ x,y \in \mathbb{Z}$

![](/images/2025-09-05-NumberTheory04/2025-09-05-NumberTheory04-2025-09-08-19-44-04.png)  

observation
- There exist $ x,y \in \mathbb{Z}$ such that $-12x +30y = 6$
    - 어떤 정수 x,y가 존재해서 결과 6이 항상 성립하는가? - 증명해볼것
- Each number is multiples of 6.
    - $\because -12x+30y = 6(-2x+5y)$
    - 모든 수가 6의 배수다. 6으로 묶으면 되므로 쉽게 알 수 있다.
     

Recall : $gcd(-12,30) = 6$

## Theorem 2.3.

Given $a,b \in \mathbb{Z} \left(a \neq 0 \text{ or } b\neq 0 \right), \text{let } d=gcd(a,b) $  
$ \Rightarrow $ There exists $x,y \in \mathbb{Z}$ such that $ax+by = d$

### 표의 숫자는 유일하지 않음
![](/images/2025-09-05-NumberTheory04/2025-09-05-NumberTheory04-2025-09-08-19-44-30.png)

$ax+by=d$ 식에서 $ab$ 를 더하고 빼면 다른 답을 얻을 수 있다.

### pf
![](/images/2025-09-05-NumberTheory04/2025-09-05-NumberTheory04-2025-09-08-20-30-24.png)

![](/images/2025-09-05-NumberTheory04/2025-09-05-NumberTheory04-2025-09-08-20-30-47.png)

그래서 $ax+by$ 는 최대공약수가 되는 $x,y$가 항상 존재한다.


## Corollary 2.3.
$ \\{ax+by \mid x,y \in \mathbb{Z}\\} = \\{kd \mid k \in \mathbb{Z}\\} $

표의 모든 숫자 $(ax+by)$ 는 $a,b$의 최대공약수의 배수들로 이루어진 숫자이다.  

![](/images/2025-09-08-NumberTheory04/2025-09-08-NumberTheory04-2025-09-09-15-11-01.png)

## 정리 

그래서 이전의 표에 최대공약수가 나오는것은 우연이 아니며, 표의 숫자는 최대공약수의 배수가 된다.

- definition of $gcd(a,b)$
- compute the value of $gcd(a,b)$
- $ \text{(Theorem 2.3.) there exist } x,y \in \mathbb{Z} \text{ such that } ax + by = d $
- $ \text{(Corollary 2.3.) } \\{ax+by \mid x,y \in \mathbb{Z}\\} = \\{kd \mid k \in \mathbb{Z}\\} $

