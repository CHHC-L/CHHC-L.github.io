import type { APIRoute, GetStaticPaths } from 'astro';
import { formatDate, getPosts, isArchived, postUrl, topicTags, type Post } from '../../lib/posts';

// Every post is also published as its Markdown source, at /posts/<id>.md.
export const getStaticPaths = (async () =>
  (await getPosts()).map((post) => ({ params: { id: post.id }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = ({ props, site }) => {
  const { post } = props;
  const { title, date, lang } = post.data;
  const head = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: ${formatDate(date)}`,
    `tags: [${topicTags(post).map((t) => JSON.stringify(t)).join(', ')}]`,
    ...(isArchived(post) ? ['archived: true'] : []),
    ...(lang ? [`lang: ${lang}`] : []),
    `url: ${new URL(postUrl(post), site)}`,
    '---',
    '',
    `# ${title}`,
    '',
  ];
  return new Response(head.join('\n') + '\n' + (post.body ?? '').trim() + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
