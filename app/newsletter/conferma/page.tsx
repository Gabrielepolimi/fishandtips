import React from 'react';
import Link from 'next/link';
import Button from '../../../components/ui/Button';

export default function NewsletterConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Iscrizione Completata!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Grazie per esserti iscritto alla newsletter di FishandTips! 
            Riceverai presto i nostri consigli esclusivi sulla pesca sportiva.
          </p>

          {/* Benefits */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-primary-900 mb-4">
              Cosa riceverai:
            </h3>
            <ul className="space-y-2 text-sm text-primary-700">
              <li className="flex items-center">
                <span className="mr-2">🎣</span>
                Tecniche esclusive di pesca
              </li>
              <li className="flex items-center">
                <span className="mr-2">📅</span>
                Consigli settimanali
              </li>
              <li className="flex items-center">
                <span className="mr-2">🎁</span>
                Contenuti sempre gratuiti
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full">
                Torna alla Home
              </Button>
            </Link>
            
            <Link href="/articoli">
              <Button variant="outline" size="lg" className="w-full">
                Esplora gli Articoli
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-8">
            Puoi disiscriverti in qualsiasi momento cliccando sul link presente nelle email.
          </p>
        </div>
      </div>
    </div>
  );
}
