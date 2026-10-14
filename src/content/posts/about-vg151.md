---
title: "About VG151"
date: 2022-12-27T00:54:22+08:00
updated: 2022-12-27T02:35:38+08:00
tags: ["杂谈", "Learning"]
---

这个学期几乎算是结束了。其他的东西几乎是学了等于没学，纯纯应付考试去了。包括本想着好好学的数学。还好大概都糊弄过去了，除了英语实在太摆被Dr. Thorpe塞了个B之外，grade倒也不算难看。

牛宝的151里倒是确实感觉学到了或者体验到了不少奇妙的东西。

晚上看着Mack Wang写的发布最终Letter Grade的announcement，突然有些感动。

以下只是某个夜晚的零碎记忆。

## Engineering

之前oi的思维确实很多时候还是太肤浅了，或者说，太不“工程”了。毕竟是Intro. to computer **engineering** ，确乎是应当工程一点。

### 最酸爽的体验

大概是被马牛很重点关照地email+mattermost让我《放学别走》，然后到讲台上去被质问了好久（雾）。

C的homework有一道素数筛的题目，自信满满写了个线性筛然后交到oj上，喜提TLE 2/10。

我思考了很久要不要写二次筛，然后仔细想了想我用很纯的没有什么第三方库支持的c去写这种东西甚至还可能要解释给组员听……不是纯折磨自己实在没必要。

遂开始卡常。循环展开（没用，鉴定为joj是单核评测），register，int改short，取模brt（更慢了），gcc的builtin……挨个卡。数小时后过了。

遂被牛宝指着`__builtin_expect`问，“你知不知道你在写些什么玩意？”

那么哪里有问题呢？

- Group work.

  尽管我告诉队友别管那些奇怪的东西，但是他们理应能够理解我到底在干嘛。

- Memory leak.

  实际上他最后给deduction的最大理由是我`malloc`之后没有`free`。当然了，oi里没有人在乎空间，mle实在是过于稀有（还是1s=>1e9次操作使得不乱搞基本上会首先表现为时间不对而不是空间）。而作为工程来说考虑的不应当只是得到“结果”。

  其实上课倒是也说了，我没听（。）大意是，`malloc`相当于从别人手里抢来一块空间，你得对它的使用负起充分的责任。它某种意义上过于底层以至于不适合使用。当然该用就用。

- Time (and) complexity is not that important.

  优化了半天其实不一定比得过joj的心情波动。没人会保证你一个像cf评测姬那么准确的环境，差不多得了。

- You don’t need to pass all test cases.

  该改掉非得想着ac的毛病了（x

  确切地，牛宝说，当我觉得我没有办法用一个合法的正常的途径做出来的时候，我应当停下，而不是去乱搞。

- 跨平台的想法，至少想法。

  跨的不一定是系统意义上的平台，也包括编译器。毕竟写的是C。（笑）。

### Projects

p2 aka 个人的C project确实是给我写爽了。想玩的差不多都玩上了，尽管预想中的ncurse没学。虽然但是，过于严格的code quality不说有多少优劣吧，严格禁止任何全局变量使用+可修改log文件名=>我需要把文件指针传入每一个需要写log的函数；编译选项里的几个check=>我不能全传，真的得用啥才传啥，实在有点全新体验。（后来就无数次感叹为什么当时无知不知道singleton等等等等）

p3作为团队的确实有点不爽…感觉交流成本远高于自己写。虽然交流是更重要的。嗯，体验了一把梦想很大然后最终压着ddl交个勉强能跑的min版的感觉。

p1是现学现做的matlab上的玩意，面向文档编程还挺爽（能有那么完善的文档是真的省事…是否这也是matlab先于c/cpp的一个原因呢（笑），虽然这大概也不是马牛的安排）

### Exams

e1告诉我其实你没有必要写代码，多写点README比写代码能拿的分数高多了（

e3体验有点差。虽然我知道它试图表达的思想，但是可惜的是勾起了高三的痛苦回忆。揣摩出题人意图。(大概因为后1/3学期的cpp也就讲了点基础oop和opengl的使用，两道题目当然该各考一个方面。但是它想考oop的部分实在没必要oop……小小叛逆了一下的结果是花了所有时间拿到了mean，略难受)

### Extra

那一大堆code quality一开始真的咋看咋别扭，后来（包括正在）慢慢感受设计意图。But this is engineering.

TT生动贯彻了永远使用更高级的工具的理念，坚决将一切例如使用微信传代码本地合并以解决git conflict的行为绳之以法(x)

大概是，别老想着用熟悉的方法“绕过去”。这对学习没有帮助。

## Keep learning

比如…我甚至不以为然的递归。

以下摘自fkfd的blog。

> What counts as marginally recursive? Well, consider this Python snippet:
>
> ```python
> def alien(number, string, target):
>    if number == target:
>        return string
>    string = string[:-1] + "_" + string + "."
>    return alien(number + 1, string, target)
>
> print(alien(1, "--..", 3))
> ```
>
> Does it work? Yes. Does it yield the correct result? Yes! Is it recursive?
>
> …Maybe?
>
> I mean, it does call itself. But it’s not what we meant! Observe how grows larger and longer as we go to the deeper level. Recursion as we taught in the lectures was the opposite: breaking down the problem until it falls within the base case(s). Furthermore, this is tail recursion, which is just iteration with extra steps.

Keep learning.

And you’ll learn a lot.

在学期的最开始，我的计划比现状摆得更多。选151只是听说牛宝好玩，然后打算吃老本水掉这门课，以及这一整个学期。

现在至少可以觉得我学了一些什么吧，尽管不过是皮毛。

---

好吧。牛宝毫无疑问地激起了我此后选他的其他课，以及如果可能的话明年给他当151的牛马的欲望。虽然翻翻fkfd还有king的blog，感觉实在过于强大了。

But, keep learning & keep striking. “There are still tons of unknown, waiting for us to unveil.“

## Reference

[https://fkfd.me/ta/vg151_e1/](https://fkfd.me/ta/vg151_e1/)

[https://jicanvas.com/courses/41/discussion_topics/3095](https://jicanvas.com/courses/41/discussion_topics/3095)
