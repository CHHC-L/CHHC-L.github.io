import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { formatDate, getPosts, isArchived, type Post } from '../lib/posts';

// An index for programs and LLMs that fetch the site (https://llmstxt.org).
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const line = ({ id, data }: Post) =>
    `- [${data.title}](${new URL(`/posts/${id}.md`, site)}): ${formatDate(data.date)}` +
    (data.description ? `. ${data.description}` : '');
  const current = posts.filter((p) => !isArchived(p));
  const archived = posts.filter(isArchived);
  const body = [
    `# ${SITE_TITLE}`,
    '',
    `> ${SITE_DESCRIPTION} Every post is also available as Markdown at /posts/<id>.md.`,
    '',
    '## Posts',
    '',
    ...(current.length ? current.map(line) : ['- (none yet)']),
    '',
    '## Archive',
    '',
    ...archived.map(line),
    '',
    '## About',
    '',
    `- [About](${new URL('/about/', site)}): experience and contact`,
    '',
  ];
  return new Response(body.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
