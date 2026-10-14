---
title: "此站点的搭建"
date: 2022-12-18T04:27:12+08:00
updated: 2022-12-18T04:56:01+08:00
tags: ["dev", "archived"]
---

## 配置

使用Hexo生成静态网页，主题为Butterfly。使用Github page存放。

环境为VMware Ubuntu 20.04 .

## 流程

### 安装Hexo

照着文档的Getting Started安装。

此后执行`hexo server`，应当在`localhost:4000`上看到默认的界面：

（这里原本是一张 Hexo 默认首页的截图，图床 upload.cc 上的原图已经失效。）

### 链接到Github page

在Github新建仓库，名为`<username>.github.io`。

在博客根目录的_config.yml改deploy

```yaml
deploy:
    type: git
    repository: <repository url> # 例如https://github.com/CHHC-L/CHHC-L.github.io.git
    branch: <default branch> # 如果新建仓库的时候没有更改，应当是main而非master
```

### 使用主题

在`/theme`中clone需要的主题，然后在博客根目录的_config.yml改`theme: <name>` .

改`/theme/<name>/_config.yml`来自定义主题配置。

### 一些坑

#### DNS问题

**Err:** 安装Hexo的时Bash中报错`Fail to fetch deb.nodesource.com`

**Sol:** 修改resolv.conf，在nameserver中增加例如阿里云223.5.5.5等。

#### 渲染问题

**Err:** 改了主题并发布后主页显示`extends includes/layout.pug block content include ./includes/mixins/post-ui.pug #recent-posts.recent-posts +postUI include includes/pagination.pug`

**Sol:** 大概是我用的主题需要一些插件：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
npm install hexo-deployer-git --save
yarn add hexo-deployer-git
```

#### Github相关

**Err:** `hexo deploy` 后报错 `fatal: 'https://github.com/CHHC-L/CHHC-L.github.io.git/' 鉴权失败`

**Sol:** 因为环境变了所以需要重新生成github token. 复制token之后先粘贴到啥文本框里里看一眼，别带前后空格（按理说不该啊）。

**Err:** `hexo deploy`之后本地能跑但访问github.io仍然提示page not found.

**Sol:** 原因之一是hexo默认提交到master branch，而github之前把默认分支名从master改成了main，github page默认是基于main分支。

改本地的话：

根目录的_config.yml中：

```yaml
deploy:
    ...
    branch: main
```

改远端的话：

在仓库的 Settings -> Branches -> Default branch，右边switch to another branch，改到master.

然后更改发布源。Settings -> Pages -> Default branch -> Build and deployment -> Source -> Deploy from a branch 改到master.

## Reference

[https://hexo.io/docs/](https://hexo.io/docs/)

[https://zkpeace.com/blog-cn/posts/60986](https://zkpeace.com/blog-cn/posts/60986)

[https://docs.github.com/zh/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/zh/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
