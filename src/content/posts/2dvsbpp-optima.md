---
title: "Proving 237/500 Optima on the Pisinger–Sigurd (MB) Benchmark"
date: 2026-10-15T14:30:00+08:00
tags: ["research", "bin-packing"]
description: "Exact results for 2D bin packing with variable bin sizes and costs: 237 of the 500 MB instances proven optimal for the cost objective and 190 for the area objective, with 13 new best packings."
---

## Question

Pack $n$ rectangles ($n = 20$ to $100$, no rotation) into bins. There are up to 5 bin types, each with a width, a height, a cost and unlimited supply. Minimise the total bin cost. The benchmark has 10 classes × 5 sizes × 10 instances.

Two different objectives:

- **W:** cost = the cost column in the file. This is Pisinger & Sigurd's problem.
- **U:** cost = bin area. The heuristic papers and the packingsolver best-known-solution file [4] use this one.

In 2005, Pisinger and Sigurd published 500 instances of this problem (the "MB" set, for both objectives), together with a branch-and-price algorithm that proved 164 of them optimal [1]. The 2021 survey of exact methods [2] still lists the rest (of objective W) as open.

Recently, Baldacci, Wang, Wei, Liu, Furini and Xu presented an exact algorithm for heterogeneous 2D bin packing at IFORS 2026 [5], and the group lists a working paper on numerically safe lower bounds [6]. I expect it to go well beyond these results. That is why this is just a blog post ;D

## Results

| Proven optimal | W | U |
|---|--:|--:|
| $n = 20$ | 100 / 100 | 100 / 100 |
| $n = 40$ | 83 / 100 | 65 / 100 |
| $n = 60$ | 38 / 100 | 11 / 100 |
| $n = 80$ | 8 / 100 | 7 / 100 |
| $n = 100$ | 8 / 100 | 7 / 100 |
| **Total** | **237** | **190** |

**W.** All 100 instances with 20 items are closed, including the 29 the survey lists as open. At $n = 40$ we close 83. The survey lists 62 of the 100 as open, so at least 45 of those 62 are among them. At $n \ge 60$ we close 54, about as many as Pisinger & Sigurd did (about 55).

**U.** The best-known table (packingsolver, 2025) [4] uses the lower bounds of Wei et al. (2013) [3] and closes 83 instances. We close 190, 143 of them not closed in that table. Our packings are cheaper than the best known on 13 instances:

| Instance | Ours | Best known (2025) | Proven optimal |
|---|--:|--:|:-:|
| MB_C3_11 | 9208 | 9404 | yes |
| MB_C3_17 | 12321 | 12644 | yes |
| MB_C8_14 | 119612 | 119628 | yes |
| MB_C10_12 | 73114 | 73960 | yes |
| MB_C10_14 | 57753 | 57936 | yes |
| MB_C10_16 | 52900 | 53632 | yes |
| MB_C10_17 | 66602 | 66789 | yes |
| MB_C10_18 | 65005 | 65074 | yes |
| MB_C10_20 | 79724 | 80088 | yes |
| MB_C10_15 | 52957 | 53382 | no |
| MB_C10_19 | 71038 | 71412 | no |
| MB_C10_25 | 75294 | 75460 | no |
| MB_C10_29 | 84025 | 85000 | no |

## Methods

Just combining different kinds of brute force, I have to say.

- **A CP-SAT model with strong symmetry breaking.** Bin $k$ may only be opened by item $k$, which removes most permutations of the bins. It proves every W instance with 20 items in at most 3 s.
- **Column generation** (Dantzig–Wolfe), with exact CP-SAT pricing. The fractional bound is rounded by a small integer program over bin-type counts. Benders cuts and exact feasibility checks of fixed bin counts strengthen it further.
- **Enumeration of bin-count vectors.** List the bin-count vectors in order of cost, from the lower bound up, and refute each one with cheap filters, Benders cuts or a fixed-bin CP-SAT model. Once the bound is close to the optimum, only a few vectors remain.
- **A 2D orthogonal packing prover** for single bins: dual-feasible-function (DFF) certificates, CP-SAT, and SAT with DRAT proofs.

**A small example.** MB_C2_8 (U) has 20 items with total area 507. The best known packing costs 594. The only cheaper choice of bins is a single $27 \times 19$ bin (area 513), so the question is whether the items fit in it, and they don't. Any vertical line through the bin crosses items of total height at most 19, so the sum of $\lfloor h/2 \rfloor$ over those items is at most 9. Summing over the 27 columns of the bin, the total of $w \cdot \lfloor h/2 \rfloor$ over all items can be at most $27 \cdot 9 = 243$. For these items it is 245.

## Reproduce

```sh
git clone https://github.com/CHHC-L/2dvsbpp-optima
cd 2dvsbpp-optima
pip install -r requirements.txt
# check one packing:
python src/check_solution.py data/instances/MB_C3_11.txt results/final/solutions/MB_C3_11_area.json area
# solve one instance (40 s limit):
python src/sweep_run.py --variant weighted --time 40 MB_C1_11
```

The repository has a per-instance table (`results/final/results.csv`: LB, UB, which methods prove the LB, whether that is confirmed) and one packing per instance and variant.

Code, results and packings: [github.com/CHHC-L/2dvsbpp-optima](https://github.com/CHHC-L/2dvsbpp-optima)

## Note

Most of the code was written by Claude Opus 5.5.

## References

1. D. Pisinger, M. Sigurd. The two-dimensional bin packing problem with variable bin sizes and costs. *Discrete Optimization* 2(2):154–167, 2005. [doi:10.1016/j.disopt.2005.01.002](https://doi.org/10.1016/j.disopt.2005.01.002)
2. M. Iori, V. L. de Lima, S. Martello, F. K. Miyazawa, M. Monaci. Exact solution techniques for two-dimensional cutting and packing. *EJOR* 289(2):399–415, 2021. [doi:10.1016/j.ejor.2020.06.050](https://doi.org/10.1016/j.ejor.2020.06.050)
3. L. Wei, W.-C. Oon, W. Zhu, A. Lim. A goal-driven approach to the 2D bin packing and variable-sized bin packing problems. *EJOR* 224(1):110–121, 2013. [doi:10.1016/j.ejor.2012.08.005](https://doi.org/10.1016/j.ejor.2012.08.005)
4. F. Fontan. packingsolver. [github.com/fontanf/packingsolver](https://github.com/fontanf/packingsolver) (best-known values in `data/rectangle/data_variable_sized_bin_packing_oriented_pisinger2005.csv`).
5. R. Baldacci, S. Wang, L. Wei, Q. Liu, F. Furini, Z. Xu. A unified exact algorithm for multiple variants of heterogeneous 2D bin packing. *IFORS 2026*, [talk 572](https://www.euro-online.org/conf/ifors2026/treat_abstract?frompage=search&paperid=572).
6. S. Wang, R. Baldacci, F. Furini, L. Wei, Z. Xu. High-dimensional heterogeneous bin packing: tightened formulations, numerically safe lower bounds, and an efficient exact algorithm. Working paper, not yet public.
