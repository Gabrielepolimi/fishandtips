import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import spotsData from '../../../../data/fishing-spots.json';

interface SpotData {
  id: string;
  name: string;
  region: string;
  province: string;
  locality: string;
  coordinates: { lat: number; lng: number };
  description: string;
  environment: string;
  seabed: string;
  depth: string;
  access: {
    difficulty: string;
    parking: string;
    walking: string;
    notes: string;
  };
  species: { name: string; rating: number; months: number[] }[];
  techniques: { name: string; rating: number; notes: string }[];
  bestBaits: string[];
  bestArtificials: string[];
  bestTime: {
    hours: string;
    tide: string;
    weather: string;
    moon: string;
  };
  regulations: {
    license: string;
    restrictions: string;
    minSizes: string;
  };
  tips: string[];
  facilities: {
    wc: boolean;
    bar: string;
    shop: string;
  };
  rating: number;
  difficulty: number;
  crowded: string;
}

interface Region {
  id: string;
  name: string;
  icon: string;
  description: string;
  spots: SpotData[];
}

const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const monthNamesFull = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

export async function generateStaticParams() {
  const params: { region: string; spot: string }[] = [];
  spotsData.regions.forEach((region) => {
    region.spots.forEach((spot) => {
      params.push({ region: region.id, spot: spot.id });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; spot: string }>;
}): Promise<Metadata> {
  const { region: regionSlug, spot: spotSlug } = await params;
  const region = spotsData.regions.find((r) => r.id === regionSlug) as Region | undefined;
  const spot = region?.spots.find((s) => s.id === spotSlug) as SpotData | undefined;

  if (!spot || !region) {
    return { title: 'Spot non trovato' };
  }

  const speciesList = spot.species.map((s) => s.name).join(', ');
  const techniquesList = spot.techniques.map((t) => t.name).join(', ');

  return {
    title: `Pesca a ${spot.name} (${region.name}) - Guida Completa | FishandTips`,
    description: `Dove pescare a ${spot.name}, ${spot.locality} (${region.name}). Specie: ${speciesList}. Tecniche: ${techniquesList}. Coordinate GPS, stagionalità e consigli.`,
    keywords: `pesca ${spot.name.toLowerCase()}, dove pescare ${spot.locality.toLowerCase()}, spot pesca ${region.name.toLowerCase()}, ${spot.species.map((s) => `pesca ${s.name.toLowerCase()}`).join(', ')}`,
    openGraph: {
      title: `Pesca a ${spot.name} - Guida Completa | FishandTips`,
      description: `Tutto quello che devi sapere per pescare a ${spot.name}: ${speciesList}. Coordinate GPS, tecniche e consigli.`,
      type: 'article',
    },
    alternates: {
      canonical: `https://fishandtips.it/spot-pesca-italia/${regionSlug}/${spotSlug}`,
    },
  };
}

function SeasonalityBar({ months }: { months: number[] }) {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 12 }).map((_, i) => {
        const month = i + 1;
        const isActive = months.includes(month);
        const isCurrent = month === currentMonth;

        return (
          <div key={month} className="flex-1 text-center">
            <div
              className={`h-8 rounded-sm ${
                isActive ? 'bg-emerald-500' : 'bg-gray-100'
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

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const styles: Record<number, string> = {
    1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    2: 'bg-teal-50 text-teal-700 border-teal-200',
    3: 'bg-amber-50 text-amber-700 border-amber-200',
    4: 'bg-orange-50 text-orange-700 border-orange-200',
    5: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const labels: Record<number, string> = {
    1: 'Facile',
    2: 'Accessibile',
    3: 'Media',
    4: 'Difficile',
    5: 'Solo Esperti',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ region: string; spot: string }>;
}) {
  const { region: regionSlug, spot: spotSlug } = await params;
  const region = spotsData.regions.find((r) => r.id === regionSlug) as Region | undefined;
  const spot = region?.spots.find((s) => s.id === spotSlug) as SpotData | undefined;

  if (!spot || !region) {
    notFound();
  }

  const currentMonth = new Date().getMonth() + 1;
  const speciesInSeason = spot.species.filter((s) => s.months.includes(currentMonth));
  const topTechnique = spot.techniques.reduce((a, b) => (a.rating > b.rating ? a : b));
  const bestMonthsForTopSpecies = spot.species[0]?.months.map((m) => monthNamesFull[m - 1]).join(', ') || '';

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/spot-pesca-italia" className="text-gray-500 hover:text-gray-900">
              Spot Pesca
            </Link>
            <span className="text-gray-300">/</span>
            <Link href={`/spot-pesca-italia/${region.id}`} className="text-gray-500 hover:text-gray-900">
              {region.name}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{spot.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                {spot.name}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {spot.locality}, {spot.province} · {region.name}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-rose-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-gray-900">{spot.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">·</span>
                <DifficultyBadge difficulty={spot.difficulty} />
                <span className="text-gray-300">·</span>
                <span className="text-gray-600">{spot.environment}</span>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${spot.coordinates.lat},${spot.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Apri in Maps
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informazioni sullo spot</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{spot.description}</p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  <strong>{spot.name}</strong> si trova a {spot.locality}, in provincia di {spot.province}, 
                  ed è uno degli spot di pesca più apprezzati della {region.name}. 
                  Il fondale è caratterizzato da {spot.seabed.toLowerCase()} con profondità che variano da {spot.depth}.
                </p>
                {spot.species[0] && (
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Per la pesca {spot.species[0].name === 'Spigola' || spot.species[0].name === 'Orata' || spot.species[0].name === 'Mormora' ? 'della' : 'del'} <strong>{spot.species[0].name}</strong>, 
                    i mesi migliori sono {bestMonthsForTopSpecies}. 
                    La tecnica più efficace è il <strong>{topTechnique.name}</strong>.
                  </p>
                )}
              </div>
            </section>

            {/* In Season */}
            {speciesInSeason.length > 0 && (
              <section className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">In stagione a {monthNamesFull[currentMonth - 1]}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {speciesInSeason.map((s) => (
                    <span
                      key={s.name}
                      className="px-3 py-1.5 bg-white text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Species */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specie presenti</h2>
              <div className="space-y-4">
                {spot.species.map((s) => {
                  const isInSeason = s.months.includes(currentMonth);
                  const bestMonths = s.months.map((m) => monthNamesFull[m - 1]).join(', ');
                  return (
                    <div key={s.name} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{s.name}</h3>
                          {isInSeason && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                              In stagione
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < s.rating ? 'text-amber-400' : 'text-gray-200'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Mesi migliori: {bestMonths}</p>
                      <SeasonalityBar months={s.months} />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Techniques */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tecniche consigliate</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {spot.techniques.map((t) => (
                  <div
                    key={t.name}
                    className={`p-5 rounded-xl border ${
                      t.rating >= 4 
                        ? 'bg-blue-50 border-blue-100' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${t.rating >= 4 ? 'text-blue-900' : 'text-gray-900'}`}>
                        {t.rating >= 4 && '⭐ '}{t.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{t.notes}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Baits */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Esche consigliate</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Esche naturali</h3>
                  <ul className="space-y-2">
                    {spot.bestBaits.map((bait) => (
                      <li key={bait} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {bait}
                      </li>
                    ))}
                  </ul>
                </div>
                {spot.bestArtificials.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Artificiali</h3>
                    <ul className="space-y-2">
                      {spot.bestArtificials.map((art) => (
                        <li key={art} className="flex items-center gap-2 text-gray-600">
                          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          {art}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Tips */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Consigli dei pescatori</h2>
              <div className="space-y-3">
                {spot.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Informazioni rapide</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Coordinate GPS</dt>
                    <dd className="text-gray-900 font-mono text-sm mt-1">
                      {spot.coordinates.lat.toFixed(4)}°N, {spot.coordinates.lng.toFixed(4)}°E
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Ambiente</dt>
                    <dd className="text-gray-900 mt-1">{spot.environment}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Fondale</dt>
                    <dd className="text-gray-900 mt-1">{spot.seabed}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Profondità</dt>
                    <dd className="text-gray-900 mt-1">{spot.depth}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Affollamento</dt>
                    <dd className="text-gray-900 mt-1">{spot.crowded}</dd>
                  </div>
                </dl>
              </div>

              {/* Best Time Card */}
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-4">Momento migliore</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Orario</dt>
                    <dd className="text-gray-900 font-medium mt-1">{spot.bestTime.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Marea</dt>
                    <dd className="text-gray-900 mt-1">{spot.bestTime.tide}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Meteo ideale</dt>
                    <dd className="text-gray-900 mt-1">{spot.bestTime.weather}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Fase lunare</dt>
                    <dd className="text-gray-900 mt-1">{spot.bestTime.moon}</dd>
                  </div>
                </dl>
              </div>

              {/* Access Card */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Come arrivare</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Difficoltà accesso</dt>
                    <dd className="text-gray-900 mt-1">{spot.access.difficulty}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Parcheggio</dt>
                    <dd className="text-gray-900 mt-1">{spot.access.parking}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Camminata</dt>
                    <dd className="text-gray-900 mt-1">{spot.access.walking}</dd>
                  </div>
                  {spot.access.notes && (
                    <div>
                      <dt className="text-sm text-gray-500">Note</dt>
                      <dd className="text-gray-900 mt-1">{spot.access.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Regulations Card */}
              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <h3 className="font-semibold text-gray-900 mb-4">Regolamenti</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Licenza</dt>
                    <dd className="text-gray-900 mt-1">{spot.regulations.license}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Restrizioni</dt>
                    <dd className="text-gray-900 mt-1">{spot.regulations.restrictions}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Taglie minime</dt>
                    <dd className="text-gray-900 mt-1">{spot.regulations.minSizes}</dd>
                  </div>
                </dl>
              </div>

              {/* Services Card */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Servizi nella zona</h3>
                <dl className="space-y-4">
                  <div className="flex items-center gap-2">
                    {spot.facilities.wc ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="text-gray-900">WC / Bagni pubblici</span>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Bar / Ristoranti</dt>
                    <dd className="text-gray-900 mt-1">{spot.facilities.bar}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Negozio pesca</dt>
                    <dd className="text-gray-900 mt-1">{spot.facilities.shop}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Spots */}
        {region.spots.length > 1 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Altri spot in {region.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {region.spots
                .filter((s) => s.id !== spot.id)
                .slice(0, 4)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/spot-pesca-italia/${region.id}/${s.id}`}
                    className="group"
                  >
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 mb-3 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl opacity-50">{region.icon}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:underline">{s.name}</h3>
                    <p className="text-sm text-gray-500">{s.locality}</p>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
