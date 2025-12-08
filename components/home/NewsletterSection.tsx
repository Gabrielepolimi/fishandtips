'use client';

import React, { useState } from 'react';

const WATER_TYPES = [
  { id: 'mare', label: 'Mare', icon: '🌊' },
  { id: 'lago', label: 'Lago', icon: '🏞️' },
  { id: 'fiume', label: 'Fiume', icon: '🏞️' },
];

const REGIONS = [
  'Lombardia', 'Piemonte', 'Veneto', 'Emilia-Romagna', 'Toscana',
  'Lazio', 'Campania', 'Puglia', 'Sicilia', 'Sardegna',
  'Liguria', 'Friuli-Venezia Giulia', 'Trentino-Alto Adige', 'Calabria',
  'Marche', 'Abruzzo', 'Umbria', 'Basilicata', 'Molise', "Valle d'Aosta"
];

const TECHNIQUES = [
  'Spinning', 'Surfcasting', 'Bolognese', 'Feeder', 'Carp Fishing',
  'Eging', 'Jigging', 'Traina', 'Pesca a Mosca', 'Pesca a Fondo'
];

export default function NewsletterSection() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    tipiAcqua: [] as string[],
    regioni: [] as string[],
    tecniche: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      setError(error.message || 'Errore durante l\'iscrizione');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Sei dei nostri! 🎣</h3>
            <p className="text-gray-600">
              Ti invieremo solo contenuti su misura per te: {formData.tipiAcqua.join(', ')} 
              {formData.regioni.length > 0 && ` nelle zone ${formData.regioni.slice(0, 3).join(', ')}`}.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Ricevi solo quello che ti interessa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dicci dove peschi e cosa ti appassiona. Ti manderemo solo consigli, spot e tecniche 
            su misura per te. Zero spam, solo valore.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Nome e Cognome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Water Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dove peschi di solito?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {WATER_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleWaterTypeToggle(type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      formData.tipiAcqua.includes(type.id)
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Regions Selection */}
            <div>
              <button
                type="button"
                onClick={() => setShowRegions(!showRegions)}
                className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {formData.regioni.length > 0 
                      ? `${formData.regioni.length} ${formData.regioni.length === 1 ? 'regione selezionata' : 'regioni selezionate'}`
                      : 'In quali regioni peschi?'
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {formData.regioni.length > 0 
                      ? formData.regioni.slice(0, 3).join(', ') + (formData.regioni.length > 3 ? '...' : '')
                      : 'Così ti segnaliamo gli spot migliori vicino a te'
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
                <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleRegionToggle(region)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
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

            {/* Techniques Selection */}
            <div>
              <button
                type="button"
                onClick={() => setShowTechniques(!showTechniques)}
                className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {formData.tecniche.length > 0 
                      ? `${formData.tecniche.length} ${formData.tecniche.length === 1 ? 'tecnica selezionata' : 'tecniche selezionate'}`
                      : 'Quali tecniche ti interessano?'
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {formData.tecniche.length > 0 
                      ? formData.tecniche.slice(0, 3).join(', ') + (formData.tecniche.length > 3 ? '...' : '')
                      : 'Opzionale - Per contenuti ancora più mirati'
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

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
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

            {/* Privacy Note */}
            <p className="text-center text-xs text-gray-500">
              Iscrivendoti accetti la nostra{' '}
              <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>.
              Niente spam, solo contenuti utili. Puoi disiscriverti quando vuoi.
            </p>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Dati protetti</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span>Zero spam</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>1 email a settimana</span>
          </div>
        </div>
      </div>
    </section>
  );
}
