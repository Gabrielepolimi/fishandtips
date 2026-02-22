import Link from 'next/link';
import fishData from '../../data/fish-encyclopedia.json';

interface FishMatch {
  name: string;
  slug: string;
  icon: string;
  bestTechnique: string;
  difficulty: number;
}

const SPECIES_ALIASES: Record<string, string> = {
  branzino: 'spigola',
  'lupo di mare': 'spigola',
  ragno: 'spigola',
  'dorata': 'orata',
  polpo: 'seppia',
  'calamaro europeo': 'calamaro',
  totano: 'totano',
  'pesce serra': 'serra',
  'leccia amia': 'leccia',
  'dentice comune': 'dentice',
  barracuda: 'barracuda-mediterraneo',
  'pesce san pietro': 'san-pietro',
};

function extractTextFromBody(body: any[]): string {
  if (!body || !Array.isArray(body)) return '';
  return body
    .filter((block: any) => block._type === 'block')
    .map((block: any) =>
      (block.children || [])
        .map((child: any) => child.text || '')
        .join('')
    )
    .join(' ')
    .toLowerCase();
}

function detectSpecies(bodyText: string): FishMatch[] {
  const found = new Set<string>();
  const matches: FishMatch[] = [];

  for (const [alias, slug] of Object.entries(SPECIES_ALIASES)) {
    if (bodyText.includes(alias) && !found.has(slug)) {
      const fish = (fishData as any).fish.find((f: any) => f.slug === slug);
      if (fish) {
        found.add(slug);
        matches.push({
          name: fish.name,
          slug: fish.slug,
          icon: fish.icon,
          bestTechnique: fish.fishing.bestTechnique,
          difficulty: fish.fishing.difficulty,
        });
      }
    }
  }

  for (const fish of (fishData as any).fish) {
    if (found.has(fish.slug)) continue;
    const nameLower = fish.name.toLowerCase();
    const regex = new RegExp(`\\b${nameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (regex.test(bodyText)) {
      found.add(fish.slug);
      matches.push({
        name: fish.name,
        slug: fish.slug,
        icon: fish.icon,
        bestTechnique: fish.fishing.bestTechnique,
        difficulty: fish.fishing.difficulty,
      });
    }
  }

  return matches.slice(0, 4);
}

export default function FishSpeciesBox({ body }: { body: any[] }) {
  const bodyText = extractTextFromBody(body);
  const species = detectSpecies(bodyText);

  if (species.length === 0) return null;

  return (
    <section className="mt-10 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🐟</span>
          <h3 className="text-lg font-semibold text-gray-900">
            {species.length === 1 ? 'Scheda specie menzionata' : 'Schede specie menzionate'}
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {species.map((fish) => (
            <Link
              key={fish.slug}
              href={`/pesci-mediterraneo/${fish.slug}`}
              className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition"
            >
              <span className="text-3xl">{fish.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {fish.name}
                </p>
                <p className="text-xs text-gray-500">
                  Tecnica top: {fish.bestTechnique} · Difficoltà: {'⭐'.repeat(fish.difficulty)}
                </p>
              </div>
              <span className="text-blue-500 font-bold text-sm">→</span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Consulta le schede complete per tecniche, esche e periodi migliori.
        </p>
      </div>
    </section>
  );
}
