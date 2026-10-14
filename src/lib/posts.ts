import { getCollection, type CollectionEntry } from 'astro:content';
import { ARCHIVED_TAG, TIME_ZONE } from '../consts';

export type Post = CollectionEntry<'posts'>;

/** Published posts, archived ones included, newest first. Drafts show up only in `npm run dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const isArchived = (post: Post) => post.data.tags.includes(ARCHIVED_TAG);

/** The post's tags minus the archived marker, which is a status rather than a topic. */
export const topicTags = (post: Post) => post.data.tags.filter((tag) => tag !== ARCHIVED_TAG);

const dateParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** 2023-10-28 */
export const formatDate = (date: Date) => dateParts.format(date);

/** 10-28 */
export const formatMonthDay = (date: Date) => formatDate(date).slice(5);

export const yearOf = (date: Date) => formatDate(date).slice(0, 4);

/** Posts grouped by year, newest year first. Expects posts sorted newest first. */
export function groupByYear(posts: Post[]): [string, Post[]][] {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = yearOf(post.data.date);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups];
}

/** 1 post, 3 posts */
export const postCount = (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`;

export const postUrl = (post: Post) => `/posts/${post.id}/`;
export const tagUrl = (tag: string) => `/tags/${encodeURIComponent(tag)}/`;

/** Plain-text opening of a post, for RSS and meta descriptions. */
export function excerpt(post: Post, length = 120): string {
  if (post.data.description) return post.data.description;
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s.*$/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/^-{3,}$/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? text.slice(0, length) + '…' : text;
}
