import React from 'react';
import Breadcrumb from '../../components/articles/Breadcrumb';

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[
          { label: 'Privacy Policy' }
        ]} />

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informazioni Generali</h2>
            <p className="text-gray-700 mb-4">
              FishandTips.it ("noi", "nostro", "sito") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. 
              Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo le informazioni che ci fornisci quando 
              visiti il nostro sito web.
            </p>
            <p className="text-gray-700">
              Utilizzando il nostro sito, accetti le pratiche descritte in questa Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dati che Raccogliamo</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Dati Forniti Volontariamente</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Informazioni di contatto:</strong> nome, email quando ti iscrivi alla newsletter o ci contatti</li>
              <li><strong>Contenuti:</strong> commenti, messaggi che invii attraverso il form di contatto</li>
              <li><strong>Preferenze:</strong> preferenze di pesca, interessi specifici</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Dati Raccolti Automaticamente</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, sistema operativo</li>
              <li><strong>Dati di navigazione:</strong> pagine visitate, tempo di permanenza, link cliccati</li>
              <li><strong>Cookie:</strong> piccoli file di testo per migliorare l'esperienza utente</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Come Utilizziamo i Tuoi Dati</h2>
            <p className="text-gray-700 mb-4">Utilizziamo i tuoi dati per:</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Fornire e migliorare i nostri servizi</li>
              <li>Inviare newsletter e contenuti personalizzati</li>
              <li>Rispondere alle tue richieste e domande</li>
              <li>Analizzare l'utilizzo del sito per migliorare l'esperienza</li>
              <li>Rispettare gli obblighi legali</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Condivisione dei Dati</h2>
            <p className="text-gray-700 mb-4">
              Non vendiamo, affittiamo o condividiamo i tuoi dati personali con terze parti, 
              eccetto nei seguenti casi:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Fornitori di servizi:</strong> per l'hosting, analytics, email marketing</li>
              <li><strong>Obblighi legali:</strong> quando richiesto dalla legge</li>
              <li><strong>Protezione:</strong> per proteggere i nostri diritti e la sicurezza</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookie e Tecnologie Simili</h2>
            <p className="text-gray-700 mb-4">
              Utilizziamo cookie e tecnologie simili per:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Migliorare l'esperienza di navigazione</li>
              <li>Analizzare il traffico del sito</li>
              <li>Personalizzare contenuti e pubblicità</li>
              <li>Ricordare le tue preferenze</li>
            </ul>
            <p className="text-gray-700">
              Puoi gestire le impostazioni dei cookie attraverso il tuo browser.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sicurezza dei Dati</h2>
            <p className="text-gray-700 mb-4">
              Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati personali:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Crittografia SSL per le trasmissioni</li>
              <li>Controlli di accesso rigorosi</li>
              <li>Monitoraggio continuo della sicurezza</li>
              <li>Backup regolari dei dati</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. I Tuoi Diritti</h2>
            <p className="text-gray-700 mb-4">Hai il diritto di:</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Accesso:</strong> richiedere copia dei tuoi dati personali</li>
              <li><strong>Rettifica:</strong> correggere dati inesatti o incompleti</li>
              <li><strong>Cancellazione:</strong> richiedere la cancellazione dei tuoi dati</li>
              <li><strong>Limitazione:</strong> limitare l'utilizzo dei tuoi dati</li>
              <li><strong>Portabilità:</strong> ricevere i tuoi dati in formato strutturato</li>
              <li><strong>Opposizione:</strong> opporti al trattamento dei tuoi dati</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conservazione dei Dati</h2>
            <p className="text-gray-700 mb-4">
              Conserviamo i tuoi dati personali solo per il tempo necessario a:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Fornire i nostri servizi</li>
              <li>Rispettare gli obblighi legali</li>
              <li>Risolvere controversie</li>
              <li>Applicare i nostri accordi</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Trasferimenti Internazionali</h2>
            <p className="text-gray-700 mb-4">
              I tuoi dati potrebbero essere trasferiti e processati in paesi diversi dal tuo. 
              Assicuriamo che tali trasferimenti avvengano in conformità con le leggi sulla privacy applicabili 
              e utilizzando adeguate misure di protezione.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Minori</h2>
            <p className="text-gray-700 mb-4">
              Il nostro sito non è destinato a minori di 16 anni. Non raccogliamo consapevolmente 
              dati personali da minori di 16 anni. Se sei un genitore e ritieni che tuo figlio 
              ci abbia fornito dati personali, contattaci immediatamente.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifiche alla Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              Potremmo aggiornare questa Privacy Policy di tanto in tanto. Ti notificheremo 
              eventuali modifiche significative pubblicando la nuova Privacy Policy su questa pagina 
              e aggiornando la data di "Ultimo aggiornamento".
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contatti</h2>
            <p className="text-gray-700 mb-4">
              Se hai domande su questa Privacy Policy o sul trattamento dei tuoi dati personali, 
              contattaci:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@fishandtips.it
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Indirizzo:</strong> FishandTips.it
              </p>
              <p className="text-gray-700">
                <strong>Responsabile della protezione dei dati:</strong> Team FishandTips
              </p>
            </div>
          </section>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Hai Domande sulla Privacy?
            </h3>
            <p className="text-primary-700 mb-4">
              Se hai dubbi su come trattiamo i tuoi dati, non esitare a contattarci. 
              Siamo qui per aiutarti e garantire la massima trasparenza.
            </p>
            <a 
              href="/contatti" 
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contattaci
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
