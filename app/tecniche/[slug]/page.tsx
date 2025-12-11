import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import techniquesData from '../../../data/fishing-techniques.json';

interface Technique {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  heroImage: string;
  difficulty: number;
  popularity: number;
  environment: string[];
  targetSpecies: string[];
  bestSeasons: string[];
  introduction: string;
  history: string;
  sections: { title: string; content: string }[];
  tips: string[];
  equipment: {
    canna: { name: string; description: string; price: number; amazonUrl: string };
    mulinello: { name: string; description: string; price: number; amazonUrl: string };
    [key: string]: { name: string; description: string; price: number; amazonUrl: string };
  };
  relatedFish: string[];
  relatedArticles: string[];
  seoKeywords: string[];
}

export async function generateStaticParams() {
  return techniquesData.techniques.map((technique) => ({
    slug: technique.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const technique = techniquesData.techniques.find((t) => t.slug === slug) as Technique | undefined;
  
  if (!technique) {
    return { title: 'Tecnica non trovata' };
  }

  return {
    title: `${technique.name} - Guida Completa alla Tecnica | FishandTips`,
    description: `${technique.shortDescription} Scopri attrezzatura, tecniche e consigli per la pesca ${technique.name.toLowerCase()}.`,
    keywords: technique.seoKeywords.join(', '),
    openGraph: {
      title: `${technique.name} - Guida Completa alla Tecnica | FishandTips`,
      description: technique.shortDescription,
      type: 'article',
      url: `https://fishandtips.it/tecniche/${technique.slug}`,
    },
    alternates: {
      canonical: `https://fishandtips.it/tecniche/${technique.slug}`,
    },
  };
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < level ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function SeasonBadge({ season }: { season: string }) {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    primavera: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🌸' },
    estate: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '☀️' },
    autunno: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🍂' },
    inverno: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '❄️' },
  };
  const c = config[season] || config.primavera;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.bg} ${c.text} text-xs font-medium rounded-full`}>
      <span>{c.icon}</span>
      {season.charAt(0).toUpperCase() + season.slice(1)}
    </span>
  );
}

export default async function TechniqueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const technique = techniquesData.techniques.find((t) => t.slug === slug) as Technique | undefined;

  if (!technique) {
    notFound();
  }

  const equipmentItems = Object.entries(technique.equipment);
  const totalEquipmentPrice = equipmentItems.reduce((sum, [, item]) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/tecniche" className="text-gray-500 hover:text-gray-900 transition-colors">
              Tecniche
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{technique.name}</span>
          </nav>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {technique.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {technique.subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Difficoltà:</span>
              <DifficultyStars level={technique.difficulty} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Stagioni:</span>
              <div className="flex gap-1">
                {technique.bestSeasons.map((season) => (
                  <SeasonBadge key={season} season={season} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-gray-50 rounded-2xl">
          <h2 className="font-semibold text-gray-900 mb-4">In questa guida:</h2>
          <ul className="grid md:grid-cols-2 gap-2">
            <li>
              <a href="#introduzione" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Introduzione
              </a>
            </li>
            {technique.sections.map((section, i) => (
              <li key={i}>
                <a href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#attrezzatura" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Attrezzatura Consigliata
              </a>
            </li>
            <li>
              <a href="#consigli" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Consigli Pratici
              </a>
            </li>
          </ul>
        </nav>

        {/* Introduction */}
        <section id="introduzione" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cos'è il {technique.name}?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {technique.introduction}
          </p>
          
          {/* Target Species */}
          <div className="p-6 bg-blue-50 rounded-2xl mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Specie Target:</h3>
            <div className="flex flex-wrap gap-2">
              {technique.targetSpecies.map((species) => (
                <Link
                  key={species}
                  href={`/pesci-mediterraneo`}
                  className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-full hover:bg-gray-100 transition-colors"
                >
                  {species}
                </Link>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="p-6 border border-gray-200 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-3">Un po' di storia</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {technique.history}
            </p>
          </div>
        </section>

        {/* Main Sections */}
        {technique.sections.map((section, index) => (
          <section 
            key={index} 
            id={section.title.toLowerCase().replace(/\s+/g, '-')}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}

        {/* Equipment Section */}
        <section id="attrezzatura" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Attrezzatura Consigliata
          </h2>
          <p className="text-gray-600 mb-6">
            Ecco l'attrezzatura che ti consigliamo per iniziare a praticare il {technique.name.toLowerCase()}. 
            Prodotti selezionati per il miglior rapporto qualità/prezzo.
          </p>
          
          <div className="space-y-4">
            {equipmentItems.map(([key, item]) => (
              <div 
                key={key}
                className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-gray-900">
                      €{item.price}
                    </p>
                    <a
                      href={item.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      Vedi su Amazon
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className="mt-6 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Costo totale kit completo</p>
                <p className="text-3xl font-bold text-gray-900">€{totalEquipmentPrice}</p>
              </div>
              <p className="text-xs text-gray-400 text-right max-w-xs">
                I prezzi possono variare. Link affiliati Amazon.
              </p>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section id="consigli" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Consigli Pratici
          </h2>
          <div className="grid gap-4">
            {technique.tips.map((tip, index) => (
              <div 
                key={index}
                className="flex gap-4 p-5 bg-emerald-50 rounded-xl"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section className="mb-12 p-8 bg-gray-50 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Approfondisci
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/pesci-mediterraneo"
              className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Enciclopedia Pesci</p>
                <p className="text-sm text-gray-500">Scopri le specie del Mediterraneo</p>
              </div>
            </Link>
            
            <Link
              href="/spot-pesca-italia"
              className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Spot di Pesca</p>
                <p className="text-sm text-gray-500">I migliori luoghi dove pescare</p>
              </div>
            </Link>
            
            <Link
              href="/trova-attrezzatura"
              className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Quiz Attrezzatura</p>
                <p className="text-sm text-gray-500">Trova il kit perfetto per te</p>
              </div>
            </Link>
            
            <Link
              href="/calendario-pesca"
              className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Calendario Pesca</p>
                <p className="text-sm text-gray-500">Cosa pescare mese per mese</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Other Techniques */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Altre tecniche da esplorare
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {techniquesData.techniques
              .filter((t) => t.slug !== technique.slug)
              .slice(0, 3)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/tecniche/${t.slug}`}
                  className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{t.shortDescription}</p>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Vuoi ricevere altri consigli sul {technique.name}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Iscriviti alla newsletter e riceverai guide, trucchi e aggiornamenti 
            su questa e altre tecniche di pesca.
          </p>
          <Link 
            href="/registrazione"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
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


