import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import techniquesData from '../../../data/fishing-techniques.json';
import fishData from '../../../data/fish-encyclopedia.json';
import spotsData from '../../../data/fishing-spots.json';

interface TechniqueData {
  slug: string;
  name: string;
  emoji: string;
  shortDescription: string;
  description: string;
  difficulty: string;
  minBudget: number;
  maxBudget: number;
  targetSpecies: string[];
  seasons: Record<string, number>;
  rod: { length: string; action: string; power: string };
  reel: { size: string; type: string };
  line: { type: string; diameter: string };
  rigs: string[];
  baits: string[];
  steps: { title: string; description: string }[];
  tips: string[];
  commonMistakes: string[];
  bestSpotTypes: string[];
  relatedTechniques: string[];
  amazonProducts: { name: string; type: string; query: string }[];
}

const MONTH_SLUGS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const MONTH_NAMES_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
const AFFILIATE_TAG = 'fishandtips-21';

function techniqueSlugMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const t of techniquesData.techniques) {
    map[t.name.toLowerCase()] = t.slug;
    map[t.name] = t.slug;
  }
  map['Spinning'] = 'spinning';
  map['Surfcasting'] = 'surfcasting';
  map['Eging'] = 'eging';
  map['Bolognese'] = 'bolognese';
  map['Light Rock Fishing'] = 'light-rock-fishing';
  map['Feeder'] = 'feeder';
  map['Jigging'] = 'jigging';
  map['Traina'] = 'traina';
  map['Bolentino'] = 'bolentino';
  map['Beach Ledgering'] = 'beach-ledgering';
  map['Rockfishing'] = 'light-rock-fishing';
  return map;
}

function findSpotsForTechnique(techName: string, maxSpots = 4) {
  const results: { spot: any; region: any }[] = [];
  const nameVariants = [techName.toLowerCase()];
  if (techName === 'Light Rock Fishing') nameVariants.push('rockfishing', 'light rock fishing');
  if (techName === 'Beach Ledgering') nameVariants.push('beach ledgering');

  for (const region of (spotsData as any).regions) {
    for (const spot of region.spots) {
      const hasTech = spot.techniques?.some((t: any) =>
        nameVariants.some(v => t.name.toLowerCase() === v)
      );
      if (hasTech) {
        results.push({ spot, region });
        if (results.length >= maxSpots) return results;
      }
    }
  }
  return results;
}

export async function generateStaticParams() {
  return techniquesData.techniques.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tech = techniquesData.techniques.find((t) => t.slug === slug) as TechniqueData | undefined;
  if (!tech) return { title: 'Tecnica non trovata' };

  const topSpecies = tech.targetSpecies.slice(0, 3).map(s => {
    const f = (fishData as any).fish.find((f: any) => f.slug === s);
    return f?.name || s;
  }).join(', ');

  const description = `${tech.name}: guida completa alla tecnica di pesca. Difficoltà ${tech.difficulty}, budget ${tech.minBudget}-${tech.maxBudget}€. Specie target: ${topSpecies}. Attrezzatura, montature e consigli.`;

  return {
    title: `${tech.name} - Guida Completa alla Tecnica di Pesca | FishandTips`,
    description,
    keywords: `${tech.name.toLowerCase()}, pesca ${tech.name.toLowerCase()}, come pescare a ${tech.name.toLowerCase()}, attrezzatura ${tech.name.toLowerCase()}, tecnica ${tech.name.toLowerCase()}, ${topSpecies.toLowerCase()}`,
    openGraph: {
      title: `${tech.name} - Guida Completa alla Tecnica di Pesca | FishandTips`,
      description,
      type: 'article',
      url: `https://fishandtips.it/tecniche/${tech.slug}`,
      siteName: 'FishandTips',
    },
    twitter: {
      card: 'summary',
      title: `${tech.name} | FishandTips`,
      description: tech.shortDescription,
    },
    alternates: {
      canonical: `https://fishandtips.it/tecniche/${tech.slug}`,
    },
  };
}

export default async function TechniqueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tech = techniquesData.techniques.find((t) => t.slug === slug) as TechniqueData | undefined;
  if (!tech) notFound();

  const siteUrl = 'https://fishandtips.it';
  const pageUrl = `${siteUrl}/tecniche/${tech.slug}`;
  const seasonEntries = Object.entries(tech.seasons);
  const bestSeasonIdx = seasonEntries.reduce((best, [, v], i) => v > seasonEntries[best][1] ? i : best, 0);
  const bestSeason = MONTH_NAMES_SHORT[bestSeasonIdx];

  const difficultyConfig: Record<string, { color: string; stars: number }> = {
    'Facile': { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', stars: 2 },
    'Media': { color: 'text-amber-600 bg-amber-50 border-amber-200', stars: 3 },
    'Difficile': { color: 'text-rose-600 bg-rose-50 border-rose-200', stars: 4 },
  };
  const dc = difficultyConfig[tech.difficulty] || difficultyConfig['Media'];

  const speciesDetails = tech.targetSpecies.map(slug => {
    const f = (fishData as any).fish.find((f: any) => f.slug === slug);
    return f ? { name: f.name, slug: f.slug, icon: f.icon } : null;
  }).filter(Boolean) as { name: string; slug: string; icon: string }[];

  const recommendedSpots = findSpotsForTechnique(tech.name);

  const relatedTechs = tech.relatedTechniques.map(slug =>
    techniquesData.techniques.find(t => t.slug === slug)
  ).filter(Boolean) as TechniqueData[];

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Come pescare a ${tech.name.toLowerCase()}`,
    description: tech.shortDescription,
    totalTime: 'PT2H',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: `${tech.minBudget}-${tech.maxBudget}` },
    step: tech.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
    tool: [
      { '@type': 'HowToTool', name: `Canna da ${tech.name.toLowerCase()} ${tech.rod.length}` },
      { '@type': 'HowToTool', name: `Mulinello ${tech.reel.size}` },
    ],
    supply: tech.baits.slice(0, 3).map(b => ({ '@type': 'HowToSupply', name: b })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Tecniche', item: `${siteUrl}/tecniche` },
      { '@type': 'ListItem', position: 3, name: tech.name, item: pageUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/tecniche" className="text-gray-500 hover:text-gray-900 transition-colors">Tecniche</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{tech.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{tech.emoji}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {tech.name}: guida completa per principianti ed esperti
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">{tech.shortDescription}</p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Difficoltà</p>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${dc.color}`}>{tech.difficulty}</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="text-lg font-bold text-gray-900">{tech.minBudget}-{tech.maxBudget}€</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Specie target</p>
              <p className="text-lg font-bold text-gray-900">{speciesDetails.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Miglior mese</p>
              <p className="text-lg font-bold text-gray-900">{bestSeason}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cos&apos;è il {tech.name}?</h2>
          <p className="text-gray-700 leading-relaxed">{tech.description}</p>
        </section>

        {/* Equipment Section */}
        <section id="attrezzatura" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Attrezzatura necessaria</h2>
          <div className="space-y-4">
            {[
              { label: 'Canna', specs: `${tech.rod.length} | Azione: ${tech.rod.action} | Potenza: ${tech.rod.power}`, product: tech.amazonProducts.find(p => p.type === 'Canna') },
              { label: 'Mulinello', specs: `Taglia ${tech.reel.size} | ${tech.reel.type}`, product: tech.amazonProducts.find(p => p.type === 'Mulinello') },
              { label: 'Filo', specs: `${tech.line.type} | ${tech.line.diameter}`, product: tech.amazonProducts.find(p => p.type === 'Filo') || tech.amazonProducts.find(p => !['Canna','Mulinello'].includes(p.type)) },
            ].map((item) => (
              <div key={item.label} className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">{item.label}</span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">{item.product?.name || item.label}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.specs}</p>
                  </div>
                  {item.product && (
                    <a
                      href={`https://www.amazon.it/s?k=${item.product.query}&tag=${AFFILIATE_TAG}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors whitespace-nowrap text-center"
                    >
                      Vedi su Amazon
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Rigs */}
          <div className="mt-6 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Montature consigliate</h3>
            <div className="flex flex-wrap gap-2">
              {tech.rigs.map((rig) => (
                <span key={rig} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-full border border-gray-200">{rig}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonality */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Stagionalità</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {seasonEntries.map(([month, rating], i) => {
              const colors = ['bg-gray-100 text-gray-400', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700', 'bg-emerald-500 text-white'];
              return (
                <Link
                  key={month}
                  href={`/calendario-pesca/${MONTH_SLUGS[i]}`}
                  className={`p-2 rounded-lg text-center hover:ring-2 hover:ring-blue-300 transition-all ${colors[rating]}`}
                >
                  <p className="text-xs font-medium">{MONTH_NAMES_SHORT[i]}</p>
                  <p className="text-sm font-bold">{'★'.repeat(rating)}</p>
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">★ = basso | ★★ = medio | ★★★ = alto — clicca sul mese per la guida completa</p>
        </section>

        {/* Target Species */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specie target</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {speciesDetails.map((species) => (
              <Link
                key={species.slug}
                href={`/pesci-mediterraneo/${species.slug}`}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-center"
              >
                <span className="text-3xl block mb-2">{species.icon}</span>
                <p className="font-semibold text-gray-900">{species.name}</p>
                <p className="text-xs text-blue-600 mt-1">Vai alla scheda →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* How To - Steps */}
        <section id="come-si-fa" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Come si fa: step by step</h2>
          <div className="space-y-6">
            {tech.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Errori comuni da evitare</h2>
          <div className="space-y-3">
            {tech.commonMistakes.map((mistake, i) => (
              <div key={i} className="flex gap-3 p-4 bg-rose-50 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-gray-700">{mistake}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expert Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Consigli degli esperti</h2>
          <div className="space-y-3">
            {tech.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-4 bg-emerald-50 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Spots */}
        {recommendedSpots.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Spot consigliati per il {tech.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedSpots.map(({ spot, region }) => (
                <Link
                  key={spot.id}
                  href={`/spot-pesca-italia/${region.id}/${spot.id}`}
                  className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{region.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{spot.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{spot.environment}</span>
                    <span>•</span>
                    <span>⭐ {spot.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Techniques */}
        {relatedTechs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tecniche correlate</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedTechs.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tecniche/${t.slug}`}
                  className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.name}</h3>
                      <span className="text-xs text-gray-500">Difficoltà: {t.difficulty}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <section className="mb-12 p-8 bg-gray-50 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Approfondisci</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/pesci-mediterraneo" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🐟</div>
              <div>
                <p className="font-semibold text-gray-900">Enciclopedia Pesci</p>
                <p className="text-sm text-gray-500">Scopri tutte le specie del Mediterraneo</p>
              </div>
            </Link>
            <Link href="/spot-pesca-italia" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">📍</div>
              <div>
                <p className="font-semibold text-gray-900">Spot di Pesca</p>
                <p className="text-sm text-gray-500">249 spot in tutta Italia</p>
              </div>
            </Link>
            <Link href="/calendario-pesca" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="font-semibold text-gray-900">Calendario Pesca</p>
                <p className="text-sm text-gray-500">Cosa pescare mese per mese</p>
              </div>
            </Link>
            <Link href="/trova-attrezzatura" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-2xl">🧰</div>
              <div>
                <p className="font-semibold text-gray-900">Quiz Attrezzatura</p>
                <p className="text-sm text-gray-500">Trova il kit perfetto per te</p>
              </div>
            </Link>
          </div>
        </section>

        {/* All Techniques Navigation */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Altre tecniche da esplorare</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {techniquesData.techniques
              .filter((t) => t.slug !== tech.slug)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/tecniche/${t.slug}`}
                  className="p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-center"
                >
                  <span className="text-xl">{t.emoji}</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{t.name}</p>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Vuoi migliorare con il {tech.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Iscriviti alla newsletter e riceverai guide, trucchi e aggiornamenti su questa e altre tecniche di pesca.
          </p>
          <Link href="/registrazione" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors">
            Iscriviti gratis
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
