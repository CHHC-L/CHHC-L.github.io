---
title: "Settling Worst-Case Ratio of Smith's Rule for Exponential Jobs"
date: 2026-10-21T16:00:00+08:00
tags: ["research", "scheduling"]
description: "Smith's rule (WSEPT) for exponentially distributed jobs on parallel machines is at most 1.2442203… times optimal, and this is tight. This closes the interval [1.243, 4/3] left open since 2018."
---

## Question

There are $n$ jobs and $m$ identical machines. Job $j$ has a weight $w_j \ge 0$ and a processing time $p_j$, exponentially distributed with mean $\mu_j$, independently of everything else.

Whenever a machine is free, a *policy* decides which job to start. It sees which jobs have finished, but not how long a running job will take. Jobs cannot be interrupted, and machines may be left idle on purpose. The goal is to minimise $\mathbb E[\sum_j w_j C_j]$, where $C_j$ is the completion time of job $j$. OPT is the best policy.

**WSEPT** (weighted shortest expected processing time first, i.e. Smith's rule) sorts the jobs by $w_j/\mu_j$, largest first. Whenever a machine falls idle, it starts the next job on this list. WSEPT is optimal on one machine [1], but not on two or more. So the question is roughly:

> **How much worse than OPT can WSEPT be?**

Write $\rho^*(m)$ for the supremum of WSEPT/OPT over all instances on $m$ machines.

## History

- **1986.** For deterministic processing times, Kawaguchi and Kyan prove that the worst-case ratio of Smith's rule is exactly $(1+\sqrt2)/2 \approx 1.207$ [2].
- **1990.** Weiss expresses the cost through the squared machine loads and proves additive bounds for WSEPT [3].
- **1999.** Möhring, Schulz and Uetz prove $\rho^*(m) \le 2 - 1/m$ [4].
- **2010/2013.** Jagtenberg, Schwiegelshohn and Uetz build a stochastic version of the Kawaguchi–Kyan instance. As $m \to \infty$ it gives the lower bound $1.243$ [5, 6].
- **2018.** Jäger and Skutella generalise the Kawaguchi–Kyan bound to stochastic jobs, which gives $\rho^*(m) \le 4/3$ for exponential jobs [7]. Jäger's thesis adds bounds for each $m$, e.g. $\rho^*(2) \le 1.309$ [8].
- **2021.** Jäger writes in [8], p. 127: *"It remains open to locate the worst-case approximation ratio of the WSEPT rule for exponentially distributed processing times within the interval [1.243, 4/3]."*

The $4/3$ comes from an argument for each fixed realisation of the processing times. For such a realisation, greedy load balancing is never worse than $4/3$ times the best assignment in terms of squared loads, a deterministic result of Avidor, Azar and Sgall [9]. The argument only uses $\mathrm{Var}(p_j) \le \mu_j^2$, never that the jobs are memoryless.

## Results

**1. The worst case over all $m$.** Let

$$
\rho_\infty=\sup_{0<s\le1,\ \mu>0}\ \frac{\tfrac12+s\mu+s\mu^2}{\max_{T\ge0}\bigl[(1+s\mu)T-\tfrac12T^2+s\mu^2e^{-T/\mu}\bigr]} = 1.2442203207\ldots
$$

For every $m$ and every instance, $\mathrm{WSEPT} \le \rho_\infty \cdot \mathrm{OPT}$. The bound is tight: $\rho^*(m) \to \rho_\infty$ as $m \to \infty$. Interval arithmetic certifies $1.244220320737 \le \rho_\infty \le 1.244220320837$.

The extremal instance is the Jagtenberg–Schwiegelshohn–Uetz one with optimised parameters. Each machine gets one unit of work in tiny jobs ("dust"), and there is one long job of mean $1.77$ for every $2.23$ machines. They used about $2.3$ machines per long job. With the exact OPT their instance gives $1.24416$. Their printed $1.2436$ comes from an approximation of OPT. So the 2013 lower bound was essentially the answer all along, and what was missing was just a proof that nothing beats it.

[![One realisation of the extremal instance on 9 machines](/images/wsept-exponential/sand-stones.webp)](/images/wsept-exponential/sand-stones.webp)

**2. Each fixed $m$.** The worst case is always "dust plus $m$ jobs":

$$
\rho^*(m)=\sup_{d\ge0,\ \mu\in\mathbb R_{\ge0}^m}\ \frac{\mathbb E\sum_{i=1}^m (d/m+x_i)^2}{\mathbb E\sum_{i=1}^m \max(x_i,\lambda)^2}.
$$

Here the $x_i$ are independent exponentials with means $\mu_i$, and the water level $\lambda$ solves $\sum_i(\lambda-x_i)^+=d$. The numerator is "dust first, then the $m$ jobs" (left of the figure). The denominator is "the $m$ jobs first, then the dust water-filled around them" (right).

**3. Two machines.**

$$
\rho^*(2)=\sup_{w\ge0}\frac{(1+w)^2+3}{(1+w)^2+1+2e^{-w}}=1.2204310970\ldots
$$

The supremum is approached by one job of mean $1$ plus dust of total mean $w^* = 1.0122$.

| $m$ | 2 | 3 | 4 | 5 | 6 | 8 | 16 | $\infty$ |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| best "$h$ equal jobs + dust" | 1.22043 | 1.23093 | 1.23124 | 1.23650 | 1.23528 | 1.23834 | 1.24168 | 1.24422 |

The values for $m = 2$ and $m = \infty$ are exact. For the other $m$ the table gives lower bounds on $\rho^*(m)$. We conjecture they are exact: numerical search over all $\mu$ for $m \le 4$ found nothing larger. If they are, $\rho^*(m)$ is not monotone in $m$.

## Methods

The full proofs are in [`notes/proof.md`](https://github.com/CHHC-L/wsept-exponential/blob/main/notes/proof.md), and tbh I didn't check it line by line. But for human readers, the main ideas are:

**Reduction (known).** Splitting the weight vector into prefixes of the WSEPT list shows that the worst case has $w_j = \mu_j$. Then all Smith ratios are equal, so the adversary chooses the order of the list [3, 10].

**Cost = squared loads [3].** A policy cannot see $p_j$ when it starts job $j$, so the start time is independent of $p_j$. Also $\mathbb E p_j^2 = 2\mu_j^2$. Together these give

$$
2\,\mathbb E[\mathrm{cost}] \;\ge\; \frac Xm+\mathbb E\,V,\qquad V=\sum_{i=1}^m (L_i-\bar L)^2,
$$

with equality for policies that never idle. Here $L_i$ is the total work done on machine $i$, and $X=\mathbb E(\sum_jp_j)^2$ is the same for every policy. So the whole question is "how ragged the final loads are".

**WSEPT: only the last $m$ jobs matter.** When the last job on the list starts, every machine has been busy the whole time. So up to that moment all loads are equal. By memorylessness, the $m$ jobs running at that moment have fresh exponential remainders. Hence $\mathbb E V=\mathbb E\,Q(F)$, where $F$ is this final set of $m$ jobs and $Q(F)=(2-\frac1m)\sum_F\mu_i^2-\frac1m(\sum_F\mu_i)^2$. The adversary puts the $m$ jobs with the largest $Q$ last. (This step is essentially in [3].)

**OPT: sand and stones.** Even an OPT that knew all processing times in advance could not make the loads more level than in a relaxation: keep those $m$ jobs as rigid **"stones"**, and turn every other job into divisible **"sand"**.

- The best arrangement puts one stone on each machine and water-fills the sand around them.
- The resulting raggedness is convex in the amount of sand.
- So by Jensen's inequality, the random amount of sand can be replaced by its mean $d$.

**Then the bounds meet.** Turning all other jobs into dust can only increase the upper bound, and the instance "$m$ stones + dust" attains it. WSEPT pours the dust first and then the stones stick out. The policy "stones at time 0, then dust" water-fills without knowing anything in advance. That is result 2.

For exponential jobs, the probabilities that a job has started or is running by time $t$ satisfy the time-indexed LP of Skutella, Sviridenko and Uetz [11]. Pricing machine time at $(T-t)^+$ gives, for every $T$,

$$
\mathrm{OPT}\;\ge\;\Phi(T)=T\sum_j\mu_j-\frac m2T^2+\sum_j\mu_j^2e^{-T/\mu_j}.
$$

Jensen's inequality, with weights $\mu_i^2$, merges the $m$ stones into one class of equal stones. This leaves WSEPT's cost unchanged and can only decrease $\Phi$. So every instance has ratio at most that of a single class, which is at most $\rho_\infty$. Conversely, as $m \to \infty$ the water level of a single class becomes deterministic and equals the maximiser of $\Phi$. So the instance above reaches $\rho_\infty$.

For two machines, both sides can be computed by hand. On the WSEPT side, $Q \le \mu_{\max}^2$. On the OPT side, the imbalance is at least how far the longest job overshoots all the others combined. By memorylessness, the second moment of this overshoot is $2\mu_1^2e^{-v/\mu_1}$, where $v$ is the total of the others.

**Checks.**
- $\rho_\infty$ and $\rho^*(2)$ are enclosed by interval branch and bound (Arb), plus analytic bounds on the tails.
- Every inequality in the proof was compared with an exact dynamic program for OPT (idling allowed) on about a thousand random instances with $m = 2$ to $4$.
- Adversarial searches found no instance above the bounds.

## Reproduce

```sh
git clone https://github.com/CHHC-L/wsept-exponential
cd wsept-exponential
pip install -r requirements.txt
make
# certified enclosures of rho*(2) and rho_inf:
python src/cert_rho2.py
python src/cert_rho_inf.py
# compare every bound in the proof with the exact DP on random instances:
python src/check_bounds.py
```

Code, checks and proofs (`notes/proof.md`): [github.com/CHHC-L/wsept-exponential](https://github.com/CHHC-L/wsept-exponential)

## Note

Most of the code, including the "formal" proof, was done by Claude Opus 5.5.

## References

1. M. H. Rothkopf. Scheduling with random service times. *Management Science* 12(9):707–713, 1966.
2. T. Kawaguchi, S. Kyan. Worst case bound of an LRF schedule for the mean weighted flow-time problem. *SIAM J. Comput.* 15(4):1119–1129, 1986.
3. G. Weiss. Approximation results in parallel machines stochastic scheduling. *Annals of Operations Research* 26:195–242, 1990.
4. R. H. Möhring, A. S. Schulz, M. Uetz. Approximation in stochastic scheduling: the power of LP-based priority policies. *J. ACM* 46(6):924–942, 1999.
5. C. Jagtenberg, U. Schwiegelshohn, M. Uetz. Lower bounds for Smith's rule in stochastic machine scheduling. *WAOA 2010*, LNCS 6534:142–153, 2011.
6. C. Jagtenberg, U. Schwiegelshohn, M. Uetz. Analysis of Smith's rule in stochastic machine scheduling. *Operations Research Letters* 41(6):570–575, 2013.
7. S. Jäger, M. Skutella. Generalizing the Kawaguchi–Kyan bound to stochastic parallel machine scheduling. *STACS 2018*, LIPIcs 96:43:1–43:14, 2018.
8. S. Jäger. Approximation in deterministic and stochastic machine scheduling. PhD thesis, TU Berlin, 2021.
9. A. Avidor, Y. Azar, J. Sgall. Ancient and new algorithms for load balancing in the $\ell_p$ norm. *Algorithmica* 29(3):422–441, 2001.
10. C. Jagtenberg. On machine scheduling with exponentially distributed processing times. MSc thesis, Utrecht University, 2010.
11. M. Skutella, M. Sviridenko, M. Uetz. Unrelated machine scheduling with stochastic processing times. *Mathematics of Operations Research* 41(3):851–864, 2016.
