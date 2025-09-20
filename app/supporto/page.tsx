import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Supporto',
  description: 'Hai bisogno di aiuto? Contattaci per qualsiasi domanda su FishandTips, la newsletter o i contenuti di pesca.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SupportoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-brand-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Supporto</h1>
          <p className="text-xl text-white/90">
            Siamo qui per aiutarti! Trova risposte alle tue domande
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Domande Frequenti</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Come funziona la newsletter personalizzata?
              </h3>
              <p className="text-gray-600">
                La nostra newsletter ti invia contenuti personalizzati basati sulle tue tecniche di pesca preferite. 
                Quando ti iscrivi, selezioni le tecniche che ti interessano e riceverai articoli specifici per quelle tecniche.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Posso disiscrivermi dalla newsletter?
              </h3>
              <p className="text-gray-600">
                Sì, puoi disiscriverti in qualsiasi momento. Clicca su "Disiscriviti dalla Newsletter" nel footer 
                o visita direttamente la pagina di <Link href="/newsletter/unsubscribe" className="text-brand-blue hover:text-brand-blue-dark">disiscrizione</Link>.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Con che frequenza pubblicate nuovi articoli?
              </h3>
              <p className="text-gray-600">
                Pubblichiamo nuovi articoli regolarmente, con contenuti freschi ogni settimana. 
                La newsletter ti aggiornerà sui nuovi contenuti disponibili.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Posso suggerire argomenti per nuovi articoli?
              </h3>
              <p className="text-gray-600">
                Assolutamente! Siamo sempre aperti a suggerimenti. Contattaci tramite la pagina 
                <Link href="/contatti" className="text-brand-blue hover:text-brand-blue-dark"> Contatti</Link> e condividi le tue idee.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                I contenuti sono gratuiti?
              </h3>
              <p className="text-gray-600">
                Sì, tutti i nostri contenuti sono completamente gratuiti. Non ci sono abbonamenti 
                o contenuti a pagamento.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Contattaci</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hai una domanda specifica?</h3>
              <p className="text-gray-600 mb-4">
                Non hai trovato la risposta che cercavi? Contattaci direttamente e ti risponderemo il prima possibile.
              </p>
              <Link href="/contatti">
                <button className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-brand-blue-light transition-colors">
                  Contattaci
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Problemi tecnici?</h3>
              <p className="text-gray-600 mb-4">
                Stai riscontrando problemi con il sito o la newsletter? Faccelo sapere e lo risolveremo.
              </p>
              <Link href="/contatti">
                <button className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-brand-blue-light transition-colors">
                  Segnala Problema
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Link Utili</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mappa del Sito</h3>
              <p className="text-gray-600 mb-4">
                Naviga facilmente tra tutti i contenuti
              </p>
              <Link href="/mappa-del-sito">
                <button className="text-brand-blue hover:text-brand-blue-dark font-medium">
                  Vai alla Mappa →
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Iscriviti per contenuti personalizzati
              </p>
              <Link href="/registrazione">
                <button className="text-brand-blue hover:text-brand-blue-dark font-medium">
                  Iscriviti Ora →
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Chi Siamo</h3>
              <p className="text-gray-600 mb-4">
                Scopri di più su FishandTips
              </p>
              <Link href="/chi-siamo">
                <button className="text-brand-blue hover:text-brand-blue-dark font-medium">
                  Conosci il Team →
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}









