# CHHC.blog

https://chhc-l.github.io 的源码。用 [Astro](https://astro.build) 生成静态页面，推送到 `main` 后由 GitHub Actions 自动构建并发布到 GitHub Pages。

源码和发布都在这个仓库里：`main` 放源码，构建产物不进仓库。（旧的 Hexo 站点只推送了生成好的 HTML，源 markdown 因此丢了；现在不会再这样。）

## 写文章

在 `src/content/posts/` 新建一个 `.md` 文件，文件名就是文章地址：`hello.md` → `/posts/hello/`。

```markdown
---
title: "标题"
date: 2026-10-14T20:00:00+08:00
tags: ["dev"]
# updated: 2026-10-15T10:00:00+08:00   可选，显示“更新于”
# description: "一句话简介"              可选，用于 RSS 和搜索结果；不写就截取正文开头
# draft: true                           可选，草稿只在本地 dev 里出现
---

正文。标题从 `##` 开始，`#` 留给文章标题。

行内公式 $x^2$，块公式：

$$
\int_0^1 f(x)\,dx
$$
```

图片放在 `public/images/` 下，用 `![说明](/images/xxx.png)` 引用。

### 存档

给文章的 `tags` 加上 `archived`，它就不再出现在首页时间线和 RSS 里，改为列在 `/archive/`（右上角 Archive）：

```yaml
tags: ["dev", "archived"]
```

`archived` 不会作为标签显示，文章页会标一个“已存档”。文章在它别的标签页（如 `/tags/dev/`）里照常出现。去掉这个标签就回到首页。标签名在 `src/consts.ts` 的 `ARCHIVED_TAG` 里改。

## 本地预览

需要 Node.js 22.12 以上。

```sh
npm install
npm run dev        # http://localhost:4321 ，改文件自动刷新
npm run build      # 生成 dist/
npm run preview    # 预览 dist/
```

## 发布

```sh
git add -A && git commit -m "新文章：xxx" && git push
```

推送到 `main` 会触发 `.github/workflows/deploy.yml`，一两分钟后上线。进度在仓库的 Actions 页。

仓库设置里 **Settings → Pages → Source** 必须是 **GitHub Actions**。

## 结构

```
src/content/posts/   文章
src/pages/           页面：首页、文章页、存档、标签、关于、RSS、404
src/layouts/         页面骨架（页头页脚、<head>）
src/styles/global.css 全部样式；配色在开头的 :root 里
src/consts.ts        站名、简介、邮箱、GitHub、日期显示用的时区
astro.config.mjs     站点地址、Markdown（KaTeX、代码高亮）、旧链接重定向
```

## 从 Hexo 迁移过来的东西

- 5 篇旧文章是从旧站生成的 HTML 反向转换回 markdown 的；公式从 KaTeX 的 TeX 注释里还原，代码块语言保留。
- 旧的分类（dev、Learning）和标签合并成了标签。
- 旧链接（`/2023/10/28/nightshade/` 这种）、`/archives/`、`/categories/…` 都在 `astro.config.mjs` 的 `redirects` 里跳转到新地址。
- 《此站点的搭建》里引用的 upload.cc 截图已经失效，换成了文字说明。
- 旧站的生成结果还留在仓库的 `master` 分支上，可以随时翻。
