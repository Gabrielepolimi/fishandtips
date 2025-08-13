'use client';

import { 
  Calendar, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { 
    title: 'Tecniche di Pesca', 
    slug: 'tecniche-di-pesca', 
    image: '/images/tecniche.jpg',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Scopri spinning, bolognese, feeder e molto altro'
  },
  { 
    title: 'Attrezzature', 
    slug: 'attrezzature', 
    image: '/images/attrezzature.jpg',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: 'Guide su canne, mulinelli, esche e accessori'
  },
  { 
    title: 'Spot di Pesca', 
    slug: 'spot-di-pesca', 
    image: '/images/spot.jpg',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'I migliori luoghi per pescare in Italia'
  },
  { 
    title: 'Consigli Generali', 
    slug: 'consigli', 
    image: '/images/consigligenerali.jpg',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    description: 'Trucchi e segreti per migliorare'
  }
];

export default function ArticoliPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/articoli.jpg"
            alt="Articoli background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Overlay per leggibilità del testo */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Articoli
          </h1>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Esplora per Categoria
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scegli la categoria che ti interessa e scopri tutti gli articoli correlati
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categoria/${category.slug}`}>
                <div className={`${category.bgColor} p-6 rounded-xl hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                  {/* Immagine quadrata */}
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {category.description}
                  </p>
                  <div className={`flex items-center ${category.textColor} font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300`}>
                    Esplora categoria
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Non perderti i nuovi articoli!
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Iscriviti alla newsletter e ricevi contenuti personalizzati 
            basati sulle tue tecniche di pesca preferite.
          </p>
          <Link href="/registrazione">
            <button className="bg-brand-yellow text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-yellow-light transition-colors">
              Iscriviti Ora
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
