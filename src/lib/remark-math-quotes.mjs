/**
 * Quotes next to inline math. remark-smartypants doesn't see `$...$`, so in
 * `"$m$ stones"` the opening quote, with nothing it can see after it, gets
 * curled as a closing one (and a closing quote right after math as an opening
 * one). This runs after it and turns such quotes the right way round.
 */

// ” or ’ at the end of the text before math, after a space or at the start.
const OPENING = /(^|[\s([])([”’])$/;
// “ or ‘ at the start of the text after math, before a space, punctuation or the end.
const CLOSING = /^[“‘](?=$|[\s.,;:!?)\]])/;

const FLIP = { '”': '“', '’': '‘', '“': '”', '‘': '’' };

export default function remarkMathQuotes() {
  return (tree) => {
    const walk = (node) => {
      const kids = node.children ?? [];
      kids.forEach((child, i) => {
        if (child.type !== 'text') return walk(child);
        if (kids[i + 1]?.type === 'inlineMath') {
          child.value = child.value.replace(OPENING, (_, before, quote) => before + FLIP[quote]);
        }
        if (kids[i - 1]?.type === 'inlineMath') {
          child.value = child.value.replace(CLOSING, (quote) => FLIP[quote]);
        }
      });
    };
    walk(tree);
  };
}
