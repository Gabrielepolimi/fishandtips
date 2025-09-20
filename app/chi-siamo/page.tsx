import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../../components/articles/Breadcrumb';
import Button from '../../components/ui/Button';
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
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-blue to-brand-blue-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Chi Siamo
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            La passione per la pesca sportiva che diventa condivisione di conoscenza e esperienza
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[
          { label: 'Chi Siamo' }
        ]} />

        {/* Main Description Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Consigli per chi ama la pesca</h2>
          <h3 className="text-xl text-brand-blue font-semibold mb-6">Scritti da chi la vive ogni giorno.</h3>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Amiamo la pesca tanto quanto te. Che tu sia alle prime uscite o con anni di esperienza, 
              qui trovi consigli, tecniche e recensioni nati dall'acqua salata, dai fiumi limpidi 
              e dai laghi tranquilli.
            </p>
            <p className="text-gray-600 mb-6">
              Non scriviamo per riempire pagine, ma per condividere quello che viviamo ogni volta 
              che lanciamo la lenza.
            </p>
            <p className="text-lg text-gray-700 font-medium">
              Scopri le nostre guide, scritte da chi ama la pesca… per chi ama la pesca.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">I Nostri Valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Esperienza</h3>
              <p className="text-gray-600">
                Condividiamo solo tecniche e consigli testati personalmente 
                in anni di pesca sportiva.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Qualità</h3>
              <p className="text-gray-600">
                Ci impegniamo a fornire contenuti di alta qualità, 
                accurati e sempre aggiornati.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-4.7 6.27c-.3.4-.49.88-.49 1.4V20c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comunità</h3>
              <p className="text-gray-600">
                Costruiamo insieme una comunità di pescatori 
                appassionati e rispettosi dell'ambiente.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Il Nostro Team</h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Esperti di Pesca Sportiva
                </h3>
                <p className="text-gray-600 mb-6">
                  Il nostro team è composto da pescatori esperti con decenni di esperienza 
                  in diverse tecniche di pesca: dalla pesca a mosca alla spinning, 
                  dalla pesca in mare alla pesca in acque interne.
                </p>
                <p className="text-gray-600 mb-6">
                  Ogni membro del team porta la propria esperienza unica e la condivide 
                  attraverso articoli dettagliati, tutorial video e consigli pratici.
                </p>
                <Link href="/contatti">
                  <Button variant="primary" size="lg">
                    Contattaci
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-brand-blue to-brand-yellow rounded-full flex items-center justify-center mx-auto">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <p className="text-lg font-semibold">Team FishandTips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-brand-blue/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unisciti alla Nostra Comunità
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Iscriviti alla newsletter per ricevere i migliori consigli di pesca, 
            scoprire nuove tecniche e rimanere aggiornato sulle ultime novità.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrazione">
              <Button variant="primary" size="lg">
                Iscriviti alla Newsletter
              </Button>
            </Link>
            <Link href="/contatti">
              <Button variant="outline" size="lg">
                Contattaci
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
