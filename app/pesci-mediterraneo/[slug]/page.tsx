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

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
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
              className={`h-8 rounded-sm ${
                isBest
                  ? 'bg-emerald-500'
                  : isGood
                  ? 'bg-amber-400'
                  : 'bg-gray-100'
              } ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            />
            <span className={`text-xs ${isCurrent ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
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
    keywords: `${fish.name.toLowerCase()}, come pescare ${fish.name.toLowerCase()}, ${fish.scientificName.toLowerCase()}, pesca ${fish.name.toLowerCase()}, tecniche pesca ${fish.name.toLowerCase()}`,
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
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/pesci-mediterraneo" className="text-gray-500 hover:text-gray-900">
              Pesci
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{fish.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-5xl">
              {fish.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {fish.name}
                </h1>
                {isInSeason && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    In stagione
                  </span>
                )}
              </div>
              <p className="text-gray-500 italic mb-2">{fish.scientificName}</p>
              {fish.otherNames.length > 0 && (
                <p className="text-gray-400 text-sm">
                  Altri nomi: {fish.otherNames.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Description */}
        <div className="mb-10">
          <p className="text-gray-700 text-lg leading-relaxed">{fish.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Taglia max</p>
            <p className="text-xl font-bold text-gray-900">{fish.characteristics.maxLength}</p>
          </div>
          <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Peso medio</p>
            <p className="text-xl font-bold text-blue-700">{fish.characteristics.avgWeight}</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-2">Difficoltà</p>
            <div className="flex justify-center">
              <StarRating rating={fish.fishing.difficulty} />
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-2">Combattività</p>
            <div className="flex justify-center">
              <StarRating rating={fish.fishing.fightRating} />
            </div>
          </div>
        </div>

        {/* Seasonality */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stagionalità</h2>
          <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
            <SeasonalityBar best={fish.seasonality.best} good={fish.seasonality.good} />
            <div className="flex gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-emerald-500 rounded" /> Periodo migliore
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-amber-400 rounded" /> Buono
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-100 rounded border border-gray-200" /> Difficile
              </span>
            </div>
            <p className="text-gray-600 mt-4">{fish.seasonality.description}</p>
          </div>
        </section>

        {/* Fishing Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Come pescare la {fish.name}
          </h2>
          <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tecniche</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {fish.fishing.techniques.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        tech === fish.fishing.bestTechnique
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {tech === fish.fishing.bestTechnique && '⭐ '}
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">Esche naturali</h3>
                <ul className="space-y-2 mb-6">
                  {fish.fishing.bestBaits.map((bait) => (
                    <li key={bait} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {bait}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Artificiali</h3>
                <ul className="space-y-2 mb-6">
                  {fish.fishing.bestArtificials.map((art) => (
                    <li key={art} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      {art}
                    </li>
                  ))}
                </ul>

                <h3 className="font-semibold text-gray-900 mb-3">Dove trovarla</h3>
                <p className="text-gray-700">{fish.fishing.bestSpots}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Consigli degli esperti</h3>
              <ul className="space-y-2">
                {fish.fishing.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Characteristics & Habitat */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <section className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Caratteristiche</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Lunghezza massima</dt>
                <dd className="text-gray-900 font-medium">{fish.characteristics.maxLength}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Lunghezza media</dt>
                <dd className="text-gray-900">{fish.characteristics.avgLength}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Peso massimo</dt>
                <dd className="text-gray-900">{fish.characteristics.maxWeight}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Longevità</dt>
                <dd className="text-gray-900">{fish.characteristics.lifespan}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Colore</dt>
                <dd className="text-gray-900">{fish.characteristics.color}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Famiglia</dt>
                <dd className="text-gray-900">{fish.family}</dd>
              </div>
            </dl>
          </section>

          <section className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Habitat</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Ambiente</dt>
                <dd className="text-gray-900">{fish.habitat.environment}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Profondità</dt>
                <dd className="text-gray-900">{fish.habitat.depth}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Fondale</dt>
                <dd className="text-gray-900">{fish.habitat.substrate}</dd>
              </div>
            </dl>
            <p className="text-gray-600 text-sm mt-4">{fish.habitat.description}</p>
          </section>
        </div>

        {/* Behavior & Reproduction */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <section className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comportamento</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">Alimentazione</dt>
                <dd className="text-gray-900">{fish.behavior.feeding}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">Attività</dt>
                <dd className="text-gray-900">{fish.behavior.activity}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">Socialità</dt>
                <dd className="text-gray-900">{fish.behavior.social}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">Migrazione</dt>
                <dd className="text-gray-900">{fish.behavior.migration}</dd>
              </div>
            </dl>
          </section>

          <section className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riproduzione</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">Periodo</dt>
                <dd className="text-gray-900">{fish.reproduction.period}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">Maturità sessuale</dt>
                <dd className="text-gray-900">{fish.reproduction.maturity}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">Deposizione</dt>
                <dd className="text-gray-900">{fish.reproduction.spawning}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Records */}
        <section className="p-6 rounded-xl bg-amber-50 border border-amber-100 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Record</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Record Mondiale</p>
              <p className="text-xl font-bold text-amber-700">{fish.records.worldRecord}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Record Italia</p>
              <p className="text-xl font-bold text-amber-700">{fish.records.italyRecord}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Trofeo</p>
              <p className="text-gray-900">{fish.records.averageTrophy}</p>
            </div>
          </div>
        </section>

        {/* Culinary */}
        <section className="p-6 rounded-xl bg-white border border-gray-200 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">In cucina</h2>
          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Qualità:</span>
              <StarRating rating={fish.culinary.quality} />
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">Taglia minima: {fish.culinary.minSize}</span>
          </div>
          <p className="text-gray-700 mb-4">{fish.culinary.taste}</p>
          <div className="flex flex-wrap gap-2">
            {fish.culinary.cooking.map((method) => (
              <span key={method} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {method}
              </span>
            ))}
          </div>
        </section>

        {/* Curiosities */}
        <section className="p-6 rounded-xl bg-white border border-gray-200 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Curiosità</h2>
          <ul className="space-y-3">
            {fish.curiosities.map((curiosity, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {curiosity}
              </li>
            ))}
          </ul>
        </section>

        {/* Conservation */}
        <section className="p-6 rounded-xl bg-white border border-gray-200 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conservazione</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stato IUCN</p>
              <p className={`font-semibold ${
                fish.conservation.status.includes('LC') ? 'text-emerald-600' :
                fish.conservation.status.includes('VU') ? 'text-amber-600' :
                fish.conservation.status.includes('EN') ? 'text-rose-600' : 'text-gray-900'
              }`}>
                {fish.conservation.status}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Minacce</p>
              <p className="text-gray-900">{fish.conservation.threats}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Regolamentazioni</p>
              <p className="text-gray-900">{fish.conservation.regulations}</p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {fish.relatedProducts.length > 0 && (
          <section className="p-6 rounded-xl bg-amber-50 border border-amber-100 mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Prodotti consigliati</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {fish.relatedProducts.map((product) => (
                <a
                  key={product.name}
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-300 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-gray-500 text-sm">{product.type}</p>
                  </div>
                  <span className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors">
                    Amazon
                  </span>
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Link affiliati Amazon. Acquistando ci aiuti a mantenere il sito gratuito.
            </p>
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Link
            href="/pesci-mediterraneo"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti i pesci
          </Link>
          <Link
            href="/calendario-pesca"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            Calendario pesca
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
