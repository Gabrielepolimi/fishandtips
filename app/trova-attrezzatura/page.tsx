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
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'surfcasting' as Technique,
    name: 'Surfcasting',
    icon: '🌊',
    description: 'Pesca dalla spiaggia con esche naturali a lunga distanza',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'bolognese' as Technique,
    name: 'Bolognese',
    icon: '🪨',
    description: 'Pesca con galleggiante dalla scogliera o dal porto',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'eging' as Technique,
    name: 'Eging',
    icon: '🦑',
    description: 'Pesca a seppie e calamari con totanare',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'feeder' as Technique,
    name: 'Feeder',
    icon: '🐟',
    description: 'Pesca con pasturatore per carpe, carassi e pesci di fondo',
    color: 'from-rose-500 to-red-500',
  },
];

const experiences = [
  {
    id: 'beginner' as Experience,
    name: 'Principiante',
    icon: '🌱',
    description: 'Ho iniziato da poco o voglio provare questa tecnica',
  },
  {
    id: 'intermediate' as Experience,
    name: 'Intermedio',
    icon: '💪',
    description: 'Ho già esperienza e cerco un upgrade',
  },
];

const budgets = [
  {
    id: 'budget_low' as Budget,
    name: 'Economico',
    range: 'Sotto €150',
    icon: '💰',
    description: 'Attrezzatura base ma funzionale',
  },
  {
    id: 'budget_medium' as Budget,
    name: 'Medio',
    range: '€150 - €300',
    icon: '💰💰',
    description: 'Ottimo rapporto qualità/prezzo',
  },
  {
    id: 'budget_high' as Budget,
    name: 'Premium',
    range: 'Oltre €300',
    icon: '💰💰💰',
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
    setTimeout(() => setStep(2), 300);
  };

  const handleExperienceSelect = (exp: Experience) => {
    setExperience(exp);
    setTimeout(() => setStep(3), 300);
  };

  const handleBudgetSelect = (bud: Budget) => {
    setBudget(bud);
    setTimeout(() => {
      setShowResults(true);
      setStep(4);
    }, 300);
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

      // Per bolognese/eging/feeder, se selezioni intermediate ma non esiste, usa beginner
      let experienceProducts = techniqueProducts[experience];
      if (!experienceProducts && experience === 'intermediate') {
        experienceProducts = techniqueProducts['beginner'];
      }
      if (!experienceProducts) return null;

      const budgetProducts = experienceProducts[budget];
      if (!budgetProducts) {
        // Fallback al budget più vicino
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
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🎣 Trova la Tua Attrezzatura Ideale
          </h1>
          <p className="text-cyan-100 text-lg">
            Rispondi a 3 semplici domande e ti consigliamo l&apos;attrezzatura perfetta per te
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                step >= s
                  ? 'bg-cyan-500 text-white scale-110'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {s === 4 ? '✓' : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Tecnica</span>
          <span>Esperienza</span>
          <span>Budget</span>
          <span>Risultati</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Step 1: Technique Selection */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Che tecnica di pesca vuoi praticare?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techniques.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleTechniqueSelect(tech.id)}
                  className={`group p-6 rounded-2xl bg-slate-800/50 border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 text-left ${
                    technique === tech.id ? 'border-cyan-500 bg-cyan-500/10' : ''
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
                  <p className="text-slate-400 text-sm">{tech.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Experience Selection */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <button
              onClick={() => setStep(1)}
              className="text-cyan-400 hover:text-cyan-300 mb-6 flex items-center gap-2"
            >
              ← Torna indietro
            </button>
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Qual è il tuo livello di esperienza?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleExperienceSelect(exp.id)}
                  className={`group p-8 rounded-2xl bg-slate-800/50 border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 text-left ${
                    experience === exp.id ? 'border-cyan-500 bg-cyan-500/10' : ''
                  }`}
                >
                  <div className="text-5xl mb-4">{exp.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.name}</h3>
                  <p className="text-slate-400">{exp.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget Selection */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <button
              onClick={() => setStep(2)}
              className="text-cyan-400 hover:text-cyan-300 mb-6 flex items-center gap-2"
            >
              ← Torna indietro
            </button>
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Qual è il tuo budget?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgets.map((bud) => (
                <button
                  key={bud.id}
                  onClick={() => handleBudgetSelect(bud.id)}
                  className={`group p-6 rounded-2xl bg-slate-800/50 border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 text-left ${
                    budget === bud.id ? 'border-cyan-500 bg-cyan-500/10' : ''
                  }`}
                >
                  <div className="text-3xl mb-3">{bud.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{bud.name}</h3>
                  <p className="text-cyan-400 font-semibold mb-2">{bud.range}</p>
                  <p className="text-slate-400 text-sm">{bud.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && showResults && products && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-full text-green-400 mb-4">
                ✓ Ecco la tua attrezzatura consigliata!
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Kit {techniques.find(t => t.id === technique)?.name} - {experiences.find(e => e.id === experience)?.name}
              </h2>
              <p className="text-slate-400">
                Budget: {budgets.find(b => b.id === budget)?.range}
              </p>
            </div>

            {/* Products Grid */}
            <div className="space-y-4 mb-8">
              {Object.entries(products).map(([key, product]) => {
                if (!product || typeof product !== 'object' || !('name' in product)) return null;
                const p = product as Product;
                const categoryLabels: Record<string, string> = {
                  canna: '🎣 Canna',
                  mulinello: '⚙️ Mulinello',
                  filo: '🧵 Filo',
                  artificiali: '🎯 Artificiali',
                  accessori: '🎒 Accessori',
                  totanare: '🦑 Totanare',
                };

                return (
                  <div
                    key={key}
                    className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-sm text-cyan-400 font-medium">
                          {categoryLabels[key] || key}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{p.description}</p>
                        <p className="text-slate-500 text-xs mt-2 font-mono">{p.specs}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">€{p.price.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">{p.brand}</p>
                        </div>
                        <a
                          href={p.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30 whitespace-nowrap"
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
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">Totale stimato kit completo</p>
                  <p className="text-3xl font-bold text-white">
                    €{calculateTotalPrice(products).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">I prezzi possono variare</p>
                  <p className="text-sm text-cyan-400">Aggiornato a {quizProducts.metadata.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
              >
                🔄 Ricomincia il Quiz
              </button>
              <Link
                href="/articoli"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-lg transition-all text-center"
              >
                📚 Leggi le nostre Guide
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-slate-500 text-sm mt-8">
              * I link Amazon sono affiliati. Acquistando attraverso questi link ci aiuti a mantenere il sito gratuito!
            </p>
          </div>
        )}

        {/* No Results Fallback */}
        {step === 4 && showResults && !products && (
          <div className="text-center py-12">
            <p className="text-2xl mb-4">😅</p>
            <h3 className="text-xl font-bold text-white mb-2">
              Ops! Non abbiamo trovato prodotti per questa combinazione
            </h3>
            <p className="text-slate-400 mb-6">
              Prova con un&apos;altra tecnica o budget
            </p>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-all"
            >
              Ricomincia il Quiz
            </button>
          </div>
        )}
      </div>

      {/* SEO Content */}
      <section className="bg-slate-800/50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Come scegliere l&apos;attrezzatura da pesca giusta?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-slate-300">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">🎯 Scegli la tecnica</h3>
              <p className="text-sm">
                Ogni tecnica di pesca richiede attrezzature specifiche. Lo spinning usa canne corte e artificiali, 
                il surfcasting canne lunghe per lanci dalla spiaggia.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">💪 Valuta il tuo livello</h3>
              <p className="text-sm">
                Un principiante ha bisogno di attrezzatura robusta e versatile. Un pescatore esperto 
                può apprezzare equipaggiamento più tecnico e specializzato.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2">💰 Rispetta il budget</h3>
              <p className="text-sm">
                Non serve spendere una fortuna per iniziare. Attrezzatura di fascia media offre 
                spesso il miglior rapporto qualità/prezzo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </main>
  );
}

