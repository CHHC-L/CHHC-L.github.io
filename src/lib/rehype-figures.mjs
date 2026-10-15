/**
 * Images from public/: a paragraph holding just one image (optionally linked)
 * becomes a <figure>, and every local image gets its width and height (so the
 * page doesn't jump while it loads) plus lazy loading.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Pixel size of a PNG or WebP file, read from its header. */
function imageSize(file) {
  let b;
  try {
    b = readFileSync(file);
  } catch {
    return null;
  }
  if (b.toString('ascii', 1, 4) === 'PNG') {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  return null;
}

const isBlank = (node) => node.type === 'text' && !node.value.trim();
const onlyChild = (node) => {
  const kids = (node.children ?? []).filter((n) => !isBlank(n));
  return kids.length === 1 ? kids[0] : null;
};

export default function rehypeFigures({ publicDir = 'public' } = {}) {
  return (tree) => {
    const walk = (node) => {
      if (node.type !== 'element' && node.type !== 'root') return;
      if (node.tagName === 'img' && /^\/[^/]/.test(node.properties.src ?? '')) {
        const size = imageSize(join(process.cwd(), publicDir, node.properties.src));
        if (size) Object.assign(node.properties, size);
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
      if (node.tagName === 'p') {
        const child = onlyChild(node);
        const img = child?.tagName === 'a' ? onlyChild(child) : child;
        if (img?.tagName === 'img') {
          node.tagName = 'figure';
          node.children = [child];
        }
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}
