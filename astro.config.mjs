// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCitations from './src/lib/remark-citations.mjs';
import rehypeFigures from './src/lib/rehype-figures.mjs';

export default defineConfig({
  site: 'https://chhc-l.github.io',
  integrations: [sitemap()],
  // The stylesheet is a few KB: ship it inside each page instead of as a separate request.
  build: { inlineStylesheets: 'always' },
  markdown: {
    // unified (remark/rehype) instead of the default Sätteri, for $math$ via KaTeX.
    // KaTeX emits MathML only: browsers draw it natively, no KaTeX CSS or fonts.
    processor: unified({
      remarkPlugins: [remarkMath, remarkCitations],
      rehypePlugins: [[rehypeKatex, { output: 'mathml' }], rehypeFigures],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'tokyo-night' },
    },
  },
  // Old URLs, kept alive so existing links still land somewhere.
  redirects: {
    // Hexo permalinks
    '/2022/12/18/site-build-0': '/posts/site-build-0/',
    '/2022/12/27/about-vg151': '/posts/about-vg151/',
    '/2023/01/01/2022': '/posts/2022/',
    '/2023/10/28/nightshade': '/posts/nightshade/',
    '/2023/10/29/about-vg100': '/posts/about-vg100/',
    '/archives': '/',
    '/categories': '/tags/',
    '/categories/dev': '/tags/dev/',
    '/categories/Learning': '/tags/courses/',
    // Renamed tags
    '/tags/杂谈': '/tags/musings/',
    '/tags/Learning': '/tags/courses/',
  },
});
