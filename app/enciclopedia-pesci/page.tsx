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
        <span
          key={i}
          className={`text-sm ${i < difficulty ? 'text-amber-400' : 'text-slate-600'}`}
        >
          ★
        </span>
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
      // Search filter
      const matchesSearch =
        fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fish.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || fish.category === selectedCategory;

      // Seasonal filter
      const matchesSeasonal =
        !showOnlySeasonal || fish.seasonality.best.includes(currentMonth);

      return matchesSearch && matchesCategory && matchesSeasonal;
    });
  }, [searchQuery, selectedCategory, showOnlySeasonal]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            📖 Enciclopedia Pesci Italia
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Scopri tutte le specie del Mediterraneo: caratteristiche, tecniche di pesca, 
            stagioni migliori e consigli per catturarle.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white">
            <span className="text-2xl">🐟</span>
            <span className="font-bold">{fishData.fish.length}</span>
            <span>specie catalogate</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cerca un pesce... (es. spigola, orata, calamaro)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Seasonal Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlySeasonal}
              onChange={(e) => setShowOnlySeasonal(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-slate-300 text-sm">
              🎯 Mostra solo pesci in stagione questo mese
            </span>
            {showOnlySeasonal && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                {filteredFish.length} trovati
              </span>
            )}
          </label>
        </div>
      </div>

      {/* Fish Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredFish.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-white mb-2">
              Nessun pesce trovato
            </h3>
            <p className="text-slate-400">
              Prova a modificare i filtri o la ricerca
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFish.map((fish) => {
              const isInSeason = fish.seasonality.best.includes(currentMonth);
              
              return (
                <Link
                  key={fish.id}
                  href={`/enciclopedia-pesci/${fish.slug}`}
                  className="group bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{fish.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {fish.name}
                        </h3>
                        {isInSeason && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                            In stagione
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs italic mb-2">
                        {fish.scientificName}
                      </p>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                        {fish.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500">Difficoltà: </span>
                          <DifficultyStars difficulty={fish.fishing.difficulty} />
                        </div>
                        <span className="text-slate-500">
                          {fish.characteristics.avgWeight}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {fish.fishing.bestTechnique}
                    </span>
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      Scopri di più →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* SEO Content */}
      <section className="bg-slate-800/50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            La guida completa ai pesci del Mediterraneo
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-slate-300">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">📚 {fishData.fish.length} Specie</h3>
              <p className="text-sm">
                Ogni scheda include caratteristiche, habitat, comportamento, 
                tecniche di pesca e stagioni migliori.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">🎣 Consigli di Pesca</h3>
              <p className="text-sm">
                Per ogni pesce trovi le esche migliori, le tecniche più efficaci 
                e i segreti per catturarlo.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">📅 Stagionalità</h3>
              <p className="text-sm">
                Scopri quando ogni specie è più attiva e aumenta 
                le tue possibilità di successo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

