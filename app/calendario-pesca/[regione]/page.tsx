import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import regionalData from '../../../data/fishing-calendar-regional.json';
import spotsData from '../../../data/fishing-spots.json';

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

const MONTH_SLUGS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const MONTH_NAMES_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
const REGION_IDS = ['sardegna','sicilia','liguria','puglia','toscana','campania','lazio','calabria','veneto','emilia-romagna'];

export async function generateStaticParams() {
  return REGION_IDS.map(regione => ({ regione }));
}

export async function generateMetadata({ params }: { params: Promise<{ regione: string }> }): Promise<Metadata> {
  const { regione } = await params;
  const entries = (regionalData as any).entries.filter((e: RegionalEntry) => e.regione === regione);
  if (entries.length === 0) return { title: 'Regione non trovata' };

  const regionName = entries[0].regionName;
  const allSpecies = [...new Set(entries.flatMap((e: RegionalEntry) => e.species.map(s => s.name)))];
  const topSpecies = allSpecies.slice(0, 5).join(', ');

  return {
    title: `Calendario Pesca ${regionName} - Cosa Pescare Mese per Mese | FishandTips`,
    description: `Calendario completo della pesca in ${regionName}: scopri cosa pescare ogni mese, le specie attive (${topSpecies}), gli spot migliori e le tecniche consigliate.`,
    openGraph: {
      title: `Calendario Pesca ${regionName} | FishandTips`,
      description: `Cosa pescare in ${regionName} mese per mese: specie, spot e tecniche per ogni stagione.`,
      type: 'website',
      url: `https://fishandtips.it/calendario-pesca/${regione}`,
    },
    alternates: {
      canonical: `https://fishandtips.it/calendario-pesca/${regione}`,
    },
  };
}

export default async function RegionalCalendarPage({ params }: { params: Promise<{ regione: string }> }) {
  const { regione } = await params;
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

      {/* Hero */}
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
            <Link href={`/spot-pesca-italia/${regione}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Spot in {regionName} →
            </Link>
            <Link href={`/calendario-pesca/${bestMonth.mese}`} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
              Calendario nazionale {bestMonth.meseName} →
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Monthly Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">I 12 mesi in {regionName}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry, i) => {
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
                    {entry.species.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-400 text-xs">+{entry.species.length - 3}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Other Regions */}
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

        {/* Internal Links */}
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
