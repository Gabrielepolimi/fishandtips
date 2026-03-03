import Link from 'next/link';
import fishData from '../../data/fish-encyclopedia.json';
import spotsData from '../../data/fishing-spots.json';
import techniquesData from '../../data/fishing-techniques.json';
import calendarData from '../../data/fishing-calendar.json';

const TOP_SPECIES_SLUGS = ['spigola', 'orata', 'sarago', 'seppia', 'calamaro', 'ricciola'];
const MONTH_SLUGS: Record<string, string> = {
  'Gennaio': 'gennaio', 'Febbraio': 'febbraio', 'Marzo': 'marzo', 'Aprile': 'aprile',
  'Maggio': 'maggio', 'Giugno': 'giugno', 'Luglio': 'luglio', 'Agosto': 'agosto',
  'Settembre': 'settembre', 'Ottobre': 'ottobre', 'Novembre': 'novembre', 'Dicembre': 'dicembre',
};

function getBestMonthForSpecies(speciesName: string): string | null {
  const months = (calendarData as any).months;
  if (!months) return null;
  let bestMonth: string | null = null;
  let bestRating = 0;
  for (const [num, data] of Object.entries(months)) {
    const m = data as { name: string; species?: Array<{ name: string; rating?: number }> };
    const species = m.species?.find((s: any) => s.name === speciesName);
    if (species && (species.rating ?? 0) >= bestRating) {
      bestRating = species.rating ?? 0;
      bestMonth = m.name;
    }
  }
  return bestMonth ? MONTH_SLUGS[bestMonth] ?? bestMonth.toLowerCase() : null;
}

export default function HomeHubSections() {
  const allFish = (fishData as any).fish ?? [];
  const fishList = TOP_SPECIES_SLUGS.map((slug) => allFish.find((f: any) => f.slug === slug)).filter(Boolean);
  const regions = (spotsData as any).regions ?? [];
  const techniques = (techniquesData as any).techniques ?? [];
  const totalSpots = (spotsData as any).metadata?.totalSpots ?? 249;
  const totalFish = (fishData as any).fish?.length ?? 31;

  const now = new Date();
  const currentMonthNum = now.getMonth() + 1;
  const monthsData = (calendarData as any).months;
  const currentMonthData = monthsData?.[String(currentMonthNum)] as { name: string; species?: Array<{ name: string; icon?: string; rating?: number }> } | undefined;
  const currentMonthSlug = currentMonthData ? (MONTH_SLUGS[currentMonthData.name] ?? currentMonthData.name.toLowerCase()) : 'gennaio';
  const top3ThisMonth = (currentMonthData?.species ?? [])
    .sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);

  return (
    <>
      {/* Le specie più cercate */}
      <section className="py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Le specie più cercate</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {fishList.map((fish: any) => {
              const bestMonth = getBestMonthForSpecies(fish.name);
              return (
                <Link
                  key={fish.slug}
                  href={`/pesci-mediterraneo/${fish.slug}`}
                  className="group flex flex-col items-center p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-blue/40 hover:shadow-md transition"
                >
                  <span className="text-3xl mb-2">{fish.icon || '🐟'}</span>
                  <span className="font-semibold text-gray-900 text-center group-hover:text-brand-blue">{fish.name}</span>
                  {bestMonth && (
                    <span className="text-xs text-gray-500 mt-1">Top: {bestMonth}</span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link href="/pesci-mediterraneo" className="text-brand-blue font-semibold hover:underline">
              Vedi tutte le {totalFish} specie →
            </Link>
          </div>
        </div>
      </section>

      {/* Pesca per regione */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Pesca per regione</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {regions.slice(0, 10).map((r: any) => (
              <Link
                key={r.id}
                href={`/spot-pesca-italia/${r.id}`}
                className="group flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-blue/40 hover:shadow-md transition"
              >
                <span className="text-3xl mb-2">{r.icon || '📍'}</span>
                <span className="font-semibold text-gray-900 text-center group-hover:text-brand-blue">{r.name}</span>
                <span className="text-sm text-gray-500">{r.spots?.length ?? r.totalSpots ?? 0} spot</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/spot-pesca-italia" className="text-brand-blue font-semibold hover:underline">
              Vedi tutti i {totalSpots} spot →
            </Link>
          </div>
        </div>
      </section>

      {/* Tecniche di pesca */}
      <section className="py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Tecniche di pesca</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {techniques.slice(0, 10).map((t: any) => (
              <Link
                key={t.slug}
                href={`/tecniche/${t.slug}`}
                className="group flex flex-col p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-blue/40 hover:shadow-md transition"
              >
                <span className="text-3xl mb-2">{t.emoji || '🎣'}</span>
                <span className="font-semibold text-gray-900 group-hover:text-brand-blue">{t.name}</span>
                <span className="text-xs text-gray-500 mt-1">{t.difficulty ?? '—'}</span>
                {t.minBudget != null && (
                  <span className="text-xs text-gray-500">Da €{t.minBudget}</span>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/tecniche" className="text-brand-blue font-semibold hover:underline">
              Guida completa alle tecniche →
            </Link>
          </div>
        </div>
      </section>

      {/* Cosa pescare questo mese */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Cosa pescare questo mese</h2>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8">
            <p className="text-lg font-medium text-gray-900 mb-4">
              {currentMonthData?.name ?? 'Gennaio'} — Le 3 specie top del mese
            </p>
            <ul className="space-y-2 mb-6">
              {top3ThisMonth.map((s: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span>{s.icon ?? '🐟'}</span>
                  <span className="text-gray-800">{s.name}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/calendario-pesca/${currentMonthSlug}`}
                className="inline-flex items-center px-5 py-2.5 bg-brand-blue text-white font-medium rounded-full hover:bg-brand-blue/90 transition"
              >
                Calendario {currentMonthData?.name ?? 'mese'} →
              </Link>
              <Link href="/calendario-pesca" className="text-brand-blue font-semibold hover:underline">
                Calendario completo →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
