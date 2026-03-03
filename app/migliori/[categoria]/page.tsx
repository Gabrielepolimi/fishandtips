import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import productsData from '../../../data/fishing-products.json';
import fishData from '../../../data/fish-encyclopedia.json';
import techniquesData from '../../../data/fishing-techniques.json';

const AFFILIATE_TAG = 'fishandtips-21';
const BASE_URL = 'https://fishandtips.it';

type Product = {
  rank: number;
  name: string;
  badge: string;
  priceRange: string;
  rating: number;
  pros: string[];
  cons: string[];
  amazonQuery: string;
  bestFor: string;
};

type Category = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  lastUpdated: string;
  relatedTechnique: string | null;
  relatedSpecies: string[];
  buyingGuide: { factors: { name: string; description: string }[] };
  products: Product[];
  faq: { q: string; a: string }[];
};

const categories = (productsData as { categories: Category[] }).categories;

function formatLastUpdated(iso: string): string {
  const [y, m] = iso.split('-');
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const monthName = months[parseInt(m, 10) - 1] || '';
  return `${monthName} ${y}`;
}

function badgeColor(badge: string): string {
  const b = badge.toLowerCase();
  if (b.includes('qualità/prezzo') || b.includes('rapporto')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (b.includes('premium') || b.includes('top')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (b.includes('budget') || b.includes('economy')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (b.includes('distanza') || b.includes('tenuta') || b.includes('robustezza')) return 'bg-slate-100 text-slate-800 border-slate-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
}

function amazonUrl(query: string): string {
  return `https://www.amazon.it/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const { categoria } = await params;
  const cat = categories.find((c) => c.slug === categoria);
  if (!cat) return { title: 'Categoria non trovata' };

  const title = `${cat.title} - Guida e Confronto 2026 | FishandTips`;
  return {
    title,
    description: cat.metaDescription,
    alternates: { canonical: `${BASE_URL}/migliori/${cat.slug}` },
    openGraph: {
      title,
      description: cat.metaDescription,
      url: `${BASE_URL}/migliori/${cat.slug}`,
      siteName: 'FishandTips',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: cat.metaDescription },
  };
}

export default async function MiglioriCategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const cat = categories.find((c) => c.slug === categoria);
  if (!cat) notFound();

  const updatedLabel = formatLastUpdated(cat.lastUpdated);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cat.title,
    description: cat.metaDescription,
    numberOfItems: cat.products.length,
    itemListElement: cat.products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: amazonUrl(p.amazonQuery),
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cat.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Migliori', item: `${BASE_URL}/migliori` },
      { '@type': 'ListItem', position: 3, name: cat.title, item: `${BASE_URL}/migliori/${cat.slug}` },
    ],
  };

  const technique = cat.relatedTechnique
    ? (techniquesData as { techniques: { slug: string; name: string }[] }).techniques.find((t) => t.slug === cat.relatedTechnique)
    : null;
  const speciesLinks = cat.relatedSpecies
    .map((slug) => {
      const fish = (fishData as { fish: { slug: string; name: string }[] }).fish.find((f: { slug: string }) => f.slug === slug);
      return fish ? { slug: fish.slug, name: fish.name } : null;
    })
    .filter(Boolean) as { slug: string; name: string }[];

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/migliori" className="hover:text-gray-900">Migliori</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{cat.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{cat.title}</h1>
        <p className="text-gray-600 mb-2">{cat.intro}</p>
        <p className="text-sm text-gray-500 mb-8">Aggiornato: {updatedLabel}</p>

        {/* Tabella riassuntiva */}
        <section className="overflow-x-auto rounded-xl border border-gray-200 mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-900">Prodotto</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Badge</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Link</th>
              </tr>
            </thead>
            <tbody>
              {cat.products.map((p) => (
                <tr key={p.rank} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded border ${badgeColor(p.badge)}`}>
                      {p.badge}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={amazonUrl(p.amazonQuery)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="text-brand-blue hover:underline font-medium"
                    >
                      Vedi su Amazon →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Card prodotti */}
        <section className="space-y-8 mb-12">
          {cat.products.map((p) => (
            <article key={p.rank} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-blue text-white font-bold text-lg">
                    {p.rank}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">{p.name}</h2>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full border ${badgeColor(p.badge)}`}>
                    {p.badge}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{p.priceRange}</p>
                  <p className="text-amber-600 text-sm">
                    {'★'.repeat(Math.round(p.rating))}
                    <span className="text-gray-500 font-normal"> ({p.rating})</span>
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">Pro</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-0.5">
                    {p.pros.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-rose-700 uppercase mb-1">Contro</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-0.5">
                    {p.cons.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Migliore per:</span> {p.bestFor}
              </p>
              <a
                href={amazonUrl(p.amazonQuery)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Vedi su Amazon →
              </a>
            </article>
          ))}
        </section>

        {/* Guida all'acquisto */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guida all&apos;acquisto</h2>
          <p className="text-gray-600 mb-6">Cosa considerare prima di comprare:</p>
          <div className="space-y-4">
            {cat.buyingGuide.factors.map((f, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">{f.name}</h3>
                <p className="text-gray-700 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Domande frequenti</h2>
          <div className="space-y-2">
            {cat.faq.map((f, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 py-3 bg-gray-50 text-gray-700 text-sm border-t border-gray-100">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Link correlati */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Link correlati</h2>
          <div className="flex flex-wrap gap-4">
            {technique && (
              <Link
                href={`/tecniche/${technique.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Tecnica: {technique.name} →
              </Link>
            )}
            {speciesLinks.map((s) => (
              <Link
                key={s.slug}
                href={`/pesci-mediterraneo/${s.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
              >
                {s.name} →
              </Link>
            ))}
            <Link href="/migliori" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors">
              Tutte le guide Migliori 2026 →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
