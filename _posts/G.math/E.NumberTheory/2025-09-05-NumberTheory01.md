---
title: 1.Mathematical Induction
tags: NumberTheory
---

David M.Burton - Seventh Edition

## Theorem 1.1. Well-Ordering Principle
Well ordering axiom for $\mathbb{N}$  
S : non empty subset of {0,1,2 ...}  
$\Rightarrow$ S has the smallest element in S  
($\Leftrightarrow$ There exists a $\in$ S such that a $\le$ b for all b $\in$ S) 

$ \exists a\in S  \text{ s.t. }  \forall b \in S , a\le b $

## Theorem 1.2. First Principle of Finite Induction
수학적 귀납법의 증명

$ \text{Assume that } S\subseteq \mathbb{N} \text{ satisfies}$  
$\text{(a)} 1\in S$  
$\text{(b)} k \in S \text{, then } k+1 \in S$  
$ \text{Then } S = \mathbb{N}$

### pf
![](/images/2025-09-05-NumberTheory01/2025-09-05-NumberTheory01-2025-09-05-17-00-00.png)

### ex
![](/images/2025-09-05-NumberTheory01/2025-09-05-NumberTheory01-2025-09-05-17-07-41.png)

## 1.2. Binomial Theorem
식만 기억해도 된다

## 정리
- 자연수는 Well-ordering Axiom 성립
- 이 성질을 이용해서 induction argument를 증명 (중요)
- 이 induction argument 이용해서 어떤 식을 설명할 수 있었음
- binomial theorem

## 연습문제
