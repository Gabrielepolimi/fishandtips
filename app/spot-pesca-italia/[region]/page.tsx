import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import spotsData from '../../../data/fishing-spots.json';
import fishData from '../../../data/fish-encyclopedia.json';

interface SpeciesEntry { name: string; rating: number; months: number[] }
interface TechniqueEntry { name: string; rating: number; notes?: string }
interface Spot {
  id: string;
  name: string;
  locality: string;
  province: string;
  description: string;
  environment?: string;
  species: SpeciesEntry[];
  techniques: TechniqueEntry[];
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

const MONTH_NAMES = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const MONTH_SLUGS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

const fishSlugMap: Record<string, string> = {};
(fishData as any).fish.forEach((f: any) => { fishSlugMap[f.name.toLowerCase()] = f.slug; });

function speciesSlug(name: string): string | null {
  return fishSlugMap[name.toLowerCase()] || null;
}

export function generateStaticParams() {
  return spotsData.regions.map((r) => ({ region: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: slug } = await params;
  const region = spotsData.regions.find((r) => r.id === slug) as Region | undefined;
  if (!region) return { title: 'Regione non trovata' };

  const speciesAll = [...new Set(region.spots.flatMap(s => s.species.map(sp => sp.name)))];
  const desc = `Pesca in ${region.name}: ${region.spots.length} spot con coordinate GPS. Specie principali: ${speciesAll.slice(0, 4).join(', ')}. Tecniche, esche e consigli per pescare in ${region.name}.`;
  const url = `https://fishandtips.it/spot-pesca-italia/${slug}`;

  return {
    title: `Pesca in ${region.name} - Migliori Spot e Tecniche | FishandTips`,
    description: desc,
    keywords: `pesca ${region.name.toLowerCase()}, spot pesca ${region.name.toLowerCase()}, dove pescare ${region.name.toLowerCase()}, ${speciesAll.slice(0, 5).join(', ').toLowerCase()}`,
    openGraph: {
      title: `Pesca in ${region.name}: ${region.spots.length} Spot con GPS`,
      description: desc,
      type: 'article',
      url,
      siteName: 'FishandTips',
    },
    twitter: { card: 'summary', title: `Pesca in ${region.name} | FishandTips`, description: desc },
    alternates: { canonical: url },
  };
}

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const colors: Record<number, string> = { 1: 'bg-emerald-50 text-emerald-700 border-emerald-200', 2: 'bg-teal-50 text-teal-700 border-teal-200', 3: 'bg-amber-50 text-amber-700 border-amber-200', 4: 'bg-orange-50 text-orange-700 border-orange-200', 5: 'bg-rose-50 text-rose-700 border-rose-200' };
  const labels: Record<number, string> = { 1: 'Facile', 2: 'Accessibile', 3: 'Media', 4: 'Difficile', 5: 'Esperto' };
  return <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colors[difficulty]}`}>{labels[difficulty]}</span>;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = spotsData.regions.find((r) => r.id === regionSlug) as Region | undefined;
  if (!region) notFound();

  const siteUrl = 'https://fishandtips.it';
  const currentMonth = new Date().getMonth() + 1;

  const allSpecies = [...new Set(region.spots.flatMap(s => s.species.map(sp => sp.name)))].sort();
  const allTechniques = [...new Set(region.spots.flatMap(s => s.techniques.map(t => t.name)))].sort();
  const avgDifficulty = +(region.spots.reduce((a, s) => a + s.difficulty, 0) / region.spots.length).toFixed(1);
  const avgRating = +(region.spots.reduce((a, s) => a + s.rating, 0) / region.spots.length).toFixed(1);

  const monthActivity = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const count = region.spots.reduce((acc, s) => acc + s.species.filter(sp => sp.months.includes(month)).length, 0);
    return { month, count };
  });
  const maxActivity = Math.max(...monthActivity.map(m => m.count));
  const bestMonths = monthActivity.filter(m => m.count >= maxActivity * 0.8).map(m => m.month);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Spot Pesca Italia', item: `${siteUrl}/spot-pesca-italia` },
      { '@type': 'ListItem', position: 3, name: `Pesca in ${region.name}`, item: `${siteUrl}/spot-pesca-italia/${regionSlug}` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Spot di pesca in ${region.name}`,
    numberOfItems: region.spots.length,
    itemListElement: region.spots.map((spot, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: spot.name,
      url: `${siteUrl}/spot-pesca-italia/${regionSlug}/${spot.id}`,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/spot-pesca-italia" className="text-gray-500 hover:text-gray-900">Spot Pesca Italia</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{region.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{region.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Pesca in {region.name}: guida agli spot migliori
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            {region.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Spot mappati</p>
            <p className="text-2xl font-bold text-blue-700">{region.spots.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Specie presenti</p>
            <p className="text-2xl font-bold text-emerald-700">{allSpecies.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Valutazione media</p>
            <p className="text-2xl font-bold text-amber-700">{avgRating}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Difficoltà media</p>
            <p className="text-2xl font-bold text-gray-900">{avgDifficulty}/5</p>
          </div>
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Mesi migliori</p>
            <p className="text-lg font-bold text-cyan-700">{bestMonths.map(m => MONTH_NAMES[m-1].slice(0,3)).join(', ')}</p>
          </div>
        </div>

        {/* Spots Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {region.spots.length} spot in {region.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {region.spots.map((spot) => {
              const inSeason = spot.species.filter(s => s.months.includes(currentMonth));
              return (
                <Link
                  key={spot.id}
                  href={`/spot-pesca-italia/${region.id}/${spot.id}`}
                  className="group block rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {spot.name}
                      </h3>
                      <DifficultyBadge difficulty={spot.difficulty} />
                    </div>
                    <p className="text-gray-500 text-sm">{spot.locality}, {spot.province}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{spot.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {spot.species.map(s => (
                        <span key={s.name} className={`px-2 py-0.5 rounded-full text-xs ${s.months.includes(currentMonth) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                          {s.name}{s.months.includes(currentMonth) ? ' 🎯' : ''}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {spot.techniques.map(t => (
                        <span key={t.name} className={`px-2 py-0.5 rounded-full text-xs ${t.rating >= 4 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                    {inSeason.length > 0 && (
                      <p className="text-emerald-600 text-xs font-medium">
                        In stagione ora: {inSeason.map(s => s.name).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <StarRating rating={spot.rating} />
                        <span className="text-sm text-gray-500 ml-1">{spot.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">Dettagli →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Specie tipiche */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Specie tipiche in {region.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allSpecies.map(name => {
              const slug = speciesSlug(name);
              const totalRating = region.spots.reduce((acc, s) => {
                const sp = s.species.find(x => x.name === name);
                return acc + (sp ? sp.rating : 0);
              }, 0);
              const count = region.spots.filter(s => s.species.some(x => x.name === name)).length;
              const inner = (
                <div className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-center">
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-xs text-gray-500 mt-1">{count} spot · rating medio {(totalRating / count).toFixed(0)}/5</p>
                </div>
              );
              return slug ? (
                <Link key={name} href={`/pesci-mediterraneo/${slug}`}>{inner}</Link>
              ) : (
                <div key={name}>{inner}</div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Clicca su una specie per aprire la scheda completa con tecniche, esche e periodi migliori.
          </p>
        </section>

        {/* Tecniche consigliate */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tecniche consigliate in {region.name}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allTechniques.map(tech => {
              const spotsWithTech = region.spots.filter(s => s.techniques.some(t => t.name === tech));
              const avgTechRating = +(spotsWithTech.reduce((acc, s) => {
                const t = s.techniques.find(x => x.name === tech);
                return acc + (t ? t.rating : 0);
              }, 0) / spotsWithTech.length).toFixed(1);
              return (
                <div key={tech} className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{tech}</h3>
                    <StarRating rating={avgTechRating} />
                  </div>
                  <p className="text-xs text-gray-500">Disponibile in {spotsWithTech.length} spot su {region.spots.length}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Calendario mensile */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mesi migliori per pescare in {region.name}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {monthActivity.map(({ month, count }) => {
              const pct = maxActivity > 0 ? count / maxActivity : 0;
              const isBest = bestMonths.includes(month);
              const isCurrent = month === currentMonth;
              const bg = isBest ? 'bg-emerald-100 border-emerald-300' : pct > 0.5 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200';
              return (
                <Link
                  key={month}
                  href={`/calendario-pesca/${MONTH_SLUGS[month - 1]}`}
                  className={`p-3 rounded-xl border text-center transition-colors hover:shadow-sm ${bg} ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                >
                  <p className={`text-sm font-semibold ${isBest ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {MONTH_NAMES[month - 1]}
                  </p>
                  <div className="mt-1 mx-auto h-1.5 rounded-full bg-gray-200 overflow-hidden" style={{ width: '80%' }}>
                    <div className={`h-full rounded-full ${isBest ? 'bg-emerald-500' : pct > 0.5 ? 'bg-amber-400' : 'bg-gray-300'}`} style={{ width: `${Math.max(pct * 100, 10)}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{count} specie</p>
                  {isCurrent && <span className="text-xs text-blue-600 font-medium">Ora</span>}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Link interni */}
        <section className="mb-12 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approfondisci</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={`/calendario-pesca/${region.id}`} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors">
              📅 Calendario pesca {region.name}
            </Link>
            <Link href={`/calendario-pesca/${MONTH_SLUGS[bestMonths[0] - 1]}`} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors">
              📅 Calendario nazionale {MONTH_NAMES[bestMonths[0] - 1]}
            </Link>
            <Link href="/pesci-mediterraneo" className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors">
              🐟 Enciclopedia pesci del Mediterraneo
            </Link>
            <Link href="/spot-pesca-italia" className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors">
              📍 Tutti gli spot in Italia
            </Link>
          </div>
        </section>

        {/* Altre regioni */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Esplora altre regioni</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(spotsData.regions as Region[]).filter(r => r.id !== region.id).map(r => (
              <Link
                key={r.id}
                href={`/spot-pesca-italia/${r.id}`}
                className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-center"
              >
                <span className="text-2xl">{r.icon}</span>
                <p className="font-medium text-gray-900 text-sm mt-1">{r.name}</p>
                <p className="text-xs text-gray-500">{r.spots.length} spot</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
