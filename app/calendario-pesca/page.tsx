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
  inverno: 'bg-blue-50 text-blue-700 border-blue-200',
  primavera: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  estate: 'bg-amber-50 text-amber-700 border-amber-200',
  autunno: 'bg-orange-50 text-orange-700 border-orange-200',
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
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function CalendarioPescaPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const monthData = (calendarData.months as Record<string, MonthData>)[selectedMonth.toString()];

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const goToPrevMonth = () => {
    handleMonthChange(selectedMonth === 1 ? 12 : selectedMonth - 1);
  };

  const goToNextMonth = () => {
    handleMonthChange(selectedMonth === 12 ? 1 : selectedMonth + 1);
  };

  useEffect(() => {
    setSelectedMonth(new Date().getMonth() + 1);
  }, []);

  const isCurrentMonth = selectedMonth === new Date().getMonth() + 1;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Calendario Pesca
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Scopri cosa pescare mese per mese nel Mediterraneo. Specie attive, tecniche consigliate e condizioni ideali.
            </p>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Navigation Arrows + Current Month */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center min-w-[200px]">
              <h2 className="text-2xl font-bold text-gray-900">
                {monthData.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${seasonColors[monthData.season]}`}>
                  {seasonIcons[monthData.season]} {monthData.season.charAt(0).toUpperCase() + monthData.season.slice(1)}
                </span>
                {isCurrentMonth && (
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium">
                    Mese corrente
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
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
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-gray-900 text-white'
                      : isCurrent
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-2">Valutazione mese</p>
            <StarRating rating={monthData.overallRating} />
          </div>
          <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Temperatura acqua</p>
            <p className="text-xl font-bold text-blue-700">{monthData.waterTemp}</p>
          </div>
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Ore di luce</p>
            <p className="text-xl font-bold text-amber-700">{monthData.daylight}</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Specie attive</p>
            <p className="text-xl font-bold text-gray-900">{monthData.species.length}</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-10">
          <p className="text-gray-700 text-lg leading-relaxed text-center">
            {monthData.description}
          </p>
        </div>

        {/* Species Section */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Specie attive a {monthData.name}
          </h3>
          <div className="grid gap-4">
            {monthData.species.map((species) => (
              <div
                key={species.name}
                className={`p-5 rounded-xl border transition-colors ${
                  species.peak 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{species.icon}</span>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {species.name}
                          {species.peak && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              Periodo top
                            </span>
                          )}
                        </h4>
                        <StarRating rating={species.rating} />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{species.notes}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tecniche: </span>
                        <span className="text-gray-900 font-medium">{species.techniques.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Orario: </span>
                        <span className="text-gray-900 font-medium">{species.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Techniques Section */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Tecniche consigliate
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {monthData.techniques.map((technique) => (
              <div
                key={technique.name}
                className="p-5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{technique.name}</h4>
                  <StarRating rating={technique.rating} />
                </div>
                <p className="text-blue-600 text-sm mb-2">Target: {technique.target}</p>
                <p className="text-gray-500 text-sm">{technique.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Baits Section */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Esche del mese
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {monthData.baits.map((bait) => (
              <div
                key={bait.name}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{bait.name}</h4>
                  <div className="flex">
                    {Array.from({ length: bait.rating }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-xs">{bait.target}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions & Tips */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Condizioni ideali
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Vento</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.idealWind}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Mare</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.idealSea}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Pressione</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.idealPressure}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Luna</p>
                  <p className="text-gray-900 font-medium">{monthData.conditions.moonPhase}</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-4">Consigli del mese</h4>
              <ul className="space-y-3">
                {monthData.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Non sai che attrezzatura usare?
          </h3>
          <p className="text-gray-600 mb-6">
            Fai il nostro quiz e scopri l&apos;attrezzatura perfetta per te
          </p>
          <Link
            href="/trova-attrezzatura"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Trova la tua attrezzatura
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Vai al mese */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Vai direttamente al mese</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {[
              { slug: 'gennaio', name: 'Gennaio' }, { slug: 'febbraio', name: 'Febbraio' },
              { slug: 'marzo', name: 'Marzo' }, { slug: 'aprile', name: 'Aprile' },
              { slug: 'maggio', name: 'Maggio' }, { slug: 'giugno', name: 'Giugno' },
              { slug: 'luglio', name: 'Luglio' }, { slug: 'agosto', name: 'Agosto' },
              { slug: 'settembre', name: 'Settembre' }, { slug: 'ottobre', name: 'Ottobre' },
              { slug: 'novembre', name: 'Novembre' }, { slug: 'dicembre', name: 'Dicembre' },
            ].map((m) => {
              const md = (calendarData.months as Record<string, MonthData>)[(
                ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'].indexOf(m.slug) + 1
              ).toString()];
              return (
                <Link
                  key={m.slug}
                  href={`/calendario-pesca/${m.slug}`}
                  className="p-3 rounded-xl text-center text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors"
                >
                  {m.name}
                  {md && <span className="block text-xs mt-0.5 text-gray-400">{md.species.length} specie</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calendario per Regione */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Calendario per regione</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Scopri cosa si pesca nella tua regione, mese per mese</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'sardegna', name: 'Sardegna' }, { id: 'sicilia', name: 'Sicilia' },
              { id: 'liguria', name: 'Liguria' }, { id: 'puglia', name: 'Puglia' },
              { id: 'toscana', name: 'Toscana' }, { id: 'campania', name: 'Campania' },
              { id: 'lazio', name: 'Lazio' }, { id: 'calabria', name: 'Calabria' },
              { id: 'veneto', name: 'Veneto' }, { id: 'emilia-romagna', name: 'Emilia-Romagna' },
            ].map((region) => (
              <Link
                key={region.id}
                href={`/calendario-pesca/${region.id}`}
                className="p-4 rounded-xl text-center bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <p className="font-medium text-gray-900">{region.name}</p>
                <p className="text-xs text-blue-600 mt-1">12 mesi →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">
            Perché usare il calendario?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sempre aggiornato</h3>
              <p className="text-gray-600 text-sm">
                Il calendario si apre sul mese corrente, mostrandoti subito cosa pescare oggi.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Informazioni precise</h3>
              <p className="text-gray-600 text-sm">
                Ogni specie ha la sua valutazione, le tecniche migliori e i momenti più produttivi.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Condizioni ideali</h3>
              <p className="text-gray-600 text-sm">
                Scopri vento, mare e luna perfetti per ogni mese e massimizza le catture.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
