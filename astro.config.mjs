// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCitations from './src/lib/remark-citations.mjs';

export default defineConfig({
  site: 'https://chhc-l.github.io',
  integrations: [sitemap()],
  // The Latin glyphs of Noto Serif SC as their own family, so Astro can
  // preload them and size a local fallback to match while they load.
  // CJK text still comes from the full @fontsource/noto-serif-sc slices.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Noto Serif Latin',
      cssVariable: '--font-serif-latin',
      // CJK fonts before the generic, so it never claims Han characters.
      fallbacks: ['Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', 'serif'],
      display: 'fallback',
      // fontsource's latin range minus U+2000-206F, so CJK text keeps its
      // full-width quotes and dashes
      unicodeRange: [
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      ],
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['@fontsource/noto-serif-sc/files/noto-serif-sc-latin-400-normal.woff2'] },
          { weight: 700, style: 'normal', src: ['@fontsource/noto-serif-sc/files/noto-serif-sc-latin-700-normal.woff2'] },
          { weight: 900, style: 'normal', src: ['@fontsource/noto-serif-sc/files/noto-serif-sc-latin-900-normal.woff2'] },
        ],
      },
    },
  ],
  markdown: {
    // unified (remark/rehype) instead of the default Sätteri, for $math$ via KaTeX.
    processor: unified({
      remarkPlugins: [remarkMath, remarkCitations],
      rehypePlugins: [rehypeKatex],
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
