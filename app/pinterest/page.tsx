import { Metadata } from 'next';
import Link from 'next/link';
import pinsData from '../../data/pinterest-pins.json';

export const metadata: Metadata = {
  title: 'Pinterest | FishandTips - Pin di Pesca Sportiva',
  description: 'Scopri i nostri pin Pinterest dedicati alla pesca sportiva: tecniche, spot, attrezzature e consigli per pescatori italiani.',
  keywords: 'pinterest pesca, pin pesca sportiva, pesca italia pinterest, fishing pins',
  openGraph: {
    title: 'Pinterest | FishandTips',
    description: 'Pin di pesca sportiva: tecniche, spot e consigli',
    type: 'website',
  },
  alternates: {
    types: {
      'application/rss+xml': '/pinterest/feed.xml',
    },
  },
};

export default function PinterestPage() {
  const pins = pinsData.pins.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const categories = [
    { id: 'all', name: 'Tutti', emoji: '📌' },
    { id: 'tecniche-di-pesca', name: 'Tecniche', emoji: '🎣' },
    { id: 'attrezzature', name: 'Attrezzatura', emoji: '🎒' },
    { id: 'spot', name: 'Spot', emoji: '📍' },
    { id: 'pesci', name: 'Pesci', emoji: '🐟' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-500 to-red-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold">
              I Nostri Pin
            </h1>
          </div>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
            Contenuti di pesca sportiva ottimizzati per Pinterest. 
            Salvali nelle tue bacheche!
          </p>
          
          {/* Pinterest Follow Button */}
          <a 
            href="https://pinterest.it/fishandtipsit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            Seguici su Pinterest
          </a>
        </div>
      </section>

      {/* RSS Feed Notice */}
      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-2 text-sm text-red-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span>Feed RSS disponibile:</span>
          <a href="/pinterest/feed.xml" className="underline font-medium">
            /pinterest/feed.xml
          </a>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{pins.length}</div>
              <div className="text-sm text-gray-600">Pin totali</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Bacheche</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">🎣</div>
              <div className="text-sm text-gray-600">Tema: Pesca</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">📅</div>
              <div className="text-sm text-gray-600">Aggiornato ogni giorno</div>
            </div>
          </div>

          {/* Pins Grid - Pinterest Style */}
          {pins.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {pins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nessun pin ancora
              </h3>
              <p className="text-gray-600">
                I pin verranno generati automaticamente dai nostri articoli.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vuoi vedere altri contenuti?
          </h2>
          <p className="text-gray-600 mb-8">
            Esplora i nostri articoli completi sul sito o seguici su Pinterest per non perdere nessun aggiornamento.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/articoli"
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Leggi gli articoli
            </Link>
            <a 
              href="https://pinterest.it/fishandtipsit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Seguici su Pinterest
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// Pin Card Component
function PinCard({ pin }: { pin: typeof pinsData.pins[0] }) {
  return (
    <div className="break-inside-avoid mb-4">
      <a 
        href={pin.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
          {/* Image */}
          <div className="relative aspect-[2/3] bg-gray-100">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white px-4 py-2 rounded-full font-medium">
                Leggi articolo
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {pin.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {pin.description.split('\n\n')[0]}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                {pin.board}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

