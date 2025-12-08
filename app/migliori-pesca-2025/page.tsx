'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

// Data di scadenza candidature (27 Dicembre 2024)
const DEADLINE = new Date('2024-12-27T23:59:59');

// Data pubblicazione classifica (4 Gennaio 2025)
const PUBLICATION_DATE = new Date('2025-01-04T10:00:00');

// Categorie
const categories = [
  {
    id: 'negozi',
    title: 'Negozi di Pesca',
    icon: '🏪',
    description: 'I migliori negozi online e fisici per attrezzatura da pesca',
    slots: 10,
    filled: 0,
  },
  {
    id: 'charter',
    title: 'Charter di Pesca',
    icon: '🚤',
    description: 'Le migliori imbarcazioni per uscite di pesca in Italia',
    slots: 10,
    filled: 0,
  },
  {
    id: 'scuole',
    title: 'Scuole di Pesca',
    icon: '🎓',
    description: 'I migliori corsi e istruttori per imparare a pescare',
    slots: 10,
    filled: 0,
  },
];

// Benefici per i selezionati
const benefits = [
  {
    icon: '🏅',
    title: 'Badge Ufficiale',
    description: 'Badge "Selezionato FishandTips 2025" da esporre sul vostro sito',
  },
  {
    icon: '📄',
    title: 'Scheda Dedicata',
    description: 'Pagina completa con descrizione, servizi, foto e link al vostro sito',
  },
  {
    icon: '🔗',
    title: 'Backlink Permanente',
    description: 'Link dofollow al vostro sito per migliorare il posizionamento SEO',
  },
  {
    icon: '🎤',
    title: 'Intervista Esclusiva',
    description: 'Articolo intervista al titolare per raccontare la vostra storia e filosofia',
  },
  {
    icon: '♾️',
    title: 'Visibilità Permanente',
    description: 'La scheda rimane online per sempre, non solo per il 2025',
  },
];

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      {[
        { value: timeLeft.days, label: 'Giorni' },
        { value: timeLeft.hours, label: 'Ore' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-5 min-w-[70px] md:min-w-[90px] border border-white/20">
            <span className="text-3xl md:text-5xl font-bold text-white tabular-nums">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-2 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function MiglioriPesca2025Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    attivita: '',
    categoria: '',
    email: '',
    sito: '',
    messaggio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/candidatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'invio');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'invio. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${nunito.className}`}>
      {/* Hero Section con Countdown */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium border border-yellow-500/30">
              <span className="animate-pulse">🔴</span>
              Candidature Aperte
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            🏆 I Migliori della Pesca
            <span className="block text-yellow-400 mt-2">2025</span>
          </h1>
          
          <p className="text-lg md:text-xl text-center text-white/80 max-w-2xl mx-auto mb-10">
            La selezione ufficiale FishandTips delle migliori realtà 
            della pesca sportiva in Italia
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <p className="text-center text-white/60 mb-2 text-sm">
              ⏰ Candidature entro il <strong className="text-yellow-400">27 Dicembre 2024</strong>
            </p>
            <p className="text-center text-white/80 mb-4 text-sm font-medium">
              📅 La classifica sarà pubblicata il <strong className="text-yellow-400">4 Gennaio 2025</strong>
            </p>
            <Countdown targetDate={PUBLICATION_DATE} />
            <p className="text-center text-white/50 mt-2 text-xs">
              Giorni alla pubblicazione
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="#candidati"
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105 text-center"
            >
              Candidati Ora
            </a>
            <a
              href="#categorie"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/20 text-center"
            >
              Scopri le Categorie
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">30</div>
              <div className="text-sm text-white/60">Posti Totali</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">3</div>
              <div className="text-sm text-white/60">Categorie</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">100%</div>
              <div className="text-sm text-white/60">Gratuito</div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Categorie Section */}
      <section id="categorie" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
            Le Categorie
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Selezioniamo solo <strong>10 realtà per categoria</strong> tra le migliori d'Italia.
            Posti limitati, candidature in ordine di arrivo.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border-2 border-slate-100 p-8 hover:border-primary-500 hover:shadow-xl transition-all group"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.title}</h3>
                <p className="text-slate-600 mb-6">{cat.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Posti disponibili</span>
                    <span className="font-semibold text-primary-600">
                      {cat.slots - cat.filled}/{cat.slots}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                      style={{ width: `${(cat.filled / cat.slots) * 100}%` }}
                    />
                  </div>
                </div>

                <a
                  href="#candidati"
                  onClick={() => setFormData(prev => ({ ...prev, categoria: cat.title }))}
                  className="block w-full text-center bg-slate-100 group-hover:bg-primary-600 text-slate-700 group-hover:text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Candidati →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
            Cosa Ottieni (Gratis)
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Essere selezionati significa ricevere visibilità e credibilità 
            completamente <strong>senza costi</strong>.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="candidati" className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
            Candidati Ora
          </h2>
          <p className="text-center text-slate-600 mb-10">
            Compila il form e ti contatteremo entro 48 ore per confermare la selezione.
          </p>

          {submitted ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Candidatura Inviata!
              </h3>
              <p className="text-green-700">
                Ti contatteremo entro 48 ore all'indirizzo email fornito.
                Controlla anche la cartella spam!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Il tuo nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome Attività *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.attivita}
                    onChange={(e) => setFormData(prev => ({ ...prev, attivita: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Pesca Shop Milano"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  >
                    <option value="">Seleziona categoria</option>
                    <option value="Negozi di Pesca">🏪 Negozi di Pesca</option>
                    <option value="Charter di Pesca">🚤 Charter di Pesca</option>
                    <option value="Scuole di Pesca">🎓 Scuole di Pesca</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="info@tuosito.it"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sito Web
                </label>
                <input
                  type="url"
                  value={formData.sito}
                  onChange={(e) => setFormData(prev => ({ ...prev, sito: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="https://www.tuosito.it"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Raccontaci la tua attività
                </label>
                <textarea
                  rows={4}
                  value={formData.messaggio}
                  onChange={(e) => setFormData(prev => ({ ...prev, messaggio: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  placeholder="Da quanti anni siete attivi? Quali sono i vostri punti di forza? Servite clienti in tutta Italia?"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Invio in corso...
                  </span>
                ) : (
                  'Invia Candidatura 🚀'
                )}
              </button>

              <p className="text-center text-sm text-slate-500">
                📧 Riceverai una risposta entro 48 ore. Nessun costo, nessun impegno.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Domande Frequenti
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Costa qualcosa essere selezionati?',
                a: 'No, la selezione e la pubblicazione sono completamente gratuite. Non chiediamo alcun pagamento.',
              },
              {
                q: 'Come vengono selezionate le attività?',
                a: 'Valutiamo la qualità dei servizi, le recensioni online, la professionalità e la presenza sul territorio. Non è necessario essere grandi per essere selezionati.',
              },
              {
                q: 'Cosa devo fare in cambio?',
                a: 'Nulla di obbligatorio. Se vorrete, potrete menzionarci nella vostra sezione "Dicono di noi" o condividere la scheda sui social. Ma non è un requisito.',
              },
              {
                q: 'Quanto rimane online la scheda?',
                a: 'Per sempre! Non è limitata al 2025. Una volta pubblicata, la scheda rimane permanentemente sul nostro sito.',
              },
              {
                q: 'Posso modificare la scheda dopo la pubblicazione?',
                a: 'Certamente! Potrai richiedere modifiche in qualsiasi momento inviandoci una email.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-xl border border-slate-200 group"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-slate-800 flex justify-between items-center">
                  {faq.q}
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 text-slate-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Non perdere questa opportunità
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Solo 30 posti disponibili. Candidature entro il <strong>27 Dicembre 2024</strong>.<br/>
            Classifica pubblicata il <strong>4 Gennaio 2025</strong>!
          </p>
          <a
            href="#candidati"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105"
          >
            Candidati Ora →
          </a>
        </div>
      </section>
    </div>
  );
}

