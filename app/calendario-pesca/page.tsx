'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import calendarData from '../../data/fishing-calendar.json';

interface Species {
  name: string;
  rating: number;
  icon: string;
  peak: boolean;
  notes: string;
  techniques: string[];
  bestTime: string;
}

interface Technique {
  name: string;
  rating: number;
  target: string;
  tip: string;
}

interface Bait {
  name: string;
  target: string;
  rating: number;
}

interface MonthData {
  name: string;
  season: string;
  waterTemp: string;
  daylight: string;
  overallRating: number;
  description: string;
  species: Species[];
  techniques: Technique[];
  baits: Bait[];
  conditions: {
    idealWind: string;
    idealSea: string;
    idealPressure: string;
    moonPhase: string;
  };
  tips: string[];
}

const monthNames = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const seasonColors: Record<string, string> = {
  inverno: 'from-blue-600 to-cyan-600',
  primavera: 'from-green-500 to-emerald-500',
  estate: 'from-orange-500 to-yellow-500',
  autunno: 'from-amber-600 to-orange-600',
};

const seasonIcons: Record<string, string> = {
  inverno: '❄️',
  primavera: '🌸',
  estate: '☀️',
  autunno: '🍂',
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CalendarioPescaPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isAnimating, setIsAnimating] = useState(false);

  const monthData = (calendarData.months as Record<string, MonthData>)[selectedMonth.toString()];

  const handleMonthChange = (month: number) => {
    if (month === selectedMonth) return;
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedMonth(month);
      setIsAnimating(false);
    }, 150);
  };

  const goToPrevMonth = () => {
    handleMonthChange(selectedMonth === 1 ? 12 : selectedMonth - 1);
  };

  const goToNextMonth = () => {
    handleMonthChange(selectedMonth === 12 ? 1 : selectedMonth + 1);
  };

  // Auto-detect current month on mount
  useEffect(() => {
    setSelectedMonth(new Date().getMonth() + 1);
  }, []);

  const isCurrentMonth = selectedMonth === new Date().getMonth() + 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${seasonColors[monthData.season]} py-8 px-4 transition-all duration-300`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">{seasonIcons[monthData.season]}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Calendario Pesca
            </h1>
            <span className="text-3xl">{seasonIcons[monthData.season]}</span>
          </div>
          <p className="text-white/80 text-center">
            Scopri cosa pescare mese per mese nel Mediterraneo
          </p>
        </div>
      </div>

      {/* Month Selector */}
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Navigation Arrows + Current Month */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center min-w-[200px]">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {monthData.name}
              </h2>
              {isCurrentMonth && (
                <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-green-400 text-xs mt-1">
                  📍 Mese corrente
                </span>
              )}
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Month Pills */}
          <div className="flex gap-1 justify-center flex-wrap">
            {monthNames.map((name, index) => {
              const month = index + 1;
              const isSelected = month === selectedMonth;
              const isCurrent = month === new Date().getMonth() + 1;
              
              return (
                <button
                  key={month}
                  onClick={() => handleMonthChange(month)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 scale-110'
                      : isCurrent
                      ? 'bg-green-500/30 text-green-400 hover:bg-green-500/40'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {name.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`max-w-5xl mx-auto px-4 py-8 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-1">Valutazione</p>
            <StarRating rating={monthData.overallRating} />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-1">🌡️ Acqua</p>
            <p className="text-xl font-bold text-cyan-400">{monthData.waterTemp}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-1">☀️ Luce</p>
            <p className="text-xl font-bold text-yellow-400">{monthData.daylight}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-1">📅 Stagione</p>
            <p className="text-xl font-bold text-white capitalize">{monthData.season}</p>
          </div>
        </div>

        {/* Description */}
        <div className={`bg-gradient-to-r ${seasonColors[monthData.season]} rounded-xl p-6 mb-8`}>
          <p className="text-white text-lg font-medium text-center">
            {monthData.description}
          </p>
        </div>

        {/* Species Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🐟 Specie Attive
          </h3>
          <div className="grid gap-4">
            {monthData.species.map((species, index) => (
              <div
                key={species.name}
                className={`bg-slate-800/50 rounded-xl p-5 border transition-all hover:border-cyan-500/50 ${
                  species.peak ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-slate-700'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{species.icon}</span>
                      <div>
                        <h4 className="text-xl font-bold text-white flex items-center gap-2">
                          {species.name}
                          {species.peak && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs">
                              🔥 PERIODO TOP
                            </span>
                          )}
                        </h4>
                        <StarRating rating={species.rating} />
                      </div>
                    </div>
                    <p className="text-slate-300 mb-3">{species.notes}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Tecniche: </span>
                        <span className="text-cyan-400">{species.techniques.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Orario: </span>
                        <span className="text-amber-400">{species.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Techniques Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🎣 Tecniche Consigliate
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {monthData.techniques.map((technique) => (
              <div
                key={technique.name}
                className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-white">{technique.name}</h4>
                  <StarRating rating={technique.rating} />
                </div>
                <p className="text-cyan-400 text-sm mb-2">Target: {technique.target}</p>
                <p className="text-slate-400 text-sm">💡 {technique.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Baits Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🪱 Esche del Mese
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {monthData.baits.map((bait) => (
              <div
                key={bait.name}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-sm">{bait.name}</h4>
                  <div className="flex">
                    {Array.from({ length: bait.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-xs">{bait.target}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🌊 Condizioni Ideali
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-sm mb-1">💨 Vento</p>
                  <p className="text-white font-medium">{monthData.conditions.idealWind}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">🌊 Mare</p>
                  <p className="text-white font-medium">{monthData.conditions.idealSea}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">📊 Pressione</p>
                  <p className="text-white font-medium">{monthData.conditions.idealPressure}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">🌙 Luna</p>
                  <p className="text-white font-medium">{monthData.conditions.moonPhase}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl p-5 border border-cyan-500/30">
              <h4 className="font-bold text-cyan-400 mb-3">💡 Tips del Mese</h4>
              <ul className="space-y-2">
                {monthData.tips.map((tip, index) => (
                  <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Non sai che attrezzatura usare?
          </h3>
          <p className="text-slate-400 mb-4">
            Fai il nostro quiz e scopri l&apos;attrezzatura perfetta per te
          </p>
          <Link
            href="/trova-attrezzatura"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-all hover:scale-105"
          >
            🎣 Trova la Tua Attrezzatura
          </Link>
        </div>
      </div>

      {/* SEO Content */}
      <section className="bg-slate-800/50 py-12 px-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Perché usare il Calendario Pesca?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-slate-300">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">📅 Sempre Aggiornato</h3>
              <p className="text-sm">
                Il calendario si apre automaticamente sul mese corrente, 
                mostrandoti subito cosa pescare oggi.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">🎯 Informazioni Precise</h3>
              <p className="text-sm">
                Ogni specie ha la sua valutazione, le tecniche migliori 
                e i momenti della giornata più produttivi.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">🌊 Condizioni Ideali</h3>
              <p className="text-sm">
                Scopri il vento, il mare e la luna perfetti per ogni 
                mese e massimizza le tue catture.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

