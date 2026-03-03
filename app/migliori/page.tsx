import { Metadata } from 'next';
import Link from 'next/link';
import productsData from '../../data/fishing-products.json';

const categories = (productsData as { categories: { slug: string; title: string; products: unknown[] }[] }).categories;

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
          Migliori Attrezzature da Pesca 2026 - Guide e Confronti
        </h1>
        <p className="text-gray-600 mb-10 max-w-3xl">
          Scopri le nostre guide ai migliori prodotti per la pesca: canne, mulinelli, ami, fili, esche artificiali e accessori.
          Ogni guida confronta 4-5 prodotti con pro e contro, fascia di prezzo e link per l&apos;acquisto su Amazon.
          Trova l&apos;attrezzatura giusta per surfcasting, spinning, eging e bolognese, con consigli per principianti ed esperti.
          Esplora anche le nostre tecniche di pesca e le schede dei pesci del Mediterraneo per abbinare attrezzatura e obiettivo.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/migliori/${cat.slug}`}
              className="block p-5 border border-gray-200 rounded-xl hover:border-brand-blue hover:shadow-md transition-all"
            >
              <h2 className="font-bold text-gray-900 mb-1">{cat.title}</h2>
              <p className="text-sm text-gray-500">
                {cat.products.length} prodotti a confronto
              </p>
              <span className="text-brand-blue text-sm font-medium mt-2 inline-block">
                Vai alla guida →
              </span>
            </Link>
          ))}
        </div>

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
          </div>
        </section>
      </div>
    </div>
  );
}
