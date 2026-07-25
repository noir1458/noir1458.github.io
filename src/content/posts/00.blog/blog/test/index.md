---
title: test
slug: test
publishedAt: '2026-07-26'
categories: blog
math: true
---

## test

$$
\begin{aligned}
\mathcal{L}(\theta)
&= -\sum_{i=1}^{N}
\log\left(
\frac{\exp\left(\mathbf{z}_i^\top \mathbf{w}_{y_i}/\tau\right)}
{\sum_{k=1}^{K}\exp\left(\mathbf{z}_i^\top \mathbf{w}_k/\tau\right)}
\right)
+\frac{\lambda}{2}\lVert\theta\rVert_2^2 \\[4pt]
\nabla_{\mathbf{w}_k}\mathcal{L}
&= \frac{1}{\tau}\sum_{i=1}^{N}
\left(
p_{ik}-\mathbf{1}[y_i=k]
\right)\mathbf{z}_i
+\lambda\mathbf{w}_k, \\[4pt]
p_{ik}
&=
\frac{\exp\left(\mathbf{z}_i^\top\mathbf{w}_k/\tau\right)}
{\sum_{j=1}^{K}\exp\left(\mathbf{z}_i^\top\mathbf{w}_j/\tau\right)}.
\end{aligned}
$$