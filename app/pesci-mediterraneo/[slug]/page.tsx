import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fishData from '../../../data/fish-encyclopedia.json';

interface FishData {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  otherNames: string[];
  family: string;
  category: string;
  icon: string;
  description: string;
  characteristics: {
    maxLength: string;
    avgLength: string;
    maxWeight: string;
    avgWeight: string;
    lifespan: string;
    color: string;
    bodyShape: string;
  };
  habitat: {
    environment: string;
    depth: string;
    substrate: string;
    description: string;
  };
  behavior: {
    feeding: string;
    activity: string;
    social: string;
    migration: string;
  };
  reproduction: {
    period: string;
    maturity: string;
    spawning: string;
  };
  fishing: {
    techniques: string[];
    bestTechnique: string;
    bestBaits: string[];
    bestArtificials: string[];
    bestSpots: string;
    difficulty: number;
    fightRating: number;
    tips: string[];
  };
  seasonality: {
    best: number[];
    good: number[];
    difficult: number[];
    description: string;
  };
  records: {
    worldRecord: string;
    italyRecord: string;
    averageTrophy: string;
  };
  culinary: {
    edible: boolean;
    quality: number;
    taste: string;
    cooking: string[];
    minSize: string;
  };
  curiosities: string[];
  conservation: {
    status: string;
    threats: string;
    regulations: string;
  };
  relatedProducts: {
    name: string;
    type: string;
    amazonUrl: string;
  }[];
}

const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function StarRating({ rating, max = 5, label }: { rating: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-slate-400 text-sm">{label}:</span>}
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

function SeasonalityBar({ best, good }: { best: number[]; good: number[] }) {
  const currentMonth = new Date().getMonth() + 1;
  
  return (
    <div className="flex gap-1">
      {Array.from({ length: 12 }).map((_, i) => {
        const month = i + 1;
        const isBest = best.includes(month);
        const isGood = good.includes(month);
        const isCurrent = month === currentMonth;
        
        return (
          <div key={month} className="flex-1 text-center">
            <div
              className={`h-8 rounded-md mb-1 transition-all ${
                isBest
                  ? 'bg-green-500'
                  : isGood
                  ? 'bg-yellow-500'
                  : 'bg-slate-700'
              } ${isCurrent ? 'ring-2 ring-cyan-400' : ''}`}
            />
            <span className={`text-xs ${isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
              {monthNames[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export async function generateStaticParams() {
  return fishData.fish.map((fish) => ({
    slug: fish.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fish = fishData.fish.find((f) => f.slug === slug) as FishData | undefined;
  
  if (!fish) {
    return { title: 'Pesce non trovato' };
  }

  return {
    title: `${fish.name} - Come Pescare, Tecniche e Stagioni | FishandTips`,
    description: `Guida completa alla ${fish.name.toLowerCase()} (${fish.scientificName}): caratteristiche, habitat, tecniche di pesca, esche migliori, stagioni e consigli per catturarla.`,
    keywords: `${fish.name.toLowerCase()}, come pescare ${fish.name.toLowerCase()}, ${fish.scientificName.toLowerCase()}, pesca ${fish.name.toLowerCase()}, tecniche pesca ${fish.name.toLowerCase()}, esche ${fish.name.toLowerCase()}, quando pescare ${fish.name.toLowerCase()}`,
    openGraph: {
      title: `${fish.name} - Guida Completa alla Pesca`,
      description: `Scopri tutto sulla ${fish.name.toLowerCase()}: tecniche, esche, stagioni e segreti per catturarla.`,
      type: 'article',
    },
    alternates: {
      canonical: `https://fishandtips.it/pesci-mediterraneo/${fish.slug}`,
    },
  };
}

export default async function FishDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fish = fishData.fish.find((f) => f.slug === slug) as FishData | undefined;

  if (!fish) {
    notFound();
  }

  const currentMonth = new Date().getMonth() + 1;
  const isInSeason = fish.seasonality.best.includes(currentMonth);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/pesci-mediterraneo"
            className="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-4 transition-colors"
          >
            ← Pesci del Mediterraneo
          </Link>
          
          <div className="flex items-start gap-4">
            <span className="text-6xl">{fish.icon}</span>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {fish.name}
                </h1>
                {isInSeason && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    🎯 In stagione ora!
                  </span>
                )}
              </div>
              <p className="text-teal-100 italic text-lg">{fish.scientificName}</p>
              {fish.otherNames.length > 0 && (
                <p className="text-teal-200 text-sm mt-1">
                  Altri nomi: {fish.otherNames.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Description */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <p className="text-slate-300 text-lg leading-relaxed">{fish.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-500 text-sm">Taglia max</p>
            <p className="text-xl font-bold text-white">{fish.characteristics.maxLength}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-500 text-sm">Peso medio</p>
            <p className="text-xl font-bold text-cyan-400">{fish.characteristics.avgWeight}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-500 text-sm">Difficoltà</p>
            <StarRating rating={fish.fishing.difficulty} />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-500 text-sm">Combattività</p>
            <StarRating rating={fish.fishing.fightRating} />
          </div>
        </div>

        {/* Seasonality */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📅 Stagionalità
          </h2>
          <SeasonalityBar best={fish.seasonality.best} good={fish.seasonality.good} />
          <div className="flex gap-4 mt-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded" /> Periodo migliore
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-500 rounded" /> Buono
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-slate-700 rounded" /> Difficile
            </span>
          </div>
          <p className="text-slate-400 mt-3">{fish.seasonality.description}</p>
        </section>

        {/* Fishing Section */}
        <section className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 rounded-xl p-6 border border-cyan-500/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🎣 Come Pescare la {fish.name}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-cyan-400 mb-2">Tecniche</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {fish.fishing.techniques.map((tech) => (
                  <span
                    key={tech}
                    className={`px-3 py-1 rounded-full text-sm ${
                      tech === fish.fishing.bestTechnique
                        ? 'bg-cyan-500 text-white font-bold'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {tech === fish.fishing.bestTechnique && '⭐ '}
                    {tech}
                  </span>
                ))}
              </div>

              <h3 className="font-bold text-cyan-400 mb-2">Esche Naturali</h3>
              <ul className="text-slate-300 mb-4">
                {fish.fishing.bestBaits.map((bait) => (
                  <li key={bait} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {bait}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-cyan-400 mb-2">Artificiali Consigliati</h3>
              <ul className="text-slate-300 mb-4">
                {fish.fishing.bestArtificials.map((art) => (
                  <li key={art} className="flex items-center gap-2">
                    <span className="text-amber-400">★</span> {art}
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-cyan-400 mb-2">Dove Trovarla</h3>
              <p className="text-slate-300">{fish.fishing.bestSpots}</p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-bold text-yellow-400 mb-2">💡 Consigli degli Esperti</h3>
            <ul className="space-y-2">
              {fish.fishing.tips.map((tip, index) => (
                <li key={index} className="text-slate-300 flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Characteristics & Habitat */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">📋 Caratteristiche</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Lunghezza massima</dt>
                <dd className="text-white">{fish.characteristics.maxLength}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Lunghezza media</dt>
                <dd className="text-white">{fish.characteristics.avgLength}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Peso massimo</dt>
                <dd className="text-white">{fish.characteristics.maxWeight}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Longevità</dt>
                <dd className="text-white">{fish.characteristics.lifespan}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Colore</dt>
                <dd className="text-white">{fish.characteristics.color}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Famiglia</dt>
                <dd className="text-white">{fish.family}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">🌊 Habitat</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Ambiente</dt>
                <dd className="text-white">{fish.habitat.environment}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Profondità</dt>
                <dd className="text-white">{fish.habitat.depth}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Fondale</dt>
                <dd className="text-white">{fish.habitat.substrate}</dd>
              </div>
            </dl>
            <p className="text-slate-400 text-sm mt-4">{fish.habitat.description}</p>
          </section>
        </div>

        {/* Behavior & Reproduction */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">🔄 Comportamento</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Alimentazione</dt>
                <dd className="text-white">{fish.behavior.feeding}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Attività</dt>
                <dd className="text-white">{fish.behavior.activity}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Socialità</dt>
                <dd className="text-white">{fish.behavior.social}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Migrazione</dt>
                <dd className="text-white">{fish.behavior.migration}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">🥚 Riproduzione</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Periodo</dt>
                <dd className="text-white">{fish.reproduction.period}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Maturità sessuale</dt>
                <dd className="text-white">{fish.reproduction.maturity}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Deposizione</dt>
                <dd className="text-white">{fish.reproduction.spawning}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Records */}
        <section className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🏆 Record</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-slate-400 text-sm">Record Mondiale</p>
              <p className="text-xl font-bold text-amber-400">{fish.records.worldRecord}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Record Italia</p>
              <p className="text-xl font-bold text-amber-400">{fish.records.italyRecord}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Trofeo</p>
              <p className="text-white">{fish.records.averageTrophy}</p>
            </div>
          </div>
        </section>

        {/* Culinary */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🍽️ In Cucina</h2>
          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={fish.culinary.quality} label="Qualità" />
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Taglia minima: {fish.culinary.minSize}</span>
          </div>
          <p className="text-slate-300 mb-3">{fish.culinary.taste}</p>
          <div className="flex flex-wrap gap-2">
            {fish.culinary.cooking.map((method) => (
              <span key={method} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                {method}
              </span>
            ))}
          </div>
        </section>

        {/* Curiosities */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 Curiosità</h2>
          <ul className="space-y-2">
            {fish.curiosities.map((curiosity, index) => (
              <li key={index} className="text-slate-300 flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                {curiosity}
              </li>
            ))}
          </ul>
        </section>

        {/* Conservation */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🌍 Conservazione</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-slate-500 text-sm">Stato IUCN</p>
              <p className={`font-bold ${
                fish.conservation.status.includes('LC') ? 'text-green-400' :
                fish.conservation.status.includes('VU') ? 'text-yellow-400' :
                fish.conservation.status.includes('EN') ? 'text-red-400' : 'text-white'
              }`}>
                {fish.conservation.status}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Minacce</p>
              <p className="text-white">{fish.conservation.threats}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Regolamentazioni</p>
              <p className="text-white">{fish.conservation.regulations}</p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {fish.relatedProducts.length > 0 && (
          <section className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/30 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">🛒 Prodotti Consigliati</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {fish.relatedProducts.map((product) => (
                <a
                  key={product.name}
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-white">{product.name}</p>
                    <p className="text-slate-400 text-sm">{product.type}</p>
                  </div>
                  <span className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg transition-colors">
                    Amazon
                  </span>
                </a>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-4">
              * Link affiliati Amazon. Acquistando ci aiuti a mantenere il sito gratuito.
            </p>
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
          <Link
            href="/pesci-mediterraneo"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Tutti i Pesci
          </Link>
          <Link
            href="/calendario-pesca"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Calendario Pesca →
          </Link>
        </div>
      </div>
    </main>
  );
}

