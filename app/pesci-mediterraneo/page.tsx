'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import fishData from '../../data/fish-encyclopedia.json';

interface Fish {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  family: string;
  category: string;
  icon: string;
  description: string;
  characteristics: {
    maxLength: string;
    avgWeight: string;
  };
  fishing: {
    difficulty: number;
    bestTechnique: string;
  };
  seasonality: {
    best: number[];
  };
}

const categories = [
  { id: 'all', name: 'Tutti', icon: '🐟' },
  { id: 'predatore', name: 'Predatori', icon: '🦈' },
  { id: 'sparide', name: 'Sparidi', icon: '🐠' },
  { id: 'cefalopode', name: 'Cefalopodi', icon: '🦑' },
  { id: 'pelagico', name: 'Pelagici', icon: '🐟' },
  { id: 'fondale', name: 'Pesci di Fondo', icon: '🐟' },
];

const currentMonth = new Date().getMonth() + 1;

function DifficultyStars({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < difficulty ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function EnciclopediaPesciPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlySeasonal, setShowOnlySeasonal] = useState(false);

  const filteredFish = useMemo(() => {
    return (fishData.fish as Fish[]).filter((fish) => {
      const matchesSearch =
        fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fish.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || fish.category === selectedCategory;

      const matchesSeasonal =
        !showOnlySeasonal || fish.seasonality.best.includes(currentMonth);

      return matchesSearch && matchesCategory && matchesSeasonal;
    });
  }, [searchQuery, selectedCategory, showOnlySeasonal]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Pesci del Mediterraneo
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              La guida completa a tutte le specie ittiche del mare italiano: 
              come riconoscerle, quando pescarle e le tecniche migliori.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{fishData.fish.length}</span>
                </div>
                <span>specie catalogate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cerca un pesce... (es. spigola, orata)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Seasonal Toggle */}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlySeasonal}
              onChange={(e) => setShowOnlySeasonal(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-600 text-sm">
              Solo pesci in stagione questo mese
            </span>
            {showOnlySeasonal && (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">
                {filteredFish.length} trovati
              </span>
            )}
          </label>
        </div>
      </div>

      {/* Fish Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredFish.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nessun pesce trovato</h3>
            <p className="text-gray-500">Prova a modificare i filtri o la ricerca</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFish.map((fish) => {
              const isInSeason = fish.seasonality.best.includes(currentMonth);
              
              return (
                <Link
                  key={fish.id}
                  href={`/pesci-mediterraneo/${fish.slug}`}
                  className="group"
                >
                  {/* Card Image Placeholder */}
                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 mb-3 overflow-hidden relative flex items-center justify-center">
                    <span className="text-6xl opacity-60">{fish.icon}</span>
                    {isInSeason && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        In stagione
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:underline mb-0.5">
                      {fish.name}
                    </h3>
                    <p className="text-gray-400 text-xs italic mb-2">
                      {fish.scientificName}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {fish.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Difficoltà:</span>
                        <DifficultyStars difficulty={fish.fishing.difficulty} />
                      </div>
                      <span className="text-gray-400 text-xs">
                        {fish.characteristics.avgWeight}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">
            La guida completa ai pesci del Mediterraneo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{fishData.fish.length} Specie</h3>
              <p className="text-gray-600 text-sm">
                Ogni scheda include caratteristiche, habitat, comportamento e tecniche di pesca.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consigli di pesca</h3>
              <p className="text-gray-600 text-sm">
                Per ogni pesce trovi esche, tecniche e segreti per catturarlo.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Stagionalità</h3>
              <p className="text-gray-600 text-sm">
                Scopri quando ogni specie è più attiva e aumenta le possibilità di successo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
