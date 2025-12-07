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
  const styles = {
    1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    2: 'bg-teal-50 text-teal-700 border-teal-200',
    3: 'bg-amber-50 text-amber-700 border-amber-200',
    4: 'bg-orange-50 text-orange-700 border-orange-200',
    5: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const labels = {
    1: 'Facile',
    2: 'Accessibile',
    3: 'Media',
    4: 'Difficile',
    5: 'Esperto',
  };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[difficulty as keyof typeof styles]}`}>
      {labels[difficulty as keyof typeof labels]}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
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
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Spot di Pesca in Italia
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Scopri i migliori luoghi dove pescare. Coordinate GPS, tecniche consigliate 
              e suggerimenti dai pescatori locali.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{totalSpots}</span>
                </div>
                <span>spot mappati</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">{regions.length}</span>
                </div>
                <span>regioni</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cerca uno spot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Region Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedRegion === null
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              Tutte le regioni
            </button>
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedRegion === region.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {region.icon} {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSpots.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nessuno spot trovato</h3>
            <p className="text-gray-500">Prova a modificare la ricerca o i filtri</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpots.map((spot) => (
              <Link
                key={`${spot.region}-${spot.id}`}
                href={`/spot-pesca-italia/${spot.region}/${spot.id}`}
                className="group"
              >
                {/* Card Image Placeholder */}
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 mb-3 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-50">{(spot as Spot & { regionIcon: string }).regionIcon}</span>
                  </div>
                  {/* Wishlist button style */}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Card Content */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:underline">
                      {spot.name}
                    </h3>
                    <StarRating rating={spot.rating} />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    {spot.locality}, {(spot as Spot & { regionName: string }).regionName}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    {spot.species.slice(0, 2).map((s) => s.name).join(' · ')}
                  </p>
                  <div className="flex items-center gap-2">
                    <DifficultyBadge difficulty={spot.difficulty} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Regions Section */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Esplora per regione
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {regions.map((region) => (
              <Link
                key={region.id}
                href={`/spot-pesca-italia/${region.id}`}
                className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{region.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {region.spots.length} spot
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {region.topSpecies.slice(0, 2).map((species) => (
                    <span key={species} className="text-xs text-gray-500">
                      {species}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Come funziona
            </h2>
            <p className="text-gray-600">
              Trova lo spot perfetto per la tua prossima battuta di pesca
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cerca</h3>
              <p className="text-gray-600 text-sm">
                Filtra per regione, specie o tecnica di pesca preferita
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Raggiungi</h3>
              <p className="text-gray-600 text-sm">
                Usa le coordinate GPS per arrivare senza problemi
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pesca</h3>
              <p className="text-gray-600 text-sm">
                Segui i consigli e le tecniche suggerite dai locali
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
