import type { TypedObject } from '@portabletext/types';

type PortableBlock = {
  _type?: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

const INTRO_STYLES = new Set(['normal', 'blockquote', undefined]);

function isIntroParagraphBlock(block: PortableBlock): boolean {
  return block._type === 'block' && INTRO_STYLES.has(block.style);
}

/**
 * Divide il body in anteprima breve (2-3 paragrafi intro) + resto gated.
 * Priorità: primi N paragrafi di testo (normal/blockquote), non tagliare all'H2 tabella.
 */
export function splitBodyForGate(
  blocks: unknown,
  options: { introParagraphCount?: number } = {}
): { preview: TypedObject[]; gated: TypedObject[] } {
  if (!blocks || !Array.isArray(blocks)) {
    return { preview: [], gated: [] };
  }

  const list = blocks as PortableBlock[] & TypedObject[];
  const introCount = Math.max(1, options.introParagraphCount ?? 3);

  const introParagraphIndices: number[] = [];
  for (let i = 0; i < list.length; i++) {
    if (isIntroParagraphBlock(list[i])) {
      introParagraphIndices.push(i);
    }
  }

  if (introParagraphIndices.length >= introCount) {
    const cutAfter = introParagraphIndices[introCount - 1];
    if (cutAfter < list.length - 1) {
      return {
        preview: list.slice(0, cutAfter + 1) as TypedObject[],
        gated: list.slice(cutAfter + 1) as TypedObject[],
      };
    }
  }

  // Fallback: meno paragrafi intro del target — mostra tutti i paragrafi intro disponibili
  if (introParagraphIndices.length > 0) {
    const cutAfter = introParagraphIndices[introParagraphIndices.length - 1];
    if (cutAfter < list.length - 1) {
      return {
        preview: list.slice(0, cutAfter + 1) as TypedObject[],
        gated: list.slice(cutAfter + 1) as TypedObject[],
      };
    }
  }

  // Fallback robusto: primi blocchi testo (max 4) se non ci sono paragrafi normal
  const textBlockIndices = list
    .map((b, i) => (b._type === 'block' ? i : -1))
    .filter((i) => i >= 0);

  const fallbackCount = Math.min(4, Math.max(2, introCount));
  const cutIndex =
    textBlockIndices[fallbackCount - 1] ??
    textBlockIndices[textBlockIndices.length - 1] ??
    list.length;

  if (cutIndex <= 0 || cutIndex >= list.length) {
    return { preview: list as TypedObject[], gated: [] };
  }

  return {
    preview: list.slice(0, cutIndex + 1) as TypedObject[],
    gated: list.slice(cutIndex + 1) as TypedObject[],
  };
}
