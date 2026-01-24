import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Linea editoriale - FishandTips',
  description: 'Come selezioniamo gli argomenti, indipendenza editoriale, assenza di sponsorship occulte e aggiornamento continuo dei contenuti.',
  alternates: {
    canonical: 'https://fishandtips.it/editorial-policy',
  },
};

export default function EditorialPolicyPage() {
  const items = [
    {
      title: 'Selezione argomenti',
      body: 'Scegliamo i temi dalle domande reali dei pescatori e dai dati di ricerca. Priorità a guide pratiche, problemi ricorrenti e aggiornamenti stagionali.',
    },
    {
      title: 'Indipendenza',
      body: 'Non accettiamo sponsorizzazioni occulte. I contenuti non sono influenzati da brand o pagamenti. Se ci sono partnership, le dichiariamo in modo esplicito.',
    },
    {
      title: 'Autori e competenza',
      body: 'Le guide sono scritte da pescatori appassionati e riviste editorialmente per chiarezza, precisione e utilità.',
    },
    {
      title: 'Aggiornamenti e correzioni',
      body: 'Rivediamo periodicamente le guide (stagioni, regolamenti, attrezzatura). Se cambia qualcosa di rilevante, lo indichiamo nell’articolo.',
    },
    {
      title: 'Prodotti e link',
      body: 'Quando citiamo prodotti o spot, lo facciamo perché li riteniamo utili. I link esterni non influenzano le nostre valutazioni.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Linea editoriale</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Linea editoriale
            </h1>
            <p className="text-lg text-gray-700">
              Trasparenza, indipendenza e utilità pratica per i pescatori.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {items.map((item) => (
            <div key={item.title} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-700 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
