import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { excerpt, getPosts, isArchived, postUrl, topicTags } from '../lib/posts';

export async function GET(context: APIContext) {
  // The feed follows the home timeline: archived posts stay out.
  const posts = (await getPosts()).filter((post) => !isArchived(post));
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerpt(post, 200),
      link: postUrl(post),
      categories: topicTags(post),
    })),
    customData: '<language>en</language>',
  });
}
