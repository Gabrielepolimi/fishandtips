import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import calendarData from '../../../data/fishing-calendar.json';
import techniquesJson from '../../../data/fishing-techniques.json';
import regionalData from '../../../data/fishing-calendar-regional.json';
import spotsData from '../../../data/fishing-spots.json';

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

// ─── Month interfaces & data ───

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
  monthOverview?: string;
  expertTip?: string;
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

function isMonth(slug: string): slug is MonthSlug {
  return (MONTH_SLUGS as readonly string[]).includes(slug);
}

function getMonthIndex(slug: string): number {
  return MONTH_SLUGS.indexOf(slug as MonthSlug);
}

function getMonthData(slug: string): MonthData | null {
  const idx = getMonthIndex(slug);
  if (idx === -1) return null;
  return (calendarData.months as Record<string, MonthData>)[(idx + 1).toString()] || null;
}

// ─── Region interfaces & data ───

interface RegionalEntry {
  regione: string;
  mese: string;
  regionName: string;
  meseName: string;
  rating: number;
  waterTemp: string;
  species: { slug: string; name: string; activity: number }[];
  techniques: string[];
}

const MONTH_NAMES_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
const REGION_IDS = ['sardegna','sicilia','liguria','puglia','toscana','campania','lazio','calabria','veneto','emilia-romagna'];

// ─── Shared components ───

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

// ─── generateStaticParams (both months + regions) ───

export function generateStaticParams() {
  const monthParams = MONTH_SLUGS.map((m) => ({ regione: m }));
  const regionParams = REGION_IDS.map((r) => ({ regione: r }));
  return [...monthParams, ...regionParams];
}

// ─── generateMetadata ───

function buildMetaDescription(monthData: MonthData, monthName: string): string {
  const peakSpecies = monthData.species.filter(s => s.peak).map(s => s.name);
  const topTech = monthData.techniques[0]?.name || '';
  const speciesStr = peakSpecies.length > 0
    ? `Specie top: ${peakSpecies.join(', ')}.`
    : `${monthData.species.length} specie attive.`;
  return `Cosa pescare a ${monthName} nel Mediterraneo: ${speciesStr} Tecnica consigliata: ${topTech}. Acqua a ${monthData.waterTemp}, ${monthData.daylight} di luce.`;
}

export async function generateMetadata({ params }: { params: Promise<{ regione: string }> }): Promise<Metadata> {
  const { regione: slug } = await params;

  if (isMonth(slug)) {
    const monthData = getMonthData(slug);
    if (!monthData) return { title: 'Mese non trovato' };
    const monthName = MONTH_NAMES[slug];
    const description = buildMetaDescription(monthData, monthName);
    const url = `https://fishandtips.it/calendario-pesca/${slug}`;
    const idx = getMonthIndex(slug);
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
        images: [{ url: 'https://fishandtips.it/images/og-default.jpg', width: 1200, height: 630 }],
      },
      twitter: { card: 'summary', title: `Pesca a ${monthName} | FishandTips`, description },
      alternates: { canonical: url },
      other: {
        prev: `https://fishandtips.it/calendario-pesca/${prevSlug}`,
        next: `https://fishandtips.it/calendario-pesca/${nextSlug}`,
      },
    };
  }

  // Region
  const entries = (regionalData as any).entries.filter((e: RegionalEntry) => e.regione === slug);
  if (entries.length === 0) return { title: 'Regione non trovata' };
  const regionName = entries[0].regionName;
  const allSpecies = [...new Set(entries.flatMap((e: RegionalEntry) => e.species.map((s: { name: string }) => s.name)))];
  const topSpecies = allSpecies.slice(0, 5).join(', ');
  return {
    title: `Calendario Pesca ${regionName} - Cosa Pescare Mese per Mese | FishandTips`,
    description: `Calendario completo della pesca in ${regionName}: scopri cosa pescare ogni mese, le specie attive (${topSpecies}), gli spot migliori e le tecniche consigliate.`,
    openGraph: {
      title: `Calendario Pesca ${regionName} | FishandTips`,
      description: `Cosa pescare in ${regionName} mese per mese: specie, spot e tecniche per ogni stagione.`,
      type: 'website',
      url: `https://fishandtips.it/calendario-pesca/${slug}`,
      images: [{ url: 'https://fishandtips.it/images/og-default.jpg', width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://fishandtips.it/calendario-pesca/${slug}` },
  };
}

// ─── Page component ───

export default async function CalendarioSlugPage({ params }: { params: Promise<{ regione: string }> }) {
  const { regione: slug } = await params;

  if (isMonth(slug)) {
    return <MonthPage mese={slug} />;
  }

  return <RegionPage regione={slug} />;
}

// ─── Month page ───

function MonthPage({ mese }: { mese: MonthSlug }) {
  const monthData = getMonthData(mese);
  if (!monthData) notFound();

  const idx = getMonthIndex(mese);
  const monthName = MONTH_NAMES[mese];
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
            <Link href={`/calendario-pesca/${prevSlug}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {prevName}
            </Link>
            <Link href={`/calendario-pesca/${nextSlug}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm transition-colors">
              {nextName}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">{monthData.description}</p>
        </div>
      </div>

      {/* Month pills */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-1 justify-center flex-wrap">
            {MONTH_SLUGS.map((s) => (
              <Link key={s} href={`/calendario-pesca/${s}`} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${s === mese ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {MONTH_NAMES[s].slice(0, 3)}
              </Link>
            ))}
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

        {/* Month Overview + Expert Tip */}
        {(monthData.monthOverview || monthData.expertTip) && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {monthData.monthOverview && (
              <section className="p-6 rounded-xl bg-white border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Il mese in sintesi
                </h2>
                <p className="text-gray-700 leading-relaxed">{monthData.monthOverview}</p>
              </section>
            )}
            {monthData.expertTip && (
              <section className="p-6 rounded-xl bg-amber-50 border border-amber-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zM10 18a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1zM17.66 16.95a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM6.464 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>
                  Consiglio del mese
                </h2>
                <p className="text-gray-700 leading-relaxed">{monthData.expertTip}</p>
              </section>
            )}
          </div>
        )}

        {/* Species */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Specie attive a {monthName}</h2>
          <div className="grid gap-4">
            {monthData.species.map((species) => (
              <div key={species.name} className={`p-5 rounded-xl border transition-colors ${species.peak ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{species.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {species.name}
                          {species.peak && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Periodo top</span>}
                        </h3>
                        <StarRating rating={species.rating} />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{species.notes}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div><span className="text-gray-500">Tecniche: </span><span className="text-gray-900 font-medium">{species.techniques.join(', ')}</span></div>
                      <div><span className="text-gray-500">Orario: </span><span className="text-gray-900 font-medium">{species.bestTime}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Techniques */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tecniche consigliate a {monthName}</h2>
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
                  {techSlug && <p className="text-xs text-blue-600 mt-3 font-medium">Guida completa →</p>}
                </>
              );
              return techSlug ? (
                <Link key={technique.name} href={`/tecniche/${techSlug}`} className="p-5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">{inner}</Link>
              ) : (
                <div key={technique.name} className="p-5 rounded-xl bg-white border border-gray-200">{inner}</div>
              );
            })}
          </div>
        </section>

        {/* Baits */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Esche di {monthName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {monthData.baits.map((bait) => (
              <div key={bait.name} className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 text-sm">{bait.name}</h3>
                  <div className="flex">
                    {Array.from({ length: bait.rating }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Condizioni ideali a {monthName}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div><p className="text-gray-500 text-sm mb-1">Vento</p><p className="text-gray-900 font-medium">{monthData.conditions.idealWind}</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Mare</p><p className="text-gray-900 font-medium">{monthData.conditions.idealSea}</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Pressione</p><p className="text-gray-900 font-medium">{monthData.conditions.idealPressure}</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Luna</p><p className="text-gray-900 font-medium">{monthData.conditions.moonPhase}</p></div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4">Consigli per {monthName}</h3>
              <ul className="space-y-3">
                {monthData.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Explore months */}
        <section className="mb-10 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Esplora altri mesi</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MONTH_SLUGS.map((s) => {
              const md = (calendarData.months as Record<string, MonthData>)[(getMonthIndex(s) + 1).toString()];
              return (
                <Link key={s} href={`/calendario-pesca/${s}`} className={`p-3 rounded-xl text-center text-sm font-medium transition-colors ${s === mese ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                  {MONTH_NAMES[s]}
                  {md && <span className="block text-xs mt-0.5 opacity-70">{md.species.length} specie</span>}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Prev/Next */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Link href={`/calendario-pesca/${prevSlug}`} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {prevName}
          </Link>
          <Link href="/calendario-pesca" className="text-gray-500 hover:text-gray-900 text-sm">Calendario completo</Link>
          <Link href={`/calendario-pesca/${nextSlug}`} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            {nextName}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Region page ───

function RegionPage({ regione }: { regione: string }) {
  const entries = (regionalData as any).entries.filter((e: RegionalEntry) => e.regione === regione) as RegionalEntry[];
  if (entries.length === 0) notFound();

  const regionName = entries[0].regionName;
  const regionObj = (spotsData as any).regions.find((r: any) => r.id === regione);
  const siteUrl = 'https://fishandtips.it';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Calendario Pesca', item: `${siteUrl}/calendario-pesca` },
      { '@type': 'ListItem', position: 3, name: regionName, item: `${siteUrl}/calendario-pesca/${regione}` },
    ],
  };

  const bestMonth = entries.reduce((best, e) => e.rating > best.rating ? e : best, entries[0]);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-b from-gray-50 to-white pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/calendario-pesca" className="text-gray-500 hover:text-gray-900">Calendario Pesca</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{regionName}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Calendario Pesca {regionName}: cosa pescare mese per mese
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Scopri le specie attive, gli spot migliori e le tecniche consigliate in {regionName} per ogni mese dell&apos;anno.
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <Link href={`/spot-pesca-italia/${regione}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Spot in {regionName} →</Link>
            <Link href={`/calendario-pesca/${bestMonth.mese}`} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">Calendario nazionale {bestMonth.meseName} →</Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">I 12 mesi in {regionName}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => {
              const ratingColors = ['bg-gray-50 border-gray-200', 'bg-amber-50 border-amber-200', 'bg-emerald-50 border-emerald-200', 'bg-emerald-100 border-emerald-300'];
              const topSpecies = entry.species.slice(0, 3);
              return (
                <Link key={entry.mese} href={`/calendario-pesca/${regione}/${entry.mese}`} className={`p-5 rounded-xl border ${ratingColors[entry.rating]} hover:shadow-md transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{entry.meseName}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <svg key={s} className={`w-4 h-4 ${s <= entry.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{entry.waterTemp} • {entry.species.length} specie</p>
                  <div className="flex flex-wrap gap-1">
                    {topSpecies.map(s => (
                      <span key={s.slug} className="px-2 py-0.5 bg-white/80 text-gray-700 text-xs rounded-full">{s.name}</span>
                    ))}
                    {entry.species.length > 3 && <span className="px-2 py-0.5 text-gray-400 text-xs">+{entry.species.length - 3}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Calendario nelle altre regioni</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {REGION_IDS.filter(r => r !== regione).map(r => {
              const rObj = (spotsData as any).regions.find((reg: any) => reg.id === r);
              return (
                <Link key={r} href={`/calendario-pesca/${r}`} className="p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-center">
                  <p className="text-sm font-medium text-gray-900">{rObj?.name || r}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="p-8 bg-gray-50 rounded-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/calendario-pesca" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
              <div className="text-3xl">📅</div>
              <div>
                <p className="font-semibold text-gray-900">Calendario Nazionale</p>
                <p className="text-sm text-gray-500">Cosa pescare in tutta Italia mese per mese</p>
              </div>
            </Link>
            <Link href={`/spot-pesca-italia/${regione}`} className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
              <div className="text-3xl">📍</div>
              <div>
                <p className="font-semibold text-gray-900">Spot in {regionName}</p>
                <p className="text-sm text-gray-500">{regionObj?.spots?.length || 0} spot con dettagli completi</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
