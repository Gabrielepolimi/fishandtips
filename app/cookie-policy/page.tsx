import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informazioni sui cookie utilizzati da FishandTips e su come gestirli.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-brand-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-white/90">
            Come utilizziamo i cookie su FishandTips
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <h2>Cosa sono i Cookie?</h2>
            <p>
              I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. 
              Questi file contengono informazioni che aiutano il sito a funzionare correttamente e a migliorare la tua esperienza.
            </p>

            <h2>Come utilizziamo i Cookie</h2>
            <p>
              FishandTips utilizza i cookie per:
            </p>
            <ul>
              <li><strong>Cookie Tecnici:</strong> Essenziali per il funzionamento del sito</li>
              <li><strong>Cookie di Preferenze:</strong> Per ricordare le tue scelte (es. tecniche di pesca preferite)</li>
              <li><strong>Cookie Analitici:</strong> Per analizzare il traffico e migliorare il sito</li>
              <li><strong>Cookie di Marketing:</strong> Per mostrare contenuti personalizzati</li>
            </ul>

            <h2>Tipi di Cookie che Utilizziamo</h2>
            
            <h3>Cookie Essenziali</h3>
            <p>
              Questi cookie sono necessari per il funzionamento del sito e non possono essere disabilitati:
            </p>
            <ul>
              <li>Cookie di sessione per mantenere attivo il tuo login</li>
              <li>Cookie di sicurezza per proteggere i dati</li>
              <li>Cookie di preferenze per la newsletter</li>
            </ul>

            <h3>Cookie Analitici</h3>
            <p>
              Utilizziamo Google Analytics per comprendere come i visitatori utilizzano il nostro sito:
            </p>
            <ul>
              <li>Numero di visitatori</li>
              <li>Pagine più visitate</li>
              <li>Tempo di permanenza</li>
              <li>Fonte del traffico</li>
            </ul>

            <h3>Cookie di Preferenze</h3>
            <p>
              Questi cookie ricordano le tue scelte per migliorare la tua esperienza:
            </p>
            <ul>
              <li>Preferenze per la newsletter</li>
              <li>Tecniche di pesca di interesse</li>
              <li>Impostazioni di visualizzazione</li>
            </ul>

            <h2>Come Gestire i Cookie</h2>
            <p>
              Puoi controllare e gestire i cookie attraverso le impostazioni del tuo browser:
            </p>
            <ul>
              <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
              <li><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie</li>
              <li><strong>Safari:</strong> Preferenze → Privacy → Cookie</li>
              <li><strong>Edge:</strong> Impostazioni → Cookie e permessi sito</li>
            </ul>

            <h2>Cookie di Terze Parti</h2>
            <p>
              Utilizziamo servizi di terze parti che potrebbero impostare cookie:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Per analisi del traffico</li>
              <li><strong>Sanity.io:</strong> Per la gestione dei contenuti</li>
              <li><strong>Resend:</strong> Per l'invio delle newsletter</li>
            </ul>

            <h2>Aggiornamenti alla Cookie Policy</h2>
            <p>
              Questa cookie policy può essere aggiornata periodicamente. Ti informeremo di eventuali modifiche 
              significative attraverso il nostro sito o la newsletter.
            </p>

            <h2>Contattaci</h2>
            <p>
              Se hai domande sui cookie o su questa policy, non esitare a contattarci:
            </p>
            <ul>
              <li>Email: info@fishandtips.it</li>
              <li>Pagina contatti: <a href="/contatti" className="text-brand-blue hover:text-brand-blue-dark">/contatti</a></li>
            </ul>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







