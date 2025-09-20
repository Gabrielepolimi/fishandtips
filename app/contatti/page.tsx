'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Breadcrumb from '../../components/articles/Breadcrumb';
import Button from '../../components/ui/Button';

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    soggetto: '',
    messaggio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ nome: '', email: '', soggetto: '', messaggio: '' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/fotocontatti.jpg"
            alt="Contatti background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Overlay per leggibilità del testo */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contattaci
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8">
            Hai domande, suggerimenti o vuoi collaborare? Siamo qui per te!
          </p>
          
          {/* Aggiunta di contenuto ricco per SEO */}
          <div className="max-w-3xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Il Nostro Team di Esperti
              </h2>
              <p className="text-lg text-white/90 mb-4">
                Il team di FishandTips è composto da pescatori esperti con decenni di esperienza sul campo. 
                Siamo appassionati di pesca sportiva e condividiamo la nostra conoscenza attraverso articoli 
                dettagliati, guide pratiche e consigli personalizzati.
              </p>
              <p className="text-lg text-white/90 mb-4">
                Ogni membro del nostro team ha una specializzazione specifica: dalla pesca a spinning alla 
                bolognese, dal surfcasting alla pesca a mosca. Questa diversità ci permette di offrire 
                contenuti completi e approfonditi per ogni tecnica di pesca.
              </p>
              <p className="text-lg text-white/90">
                Non esitare a contattarci per qualsiasi domanda, dubbio o suggerimento. Siamo sempre felici 
                di aiutare altri appassionati a migliorare le proprie tecniche e a vivere al meglio la 
                passione per la pesca sportiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[
          { label: 'Contatti' }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Invia un Messaggio</h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <div>
                  <label htmlFor="soggetto" className="block text-sm font-medium text-gray-700 mb-2">
                    Soggetto *
                  </label>
                  <select
                    id="soggetto"
                    name="soggetto"
                    value={formData.soggetto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleziona un soggetto</option>
                    <option value="domanda">Domanda sulla pesca</option>
                    <option value="suggerimento">Suggerimento</option>
                    <option value="collaborazione">Collaborazione</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-gray-700 mb-2">
                    Messaggio *
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    value={formData.messaggio}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Scrivi il tuo messaggio..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                </Button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Messaggio Inviato!</h3>
                    <p className="text-green-700">Ti risponderemo al più presto.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Informazioni di Contatto</h2>
            
            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@fishandtips.it</p>
                  <p className="text-sm text-gray-500">Rispondiamo entro 24 ore</p>
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Newsletter</h3>
                  <p className="text-gray-600 mb-3">Ricevi i migliori consigli di pesca</p>
                  <Button variant="outline" size="sm">
                    Iscriviti
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
