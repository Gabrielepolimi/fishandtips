import React from 'react';
import Breadcrumb from '../../components/articles/Breadcrumb';

export default function TerminiPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Termini di Servizio
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Le condizioni che regolano l'utilizzo del nostro sito web
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[
          { label: 'Termini di Servizio' }
        ]} />

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Accettazione dei Termini</h2>
            <p className="text-gray-700 mb-4">
              Utilizzando FishandTips.it ("il Sito"), accetti di essere vincolato da questi Termini di Servizio 
              ("Termini"). Se non accetti questi Termini, ti preghiamo di non utilizzare il nostro sito.
            </p>
            <p className="text-gray-700">
              Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. Le modifiche saranno 
              effettive immediatamente dopo la pubblicazione sul Sito.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrizione del Servizio</h2>
            <p className="text-gray-700 mb-4">
              FishandTips.it è un sito web dedicato alla pesca sportiva che fornisce:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Articoli informativi su tecniche di pesca</li>
              <li>Consigli e suggerimenti per pescatori</li>
              <li>Newsletter con contenuti personalizzati</li>
              <li>Comunità di appassionati di pesca</li>
              <li>Contenuti educativi e formativi</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilizzo Accettabile</h2>
            <p className="text-gray-700 mb-4">Ti impegni a utilizzare il Sito solo per scopi legittimi e in conformità con questi Termini. In particolare, ti impegni a:</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Utilizzare il Sito solo per scopi personali e non commerciali</li>
              <li>Non violare leggi o regolamenti applicabili</li>
              <li>Non danneggiare, disabilitare o compromettere il Sito</li>
              <li>Non tentare di accedere a aree riservate del Sito</li>
              <li>Non utilizzare robot, spider o altri dispositivi automatizzati</li>
              <li>Rispettare i diritti di proprietà intellettuale</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contenuti del Sito</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Proprietà Intellettuale</h3>
            <p className="text-gray-700 mb-4">
              Tutti i contenuti del Sito, inclusi testi, immagini, video, grafica, loghi e software, 
              sono di proprietà di FishandTips.it o dei suoi licenziatari e sono protetti dalle leggi 
              sulla proprietà intellettuale.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Licenza di Utilizzo</h3>
            <p className="text-gray-700 mb-4">
              Ti concediamo una licenza limitata, non esclusiva e revocabile per utilizzare il Sito 
              per scopi personali e non commerciali, soggetta a questi Termini.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Contenuti Utente</h3>
            <p className="text-gray-700 mb-4">
              Se invii contenuti al Sito (commenti, messaggi, ecc.), ci concedi una licenza non esclusiva 
              per utilizzare, riprodurre e distribuire tali contenuti.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Privacy e Dati Personali</h2>
            <p className="text-gray-700 mb-4">
              La raccolta e l'utilizzo dei tuoi dati personali sono regolati dalla nostra 
              <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline"> Privacy Policy</a>. 
              Utilizzando il Sito, accetti le pratiche descritte nella Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Newsletter e Comunicazioni</h2>
            <p className="text-gray-700 mb-4">
              Iscrivendoti alla nostra newsletter, accetti di ricevere comunicazioni email da FishandTips.it. 
              Puoi disiscriverti in qualsiasi momento utilizzando il link di disiscrizione presente in ogni email.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitazione di Responsabilità</h2>
            <p className="text-gray-700 mb-4">
              FishandTips.it fornisce informazioni a scopo educativo e informativo. Non garantiamo:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>L'accuratezza, completezza o tempestività delle informazioni</li>
              <li>Che il Sito sarà sempre disponibile o privo di errori</li>
              <li>Che i risultati della pesca saranno garantiti seguendo i nostri consigli</li>
              <li>Che il Sito sarà sicuro o privo di virus</li>
            </ul>
            <p className="text-gray-700">
              In nessun caso FishandTips.it sarà responsabile per danni diretti, indiretti, incidentali 
              o consequenziali derivanti dall'utilizzo del Sito.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sicurezza e Pesca Responsabile</h2>
            <p className="text-gray-700 mb-4">
              I contenuti del Sito promuovono la pesca responsabile e il rispetto dell'ambiente. 
              Ti incoraggiamo a:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Rispettare le normative locali sulla pesca</li>
              <li>Utilizzare attrezzature appropriate e sicure</li>
              <li>Praticare il catch and release quando appropriato</li>
              <li>Rispettare l'ambiente naturale</li>
              <li>Pescare solo in aree autorizzate</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Collegamenti a Terze Parti</h2>
            <p className="text-gray-700 mb-4">
              Il Sito può contenere collegamenti a siti web di terze parti. Non controlliamo e non siamo 
              responsabili per il contenuto, le politiche sulla privacy o le pratiche di tali siti.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Pubblicità e Affiliazioni</h2>
            <p className="text-gray-700 mb-4">
              FishandTips.it può contenere pubblicità e link di affiliazione. Potremmo ricevere commissioni 
              per acquisti effettuati attraverso questi link, ma questo non influisce sui nostri contenuti 
              o raccomandazioni.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Sospensione e Terminazione</h2>
            <p className="text-gray-700 mb-4">
              Ci riserviamo il diritto di sospendere o terminare l'accesso al Sito in qualsiasi momento, 
              con o senza preavviso, per qualsiasi motivo, incluso la violazione di questi Termini.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Legge Applicabile</h2>
            <p className="text-gray-700 mb-4">
              Questi Termini sono regolati e interpretati in conformità con le leggi italiane. 
              Qualsiasi controversia sarà soggetta alla giurisdizione esclusiva dei tribunali italiani.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Disposizioni Generali</h2>
            <p className="text-gray-700 mb-4">
              Se una disposizione di questi Termini è ritenuta invalida o inapplicabile, 
              le restanti disposizioni rimarranno in pieno vigore ed effetto.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contatti</h2>
            <p className="text-gray-700 mb-4">
              Per domande su questi Termini di Servizio, contattaci:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@fishandtips.it
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Indirizzo:</strong> FishandTips.it
              </p>
              <p className="text-gray-700">
                <strong>Responsabile legale:</strong> Team FishandTips
              </p>
            </div>
          </section>

          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Hai Domande sui Termini?
            </h3>
            <p className="text-secondary-700 mb-4">
              Se hai dubbi su questi Termini di Servizio o su come utilizzare il nostro sito, 
              non esitare a contattarci. Siamo qui per aiutarti.
            </p>
            <a 
              href="/contatti" 
              className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
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
