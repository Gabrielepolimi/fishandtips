'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/ui/Button';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) return;
    
    setIsUnsubscribing(true);
    setError('');
    
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la disiscrizione');
      }
      
      setIsUnsubscribed(true);
    } catch (error: any) {
      setError(error.message || 'Errore durante la disiscrizione');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  useEffect(() => {
    if (email) {
      handleUnsubscribe();
    }
  }, [email]);

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Link Non Valido
            </h1>
            <p className="text-gray-600 mb-8">
              Il link di disiscrizione non è valido o è scaduto.
            </p>
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full">
                Torna alla Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Disiscrizione Completata
            </h1>
            <p className="text-gray-600 mb-8">
              L'email <strong>{email}</strong> è stata rimossa dalla nostra newsletter.
            </p>
            <div className="space-y-4">
              <Link href="/">
                <Button variant="primary" size="lg" className="w-full">
                  Torna alla Home
                </Button>
              </Link>
              <Link href="/newsletter/conferma">
                <Button variant="outline" size="lg" className="w-full">
                  Risottoscrivi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Conferma Disiscrizione
          </h1>
          <p className="text-gray-600 mb-8">
            Stai per disiscrivere l'email <strong>{email}</strong> dalla nostra newsletter.
          </p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleUnsubscribe}
              disabled={isUnsubscribing}
              className="w-full"
            >
              {isUnsubscribing ? 'Disiscrivendo...' : 'Conferma Disiscrizione'}
            </Button>
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full">
                Annulla
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento...</p>
          </div>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
