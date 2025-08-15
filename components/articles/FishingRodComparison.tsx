'use client';

import React, { useState, useMemo } from 'react';

interface FishingRod {
  _id: string;
  name: string;
  brand: string;
  mainImage: string;
  price: number;
  length: number;
  castingPower: string;
  action: string;
  experienceLevel: string;
  badge?: string;
  quickReview?: string;
  affiliateLink?: string;
  status: string;
}

interface FishingRodComparisonProps {
  rods?: FishingRod[];
  customTitle?: string;
  selectedProducts?: Array<{
    productId: string;
    name: string;
    brand: string;
    price: number;
    length?: number;
    castingPower?: string;
    action?: string;
    experienceLevel: string;
    badge?: string;
    quickReview?: string;
    affiliateLink?: string;
    image?: string;
  }>;
}

export default function FishingRodComparison({ rods = [], customTitle, selectedProducts }: FishingRodComparisonProps) {
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Converti i prodotti selezionati nel formato richiesto
  const convertSelectedProducts = (products: any[]): FishingRod[] => {
    return products?.map((product, index) => ({
      _id: product.productId || `product-${index}`,
      name: product.name,
      brand: product.brand,
      mainImage: product.image || '/images/articoli.jpg',
      price: product.price,
      length: product.length || 0,
      castingPower: product.castingPower || 'N/A',
      action: product.action || 'N/A',
      experienceLevel: product.experienceLevel,
      badge: product.badge,
      quickReview: product.quickReview,
      affiliateLink: product.affiliateLink,
      status: 'available'
    })) || [];
  };

  // Usa i prodotti selezionati
  const selectedRods = convertSelectedProducts(selectedProducts);
  const allRods = rods.length > 0 ? rods : selectedRods;

  // Funzione per formattare il prezzo come range
  const formatPriceRange = (price: number) => {
    const min = Math.floor(price * 0.9);
    const max = Math.ceil(price * 1.1);
    return `€${min}-${max}`;
  };

  const filteredAndSortedRods = useMemo(() => {
    let filtered = allRods.filter(rod => {
      const matchesPrice = rod.price >= priceRange[0] && rod.price <= priceRange[1];
      const matchesExperience = experienceFilter === 'all' || rod.experienceLevel === experienceFilter;
      const matchesSearch = rod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rod.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPrice && matchesExperience && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [allRods, sortBy, sortOrder, priceRange, experienceFilter, searchTerm]);

  const handleSort = (field: 'price' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };





  return (
    <div className="mt-12 bg-white rounded-xl shadow-xl border border-gray-100 p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-brand-blue mb-10 text-center">
        {customTitle || "Confronta le migliori canne da surfcasting 2025"}
      </h2>
      
      {/* Filtri */}
      <div className="mb-10 space-y-8">
        <div className="flex flex-wrap gap-6">
          {/* Ricerca */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cerca prodotti</label>
            <input
              type="text"
              placeholder="Cerca per nome o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all duration-200 text-base"
            />
          </div>
          
          {/* Filtro esperienza */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Livello esperienza</label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all duration-200 bg-white text-base"
            >
              <option value="all">Tutti i livelli</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="expert">Esperto</option>
            </select>
          </div>
        </div>
        
        {/* Range prezzo */}
        <div className="bg-gray-50 rounded-xl p-6">
          <label className="block text-lg font-semibold text-brand-blue mb-4">
            Range prezzo: €{priceRange[0]} - €{priceRange[1]}
          </label>
          <div className="flex gap-6 items-center">
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Tabella */}
      <div className="rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-blue text-white">
              <th className="p-4 text-left font-semibold text-base w-1/5">Modello</th>
              <th 
                className="p-4 text-left font-semibold text-base cursor-pointer hover:bg-brand-blue-light transition-colors w-1/8"
                onClick={() => handleSort('price')}
              >
                Range Prezzo {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              {allRods.some(rod => rod.length > 0) && (
                <th className="p-4 text-left font-semibold text-base w-1/8">Azione</th>
              )}
              {allRods.every(rod => rod.length === 0) && (
                <th className="p-4 text-left font-semibold text-base w-1/8">Tipo</th>
              )}
              <th className="p-4 text-left font-semibold text-base w-1/8">Livello</th>
              <th className="p-4 text-left font-semibold text-base w-2/5">La mia opinione</th>
              <th className="p-4 text-left font-semibold text-base w-1/8">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRods.map((rod) => (
              <React.Fragment key={rod._id}>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-bold text-gray-900 text-base">{rod.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{rod.brand}</div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-brand-blue text-base">{formatPriceRange(rod.price)}</td>
                  {rod.length > 0 && (
                    <td className="p-4 font-semibold text-gray-800 text-sm">{rod.action}</td>
                  )}
                  {rod.length === 0 && (
                    <td className="p-4 font-semibold text-gray-800 text-sm">Mulinello</td>
                  )}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rod.experienceLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                      rod.experienceLevel === 'intermediate' ? 'bg-brand-yellow text-brand-blue' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rod.experienceLevel === 'beginner' ? 'Principiante' :
                       rod.experienceLevel === 'intermediate' ? 'Intermedio' : 'Esperto'}
                    </span>
                  </td>
                  <td className="p-4">
                    {rod.quickReview ? (
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {rod.quickReview}
                      </p>
                    ) : (
                      <span className="text-sm text-gray-400">Nessuna recensione</span>
                    )}
                  </td>
                  <td className="p-4">
                    {rod.affiliateLink && (
                      <a 
                        href={rod.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-yellow text-brand-blue px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-sm block text-center"
                      >
                        Visualizza
                      </a>
                    )}
                  </td>
                                 </tr>
               </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

              {filteredAndSortedRods.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🎣</div>
            <p className="text-lg font-medium">Nessun prodotto configurato per questo articolo.</p>
            <p className="text-sm text-gray-400 mt-2">Configura i prodotti nel pannello di amministrazione</p>
          </div>
        )}
    </div>
  );
}