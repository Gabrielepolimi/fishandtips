'use client';

import { useState } from 'react';
import Link from 'next/link';
import spotsData from '../../data/fishing-spots.json';

interface Spot {
  id: string;
  name: string;
  region: string;
  province: string;
  locality: string;
  description: string;
  environment: string;
  species: { name: string; rating: number }[];
  techniques: { name: string; rating: number }[];
  rating: number;
  difficulty: number;
}

interface Region {
  id: string;
  name: string;
  icon: string;
  description: string;
  totalSpots: number;
  topSpecies: string[];
  spots: Spot[];
}

function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const colors = {
    1: 'bg-green-500',
    2: 'bg-green-400',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  };
  const labels = {
    1: 'Facile',
    2: 'Accessibile',
    3: 'Media',
    4: 'Difficile',
    5: 'Esperto',
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${colors[difficulty as keyof typeof colors]}`}>
      {labels[difficulty as keyof typeof labels]}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400">{'★'.repeat(Math.floor(rating))}</span>
      <span className="text-slate-600">{'★'.repeat(5 - Math.floor(rating))}</span>
      <span className="text-sm text-slate-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function SpotPescaItaliaPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const regions = spotsData.regions as Region[];

  const filteredRegions = selectedRegion
    ? regions.filter((r) => r.id === selectedRegion)
    : regions;

  const allSpots = filteredRegions.flatMap((r) =>
    r.spots.map((s) => ({ ...s, regionName: r.name, regionIcon: r.icon }))
  );

  const filteredSpots = searchQuery
    ? allSpots.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.province.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSpots;

  const totalSpots = regions.reduce((acc, r) => acc + r.spots.length, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Spot Pesca Italia
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            La guida completa ai migliori luoghi di pesca in Italia.
            Coordinate GPS, tecniche, specie e consigli dei pescatori locali.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-full text-white">
              <span className="font-bold">{totalSpots}</span> spot mappati
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full text-white">
              <span className="font-bold">{regions.length}</span> regioni
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cerca uno spot... (es. Capo Testa, Tropea, Sardegna)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
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

          {/* Region Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedRegion === null
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🇮🇹 Tutte
            </button>
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedRegion === region.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {region.icon} {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredSpots.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-white mb-2">Nessuno spot trovato</h3>
            <p className="text-slate-400">Prova a modificare la ricerca o i filtri</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpots.map((spot) => (
              <Link
                key={`${spot.region}-${spot.id}`}
                href={`/spot-pesca-italia/${spot.region}/${spot.id}`}
                className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-4 py-3 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyan-400">
                      {(spot as Spot & { regionIcon: string }).regionIcon} {(spot as Spot & { regionName: string }).regionName}
                    </span>
                    <DifficultyBadge difficulty={spot.difficulty} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">
                    📍 {spot.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-2">
                    {spot.locality}, {spot.province}
                  </p>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                    {spot.description}
                  </p>

                  {/* Species Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {spot.species.slice(0, 3).map((s) => (
                      <span
                        key={s.name}
                        className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full"
                      >
                        🐟 {s.name}
                      </span>
                    ))}
                    {spot.species.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full">
                        +{spot.species.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <StarRating rating={spot.rating} />
                    <span className="text-cyan-400 text-sm">Scopri →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Regions Overview */}
      <section className="bg-slate-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Esplora per Regione
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region) => (
              <Link
                key={region.id}
                href={`/spot-pesca-italia/${region.id}`}
                className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{region.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {region.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">
                      {region.spots.length} spot mappati
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {region.topSpecies.slice(0, 3).map((species) => (
                        <span
                          key={species}
                          className="text-xs text-cyan-400"
                        >
                          {species}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            La guida completa agli spot di pesca in Italia
          </h2>
          <p className="text-slate-400 mb-8">
            FishandTips ha mappato i migliori luoghi di pesca italiani, dalle coste della Sardegna
            alle scogliere siciliane, dalla Riviera ligure all&apos;Adriatico. Ogni spot include
            coordinate GPS precise, tecniche consigliate, specie presenti, stagionalità e consigli
            dei pescatori locali.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">📍 Coordinate GPS</h3>
              <p className="text-sm text-slate-400">
                Coordinate precise per raggiungere ogni spot senza problemi. Apri direttamente in Google Maps.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">🎣 Tecniche e Esche</h3>
              <p className="text-sm text-slate-400">
                Per ogni spot trovi le tecniche più efficaci e le esche consigliate dai pescatori locali.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">📅 Stagionalità</h3>
              <p className="text-sm text-slate-400">
                Scopri quali specie sono attive mese per mese in ogni spot per massimizzare le catture.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
