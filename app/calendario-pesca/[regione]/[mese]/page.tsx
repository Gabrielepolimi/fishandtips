import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import regionalData from '../../../../data/fishing-calendar-regional.json';
import spotsData from '../../../../data/fishing-spots.json';
import techniquesData from '../../../../data/fishing-techniques.json';

interface SpeciesEntry {
  slug: string;
  name: string;
  activity: number;
  techniques: string[];
  localTip: string;
}

interface RegionalEntry {
  regione: string;
  mese: string;
  regionName: string;
  meseName: string;
  rating: number;
  waterTemp: string;
  species: SpeciesEntry[];
  topSpots: string[];
  techniques: string[];
  conditions: string;
  regionalNote: string;
}

const MONTH_SLUGS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const REGION_IDS = ['sardegna','sicilia','liguria','puglia','toscana','campania','lazio','calabria','veneto','emilia-romagna'];

export async function generateStaticParams() {
  const params: { regione: string; mese: string }[] = [];
  for (const regione of REGION_IDS) {
    for (const mese of MONTH_SLUGS) {
      params.push({ regione, mese });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ regione: string; mese: string }> }): Promise<Metadata> {
  const { regione, mese } = await params;
  const entry = (regionalData as any).entries.find((e: RegionalEntry) => e.regione === regione && e.mese === mese) as RegionalEntry | undefined;
  if (!entry) return { title: 'Pagina non trovata' };

  const topSpecies = entry.species.slice(0, 3).map(s => s.name).join(', ');
  const description = `Guida completa alla pesca in ${entry.regionName} a ${entry.meseName}: ${topSpecies}. Spot migliori, tecniche consigliate e condizioni meteo.`;

  return {
    title: `Pesca in ${entry.regionName} a ${entry.meseName} - Cosa Pescare e Dove | FishandTips`,
    description,
    openGraph: {
      title: `Pesca in ${entry.regionName} a ${entry.meseName} | FishandTips`,
      description,
      type: 'article',
      url: `https://fishandtips.it/calendario-pesca/${regione}/${mese}`,
      siteName: 'FishandTips',
    },
    alternates: {
      canonical: `https://fishandtips.it/calendario-pesca/${regione}/${mese}`,
    },
  };
}

function ActivityIndicator({ level }: { level: number }) {
  const colors = ['bg-gray-200', 'bg-amber-300', 'bg-emerald-400', 'bg-emerald-600'];
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= level ? colors[level] : 'bg-gray-200'}`} />
      ))}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <svg key={i} className={`w-5 h-5 ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function RegionalMonthPage({ params }: { params: Promise<{ regione: string; mese: string }> }) {
  const { regione, mese } = await params;
  const entry = (regionalData as any).entries.find((e: RegionalEntry) => e.regione === regione && e.mese === mese) as RegionalEntry | undefined;
  if (!entry) notFound();

  const siteUrl = 'https://fishandtips.it';
  const currentMonthIdx = MONTH_SLUGS.indexOf(mese);

  const region = (spotsData as any).regions.find((r: any) => r.id === regione);
  const monthNum = currentMonthIdx + 1;
  const activeSpots = region?.spots
    ?.filter((s: any) => s.species.some((sp: any) => sp.months.includes(monthNum)))
    ?.sort((a: any, b: any) => b.rating - a.rating)
    ?.slice(0, 4) || [];

  const techDetails = entry.techniques.map(slug =>
    techniquesData.techniques.find(t => t.slug === slug)
  ).filter(Boolean);

  const dominantTech = techDetails[0];

  const faqQuestions = [
    {
      q: `Cosa si pesca in ${entry.regionName} a ${entry.meseName}?`,
      a: `A ${entry.meseName.toLowerCase()} in ${entry.regionName} si pescano principalmente: ${entry.species.slice(0, 5).map(s => s.name).join(', ')}. ${entry.species.length > 0 ? entry.species[0].localTip + '.' : ''}`,
    },
    {
      q: `Quali sono i migliori spot per pescare in ${entry.regionName} a ${entry.meseName}?`,
      a: `I migliori spot per pescare in ${entry.regionName} a ${entry.meseName.toLowerCase()} sono: ${activeSpots.slice(0, 3).map((s: any) => s.name).join(', ')}. ${entry.conditions}`,
    },
    {
      q: `Quali tecniche usare in ${entry.regionName} a ${entry.meseName}?`,
      a: `Le tecniche più efficaci in ${entry.regionName} a ${entry.meseName.toLowerCase()} sono: ${entry.techniques.map(t => { const td = techniquesData.techniques.find(x => x.slug === t); return td?.name || t; }).join(', ')}. ${dominantTech ? `Il ${dominantTech.name.toLowerCase()} è particolarmente indicato in questo periodo.` : ''}`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.map(fq => ({
      '@type': 'Question',
      name: fq.q,
      acceptedAnswer: { '@type': 'Answer', text: fq.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Calendario Pesca', item: `${siteUrl}/calendario-pesca` },
      { '@type': 'ListItem', position: 3, name: entry.regionName, item: `${siteUrl}/calendario-pesca/${regione}` },
      { '@type': 'ListItem', position: 4, name: entry.meseName, item: `${siteUrl}/calendario-pesca/${regione}/${mese}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/calendario-pesca" className="text-gray-500 hover:text-gray-900">Calendario Pesca</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/calendario-pesca/${regione}`} className="text-gray-500 hover:text-gray-900">{entry.regionName}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{entry.meseName}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pesca in {entry.regionName} a {entry.meseName}: cosa pescare e dove
          </h1>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Valutazione mese</p>
              <StarRating rating={entry.rating} />
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Temperatura acqua</p>
              <p className="text-lg font-bold text-blue-600">{entry.waterTemp}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Specie attive</p>
              <p className="text-lg font-bold text-gray-900">{entry.species.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Tecnica top</p>
              <p className="text-lg font-bold text-gray-900">{dominantTech?.name || '-'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Regional Note */}
        {entry.regionalNote && (
          <section className="mb-10 p-6 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-gray-800 leading-relaxed">{entry.regionalNote}</p>
          </section>
        )}

        {/* Conditions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Condizioni a {entry.meseName} in {entry.regionName}</h2>
          <p className="text-gray-700">{entry.conditions}</p>
        </section>

        {/* Species */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Specie attive in {entry.regionName} a {entry.meseName}
          </h2>
          <div className="space-y-4">
            {entry.species.map((species) => (
              <div key={species.slug} className="p-5 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/pesci-mediterraneo/${species.slug}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {species.name}
                    </Link>
                    <ActivityIndicator level={species.activity} />
                  </div>
                  <Link href={`/pesci-mediterraneo/${species.slug}`} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
                    Scheda specie →
                  </Link>
                </div>
                <p className="text-gray-600 text-sm mb-3">{species.localTip}</p>
                {species.techniques.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {species.techniques.map(techSlug => {
                      const td = techniquesData.techniques.find(t => t.slug === techSlug);
                      return td ? (
                        <Link key={techSlug} href={`/tecniche/${techSlug}`} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors">
                          {td.name}
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Spots */}
        {activeSpots.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Spot consigliati a {entry.meseName} in {entry.regionName}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activeSpots.map((spot: any) => (
                <Link key={spot.id} href={`/spot-pesca-italia/${regione}/${spot.id}`} className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-1">{spot.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{spot.description}</p>
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

        {/* Techniques */}
        {techDetails.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Tecniche del mese in {entry.regionName}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {techDetails.map((tech: any) => (
                <Link key={tech.slug} href={`/tecniche/${tech.slug}`} className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tech.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                      <span className="text-xs text-gray-500">Difficoltà: {tech.difficulty}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{tech.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Domande frequenti</h2>
          <div className="space-y-4">
            {faqQuestions.map((fq, i) => (
              <details key={i} className="group p-5 border border-gray-200 rounded-xl">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {fq.q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 mt-3">{fq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* National Calendar Link */}
        <div className="mb-10 p-5 bg-gray-50 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Calendario nazionale di {entry.meseName}</p>
            <p className="text-sm text-gray-500">Vedi cosa si pesca in tutta Italia a {entry.meseName.toLowerCase()}</p>
          </div>
          <Link href={`/calendario-pesca/${mese}`} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            Vedi →
          </Link>
        </div>

        {/* Month Navigation */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tutti i mesi in {entry.regionName}</h2>
          <div className="flex flex-wrap gap-2">
            {MONTH_SLUGS.map((m, i) => {
              const monthEntry = (regionalData as any).entries.find((e: RegionalEntry) => e.regione === regione && e.mese === m);
              const isActive = m === mese;
              return (
                <Link
                  key={m}
                  href={`/calendario-pesca/${regione}/${m}`}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'][i]}
                  {monthEntry && <span className="ml-1 opacity-60">{'★'.repeat(monthEntry.rating)}</span>}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Region Navigation */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{entry.meseName} nelle altre regioni</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {REGION_IDS.filter(r => r !== regione).map(r => {
              const regionEntry = (regionalData as any).entries.find((e: RegionalEntry) => e.regione === r && e.mese === mese);
              const regionObj = (spotsData as any).regions.find((reg: any) => reg.id === r);
              return (
                <Link key={r} href={`/calendario-pesca/${r}/${mese}`} className="p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-center">
                  <p className="text-sm font-medium text-gray-900">{regionObj?.name || r}</p>
                  {regionEntry && <p className="text-xs text-gray-500 mt-1">{regionEntry.species.length} specie</p>}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
