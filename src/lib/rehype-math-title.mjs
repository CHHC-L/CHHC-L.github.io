/**
 * Formulas render as native MathML. Each one also carries its TeX source as a
 * tooltip, so hovering shows the original text even where MathML falls short.
 */

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const find = (node, test) => {
  if (test(node)) return node;
  for (const child of node.children ?? []) {
    const hit = find(child, test);
    if (hit) return hit;
  }
};

export default function rehypeMathTitle() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.properties?.className?.includes('katex')) {
        const tex = find(node, (n) => n.tagName === 'annotation');
        if (tex) node.properties.title = textOf(tex).trim();
        return;
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}
