import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi Siamo - FishandTips | Team di Esperti di Pesca',
  description: 'Scopri il team di FishandTips: esperti di pesca con anni di esperienza che condividono consigli, tecniche e passione per la pesca sportiva.',
  keywords: 'chi siamo FishandTips, team pesca, esperti pesca, consigli pesca, passione pesca, pesca sportiva',
  openGraph: {
    title: 'Chi Siamo - FishandTips | Team di Esperti di Pesca',
    description: 'Scopri il team di FishandTips: esperti di pesca con anni di esperienza che condividono consigli, tecniche e passione per la pesca sportiva.',
    type: 'website',
    url: 'https://fishandtips.it/chi-siamo',
    images: [
      {
        url: 'https://fishandtips.it/images/background.jpg',
        width: 1200,
        height: 630,
        alt: 'Team FishandTips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi Siamo - FishandTips | Team di Esperti di Pesca',
    description: 'Scopri il team di FishandTips: esperti di pesca con anni di esperienza che condividono consigli, tecniche e passione per la pesca sportiva.',
    images: ['https://fishandtips.it/images/background.jpg'],
  },
  alternates: {
    canonical: 'https://fishandtips.it/chi-siamo',
  },
};

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Chi Siamo</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Chi Siamo
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              La passione per la pesca sportiva che diventa condivisione 
              di conoscenza e esperienza.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Consigli per chi ama la pesca
            </h2>
            <p className="text-xl text-gray-700 mb-6 font-medium">
              Scritti da chi la vive ogni giorno.
            </p>
            
            <p className="text-gray-600 mb-6">
              Amiamo la pesca tanto quanto te. Che tu sia alle prime uscite o con anni di esperienza, 
              qui trovi consigli, tecniche e recensioni nati dall&apos;acqua salata, dai fiumi limpidi 
              e dai laghi tranquilli.
            </p>
            <p className="text-gray-600 mb-6">
              Non scriviamo per riempire pagine, ma per condividere quello che viviamo ogni volta 
              che lanciamo la lenza.
            </p>
            <p className="text-gray-700 font-medium mb-4">
              Scopri le nostre guide, scritte da chi ama la pesca… per chi ama la pesca.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progetto editoriale indipendente</h3>
              <p className="text-gray-700 mb-2">
                Selezioniamo gli argomenti in base alle domande reali dei pescatori e ai dati di ricerca, non per sponsorship o pagamenti.
              </p>
              <p className="text-gray-700 mb-2">
                Non accettiamo sponsorizzazioni occulte: quando segnaliamo prodotti o spot, lo facciamo perché li usiamo o li riteniamo utili.
              </p>
              <p className="text-gray-700">
                Aggiorniamo e correggiamo i contenuti periodicamente: se qualcosa cambia (regolamenti, stagioni, attrezzature), lo dichiariamo nell&apos;articolo.
              </p>
              <p className="text-gray-700 mt-3">
                Il nostro lavoro segue una <Link href="/editorial-policy" className="text-blue-600 hover:text-blue-700 underline">Linea editoriale</Link> trasparente e indipendente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            I nostri valori
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Esperienza</h3>
              <p className="text-sm text-gray-600">
                Condividiamo solo tecniche e consigli testati personalmente 
                in anni di pesca sportiva.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Qualità</h3>
              <p className="text-sm text-gray-600">
                Ci impegniamo a fornire contenuti di alta qualità, 
                accurati e sempre aggiornati.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comunità</h3>
              <p className="text-sm text-gray-600">
                Costruiamo insieme una comunità di pescatori 
                appassionati e rispettosi dell&apos;ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Esperti di pesca sportiva
                </h2>
                <p className="text-gray-600 mb-4">
                  Il nostro team è composto da pescatori esperti con decenni di esperienza 
                  in diverse tecniche di pesca: dalla pesca a mosca allo spinning, 
                  dalla pesca in mare alla pesca in acque interne.
                </p>
                <p className="text-gray-600 mb-6">
                  Ogni membro del team porta la propria esperienza unica e la condivide 
                  attraverso articoli dettagliati e consigli pratici.
                </p>
                <Link 
                  href="/contatti"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Contattaci
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="md:col-span-2 flex justify-center">
                <div className="w-40 h-40 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Unisciti alla nostra comunità
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Iscriviti alla newsletter per ricevere i migliori consigli di pesca, 
            scoprire nuove tecniche e rimanere aggiornato.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/registrazione"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Iscriviti alla Newsletter
            </Link>
            <Link 
              href="/contatti"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-700 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
