---
title: "Nightshade"
date: 2023-10-28T04:12:06+08:00
updated: 2023-10-29T14:11:48+08:00
tags: ["dev"]
---

tl;dr 就论文本身而言Nightshade数据不错，思路接着搞下去也许可以有一定效果；但没什么技术，写的有点蠢，其与前作glaze同样的问题是适用范围有限且anti的措施仍然简单，“通过主动在图片中添加干扰 在不过分影响人类观感的前提下 污染图生成模型的训练” 仍然是一个困难的工作。

---

## 0

好久没在这写东西了。找的一个不写东西的理由是vmware加上带gui的ubuntu实在是太笨重了以至于懒得打开，写东西的理由则是某人生气了所以不睡了，以及把环境迁移到了wsl+fedora。

在空间看到画师朋友们都在转Nightshade相关，说能够通过构造少量毒数据来污染大范围的数据集，挺猛。大概因为是新发布的，除了微博上的截图以及一些搬运以外没搜到什么有效信息，稍微好一点的是[这篇](https://www.technologyreview.com/2023/10/23/1082189/data-poisoning-artists-fight-generative-ai/)，但是也没讲到它的核心trick，还得回去看论文（闭目）。论文链接[这个= =](https://arxiv.org/abs/2310.13828)。Prompt-Specific Poisoning Attacks on Text-to-Image Generative Models，作者大概是SAND Lab, Department of Computer Science, University of Chicago的phd，[他们](https://sandlab.cs.uchicago.edu/)确实主要方向之一是对抗学习。当时glaze火了一阵子，这次应该是同一批人接着做下去了。

看到摘要的第一眼说实话想跑路。

> We observe that training data per concept can be quite limited in these models, making them vulnerable to prompt-specific poisoning attacks, which target a model’s ability to respond to individual prompts.

看来作者主要想做的还是针对特定的标签去做prompt-specific attack，好像还是glaze的差不多思路，没有对当时glaze最大的问题即对img2img几乎没有效果这一点进行针对性的优化（当然这个其实在论文里没怎么强调，论文还是针对纯text2img去做的，数据也不错，后来有人吹太猛了就都在吵img2img…作者本身感觉也有点想恰这波流量，论文之外的描述都挺模糊）。

Glaze当时是提了一句说对于图像的简单处理不会破坏它的效果，但部分测试认为论文效果过于苛刻，实际上套滤镜或者叠一些影响人类观感的操作之后图像操作的trick就已经不够有用了，而仅基于text2img的污染有意义但还需要加强（因为还是不太容易提高经污染后图片对整个大数据集的影响，而目标太小的训练本来就有印度女工过程也不那么依赖上下文给的text）。另一个对类似想法的简单anti是拿到图片之后先换分辨率然后跑跑重采样、超分辨率之类的，这样对图像本身的污染看起来就没啥作用了。当然对于数据集挨个跑img2img很容易耗费大量算力，如果图片污染能做到在train之前"不得不套一层很深度的img2img"也算一种阶段性成功了。

## 论文

### Introduction

照着大概意思说说吧，Motivation是探究毒数据攻击现有text2img模型的效果，通过对特定prompt引入毒数据去污染数据集，不需要在模型的train之后动手脚，需要的毒数据样本很小。帅。

> Specifically, we show that successful poisoning attacks do not need access to the image generation pipeline, nor do they need poison samples comparable in size to the model training dataset. They need only to be comparable to benign training data related to a specific targeted prompt. Generative diffusion models support tens of thousands of prompts. The large majority of these have few training samples associated with them (i.e., low training data “density”), making them easy to poison with relatively few poison samples.

这后边就有一点点寄了，指明它这个"很小"的读数据是相比整体的训练数据集来说的，但仍然需要和关于这个特定prompt处于可比较的大小。攻击的点是说，现在的很多模型数据集很大但是信息密度很低（意思是，一张图片可能对应的关键词很局限，这样我污染这个关键词所需要对抗的数据集就小了很多）。确实是很多模型的缺陷，或者说是数据收集阶段的缺陷，针对这个攻击是好思路。

举例，我需要污染"钴蓝箭毒蛙"这个prompt（或者说concept），即目标是：只输入"钴蓝箭毒蛙"，期望通过text2img获得的图片并不能表现出钴蓝箭毒蛙的特征；而我产生的毒数据需要让人类视觉上仍然一切正常。在这个场景下，如果生成的毒数据集的大小能够和总体的带"钴蓝箭毒蛙"的数据集大小的数量级接近，那么使用这篇文章的方法是有效的。

按照这个说法，看似实际应用场景其实已经很狭窄了。因为从防御性质上，需要对这个prompt下面相当比例的内容进行污染处理，号召个人去处理的话花费的精力还是相当大的，而每一个试图窃取这个tag的风格的人所需要做的最多也不过是把抓到的图套一层img2img。仍然是防御成本远大于攻击成本的事情。当然，思路还是好的。**方向上应该可以期望做到让这个毒数据对人类几乎完全不可见，然后如果平台能把毒数据变成默认设置（比如你上传图片的时候就像加水印一样加个污染步骤），就相当于攻击者要去跟平台算力做对抗，确实能产生一部分的限制效果。**

> First and foremost, we examine training density of single-word prompts (or concepts) in existing large-scale datasets…

Ok, 指出现在的大数据集具有"词稀疏性"以及"语义稀疏性"。前者说的是就算你的总体数据集很大，每个特定prompt的数据集还是很小的；后者说语义相关的数据也很少。所以毒数据集的大小只需要跟特定prompt的数据集去比较。

> Next, we propose a significantly optimized prompt-specific poisoning attack we call Nightshade…

说Nightshade的好处，一是人眼难以察觉毒数据，二是它毒数据的效果不错，三是说它的毒数据可以在相近concept之间都产生效果，四是说如果一张图片被标了多个concept训练那它会对这些都产生影响（甚至进而影响总体数据集）。这个第四点实际上是最重要的，如果能更轻松的影响整个数据集，那就能显著降低防御成本以及增加攻击成本，想偷其他concept的人也得想着他抓来的数据是不是被污染过。

> Finally, we assert that Nightshade can provide a powerful tool for content owners to protect their intellectual property against model trainers that …

应用。

### Background and Related Work

复读了text2img的模型训练，然后提了一句因为大模型基本上都是持续的增量训练的，所以产生新的毒数据也能以前发布的模型产生一定效果。

提了其他攻击方法，略。提了前作glaze的抵抗风格模仿，还有尝试加NSFW，尝试基于其他的特定模型的一些backdoor的攻击。然后说Nightshade因为不对模型内部做假设所以这一步通用性很强。

### Feasibility

更formal的说了一下假设：

> Assume the attacker:
>
> - can inject a small number of poison data (image/text pairs) to the model’s training dataset
> - can arbitrarily modify the image and text content for all poison data (later we relax this assumption in part 6 to buildadvanced attacks)
> - has no access to any other part of the model pipeline (e.g.,training, deployment)
> - has access to an open-source text-to-image model (e.g., stable diffusion).

然后说攻击从头训练的模型或者增量训练的模型都会测试。

然后尝试说明"Concept Sparsity in Today’s Datasets"，现在的数据集的词稀疏性和语义稀疏性。指出这个是现在的模型的Vulnerability，可以被利用来做攻击。

做一个简单的污染text label的攻击测试：

> The key to the attack is the curation of the mismatched text/image pairs.

选一个攻击目标label C，选一个不相干的概念A作为误导方向，然后把"用C生成的text"和"与A关联的图片"搁一起当污染数据。最后得到了还行的结果……但是又绕回glaze那一套"风格"了。

> We also observe that the simple poisoning attack is more effective at corrupting style concepts than object concepts. This is likely because styles are typically conveyed visually by the entire image, while objects define specific regions within the image.

### Nightshade

设计目标"poison success with fewer poison samples", “avoid human and automated detection”。

然后应该终于到它的核心trick了：

首先为了最大化一组毒数据的效果：

> First, each poison text prompt clearly and succinctly conveys the keyword C, allowing the poison data to exclusively target the model parameters associated with C. Second, each poison image clearly and succinctly portrays a concept A that is unrelated to C. The irrelevancy between C and A ensures that, when paired with the poison text prompts conveying C, the poison images will produce the gradient updates pointing to a distinct direction (defined by A) away from those of the clean data (defined by C).

废话。找尽量无关的图片和文本去污染，这样就能让模型的梯度更新方向和正常的数据集的梯度更新方向尽量不一样。

提了一句它的毒数据不是往已有里面加毒，而是text2img的query产生图片去替换原来的数据。

然后应该最重要的"Constructing Clean-label Poison Data"，也就是试图防止上面生成的数据直接被洗掉。进行"guided perturbation"有引导地去加扰动。之前产生的pair里面的图片被称作"anchor image"，对于每一个anchor image，找到它的text prompt，然后对这个prompt进行扰动，用LPIPS去衡量扰动的大小，再用某种penalty method去解这个优化问题。Eq. (1)是定义了一下两张图片之间的距离。

> Step 3: Constructing poison images $\{$Image$_p\}$.
>
> For each text prompt $t \in\{$Text$_{p}\}$, locate its natural image pair $x_t$ in $\{$Image$\}$. Choose an anchor image $x^a$ from $\{$Image$_{\text{anchor}}\}$. Given $x_t$ and $x^a$, run the optimization of eq. (1) to produce a perturbed version $x_t^{\prime}=x_t+\delta$, subject to $|\delta|<p$. Like [19], we use LPIPS [96] to bound the perturbation and apply the penalty method [46] to solve the optimization:
>
> $$
> \min _\delta\|F(x_t+\delta)-F(x^a)\|_2^2+\alpha \cdot \max (\text{LPIPS}({\delta})-p, 0) .
> $$
>
> Next, add the text/image pair $t / x_t^{\prime}$ into the poison dataset $\{$Text$_{p} /$Image$_{p}\}$, remove $x^a$ from the anchor set, and move to the next text prompt in $\{\operatorname{Text}_p\}$.

我为什么放这一段呢，因为我看到这觉得我他妈是个傻子。这他妈算个锤子的trick………套了个东西算一下目标和当前set的距离，每次走一步试试，最后弄个差不多的完事。梯度下降。没了。

然后直接上Evaluation了，ok，您吉祥。

### Evaluation

篇幅很长，很不想看。几个数据集，几个baseline，几个任务和目标，完成得很好！反正我复现不了，就当它是真的吧。

> - Succeed with little poison data.
>
> - Bleed-through to nearby/related concepts.
>
> - Poison attacks are composable. Multiple attacks damage the entire model.
>
> - Attack transferability to different models. on diverse prompts.
>

您吉祥。

### Potential Defenses

分析了几条可能的防御措施，看起来还挺真的，确实也是这篇文章本来想要应对的任务。通过梯度下降的洗一洗，确实能使得毒数据在一些表现上不容易被察觉，loss、frequency看起来差不多。

然后alignment score说直接污染label的话表现很不好……当然，不然alignment是干啥的（闭目）后半句说Nightshade好一些，alignment filtering只能筛出63% precision and 47% recall with 10% FPR，这样筛完之后还是有数量级接近的毒数据，所以还是有一定的效果的。但如果针对性的去搞一下alignment，可能毒数据还是不太容易逃过去，毕竟这个trick本身就是针对text2img搞的，"从头生成image"的任务与"将已有的image和text对齐"的任务还是差别挺大的。但这个也说得过去，还是如果能够在平台上加入这个污染步骤，毒数据的数量级足够大，那太自动的alignment就没那么好使了，要么重新再来一轮印度女工。

### Conclusion

最后两段总结了一下，然后说了一点版权保护什么的，还好没水太多废话了。

## 1

看完了，感觉论文没啥意思，甚至不如glaze，核心trick实在是太简单了。应用场景暂时很有限的，但是思路是好的，继续往下做如果能获得内容平台的支持的话确实是一个不错的防御手段，之后也就当作大号水印了。

至于版权保护什么的……谨慎不看好，毕竟怎么搞也不是很难被anti，只是成本高一点而已。我的直觉上仍然是如果人眼没法显著的区分，那经过适当处理（从最简单的平滑、滤镜，到暴力的重新采样，压像素再超分辨回去……）之后也就没什么效果了，这个任务的难度还是太大了。

此外对于小的目标来说这也没啥意义，毕竟我如果炼LoRA的话首先会有很多不依赖画师再创作的素材，等于说是可以和画师从同一个层面开始学习（比如炼炼番剧里出现的角色，那也不怎么需要偷画师的风格了），然后稍微抽象一点的话那画师的素材也少/自由度更高，一些太细节的决定性特征现在也要手动去微调，数据污染不污染好像也作用不大了。

总之首先谴责水且没法复现的论文……Glaze至少给了个能用的demo。虽然也有点楽，但在论文里宣称的东西还算是实现得不错。这篇看起来倒是也没什么造假，数据也没太离谱，就只是有一种不知道为什么要发成两篇的感觉。时隔半年拉出来再炒一波倒也没什么能说的了（笑
