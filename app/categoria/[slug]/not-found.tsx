import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="text-6xl mb-4">🎣</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Categoria non trovata
        </h1>
        <p className="text-gray-600 mb-8">
          La categoria che stai cercando non esiste o non ha ancora articoli.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Torna alla Home
            </button>
          </Link>
          <Link href="/articoli">
            <button className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Vedi tutti gli articoli
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
