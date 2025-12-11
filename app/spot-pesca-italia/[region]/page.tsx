import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import spotsData from '../../../data/fishing-spots.json';

interface Spot {
  id: string;
  name: string;
  locality: string;
  province: string;
  description: string;
  species: { name: string; rating: number; months: number[] }[];
  techniques: { name: string; rating: number }[];
  rating: number;
  difficulty: number;
}

interface Region {
  id: string;
  name: string;
  icon: string;
  description: string;
  topSpecies: string[];
  spots: Spot[];
}

export async function generateStaticParams() {
  return spotsData.regions.map((region) => ({
    region: region.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = spotsData.regions.find((r) => r.id === regionSlug) as Region | undefined;

  if (!region) {
    return { title: 'Regione non trovata' };
  }

  return {
    title: `Spot Pesca ${region.name} - Dove Pescare in ${region.name} | FishandTips`,
    description: `Scopri i migliori spot di pesca in ${region.name}: ${region.spots.map((s) => s.name).join(', ')}. Coordinate GPS, tecniche, specie e consigli per pescare in ${region.name}.`,
    keywords: `pesca ${region.name.toLowerCase()}, spot pesca ${region.name.toLowerCase()}, dove pescare ${region.name.toLowerCase()}, ${region.topSpecies.join(', ').toLowerCase()}`,
    openGraph: {
      title: `Spot Pesca ${region.name} - I Migliori Luoghi dove Pescare`,
      description: `La guida agli spot di pesca in ${region.name} con coordinate GPS e consigli.`,
    },
    alternates: {
      canonical: `https://fishandtips.it/spot-pesca-italia/${regionSlug}`,
    },
  };
}

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const colors: Record<number, string> = {
    1: 'bg-green-500',
    2: 'bg-green-400',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  };
  const labels: Record<number, string> = {
    1: 'Facile',
    2: 'Accessibile',
    3: 'Media',
    4: 'Difficile',
    5: 'Esperto',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = spotsData.regions.find((r) => r.id === regionSlug) as Region | undefined;

  if (!region) {
    notFound();
  }

  const currentMonth = new Date().getMonth() + 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/spot-pesca-italia"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors"
          >
            ← Tutti gli Spot
          </Link>

          <div className="flex items-start gap-4">
            <span className="text-6xl">{region.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Spot Pesca {region.name}
              </h1>
              <p className="text-blue-100 mt-2 max-w-2xl">{region.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="px-3 py-1 bg-white/10 rounded-full text-white text-sm">
                  📍 {region.spots.length} spot
                </div>
                {region.topSpecies.map((species) => (
                  <div key={species} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm">
                    🐟 {species}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {region.spots.map((spot) => {
            // Check if any species is in season
            const speciesInSeason = spot.species.filter((s) => s.months.includes(currentMonth));

            return (
              <Link
                key={spot.id}
                href={`/spot-pesca-italia/${region.id}/${spot.id}`}
                className="group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-[1.01]"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-5 py-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      📍 {spot.name}
                    </h2>
                    <DifficultyBadge difficulty={spot.difficulty} />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {spot.locality}, {spot.province}
                  </p>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-slate-300 text-sm mb-4">{spot.description}</p>

                  {/* Species */}
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-500 mb-2">Specie presenti:</h3>
                    <div className="flex flex-wrap gap-2">
                      {spot.species.map((s) => {
                        const inSeason = s.months.includes(currentMonth);
                        return (
                          <span
                            key={s.name}
                            className={`px-2 py-1 rounded-full text-xs ${
                              inSeason
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {'★'.repeat(s.rating)} {s.name}
                            {inSeason && ' 🎯'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-500 mb-2">Tecniche:</h3>
                    <div className="flex flex-wrap gap-2">
                      {spot.techniques.map((t) => (
                        <span
                          key={t.name}
                          className={`px-2 py-1 rounded-full text-xs ${
                            t.rating >= 4
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* In Season Alert */}
                  {speciesInSeason.length > 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                      <p className="text-green-400 text-sm">
                        🎯 <strong>In stagione ora:</strong>{' '}
                        {speciesInSeason.map((s) => s.name).join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">
                        {'★'.repeat(Math.floor(spot.rating))}
                      </span>
                      <span className="text-slate-500 text-sm">{spot.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400 text-sm">
                      <span>🤖 Chat AI disponibile</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Other Regions */}
      <section className="bg-slate-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Altre Regioni</h2>
          <div className="flex flex-wrap gap-3">
            {spotsData.regions
              .filter((r) => r.id !== region.id)
              .map((r) => (
                <Link
                  key={r.id}
                  href={`/spot-pesca-italia/${r.id}`}
                  className="px-4 py-2 bg-slate-800 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {r.icon} {r.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}


