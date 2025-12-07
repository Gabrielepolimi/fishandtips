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
    title: `Pesca a ${spot.name} (${region.name}) - Guida Completa Spot | FishandTips`,
    description: `Dove pescare a ${spot.name}, ${spot.locality} (${region.name}). Specie: ${speciesList}. Tecniche: ${techniquesList}. Coordinate GPS, stagionalità, esche migliori e consigli dei pescatori locali.`,
    keywords: `pesca ${spot.name.toLowerCase()}, dove pescare ${spot.locality.toLowerCase()}, spot pesca ${region.name.toLowerCase()}, ${spot.species.map((s) => `pesca ${s.name.toLowerCase()}`).join(', ')}, ${spot.techniques.map((t) => `${t.name.toLowerCase()} ${region.name.toLowerCase()}`).join(', ')}`,
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
    <div className="flex gap-1">
      {Array.from({ length: 12 }).map((_, i) => {
        const month = i + 1;
        const isActive = months.includes(month);
        const isCurrent = month === currentMonth;

        return (
          <div key={month} className="flex-1 text-center">
            <div
              className={`h-6 rounded ${
                isActive ? 'bg-green-500' : 'bg-slate-700'
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
    5: 'Solo Esperti',
  };

  return (
    <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${colors[difficulty]}`}>
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
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/spot-pesca-italia/${region.id}`}
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4"
          >
            ← {region.icon} Spot Pesca {region.name}
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Pesca a {spot.name}
              </h1>
              <p className="text-blue-100 text-lg">
                {spot.locality}, {spot.province} ({region.name})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DifficultyBadge difficulty={spot.difficulty} />
              <div className="px-3 py-1 bg-white/10 rounded-full text-white">
                ⭐ {spot.rating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* SEO Intro */}
        <article className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Guida alla Pesca a {spot.name}
          </h2>
          <div className="text-slate-300 text-lg leading-relaxed space-y-4">
            <p>{spot.description}</p>
            <p>
              <strong className="text-white">{spot.name}</strong> si trova a {spot.locality}, in provincia di {spot.province}, 
              ed è uno degli spot di pesca più apprezzati della {region.name}. 
              Il fondale è caratterizzato da {spot.seabed.toLowerCase()} con profondità che variano da {spot.depth}.
              L&apos;ambiente è tipicamente {spot.environment.toLowerCase()}, ideale per diverse tecniche di pesca.
            </p>
            <p>
              Le specie principali che si possono catturare in questo spot sono: {spot.species.map((s) => s.name).join(', ')}. 
              La tecnica più efficace è il <strong className="text-cyan-400">{topTechnique.name}</strong> ({topTechnique.notes.toLowerCase()}), 
              ma si ottengono buoni risultati anche con {spot.techniques.filter((t) => t.name !== topTechnique.name).map((t) => t.name.toLowerCase()).join(', ')}.
            </p>
            {spot.species[0] && (
              <p>
                Per la pesca {spot.species[0].name === 'Spigola' || spot.species[0].name === 'Orata' || spot.species[0].name === 'Mormora' ? 'della' : 'del'} <strong className="text-white">{spot.species[0].name}</strong>, 
                i mesi migliori sono {bestMonthsForTopSpecies}. 
                Durante questo periodo, le condizioni ideali prevedono {spot.bestTime.weather.toLowerCase()} con {spot.bestTime.tide.toLowerCase()}.
              </p>
            )}
          </div>
        </article>

        {/* In Season Alert */}
        {speciesInSeason.length > 0 && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
            <h3 className="font-bold text-green-400 mb-2">🎯 Specie in stagione a {monthNamesFull[currentMonth - 1]}:</h3>
            <div className="flex flex-wrap gap-2">
              {speciesInSeason.map((s) => (
                <span
                  key={s.name}
                  className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                >
                  {'★'.repeat(s.rating)} {s.name}
                </span>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-3">
              Questo è un buon periodo per pescare a {spot.name}! Le specie sopra elencate sono particolarmente attive.
            </p>
          </div>
        )}

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-500 text-sm">Ambiente</p>
            <p className="text-white font-bold">{spot.environment}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-500 text-sm">Fondale</p>
            <p className="text-white font-bold">{spot.seabed}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-500 text-sm">Profondità</p>
            <p className="text-white font-bold">{spot.depth}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-500 text-sm">Affollamento</p>
            <p className="text-white font-bold">{spot.crowded}</p>
          </div>
        </div>

        {/* GPS Coordinates */}
        <section className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-cyan-500/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📍 Coordinate GPS per {spot.name}</h2>
          <p className="text-slate-400 mb-4">
            Usa queste coordinate per raggiungere lo spot con il tuo navigatore GPS o smartphone.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400">Latitudine:</span>{' '}
              <span className="text-cyan-400 font-mono">{spot.coordinates.lat.toFixed(4)}°N</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400">Longitudine:</span>{' '}
              <span className="text-cyan-400 font-mono">{spot.coordinates.lng.toFixed(4)}°E</span>
            </div>
            <a
              href={`https://www.google.com/maps?q=${spot.coordinates.lat},${spot.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-lg"
            >
              🗺️ Apri in Google Maps
            </a>
          </div>
        </section>

        {/* Access Info */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🚗 Come Arrivare a {spot.name}</h2>
          <p className="text-slate-400 mb-4">
            L&apos;accesso a questo spot è di difficoltà <strong className="text-white">{spot.access.difficulty.toLowerCase()}</strong>. 
            {spot.access.notes && ` ${spot.access.notes}.`}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-sm">Parcheggio</p>
              <p className="text-white">{spot.access.parking}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Camminata</p>
              <p className="text-white">{spot.access.walking}</p>
            </div>
          </div>
        </section>

        {/* Species */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">🐟 Pesci che si Possono Catturare a {spot.name}</h2>
          <p className="text-slate-400 mb-4">
            Ecco le specie ittiche presenti in questo spot con la loro stagionalità. Il periodo verde indica i mesi migliori per la cattura.
          </p>
          <div className="space-y-4">
            {spot.species.map((s) => {
              const isInSeason = s.months.includes(currentMonth);
              const bestMonths = s.months.map((m) => monthNamesFull[m - 1]).join(', ');
              return (
                <div key={s.name} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {s.name}
                      {isInSeason && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                          IN STAGIONE
                        </span>
                      )}
                    </h3>
                    <span className="text-yellow-400">{'★'.repeat(s.rating)}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">
                    Mesi migliori: {bestMonths}
                  </p>
                  <SeasonalityBar months={s.months} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Techniques */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">🎣 Tecniche di Pesca Consigliate</h2>
          <p className="text-slate-400 mb-4">
            Le tecniche più efficaci per pescare a {spot.name}, ordinate per efficacia. 
            La tecnica principale è il <strong className="text-cyan-400">{topTechnique.name}</strong>.
          </p>
          <div className="space-y-3">
            {spot.techniques.map((t) => (
              <div
                key={t.name}
                className={`p-4 rounded-lg ${
                  t.rating >= 4 ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold ${t.rating >= 4 ? 'text-cyan-400' : 'text-white'}`}>
                    {t.rating >= 4 && '⭐ '}
                    {t.name}
                  </h3>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(t.rating)}</span>
                </div>
                <p className="text-slate-400 text-sm">{t.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Baits & Artificials */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-2">🪱 Esche Naturali Migliori</h2>
            <p className="text-slate-400 text-sm mb-4">
              Le esche più efficaci per questo spot:
            </p>
            <ul className="space-y-2">
              {spot.bestBaits.map((bait) => (
                <li key={bait} className="flex items-center gap-2 text-slate-300">
                  <span className="text-green-400">✓</span> {bait}
                </li>
              ))}
            </ul>
          </section>

          {spot.bestArtificials.length > 0 && (
            <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-2">🎯 Artificiali Consigliati</h2>
              <p className="text-slate-400 text-sm mb-4">
                I migliori artificiali per pescare qui:
              </p>
              <ul className="space-y-2">
                {spot.bestArtificials.map((art) => (
                  <li key={art} className="flex items-center gap-2 text-slate-300">
                    <span className="text-amber-400">★</span> {art}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Best Time */}
        <section className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/30 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">⏰ Quando Pescare a {spot.name}</h2>
          <p className="text-slate-400 mb-4">
            Le condizioni ideali per massimizzare le tue catture in questo spot:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-sm">Orario migliore</p>
              <p className="text-white font-bold">{spot.bestTime.hours}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Marea ideale</p>
              <p className="text-white font-bold">{spot.bestTime.tide}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Condizioni meteo</p>
              <p className="text-white font-bold">{spot.bestTime.weather}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Fase lunare</p>
              <p className="text-white font-bold">{spot.bestTime.moon}</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">💡 Consigli per Pescare a {spot.name}</h2>
          <p className="text-slate-400 mb-4">
            Dritte e suggerimenti dai pescatori che frequentano questo spot:
          </p>
          <ul className="space-y-3">
            {spot.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <span className="text-yellow-400 mt-1">💡</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* Regulations */}
        <section className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">⚠️ Regolamentazioni e Normative</h2>
          <p className="text-slate-400 mb-4">
            Prima di pescare a {spot.name}, assicurati di rispettare le seguenti normative:
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-sm">Licenza</p>
              <p className="text-white">{spot.regulations.license}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Restrizioni</p>
              <p className="text-white">{spot.regulations.restrictions}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Taglie minime</p>
              <p className="text-white">{spot.regulations.minSizes}</p>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🏪 Servizi nella Zona di {spot.name}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className={spot.facilities.wc ? 'text-green-400' : 'text-red-400'}>
                {spot.facilities.wc ? '✓' : '✗'}
              </span>
              <span className="text-slate-300">WC / Bagni pubblici</span>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Bar e Ristoranti</p>
              <p className="text-white">{spot.facilities.bar}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Negozio Pesca</p>
              <p className="text-white">{spot.facilities.shop}</p>
            </div>
          </div>
        </section>

        {/* SEO Summary */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Riepilogo: Perché Pescare a {spot.name}
          </h2>
          <div className="text-slate-300 space-y-3">
            <p>
              <strong className="text-white">{spot.name}</strong> è uno spot {spot.difficulty <= 2 ? 'accessibile a tutti' : spot.difficulty <= 3 ? 'di media difficoltà' : 'per pescatori esperti'} 
              situato a {spot.locality} ({region.name}). Con un rating di {spot.rating}/5, è considerato uno dei migliori luoghi 
              per la pesca {spot.techniques[0]?.name === 'Spinning' ? 'a spinning' : spot.techniques[0]?.name === 'Surfcasting' ? 'a surfcasting' : `con la tecnica ${spot.techniques[0]?.name.toLowerCase()}`} della zona.
            </p>
            <p>
              Le specie principali sono {spot.species.slice(0, 3).map((s) => s.name).join(', ')}, 
              catturabili principalmente con {spot.bestBaits.slice(0, 2).join(' e ')}{spot.bestArtificials.length > 0 ? ` o artificiali come ${spot.bestArtificials[0]}` : ''}.
            </p>
            <p>
              Per avere le migliori possibilità di successo, consigliamo di pescare {spot.bestTime.hours.toLowerCase()}, 
              preferibilmente con {spot.bestTime.weather.toLowerCase()}. 
              Non dimenticare la licenza di pesca e rispetta le taglie minime!
            </p>
          </div>
        </section>

        {/* Related Spots */}
        {region.spots.length > 1 && (
          <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Altri Spot di Pesca in {region.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {region.spots
                .filter((s) => s.id !== spot.id)
                .slice(0, 4)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/spot-pesca-italia/${region.id}/${s.id}`}
                    className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700"
                  >
                    <h3 className="font-bold text-white">{s.name}</h3>
                    <p className="text-slate-400 text-sm">{s.locality}</p>
                    <p className="text-cyan-400 text-sm mt-1">
                      {s.species.slice(0, 2).map((sp) => sp.name).join(', ')}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
          <Link
            href={`/spot-pesca-italia/${region.id}`}
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Altri spot in {region.name}
          </Link>
          <Link
            href="/spot-pesca-italia"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Tutti gli Spot Italia →
          </Link>
        </div>
      </div>
    </main>
  );
}
