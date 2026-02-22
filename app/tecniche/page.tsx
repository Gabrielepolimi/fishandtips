import { Metadata } from 'next';
import Link from 'next/link';
import techniquesData from '../../data/fishing-techniques.json';
import fishData from '../../data/fish-encyclopedia.json';

export const metadata: Metadata = {
  title: 'Tecniche di Pesca - Guide Complete per Ogni Tecnica | FishandTips',
  description: 'Scopri tutte le tecniche di pesca: spinning, surfcasting, bolognese, eging, feeder, traina, jigging e molto altro. Guide complete con attrezzatura, montature e consigli pratici.',
  keywords: 'tecniche pesca, spinning, surfcasting, bolognese, eging, feeder, jigging, traina, bolentino, beach ledgering, light rock fishing',
  openGraph: {
    title: 'Tecniche di Pesca - Guide Complete per Ogni Tecnica | FishandTips',
    description: 'Scopri tutte le tecniche di pesca con guide complete: attrezzatura, montature, specie target e consigli pratici per ogni livello.',
    type: 'website',
    url: 'https://fishandtips.it/tecniche',
    siteName: 'FishandTips',
  },
  alternates: {
    canonical: 'https://fishandtips.it/tecniche',
  },
};

interface Technique {
  slug: string;
  name: string;
  emoji: string;
  shortDescription: string;
  difficulty: string;
  minBudget: number;
  maxBudget: number;
  targetSpecies: string[];
}

const difficultyColors: Record<string, string> = {
  'Facile': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Media': 'bg-amber-50 text-amber-700 border-amber-200',
  'Difficile': 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function TecnichePage() {
  const techniques = techniquesData.techniques as Technique[];

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fishandtips.it' },
              { '@type': 'ListItem', position: 2, name: 'Tecniche', item: 'https://fishandtips.it/tecniche' },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Tecniche</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tecniche di Pesca — Guide Complete
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-4">
              La pesca sportiva in Italia offre una varietà straordinaria di tecniche, ognuna adatta a prede, ambienti e livelli di esperienza diversi. Dalle spiagge sabbiose dell&apos;Adriatico alle scogliere liguri, dalle isole siciliane alle lagune venete: ogni costa italiana ha la sua tecnica ideale. Che tu sia un principiante alla prima esperienza o un pescatore esperto in cerca di nuove sfide, qui trovi la guida completa per ogni tecnica con attrezzatura, montature, specie target e consigli pratici.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{techniques.length}</span>
                </div>
                <span>tecniche</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">4</span>
                </div>
                <span>livelli difficoltà</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map((tech) => {
              const speciesNames = tech.targetSpecies.slice(0, 3).map(slug => {
                const f = (fishData as any).fish.find((f: any) => f.slug === slug);
                return f?.name || slug;
              });

              return (
                <Link key={tech.slug} href={`/tecniche/${tech.slug}`} className="group">
                  <article className="h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tech.emoji}</span>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tech.name}
                          </h2>
                          <p className="text-sm text-gray-500">{tech.minBudget}-{tech.maxBudget}€</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tech.shortDescription}</p>

                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Specie principali:</p>
                      <div className="flex flex-wrap gap-1">
                        {speciesNames.map((name) => (
                          <span key={name} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{name}</span>
                        ))}
                        {tech.targetSpecies.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">+{tech.targetSpecies.length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${difficultyColors[tech.difficulty] || ''}`}>
                        {tech.difficulty}
                      </span>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                        Scopri
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Come scegliere la tecnica giusta?</h2>
            <p className="text-gray-600">Ogni tecnica ha le sue caratteristiche. Ecco cosa considerare.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Dove peschi?</h3>
              <p className="text-sm text-gray-600">Spiaggia, scogliera, porto o barca? Ogni ambiente ha le sue tecniche ideali.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🐟</div>
              <h3 className="font-semibold text-gray-900 mb-2">Che pesce vuoi?</h3>
              <p className="text-sm text-gray-600">Ogni specie richiede un approccio specifico. Scegli la tecnica in base alla tua preda.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">⭐</div>
              <h3 className="font-semibold text-gray-900 mb-2">Il tuo livello?</h3>
              <p className="text-sm text-gray-600">Alcune tecniche sono accessibili a tutti, altre richiedono esperienza. Inizia gradualmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/pesci-mediterraneo" className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="text-3xl">🐟</div>
              <div>
                <p className="font-semibold text-gray-900">Enciclopedia Pesci</p>
                <p className="text-sm text-gray-500">31 specie del Mediterraneo con guide complete</p>
              </div>
            </Link>
            <Link href="/spot-pesca-italia" className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="text-3xl">📍</div>
              <div>
                <p className="font-semibold text-gray-900">Spot di Pesca</p>
                <p className="text-sm text-gray-500">249 spot in 10 regioni italiane</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Non sai quale tecnica provare?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Fai il nostro quiz e ti consiglieremo la tecnica perfetta per te, con l&apos;attrezzatura giusta per iniziare.
          </p>
          <Link href="/trova-attrezzatura" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors">
            Fai il Quiz
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
