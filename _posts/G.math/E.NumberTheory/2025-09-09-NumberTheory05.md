---
title: 2.3.3. relatively prime
tags: NumberTheory
categories:
- NumberTheory
math: true
---

## Definition
$ \text{Given } a,b \in \mathbb{Z} \text{ (at least one of them is not zero), } $

$ a,b \text{ are called relatively prime } \overset{\text{def}}{\Longleftrightarrow} gcd(a,b)=1 $

## Theorem 2.3
$ \text{Given } a,b \in \mathbb{Z} \left(a \neq 0 \text{ or } b \neq 0 \right) \text{, let } d=gcd(a,b) $  
$ \Rightarrow \text{There exists } x,y \in \mathbb{Z} \text{ such that } ax + by = d $

이전에 증명했었다. 지금은 d=1 인 case

## Theorem 2.4

$ gcd(a,b) = 1 \Longleftrightarrow \exists x,y \in \mathbb{Z} \text{ s.t. }ax+by = 1 $  

![](/images/2025-09-09-NumberTheory05/2025-09-09-NumberTheory05-2025-09-09-16-23-08.png)

## Corollary of Theorem 2.4

### 2.4.1

![](/images/2025-09-09-NumberTheory05/2025-09-09-NumberTheory05-2025-09-09-16-23-26.png)

### 2.4.2
![](/images/2025-09-09-NumberTheory05/2025-09-09-NumberTheory05-2025-09-09-16-23-47.png)

- The condition "$gcd(a,b)=1$" is necessary

Note that $ 6\mid 24$ and $8 \mid 24$. BUT $ (6 \cdot 8) \nmid 24 $

## Theorem 2.5 Euclid's lemma
![](/images/2025-09-09-NumberTheory05/2025-09-09-NumberTheory05-2025-09-09-16-57-50.png)

## Theorem 2.6 The Gratest Common Divisor
![](/images/2025-09-09-NumberTheory05/2025-09-09-NumberTheory05-2025-09-09-16-58-13.png)

그래서 $d=12$ 였다면 원래 정의에서는 d보다 작은 값이 다 될수 있었는데, 사실 d의 약수 $c=1,2,3,4,6,12 $ 만 생각하면 된다.


## 정리
- definition of relatively prime numbers
- $ gcd(a,b) = 1 \Longleftrightarrow $  $\text{there exists } x,y \in \mathbb{Z} \text{ with } ax+by=1$
- corollaries of Theorem 2.4
- Euclid's lemma

## 문제
꼭 풀어보도록 하자...