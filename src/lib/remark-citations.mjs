/**
 * Numbered citations. When a post ends its `## References` section with an
 * ordered list, each item gets an id (`ref-1`, `ref-2`, …) and every `[1]` or
 * `[2, 5]` in the text links to it. Posts without such a list are left alone.
 */

const CITATION = /\[(\d+(?:,\s*\d+)*)\]/g;
const SKIP = new Set(['code', 'inlineCode', 'math', 'inlineMath', 'link', 'linkReference', 'html']);

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

export default function remarkCitations() {
  return (tree) => {
    const heading = tree.children.findIndex(
      (node) => node.type === 'heading' && /^references$/i.test(textOf(node).trim()),
    );
    const list = tree.children.slice(heading + 1).find((node) => node.type === 'list');
    if (heading < 0 || !list?.ordered) return;

    const first = list.start ?? 1;
    const last = first + list.children.length - 1;
    list.children.forEach((item, i) => {
      item.data = { ...item.data, hProperties: { id: `ref-${first + i}` } };
    });

    const link = (n) => ({
      type: 'link',
      url: `#ref-${n}`,
      data: { hProperties: { className: ['cite'] } },
      children: [{ type: 'text', value: String(n) }],
    });

    // Split `[1]`-style markers in a text node into text + link nodes.
    const cite = (value) => {
      const out = [];
      let at = 0;
      for (const match of value.matchAll(CITATION)) {
        const numbers = match[1].split(',').map((s) => Number(s.trim()));
        if (!numbers.every((n) => n >= first && n <= last)) continue;
        if (match.index > at) out.push({ type: 'text', value: value.slice(at, match.index) });
        out.push({ type: 'text', value: '[' });
        numbers.forEach((n, i) => {
          if (i > 0) out.push({ type: 'text', value: ', ' });
          out.push(link(n));
        });
        out.push({ type: 'text', value: ']' });
        at = match.index + match[0].length;
      }
      if (at === 0) return null;
      if (at < value.length) out.push({ type: 'text', value: value.slice(at) });
      return out;
    };

    const walk = (node) => {
      if (node === list || SKIP.has(node.type) || !node.children) return;
      node.children = node.children.flatMap((child) => {
        if (child.type === 'text') return cite(child.value) ?? [child];
        walk(child);
        return [child];
      });
    };
    walk(tree);
  };
}
