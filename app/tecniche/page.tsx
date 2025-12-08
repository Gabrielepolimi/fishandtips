import { Metadata } from 'next';
import Link from 'next/link';
import techniquesData from '../../data/fishing-techniques.json';

export const metadata: Metadata = {
  title: 'Tecniche di Pesca - Guida Completa alle Tecniche | FishandTips',
  description: 'Scopri tutte le tecniche di pesca: spinning, surfcasting, bolognese, eging, feeder, traina, jigging e molto altro. Guide complete con attrezzatura e consigli.',
  keywords: 'tecniche pesca, spinning, surfcasting, bolognese, eging, feeder, carpfishing, pesca a mosca, jigging, pesca a fondo',
  openGraph: {
    title: 'Tecniche di Pesca - Guida Completa alle Tecniche | FishandTips',
    description: 'Scopri tutte le tecniche di pesca: spinning, surfcasting, bolognese, eging, feeder, traina, jigging e molto altro.',
    type: 'website',
    url: 'https://fishandtips.it/tecniche',
  },
  alternates: {
    canonical: 'https://fishandtips.it/tecniche',
  },
};

interface Technique {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  difficulty: number;
  popularity: number;
  environment: string[];
  targetSpecies: string[];
  bestSeasons: string[];
}

function DifficultyBadge({ level }: { level: number }) {
  const labels = ['', 'Facile', 'Medio', 'Intermedio', 'Avanzato', 'Esperto'];
  const colors = [
    '',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-orange-50 text-orange-700 border-orange-200',
    'bg-rose-50 text-rose-700 border-rose-200',
  ];
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

function EnvironmentIcons({ environments }: { environments: string[] }) {
  const icons: Record<string, { icon: string; label: string }> = {
    mare: { icon: '🌊', label: 'Mare' },
    lago: { icon: '🏞️', label: 'Lago' },
    fiume: { icon: '🏞️', label: 'Fiume' },
  };
  
  return (
    <div className="flex gap-1">
      {environments.map((env) => (
        <span 
          key={env} 
          className="text-xs text-gray-500"
          title={icons[env]?.label}
        >
          {icons[env]?.icon}
        </span>
      ))}
    </div>
  );
}

export default function TecnichePage() {
  const techniques = techniquesData.techniques as Technique[];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Tecniche</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tecniche di Pesca
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Dalla più semplice alla più tecnica: scopri tutte le tecniche di pesca, 
              l'attrezzatura necessaria e i segreti per catturare ogni specie.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{techniques.length}</span>
                </div>
                <span>tecniche</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">3</span>
                </div>
                <span>ambienti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map((technique) => (
              <Link
                key={technique.id}
                href={`/tecniche/${technique.slug}`}
                className="group"
              >
                <article className="h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {technique.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {technique.subtitle}
                      </p>
                    </div>
                    <EnvironmentIcons environments={technique.environment} />
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {technique.shortDescription}
                  </p>

                  {/* Target Species */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Prede principali:</p>
                    <div className="flex flex-wrap gap-1">
                      {technique.targetSpecies.slice(0, 4).map((species) => (
                        <span 
                          key={species}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {species}
                        </span>
                      ))}
                      {technique.targetSpecies.length > 4 && (
                        <span className="px-2 py-0.5 text-gray-400 text-xs">
                          +{technique.targetSpecies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <DifficultyBadge level={technique.difficulty} />
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                      Scopri
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Come scegliere la tecnica giusta?
            </h2>
            <p className="text-gray-600">
              Ogni tecnica ha le sue caratteristiche. Ecco cosa considerare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dove peschi?</h3>
              <p className="text-sm text-gray-600">
                Mare, lago o fiume? Dalla riva o dalla barca? 
                Ogni ambiente ha le sue tecniche ideali.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Che pesce vuoi?</h3>
              <p className="text-sm text-gray-600">
                Ogni specie richiede un approccio specifico. 
                Scegli la tecnica in base alla tua preda.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Il tuo livello?</h3>
              <p className="text-sm text-gray-600">
                Alcune tecniche sono più accessibili, altre richiedono 
                esperienza. Inizia gradualmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Non sai quale tecnica provare?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Fai il nostro quiz e ti consiglieremo la tecnica perfetta per te, 
            con l'attrezzatura giusta per iniziare.
          </p>
          <Link 
            href="/trova-attrezzatura"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
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

