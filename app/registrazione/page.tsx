'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

const fishingTechniques = [
  'Spinning',
  'Bolognese',
  'Feeder',
  'Carp Fishing',
  'Fly Fishing',
  'Surf Casting',
  'Jigging',
  'Trolling',
  'Pesca a Mosca',
  'Pesca con il Galleggiante',
  'Pesca a Fondo',
  'Pesca con Esche Naturali',
  'Pesca con Esche Artificiali',
  'Pesca in Mare',
  'Pesca in Lago',
  'Pesca in Fiume'
];

export default function RegistrazionePage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    tecniche: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Errore durante la registrazione. Riprova.');
      }
    } catch (error) {
      alert('Errore durante la registrazione. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Grazie per esserti iscritto!
            </h1>
            <p className="text-gray-600 mb-6">
              Riceverai presto la tua prima newsletter personalizzata con contenuti 
              basati sulle tue tecniche di pesca preferite.
            </p>
            <Link href="/">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Torna alla Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="inline-flex items-center text-blue-100 hover:text-white mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Torna alla Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Iscriviti alla Newsletter
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Ricevi contenuti personalizzati basati sulle tue tecniche di pesca preferite
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome e Cognome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-2">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    id="cognome"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Il tuo cognome"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="La tua email"
                />
              </div>

              {/* Tecniche di Pesca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Tecniche di Pesca Preferite *
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fishingTechniques.map((technique) => (
                      <label key={technique} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tecniche.includes(technique)}
                          onChange={() => handleTechniqueToggle(technique)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{technique}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Seleziona almeno una tecnica per ricevere contenuti personalizzati
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || formData.tecniche.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Iscrizione in corso...' : 'Iscriviti alla Newsletter'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Puoi disiscriverti in qualsiasi momento dalla newsletter
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
