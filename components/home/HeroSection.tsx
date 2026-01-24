import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-white">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              La tua guida per la{' '}
              <span className="text-blue-600">pesca sportiva</span>{' '}
              in Italia
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Scopri tecniche, spot segreti e consigli esperti per migliorare 
              le tue catture. Dalla costa ai laghi, tutto quello che serve 
              per diventare un pescatore migliore.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/articoli"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Esplora gli articoli
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/spot-pesca-italia"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Trova uno spot
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-gray-100">
              <div>
                <div className="text-2xl font-bold text-gray-900">100+</div>
                <div className="text-sm text-gray-500">Articoli</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">30+</div>
                <div className="text-sm text-gray-500">Spot in Italia</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-500">Specie di pesci</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/background.jpg"
              >
                <source src="/videos/hero.webm" type="video/webm" />
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Consigli esperti</div>
                  <div className="text-sm text-gray-500">Aggiornati ogni settimana</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Articoli', href: '/articoli', icon: '📰' },
              { label: 'Tecniche', href: '/tecniche', icon: '🎣' },
              { label: 'Attrezzatura', href: '/trova-attrezzatura', icon: '🎒' },
              { label: 'Spot', href: '/spot-pesca-italia', icon: '📍' },
              { label: 'Pesci', href: '/pesci-mediterraneo', icon: '🐟' },
              { label: 'Calendario', href: '/calendario-pesca', icon: '📅' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
