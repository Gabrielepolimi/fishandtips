/**
 * Estrae link a pagine database (tecniche, specie, regioni) da titolo e corpo articolo.
 * Usato per il componente RelatedDatabaseLinks negli articoli.
 */

import techniquesData from '../data/fishing-techniques.json';
import fishData from '../data/fish-encyclopedia.json';
import spotsData from '../data/fishing-spots.json';

export type RelatedLink = {
  href: string;
  label: string;
  type: 'technique' | 'species' | 'region';
};

const techniques = (techniquesData as any).techniques ?? [];
const fishList = (fishData as any).fish ?? [];
const regions = (spotsData as any).regions ?? [];

/** Converte blocchi Portable Text in testo piano (per analisi keyword) */
export function portableTextToPlainText(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map((block: any) => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map((c: any) => c.text ?? '').join('');
    })
    .join(' ');
}

/**
 * Cerca tecniche, specie e regioni nel testo e restituisce max 6 link deduplicati, ordinati per rilevanza.
 */
export function extractRelatedLinks(title: string, bodyPlainText: string): RelatedLink[] {
  const combined = `${title} ${bodyPlainText}`.toLowerCase();
  const seen = new Set<string>();
  const scored: { link: RelatedLink; score: number }[] = [];

  // Tecniche: name o slug nel testo
  for (const t of techniques) {
    const name = (t.name ?? '').toLowerCase();
    const slug = (t.slug ?? '').toLowerCase();
    if (!name && !slug) continue;
    const regex = new RegExp(`\\b${escapeRegex(name)}\\b|\\b${escapeRegex(slug)}\\b`, 'gi');
    const matches = combined.match(regex);
    if (matches?.length) {
      const key = `/tecniche/${t.slug}`;
      if (!seen.has(key)) {
        seen.add(key);
        scored.push({
          link: { href: `/tecniche/${t.slug}`, label: t.name, type: 'technique' },
          score: matches.length,
        });
      }
    }
  }

  // Specie: nome nel testo (slug in URL)
  for (const f of fishList) {
    const name = (f.name ?? '').toLowerCase();
    if (!name || name.length < 3) continue;
    const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
    const matches = combined.match(regex);
    if (matches?.length) {
      const key = `/pesci-mediterraneo/${f.slug}`;
      if (!seen.has(key)) {
        seen.add(key);
        scored.push({
          link: { href: `/pesci-mediterraneo/${f.slug}`, label: f.name, type: 'species' },
          score: matches.length,
        });
      }
    }
  }

  // Regioni: nome nel testo (id in URL)
  for (const r of regions) {
    const name = (r.name ?? '').toLowerCase();
    if (!name) continue;
    const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
    const matches = combined.match(regex);
    if (matches?.length) {
      const key = `/spot-pesca-italia/${r.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        scored.push({
          link: { href: `/spot-pesca-italia/${r.id}`, label: r.name, type: 'region' },
          score: matches.length,
        });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map((s) => s.link);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
