import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import calendarData from '../../../data/fishing-calendar.json';
import techniquesJson from '../../../data/fishing-techniques.json';

const TECH_SLUG_MAP: Record<string, string> = {};
for (const t of techniquesJson.techniques) {
  TECH_SLUG_MAP[t.name.toLowerCase()] = t.slug;
}
TECH_SLUG_MAP['eging notturno'] = 'eging';
TECH_SLUG_MAP['light game'] = 'light-rock-fishing';
TECH_SLUG_MAP['shore jigging'] = 'jigging';
TECH_SLUG_MAP['spinning alba'] = 'spinning';
TECH_SLUG_MAP['surfcasting notturno'] = 'surfcasting';
TECH_SLUG_MAP['totanara'] = 'eging';

interface Species {
  name: string;
  rating: number;
  icon: string;
  peak: boolean;
  notes: string;
  techniques: string[];
  bestTime: string;
}

interface Technique {
  name: string;
  rating: number;
  target: string;
  tip: string;
}

interface Bait {
  name: string;
  target: string;
  rating: number;
}

interface MonthData {
  name: string;
  season: string;
  waterTemp: string;
  daylight: string;
  overallRating: number;
  description: string;
  species: Species[];
  techniques: Technique[];
  baits: Bait[];
  conditions: {
    idealWind: string;
    idealSea: string;
    idealPressure: string;
    moonPhase: string;
  };
  tips: string[];
}

const MONTH_SLUGS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
] as const;

type MonthSlug = typeof MONTH_SLUGS[number];

const MONTH_NAMES: Record<MonthSlug, string> = {
  gennaio: 'Gennaio', febbraio: 'Febbraio', marzo: 'Marzo', aprile: 'Aprile',
  maggio: 'Maggio', giugno: 'Giugno', luglio: 'Luglio', agosto: 'Agosto',
  settembre: 'Settembre', ottobre: 'Ottobre', novembre: 'Novembre', dicembre: 'Dicembre',
};

const seasonColors: Record<string, string> = {
  inverno: 'bg-blue-50 text-blue-700 border-blue-200',
  primavera: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  estate: 'bg-amber-50 text-amber-700 border-amber-200',
  autunno: 'bg-orange-50 text-orange-700 border-orange-200',
};

const seasonIcons: Record<string, string> = {
  inverno: '❄️', primavera: '🌸', estate: '☀️', autunno: '🍂',
};

function getMonthIndex(slug: string): number {
  return MONTH_SLUGS.indexOf(slug as MonthSlug);
}

function getMonthData(slug: string): MonthData | null {
  const idx = getMonthIndex(slug);
  if (idx === -1) return null;
  return (calendarData.months as Record<string, MonthData>)[(idx + 1).toString()] || null;
}

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

export function generateStaticParams() {
  return MONTH_SLUGS.map((mese) => ({ mese }));
}

function buildMetaDescription(monthData: MonthData, monthName: string): string {
  const peakSpecies = monthData.species.filter(s => s.peak).map(s => s.name);
  const topTech = monthData.techniques[0]?.name || '';
  const speciesStr = peakSpecies.length > 0
    ? `Specie top: ${peakSpecies.join(', ')}.`
    : `${monthData.species.length} specie attive.`;
  return `Cosa pescare a ${monthName} nel Mediterraneo: ${speciesStr} Tecnica consigliata: ${topTech}. Acqua a ${monthData.waterTemp}, ${monthData.daylight} di luce.`;
}

export async function generateMetadata({ params }: { params: Promise<{ mese: string }> }): Promise<Metadata> {
  const { mese } = await params;
  const monthData = getMonthData(mese);
  if (!monthData) return { title: 'Mese non trovato' };

  const monthName = MONTH_NAMES[mese as MonthSlug];
  const description = buildMetaDescription(monthData, monthName);
  const url = `https://fishandtips.it/calendario-pesca/${mese}`;

  const idx = getMonthIndex(mese);
  const prevSlug = MONTH_SLUGS[(idx - 1 + 12) % 12];
  const nextSlug = MONTH_SLUGS[(idx + 1) % 12];

  return {
    title: `Pesca a ${monthName} - Cosa Pescare nel Mediterraneo | FishandTips`,
    description,
    keywords: `pesca ${monthName.toLowerCase()}, cosa pescare ${monthName.toLowerCase()}, calendario pesca ${monthName.toLowerCase()}, mediterraneo ${monthName.toLowerCase()}, specie pesca ${monthName.toLowerCase()}`,
    openGraph: {
      title: `Pesca a ${monthName}: Cosa Pescare nel Mediterraneo`,
      description,
      type: 'article',
      url,
      siteName: 'FishandTips',
    },
    twitter: {
      card: 'summary',
      title: `Pesca a ${monthName} | FishandTips`,
      description,
    },
    alternates: {
      canonical: url,
    },
    other: {
      prev: `https://fishandtips.it/calendario-pesca/${prevSlug}`,
      next: `https://fishandtips.it/calendario-pesca/${nextSlug}`,
    },
  };
}

export default async function MeseCalendarioPage({ params }: { params: Promise<{ mese: string }> }) {
  const { mese } = await params;
  const monthData = getMonthData(mese);

  if (!monthData) notFound();

  const idx = getMonthIndex(mese);
  const monthName = MONTH_NAMES[mese as MonthSlug];
  const prevSlug = MONTH_SLUGS[(idx - 1 + 12) % 12];
  const nextSlug = MONTH_SLUGS[(idx + 1) % 12];
  const prevName = MONTH_NAMES[prevSlug];
  const nextName = MONTH_NAMES[nextSlug];
  const siteUrl = 'https://fishandtips.it';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Calendario Pesca', item: `${siteUrl}/calendario-pesca` },
      { '@type': 'ListItem', position: 3, name: `Pesca a ${monthName}`, item: `${siteUrl}/calendario-pesca/${mese}` },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Cosa pescare a ${monthName}: guida completa`,
    description: buildMetaDescription(monthData, monthName),
    url: `${siteUrl}/calendario-pesca/${mese}`,
    author: { '@type': 'Person', name: 'FishandTips' },
    publisher: { '@type': 'Organization', name: 'FishandTips', url: siteUrl },
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `${siteUrl}/calendario-pesca/${mese}`,
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/calendario-pesca" className="text-gray-500 hover:text-gray-900">Calendario Pesca</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{monthName}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/calendario-pesca/${prevSlug}`}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prevName}
            </Link>
            <Link
              href={`/calendario-pesca/${nextSlug}`}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              {nextName}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${seasonColors[monthData.season]}`}>
              {seasonIcons[monthData.season]} {monthData.season.charAt(0).toUpperCase() + monthData.season.slice(1)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Cosa pescare a {monthName}: guida completa
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            {monthData.description}
          </p>
        </div>
      </div>

      {/* Month pills navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-1 justify-center flex-wrap">
            {MONTH_SLUGS.map((slug) => {
              const isActive = slug === mese;
              return (
                <Link
                  key={slug}
                  href={`/calendario-pesca/${slug}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {MONTH_NAMES[slug].slice(0, 3)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-2">Valutazione mese</p>
            <StarRating rating={monthData.overallRating} />
          </div>
          <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Temperatura acqua</p>
            <p className="text-xl font-bold text-blue-700">{monthData.waterTemp}</p>
          </div>
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Ore di luce</p>
            <p className="text-xl font-bold text-amber-700">{monthData.daylight}</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Specie attive</p>
            <p className="text-xl font-bold text-gray-900">{monthData.species.length}</p>
          </div>
        </div>

        {/* Species Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Specie attive a {monthName}
          </h2>
          <div className="grid gap-4">
            {monthData.species.map((species) => (
              <div
                key={species.name}
                className={`p-5 rounded-xl border transition-colors ${
                  species.peak
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{species.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {species.name}
                          {species.peak && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              Periodo top
                            </span>
                          )}
                        </h3>
                        <StarRating rating={species.rating} />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{species.notes}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tecniche: </span>
                        <span className="text-gray-900 font-medium">{species.techniques.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Orario: </span>
                        <span className="text-gray-900 font-medium">{species.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Techniques Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Tecniche consigliate a {monthName}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {monthData.techniques.map((technique) => {
              const techSlug = TECH_SLUG_MAP[technique.name.toLowerCase()];
              const inner = (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{technique.name}</h3>
                    <StarRating rating={technique.rating} />
                  </div>
                  <p className="text-blue-600 text-sm mb-2">Target: {technique.target}</p>
                  <p className="text-gray-500 text-sm">{technique.tip}</p>
                  {techSlug && (
                    <p className="text-xs text-blue-600 mt-3 font-medium">Guida completa →</p>
                  )}
                </>
              );
              return techSlug ? (
                <Link key={technique.name} href={`/tecniche/${techSlug}`} className="p-5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  {inner}
                </Link>
              ) : (
                <div key={technique.name} className="p-5 rounded-xl bg-white border border-gray-200">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        {/* Baits Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Esche di {monthName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {monthData.baits.map((bait) => (
              <div
                key={bait.name}
                className="p-4 rounded-xl bg-white border border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 text-sm">{bait.name}</h3>
                  <div className="flex">
                    {Array.from({ length: bait.rating }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-xs">{bait.target}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions & Tips */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Condizioni ideali a {monthName}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Vento</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.idealWind}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Mare</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.idealSea}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Pressione</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.idealPressure}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Luna</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.moonPhase}</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4">Consigli per {monthName}</h3>
              <ul className="space-y-3">
                {monthData.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* All months links */}
        <section className="mb-10 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Esplora altri mesi</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MONTH_SLUGS.map((slug) => {
              const isActive = slug === mese;
              const md = (calendarData.months as Record<string, MonthData>)[(getMonthIndex(slug) + 1).toString()];
              return (
                <Link
                  key={slug}
                  href={`/calendario-pesca/${slug}`}
                  className={`p-3 rounded-xl text-center text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {MONTH_NAMES[slug]}
                  {md && <span className="block text-xs mt-0.5 opacity-70">{md.species.length} specie</span>}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Prev/Next navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Link
            href={`/calendario-pesca/${prevSlug}`}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevName}
          </Link>
          <Link
            href="/calendario-pesca"
            className="text-gray-500 hover:text-gray-900 text-sm"
          >
            Calendario completo
          </Link>
          <Link
            href={`/calendario-pesca/${nextSlug}`}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            {nextName}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
