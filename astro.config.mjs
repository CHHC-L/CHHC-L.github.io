// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://chhc-l.github.io',
  integrations: [sitemap()],
  markdown: {
    // unified (remark/rehype) instead of the default Sätteri, for $math$ via KaTeX.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'tokyo-night' },
    },
  },
  // Old Hexo permalinks, kept alive so existing links still land somewhere.
  redirects: {
    '/2022/12/18/site-build-0': '/posts/site-build-0/',
    '/2022/12/27/about-vg151': '/posts/about-vg151/',
    '/2023/01/01/2022': '/posts/2022/',
    '/2023/10/28/nightshade': '/posts/nightshade/',
    '/2023/10/29/about-vg100': '/posts/about-vg100/',
    '/archives': '/',
    '/categories': '/tags/',
    '/categories/dev': '/tags/dev/',
    '/categories/Learning': '/tags/Learning/',
  },
});
