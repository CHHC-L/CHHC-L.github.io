# CHHC.blog

Source for https://chhc-l.github.io. Built with [Astro](https://astro.build); every push to `main` is built by GitHub Actions and published to GitHub Pages.

`main` holds the source; build output never goes into the repo. (The old Hexo site only ever pushed generated HTML, which is how its markdown got lost.)

## Writing a post

Add a `.md` file under `src/content/posts/`. The file name is the URL: `hello.md` → `/posts/hello/`.

```markdown
---
title: "Title"
date: 2026-10-14T20:00:00-04:00
tags: ["dev"]
# updated: 2026-10-15T10:00:00-04:00   optional, shows "Updated <date>"
# description: "One-line summary"       optional, for RSS and search results; defaults to the opening text
# lang: zh-CN                           optional, for posts not written in English
# draft: true                           optional, drafts only show up in `npm run dev`
---

Body. Section headings start at `##`; `#` is the post title.

Inline math $x^2$, display math:

$$
\int_0^1 f(x)\,dx
$$
```

Put images in `public/images/` and reference them as `![alt text](/images/name.png)`. An image on its own line is a figure: it spans the year gutter on wide screens, and wrapping it in a link to itself (`[![alt](/images/x.png)](/images/x.png)`) lets readers open the full-size file.

### Citations

End the post with a `## References` heading followed by a numbered list. Any `[1]` or `[2, 5]` in the text then links to the matching entry:

```markdown
Hajek's drift theorem [6] gives ...

## References

1. A. Author. Title. *Venue* 12(3):45–67, 2020. [doi:10.xxxx/yyyy](https://doi.org/10.xxxx/yyyy)
```

Reference entries follow that shape: authors, title, italic venue with volume(issue):pages, year, then a DOI or URL link when there is one.

### Archiving

Add `archived` to a post's `tags` to take it off the home timeline and out of RSS. It's then listed under `/archive/` (Archive in the header):

```yaml
tags: ["dev", "archived"]
```

`archived` is never shown as a tag, and the post page gets an "Archived" marker. The post still appears on its other tag pages (e.g. `/tags/dev/`). Remove the tag to bring it back. The tag name lives in `ARCHIVED_TAG` in `src/consts.ts`.

## Local preview

Needs Node.js 22.12 or newer.

```sh
npm install
npm run dev        # http://localhost:4321, reloads on save
npm run build      # writes dist/
npm run preview    # serves dist/
```

## Publishing

```sh
git add -A && git commit -m "Post: ..." && git push
```

Pushing to `main` runs `.github/workflows/deploy.yml`; the site updates a minute or two later. Progress is on the repo's Actions tab.

The repo's **Settings → Pages → Source** must be **GitHub Actions**.

## Layout

```
src/content/posts/    posts
src/pages/            home, post pages, archive, tags, about, RSS, 404
src/layouts/          page shell (header, footer, <head>)
src/styles/global.css all styles; colors are the :root tokens at the top
src/consts.ts         site name, description, email, GitHub, archived tag, display time zone
astro.config.mjs      site URL, Markdown (KaTeX, code highlighting), redirects for old URLs
```

## Migrated from Hexo

- The 5 old posts were converted back to markdown from the old site's generated HTML. Math was recovered from KaTeX's TeX annotations; code block languages were kept. They're marked `lang: zh-CN` and archived.
- Old categories and tags were merged into tags, then renamed: 杂谈 → `musings`, Learning → `courses`, dev stays `dev`.
- Old URLs (`/2023/10/28/nightshade/` and the like, `/archives/`, `/categories/…`, `/tags/杂谈/`, `/tags/Learning/`) redirect to their new homes via `redirects` in `astro.config.mjs`.
- The upload.cc screenshot in 此站点的搭建 no longer exists and was replaced with a note.
- The old generated site is kept on the `hexo-backup` branch.
