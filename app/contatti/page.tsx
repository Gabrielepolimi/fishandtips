'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Contatti</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contattaci
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Hai domande, suggerimenti o vuoi collaborare? Siamo qui per te.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Invia un messaggio
              </h2>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
                        placeholder="Il tuo nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
                        placeholder="email@esempio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="soggetto" className="block text-sm font-medium text-gray-700 mb-2">
                      Soggetto
                    </label>
                    <select
                      id="soggetto"
                      name="soggetto"
                      value={formData.soggetto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 transition-colors text-gray-900"
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
                      Messaggio
                    </label>
                    <textarea
                      id="messaggio"
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Scrivi il tuo messaggio..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Invio in corso...
                      </span>
                    ) : (
                      'Invia messaggio'
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Messaggio inviato!</h3>
                      <p className="text-gray-600">
                        Grazie per averci contattato. Ti risponderemo al più presto.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informazioni
              </h2>
              
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@fishandtips.it</p>
                    <p className="text-sm text-gray-500 mt-1">Rispondiamo entro 24 ore</p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Tempo di risposta</h3>
                    <p className="text-gray-600">Generalmente rispondiamo entro 24 ore lavorative</p>
                  </div>
                </div>

                {/* Newsletter CTA */}
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Resta aggiornato</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Iscriviti alla newsletter per ricevere i migliori consigli di pesca.
                  </p>
                  <Link 
                    href="/registrazione"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    Iscriviti gratis
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Domande frequenti
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Posso suggerire un argomento?
              </h3>
              <p className="text-sm text-gray-600">
                Certo! Siamo sempre aperti a suggerimenti per nuovi articoli e guide. 
                Scrivici usando il form qui sopra.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Collaborate con altri siti?
              </h3>
              <p className="text-sm text-gray-600">
                Sì, siamo aperti a collaborazioni con altri portali di pesca 
                e brand del settore. Contattaci per discuterne.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Come posso contribuire?
              </h3>
              <p className="text-sm text-gray-600">
                Se sei un pescatore esperto e vuoi condividere le tue conoscenze, 
                scrivici! Cerchiamo sempre nuovi contributor.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Ho una domanda tecnica
              </h3>
              <p className="text-sm text-gray-600">
                Per domande specifiche su tecniche o attrezzature, 
                inviaci un messaggio dettagliato e ti risponderemo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
