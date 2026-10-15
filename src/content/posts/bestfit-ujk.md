---
title: "Classifying the Expected Waste of Best Fit Bin Packing under U{j,k}"
date: 2026-10-15T14:00:00+08:00
tags: ["research", "bin-packing"]
description: "Settling the seven U{j,k} cases left open since 1993 and classifying Best Fit's expected waste for every k ≤ 25, with computer-checked Lyapunov certificates."
---

## Question

Items arrive one at a time and go into bins of capacity $k$. **Best Fit** puts each item into the fullest open bin that still has room, and opens a new bin otherwise. It is the default online bin-packing rule.

Let item sizes be i.i.d. uniform on $\{1, \dots, j\}$, i.e. the distribution $U\{j,k\}$. For $j \le k-2$ the items can be packed almost perfectly, so the optimal waste (unused space) stays $O(1)$. The question is:

> **For which $(j, k)$ does Best Fit also keep the waste bounded, and for which does it waste a constant fraction, $\Theta(n)$, of the space after $n$ items?**

## History

- **1991.** Coffman, Courcoubetis, Garey, Johnson, McGeoch, Shor, Weber and Yannakakis introduce $U\{j,k\}$ and prove that the waste is bounded when $k \ge j(j+3)/2$ [1]. Simulations suggest Best Fit wastes linearly for many other pairs.
- **1993.** Coffman, Johnson, Shor and Weber prove linear waste for $U\{8,11\}$ and $U\{9,12\}$ with LP-generated Lyapunov functions (about 24 hours each), settling every $k \le 11$ [2]. Their table leaves pairs with $k \le 14$ open: *"All the still-open problems listed in the table appear to require solutions to LP's that are far too big for us to store, much less solve."*
- **1998.** Kenyon, Rabani and Sinclair prove bounded waste for $j = k-2$ [3].
- **2002.** Kenyon and Mitzenmacher prove linear waste for $0.66 \le j/k < 2/3$ when $k$ is "sufficiently large" [4]. They note that $U\{8,11\}$ and $U\{9,12\}$ are still the only explicit pairs with proven linear waste.

Since then, the explicit classification seems not to have moved. As far as we could find, seven non-trivial pairs with $k \le 14$ remained open, as did almost every pair with $k \ge 15$.

## Results

1. **Solved the 7 open cases from 1993.** Linear: $U\{9,13\}$, $U\{10,13\}$, $U\{10,14\}$, $U\{11,14\}$. Bounded: $U\{8,12\}$, $U\{8,13\}$, $U\{9,14\}$.
2. **Complete classification for $k \le 25$.** 144 newly settled pairs: 78 linear, 66 bounded. In this range, for $j \le k-2$, only $O(1)$ and $\Theta(n)$ occur. Coffman et al. asked in 2002 whether anything in between is possible [5].
3. **Complete rows.** For every $j \le 12$ and every $k$, Best Fit has linear waste exactly when $j \ge 8$ and $j+3 \le k \le K_j$, where $K_8, \dots, K_{12} = 11, 13, 17, 20, 24$.
4. **Waste rates.** For the linear cases with $k \le 14$, the long-run waste per item (liminf and limsup) is bracketed rigorously, e.g. $U\{9,13\}$: $[0.01087, 0.01123]$ (simulation: $0.01109$), about 0.22% more bins than optimal.
5. **Where the waste goes.** In 26 linear cases, bins with two or more free units provably stay $O(1)$: all linear waste sits in bins with exactly one unit free.

[![Classification of Best Fit under U{j,k} for k ≤ 25](/images/bestfit-ujk/classification.png)](/images/bestfit-ujk/classification.png)

**An empirical $\sqrt{k}$ law (simulation, not proof).** For each $j$, we bisected on $k$ in simulation to find the largest $k$ with linear waste. For $j$ up to 40 the boundary fits $j^* \approx 2.52\sqrt{k}$ (residual $< 0.25$), and it agrees exactly with the certified rows $j \le 12$. The proven bounded region, $k \ge j(j+3)/2$, corresponds to $j \lesssim 1.41\sqrt{k}$. The theorem has the right order but is off by a factor of about 3 in $k$.

[![The linear-waste region](/images/bestfit-ujk/boundary.png)](/images/bestfit-ujk/boundary.png)

## Methods

**The chain.** The state is the vector $x$ of gap counts: $x_g$ is the number of open bins with $g$ units free. Best Fit's move depends only on which $x_g$ are positive. Two invariants mean that only small gaps can have many bins:

- any two open bins have gaps summing to less than $k$;
- at most one open bin has a gap larger than $j$.

**The certificate.** We look for a Lyapunov function of the form

$$
V(x) = \sum_g c_g x_g + \psi\bigl(\min(x, M)\bigr),
$$

that is, a linear part plus an arbitrary correction on counts truncated at levels $M$. The expected one-step change of $V$ depends only on the finite "pattern" $\min(x, M+1)$. So finitely many checks cover the infinite state space.

- If the drift is at least $\gamma > 0$ on every reachable pattern, the waste grows linearly.
- If all $c_g > 0$ and the drift is at most $-\gamma$ whenever some count exceeds its truncation level, the waste is bounded (Hajek's drift theorem [6]).

**The search.** For a fixed linear part $c$, the best $\psi$ solves a linear program. That LP is the Bellman inequality of an average-reward Markov decision process, in which an adversary chooses which truncated counts are "really" large. So instead of solving huge LPs, which was the 1993 bottleneck, we:

- run value iteration (multi-threaded C++);
- optimise $c$ by a cutting-plane method, warm-started from neighbouring cases.

The largest certificate has 15.7 million patterns. $U\{8,11\}$, the 24-hour computation of 1993, now takes seconds.

## Reproduce

```sh
git clone https://github.com/CHHC-L/bestfit-ujk
cd bestfit-ujk
make && make test
# might be slow:
make verify
```

Code, certificates and proofs (`notes/method.md`): [github.com/CHHC-L/bestfit-ujk](https://github.com/CHHC-L/bestfit-ujk)

## Note

Most of the code was written by Claude Opus 5.5.

## References

1. E. G. Coffman Jr., C. Courcoubetis, M. R. Garey, D. S. Johnson, L. A. McGeoch, P. W. Shor, R. R. Weber, M. Yannakakis. Fundamental discrepancies between average-case analyses under discrete and continuous distributions: a bin packing case study. *STOC*, 1991.
2. E. G. Coffman Jr., D. S. Johnson, P. W. Shor, R. R. Weber. Markov chains, computer proofs, and average-case analysis of Best Fit bin packing. *STOC*, 1993.
3. C. Kenyon, Y. Rabani, A. Sinclair. Biased random walks, Lyapunov functions, and stochastic analysis of Best Fit bin packing. *J. Algorithms* 27, 1998.
4. C. Kenyon, M. Mitzenmacher. Linear waste of Best Fit bin packing on skewed distributions. *Random Structures & Algorithms* 20, 2002.
5. E. G. Coffman Jr. et al. Perfect packing theorems and the average-case behavior of optimal and online bin packing. *SIAM Review* 44, 2002.
6. B. Hajek. Hitting-time and occupation-time bounds implied by drift analysis with applications. *Adv. Appl. Prob.* 14, 1982.
