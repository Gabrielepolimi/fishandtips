import { Metadata } from 'next';
import Link from 'next/link';
import productsData from '../../data/fishing-products.json';

interface Product {
  rank: number;
  name: string;
  badge: string;
  priceRange: string;
  rating: number;
  bestFor: string;
  pros: string[];
  cons: string[];
  amazonQuery: string;
}

interface Category {
  slug: string;
  title: string;
  products: Product[];
}

const categories = (productsData as { categories: Category[] }).categories;

const CATEGORY_META: Record<string, { target: string; icon: string }> = {
  'canne-surfcasting': { target: 'Surfcasting — orate, spigole, mormore', icon: '🎣' },
  'mulinelli-spinning': { target: 'Spinning costiero — spigole, serra, lecce', icon: '⚙️' },
  'canne-spinning': { target: 'Spinning — predatori costieri e pelagici', icon: '🎣' },
  'totanare-eging': { target: 'Eging — calamari e seppie', icon: '🦑' },
  'canne-bolognese': { target: 'Bolognese — saraghi, cefali, orate', icon: '🎣' },
  'ami-pesca': { target: 'Tutte le tecniche con esca naturale', icon: '🪝' },
  'fili-trecciato': { target: 'Spinning e jigging — pelagici', icon: '🧵' },
  'piombi-surfcasting': { target: 'Surfcasting — spiagge e fondali sabbiosi', icon: '⚓' },
  'esche-artificiali-spinning': { target: 'Spinning — spigole, serra, barracuda', icon: '🐟' },
  'attrezzatura-pesca-principianti': { target: 'Chi inizia — pesca versatile', icon: '🌟' },
  'migliori-ecoscandagli': { target: 'Pesca dalla barca — individuare i pesci', icon: '📡' },
  'occhialini-pesca': { target: 'Sight fishing — avvistare i pesci', icon: '🕶️' },
  'guanti-pesca': { target: 'Protezione mani — tutte le tecniche', icon: '🧤' },
  'lampade-frontali-pesca': { target: 'Pesca notturna — surfcasting ed eging', icon: '🔦' },
  'borse-pesca': { target: 'Trasporto attrezzatura — tutte le tecniche', icon: '🎒' },
};

export const metadata: Metadata = {
  title: 'Migliori Attrezzature da Pesca 2026 - Guide e Confronti | FishandTips',
  description:
    'Guide e confronti sulle migliori attrezzature da pesca 2026: canne surfcasting e spinning, mulinelli, totanare, ami, trecciati, ecoscandagli e accessori. Confronti con link Amazon.',
  alternates: { canonical: 'https://fishandtips.it/migliori' },
  openGraph: {
    title: 'Migliori Attrezzature da Pesca 2026 - Guide e Confronti | FishandTips',
    description: 'Guide e confronti sulle migliori attrezzature da pesca 2026. Confronti con link Amazon.',
    url: 'https://fishandtips.it/migliori',
    siteName: 'FishandTips',
    type: 'website',
  },
};

export default function MiglioriHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Migliori 2026</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Migliori Attrezzature da Pesca 2026 — Guide e Confronti
        </h1>

        <div className="prose prose-gray max-w-3xl mb-10">
          <p className="text-gray-600 text-lg leading-relaxed">
            Scegliere l&apos;attrezzatura giusta fa la differenza tra una giornata memorabile e una frustrante.
            Le nostre guide confrontano i migliori prodotti disponibili nel 2026 con criteri oggettivi:
            rapporto qualità-prezzo, durabilità, prestazioni in condizioni reali di pesca e feedback della community.
            Ogni confronto include fascia di prezzo, pro e contro, e il link diretto ad Amazon per acquistare al miglior prezzo.
            Che tu sia un principiante alla prima uscita o un esperto che vuole aggiornare l&apos;attrezzatura,
            qui trovi la guida giusta per ogni tecnica e ogni budget.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug];
            const topProduct = cat.products[0];
            return (
              <Link
                key={cat.slug}
                href={`/migliori/${cat.slug}`}
                className="group block p-5 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{cat.title}</h2>
                  {meta && <span className="text-xl flex-shrink-0">{meta.icon}</span>}
                </div>
                {meta && (
                  <p className="text-xs text-gray-500 mb-3">{meta.target}</p>
                )}
                {topProduct && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {topProduct.badge}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {topProduct.priceRange}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-2">
                  {cat.products.length} prodotti a confronto
                </p>
                <span className="text-blue-600 text-sm font-medium group-hover:underline">
                  Vai alla guida →
                </span>
              </Link>
            );
          })}
        </div>

        <section className="mb-12 p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Come scegliere l&apos;attrezzatura giusta</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">1</span>
                Definisci il budget
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Non serve spendere una fortuna per pescare bene. Stabilisci un budget realistico: con 80-150€
                trovi attrezzature di qualità per iniziare, mentre gli upgrade premium partono dai 200€ in su.
                Concentra l&apos;investimento su canna e mulinello — il resto può aspettare.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">2</span>
                Considera il tuo livello
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Un principiante ha bisogno di attrezzatura versatile e tollerante agli errori, non del top di gamma.
                Le canne ad azione media e i mulinelli con freno micrometrico perdonano molto. Gli avanzati
                cercano sensibilità e leggerezza — qui vale la pena investire in fibra di carbonio e cuscinetti ceramici.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">3</span>
                Scegli per tecnica
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ogni tecnica richiede attrezzatura specifica: il surfcasting vuole canne lunghe e potenti,
                lo spinning richiede leggerezza e sensibilità, l&apos;eging serve precisione nel lancio delle totanare.
                Abbina l&apos;attrezzatura alla tecnica e alla specie target — le nostre guide ti aiutano a scegliere.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Esplora anche</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/tecniche"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Tecniche di pesca →
            </Link>
            <Link
              href="/pesci-mediterraneo"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Pesci del Mediterraneo →
            </Link>
            <Link
              href="/spot-pesca-italia"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Spot di pesca in Italia →
            </Link>
            <Link
              href="/calendario-pesca"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Calendario pesca →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
