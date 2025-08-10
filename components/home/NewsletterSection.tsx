'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

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

export default function NewsletterSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    tecniche: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'iscrizione');
      }
      
      setIsSubmitted(true);
      setFormData({ nome: '', cognome: '', email: '', tecniche: [] });
    } catch (error: any) {
      setError(error.message || 'Errore durante l\'iscrizione');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-brand-blue to-brand-blue-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Non Perdere i Consigli degli Esperti
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Iscriviti alla newsletter e ricevi settimanalmente tecniche, consigli e segreti 
            per diventare un pescatore sempre più esperto.
          </p>

          {isSubmitted ? (
            <div className="max-w-md mx-auto">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Iscrizione Completata!</h3>
                <p className="text-green-100">
                  Grazie per esserti iscritto! Riceverai presto la tua prima newsletter personalizzata.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              {/* Nome e Cognome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome"
                  className="px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                />
                <input
                  type="text"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  required
                  placeholder="Cognome"
                  className="px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
              />

              {/* Tecniche di Pesca */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Tecniche di Pesca Preferite *
                </label>
                <div className="max-h-32 overflow-y-auto border border-white/20 rounded-lg p-4 bg-white/10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fishingTechniques.map((technique) => (
                      <label key={technique} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tecniche.includes(technique)}
                          onChange={() => handleTechniqueToggle(technique)}
                          className="w-4 h-4 text-brand-yellow border-white/30 rounded focus:ring-brand-yellow bg-white/10"
                        />
                        <span className="text-sm text-white">{technique}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isSubmitting || formData.tecniche.length === 0}
                className="px-8 py-3 w-full md:w-auto"
              >
                {isSubmitting ? 'Iscrizione in corso...' : 'Iscriviti alla Newsletter'}
              </Button>
              
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
            </form>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-white/90">
              <div className="text-2xl font-bold text-brand-yellow mb-2">🎣</div>
              <h3 className="font-semibold mb-1">Tecniche Esclusive</h3>
              <p className="text-sm">Consigli che non trovi da nessun'altra parte</p>
            </div>
            <div className="text-white/90">
              <div className="text-2xl font-bold text-brand-yellow mb-2">📅</div>
              <h3 className="font-semibold mb-1">Settimanale</h3>
              <p className="text-sm">Contenuti freschi ogni settimana</p>
            </div>
            <div className="text-white/90">
              <div className="text-2xl font-bold text-brand-yellow mb-2">🎁</div>
              <h3 className="font-semibold mb-1">Gratuito</h3>
              <p className="text-sm">Sempre gratis, senza spam</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
