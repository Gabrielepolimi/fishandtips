'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const WATER_TYPES = [
  { id: 'mare', label: 'Mare', icon: '🌊', description: 'Surfcasting, spinning costiero, bolentino' },
  { id: 'lago', label: 'Lago', icon: '🏞️', description: 'Trota, carpa, persico, luccio' },
  { id: 'fiume', label: 'Fiume', icon: '🌊', description: 'Spinning, mosca, ledgering' },
];

const REGIONS = [
  'Lombardia', 'Piemonte', 'Veneto', 'Emilia-Romagna', 'Toscana',
  'Lazio', 'Campania', 'Puglia', 'Sicilia', 'Sardegna',
  'Liguria', 'Friuli-Venezia Giulia', 'Trentino-Alto Adige', 'Calabria',
  'Marche', 'Abruzzo', 'Umbria', 'Basilicata', 'Molise', "Valle d'Aosta"
];

const TECHNIQUES = [
  'Spinning', 'Surfcasting', 'Bolognese', 'Feeder', 'Carp Fishing',
  'Eging', 'Jigging', 'Traina', 'Pesca a Mosca', 'Pesca a Fondo',
  'Light Rock Fishing', 'Shore Jigging', 'Vertical Jigging', 'Slow Pitch'
];

export default function RegistrazionePage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    tipiAcqua: [] as string[],
    regioni: [] as string[],
    tecniche: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showRegions, setShowRegions] = useState(false);
  const [showTechniques, setShowTechniques] = useState(false);

  const handleWaterTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      tipiAcqua: prev.tipiAcqua.includes(type)
        ? prev.tipiAcqua.filter(t => t !== type)
        : [...prev.tipiAcqua, type]
    }));
  };

  const handleRegionToggle = (region: string) => {
    setFormData(prev => ({
      ...prev,
      regioni: prev.regioni.includes(region)
        ? prev.regioni.filter(r => r !== region)
        : [...prev.regioni, region]
    }));
  };

  const handleTechniqueToggle = (technique: string) => {
    setFormData(prev => ({
      ...prev,
      tecniche: prev.tecniche.includes(technique)
        ? prev.tecniche.filter(t => t !== technique)
        : [...prev.tecniche, technique]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'iscrizione');
      }
      
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Errore durante la registrazione. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Benvenuto nella community! 🎣
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Grazie <span className="font-medium">{formData.nome} {formData.cognome}</span>, sei dei nostri!
            </p>
            <p className="text-gray-500 mb-8">
              Ti invieremo contenuti personalizzati su: <br/>
              <span className="font-medium text-gray-700">
                {formData.tipiAcqua.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
              </span>
              {formData.regioni.length > 0 && (
                <span> nelle zone di <span className="font-medium text-gray-700">{formData.regioni.slice(0, 3).join(', ')}{formData.regioni.length > 3 ? '...' : ''}</span></span>
              )}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/" className="block w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors">
              Esplora gli articoli
            </Link>
            <Link href="/spot-pesca-italia" className="block w-full py-4 px-6 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl transition-colors">
              Scopri gli spot di pesca
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna alla Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column - Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
              Ricevi solo i contenuti che ti interessano
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Dicci dove peschi e quali tecniche preferisci. Ti manderemo solo articoli, 
              spot e consigli su misura per te.
            </p>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">100% Personalizzato</h3>
                  <p className="text-gray-600">Solo contenuti basati sui tuoi interessi, mai spam generico.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Spot nella tua zona</h3>
                  <p className="text-gray-600">Scopri i migliori luoghi di pesca nelle regioni che frequenti.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1 email a settimana</h3>
                  <p className="text-gray-600">Niente flood, solo il meglio dei nostri contenuti.</p>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="mt-10 pt-10 border-t border-gray-100">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                I tuoi dati sono al sicuro. Puoi disiscriverti in qualsiasi momento.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nome e Cognome */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                      placeholder="Mario"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cognome
                    </label>
                    <input
                      type="text"
                      value={formData.cognome}
                      onChange={(e) => setFormData({...formData, cognome: e.target.value})}
                      required
                      placeholder="Rossi"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    La tua email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="email@esempio.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Water Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dove peschi di solito? *
                  </label>
                  <div className="space-y-3">
                    {WATER_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleWaterTypeToggle(type.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          formData.tipiAcqua.includes(type.id)
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                          {formData.tipiAcqua.includes(type.id) && (
                            <svg className="w-5 h-5 text-gray-900 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowRegions(!showRegions)}
                    className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {formData.regioni.length > 0 
                          ? `${formData.regioni.length} ${formData.regioni.length === 1 ? 'regione' : 'regioni'}`
                          : 'Seleziona le regioni'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {formData.regioni.length > 0 
                          ? formData.regioni.slice(0, 2).join(', ') + (formData.regioni.length > 2 ? '...' : '')
                          : 'Per ricevere spot e info locali'
                        }
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${showRegions ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showRegions && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {REGIONS.map((region) => (
                          <button
                            key={region}
                            type="button"
                            onClick={() => handleRegionToggle(region)}
                            className={`px-3 py-2 text-sm rounded-lg transition-all text-left ${
                              formData.regioni.includes(region)
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Techniques */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTechniques(!showTechniques)}
                    className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {formData.tecniche.length > 0 
                          ? `${formData.tecniche.length} ${formData.tecniche.length === 1 ? 'tecnica' : 'tecniche'}`
                          : 'Tecniche preferite (opzionale)'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {formData.tecniche.length > 0 
                          ? formData.tecniche.slice(0, 2).join(', ') + (formData.tecniche.length > 2 ? '...' : '')
                          : 'Per contenuti ancora più mirati'
                        }
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${showTechniques ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showTechniques && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                      <div className="flex flex-wrap gap-2">
                        {TECHNIQUES.map((technique) => (
                          <button
                            key={technique}
                            type="button"
                            onClick={() => handleTechniqueToggle(technique)}
                            className={`px-4 py-2 text-sm rounded-full transition-all ${
                              formData.tecniche.includes(technique)
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {technique}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || formData.tipiAcqua.length === 0}
                  className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Iscrizione in corso...
                    </span>
                  ) : (
                    'Iscriviti gratis'
                  )}
                </button>

                {/* Privacy */}
                <p className="text-center text-xs text-gray-500">
                  Iscrivendoti accetti la nostra{' '}
                  <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
