'use client';

import { useState } from 'react';
import Link from 'next/link';
import quizProducts from '../../data/quiz-products.json';

type Technique = 'spinning' | 'surfcasting' | 'bolognese' | 'eging' | 'feeder';
type Experience = 'beginner' | 'intermediate';
type Budget = 'budget_low' | 'budget_medium' | 'budget_high';

interface Product {
  name: string;
  brand: string;
  price: number;
  amazonUrl: string;
  description: string;
  specs: string;
}

interface ProductSet {
  canna?: Product;
  mulinello?: Product;
  filo?: Product;
  artificiali?: Product;
  accessori?: Product;
  totanare?: Product;
}

const techniques = [
  {
    id: 'spinning' as Technique,
    name: 'Spinning',
    icon: '🎣',
    description: 'Pesca con artificiali per spigola, serra e altri predatori',
  },
  {
    id: 'surfcasting' as Technique,
    name: 'Surfcasting',
    icon: '🌊',
    description: 'Pesca dalla spiaggia con esche naturali a lunga distanza',
  },
  {
    id: 'bolognese' as Technique,
    name: 'Bolognese',
    icon: '🎏',
    description: 'Pesca con galleggiante dalla scogliera o dal porto',
  },
  {
    id: 'eging' as Technique,
    name: 'Eging',
    icon: '🦑',
    description: 'Pesca a seppie e calamari con totanare',
  },
  {
    id: 'feeder' as Technique,
    name: 'Feeder',
    icon: '🐟',
    description: 'Pesca con pasturatore per carpe, carassi e pesci di fondo',
  },
];

const experiences = [
  {
    id: 'beginner' as Experience,
    name: 'Principiante',
    description: 'Ho iniziato da poco o voglio provare questa tecnica',
  },
  {
    id: 'intermediate' as Experience,
    name: 'Intermedio',
    description: 'Ho già esperienza e cerco un upgrade',
  },
];

const budgets = [
  {
    id: 'budget_low' as Budget,
    name: 'Economico',
    range: 'Sotto €150',
    description: 'Attrezzatura base ma funzionale',
  },
  {
    id: 'budget_medium' as Budget,
    name: 'Medio',
    range: '€150 - €300',
    description: 'Ottimo rapporto qualità/prezzo',
  },
  {
    id: 'budget_high' as Budget,
    name: 'Premium',
    range: 'Oltre €300',
    description: 'Il meglio sul mercato',
  },
];

export default function TrovaAttrezzaturaPage() {
  const [step, setStep] = useState(1);
  const [technique, setTechnique] = useState<Technique | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleTechniqueSelect = (tech: Technique) => {
    setTechnique(tech);
    setTimeout(() => setStep(2), 200);
  };

  const handleExperienceSelect = (exp: Experience) => {
    setExperience(exp);
    setTimeout(() => setStep(3), 200);
  };

  const handleBudgetSelect = (bud: Budget) => {
    setBudget(bud);
    setTimeout(() => {
      setShowResults(true);
      setStep(4);
    }, 200);
  };

  const resetQuiz = () => {
    setStep(1);
    setTechnique(null);
    setExperience(null);
    setBudget(null);
    setShowResults(false);
  };

  const getRecommendedProducts = (): ProductSet | null => {
    if (!technique || !experience || !budget) return null;

    try {
      const products = quizProducts.products as Record<string, Record<string, Record<string, ProductSet>>>;
      const techniqueProducts = products[technique];
      if (!techniqueProducts) return null;

      let experienceProducts = techniqueProducts[experience];
      if (!experienceProducts && experience === 'intermediate') {
        experienceProducts = techniqueProducts['beginner'];
      }
      if (!experienceProducts) return null;

      const budgetProducts = experienceProducts[budget];
      if (!budgetProducts) {
        return experienceProducts['budget_medium'] || experienceProducts['budget_low'];
      }

      return budgetProducts;
    } catch {
      return null;
    }
  };

  const calculateTotalPrice = (products: ProductSet): number => {
    return Object.values(products).reduce((sum, product) => {
      if (product && typeof product === 'object' && 'price' in product) {
        return sum + (product as Product).price;
      }
      return sum;
    }, 0);
  };

  const products = showResults ? getRecommendedProducts() : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Trova la tua attrezzatura ideale
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Rispondi a 3 semplici domande e ti consigliamo l&apos;attrezzatura perfetta per iniziare
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                    step >= s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 4 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${step > s ? 'bg-gray-900' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="w-10 text-center">Tecnica</span>
            <span className="w-10 text-center">Livello</span>
            <span className="w-10 text-center">Budget</span>
            <span className="w-10 text-center">Risultati</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Step 1: Technique Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
              Che tecnica di pesca vuoi praticare?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techniques.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleTechniqueSelect(tech.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    technique === tech.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <span className="text-4xl mb-4 block">{tech.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{tech.name}</h3>
                  <p className="text-gray-500 text-sm">{tech.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Experience Selection */}
        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Indietro
            </button>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
              Qual è il tuo livello di esperienza?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleExperienceSelect(exp.id)}
                  className={`p-8 rounded-xl border-2 text-left transition-all ${
                    experience === exp.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{exp.name}</h3>
                  <p className="text-gray-500">{exp.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget Selection */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Indietro
            </button>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
              Qual è il tuo budget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {budgets.map((bud) => (
                <button
                  key={bud.id}
                  onClick={() => handleBudgetSelect(bud.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    budget === bud.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{bud.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{bud.range}</p>
                  <p className="text-gray-500 text-sm">{bud.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && showResults && products && (
          <div>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ecco la tua attrezzatura consigliata
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Kit {techniques.find(t => t.id === technique)?.name} - {experiences.find(e => e.id === experience)?.name}
              </h2>
              <p className="text-gray-500">
                Budget: {budgets.find(b => b.id === budget)?.range}
              </p>
            </div>

            {/* Products Grid */}
            <div className="space-y-4 mb-8">
              {Object.entries(products).map(([key, product]) => {
                if (!product || typeof product !== 'object' || !('name' in product)) return null;
                const p = product as Product;
                const categoryLabels: Record<string, string> = {
                  canna: 'Canna',
                  mulinello: 'Mulinello',
                  filo: 'Filo',
                  artificiali: 'Artificiali',
                  accessori: 'Accessori',
                  totanare: 'Totanare',
                };

                return (
                  <div
                    key={key}
                    className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                          {categoryLabels[key] || key}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mt-1">{p.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{p.description}</p>
                        <p className="text-gray-400 text-xs mt-2 font-mono">{p.specs}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">€{p.price.toFixed(0)}</p>
                          <p className="text-xs text-gray-500">{p.brand}</p>
                        </div>
                        <a
                          href={p.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          Vedi su Amazon
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Totale kit completo</p>
                  <p className="text-3xl font-bold text-gray-900">
                    €{calculateTotalPrice(products).toFixed(0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">I prezzi possono variare</p>
                  <p className="text-xs text-gray-500">Aggiornato: {quizProducts.metadata.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Ricomincia il quiz
              </button>
              <Link
                href="/articoli"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-center"
              >
                Leggi le nostre guide
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-gray-400 text-xs mt-8">
              I link Amazon sono affiliati. Acquistando attraverso questi link ci aiuti a mantenere il sito gratuito.
            </p>
          </div>
        )}

        {/* No Results Fallback */}
        {step === 4 && showResults && !products && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">😅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Non abbiamo trovato prodotti per questa combinazione
            </h3>
            <p className="text-gray-500 mb-6">
              Prova con un&apos;altra tecnica o budget
            </p>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              Ricomincia il quiz
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">
            Come scegliere l&apos;attrezzatura giusta?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scegli la tecnica</h3>
              <p className="text-gray-600 text-sm">
                Ogni tecnica richiede attrezzature specifiche. Lo spinning usa canne corte e artificiali, 
                il surfcasting canne lunghe per lanci dalla spiaggia.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Valuta il tuo livello</h3>
              <p className="text-gray-600 text-sm">
                Un principiante ha bisogno di attrezzatura robusta e versatile. Un esperto 
                può apprezzare equipaggiamento più tecnico.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rispetta il budget</h3>
              <p className="text-gray-600 text-sm">
                Non serve spendere una fortuna. L&apos;attrezzatura di fascia media offre 
                spesso il miglior rapporto qualità/prezzo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
